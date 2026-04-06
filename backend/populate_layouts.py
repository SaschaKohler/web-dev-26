import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cms.settings')
django.setup()

from cms_pages.models import PageLayout, Section, ContentBlock

def create_landing_page_layout():
    layout, created = PageLayout.objects.get_or_create(
        name='modern_landing',
        defaults={
            'display_name': 'Moderne Landing Page',
            'layout_type': 'landing',
            'description': 'Professionelle Landing Page mit Hero, Features, Timeline und CTA',
            'is_active': True
        }
    )
    
    if created:
        hero = Section.objects.create(
            page_layout=layout,
            section_type='hero',
            title='Willkommen bei Ihrer Lebens- und Sozialberatung',
            subtitle='Professionelle Unterstützung für ein erfülltes Leben',
            order=1,
            background_type='gradient',
            padding_top=120,
            padding_bottom=120
        )
        
        ContentBlock.objects.create(
            section=hero,
            block_type='button',
            title='Jetzt Termin vereinbaren',
            link_url='/booking',
            order=1
        )
        
        features = Section.objects.create(
            page_layout=layout,
            section_type='features',
            title='Unsere Leistungen',
            subtitle='Umfassende Beratung in allen Lebenslagen',
            order=2,
            padding_top=80,
            padding_bottom=80
        )
        
        feature_items = [
            {
                'title': 'Einzelberatung',
                'content': 'Individuelle Gespräche in vertrauensvoller Atmosphäre',
                'icon_name': 'Person',
                'order': 1
            },
            {
                'title': 'Paarberatung',
                'content': 'Unterstützung für Paare in allen Lebensphasen',
                'icon_name': 'Favorite',
                'order': 2
            },
            {
                'title': 'Krisenintervention',
                'content': 'Schnelle Hilfe in akuten Belastungssituationen',
                'icon_name': 'Support',
                'order': 3
            }
        ]
        
        for item in feature_items:
            ContentBlock.objects.create(
                section=features,
                block_type='feature',
                **item
            )
        
        cta = Section.objects.create(
            page_layout=layout,
            section_type='cta',
            title='Bereit für den ersten Schritt?',
            subtitle='Vereinbaren Sie noch heute einen Termin',
            order=3,
            background_type='color',
            background_color='#1976d2',
            padding_top=100,
            padding_bottom=100
        )
        
        ContentBlock.objects.create(
            section=cta,
            block_type='button',
            title='Termin buchen',
            link_url='/booking',
            order=1
        )
        
        print(f"✓ Created layout: {layout.display_name}")
    else:
        print(f"↻ Layout already exists: {layout.display_name}")
    
    return layout


def create_about_page_layout():
    layout, created = PageLayout.objects.get_or_create(
        name='about_timeline',
        defaults={
            'display_name': 'Über Uns mit Timeline',
            'layout_type': 'about',
            'description': 'About-Seite mit Hero, Timeline und Team-Vorstellung',
            'is_active': True
        }
    )
    
    if created:
        hero = Section.objects.create(
            page_layout=layout,
            section_type='hero',
            title='Über Uns',
            subtitle='Erfahrung, Kompetenz und Empathie seit über 15 Jahren',
            order=1,
            background_type='image',
            background_image='https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200',
            padding_top=100,
            padding_bottom=100
        )
        
        timeline = Section.objects.create(
            page_layout=layout,
            section_type='timeline',
            title='Unser Weg',
            subtitle='Die Entwicklung unserer Praxis',
            order=2,
            padding_top=80,
            padding_bottom=80
        )
        
        timeline_items = [
            {
                'title': 'Gründung',
                'subtitle': '2008',
                'content': 'Start der Praxis mit Fokus auf Einzelberatung',
                'order': 1
            },
            {
                'title': 'Erweiterung',
                'subtitle': '2012',
                'content': 'Aufnahme von Paarberatung und Familientherapie',
                'order': 2
            },
            {
                'title': 'Spezialisierung',
                'subtitle': '2018',
                'content': 'Zusatzausbildung in Krisenintervention',
                'order': 3
            },
            {
                'title': 'Heute',
                'subtitle': '2024',
                'content': 'Etablierte Praxis mit breitem Leistungsspektrum',
                'order': 4
            }
        ]
        
        for item in timeline_items:
            ContentBlock.objects.create(
                section=timeline,
                block_type='timeline_item',
                **item
            )
        
        team = Section.objects.create(
            page_layout=layout,
            section_type='team',
            title='Unser Team',
            subtitle='Qualifizierte Berater mit Herz',
            order=3,
            background_type='color',
            background_color='#f5f5f5',
            padding_top=80,
            padding_bottom=80
        )
        
        print(f"✓ Created layout: {layout.display_name}")
    else:
        print(f"↻ Layout already exists: {layout.display_name}")
    
    return layout


