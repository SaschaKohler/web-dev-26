export type DecadeType = '90s' | '2000s' | '2010s' | '2020s';
export type ThemeVariation = 1 | 2 | 3;

export interface DecadeTheme {
  id: string;
  decade: DecadeType;
  variation: ThemeVariation;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  headingFont: string;
  borderRadius: number;
  spacingUnit: number;
  cardShadow: string;
  buttonStyle: 'pill' | 'squared' | 'soft-rounded' | 'rounded';
  accentColor?: string;
  customCSS?: string;
}

export const decadeThemes: DecadeTheme[] = [
  {
    id: '90s-1',
    decade: '90s',
    variation: 1,
    name: 'Neon Cyber',
    description: 'Bright neon colors, geometric patterns, and bold typography',
    primaryColor: '#FF00FF',
    secondaryColor: '#00FFFF',
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
    fontFamily: 'Comic Sans MS, cursive',
    headingFont: 'Impact, fantasy',
    borderRadius: 0,
    spacingUnit: 8,
    cardShadow: '5px 5px 0px #FF00FF',
    buttonStyle: 'squared',
    accentColor: '#FFFF00',
    customCSS: `
      * {
        image-rendering: pixelated;
      }
      body {
        background: linear-gradient(45deg, #000000 25%, #1a001a 25%, #1a001a 50%, #000000 50%, #000000 75%, #1a001a 75%, #1a001a);
        background-size: 40px 40px;
      }
    `
  },
  {
    id: '90s-2',
    decade: '90s',
    variation: 2,
    name: 'Grunge Web',
    description: 'Textured backgrounds, muted colors, and alternative aesthetic',
    primaryColor: '#8B4513',
    secondaryColor: '#556B2F',
    backgroundColor: '#D2B48C',
    textColor: '#2F4F4F',
    fontFamily: 'Verdana, sans-serif',
    headingFont: 'Georgia, serif',
    borderRadius: 2,
    spacingUnit: 10,
    cardShadow: '3px 3px 8px rgba(0,0,0,0.4)',
    buttonStyle: 'soft-rounded',
    accentColor: '#CD853F',
    customCSS: `
      body {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><filter id="noise"><feTurbulence baseFrequency="0.9"/></filter><rect width="100" height="100" filter="url(%23noise)" opacity="0.1"/></svg>');
      }
    `
  },
  {
    id: '90s-3',
    decade: '90s',
    variation: 3,
    name: 'Geocities Classic',
    description: 'Under construction signs, tiled backgrounds, and visitor counters',
    primaryColor: '#0000FF',
    secondaryColor: '#FF0000',
    backgroundColor: '#C0C0C0',
    textColor: '#000000',
    fontFamily: 'Arial, sans-serif',
    headingFont: 'Times New Roman, serif',
    borderRadius: 0,
    spacingUnit: 12,
    cardShadow: 'inset 2px 2px 0px #FFFFFF, inset -2px -2px 0px #808080',
    buttonStyle: 'squared',
    accentColor: '#FFFF00',
    customCSS: `
      body {
        background-image: repeating-linear-gradient(45deg, #C0C0C0 0px, #C0C0C0 10px, #D3D3D3 10px, #D3D3D3 20px);
      }
    `
  },

  {
    id: '2000s-1',
    decade: '2000s',
    variation: 1,
    name: 'Web 2.0 Gloss',
    description: 'Glossy buttons, gradients, reflections, and rounded corners',
    primaryColor: '#4A90E2',
    secondaryColor: '#7ED321',
    backgroundColor: '#F5F5F5',
    textColor: '#333333',
    fontFamily: 'Helvetica Neue, Arial, sans-serif',
    headingFont: 'Helvetica Neue, Arial, sans-serif',
    borderRadius: 8,
    spacingUnit: 8,
    cardShadow: '0px 2px 8px rgba(0,0,0,0.15)',
    buttonStyle: 'soft-rounded',
    accentColor: '#FF6B6B',
    customCSS: `
      button {
        background: linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%);
        box-shadow: 0 1px 3px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.5);
      }
    `
  },
  {
    id: '2000s-2',
    decade: '2000s',
    variation: 2,
    name: 'MySpace Vibes',
    description: 'Customizable profiles, bold colors, and social energy',
    primaryColor: '#0066CC',
    secondaryColor: '#FF6600',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    fontFamily: 'Verdana, Geneva, sans-serif',
    headingFont: 'Arial Black, sans-serif',
    borderRadius: 5,
    spacingUnit: 10,
    cardShadow: '2px 2px 5px rgba(0,0,0,0.3)',
    buttonStyle: 'soft-rounded',
    accentColor: '#FF1493',
    customCSS: `
      body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
    `
  },
  {
    id: '2000s-3',
    decade: '2000s',
    variation: 3,
    name: 'Vista Aero',
    description: 'Translucent glass effects, soft shadows, and clean design',
    primaryColor: '#0078D7',
    secondaryColor: '#00BCF2',
    backgroundColor: '#F0F0F0',
    textColor: '#1F1F1F',
    fontFamily: 'Segoe UI, Tahoma, sans-serif',
    headingFont: 'Segoe UI, Tahoma, sans-serif',
    borderRadius: 6,
    spacingUnit: 8,
    cardShadow: '0px 4px 16px rgba(0,0,0,0.1)',
    buttonStyle: 'soft-rounded',
    accentColor: '#00A4EF',
    customCSS: `
      .card {
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.3);
      }
    `
  },

  {
    id: '2010s-1',
    decade: '2010s',
    variation: 1,
    name: 'Flat Design',
    description: 'Minimalist, flat colors, no shadows, clean typography',
    primaryColor: '#3498DB',
    secondaryColor: '#2ECC71',
    backgroundColor: '#ECF0F1',
    textColor: '#2C3E50',
    fontFamily: 'Roboto, sans-serif',
    headingFont: 'Montserrat, sans-serif',
    borderRadius: 4,
    spacingUnit: 8,
    cardShadow: 'none',
    buttonStyle: 'soft-rounded',
    accentColor: '#E74C3C',
    customCSS: `
      * {
        transition: all 0.3s ease;
      }
    `
  },
  {
    id: '2010s-2',
    decade: '2010s',
    variation: 2,
    name: 'Material Design',
    description: 'Google Material Design with elevation and bold colors',
    primaryColor: '#2196F3',
    secondaryColor: '#FF5722',
    backgroundColor: '#FAFAFA',
    textColor: '#212121',
    fontFamily: 'Roboto, sans-serif',
    headingFont: 'Roboto, sans-serif',
    borderRadius: 4,
    spacingUnit: 8,
    cardShadow: '0px 2px 4px rgba(0,0,0,0.14), 0px 3px 4px rgba(0,0,0,0.12), 0px 1px 5px rgba(0,0,0,0.2)',
    buttonStyle: 'soft-rounded',
    accentColor: '#4CAF50',
    customCSS: `
      button {
        box-shadow: 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
      }
      button:hover {
        box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
      }
    `
  },
  {
    id: '2010s-3',
    decade: '2010s',
    variation: 3,
    name: 'iOS Inspired',
    description: 'Apple-inspired design with subtle gradients and blur effects',
    primaryColor: '#007AFF',
    secondaryColor: '#5856D6',
    backgroundColor: '#FFFFFF',
    textColor: '#000000',
    fontFamily: '-apple-system, BlinkMacSystemFont, San Francisco, Helvetica Neue, sans-serif',
    headingFont: '-apple-system, BlinkMacSystemFont, San Francisco, Helvetica Neue, sans-serif',
    borderRadius: 12,
    spacingUnit: 8,
    cardShadow: '0px 1px 3px rgba(0,0,0,0.08)',
    buttonStyle: 'soft-rounded',
    accentColor: '#FF3B30',
    customCSS: `
      .card {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: saturate(180%) blur(20px);
        border: 0.5px solid rgba(0,0,0,0.04);
      }
    `
  },

  {
    id: '2020s-1',
    decade: '2020s',
    variation: 1,
    name: 'Neumorphism',
    description: 'Soft UI with subtle shadows and highlights',
    primaryColor: '#6C63FF',
    secondaryColor: '#FF6584',
    backgroundColor: '#E0E5EC',
    textColor: '#2C3E50',
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFont: 'Poppins, sans-serif',
    borderRadius: 20,
    spacingUnit: 8,
    cardShadow: '9px 9px 16px rgba(163,177,198,0.6), -9px -9px 16px rgba(255,255,255, 0.5)',
    buttonStyle: 'soft-rounded',
    accentColor: '#4ECDC4',
    customCSS: `
      button {
        box-shadow: 5px 5px 10px rgba(163,177,198,0.6), -5px -5px 10px rgba(255,255,255, 0.5);
      }
      button:active {
        box-shadow: inset 5px 5px 10px rgba(163,177,198,0.6), inset -5px -5px 10px rgba(255,255,255, 0.5);
      }
    `
  },
  {
    id: '2020s-2',
    decade: '2020s',
    variation: 2,
    name: 'Dark Mode Minimal',
    description: 'Modern dark theme with vibrant accents and clean spacing',
    primaryColor: '#BB86FC',
    secondaryColor: '#03DAC6',
    backgroundColor: '#121212',
    textColor: '#E1E1E1',
    fontFamily: 'Inter, system-ui, sans-serif',
    headingFont: 'Space Grotesk, sans-serif',
    borderRadius: 16,
    spacingUnit: 8,
    cardShadow: '0px 4px 20px rgba(0,0,0,0.5)',
    buttonStyle: 'soft-rounded',
    accentColor: '#CF6679',
    customCSS: `
      body {
        background: linear-gradient(180deg, #121212 0%, #1E1E1E 100%);
      }
      .card {
        background: #1E1E1E;
        border: 1px solid rgba(255,255,255,0.1);
      }
    `
  },
  {
    id: '2020s-3',
    decade: '2020s',
    variation: 3,
    name: 'Glassmorphism',
    description: 'Frosted glass effect with vibrant backgrounds',
    primaryColor: '#667EEA',
    secondaryColor: '#F093FB',
    backgroundColor: '#FFFFFF',
    textColor: '#1A202C',
    fontFamily: 'DM Sans, system-ui, sans-serif',
    headingFont: 'Plus Jakarta Sans, sans-serif',
    borderRadius: 24,
    spacingUnit: 8,
    cardShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    buttonStyle: 'soft-rounded',
    accentColor: '#4FD1C5',
    customCSS: `
      body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }
      .card {
        background: rgba(255, 255, 255, 0.25);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.18);
      }
    `
  },
];

export const getDecadeThemes = (decade: DecadeType): DecadeTheme[] => {
  return decadeThemes.filter(theme => theme.decade === decade);
};

export const getThemeById = (id: string): DecadeTheme | undefined => {
  return decadeThemes.find(theme => theme.id === id);
};

export const getAllDecades = (): DecadeType[] => {
  return ['90s', '2000s', '2010s', '2020s'];
};
