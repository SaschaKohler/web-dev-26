import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cms.settings')
django.setup()

from cms_pages.models import Page, PageLayout

def setup_booking_page():
    """Verknüpft die Booking-Page mit dem Booking-Layout"""
    
    # Hole oder erstelle das Booking-Layout
    try:
        booking_layout = PageLayout.objects.get(name='booking_page')
        print(f"✓ Found booking layout: {booking_layout.display_name}")
    except PageLayout.DoesNotExist:
        print("✗ Booking layout not found. Please run populate_booking_layout.py first!")
        return
    
    # Hole oder erstelle die Booking-Page
    page, created = Page.objects.update_or_create(
        slug='booking',
        defaults={
            'title': 'Terminbuchung',
            'content': 'Buchen Sie hier Ihren Beratungstermin',
            'page_layout': booking_layout,
            'is_published': True
        }
    )
    
    if created:
        print(f"✓ Created page: {page.title}")
    else:
        print(f"✓ Updated page: {page.title}")
    
    print(f"  - Slug: {page.slug}")
    print(f"  - Layout: {page.page_layout.display_name if page.page_layout else 'None'}")
    print(f"  - Published: {page.is_published}")

def main():
    print("Setting up booking page...")
    print("=" * 50)
    
    setup_booking_page()
    
    print("=" * 50)
    print("Done!")

if __name__ == '__main__':
    main()