def create_services_layout():
    layout, created = PageLayout.objects.get_or_create(
        name='services_cards',
        defaults={
            'display_name': 'Leistungen mit Cards',
            'layout_type': 'services',
            'description': 'Services-Seite mit Card-Grid und detaillierten Beschreibungen',
            'is_active': True
        }
    )
    
    if created:
        hero = Section.objects.create(
            page_layout=layout,
            section_type='hero',
            title='Unsere Leistungen',
            subtitle='Professionelle Beratung für alle Lebenslagen',
            order=1,
            background_type='gradient',
            padding_top=100,
            padding_bottom=100
        )
        
        cards = Section.objects.create(
            page_layout=layout,
            section_type='cards',
            title='Beratungsangebote',
            order=2,
            padding_top=80,
            padding_bottom=80
        )
        
        service_cards = [
            {
                'title': 'Einzelberatung',
                'subtitle': 'Ab 80€ pro Sitzung',
                'content': 'Individuelle Beratung zu persönlichen Themen, Lebenskrisen und Entscheidungsfindung',
                'image_url': 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
                'link_text': 'Mehr erfahren',
                'link_url': '/services/einzelberatung',
                'order': 1
            },
            {
                'title': 'Paarberatung',
                'subtitle': 'Ab 120€ pro Sitzung',
                'content': 'Unterstützung bei Beziehungsproblemen, Kommunikation und gemeinsamer Zukunftsplanung',
                'image_url': 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400',
                'link_text': 'Mehr erfahren',
                'link_url': '/services/paarberatung',
                'order': 2
            },
            {
                'title': 'Familienberatung',
                'subtitle': 'Ab 100€ pro Sitzung',
                'content': 'Hilfe bei familiären Konflikten, Erziehungsfragen und Generationenproblemen',
                'image_url': 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=400',
                'link_text': 'Mehr erfahren',
                'link_url': '/services/familienberatung',
                'order': 3
            }
        ]
        
        for card in service_cards:
            ContentBlock.objects.create(
                section=cards,
                block_type='card',
                **card
            )
        
        cta = Section.objects.create(
            page_layout=layout,
            section_type='cta',
            title='Interessiert?',
            subtitle='Kontaktieren Sie uns für ein unverbindliches Erstgespräch',
            order=3,
            background_type='color',
            background_color='#1976d2',
            padding_top=80,
            padding_bottom=80
        )
        
        print(f"✓ Created layout: {layout.display_name}")
    else:
        print(f"↻ Layout already exists: {layout.display_name}")
    
    return layout


def create_portfolio_layout():
    layout, created = PageLayout.objects.get_or_create(
        name='portfolio_gallery',
        defaults={
            'display_name': 'Portfolio mit Galerie',
            'layout_type': 'portfolio',
            'description': 'Portfolio-Seite mit Bildergalerie und Testimonials',
            'is_active': True
        }
    )
    
    if created:
        hero = Section.objects.create(
            page_layout=layout,
            section_type='hero',
            title='Unsere Räumlichkeiten',
            subtitle='Ein Ort der Ruhe und Vertrauens',
            order=1,
            background_type='image',
            background_image='https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200',
            padding_top=100,
            padding_bottom=100
        )
        
        gallery = Section.objects.create(
            page_layout=layout,
            section_type='gallery',
            title='Impressionen',
            subtitle='Einblicke in unsere Praxisräume',
            order=2,
            padding_top=80,
            padding_bottom=80
        )
        
        gallery_images = [
            {
                'image_url': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600',
                'image_alt': 'Beratungsraum 1',
                'title': 'Beratungsraum 1',
                'order': 1
            },
            {
                'image_url': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600',
                'image_alt': 'Wartebereich',
                'title': 'Wartebereich',
                'order': 2
            },
            {
                'image_url': 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600',
                'image_alt': 'Beratungsraum 2',
                'title': 'Beratungsraum 2',
                'order': 3
            }
        ]
        
        for img in gallery_images:
            ContentBlock.objects.create(
                section=gallery,
                block_type='image',
                **img
            )
        
        testimonials = Section.objects.create(
            page_layout=layout,
            section_type='testimonials',
            title='Stimmen unserer Klienten',
            subtitle='Was unsere Klienten über uns sagen',
            order=3,
            background_type='color',
            background_color='#f5f5f5',
            padding_top=80,
            padding_bottom=80
        )
        
        testimonial_items = [
            {
                'content': 'Die Beratung hat mir sehr geholfen, neue Perspektiven zu finden. Sehr empfehlenswert!',
                'title': 'Maria S.',
                'subtitle': 'Einzelberatung',
                'order': 1
            },
            {
                'content': 'Professionell, einfühlsam und kompetent. Wir haben unsere Beziehung gerettet.',
                'title': 'Thomas & Anna K.',
                'subtitle': 'Paarberatung',
                'order': 2
            },
            {
                'content': 'In der Krise war die schnelle Hilfe unbezahlbar. Vielen Dank!',
                'title': 'Peter M.',
                'subtitle': 'Krisenintervention',
                'order': 3
            }
        ]
        
        for testimonial in testimonial_items:
            ContentBlock.objects.create(
                section=testimonials,
                block_type='testimonial',
                **testimonial
            )
        
        print(f"✓ Created layout: {layout.display_name}")
    else:
        print(f"↻ Layout already exists: {layout.display_name}")
    
    return layout


def main():
    print("Creating page layouts...")
    print("=" * 50)
    
    create_landing_page_layout()
    create_about_page_layout()
    create_services_layout()
    create_portfolio_layout()
    
    print("=" * 50)
    print(f"Total layouts: {PageLayout.objects.count()}")
    print(f"Total sections: {Section.objects.count()}")
    print(f"Total content blocks: {ContentBlock.objects.count()}")
    print("=" * 50)

if __name__ == '__main__':
    main()
