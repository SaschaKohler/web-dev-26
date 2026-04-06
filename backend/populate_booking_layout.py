import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cms.settings')
django.setup()

from cms_pages.models import PageLayout, Section, ContentBlock

def create_booking_layout():
    layout, created = PageLayout.objects.get_or_create(
        name='booking_page',
        defaults={
            'display_name': 'Booking Seite',
            'layout_type': 'booking',
            'description': 'Terminbuchungsseite mit Cal.com Integration',
            'is_active': True
        }
    )
    
    if created:
        # Hero Section
        hero = Section.objects.create(
            page_layout=layout,
            section_type='hero',
            title='Termin vereinbaren',
            subtitle='Buchen Sie Ihren persönlichen Beratungstermin',
            order=1,
            background_type='gradient',
            padding_top=100,
            padding_bottom=80
        )
        
        # Text Section mit Informationen
        info = Section.objects.create(
            page_layout=layout,
            section_type='text',
            title='Wichtige Informationen',
            order=2,
            background_type='color',
            background_color='#f5f5f5',
            padding_top=60,
            padding_bottom=60
        )
        
        ContentBlock.objects.create(
            section=info,
            block_type='text',
            title='Vor Ihrem Termin',
            content='<p>Bitte wählen Sie einen passenden Termin aus dem Kalender. Sie erhalten eine Bestätigungsmail mit allen Details.</p><ul><li>Erstgespräche dauern ca. 60 Minuten</li><li>Bitte erscheinen Sie pünktlich</li><li>Bei Verhinderung bitte mindestens 24h vorher absagen</li></ul>',
            order=1
        )
        
        # Features Section - Vorteile
        features = Section.objects.create(
            page_layout=layout,
            section_type='features',
            title='Warum Online-Buchung?',
            subtitle='Einfach, schnell und flexibel',
            order=3,
            padding_top=80,
            padding_bottom=80
        )
        
        feature_items = [
            {
                'title': '24/7 Verfügbar',
                'content': 'Buchen Sie Ihren Termin zu jeder Tages- und Nachtzeit',
                'icon_name': 'Schedule',
                'icon_color': '#1976d2',
                'order': 1
            },
            {
                'title': 'Sofortige Bestätigung',
                'content': 'Erhalten Sie direkt eine Terminbestätigung per E-Mail',
                'icon_name': 'CheckCircle',
                'icon_color': '#2e7d32',
                'order': 2
            },
            {
                'title': 'Erinnerungen',
                'content': 'Automatische Erinnerungen vor Ihrem Termin',
                'icon_name': 'Notifications',
                'icon_color': '#ed6c02',
                'order': 3
            }
        ]
        
        for item in feature_items:
            ContentBlock.objects.create(
                section=features,
                block_type='feature',
                **item
            )
        
        # FAQ Section
        faq = Section.objects.create(
            page_layout=layout,
            section_type='faq',
            title='Häufig gestellte Fragen',
            subtitle='Alles was Sie über die Terminbuchung wissen müssen',
            order=4,
            background_type='color',
            background_color='#fafafa',
            padding_top=80,
            padding_bottom=80
        )
        
        faq_items = [
            {
                'title': 'Wie kann ich einen Termin absagen?',
                'content': 'Sie können Ihren Termin über den Link in der Bestätigungsmail bis 24 Stunden vorher kostenlos stornieren.',
                'order': 1
            },
            {
                'title': 'Was kostet eine Sitzung?',
                'content': 'Einzelberatung ab 80€, Paarberatung ab 120€ pro Sitzung (60 Minuten). Das Erstgespräch ist unverbindlich.',
                'order': 2
            },
            {
                'title': 'Werden die Kosten von der Krankenkasse übernommen?',
                'content': 'Lebens- und Sozialberatung ist keine Kassenleistung. Manche Zusatzversicherungen übernehmen einen Teil der Kosten.',
                'order': 3
            },
            {
                'title': 'Kann ich auch telefonisch einen Termin vereinbaren?',
                'content': 'Ja, Sie können uns auch telefonisch oder per E-Mail kontaktieren. Die Online-Buchung ist jedoch am schnellsten.',
                'order': 4
            }
        ]
        
        for item in faq_items:
            ContentBlock.objects.create(
                section=faq,
                block_type='text',
                **item
            )
        
        # CTA Section
        cta = Section.objects.create(
            page_layout=layout,
            section_type='cta',
            title='Noch Fragen?',
            subtitle='Kontaktieren Sie uns gerne direkt',
            order=5,
            background_type='color',
            background_color='#1976d2',
            padding_top=80,
            padding_bottom=80
        )
        
        ContentBlock.objects.create(
            section=cta,
            block_type='button',
            title='Kontakt aufnehmen',
            link_url='/contact',
            order=1
        )
        
        print(f"✓ Created layout: {layout.display_name}")
    else:
        print(f"↻ Layout already exists: {layout.display_name}")
    
    return layout

def main():
    print("Creating booking page layout...")
    print("=" * 50)
    
    create_booking_layout()
    
    print("=" * 50)
    print(f"Total layouts: {PageLayout.objects.count()}")
    print(f"Total sections: {Section.objects.count()}")
    print(f"Total content blocks: {ContentBlock.objects.count()}")
    print("=" * 50)

if __name__ == '__main__':
    main()
