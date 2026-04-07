"""
LSB Website Onboarding Service
Handles automated site creation for new LSB customers
"""
import secrets
import string
from django.contrib.auth.models import User
from ..models import Site, SiteSettings, Page, PageLayout, GlobalTemplate, NavigationItem


def generate_unique_subdomain(base_name: str) -> str:
    """Generate a unique subdomain from base name"""
    # Clean base name: lowercase, replace spaces/special chars with hyphens
    subdomain = base_name.lower().strip()
    subdomain = ''.join(c if c.isalnum() else '-' for c in subdomain)
    subdomain = subdomain.replace(' ', '-')
    
    # Remove consecutive hyphens
    while '--' in subdomain:
        subdomain = subdomain.replace('--', '-')
    
    # Trim hyphens from ends
    subdomain = subdomain.strip('-')
    
    # Check uniqueness
    original = subdomain
    counter = 1
    while Site.objects.filter(subdomain=subdomain).exists():
        subdomain = f"{original}-{counter}"
        counter += 1
    
    return subdomain[:63]  # Max 63 chars for subdomain


def generate_secure_password(length: int = 12) -> str:
    """Generate a secure random password"""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def create_default_pages(site: Site) -> list:
    """Create default LSB pages for a new site"""
    default_pages = [
        {
            'title': 'Willkommen',
            'slug': 'home',
            'content': '<h1>Willkommen</h1><p>Ihre Lebens- und Sozialberatung</p>',
            'is_published': True,
        },
        {
            'title': 'Über mich',
            'slug': 'about',
            'content': '<h1>Über mich</h1><p>[Ihre Biografie hier einfügen]</p>',
            'is_published': True,
        },
        {
            'title': 'Leistungen',
            'slug': 'services',
            'content': '<h1>Meine Leistungen</h1><p>[Ihre Leistungen hier einfügen]</p>',
            'is_published': True,
        },
        {
            'title': 'Terminbuchung',
            'slug': 'booking',
            'content': '<h1>Termin vereinbaren</h1><p>Buchen Sie hier Ihren persönlichen Beratungstermin.</p>',
            'is_published': True,
        },
        {
            'title': 'FAQ',
            'slug': 'faq',
            'content': '<h1>Häufige Fragen</h1><p>[FAQ Inhalte hier einfügen]</p>',
            'is_published': True,
        },
        {
            'title': 'Kontakt',
            'slug': 'contact',
            'content': '<h1>Kontakt</h1><p>[Ihre Kontaktdaten hier einfügen]</p>',
            'is_published': True,
        },
        {
            'title': 'Impressum',
            'slug': 'impressum',
            'content': '''<h1>Impressum</h1>
<p><strong>Name:</strong> [Ihr Name]</p>
<p><strong>Adresse:</strong> [Ihre Adresse]</p>
<p><strong>Telefon:</strong> [Ihre Telefonnummer]</p>
<p><strong>E-Mail:</strong> [Ihre E-Mail]</p>
<p><strong>Berufsbezeichnung:</strong> Diplom-Lebens- und Sozialberater:in</p>
<p><strong>Mitglied bei:</strong> WKO, Fachgruppe Personenberatung</p>''',
            'is_published': True,
        },
        {
            'title': 'Datenschutz',
            'slug': 'datenschutz',
            'content': '<h1>Datenschutzerklärung</h1><p>[Datenschutzerklärung hier einfügen]</p>',
            'is_published': True,
        },
    ]
    
    pages = []
    for page_data in default_pages:
        page = Page.objects.create(
            site=site,
            **page_data
        )
        pages.append(page)
    
    return pages


def create_default_global_templates(site: Site) -> dict:
    """Create default header, navigation, footer for a new site"""
    # Create header
    header = GlobalTemplate.objects.create(
        site=site,
        name=f'{site.subdomain}-header',
        display_name='Haupt Header',
        template_type='header',
        style='modern',
        show_social_links=True,
        show_contact_info=True,
    )
    
    # Create navigation
    navigation = GlobalTemplate.objects.create(
        site=site,
        name=f'{site.subdomain}-nav',
        display_name='Haupt Navigation',
        template_type='navigation',
        style='horizontal',
        nav_sticky=True,
        nav_dropdown_enabled=True,
    )
    
    # Create default nav items
    nav_items = [
        {'label': 'Home', 'url': '/home', 'order': 1},
        {'label': 'Über mich', 'url': '/about', 'order': 2},
        {'label': 'Leistungen', 'url': '/services', 'order': 3},
        {'label': 'Termin buchen', 'url': '/booking', 'order': 4, 'icon_name': 'CalendarToday'},
        {'label': 'Kontakt', 'url': '/contact', 'order': 5},
    ]
    
    for item_data in nav_items:
        NavigationItem.objects.create(
            global_template=navigation,
            **item_data
        )
    
    # Create footer
    footer = GlobalTemplate.objects.create(
        site=site,
        name=f'{site.subdomain}-footer',
        display_name='Haupt Footer',
        template_type='footer',
        style='standard',
        footer_layout='three_columns',
        footer_show_logo=True,
        footer_copyright_text=f'© {site.site_name} - Alle Rechte vorbehalten',
    )
    
    return {
        'header': header,
        'navigation': navigation,
        'footer': footer,
    }


def create_lsb_site(
    email: str,
    site_name: str,
    plan: str = 'starter',
    first_name: str = '',
    last_name: str = ''
) -> dict:
    """
    Create a new LSB website with all defaults
    
    Args:
        email: Customer email address
        site_name: Name of the LSB practice
        plan: 'starter', 'pro', or 'premium'
        first_name: Optional first name for user
        last_name: Optional last name for user
    
    Returns:
        dict with site info, credentials, and URLs
    """
    # Generate unique subdomain
    subdomain = generate_unique_subdomain(site_name)
    
    # Create or get user
    username = email.split('@')[0]
    base_username = username
    counter = 1
    while User.objects.filter(username=username).exists():
        username = f"{base_username}{counter}"
        counter += 1
    
    password = generate_secure_password()
    
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
    )
    
    # Create Site
    site = Site.objects.create(
        subdomain=subdomain,
        owner=user,
        plan=plan,
        site_name=site_name,
        site_tagline='Lebens- und Sozialberatung in Österreich',
        is_active=True,
        is_published=False,  # Not published until customer confirms
    )
    
    # Create SiteSettings
    SiteSettings.objects.create(
        site=site,
        site_name=site_name,
        site_tagline='Lebens- und Sozialberatung in Österreich',
        contact_email=email,
    )
    
    # Create default pages
    pages = create_default_pages(site)
    
    # Create global templates
    templates = create_default_global_templates(site)
    
    return {
        'site': {
            'id': site.id,
            'subdomain': site.subdomain,
            'domain': site.get_full_domain(),
            'admin_url': f"https://{site.get_full_domain()}/admin",
            'site_url': f"https://{site.get_full_domain()}",
        },
        'credentials': {
            'username': username,
            'password': password,
            'email': email,
        },
        'pages_created': len(pages),
        'plan': plan,
    }


def onboard_new_lsb(email: str, site_name: str, plan: str = 'starter') -> dict:
    """
    Full onboarding process for a new LSB customer
    
    Usage:
        result = onboard_new_lsb(
            email='max.mustermann@example.com',
            site_name='Max Mustermann Beratung',
            plan='pro'
        )
    """
    # Create the site
    result = create_lsb_site(
        email=email,
        site_name=site_name,
        plan=plan,
    )
    
    # TODO: Send welcome email with credentials
    # TODO: Trigger deployment to hosting platform
    # TODO: Create Stripe customer and subscription
    
    return result
