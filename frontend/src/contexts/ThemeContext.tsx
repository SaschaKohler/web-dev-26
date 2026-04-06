import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createTheme, Theme } from '@mui/material/styles';
import { templatesApi, DesignTemplate } from '../api/templates';
import { DecadeTheme, getThemeById } from '../themes/decadeThemes';

interface ThemeContextType {
  currentTemplate: DesignTemplate | null;
  currentDecadeTheme: DecadeTheme | null;
  theme: Theme;
  refreshTheme: () => Promise<void>;
  setDecadeTheme: (themeId: string) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeContextProvider');
  }
  return context;
};

interface ThemeContextProviderProps {
  children: ReactNode;
}

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({ children }) => {
  const [currentTemplate, setCurrentTemplate] = useState<DesignTemplate | null>(null);
  const [currentDecadeTheme, setCurrentDecadeTheme] = useState<DecadeTheme | null>(null);
  const [theme, setTheme] = useState<Theme>(createTheme());

  const loadActiveTemplate = async () => {
    try {
      const siteSettings = await templatesApi.getSiteSettings();
      
      if (siteSettings.decade_theme_id) {
        const decadeTheme = getThemeById(siteSettings.decade_theme_id);
        if (decadeTheme) {
          setCurrentDecadeTheme(decadeTheme);
          updateThemeFromDecade(decadeTheme);
          return;
        }
      }
      
      const activeTemplate = await templatesApi.getActiveTemplate();
      setCurrentTemplate(activeTemplate);
      updateTheme(activeTemplate);
    } catch (error) {
      console.error('Error loading active template:', error);
      setTheme(createTheme());
    }
  };

  const updateThemeFromDecade = (decadeTheme: DecadeTheme) => {
    const newTheme = createTheme({
      palette: {
        primary: {
          main: decadeTheme.primaryColor,
        },
        secondary: {
          main: decadeTheme.secondaryColor,
        },
        background: {
          default: decadeTheme.backgroundColor,
          paper: decadeTheme.backgroundColor,
        },
        text: {
          primary: decadeTheme.textColor,
        },
      },
      typography: {
        fontFamily: decadeTheme.fontFamily,
        h1: { fontFamily: decadeTheme.headingFont },
        h2: { fontFamily: decadeTheme.headingFont },
        h3: { fontFamily: decadeTheme.headingFont },
        h4: { fontFamily: decadeTheme.headingFont },
        h5: { fontFamily: decadeTheme.headingFont },
        h6: { fontFamily: decadeTheme.headingFont },
      },
      shape: {
        borderRadius: decadeTheme.borderRadius,
      },
      spacing: decadeTheme.spacingUnit,
      shadows: [
        'none',
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
        decadeTheme.cardShadow,
      ],
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: decadeTheme.buttonStyle === 'pill' ? 50 : 
                           decadeTheme.buttonStyle === 'squared' ? 4 :
                           decadeTheme.buttonStyle === 'soft-rounded' ? 12 :
                           decadeTheme.borderRadius,
              textTransform: 'none',
              fontWeight: 500,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              boxShadow: decadeTheme.cardShadow,
            },
          },
        },
      },
    });
    
    if (decadeTheme.customCSS && !window.location.pathname.startsWith('/admin')) {
      const styleId = 'decade-theme-custom-css';
      let styleElement = document.getElementById(styleId);
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = decadeTheme.customCSS;
    } else {
      const styleElement = document.getElementById('decade-theme-custom-css');
      if (styleElement) {
        styleElement.remove();
      }
    }
    
    setTheme(newTheme);
  };

  const updateTheme = (template: DesignTemplate) => {
    const newTheme = createTheme({
      palette: {
        primary: {
          main: template.primary_color,
        },
        secondary: {
          main: template.secondary_color,
        },
        background: {
          default: template.background_color,
          paper: template.background_color,
        },
        text: {
          primary: template.text_color,
        },
      },
      typography: {
        fontFamily: template.font_family,
        h1: { fontFamily: template.heading_font },
        h2: { fontFamily: template.heading_font },
        h3: { fontFamily: template.heading_font },
        h4: { fontFamily: template.heading_font },
        h5: { fontFamily: template.heading_font },
        h6: { fontFamily: template.heading_font },
      },
      shape: {
        borderRadius: template.border_radius,
      },
      spacing: template.spacing_unit,
      shadows: [
        'none',
        template.card_shadow,
        template.card_shadow,
        template.card_shadow,
        template.card_shadow,
        template.card_shadow,
        template.card_shadow,
        template.card_shadow,
        template.card_shadow,
        template.card_shadow,
        template.card_shadow,
        template.card_shadow,
        template.card_shadow,
        template.card_shadow,
        template.card_shadow,
        template.card_shadow,
        template.card_shadow,
        template.card_shadow,
        template.card_shadow,
        template.card_shadow,
        template.card_shadow,
        template.card_shadow,
        template.card_shadow,
        template.card_shadow,
        template.card_shadow,
      ],
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: template.button_style === 'pill' ? 50 : 
                           template.button_style === 'squared' ? 4 :
                           template.button_style === 'soft-rounded' ? 12 :
                           template.border_radius,
              textTransform: 'none',
              fontWeight: 500,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              boxShadow: template.card_shadow,
            },
          },
        },
      },
    });
    
    setTheme(newTheme);
  };

  const handleSetDecadeTheme = async (themeId: string) => {
    try {
      await templatesApi.setDecadeTheme(themeId);
      const decadeTheme = getThemeById(themeId);
      if (decadeTheme) {
        setCurrentDecadeTheme(decadeTheme);
        setCurrentTemplate(null);
        updateThemeFromDecade(decadeTheme);
      }
    } catch (error) {
      console.error('Error setting decade theme:', error);
      throw error;
    }
  };

  const refreshTheme = async () => {
    await loadActiveTemplate();
  };

  useEffect(() => {
    loadActiveTemplate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ThemeContext.Provider value={{ 
      currentTemplate, 
      currentDecadeTheme,
      theme, 
      refreshTheme,
      setDecadeTheme: handleSetDecadeTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
