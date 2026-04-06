import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createTheme, Theme } from '@mui/material/styles';
import { templatesApi, DesignTemplate } from '../api/templates';
import { decadeThemesApi, DecadeTheme } from '../api/decadeThemes';

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
      // Try to load active decade theme from backend
      try {
        const activeTheme = await decadeThemesApi.getActive();
        setCurrentDecadeTheme(activeTheme);
        updateThemeFromDecade(activeTheme);
        return;
      } catch (themeError) {
        // No active decade theme, try design template
        console.log('No active decade theme, checking design template');
      }
      
      // Fallback to design template
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
          main: decadeTheme.primary_color,
        },
        secondary: {
          main: decadeTheme.secondary_color,
        },
        background: {
          default: decadeTheme.background_color,
          paper: decadeTheme.background_color,
        },
        text: {
          primary: decadeTheme.text_color,
        },
      },
      typography: {
        fontFamily: decadeTheme.font_family,
        h1: { fontFamily: decadeTheme.heading_font },
        h2: { fontFamily: decadeTheme.heading_font },
        h3: { fontFamily: decadeTheme.heading_font },
        h4: { fontFamily: decadeTheme.heading_font },
        h5: { fontFamily: decadeTheme.heading_font },
        h6: { fontFamily: decadeTheme.heading_font },
      },
      shape: {
        borderRadius: decadeTheme.border_radius,
      },
      spacing: decadeTheme.spacing_unit,
      shadows: [
        'none',
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
        decadeTheme.card_shadow,
      ],
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: decadeTheme.button_style === 'pill' ? 50 : 
                           decadeTheme.button_style === 'squared' ? 4 :
                           decadeTheme.button_style === 'soft-rounded' ? 12 :
                           decadeTheme.border_radius,
              textTransform: 'none',
              fontWeight: 500,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              boxShadow: decadeTheme.card_shadow,
            },
          },
        },
      },
    });
    
    if (decadeTheme.custom_css && !window.location.pathname.startsWith('/admin')) {
      const styleId = 'decade-theme-custom-css';
      let styleElement = document.getElementById(styleId);
      if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }
      styleElement.textContent = decadeTheme.custom_css;
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
      // themeId is now the database ID (number), not theme_id string
      const themeIdNum = parseInt(themeId);
      await decadeThemesApi.activate(themeIdNum);
      const decadeTheme = await decadeThemesApi.getById(themeIdNum);
      setCurrentDecadeTheme(decadeTheme);
      setCurrentTemplate(null);
      updateThemeFromDecade(decadeTheme);
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
