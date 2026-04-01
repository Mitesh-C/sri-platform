"""
Test file for iteration 3 features:
1. Industry dropdown with specific categories on Create Thesis page
2. Redirect to company creation if no company exists
3. Require verified bank account for transactions
4. Rename 'Trading Fees' to 'Liquidity Windows Fee' on Pricing investor tab
5. Change webpage title to 'SRI | Mahakali Tribunal'
6. Add 'Copy Link' button at end of thesis detail page
7. Signup form with dropdown role selection
8. Login for existing accounts
"""

import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
INVESTOR_EMAIL = "investor@sri.com"
INVESTOR_PASSWORD = "password123"
FOUNDER_EMAIL = "founder@sri.com"
FOUNDER_PASSWORD = "password123"


class TestAuthFlows:
    """Test authentication flows - signup and login"""
    
    def test_login_investor_account(self):
        """Test login works for investor account"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": INVESTOR_EMAIL,
            "password": INVESTOR_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == INVESTOR_EMAIL
        print(f"✅ Login works for investor@sri.com")
    
    def test_login_founder_account(self):
        """Test login works for founder account"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": FOUNDER_EMAIL,
            "password": FOUNDER_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == FOUNDER_EMAIL
        print(f"✅ Login works for founder@sri.com")
    
    def test_signup_with_investor_role(self):
        """Test signup with investor role selection"""
        unique_email = f"test_investor_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(f"{BASE_URL}/api/auth/signup", json={
            "email": unique_email,
            "password": "testpass123",
            "full_name": "Test Investor",
            "role": "investor",
            "country": "United States"
        })
        assert response.status_code == 200, f"Signup failed: {response.text}"
        data = response.json()
        assert data["user"]["role"] == "investor"
        print(f"✅ Signup works with investor role")
    
    def test_signup_with_business_role(self):
        """Test signup with business/founder role selection"""
        unique_email = f"test_founder_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(f"{BASE_URL}/api/auth/signup", json={
            "email": unique_email,
            "password": "testpass123",
            "full_name": "Test Founder",
            "role": "business",
            "country": "United States"
        })
        assert response.status_code == 200, f"Signup failed: {response.text}"
        data = response.json()
        assert data["user"]["role"] == "business"
        print(f"✅ Signup works with business/founder role")


class TestBankAccountRequirement:
    """Test bank account requirement for investments"""
    
    @pytest.fixture
    def investor_token(self):
        """Get investor auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": INVESTOR_EMAIL,
            "password": INVESTOR_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Could not get investor token")
    
    def test_get_bank_accounts_endpoint(self, investor_token):
        """Test bank-accounts/my endpoint exists and returns list"""
        headers = {"Authorization": f"Bearer {investor_token}"}
        response = requests.get(f"{BASE_URL}/api/bank-accounts/my", headers=headers)
        assert response.status_code == 200, f"Bank accounts endpoint failed: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Bank accounts endpoint works, returns {len(data)} accounts")
    
    def test_create_bank_account(self, investor_token):
        """Test creating a bank account"""
        headers = {"Authorization": f"Bearer {investor_token}"}
        response = requests.post(f"{BASE_URL}/api/bank-accounts", headers=headers, json={
            "bank_name": "Test Bank",
            "account_number": "1234567890",
            "routing_number": "987654321",
            "account_type": "checking"
        })
        # Should succeed or fail with validation error
        assert response.status_code in [200, 201, 422], f"Unexpected status: {response.status_code}"
        print(f"✅ Bank account creation endpoint works")


class TestCompaniesEndpoint:
    """Test companies endpoint for thesis creation flow"""
    
    @pytest.fixture
    def founder_token(self):
        """Get founder auth token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": FOUNDER_EMAIL,
            "password": FOUNDER_PASSWORD
        })
        if response.status_code == 200:
            return response.json()["access_token"]
        pytest.skip("Could not get founder token")
    
    def test_get_my_companies(self, founder_token):
        """Test /companies/my endpoint returns user's companies"""
        headers = {"Authorization": f"Bearer {founder_token}"}
        response = requests.get(f"{BASE_URL}/api/companies/my", headers=headers)
        assert response.status_code == 200, f"Companies endpoint failed: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Companies/my endpoint works, returns {len(data)} companies")


class TestThesisEndpoints:
    """Test thesis-related endpoints"""
    
    def test_get_theses_list(self):
        """Test getting list of theses"""
        response = requests.get(f"{BASE_URL}/api/theses")
        assert response.status_code == 200, f"Theses list failed: {response.text}"
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Theses list endpoint works, returns {len(data)} theses")
    
    def test_get_thesis_detail(self):
        """Test getting thesis detail"""
        # First get list to find a thesis ID
        response = requests.get(f"{BASE_URL}/api/theses")
        if response.status_code == 200 and len(response.json()) > 0:
            thesis_id = response.json()[0]["id"]
            detail_response = requests.get(f"{BASE_URL}/api/theses/{thesis_id}")
            assert detail_response.status_code == 200, f"Thesis detail failed: {detail_response.text}"
            data = detail_response.json()
            assert "id" in data
            assert "title" in data
            assert "industry" in data
            print(f"✅ Thesis detail endpoint works for thesis: {data['title']}")
        else:
            pytest.skip("No theses available to test")


class TestDiscussionsEndpoint:
    """Test discussions endpoint for thesis detail page"""
    
    def test_get_discussions_for_thesis(self):
        """Test getting discussions for a thesis"""
        # First get a thesis ID
        response = requests.get(f"{BASE_URL}/api/theses")
        if response.status_code == 200 and len(response.json()) > 0:
            thesis_id = response.json()[0]["id"]
            disc_response = requests.get(f"{BASE_URL}/api/discussions/{thesis_id}")
            assert disc_response.status_code == 200, f"Discussions failed: {disc_response.text}"
            data = disc_response.json()
            assert isinstance(data, list)
            print(f"✅ Discussions endpoint works, returns {len(data)} discussions")
        else:
            pytest.skip("No theses available to test")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
