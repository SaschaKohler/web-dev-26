import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cms.settings')
django.setup()

from cms_pages.models import DesignTemplate, SiteSettings

def create_templates():
    templates = [
        {
            'name': 'calm_serenity',
            'display_name': 'Ruhige Gelassenheit',
            'description': 'Ein beruhigendes Design mit sanften Pastelltönen und weichen Formen. Perfekt für eine entspannte, vertrauensvolle Atmosphäre.',
            'primary_color': '#6B9080',
            'secondary_color': '#A4C3B2',
            'accent_color': '#CCE3DE',
            'background_color': '#F6FFF8',
            'text_color': '#2C3E50',
            'font_family': 'Inter, sans-serif',
            'heading_font': 'Playfair Display, serif',
            'border_radius': 12,
            'spacing_unit': 8,
            'header_style': 'minimal',
            'footer_style': 'clean',
            'button_style': 'soft-rounded',
            'card_shadow': '0 4px 12px rgba(107, 144, 128, 0.1)',
            'is_active': True
        },
        {
            'name': 'warm_embrace',
            'display_name': 'Warme Umarmung',
            'description': 'Warme Erdtöne und einladende Farben schaffen eine gemütliche, herzliche Umgebung für Ihre Beratungsgespräche.',
            'primary_color': '#D4A574',
            'secondary_color': '#E8C4A0',
            'accent_color': '#F4E4D7',
            'background_color': '#FFFBF5',
            'text_color': '#3E2723',
            'font_family': 'Lato, sans-serif',
            'heading_font': 'Merriweather, serif',
            'border_radius': 8,
            'spacing_unit': 10,
            'header_style': 'warm',
            'footer_style': 'inviting',
            'button_style': 'rounded',
            'card_shadow': '0 3px 10px rgba(212, 165, 116, 0.15)',
            'is_active': False
        },
        {
            'name': 'professional_trust',
            'display_name': 'Professionelles Vertrauen',
            'description': 'Ein klares, professionelles Design mit Blautönen, das Kompetenz und Vertrauenswürdigkeit ausstrahlt.',
            'primary_color': '#2C5F7C',
            'secondary_color': '#4A90A4',
            'accent_color': '#7FB3D5',
            'background_color': '#FFFFFF',
            'text_color': '#1A1A1A',
            'font_family': 'Open Sans, sans-serif',
            'heading_font': 'Montserrat, sans-serif',
            'border_radius': 6,
            'spacing_unit': 8,
            'header_style': 'professional',
            'footer_style': 'structured',
            'button_style': 'sharp',
            'card_shadow': '0 2px 8px rgba(44, 95, 124, 0.12)',
            'is_active': False
        },
        {
            'name': 'gentle_nature',
            'display_name': 'Sanfte Natur',
            'description': 'Inspiriert von der Natur mit grünen und braunen Tönen für eine erdende, harmonische Atmosphäre.',
            'primary_color': '#7D9D7C',
            'secondary_color': '#A8C5A7',
            'accent_color': '#C9E4C5',
            'background_color': '#F9FDF9',
            'text_color': '#2D4A2B',
            'font_family': 'Nunito, sans-serif',
            'heading_font': 'Lora, serif',
            'border_radius': 16,
            'spacing_unit': 12,
            'header_style': 'organic',
            'footer_style': 'natural',
            'button_style': 'pill',
            'card_shadow': '0 6px 16px rgba(125, 157, 124, 0.1)',
            'is_active': False
        },
        {
            'name': 'modern_clarity',
            'display_name': 'Moderne Klarheit',
            'description': 'Ein zeitgemäßes, minimalistisches Design mit klaren Linien und ausgewogenen Kontrasten.',
            'primary_color': '#5E6572',
            'secondary_color': '#8B95A5',
            'accent_color': '#B8C5D6',
            'background_color': '#FAFBFC',
            'text_color': '#2B2D33',
            'font_family': 'Roboto, sans-serif',
            'heading_font': 'Poppins, sans-serif',
            'border_radius': 4,
            'spacing_unit': 8,
            'header_style': 'modern',
            'footer_style': 'minimal',
            'button_style': 'squared',
            'card_shadow': '0 1px 4px rgba(94, 101, 114, 0.08)',
            'is_active': False
        },
        {
            'name': 'soft_lavender',
            'display_name': 'Sanfter Lavendel',
            'description': 'Beruhigende Lavendel- und Violetttöne für eine entspannende, meditative Stimmung.',
            'primary_color': '#9B8FB9',
            'secondary_color': '#C5B9D4',
            'accent_color': '#E5DFF0',
            'background_color': '#FAF9FC',
            'text_color': '#3D3449',
            'font_family': 'Source Sans Pro, sans-serif',
            'heading_font': 'Crimson Text, serif',
            'border_radius': 10,
            'spacing_unit': 10,
            'header_style': 'elegant',
            'footer_style': 'refined',
            'button_style': 'soft-rounded',
            'card_shadow': '0 4px 14px rgba(155, 143, 185, 0.12)',
            'is_active': False
        },
        {
            'name': 'sunrise_optimism',
            'display_name': 'Sonnenaufgang Optimismus',
            'description': 'Lebendige, aber sanfte Farben inspiriert vom Sonnenaufgang für eine hoffnungsvolle, positive Ausstrahlung.',
            'primary_color': '#E89F71',
            'secondary_color': '#F4C2A0',
            'accent_color': '#FFE5D4',
            'background_color': '#FFFAF7',
            'text_color': '#4A3428',
            'font_family': 'Quicksand, sans-serif',
            'heading_font': 'Josefin Sans, sans-serif',
            'border_radius': 14,
            'spacing_unit': 10,
            'header_style': 'uplifting',
            'footer_style': 'bright',
            'button_style': 'rounded',
            'card_shadow': '0 5px 15px rgba(232, 159, 113, 0.15)',
            'is_active': False
        }
    ]
    
    created_count = 0
    updated_count = 0
    
    for template_data in templates:
        template, created = DesignTemplate.objects.update_or_create(
            name=template_data['name'],
            defaults=template_data
        )
        if created:
            created_count += 1
            print(f"✓ Created template: {template.display_name}")
        else:
            updated_count += 1
            print(f"↻ Updated template: {template.display_name}")
    
    settings = SiteSettings.get_settings()
    if not settings.active_template:
        active_template = DesignTemplate.objects.get(name='calm_serenity')
        settings.active_template = active_template
        settings.save()
        print(f"\n✓ Set default active template: {active_template.display_name}")
    
    print(f"\n{'='*50}")
    print(f"Summary: {created_count} created, {updated_count} updated")
    print(f"Total templates: {DesignTemplate.objects.count()}")
    print(f"{'='*50}")

if __name__ == '__main__':
    create_templates()
