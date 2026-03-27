"""
Sri by Mahakali Tribunal - Backend API Tests
Tests for: Auth, Email Verification, Payments, Theses, Companies, Dashboards
"""
import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials from requirements
INVESTOR_EMAIL = "investor@sri.com"
INVESTOR_PASSWORD = "password123"
FOUNDER_EMAIL = "founder@sri.com"
FOUNDER_PASSWORD = "password123"
BOTH_EMAIL = "both@sri.com"
BOTH_PASSWORD = "password123"


class TestHealthAndConfig:
    """Basic health and configuration tests"""
    
    def test_payment_config_returns_disabled(self):
        """Payment config should return enabled=false when no keys configured"""
        response = requests.get(f"{BASE_URL}/api/payments/config")
        assert response.status_code == 200
        data = response.json()
        assert "enabled" in data
        # Since no Razorpay keys are configured, should be disabled
        assert data["enabled"] == False
        print(f"✅ Payment config: enabled={data['enabled']}")


class TestAuthFlow:
    """Authentication flow tests"""
    
    def test_login_investor_account(self):
        """Test login with investor credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": INVESTOR_EMAIL,
            "password": INVESTOR_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == INVESTOR_EMAIL
        assert data["user"]["role"] == "investor"
        print(f"✅ Investor login successful: {data['user']['email']}")
        return data["access_token"]
    
    def test_login_founder_account(self):
        """Test login with founder/business credentials"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": FOUNDER_EMAIL,
            "password": FOUNDER_PASSWORD
        })
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        assert "access_token" in data
        assert "user" in data
        assert data["user"]["email"] == FOUNDER_EMAIL
        assert data["user"]["role"] == "business"
        print(f"✅ Founder login successful: {data['user']['email']}")
        return data["access_token"]
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials returns 401"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "invalid@test.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print("✅ Invalid credentials correctly rejected")


class TestEmailVerification:
    """Email verification system tests"""
    
    def test_signup_creates_unverified_user(self):
        """POST /api/auth/signup should create user with email_verified=false"""
        unique_email = f"test_signup_{uuid.uuid4().hex[:8]}@test.com"
        response = requests.post(f"{BASE_URL}/api/auth/signup", json={
            "email": unique_email,
            "password": "testpass123",
            "full_name": "Test User",
            "role": "investor",
            "country": "US"
        })
        assert response.status_code == 200, f"Signup failed: {response.text}"
        data = response.json()
        assert "user" in data
        assert data["user"]["email_verified"] == False
        print(f"✅ Signup creates unverified user: email_verified={data['user']['email_verified']}")
    
    def test_verify_email_invalid_token(self):
        """GET /api/auth/verify-email/{token} with invalid token returns 400"""
        response = requests.get(f"{BASE_URL}/api/auth/verify-email/invalid_token_123")
        assert response.status_code == 400
        print("✅ Invalid verification token correctly rejected")


class TestThesesAPI:
    """Investment Thesis API tests"""
    
    def test_list_theses_public(self):
        """GET /api/theses should return list of theses"""
        response = requests.get(f"{BASE_URL}/api/theses")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Theses list returned: {len(data)} theses")
    
    def test_thesis_model_has_video_and_pitch_deck_fields(self):
        """Verify thesis model supports video_url and pitch_deck_url"""
        # Login as founder
        login_resp = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": FOUNDER_EMAIL,
            "password": FOUNDER_PASSWORD
        })
        assert login_resp.status_code == 200
        token = login_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Get companies
        companies_resp = requests.get(f"{BASE_URL}/api/companies/my", headers=headers)
        if companies_resp.status_code == 200 and len(companies_resp.json()) > 0:
            company_id = companies_resp.json()[0]["id"]
            
            # Create thesis with video_url and pitch_deck_url
            thesis_data = {
                "company_id": company_id,
                "title": f"Test Thesis {uuid.uuid4().hex[:8]}",
                "overview": "Test overview",
                "thesis_content": "Test content",
                "risks": "Test risks",
                "safe_structure": {"valuation_cap": "$10M"},
                "status": "draft",
                "industry": "Technology",
                "geography": "Global",
                "stage": "Seed",
                "video_url": "https://youtube.com/watch?v=test123",
                "pitch_deck_url": "https://drive.google.com/file/d/test123"
            }
            
            response = requests.post(f"{BASE_URL}/api/theses", json=thesis_data, headers=headers)
            assert response.status_code == 200, f"Thesis creation failed: {response.text}"
            data = response.json()
            assert data.get("video_url") == "https://youtube.com/watch?v=test123"
            assert data.get("pitch_deck_url") == "https://drive.google.com/file/d/test123"
            print(f"✅ Thesis created with video_url and pitch_deck_url")
        else:
            print("⚠️ No companies found for founder, skipping thesis creation test")


class TestDashboards:
    """Dashboard API tests"""
    
    def test_investor_dashboard(self):
        """GET /api/dashboard/investor returns stats"""
        login_resp = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": INVESTOR_EMAIL,
            "password": INVESTOR_PASSWORD
        })
        assert login_resp.status_code == 200
        token = login_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(f"{BASE_URL}/api/dashboard/investor", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "total_invested" in data
        assert "active_investments" in data
        assert "recurring_count" in data
        print(f"✅ Investor dashboard: total_invested=${data['total_invested']}")
    
    def test_business_dashboard(self):
        """GET /api/dashboard/business returns stats"""
        login_resp = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": FOUNDER_EMAIL,
            "password": FOUNDER_PASSWORD
        })
        assert login_resp.status_code == 200
        token = login_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(f"{BASE_URL}/api/dashboard/business", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert "capital_raised" in data
        assert "active_investors" in data
        assert "active_theses" in data
        print(f"✅ Business dashboard: capital_raised=${data['capital_raised']}")


class TestCompaniesAPI:
    """Company API tests"""
    
    def test_list_my_companies(self):
        """GET /api/companies/my returns founder's companies"""
        login_resp = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": FOUNDER_EMAIL,
            "password": FOUNDER_PASSWORD
        })
        assert login_resp.status_code == 200
        token = login_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(f"{BASE_URL}/api/companies/my", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Founder companies: {len(data)} companies")


class TestPaymentsAPI:
    """Payment API tests (Razorpay disabled mode)"""
    
    def test_create_order_fails_when_disabled(self):
        """POST /api/payments/create-order should fail when Razorpay not configured"""
        login_resp = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": INVESTOR_EMAIL,
            "password": INVESTOR_PASSWORD
        })
        assert login_resp.status_code == 200
        token = login_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.post(
            f"{BASE_URL}/api/payments/create-order?amount=10000&purpose=investment",
            headers=headers
        )
        # Should return 503 when Razorpay not configured
        assert response.status_code == 503
        print("✅ Payment order creation correctly returns 503 when disabled")


class TestNotifications:
    """Notification API tests"""
    
    def test_get_my_notifications(self):
        """GET /api/notifications/my returns user notifications"""
        login_resp = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": INVESTOR_EMAIL,
            "password": INVESTOR_PASSWORD
        })
        assert login_resp.status_code == 200
        token = login_resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.get(f"{BASE_URL}/api/notifications/my", headers=headers)
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✅ Notifications: {len(data)} notifications")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
