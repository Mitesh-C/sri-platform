import requests
import sys
from datetime import datetime
import json

class SriBackendTester:
    def __init__(self, base_url="https://long-term-owned.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.user_data = {}

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return success, response.json() if response.content else {}
                except:
                    return success, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json() if response.content else {}
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Raw response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test if backend is responsive"""
        success, response = self.run_test(
            "Health Check",
            "GET", 
            "theses",
            200
        )
        return success

    def test_login(self, email, password):
        """Test login and get token"""
        success, response = self.run_test(
            f"Login - {email}",
            "POST",
            "auth/login",
            200,
            data={"email": email, "password": password}
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_data = response.get('user', {})
            print(f"   User role: {self.user_data.get('role')}")
            return True
        return False

    def test_signup(self, email, password, full_name, role, country="US"):
        """Test signup"""
        success, response = self.run_test(
            f"Signup - {email}",
            "POST",
            "auth/signup", 
            200,
            data={
                "email": email,
                "password": password,
                "full_name": full_name,
                "role": role,
                "country": country
            }
        )
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_data = response.get('user', {})
            return True
        return False

    def test_get_me(self):
        """Test get current user"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        return success, response

    def test_list_theses(self):
        """Test list investment theses"""
        success, response = self.run_test(
            "List Investment Theses",
            "GET",
            "theses",
            200
        )
        return success, response

    def test_get_thesis(self, thesis_id):
        """Test get specific thesis"""
        success, response = self.run_test(
            f"Get Thesis {thesis_id}",
            "GET",
            f"theses/{thesis_id}",
            200
        )
        return success, response

    def test_create_investment(self, thesis_id, amount):
        """Test create investment"""
        success, response = self.run_test(
            f"Create Investment - ${amount}",
            "POST",
            "investments",
            200,
            data={
                "thesis_id": thesis_id,
                "amount": amount,
                "investment_type": "one_time",
                "acknowledged_risks": True
            }
        )
        return success, response

    def test_create_recurring_investment(self, thesis_id, amount, frequency="monthly"):
        """Test create recurring investment"""
        success, response = self.run_test(
            f"Create Recurring Investment - ${amount} {frequency}",
            "POST", 
            "recurring-investments",
            200,
            data={
                "thesis_id": thesis_id,
                "amount": amount,
                "frequency": frequency
            }
        )
        return success, response

    def test_my_investments(self):
        """Test get user's investments"""
        success, response = self.run_test(
            "Get My Investments",
            "GET",
            "investments/my",
            200
        )
        return success, response

    def test_my_recurring_investments(self):
        """Test get user's recurring investments"""
        success, response = self.run_test(
            "Get My Recurring Investments", 
            "GET",
            "recurring-investments/my",
            200
        )
        return success, response

    def test_investor_dashboard(self):
        """Test investor dashboard"""
        success, response = self.run_test(
            "Investor Dashboard",
            "GET",
            "dashboard/investor",
            200
        )
        return success, response

    def test_business_dashboard(self):
        """Test business dashboard"""
        success, response = self.run_test(
            "Business Dashboard",
            "GET", 
            "dashboard/business",
            200
        )
        return success, response

    def test_create_bank_account(self):
        """Test create bank account"""
        success, response = self.run_test(
            "Create Bank Account",
            "POST",
            "bank-accounts",
            200,
            data={
                "country": "US",
                "bank_name": "Test Bank",
                "account_holder": "Test User", 
                "account_number": "1234567890",
                "routing_code": "123456789"
            }
        )
        return success, response

    def test_my_bank_accounts(self):
        """Test get user's bank accounts"""
        success, response = self.run_test(
            "Get My Bank Accounts",
            "GET",
            "bank-accounts/my", 
            200
        )
        return success, response

    def test_governance_alerts(self):
        """Test governance alerts"""
        success, response = self.run_test(
            "Governance Alerts",
            "GET",
            "governance/alerts",
            200
        )
        return success, response

def main():
    print("🚀 Starting Sri Backend API Tests")
    print("=" * 60)
    
    tester = SriBackendTester()
    
    # Test 1: Health Check
    if not tester.test_health_check():
        print("❌ Backend is not responding, stopping tests")
        return 1

    # Test 2: Login with existing test accounts
    print("\n📝 Testing Authentication...")
    
    # Test investor login
    investor_login = tester.test_login("investor@sri.com", "password123")
    if investor_login:
        print("✅ Investor login successful")
        
        # Test investor-specific endpoints
        print("\n💰 Testing Investor Features...")
        tester.test_get_me()
        tester.test_investor_dashboard()
        
        # Test theses
        success, theses = tester.test_list_theses()
        if success and theses:
            thesis_id = theses[0]['id'] if theses else None
            if thesis_id:
                tester.test_get_thesis(thesis_id)
                tester.test_create_investment(thesis_id, 1000)
                tester.test_create_recurring_investment(thesis_id, 500)
        
        tester.test_my_investments() 
        tester.test_my_recurring_investments()
        tester.test_create_bank_account()
        tester.test_my_bank_accounts()
        
    else:
        print("❌ Investor login failed")

    # Reset and test founder login
    tester.token = None
    founder_login = tester.test_login("founder@sri.com", "password123")
    if founder_login:
        print("✅ Founder login successful")
        
        # Test business-specific endpoints
        print("\n🏢 Testing Business Features...")
        tester.test_business_dashboard()
        
    else:
        print("❌ Founder login failed")

    # Test public endpoints without auth
    print("\n🌐 Testing Public Endpoints...")
    tester.token = None
    tester.test_list_theses()
    tester.test_governance_alerts()

    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())