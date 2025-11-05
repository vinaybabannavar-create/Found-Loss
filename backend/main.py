from fastapi import FastAPI
from contextlib import asynccontextmanager
import uvicorn

# 1. Define the lifespan function using @asynccontextmanager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Application Startup Code ---
    # Put code here that needs to run when the application starts (e.g., database connections)
    print("Application Startup: Resources are being prepared...")
    
    yield # Application can now start serving requests
    
    # --- Application Shutdown Code ---
    # Put code here that needs to run when the application shuts down (e.g., closing connections)
    print("Application Shutdown: Resources are being cleaned up...")

# 2. Create the FastAPI application instance
# The 'lifespan' function is now defined and correctly used here.
app = FastAPI(lifespan=lifespan) 

# 3. Define a simple test route (optional, but good for verification)
@app.get("/")
async def read_root():
    return {"message": "FastAPI App is running!"}

# You don't need to run this block if you are using uvicorn from the command line:
# if __name__ == "__main__":
#     uvicorn.run(app, host="127.0