"""
Stripe Integration for LSB Website Builder
Handles payment processing for subscriptions and one-time purchases
"""
import os
import stripe
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
import json

# Initialize Stripe with secret key
stripe.api_key = os.environ.get('STRIPE_SECRET_KEY', 'sk_test_placeholder')

# Product/Price mapping
PRICE_MAP = {
    'starter_monthly': {
        'name': 'LSB Starter - Monatlich',
        'amount': 2900,  # €29.00 in cents
        'interval': 'month',
    },
    'starter_onetime': {
        'name': 'LSB Starter - Einmalig',
        'amount': 89000,  # €890.00 in cents
        'interval': None,
    },
    'pro_monthly': {
        'name': 'LSB Pro - Monatlich',
        'amount': 4900,  # €49.00 in cents
        'interval': 'month',
    },
    'pro_onetime': {
        'name': 'LSB Pro - Einmalig',
        'amount': 149000,  # €1,490.00 in cents
        'interval': None,
    },
    'premium_monthly': {
        'name': 'LSB Premium - Monatlich',
        'amount': 7900,  # €79.00 in cents
        'interval': 'month',
    },
}


@api_view(['POST'])
@permission_classes([AllowAny])
def create_checkout_session(request):
    """
    Create a Stripe Checkout Session for LSB website purchase
    
    POST /api/stripe/create-checkout/
    {
        "email": "user@example.com",
        "site_name": "Max Mustermann Beratung",
        "plan": "starter",  // starter, pro, premium
        "billing_type": "monthly",  // monthly or onetime (default: monthly)
        "first_name": "Max",
        "last_name": "Mustermann"
    }
    
    Response:
    {
        "checkout_url": "https://checkout.stripe.com/...",
        "session_id": "cs_test_..."
    }
    """
    try:
        data = request.data
        
        # Extract data
        email = data.get('email')
        site_name = data.get('site_name')
        plan = data.get('plan', 'starter')
        billing_type = data.get('billing_type', 'monthly')  # monthly or onetime
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        
        # Validate required fields
        if not email or not site_name:
            return JsonResponse(
                {'error': 'Email and site_name are required'},
                status=400
            )
        
        # Validate email format
        try:
            validate_email(email)
        except ValidationError:
            return JsonResponse(
                {'error': 'Invalid email format'},
                status=400
            )
        
        # Validate plan
        valid_plans = ['starter', 'pro', 'premium']
        if plan not in valid_plans:
            return JsonResponse(
                {'error': f'Invalid plan. Must be one of: {valid_plans}'},
                status=400
            )
        
        # Build price key
        price_key = f"{plan}_{billing_type}"
        if price_key not in PRICE_MAP:
            return JsonResponse(
                {'error': f'Invalid billing type for plan. Available: monthly, onetime (for starter/pro)'},
                status=400
            )
        
        price_config = PRICE_MAP[price_key]
        
        # Create line items
        line_items = [{
            'price_data': {
                'currency': 'eur',
                'product_data': {
                    'name': price_config['name'],
                    'description': f'LSB Website für {site_name}',
                },
                'unit_amount': price_config['amount'],
            },
            'quantity': 1,
        }]
        
        # Add recurring if monthly
        if price_config['interval']:
            line_items[0]['price_data']['recurring'] = {
                'interval': price_config['interval'],
                'interval_count': 1,
            }
        
        # Build success and cancel URLs
        base_url = request.build_absolute_uri('/').rstrip('/')
        frontend_url = os.environ.get('FRONTEND_URL', base_url)
        
        success_url = f"{frontend_url}/onboarding/success?session_id={{CHECKOUT_SESSION_ID}}"
        cancel_url = f"{frontend_url}/onboarding?canceled=true"
        
        # Create Stripe Checkout Session
        session = stripe.checkout.Session.create(
            customer_email=email,
            payment_method_types=['card'],
            line_items=line_items,
            mode='subscription' if price_config['interval'] else 'payment',
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={
                'site_name': site_name,
                'plan': plan,
                'billing_type': billing_type,
                'first_name': first_name,
                'last_name': last_name,
                'email': email,
            },
        )
        
        return JsonResponse({
            'checkout_url': session.url,
            'session_id': session.id,
        })
        
    except stripe.error.StripeError as e:
        return JsonResponse(
            {'error': f'Stripe error: {str(e)}'},
            status=400
        )
    except Exception as e:
        return JsonResponse(
            {'error': f'Failed to create checkout: {str(e)}'},
            status=500
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def verify_session(request):
    """
    Verify a completed checkout session and get payment status
    
    GET /api/stripe/verify-session/?session_id=cs_test_...
    
    Response:
    {
        "status": "complete",
        "payment_status": "paid",
        "customer_email": "user@example.com",
        "metadata": {...}
    }
    """
    session_id = request.GET.get('session_id')
    
    if not session_id:
        return JsonResponse(
            {'error': 'session_id is required'},
            status=400
        )
    
    try:
        session = stripe.checkout.Session.retrieve(session_id)
        
        return JsonResponse({
            'status': session.status,
            'payment_status': session.payment_status,
            'customer_email': session.customer_email,
            'metadata': session.metadata,
            'amount_total': session.amount_total,
            'currency': session.currency,
        })
        
    except stripe.error.StripeError as e:
        return JsonResponse(
            {'error': f'Stripe error: {str(e)}'},
            status=400
        )
    except Exception as e:
        return JsonResponse(
            {'error': f'Failed to verify session: {str(e)}'},
            status=500
        )


@csrf_exempt
@require_http_methods(['POST'])
def stripe_webhook(request):
    """
    Handle Stripe webhook events
    
    POST /api/stripe/webhook/
    
    Handles:
    - checkout.session.completed: Create LSB site after successful payment
    - invoice.payment_succeeded: Handle recurring payments
    - customer.subscription.deleted: Handle cancellations
    """
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    webhook_secret = os.environ.get('STRIPE_WEBHOOK_SECRET', '')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError:
        return JsonResponse({'error': 'Invalid payload'}, status=400)
    except stripe.error.SignatureVerificationError:
        return JsonResponse({'error': 'Invalid signature'}, status=400)
    
    # Handle events
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        handle_checkout_completed(session)
    
    elif event['type'] == 'invoice.payment_succeeded':
        invoice = event['data']['object']
        # Handle recurring payment success
        pass
    
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        # Handle subscription cancellation
        pass
    
    return JsonResponse({'status': 'success'})


def handle_checkout_completed(session):
    """
    Handle successful checkout completion
    Create LSB site and send welcome email
    """
    from .services.onboarding import create_lsb_site
    
    metadata = session.get('metadata', {})
    
    email = metadata.get('email')
    site_name = metadata.get('site_name')
    plan = metadata.get('plan', 'starter')
    first_name = metadata.get('first_name', '')
    last_name = metadata.get('last_name', '')
    
    if not email or not site_name:
        print(f"Missing data in checkout session: {session.id}")
        return
    
    try:
        # Create the LSB site
        result = create_lsb_site(
            email=email,
            site_name=site_name,
            plan=plan,
            first_name=first_name,
            last_name=last_name,
        )
        
        # TODO: Send welcome email with credentials
        # TODO: Store stripe customer ID and subscription ID
        
        print(f"Site created for {email}: {result['site']['domain']}")
        
    except Exception as e:
        print(f"Failed to create site for {email}: {str(e)}")


@api_view(['GET'])
@permission_classes([AllowAny])
def get_stripe_config(request):
    """
    Get public Stripe configuration for frontend
    
    GET /api/stripe/config/
    
    Response:
    {
        "publishable_key": "pk_test_...",
        "prices": {
            "starter_monthly": 2900,
            "starter_onetime": 89000,
            ...
        }
    }
    """
    publishable_key = os.environ.get('STRIPE_PUBLISHABLE_KEY', 'pk_test_placeholder')
    
    return JsonResponse({
        'publishable_key': publishable_key,
        'prices': {
            key: config['amount'] 
            for key, config in PRICE_MAP.items()
        },
    })
