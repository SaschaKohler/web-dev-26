import React, { useState } from 'react';
import {
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Collapse,
  useTheme,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import * as MuiIcons from '@mui/icons-material';

interface NavigationItem {
  id: number;
  label: string;
  url: string;
  icon_name?: string;
  is_external: boolean;
  children?: NavigationItem[];
}

interface NavigationProps {
  items: NavigationItem[];
  style?: string;
  backgroundColor?: string;
  textColor?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  items,
  style = 'horizontal',
  backgroundColor,
  textColor,
  mobileOpen = false,
  onMobileClose,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openItems, setOpenItems] = useState<{ [key: number]: boolean }>({});

  const handleToggle = (itemId: number) => {
    setOpenItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = (MuiIcons as any)[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  const renderNavItem = (item: NavigationItem, depth: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openItems[item.id];

    return (
      <React.Fragment key={item.id}>
        <ListItem disablePadding sx={{ pl: depth * 2 }}>
          <ListItemButton
            component={item.is_external ? 'a' : RouterLink}
            to={!item.is_external ? item.url : undefined}
            href={item.is_external ? item.url : undefined}
            target={item.is_external ? '_blank' : undefined}
            rel={item.is_external ? 'noopener noreferrer' : undefined}
            onClick={hasChildren ? () => handleToggle(item.id) : onMobileClose}
            sx={{
              color: textColor || theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            {item.icon_name && (
              <ListItemIcon sx={{ color: textColor || theme.palette.text.primary }}>
                {getIcon(item.icon_name)}
              </ListItemIcon>
            )}
            <ListItemText primary={item.label} />
            {hasChildren && (isOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>
        {hasChildren && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map(child => renderNavItem(child, depth + 1))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  const navContent = (
    <Box
      sx={{
        backgroundColor: backgroundColor || theme.palette.background.paper,
        height: isMobile ? '100%' : 'auto',
      }}
    >
      {isMobile && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
          <IconButton onClick={onMobileClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      )}
      <List>
        {items.map(item => renderNavItem(item))}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={onMobileClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        {navContent}
      </Drawer>
    );
  }

  if (style === 'vertical') {
    return (
      <Box
        sx={{
          width: 280,
          backgroundColor: backgroundColor || theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
          height: '100vh',
          position: 'sticky',
          top: 0,
          overflowY: 'auto',
        }}
      >
        {navContent}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: backgroundColor || theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            '& .MuiList-root': {
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
            },
          }}
        >
          {navContent}
        </Box>
      </Container>
    </Box>
  );
};

export default Navigation;
