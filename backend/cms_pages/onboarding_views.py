"""
Onboarding API Views for LSB Website Builder
Self-service site creation endpoint
"""
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .services.onboarding import create_lsb_site


@api_view(['POST'])
@permission_classes([AllowAny])
def onboarding_view(request):
    """
    Create a new LSB website
    
    POST /api/onboard/
    {
        "email": "user@example.com",
        "site_name": "Max Mustermann Beratung",
        "plan": "starter",  // starter, pro, premium
        "first_name": "Max",
        "last_name": "Mustermann"
    }
    
    Response:
    {
        "success": true,
        "site": {
            "id": 1,
            "subdomain": "max-mustermann",
            "domain": "max-mustermann.lsbwebsites.at",
            "admin_url": "https://max-mustermann.lsbwebsites.at/admin",
            "site_url": "https://max-mustermann.lsbwebsites.at"
        },
        "credentials": {
            "username": "max",
            "password": "generated-password",
            "email": "user@example.com"
        },
        "pages_created": 8,
        "plan": "starter",
        "message": "Site created successfully. Check your email for login details."
    }
    """
    data = request.data
    
    # Validate required fields
    email = data.get('email')
    site_name = data.get('site_name')
    plan = data.get('plan', 'starter')
    first_name = data.get('first_name', '')
    last_name = data.get('last_name', '')
    
    if not email or not site_name:
        return Response(
            {'error': 'Email and site_name are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validate email format
    try:
        validate_email(email)
    except ValidationError:
        return Response(
            {'error': 'Invalid email format'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validate plan
    valid_plans = ['starter', 'pro', 'premium']
    if plan not in valid_plans:
        return Response(
            {'error': f'Invalid plan. Must be one of: {valid_plans}'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Create the site
        result = create_lsb_site(
            email=email,
            site_name=site_name,
            plan=plan,
            first_name=first_name,
            last_name=last_name,
        )
        
        return Response({
            'success': True,
            'site': result['site'],
            'credentials': {
                'username': result['credentials']['username'],
                'email': result['credentials']['email'],
                # Don't return password in production - send via email
                'password': result['credentials']['password'] if request.GET.get('debug') else '[SENT VIA EMAIL]',
            },
            'pages_created': result['pages_created'],
            'plan': result['plan'],
            'message': 'Site created successfully. Check your email for login details.',
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response(
            {'error': f'Failed to create site: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
