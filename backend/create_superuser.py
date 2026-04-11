import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cms.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Get admin credentials from environment variables
# Set ADMIN_PASSWORD in Railway environment variables for production
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_EMAIL = os.environ.get('ADMIN_EMAIL', 'admin@example.com')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD')

if not ADMIN_PASSWORD:
    print("⚠️  Warning: ADMIN_PASSWORD not set in environment variables")
    print("   Set it in Railway dashboard: Settings > Variables > New Variable")
    print("   Variable name: ADMIN_PASSWORD")
    print("   Variable value: <your-secure-password>")
    print("\n   For local development only, you can use a fallback (not recommended for production)")
    ADMIN_PASSWORD = 'admin123'  # Fallback for local dev only

if not User.objects.filter(username=ADMIN_USERNAME).exists():
    User.objects.create_superuser(ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD)
    print(f"✓ Superuser '{ADMIN_USERNAME}' created successfully!")
    print(f"  Username: {ADMIN_USERNAME}")
    print(f"  Email: {ADMIN_EMAIL}")
else:
    print(f"✓ Superuser '{ADMIN_USERNAME}' already exists")
