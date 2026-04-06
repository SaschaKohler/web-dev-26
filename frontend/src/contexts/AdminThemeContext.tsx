import React, { createContext, useContext, ReactNode } from 'react';
import { createTheme, Theme } from '@mui/material/styles';

interface AdminThemeContextType {
  theme: Theme;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export const useAdminTheme = () => {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error('useAdminTheme must be used within AdminThemeProvider');
  }
  return context;
};

interface AdminThemeProviderProps {
  children: ReactNode;
}

const neutralAdminTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
    h2: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
    h3: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
    h4: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
    h5: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
    h6: { fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' },
  },
  shape: {
    borderRadius: 4,
  },
  spacing: 8,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

export const AdminThemeProvider: React.FC<AdminThemeProviderProps> = ({ children }) => {
  return (
    <AdminThemeContext.Provider value={{ theme: neutralAdminTheme }}>
      {children}
    </AdminThemeContext.Provider>
  );
};
