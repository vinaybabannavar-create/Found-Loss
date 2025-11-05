#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime
import uuid

class FoundLossAPITester:
    def __init__(self, base_url="https://itemfinder-6.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []
        self.created_items = []

    def log_result(self, test_name, success, details="", error=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
        
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "error": error,
            "timestamp": datetime.now().isoformat()
        }
        self.test_results.append(result)
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}")
        if details:
            print(f"    Details: {details}")
        if error:
            print(f"    Error: {error}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                try:
                    response_data = response.json()
                    details = f"Status: {response.status_code}"
                    self.log_result(name, True, details)
                    return True, response_data
                except:
                    details = f"Status: {response.status_code} (No JSON response)"
                    self.log_result(name, True, details)
                    return True, {}
            else:
                try:
                    error_data = response.json()
                    error_msg = error_data.get('detail', f'HTTP {response.status_code}')
                except:
                    error_msg = f'HTTP {response.status_code}'
                
                self.log_result(name, False, f"Expected {expected_status}, got {response.status_code}", error_msg)
                return False, {}

        except requests.exceptions.RequestException as e:
            self.log_result(name, False, "", f"Request failed: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        return self.run_test("Health Check", "GET", "health", 200)

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root Endpoint", "GET", "", 200)

    def test_user_registration(self):
        """Test user registration"""
        # Generate unique test user data
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        test_user = {
            "full_name": f"Test User {timestamp}",
            "email": f"test_{timestamp}@foundloss.com",
            "phone": f"+1555{timestamp[-6:]}",
            "password": "TestPass123!"
        }
        
        success, response = self.run_test("User Registration", "POST", "auth/register", 200, test_user)
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
            return True, response
        
        return success, response

    def test_user_login(self):
        """Test user login with existing credentials"""
        if not hasattr(self, 'test_email'):
            # Use demo credentials if available
            login_data = {
                "email": "demo@foundloss.com",
                "password": "demo123"
            }
        else:
            login_data = {
                "email": self.test_email,
                "password": "TestPass123!"
            }
        
        success, response = self.run_test("User Login", "POST", "auth/login", 200, login_data)
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_id = response['user']['id']
        
        return success, response

    def test_get_current_user(self):
        """Test getting current user info"""
        if not self.token:
            self.log_result("Get Current User", False, "", "No authentication token available")
            return False, {}
        
        return self.run_test("Get Current User", "GET", "auth/me", 200)

    def test_create_found_item(self):
        """Test creating a found item"""
        if not self.token:
            self.log_result("Create Found Item", False, "", "No authentication token available")
            return False, {}
        
        found_item = {
            "type": "found",
            "title": "Black iPhone 13 with Blue Case",
            "description": "Found this iPhone near the coffee shop on Main Street. Has a blue protective case and screen protector.",
            "category": "Electronics",
            "color": "Black",
            "location": "Main Street Coffee Shop, Downtown",
            "latitude": 40.7128,
            "longitude": -74.0060,
            "contact_email": "finder@example.com",
            "contact_phone": "+1-555-0123",
            "image_url": "https://example.com/phone.jpg"
        }
        
        success, response = self.run_test("Create Found Item", "POST", "items", 200, found_item)
        
        if success and 'id' in response:
            self.created_items.append(response['id'])
        
        return success, response

    def test_create_lost_item(self):
        """Test creating a lost item"""
        if not self.token:
            self.log_result("Create Lost Item", False, "", "No authentication token available")
            return False, {}
        
        lost_item = {
            "type": "lost",
            "title": "Silver MacBook Pro 13-inch",
            "description": "Lost my MacBook Pro at the university library. Has several stickers on the back including a Python logo.",
            "category": "Electronics",
            "color": "Silver",
            "location": "University Library, 2nd Floor",
            "latitude": 40.7589,
            "longitude": -73.9851,
            "contact_email": "owner@example.com",
            "contact_phone": "+1-555-0456"
        }
        
        success, response = self.run_test("Create Lost Item", "POST", "items", 200, lost_item)
        
        if success and 'id' in response:
            self.created_items.append(response['id'])
        
        return success, response

    def test_get_all_items(self):
        """Test getting all items"""
        return self.run_test("Get All Items", "GET", "items", 200)

    def test_get_found_items(self):
        """Test getting found items only"""
        return self.run_test("Get Found Items", "GET", "items?type=found", 200)

    def test_get_lost_items(self):
        """Test getting lost items only"""
        return self.run_test("Get Lost Items", "GET", "items?type=lost", 200)

    def test_get_items_by_category(self):
        """Test getting items by category"""
        return self.run_test("Get Items by Category", "GET", "items?category=Electronics", 200)

    def test_get_specific_item(self):
        """Test getting a specific item by ID"""
        if not self.created_items:
            self.log_result("Get Specific Item", False, "", "No items created to test with")
            return False, {}
        
        item_id = self.created_items[0]
        return self.run_test("Get Specific Item", "GET", f"items/{item_id}", 200)

    def test_get_my_items(self):
        """Test getting current user's items"""
        if not self.token:
            self.log_result("Get My Items", False, "", "No authentication token available")
            return False, {}
        
        return self.run_test("Get My Items", "GET", "my-items", 200)

    def test_contact_owner(self):
        """Test contacting item owner"""
        if not self.created_items:
            self.log_result("Contact Owner", False, "", "No items created to test with")
            return False, {}
        
        contact_data = {
            "item_id": self.created_items[0],
            "contact_method": "email",
            "message": "Hi! I believe this item might be mine. Could we arrange to meet?"
        }
        
        return self.run_test("Contact Owner", "POST", "contact-owner", 200, contact_data)

    def test_update_item_status(self):
        """Test updating item status"""
        if not self.token or not self.created_items:
            self.log_result("Update Item Status", False, "", "No authentication token or items available")
            return False, {}
        
        item_id = self.created_items[0]
        status_data = {"status": "resolved"}
        
        return self.run_test("Update Item Status", "PUT", f"items/{item_id}/status?status=resolved", 200, status_data)

    def test_invalid_endpoints(self):
        """Test invalid endpoints return proper errors"""
        # Test non-existent item
        success, _ = self.run_test("Get Non-existent Item", "GET", "items/invalid-id", 404)
        
        # Test unauthorized access
        old_token = self.token
        self.token = None
        success2, _ = self.run_test("Unauthorized Access to My Items", "GET", "my-items", 401)
        self.token = old_token
        
        return success and success2

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Found & Loss API Tests")
        print("=" * 50)
        
        # Basic connectivity tests
        self.test_health_check()
        self.test_root_endpoint()
        
        # Authentication tests
        reg_success, reg_data = self.test_user_registration()
        if reg_success:
            self.test_email = reg_data['user']['email']
        
        # If registration failed, try login with demo account
        if not self.token:
            self.test_user_login()
        
        self.test_get_current_user()
        
        # Item management tests
        self.test_create_found_item()
        self.test_create_lost_item()
        self.test_get_all_items()
        self.test_get_found_items()
        self.test_get_lost_items()
        self.test_get_items_by_category()
        self.test_get_specific_item()
        self.test_get_my_items()
        
        # Interaction tests
        self.test_contact_owner()
        self.test_update_item_status()
        
        # Error handling tests
        self.test_invalid_endpoints()
        
        # Print summary
        print("\n" + "=" * 50)
        print(f"📊 Test Summary: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return 1

    def get_test_report(self):
        """Get detailed test report"""
        return {
            "summary": {
                "total_tests": self.tests_run,
                "passed_tests": self.tests_passed,
                "failed_tests": self.tests_run - self.tests_passed,
                "success_rate": (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
            },
            "results": self.test_results,
            "created_items": self.created_items
        }

def main():
    """Main test execution"""
    tester = FoundLossAPITester()
    exit_code = tester.run_all_tests()
    
    # Save detailed report
    report = tester.get_test_report()
    with open('/app/backend_test_report.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"\n📄 Detailed report saved to: /app/backend_test_report.json")
    return exit_code

if __name__ == "__main__":
    sys.exit(main())