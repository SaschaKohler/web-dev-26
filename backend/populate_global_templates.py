#!/usr/bin/env python
"""
Populate Global Templates and Navigation Items
Run this script to create sample header, navigation, and footer templates.
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cms.settings')
django.setup()

from cms_pages.models import GlobalTemplate, NavigationItem, SiteSettings


def create_header_template():
    """Create a modern header template"""
    header, created = GlobalTemplate.objects.get_or_create(
        name='modern_header',
        defaults={
            'display_name': 'Modern Header',
            'template_type': 'header',
            'style': 'modern',
            'background_color': '#ffffff',
            'text_color': '#333333',
            'show_social_links': False,
            'show_contact_info': False,
            'is_active': True,
        }
    )
    
    if created:
        print(f"✓ Created header template: {header.display_name}")
    else:
        print(f"- Header template already exists: {header.display_name}")
    
    return header


def create_navigation_template():
    """Create a horizontal navigation template with sample menu items"""
    nav, created = GlobalTemplate.objects.get_or_create(
        name='main_navigation',
        defaults={
            'display_name': 'Main Navigation',
            'template_type': 'navigation',
            'style': 'horizontal',
            'background_color': '#f5f5f5',
            'text_color': '#333333',
            'show_social_links': False,
            'show_contact_info': False,
            'is_active': True,
        }
    )
    
    if created:
        print(f"✓ Created navigation template: {nav.display_name}")
        
        # Create navigation items
        nav_items = [
            {'label': 'Home', 'url': '/', 'order': 1, 'icon_name': 'Home'},
            {'label': 'Über mich', 'url': '/about', 'order': 2, 'icon_name': 'Person'},
            {'label': 'Leistungen', 'url': '/services', 'order': 3, 'icon_name': 'Work'},
            {'label': 'FAQ', 'url': '/faq', 'order': 4, 'icon_name': 'Help'},
            {'label': 'Kontakt', 'url': '/contact', 'order': 5, 'icon_name': 'Email'},
        ]
        
        for item_data in nav_items:
            NavigationItem.objects.create(
                global_template=nav,
                **item_data
            )
        
        print(f"  ✓ Created {len(nav_items)} navigation items")
    else:
        print(f"- Navigation template already exists: {nav.display_name}")
    
    return nav


def create_footer_template():
    """Create a standard footer template"""
    footer, created = GlobalTemplate.objects.get_or_create(
        name='standard_footer',
        defaults={
            'display_name': 'Standard Footer',
            'template_type': 'footer',
            'style': 'standard',
            'background_color': '#2c3e50',
            'text_color': '#ffffff',
            'show_social_links': True,
            'show_contact_info': True,
            'is_active': True,
        }
    )
    
    if created:
        print(f"✓ Created footer template: {footer.display_name}")
    else:
        print(f"- Footer template already exists: {footer.display_name}")
    
    return footer


def update_site_settings():
    """Update or create site settings"""
    settings = SiteSettings.get_settings()
    
    if not settings.site_name or settings.site_name == 'Lebens- und Sozialberatung':
        settings.site_name = 'Lebens- und Sozialberatung'
        settings.site_tagline = 'Professionelle Beratung und Unterstützung in allen Lebenslagen'
        settings.contact_email = 'kontakt@beispiel.at'
        settings.contact_phone = '+43 123 456 789'
        settings.address = 'Musterstraße 1, 1010 Wien, Österreich'
        settings.save()
        print(f"✓ Updated site settings")
    else:
        print(f"- Site settings already configured")


def main():
    print("\n" + "="*60)
    print("Populating Global Templates and Navigation")
    print("="*60 + "\n")
    
    create_header_template()
    create_navigation_template()
    create_footer_template()
    update_site_settings()
    
    print("\n" + "="*60)
    print("✓ Global templates population complete!")
    print("="*60 + "\n")
    
    print("Next steps:")
    print("1. Run migrations: uv run python manage.py makemigrations && uv run python manage.py migrate")
    print("2. Access Django admin at http://localhost:8000/admin")
    print("3. Customize templates and navigation items as needed")
    print()


if __name__ == '__main__':
    main()
