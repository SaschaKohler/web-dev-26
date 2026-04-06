#!/usr/bin/env python
"""
Populate database with 12 predefined decade themes.
Run with: uv run python populate_decade_themes.py
"""

import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cms.settings')
django.setup()

from cms_pages.models import DecadeTheme

def populate_decade_themes():
    """Create or update all 12 predefined decade themes."""
    
    themes_data = [
        # 90s Themes
        {
            'theme_id': '90s-1',
            'name': 'Neon Cyber',
            'description': 'Bright neon colors, geometric patterns, and bold typography',
            'decade': '90s',
            'variation': 1,
            'primary_color': '#FF00FF',
            'secondary_color': '#00FFFF',
            'background_color': '#000000',
            'text_color': '#FFFFFF',
            'accent_color': '#FFFF00',
            'font_family': 'Comic Sans MS, cursive',
            'heading_font': 'Impact, fantasy',
            'border_radius': 0,
            'spacing_unit': 8,
            'card_shadow': '5px 5px 0px #FF00FF',
            'button_style': 'squared',
            'custom_css': '''
      * {
        image-rendering: pixelated;
      }
      body {
        background: linear-gradient(45deg, #000000 25%, #1a001a 25%, #1a001a 50%, #000000 50%, #000000 75%, #1a001a 75%, #1a001a);
        background-size: 40px 40px;
      }
    ''',
            'is_predefined': True,
        },
        {
            'theme_id': '90s-2',
            'name': 'Grunge Web',
            'description': 'Textured backgrounds, muted colors, and alternative aesthetic',
            'decade': '90s',
            'variation': 2,
            'primary_color': '#8B4513',
            'secondary_color': '#556B2F',
            'background_color': '#D2B48C',
            'text_color': '#2F4F4F',
            'accent_color': '#CD853F',
            'font_family': 'Verdana, sans-serif',
            'heading_font': 'Georgia, serif',
            'border_radius': 2,
            'spacing_unit': 10,
            'card_shadow': '3px 3px 8px rgba(0,0,0,0.4)',
            'button_style': 'soft-rounded',
            'custom_css': '''
      body {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><filter id="noise"><feTurbulence baseFrequency="0.9"/></filter><rect width="100" height="100" filter="url(%23noise)" opacity="0.1"/></svg>');
      }
    ''',
            'is_predefined': True,
        },
        {
            'theme_id': '90s-3',
            'name': 'Geocities Classic',
            'description': 'Under construction signs, tiled backgrounds, and visitor counters',
            'decade': '90s',
            'variation': 3,
            'primary_color': '#0000FF',
            'secondary_color': '#FF0000',
            'background_color': '#C0C0C0',
            'text_color': '#000000',
            'accent_color': '#FFFF00',
            'font_family': 'Arial, sans-serif',
            'heading_font': 'Times New Roman, serif',
            'border_radius': 0,
            'spacing_unit': 12,
            'card_shadow': 'inset 2px 2px 0px #FFFFFF, inset -2px -2px 0px #808080',
            'button_style': 'squared',
            'custom_css': '''
      body {
        background-image: repeating-linear-gradient(45deg, #C0C0C0 0px, #C0C0C0 10px, #D3D3D3 10px, #D3D3D3 20px);
      }
    ''',
            'is_predefined': True,
        },
        
        # 2000s Themes
        {
            'theme_id': '2000s-1',
            'name': 'Web 2.0 Gloss',
            'description': 'Glossy buttons, gradients, reflections, and rounded corners',
            'decade': '2000s',
            'variation': 1,
            'primary_color': '#4A90E2',
            'secondary_color': '#7ED321',
            'background_color': '#F5F5F5',
            'text_color': '#333333',
            'accent_color': '#FF6B6B',
            'font_family': 'Helvetica Neue, Arial, sans-serif',
            'heading_font': 'Helvetica Neue, Arial, sans-serif',
            'border_radius': 8,
            'spacing_unit': 8,
            'card_shadow': '0px 2px 8px rgba(0,0,0,0.15)',
            'button_style': 'soft-rounded',
            'custom_css': '''
      button {
        background: linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%);
        box-shadow: 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.5);
      }
    ''',
            'is_predefined': True,
        },
        {
            'theme_id': '2000s-2',
            'name': 'MySpace Vibes',
            'description': 'Customizable profiles, bold colors, and social energy',
            'decade': '2000s',
            'variation': 2,
            'primary_color': '#0066CC',
            'secondary_color': '#FF6600',
            'background_color': '#FFFFFF',
            'text_color': '#000000',
            'accent_color': '#FF1493',
            'font_family': 'Verdana, Geneva, sans-serif',
            'heading_font': 'Arial Black, sans-serif',
            'border_radius': 5,
            'spacing_unit': 10,
            'card_shadow': '2px 2px 5px rgba(0,0,0,0.3)',
            'button_style': 'soft-rounded',
            'custom_css': '''
      body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
    ''',
            'is_predefined': True,
        },
        {
            'theme_id': '2000s-3',
            'name': 'Vista Aero',
            'description': 'Translucent glass effects, soft shadows, and clean design',
            'decade': '2000s',
            'variation': 3,
            'primary_color': '#0078D7',
            'secondary_color': '#00BCF2',
            'background_color': '#F0F0F0',
            'text_color': '#1F1F1F',
            'accent_color': '#00A4EF',
            'font_family': 'Segoe UI, Tahoma, sans-serif',
            'heading_font': 'Segoe UI, Tahoma, sans-serif',
            'border_radius': 6,
            'spacing_unit': 8,
            'card_shadow': '0px 4px 16px rgba(0,0,0,0.1)',
            'button_style': 'soft-rounded',
            'custom_css': '''
      .card {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.3);
      }
    ''',
            'is_predefined': True,
        },
        
        # 2010s Themes
        {
            'theme_id': '2010s-1',
            'name': 'Flat Design',
            'description': 'Minimalist, flat colors, no shadows, clean typography',
            'decade': '2010s',
            'variation': 1,
            'primary_color': '#3498DB',
            'secondary_color': '#2ECC71',
            'background_color': '#ECF0F1',
            'text_color': '#2C3E50',
            'accent_color': '#E74C3C',
            'font_family': 'Roboto, sans-serif',
            'heading_font': 'Montserrat, sans-serif',
            'border_radius': 4,
            'spacing_unit': 8,
            'card_shadow': 'none',
            'button_style': 'soft-rounded',
            'custom_css': '''
      * {
        transition: all 0.3s ease;
      }
    ''',
            'is_predefined': True,
        },
        {
            'theme_id': '2010s-2',
            'name': 'Material Design',
            'description': 'Google Material Design with elevation and bold colors',
            'decade': '2010s',
            'variation': 2,
            'primary_color': '#2196F3',
            'secondary_color': '#FF5722',
            'background_color': '#FAFAFA',
            'text_color': '#212121',
            'accent_color': '#4CAF50',
            'font_family': 'Roboto, sans-serif',
            'heading_font': 'Roboto, sans-serif',
            'border_radius': 4,
            'spacing_unit': 8,
            'card_shadow': '0px 2px 4px rgba(0,0,0,0.14), 0px 3px 4px rgba(0,0,0,0.12), 0px 1px 5px rgba(0,0,0,0.2)',
            'button_style': 'soft-rounded',
            'custom_css': '''
      button {
        box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
      }
      button:hover {
        box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
      }
    ''',
            'is_predefined': True,
        },
        {
            'theme_id': '2010s-3',
            'name': 'iOS Inspired',
            'description': 'Apple-inspired design with subtle gradients and blur effects',
            'decade': '2010s',
            'variation': 3,
            'primary_color': '#007AFF',
            'secondary_color': '#5856D6',
            'background_color': '#FFFFFF',
            'text_color': '#000000',
            'accent_color': '#FF3B30',
            'font_family': '-apple-system, BlinkMacSystemFont, San Francisco, Helvetica Neue, sans-serif',
            'heading_font': '-apple-system, BlinkMacSystemFont, San Francisco, Helvetica Neue, sans-serif',
            'border_radius': 12,
            'spacing_unit': 8,
            'card_shadow': '0px 1px 3px rgba(0,0,0,0.08)',
            'button_style': 'soft-rounded',
            'custom_css': '''
      .card {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: saturate(180%) blur(20px);
        border: 0.5px solid rgba(0,0,0,0.04);
      }
    ''',
            'is_predefined': True,
        },
        
        # 2020s Themes
        {
            'theme_id': '2020s-1',
            'name': 'Neumorphism',
            'description': 'Soft UI with subtle shadows and highlights',
            'decade': '2020s',
            'variation': 1,
            'primary_color': '#6C63FF',
            'secondary_color': '#FF6584',
            'background_color': '#E0E5EC',
            'text_color': '#2C3E50',
            'accent_color': '#4ECDC4',
            'font_family': 'Inter, system-ui, sans-serif',
            'heading_font': 'Poppins, sans-serif',
            'border_radius': 20,
            'spacing_unit': 8,
            'card_shadow': '9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)',
            'button_style': 'soft-rounded',
            'custom_css': '''
      button {
        box-shadow: 5px 5px 10px rgba(163,177,198,0.6), -5px -5px 10px rgba(255,255,255, 0.5);
      }
      button:active {
        box-shadow: inset 5px 5px 10px rgba(163,177,198,0.6), inset -5px -5px 10px rgba(255,255,255, 0.5);
      }
    ''',
            'is_predefined': True,
        },
        {
            'theme_id': '2020s-2',
            'name': 'Dark Mode Minimal',
            'description': 'Modern dark theme with vibrant accents and clean spacing',
            'decade': '2020s',
            'variation': 2,
            'primary_color': '#BB86FC',
            'secondary_color': '#03DAC6',
            'background_color': '#121212',
            'text_color': '#E1E1E1',
            'accent_color': '#CF6679',
            'font_family': 'Inter, system-ui, sans-serif',
            'heading_font': 'Space Grotesk, sans-serif',
            'border_radius': 16,
            'spacing_unit': 8,
            'card_shadow': '0px 4px 20px rgba(0,0,0,0.5)',
            'button_style': 'soft-rounded',
            'custom_css': '''
      body {
        background: linear-gradient(180deg, #121212 0%, #1E1E1E 100%);
      }
      .card {
        background: #1E1E1E;
        border: 1px solid rgba(255,255,255,0.1);
      }
    ''',
            'is_predefined': True,
        },
        {
            'theme_id': '2020s-3',
            'name': 'Glassmorphism',
            'description': 'Frosted glass effect with vibrant backgrounds',
            'decade': '2020s',
            'variation': 3,
            'primary_color': '#667EEA',
            'secondary_color': '#F093FB',
            'background_color': '#FFFFFF',
            'text_color': '#1A202C',
            'accent_color': '#4FD1C5',
            'font_family': 'DM Sans, system-ui, sans-serif',
            'heading_font': 'Plus Jakarta Sans, sans-serif',
            'border_radius': 24,
            'spacing_unit': 8,
            'card_shadow': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            'button_style': 'soft-rounded',
            'custom_css': '''
      body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .card {
        background: rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.18);
      }
    ''',
            'is_predefined': True,
        },
    ]
    
    created_count = 0
    updated_count = 0
    
    for theme_data in themes_data:
        theme, created = DecadeTheme.objects.update_or_create(
            theme_id=theme_data['theme_id'],
            defaults=theme_data
        )
        
        if created:
            created_count += 1
            print(f"✓ Created: {theme.name} ({theme.decade})")
        else:
            updated_count += 1
            print(f"↻ Updated: {theme.name} ({theme.decade})")
    
    print(f"\n{'='*60}")
    print(f"Summary: {created_count} created, {updated_count} updated")
    print(f"Total themes in database: {DecadeTheme.objects.count()}")
    print(f"{'='*60}")

if __name__ == '__main__':
    print("Populating decade themes...")
    print(f"{'='*60}\n")
    populate_decade_themes()
    print("\n✓ Done!")
