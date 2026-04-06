import React from 'react';
import { AppBar, Toolbar, Box, Container, IconButton, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
  logoUrl?: string;
  logoAlt?: string;
  backgroundColor?: string;
  textColor?: string;
  style?: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  logoUrl,
  logoAlt = 'Logo',
  backgroundColor,
  textColor,
  style = 'modern',
  onMenuClick
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getHeaderStyles = () => {
    const baseStyles = {
      backgroundColor: backgroundColor || theme.palette.background.paper,
      color: textColor || theme.palette.text.primary,
      boxShadow: style === 'transparent' ? 'none' : undefined,
    };

    switch (style) {
      case 'transparent':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          position: 'absolute' as const,
          top: 0,
          left: 0,
          right: 0,
        };
      case 'minimal':
        return {
          ...baseStyles,
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`,
        };
      case 'classic':
        return {
          ...baseStyles,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        };
      default:
        return baseStyles;
    }
  };

  return (
    <AppBar position="sticky" sx={getHeaderStyles()}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={onMenuClick}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            {logoUrl && (
              <img
                src={logoUrl}
                alt={logoAlt}
                style={{
                  height: '40px',
                  maxWidth: '200px',
                  objectFit: 'contain',
                }}
              />
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
