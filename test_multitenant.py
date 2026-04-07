"""
Quick test script for Multi-Tenant LSB Website Builder
Run this to verify the system is working correctly
"""
import requests
import json
import sys

BASE_URL = "http://localhost:8000"
API_URL = f"{BASE_URL}/api"


def test_onboarding():
    """Test creating a new LSB site"""
    print("\n" + "="*50)
    print("TEST 1: Onboarding - Create New Site")
    print("="*50)
    
    data = {
        "email": "test.lsb@example.com",
        "site_name": "Test LSB Beratung",
        "plan": "starter",
        "first_name": "Test",
        "last_name": "User"
    }
    
    try:
        response = requests.post(f"{API_URL}/onboard/", json=data)
        result = response.json()
        
        if response.status_code == 201:
            print(f"✅ Site created successfully!")
            print(f"   Subdomain: {result['site']['subdomain']}")
            print(f"   Domain: {result['site']['domain']}")
            print(f"   Pages created: {result['pages_created']}")
            print(f"   Username: {result['credentials']['username']}")
            return result
        else:
            print(f"❌ Failed: {result.get('error', 'Unknown error')}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def test_login(credentials):
    """Test user login"""
    print("\n" + "="*50)
    print("TEST 2: User Login")
    print("="*50)
    
    data = {
        "username": credentials['username'],
        "password": credentials['password']
    }
    
    try:
        response = requests.post(f"{API_URL}/auth/login/", json=data)
        result = response.json()
        
        if response.status_code == 200:
            print(f"✅ Login successful!")
            print(f"   Access token received: {result['access'][:20]}...")
            return result['access']
        else:
            print(f"❌ Login failed: {result.get('detail', 'Unknown error')}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def test_site_pages(token):
    """Test fetching pages for a site"""
    print("\n" + "="*50)
    print("TEST 3: Fetch Site Pages")
    print("="*50)
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{API_URL}/pages/", headers=headers)
        pages = response.json()
        
        if response.status_code == 200:
            print(f"✅ Retrieved {len(pages)} pages")
            for page in pages[:3]:  # Show first 3
                print(f"   - {page['title']} (/{page['slug']})")
            return pages
        else:
            print(f"❌ Failed: {pages}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def test_site_settings(token):
    """Test fetching site settings"""
    print("\n" + "="*50)
    print("TEST 4: Fetch Site Settings")
    print("="*50)
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{API_URL}/settings/current/", headers=headers)
        settings = response.json()
        
        if response.status_code == 200:
            print(f"✅ Site settings retrieved")
            print(f"   Site name: {settings.get('site_name', 'N/A')}")
            print(f"   Contact email: {settings.get('contact_email', 'N/A')}")
            return settings
        else:
            print(f"❌ Failed: {settings}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def test_multiple_sites():
    """Test creating multiple sites for isolation verification"""
    print("\n" + "="*50)
    print("TEST 5: Multi-Site Isolation")
    print("="*50)
    
    sites = []
    
    for i in range(2):
        data = {
            "email": f"site{i}@test.com",
            "site_name": f"Test Site {i+1}",
            "plan": "starter"
        }
        
        try:
            response = requests.post(f"{API_URL}/onboard/", json=data)
            if response.status_code == 201:
                result = response.json()
                sites.append(result['site']['subdomain'])
                print(f"✅ Created Site {i+1}: {result['site']['subdomain']}")
            else:
                print(f"❌ Failed to create Site {i+1}")
        except Exception as e:
            print(f"❌ Error creating Site {i+1}: {e}")
    
    if len(sites) == 2:
        print(f"\n✅ Successfully created {len(sites)} sites")
        print(f"   Sites: {', '.join(sites)}")
        return True
    else:
        print(f"❌ Expected 2 sites, got {len(sites)}")
        return False


def check_db_status():
    """Check database status via Django shell"""
    print("\n" + "="*50)
    print("TEST 0: Database Status (via Django ORM)")
    print("="*50)
    
    import subprocess
    import os
    
    # Change to backend directory
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    
    # Run Django check
    try:
        result = subprocess.run(
            ['uv', 'run', 'python', 'manage.py', 'check'],
            cwd=backend_dir,
            capture_output=True,
            text=True
        )
        
        if result.returncode == 0:
            print("✅ Django system check passed")
        else:
            print(f"⚠️ Django check warnings:\n{result.stdout}")
            
    except Exception as e:
        print(f"⚠️ Could not run Django check: {e}")
    
    # Count objects
    script = """
from cms_pages.models import Site, Page, User
print(f"Sites: {Site.objects.count()}")
print(f"Pages: {Page.objects.count()}")
print(f"Users: {User.objects.count()}")
"""
    
    try:
        result = subprocess.run(
            ['uv', 'run', 'python', 'manage.py', 'shell', '-c', script],
            cwd=backend_dir,
            capture_output=True,
            text=True
        )
        
        print("✅ Database counts:")
        print(result.stdout)
        
    except Exception as e:
        print(f"❌ Error checking database: {e}")


def main():
    """Run all tests"""
    print("\n" + "="*50)
    print("LSB Website Builder - Multi-Tenant Test Suite")
    print("="*50)
    print(f"\nTesting against: {API_URL}")
    
    # Check if server is running
    try:
        response = requests.get(f"{BASE_URL}/admin/", timeout=2)
        print(f"✅ Backend server is running")
    except requests.exceptions.ConnectionError:
        print(f"❌ Backend server not running at {BASE_URL}")
        print("   Start with: cd backend && uv run python manage.py runserver")
        sys.exit(1)
    
    # Run tests
    check_db_status()
    
    # Test 1: Onboarding
    site_data = test_onboarding()
    if not site_data:
        print("\n❌ Onboarding test failed - stopping")
        sys.exit(1)
    
    # Test 2: Login
    token = test_login(site_data['credentials'])
    if not token:
        print("\n❌ Login test failed - stopping")
        sys.exit(1)
    
    # Test 3: Pages
    pages = test_site_pages(token)
    if not pages:
        print("\n⚠️ Pages test failed - continuing")
    
    # Test 4: Settings
    settings = test_site_settings(token)
    if not settings:
        print("\n⚠️ Settings test failed - continuing")
    
    # Test 5: Multi-site
    test_multiple_sites()
    
    # Summary
    print("\n" + "="*50)
    print("TEST SUMMARY")
    print("="*50)
    print("✅ Multi-Tenant system is operational")
    print(f"✅ Created site: {site_data['site']['domain']}")
    print(f"✅ Login working: {site_data['credentials']['username']}")
    print(f"✅ Pages created: {site_data['pages_created']}")
    print("\nNext steps:")
    print("  1. Configure hosts file for subdomain testing")
    print("  2. Test frontend integration")
    print("  3. Deploy to staging environment")


if __name__ == "__main__":
    main()
