import React, { useState, useEffect, useRef } from 'react';
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
  Paper,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import * as MuiIcons from '@mui/icons-material';
import type { MenuConfig } from '../../pages/admin/MenuEditor';

interface NavigationItem {
  id: number;
  label: string;
  url: string;
  icon_name?: string;
  is_external: boolean;
  is_visible?: boolean;
  children?: NavigationItem[];
}

interface NavigationProps {
  items: NavigationItem[];
  style?: string;
  backgroundColor?: string;
  textColor?: string;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  onMobileOpen?: () => void;
  menuConfig?: MenuConfig;
  logoUrl?: string;
  logoAlt?: string;
}

const Navigation: React.FC<NavigationProps> = ({
  items,
  style = 'horizontal',
  backgroundColor,
  textColor,
  mobileOpen = false,
  onMobileClose,
  onMobileOpen,
  menuConfig,
  logoUrl,
  logoAlt = 'Logo',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openItems, setOpenItems] = useState<{ [key: number]: boolean }>({});
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const dropdownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mc = menuConfig;
  const c = mc?.custom_colors;

  const designStyle = mc?.design_style || (style === 'vertical' ? 'vertical-sidebar' : 'horizontal-classic');
  const isVertical = designStyle === 'vertical-sidebar' || designStyle === 'vertical-accordion';
  const bgColor = c?.backgroundColor || backgroundColor || theme.palette.background.paper;
  const txtColor = c?.textColor || textColor || theme.palette.text.primary;

  useEffect(() => {
    return () => {
      if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    };
  }, []);

  const handleToggle = (itemId: number) => {
    setOpenItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleDropdownEnter = (itemId: number) => {
    if (dropdownTimerRef.current) clearTimeout(dropdownTimerRef.current);
    setOpenDropdown(itemId);
  };

  const handleDropdownLeave = () => {
    dropdownTimerRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = (MuiIcons as any)[iconName];
    return IconComponent ? <IconComponent fontSize="small" /> : null;
  };

  const getHoverSx = (itemId: number) => {
    if (!mc || !c) return {};
    const isHovered = hoveredId === itemId;
    if (!isHovered) return {};
    switch (mc.hover_effect) {
      case 'highlight':
      case 'background-fill':
        return { backgroundColor: `${c.hoverBackgroundColor} !important`, color: `${c.hoverTextColor} !important` };
      case 'text-color-shift':
        return { color: `${c.hoverTextColor} !important` };
      case 'scale-up':
        return { transform: 'scale(1.05)', color: `${c.hoverTextColor} !important` };
      case 'glow':
        return { textShadow: `0 0 8px ${c.accentColor}, 0 0 16px ${c.accentColor}`, color: `${c.hoverTextColor} !important` };
      case 'underline-slide':
      case 'underline-center':
      case 'border-bottom':
        return { color: `${c.hoverTextColor} !important` };
      default:
        return {};
    }
  };

  const getUnderlineAfterSx = (itemId: number) => {
    if (!mc || !c) return {};
    const isHovered = hoveredId === itemId;
    const base = {
      content: '""',
      position: 'absolute',
      bottom: 0,
      height: '2px',
      backgroundColor: c.accentColor,
      transition: 'all 0.3s ease',
    };
    switch (mc.hover_effect) {
      case 'underline-slide':
        return { ...base, left: 0, width: isHovered ? '100%' : '0%' };
      case 'underline-center':
        return { ...base, left: '50%', transform: 'translateX(-50%)', width: isHovered ? '80%' : '0%' };
      case 'border-bottom':
        return { ...base, width: isHovered ? '100%' : '0%', left: 0, height: '3px', backgroundColor: c.accentColor };
      default:
        return {};
    }
  };

  const hasUnderlineEffect = mc && ['underline-slide', 'underline-center', 'border-bottom'].includes(mc.hover_effect);

  const itemSx = (itemId: number, depth: number = 0) => ({
    color: txtColor,
    fontSize: mc ? `${mc.font_size}px` : 'inherit',
    fontWeight: mc?.font_weight || 500,
    letterSpacing: mc ? `${mc.letter_spacing}px` : 'normal',
    borderRadius: designStyle === 'horizontal-pill' ? '999px' : mc ? `${mc.border_radius}px` : undefined,
    px: mc ? `${mc.item_padding_x}px` : undefined,
    py: mc ? `${mc.item_padding_y}px` : undefined,
    pl: depth > 0 ? `${depth * 16 + (mc?.item_padding_x || 16)}px` : undefined,
    border: designStyle === 'horizontal-bordered' ? `1px solid ${c?.borderColor || theme.palette.divider}` : 'none',
    position: 'relative' as const,
    transition: 'all 0.25s ease',
    '&:hover': {
      backgroundColor: c?.hoverBackgroundColor || theme.palette.action.hover,
      ...getHoverSx(itemId),
    },
    ...(hasUnderlineEffect && {
      '&::after': getUnderlineAfterSx(itemId),
    }),
    ...getHoverSx(itemId),
  });

  const renderNavItem = (item: NavigationItem, depth: number = 0) => {
    if (item.is_visible === false) return null;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openItems[item.id];
    const isDropdownOpen = openDropdown === item.id;

    if (isVertical) {
      return (
        <React.Fragment key={item.id}>
          <ListItem disablePadding>
            <ListItemButton
              component={(!hasChildren && item.is_external) ? 'a' : (!hasChildren ? RouterLink : 'div') as any}
              to={(!hasChildren && !item.is_external) ? item.url : undefined}
              href={(item.is_external && !hasChildren) ? item.url : undefined}
              target={item.is_external ? '_blank' : undefined}
              rel={item.is_external ? 'noopener noreferrer' : undefined}
              onClick={hasChildren ? () => handleToggle(item.id) : onMobileClose}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              sx={itemSx(item.id, depth)}
            >
              {mc?.show_icons && item.icon_name && (
                <ListItemIcon sx={{ color: txtColor, minWidth: 32 }}>
                  {getIcon(item.icon_name)}
                </ListItemIcon>
              )}
              <ListItemText primary={item.label} />
              {hasChildren && (isOpen ? <ExpandLess fontSize="small" /> : <ExpandMoreIcon fontSize="small" />)}
            </ListItemButton>
          </ListItem>
          {hasChildren && (
            <Collapse in={isOpen} timeout={mc?.animate_submenu ? 'auto' : 0} unmountOnExit>
              <List
                component="div"
                disablePadding
                sx={{ backgroundColor: c?.subMenuBackground || 'transparent' }}
              >
                {item.children!.map(child => renderNavItem(child, depth + 1))}
              </List>
            </Collapse>
          )}
        </React.Fragment>
      );
    }

    return (
      <Box key={item.id} sx={{ position: 'relative', display: 'inline-flex' }}>
        <ListItem disablePadding>
          <ListItemButton
            component={(!hasChildren && item.is_external) ? 'a' : (!hasChildren ? RouterLink : 'div') as any}
            to={(!hasChildren && !item.is_external) ? item.url : undefined}
            href={(item.is_external && !hasChildren) ? item.url : undefined}
            target={item.is_external ? '_blank' : undefined}
            rel={item.is_external ? 'noopener noreferrer' : undefined}
            onMouseEnter={() => { setHoveredId(item.id); if (hasChildren) handleDropdownEnter(item.id); }}
            onMouseLeave={() => { setHoveredId(null); if (hasChildren) handleDropdownLeave(); }}
            onClick={hasChildren ? () => handleToggle(item.id) : onMobileClose}
            sx={itemSx(item.id)}
          >
            {mc?.show_icons && item.icon_name && (
              <ListItemIcon sx={{ color: txtColor, minWidth: 28 }}>
                {getIcon(item.icon_name)}
              </ListItemIcon>
            )}
            <ListItemText primary={item.label} />
            {hasChildren && mc?.submenu_indicator !== 'none' && (
              <Box component="span" sx={{ ml: 0.5, fontSize: 11, opacity: 0.8 }}>
                {mc?.submenu_indicator === 'chevron' ? '▾' : mc?.submenu_indicator === 'arrow' ? '→' : '•'}
              </Box>
            )}
          </ListItemButton>
        </ListItem>
        {hasChildren && isDropdownOpen && (
          <Paper
            elevation={4}
            onMouseEnter={() => handleDropdownEnter(item.id)}
            onMouseLeave={handleDropdownLeave}
            sx={{
              position: 'absolute',
              top: '100%',
              left: 0,
              minWidth: 200,
              zIndex: 1300,
              backgroundColor: c?.subMenuBackground || theme.palette.background.paper,
              border: c ? `1px solid ${c.borderColor}` : undefined,
              borderRadius: mc ? `${mc.border_radius}px` : 1,
              overflow: 'hidden',
            }}
          >
            <List disablePadding>
              {item.children!.map(child => {
                if (child.is_visible === false) return null;
                return (
                  <ListItem key={child.id} disablePadding>
                    <ListItemButton
                      component={(child.is_external ? 'a' : RouterLink) as any}
                      to={!child.is_external ? child.url : undefined}
                      href={child.is_external ? child.url : undefined}
                      target={child.is_external ? '_blank' : undefined}
                      rel={child.is_external ? 'noopener noreferrer' : undefined}
                      onMouseEnter={() => setHoveredId(child.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={onMobileClose}
                      sx={itemSx(child.id, 1)}
                    >
                      {mc?.show_icons && child.icon_name && (
                        <ListItemIcon sx={{ color: txtColor, minWidth: 28 }}>
                          {getIcon(child.icon_name)}
                        </ListItemIcon>
                      )}
                      <ListItemText primary={child.label} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        )}
      </Box>
    );
  };

  const navContent = (
    <Box
      sx={{
        backgroundColor: bgColor,
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
      <List
        sx={
          !isVertical && !isMobile
            ? { display: 'flex', flexDirection: 'row', p: 0 }
            : {}
        }
      >
        {items
          .filter(i => i.is_visible !== false)
          .map(item => renderNavItem(item))}
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
            backgroundColor: bgColor,
          },
        }}
      >
        {navContent}
      </Drawer>
    );
  }

  if (isVertical) {
    return (
      <Box
        sx={{
          width: 280,
          backgroundColor: bgColor,
          borderRight: `1px solid ${c?.borderColor || theme.palette.divider}`,
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
        backgroundColor: bgColor,
        borderBottom: `1px solid ${c?.borderColor || theme.palette.divider}`,
        position: mc?.sticky ? 'sticky' : 'relative',
        top: mc?.sticky ? 0 : undefined,
        zIndex: mc?.sticky ? 1100 : undefined,
        ...(mc?.blur_on_scroll && { backdropFilter: 'blur(8px)' }),
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2 }}>
          {isMobile && (
            <IconButton
              edge="start"
              sx={{ color: txtColor, mr: 1 }}
              aria-label="menu"
              onClick={onMobileOpen}
            >
              <MenuIcon />
            </IconButton>
          )}
          {logoUrl && (
            <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
              <img
                src={logoUrl}
                alt={logoAlt}
                style={{ height: 40, maxWidth: 180, objectFit: 'contain' }}
              />
            </Box>
          )}
          {!isMobile && navContent}
        </Box>
      </Container>
    </Box>
  );
};

export default Navigation;
