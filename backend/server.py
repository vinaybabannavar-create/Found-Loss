from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
from contextlib import asynccontextmanager
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext
import re

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# --- MongoDB Connection (Initialized later via lifespan) ---
client = None
db = None

# ------------------ LIFESPAN (replaces on_event) ------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    global client, db
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    print("✅ MongoDB connected")

    yield  # <-- App runs here

    client.close()
    print("🛑 MongoDB connection closed")

# ------------------ FastAPI App ------------------
app = FastAPI(lifespan=lifespan)

# Create router
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
SECRET_KEY = "your-secret-key-here-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# ------------------ MODELS ------------------
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    full_name: str
    phone: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    phone: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class Item(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    type: str
    title: str
    description: str
    category: str
    color: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    contact_email: EmailStr
    contact_phone: str
    image_url: Optional[str] = None
    status: str = "active"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class ItemCreate(BaseModel):
    type: str
    title: str
    description: str
    category: str
    color: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    contact_email: EmailStr
    contact_phone: str
    image_url: Optional[str] = None

class ContactOwner(BaseModel):
    item_id: str
    contact_method: str
    message: str

# ------------------ UTILS ------------------
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = await db.users.find_one({"id": user_id})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return User(**user)

# ------------------ ROUTES ------------------
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user_data.password)
    user_dict = user_data.dict()
    del user_dict["password"]
    user = User(**user_dict)
    
    user_doc = user.dict()
    user_doc["password"] = hashed_password
    await db.users.insert_one(user_doc)
    
    access_token = create_access_token(data={"sub": user.id})
    return Token(access_token=access_token, token_type="bearer", user=user)

@api_router.post("/auth/login", response_model=Token)
async def login(user_data: UserLogin):
    user = await db.users.find_one({"email": user_data.email})
    if not user or not verify_password(user_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_obj = User(**user)
    access_token = create_access_token(data={"sub": user_obj.id})
    return Token(access_token=access_token, token_type="bearer", user=user_obj)

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@api_router.post("/items", response_model=Item)
async def create_item(item_data: ItemCreate, current_user: User = Depends(get_current_user)):
    item_dict = item_data.dict()
    item_dict["user_id"] = current_user.id
    item = Item(**item_dict)
    
    await db.items.insert_one(item.dict())
    return item

@api_router.get("/items", response_model=List[Item])
async def get_items(type: Optional[str] = None, category: Optional[str] = None, skip: int = 0, limit: int = 50):
    filter_dict = {"status": "active"}
    if type:
        filter_dict["type"] = type
    if category:
        filter_dict["category"] = category
    
    items = await db.items.find(filter_dict).skip(skip).limit(limit).sort("created_at", -1).to_list(limit)
    return [Item(**item) for item in items]

@api_router.get("/items/{item_id}", response_model=Item)
async def get_item(item_id: str):
    item = await db.items.find_one({"id": item_id})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return Item(**item)

@api_router.get("/my-items", response_model=List[Item])
async def get_my_items(current_user: User = Depends(get_current_user)):
    items = await db.items.find({"user_id": current_user.id}).sort("created_at", -1).to_list(100)
    return [Item(**item) for item in items]

@api_router.post("/contact-owner")
async def contact_owner(contact_data: ContactOwner):
    item = await db.items.find_one({"id": contact_data.item_id})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return {
        "success": True,
        "message": "Contact request processed",
        "contact_info": {
            "email": item["contact_email"],
            "phone": item["contact_phone"],
            "method": contact_data.contact_method
        }
    }

@api_router.put("/items/{item_id}/status")
async def update_item_status(item_id: str, status: str, current_user: User = Depends(get_current_user)):
    item = await db.items.find_one({"id": item_id, "user_id": current_user.id})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found or not owned by you")
    await db.items.update_one({"id": item_id}, {"$set": {"status": status}})
    return {"success": True, "message": f"Item status updated to {status}"}

@api_router.get("/")
async def root():
    return {"message": "Found & Loss API v1.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc)}

# Include router
app.include_router(api_router)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
