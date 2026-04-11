import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Stack,
  Tooltip,
  Switch,
  FormControlLabel,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Collapse,
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  ExpandMore,
  ExpandLess,
  DragIndicator,
  CheckCircle,
  Visibility,
  Save,
  ArrowUpward,
  ArrowDownward,
  SubdirectoryArrowRight,
  Link as LinkIcon,
  OpenInNew,
  Palette,
  Menu as MenuIcon,
  FormatColorFill,
  TextFields,
  Widgets,
} from '@mui/icons-material';
import { globalTemplatesApi, GlobalTemplate, NavigationItem } from '../../api/globalTemplates';
import { layoutsApi } from '../../api/layouts';
import { decadeThemes, DecadeTheme } from '../../themes/decadeThemes';
import IconSelector from '../../components/IconSelector';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type MenuDesignStyle =
  | 'horizontal-classic'
  | 'horizontal-underline'
  | 'horizontal-pill'
  | 'horizontal-bordered'
  | 'vertical-sidebar'
  | 'vertical-accordion'
  | 'mega-menu'
  | 'hamburger-overlay'
  | 'tabs-style'
  | 'breadcrumb-style';

export type HoverEffect =
  | 'highlight'
  | 'underline-slide'
  | 'underline-center'
  | 'background-fill'
  | 'text-color-shift'
  | 'scale-up'
  | 'border-bottom'
  | 'glow'
  | 'none';

export interface MenuColorTheme {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  hoverBackgroundColor: string;
  hoverTextColor: string;
  activeColor: string;
  borderColor: string;
  subMenuBackground: string;
  accentColor: string;
}

export interface MenuConfig {
  design_style: MenuDesignStyle;
  hover_effect: HoverEffect;
  color_theme_id: string;
  custom_colors: MenuColorTheme;
  font_size: number;
  font_weight: string;
  letter_spacing: number;
  border_radius: number;
  item_padding_x: number;
  item_padding_y: number;
  show_icons: boolean;
  animate_submenu: boolean;
  submenu_indicator: 'arrow' | 'chevron' | 'dot' | 'none';
  sticky: boolean;
  blur_on_scroll: boolean;
  linked_decade_theme?: string;
}

// ─── Preset Color Themes ────────────────────────────────────────────────────────

const PRESET_COLOR_THEMES: MenuColorTheme[] = [
  {
    id: 'light-clean',
    name: 'Hell & Klar',
    backgroundColor: '#ffffff',
    textColor: '#1a1a2e',
    hoverBackgroundColor: '#f0f0f0',
    hoverTextColor: '#007bff',
    activeColor: '#007bff',
    borderColor: '#e0e0e0',
    subMenuBackground: '#ffffff',
    accentColor: '#007bff',
  },
  {
    id: 'dark-modern',
    name: 'Dunkel Modern',
    backgroundColor: '#1a1a2e',
    textColor: '#e0e0e0',
    hoverBackgroundColor: '#2a2a4e',
    hoverTextColor: '#bb86fc',
    activeColor: '#bb86fc',
    borderColor: '#333366',
    subMenuBackground: '#16213e',
    accentColor: '#bb86fc',
  },
  {
    id: 'neon-90s',
    name: 'Neon 90er',
    backgroundColor: '#000000',
    textColor: '#00ffff',
    hoverBackgroundColor: '#1a001a',
    hoverTextColor: '#ff00ff',
    activeColor: '#ffff00',
    borderColor: '#ff00ff',
    subMenuBackground: '#0d0d0d',
    accentColor: '#ff00ff',
  },
  {
    id: 'web20-gloss',
    name: 'Web 2.0 Gloss',
    backgroundColor: '#4a90e2',
    textColor: '#ffffff',
    hoverBackgroundColor: '#2b6cb0',
    hoverTextColor: '#ffffff',
    activeColor: '#f6c90e',
    borderColor: '#2b6cb0',
    subMenuBackground: '#3b7dd8',
    accentColor: '#f6c90e',
  },
  {
    id: 'flat-material',
    name: 'Flat Material',
    backgroundColor: '#2196F3',
    textColor: '#ffffff',
    hoverBackgroundColor: '#1976D2',
    hoverTextColor: '#ffffff',
    activeColor: '#FF5722',
    borderColor: '#1565C0',
    subMenuBackground: '#1e88e5',
    accentColor: '#FF5722',
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism',
    backgroundColor: 'rgba(255,255,255,0.15)',
    textColor: '#ffffff',
    hoverBackgroundColor: 'rgba(255,255,255,0.25)',
    hoverTextColor: '#ffffff',
    activeColor: '#f093fb',
    borderColor: 'rgba(255,255,255,0.3)',
    subMenuBackground: 'rgba(255,255,255,0.2)',
    accentColor: '#f093fb',
  },
  {
    id: 'neumorphism',
    name: 'Neumorphism',
    backgroundColor: '#e0e5ec',
    textColor: '#2c3e50',
    hoverBackgroundColor: '#d1d9e6',
    hoverTextColor: '#6c63ff',
    activeColor: '#6c63ff',
    borderColor: '#c8d0e0',
    subMenuBackground: '#e8edf3',
    accentColor: '#6c63ff',
  },
  {
    id: 'forest-green',
    name: 'Wald & Natur',
    backgroundColor: '#1b4332',
    textColor: '#d8f3dc',
    hoverBackgroundColor: '#2d6a4f',
    hoverTextColor: '#b7e4c7',
    activeColor: '#52b788',
    borderColor: '#40916c',
    subMenuBackground: '#1b4332',
    accentColor: '#52b788',
  },
];

// ─── Menu Design Definitions ────────────────────────────────────────────────────

const MENU_DESIGNS: { id: MenuDesignStyle; name: string; description: string; icon: string; decade?: string }[] = [
  { id: 'horizontal-classic', name: 'Horizontal Klassisch', description: 'Standard horizontale Navigation mit Dropdown-Untermenüs', icon: '≡', decade: 'universal' },
  { id: 'horizontal-underline', name: 'Horizontal Unterstrich', description: 'Links mit animiertem Unterstrich-Hover-Effekt', icon: '_', decade: '2010s' },
  { id: 'horizontal-pill', name: 'Horizontal Pill', description: 'Abgerundete Pill-Buttons in der Navigation', icon: '●', decade: '2020s' },
  { id: 'horizontal-bordered', name: 'Horizontal Bordered', description: 'Items mit sichtbaren Rahmen, 90er Stil', icon: '□', decade: '90s' },
  { id: 'vertical-sidebar', name: 'Vertikal Sidebar', description: 'Seitliche vertikale Navigation', icon: '|', decade: 'universal' },
  { id: 'vertical-accordion', name: 'Vertikal Accordion', description: 'Ausklappbare Gruppen in der Seitenleiste', icon: '⊞', decade: '2000s' },
  { id: 'mega-menu', name: 'Mega Menu', description: 'Breite Dropdown-Panels für viele Links', icon: '⊟', decade: '2010s' },
  { id: 'hamburger-overlay', name: 'Hamburger Overlay', description: 'Vollbild-Overlay-Menü für mobile Geräte', icon: '☰', decade: '2020s' },
  { id: 'tabs-style', name: 'Tabs Style', description: 'Tab-artige Navigation im Windows-Stil', icon: '⬜', decade: '2000s' },
  { id: 'breadcrumb-style', name: 'Breadcrumb', description: 'Hierarchische Pfad-Navigation', icon: '›', decade: 'universal' },
];

const HOVER_EFFECTS: { id: HoverEffect; name: string; description: string }[] = [
  { id: 'highlight', name: 'Hintergrund-Highlight', description: 'Hintergrund wechselt beim Hover' },
  { id: 'underline-slide', name: 'Gleitender Unterstrich', description: 'Unterstrich gleitet von links nach rechts' },
  { id: 'underline-center', name: 'Mittlerer Unterstrich', description: 'Unterstrich expandiert von der Mitte' },
  { id: 'background-fill', name: 'Hintergrund-Füller', description: 'Hintergrundfarbe füllt sich auf' },
  { id: 'text-color-shift', name: 'Farb-Wechsel', description: 'Textfarbe wechselt fließend' },
  { id: 'scale-up', name: 'Vergrößern', description: 'Element wird leicht größer' },
  { id: 'border-bottom', name: 'Unterer Rahmen', description: 'Farbiger Rahmen erscheint unten' },
  { id: 'glow', name: 'Leuchten (Glow)', description: 'Leuchteffekt um den Text (90er Neon)' },
  { id: 'none', name: 'Kein Effekt', description: 'Kein Hover-Effekt' },
];

// ─── Default Config ─────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: MenuConfig = {
  design_style: 'horizontal-classic',
  hover_effect: 'highlight',
  color_theme_id: 'light-clean',
  custom_colors: PRESET_COLOR_THEMES[0],
  font_size: 15,
  font_weight: '500',
  letter_spacing: 0,
  border_radius: 4,
  item_padding_x: 16,
  item_padding_y: 8,
  show_icons: true,
  animate_submenu: true,
  submenu_indicator: 'chevron',
  sticky: false,
  blur_on_scroll: false,
};

// ─── Helper to generate CSS for hover effects ───────────────────────────────────

export function generateMenuCSS(config: MenuConfig): string {
  const c = config.custom_colors;
  const hoverCSS: Record<HoverEffect, string> = {
    highlight: `
      .nav-item:hover { background-color: ${c.hoverBackgroundColor} !important; color: ${c.hoverTextColor} !important; }
    `,
    'underline-slide': `
      .nav-item { position: relative; }
      .nav-item::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: ${c.accentColor}; transition: width 0.3s ease; }
      .nav-item:hover::after { width: 100%; }
      .nav-item:hover { color: ${c.hoverTextColor} !important; }
    `,
    'underline-center': `
      .nav-item { position: relative; }
      .nav-item::after { content: ''; position: absolute; bottom: 0; left: 50%; width: 0; height: 2px; background: ${c.accentColor}; transition: all 0.3s ease; transform: translateX(-50%); }
      .nav-item:hover::after { width: 80%; }
      .nav-item:hover { color: ${c.hoverTextColor} !important; }
    `,
    'background-fill': `
      .nav-item { transition: all 0.3s ease; }
      .nav-item:hover { background-color: ${c.hoverBackgroundColor} !important; color: ${c.hoverTextColor} !important; }
    `,
    'text-color-shift': `
      .nav-item { transition: color 0.3s ease; }
      .nav-item:hover { color: ${c.hoverTextColor} !important; }
    `,
    'scale-up': `
      .nav-item { transition: transform 0.2s ease, color 0.2s ease; }
      .nav-item:hover { transform: scale(1.05); color: ${c.hoverTextColor} !important; }
    `,
    'border-bottom': `
      .nav-item { border-bottom: 3px solid transparent; transition: border-color 0.3s ease, color 0.3s ease; }
      .nav-item:hover { border-bottom-color: ${c.accentColor}; color: ${c.hoverTextColor} !important; }
    `,
    glow: `
      .nav-item { transition: text-shadow 0.3s ease, color 0.3s ease; }
      .nav-item:hover { text-shadow: 0 0 8px ${c.accentColor}, 0 0 20px ${c.accentColor}; color: ${c.hoverTextColor} !important; }
    `,
    none: '',
  };
  return `
    .nav-container { background-color: ${c.backgroundColor}; border-color: ${c.borderColor}; }
    .nav-item { color: ${c.textColor}; font-size: ${config.font_size}px; font-weight: ${config.font_weight}; letter-spacing: ${config.letter_spacing}px; padding: ${config.item_padding_y}px ${config.item_padding_x}px; border-radius: ${config.border_radius}px; }
    .nav-item.active { color: ${c.activeColor}; }
    .nav-submenu { background-color: ${c.subMenuBackground}; }
    ${hoverCSS[config.hover_effect]}
  `;
}

// ─── NavigationItem Editor ──────────────────────────────────────────────────────

interface NavItemEditorProps {
  items: NavigationItem[];
  onChange: (items: NavigationItem[]) => void;
}

let _nextId = -1;
const nextTempId = () => _nextId--;

const NavItemEditor: React.FC<NavItemEditorProps> = ({ items, onChange }) => {
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false);
  const [availablePages, setAvailablePages] = useState<Array<{ id: number; title: string; slug: string }>>([]);
  const [loadingPages, setLoadingPages] = useState(false);

  const loadPages = async () => {
    try {
      setLoadingPages(true);
      const pages = await layoutsApi.getPages();
      setAvailablePages(pages.map(p => ({ id: p.id, title: p.title, slug: p.slug })));
    } catch (err) {
      console.error('Error loading pages:', err);
    } finally {
      setLoadingPages(false);
    }
  };

  const openEdit = (item: NavigationItem) => {
    setEditingItem({ ...item });
    loadPages();
    setEditDialogOpen(true);
  };

  const openAdd = (parentId: number | null = null) => {
    setEditingItem({
      id: nextTempId(),
      label: '',
      url: '#',
      order: items.length,
      parent: parentId,
      is_external: false,
      is_visible: true,
      children: [],
    });
    loadPages();
    setEditDialogOpen(true);
  };

  const saveItem = () => {
    if (!editingItem) return;
    const isNew = editingItem.id < 0;

    if (editingItem.parent === null) {
      if (isNew) {
        onChange([...items, editingItem]);
      } else {
        onChange(items.map(i => i.id === editingItem.id ? { ...editingItem } : i));
      }
    } else {
      const updateChildren = (list: NavigationItem[]): NavigationItem[] =>
        list.map(item => {
          if (item.id === editingItem.parent) {
            const children = item.children || [];
            if (isNew) {
              return { ...item, children: [...children, editingItem] };
            } else {
              return { ...item, children: children.map(c => c.id === editingItem.id ? editingItem : c) };
            }
          }
          if (item.children?.length) return { ...item, children: updateChildren(item.children) };
          return item;
        });
      onChange(updateChildren(items));
    }
    setEditDialogOpen(false);
    setEditingItem(null);
  };

  const deleteItem = (id: number, parentId: number | null) => {
    if (parentId === null) {
      onChange(items.filter(i => i.id !== id));
    } else {
      const removeFromChildren = (list: NavigationItem[]): NavigationItem[] =>
        list.map(item => {
          if (item.id === parentId) {
            return { ...item, children: (item.children || []).filter(c => c.id !== id) };
          }
          if (item.children?.length) return { ...item, children: removeFromChildren(item.children) };
          return item;
        });
      onChange(removeFromChildren(items));
    }
  };

  const moveItem = (id: number, parentId: number | null, direction: 'up' | 'down') => {
    const moveInList = (list: NavigationItem[]): NavigationItem[] => {
      const idx = list.findIndex(i => i.id === id);
      if (idx === -1) return list;
      const newList = [...list];
      if (direction === 'up' && idx > 0) {
        [newList[idx - 1], newList[idx]] = [newList[idx], newList[idx - 1]];
      } else if (direction === 'down' && idx < list.length - 1) {
        [newList[idx], newList[idx + 1]] = [newList[idx + 1], newList[idx]];
      }
      return newList;
    };

    if (parentId === null) {
      onChange(moveInList(items));
    } else {
      const updateParent = (list: NavigationItem[]): NavigationItem[] =>
        list.map(item => {
          if (item.id === parentId) return { ...item, children: moveInList(item.children || []) };
          if (item.children?.length) return { ...item, children: updateParent(item.children) };
          return item;
        });
      onChange(updateParent(items));
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const renderItem = (item: NavigationItem, parentId: number | null, index: number, total: number) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <Box key={item.id}>
        <ListItem
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            mb: 0.5,
            bgcolor: parentId !== null ? 'action.hover' : 'background.paper',
            pl: parentId !== null ? 4 : 2,
          }}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            <DragIndicator fontSize="small" color="disabled" />
          </ListItemIcon>
          {hasChildren && (
            <IconButton size="small" onClick={() => toggleExpand(item.id)}>
              {isExpanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
            </IconButton>
          )}
          {!hasChildren && <Box sx={{ width: 28 }} />}
          {parentId !== null && (
            <SubdirectoryArrowRight fontSize="small" color="disabled" sx={{ mr: 0.5 }} />
          )}
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" fontWeight={500}>{item.label || '(kein Name)'}</Typography>
                {item.is_external && <OpenInNew fontSize="inherit" color="action" />}
                {!item.is_visible && <Chip label="versteckt" size="small" color="warning" />}
                {hasChildren && (
                  <Chip label={`${item.children!.length} Untermenü`} size="small" variant="outlined" />
                )}
              </Box>
            }
            secondary={item.url}
          />
          <ListItemSecondaryAction>
            <Tooltip title="Untermenü hinzufügen">
              <IconButton size="small" onClick={() => openAdd(item.id)}>
                <Add fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Bearbeiten">
              <IconButton size="small" onClick={() => openEdit(item)}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Nach oben">
              <span>
                <IconButton size="small" disabled={index === 0} onClick={() => moveItem(item.id, parentId, 'up')}>
                  <ArrowUpward fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Nach unten">
              <span>
                <IconButton size="small" disabled={index === total - 1} onClick={() => moveItem(item.id, parentId, 'down')}>
                  <ArrowDownward fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Löschen">
              <IconButton size="small" color="error" onClick={() => deleteItem(item.id, parentId)}>
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          </ListItemSecondaryAction>
        </ListItem>
        {hasChildren && isExpanded && (
          <Collapse in={isExpanded}>
            <Box sx={{ ml: 3 }}>
              {item.children!.map((child, ci) => renderItem(child, item.id, ci, item.children!.length))}
            </Box>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={600}>Menü-Einträge</Typography>
        <Button startIcon={<Add />} variant="outlined" size="small" onClick={() => openAdd(null)}>
          Hauptpunkt hinzufügen
        </Button>
      </Box>

      {items.length === 0 && (
        <Alert severity="info">Noch keine Menüeinträge. Fügen Sie den ersten Hauptpunkt hinzu.</Alert>
      )}

      <List disablePadding>
        {items.map((item, i) => renderItem(item, null, i, items.length))}
      </List>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem && editingItem.id < 0 ? 'Neuer Menüeintrag' : 'Menüeintrag bearbeiten'}
        </DialogTitle>
        {editingItem && (
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Bezeichnung"
                value={editingItem.label}
                onChange={e => setEditingItem({ ...editingItem, label: e.target.value })}
                fullWidth
                required
              />

              {/* Link Type Toggle */}
              <FormControlLabel
                control={
                  <Switch
                    checked={editingItem.is_external}
                    onChange={e => {
                      const isExternal = e.target.checked;
                      setEditingItem({
                        ...editingItem,
                        is_external: isExternal,
                        url: isExternal ? 'https://' : (availablePages[0]?.slug ? `/${availablePages[0].slug}` : '/')
                      });
                    }}
                  />
                }
                label={editingItem.is_external ? "Externer Link" : "Interne Seite"}
              />

              {/* Internal Page Selection */}
              {!editingItem.is_external && (
                <TextField
                  select
                  label="Seite auswählen"
                  value={availablePages.find(p => `/${p.slug}` === editingItem.url)?.id || ''}
                  onChange={e => {
                    const pageId = e.target.value;
                    const selectedPage = availablePages.find(p => p.id === Number(pageId));
                    if (selectedPage) {
                      setEditingItem({ ...editingItem, url: `/${selectedPage.slug}` });
                    }
                  }}
                  fullWidth
                  disabled={loadingPages}
                  helperText={loadingPages ? 'Seiten werden geladen...' : `URL: ${editingItem.url}`}
                >
                  {availablePages.length === 0 && !loadingPages && (
                    <MenuItem value="" disabled>
                      Keine Seiten verfügbar
                    </MenuItem>
                  )}
                  {availablePages.map((page) => (
                    <MenuItem key={page.id} value={page.id}>
                      {page.title} <Typography component="span" color="text.secondary" sx={{ ml: 1 }}>(/{page.slug})</Typography>
                    </MenuItem>
                  ))}
                </TextField>
              )}

              {/* External URL Input */}
              {editingItem.is_external && (
                <TextField
                  label="Externe URL"
                  value={editingItem.url}
                  onChange={e => setEditingItem({ ...editingItem, url: e.target.value })}
                  fullWidth
                  placeholder="https://example.com"
                  helperText="Vollständige URL inkl. https://"
                  InputProps={{
                    startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} fontSize="small" />
                  }}
                />
              )}

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  label="Icon (optional)"
                  value={editingItem.icon_name || ''}
                  onChange={e => setEditingItem({ ...editingItem, icon_name: e.target.value })}
                  sx={{ flex: 1 }}
                  placeholder="z.B. Home, Star, Info"
                />
                <Button variant="outlined" size="small" onClick={() => setIconSelectorOpen(true)}>
                  Icon wählen
                </Button>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={editingItem.is_external}
                    onChange={e => setEditingItem({ ...editingItem, is_external: e.target.checked })}
                  />
                }
                label="In neuem Tab öffnen"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={editingItem.is_visible}
                    onChange={e => setEditingItem({ ...editingItem, is_visible: e.target.checked })}
                  />
                }
                label="Sichtbar"
              />
            </Stack>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Abbrechen</Button>
          <Button
            variant="contained"
            onClick={saveItem}
            disabled={!editingItem?.label}
          >
            Speichern
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={iconSelectorOpen} onClose={() => setIconSelectorOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Icon auswählen</DialogTitle>
        <DialogContent>
          <IconSelector
            value={editingItem?.icon_name || ''}
            onChange={(icon) => {
              if (editingItem) setEditingItem({ ...editingItem, icon_name: icon });
              setIconSelectorOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

// ─── Live Menu Preview ──────────────────────────────────────────────────────────

interface MenuPreviewProps {
  items: NavigationItem[];
  config: MenuConfig;
}

const MenuPreview: React.FC<MenuPreviewProps> = ({ items, config }) => {
  const c = config.custom_colors;
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [openSub, setOpenSub] = useState<number | null>(null);

  const getHoverStyle = (isHovered: boolean): React.CSSProperties => {
    if (!isHovered) return {};
    switch (config.hover_effect) {
      case 'highlight':
      case 'background-fill':
        return { backgroundColor: c.hoverBackgroundColor, color: c.hoverTextColor };
      case 'text-color-shift':
        return { color: c.hoverTextColor };
      case 'scale-up':
        return { transform: 'scale(1.08)', color: c.hoverTextColor };
      case 'glow':
        return { textShadow: `0 0 8px ${c.accentColor}, 0 0 20px ${c.accentColor}`, color: c.hoverTextColor };
      default:
        return { color: c.hoverTextColor };
    }
  };

  const underlineStyle = (isHovered: boolean): React.CSSProperties =>
    ['underline-slide', 'underline-center', 'border-bottom'].includes(config.hover_effect) && isHovered
      ? { borderBottom: `2px solid ${c.accentColor}` }
      : {};

  const itemBase: React.CSSProperties = {
    color: c.textColor,
    fontSize: `${config.font_size}px`,
    fontWeight: config.font_weight,
    letterSpacing: `${config.letter_spacing}px`,
    padding: `${config.item_padding_y}px ${config.item_padding_x}px`,
    borderRadius: `${config.border_radius}px`,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    userSelect: 'none',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    whiteSpace: 'nowrap',
  };

  if (config.design_style === 'horizontal-bordered') {
    Object.assign(itemBase, { border: `1px solid ${c.borderColor}` });
  }
  if (config.design_style === 'horizontal-pill') {
    Object.assign(itemBase, { borderRadius: 999 });
  }
  if (config.design_style === 'tabs-style') {
    Object.assign(itemBase, {
      borderRadius: '4px 4px 0 0',
      borderBottom: 'none',
      border: `1px solid ${c.borderColor}`,
      borderBottomColor: c.backgroundColor,
    });
  }

  const renderPreviewItem = (item: NavigationItem, depth = 0) => {
    const isHovered = hoveredId === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openSub === item.id;

    if (config.design_style === 'vertical-sidebar' || config.design_style === 'vertical-accordion') {
      return (
        <Box key={item.id} sx={{ position: 'relative' }}>
          <Box
            style={{ ...itemBase, ...getHoverStyle(isHovered), ...underlineStyle(isHovered), paddingLeft: depth * 16 + config.item_padding_x }}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => hasChildren && setOpenSub(isOpen ? null : item.id)}
          >
            <span>{item.label}</span>
            {hasChildren && (isOpen ? <ExpandLess fontSize="inherit" /> : <ExpandMore fontSize="inherit" />)}
          </Box>
          {hasChildren && isOpen && (
            <Box style={{ backgroundColor: c.subMenuBackground, paddingLeft: 16 }}>
              {item.children!.map(c => renderPreviewItem(c, depth + 1))}
            </Box>
          )}
        </Box>
      );
    }

    return (
      <Box key={item.id} sx={{ position: 'relative', display: 'inline-block' }}>
        <Box
          style={{ ...itemBase, ...getHoverStyle(isHovered), ...underlineStyle(isHovered) }}
          onMouseEnter={() => { setHoveredId(item.id); if (hasChildren) setOpenSub(item.id); }}
          onMouseLeave={() => { setHoveredId(null); setTimeout(() => setOpenSub(null), 200); }}
        >
          <span>{item.label}</span>
          {hasChildren && config.submenu_indicator !== 'none' && (
            <span style={{ fontSize: 10 }}>
              {config.submenu_indicator === 'chevron' ? '▾' : config.submenu_indicator === 'arrow' ? '→' : '•'}
            </span>
          )}
        </Box>
        {hasChildren && isOpen && (
          <Box
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              backgroundColor: c.subMenuBackground,
              border: `1px solid ${c.borderColor}`,
              borderRadius: config.border_radius,
              minWidth: 180,
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              zIndex: 999,
            }}
            onMouseEnter={() => setOpenSub(item.id)}
            onMouseLeave={() => setOpenSub(null)}
          >
            {item.children!.map(child => (
              <Box
                key={child.id}
                style={{ ...itemBase, display: 'flex', borderRadius: 0 }}
                onMouseEnter={() => setHoveredId(child.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {child.label}
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  };

  const isVertical = config.design_style === 'vertical-sidebar' || config.design_style === 'vertical-accordion';

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
        Live-Vorschau (Hover testen)
      </Typography>
      <Box
        style={{
          backgroundColor: c.backgroundColor,
          border: `1px solid ${c.borderColor}`,
          borderRadius: 8,
          padding: isVertical ? 0 : '4px 8px',
          display: 'flex',
          flexDirection: isVertical ? 'column' : 'row',
          alignItems: isVertical ? 'stretch' : 'center',
          gap: config.design_style === 'tabs-style' ? 2 : 0,
          flexWrap: 'wrap',
          minHeight: 52,
          overflow: 'hidden',
          maxWidth: isVertical ? 260 : '100%',
        }}
      >
        {items.filter(i => i.is_visible !== false).map(item => renderPreviewItem(item))}
        {items.length === 0 && (
          <Typography variant="body2" style={{ color: c.textColor, opacity: 0.5, padding: '8px 16px' }}>
            (Keine Menüpunkte)
          </Typography>
        )}
      </Box>
    </Box>
  );
};

// ─── Main MenuEditor ─────────────────────────────────────────────────────────────

const MenuEditor: React.FC = () => {
  const [template, setTemplate] = useState<GlobalTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);

  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [menuConfig, setMenuConfig] = useState<MenuConfig>(DEFAULT_CONFIG);
  const [useCustomColors, setUseCustomColors] = useState(false); // eslint-disable-line @typescript-eslint/no-unused-vars

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      const all = await globalTemplatesApi.getAll();
      const nav = all.find(t => t.template_type === 'navigation');
      if (nav) {
        setTemplate(nav);
        setNavItems(nav.nav_items || []);
        if (nav.metadata?.menu_config) {
          const mc: MenuConfig = nav.metadata.menu_config;
          setMenuConfig(mc);
          const isPreset = PRESET_COLOR_THEMES.some(t => t.id === mc.color_theme_id);
          setUseCustomColors(!isPreset);
        }
      }
    } catch (err) {
      setError('Fehler beim Laden des Navigations-Templates.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!template) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updatedTemplate = await globalTemplatesApi.update(template.id, {
        nav_items: navItems,
        style: menuConfig.design_style,
        background_color: menuConfig.custom_colors.backgroundColor,
        text_color: menuConfig.custom_colors.textColor,
        metadata: {
          ...template.metadata,
          menu_config: menuConfig,
          generated_css: generateMenuCSS(menuConfig),
        },
      });
      setTemplate(updatedTemplate);
      setSuccess('Menü erfolgreich gespeichert!');
    } catch (err) {
      setError('Fehler beim Speichern. Bitte versuchen Sie es erneut.');
    } finally {
      setSaving(false);
    }
  };

  const applyPresetColorTheme = (themeId: string) => {
    const preset = PRESET_COLOR_THEMES.find(t => t.id === themeId);
    if (preset) {
      setMenuConfig(prev => ({ ...prev, color_theme_id: themeId, custom_colors: { ...preset } }));
    }
  };

  const applyDecadeTheme = (dt: DecadeTheme) => {
    const colors: MenuColorTheme = {
      id: `decade-${dt.id}`,
      name: dt.name,
      backgroundColor: dt.primaryColor,
      textColor: dt.backgroundColor,
      hoverBackgroundColor: dt.secondaryColor,
      hoverTextColor: dt.backgroundColor,
      activeColor: dt.accentColor || dt.secondaryColor,
      borderColor: dt.secondaryColor,
      subMenuBackground: dt.primaryColor,
      accentColor: dt.accentColor || dt.secondaryColor,
    };

    const styleMap: Record<string, MenuDesignStyle> = {
      '90s': 'horizontal-bordered',
      '2000s': 'tabs-style',
      '2010s': 'horizontal-underline',
      '2020s': 'horizontal-pill',
    };
    const hoverMap: Record<string, HoverEffect> = {
      '90s': 'glow',
      '2000s': 'background-fill',
      '2010s': 'underline-center',
      '2020s': 'scale-up',
    };

    setMenuConfig(prev => ({
      ...prev,
      custom_colors: colors,
      color_theme_id: colors.id,
      design_style: styleMap[dt.decade] || prev.design_style,
      hover_effect: hoverMap[dt.decade] || prev.hover_effect,
      border_radius: dt.borderRadius,
      font_size: 15,
      linked_decade_theme: dt.id,
    }));
  };

  const updateConfig = <K extends keyof MenuConfig>(key: K, value: MenuConfig[K]) => {
    setMenuConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateCustomColor = (key: keyof MenuColorTheme, value: string) => {
    setMenuConfig(prev => ({
      ...prev,
      custom_colors: { ...prev.custom_colors, [key]: value },
      color_theme_id: 'custom',
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Menü-Editor
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Erstellen Sie Menüs mit Untermenüs, Hover-Effekten und Farbthemen
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Save />}
          onClick={handleSave}
          disabled={saving || !template}
          size="large"
        >
          {saving ? 'Speichern…' : 'Menü speichern'}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}
      {!template && !loading && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Kein Navigations-Template gefunden. Bitte erstellen Sie zunächst ein Template unter "Global Templates".
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Panel: Settings */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Paper sx={{ p: 0, overflow: 'hidden' }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Menü-Einträge" icon={<MenuIcon />} iconPosition="start" />
              <Tab label="Design-Stil" icon={<Widgets />} iconPosition="start" />
              <Tab label="Farb-Theme" icon={<Palette />} iconPosition="start" />
              <Tab label="Typografie & Abstände" icon={<TextFields />} iconPosition="start" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {/* Tab 0: Menu Items */}
              {activeTab === 0 && (
                <NavItemEditor items={navItems} onChange={setNavItems} />
              )}

              {/* Tab 1: Design Style */}
              {activeTab === 1 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Menü-Design wählen
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {MENU_DESIGNS.map(design => (
                      <Grid size={{ xs: 6, sm: 4 }} key={design.id}>
                        <Card
                          variant={menuConfig.design_style === design.id ? 'elevation' : 'outlined'}
                          sx={{
                            cursor: 'pointer',
                            border: menuConfig.design_style === design.id ? 2 : 1,
                            borderColor: menuConfig.design_style === design.id ? 'primary.main' : 'divider',
                            transition: 'all 0.2s',
                            '&:hover': { borderColor: 'primary.light' },
                          }}
                          onClick={() => updateConfig('design_style', design.id)}
                        >
                          <CardActionArea>
                            <CardContent sx={{ textAlign: 'center', py: 2 }}>
                              <Typography variant="h4" sx={{ mb: 0.5, lineHeight: 1 }}>
                                {design.icon}
                              </Typography>
                              <Typography variant="caption" fontWeight={600} display="block">
                                {design.name}
                              </Typography>
                              {design.decade && design.decade !== 'universal' && (
                                <Chip label={design.decade} size="small" sx={{ mt: 0.5, fontSize: 10 }} />
                              )}
                              {menuConfig.design_style === design.id && (
                                <CheckCircle color="primary" sx={{ position: 'absolute', top: 8, right: 8, fontSize: 18 }} />
                              )}
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Hover-Effekt
                  </Typography>
                  <Grid container spacing={1.5}>
                    {HOVER_EFFECTS.map(effect => (
                      <Grid size={{ xs: 12, sm: 6 }} key={effect.id}>
                        <Box
                          onClick={() => updateConfig('hover_effect', effect.id)}
                          sx={{
                            p: 1.5,
                            border: 2,
                            borderRadius: 1,
                            cursor: 'pointer',
                            borderColor: menuConfig.hover_effect === effect.id ? 'primary.main' : 'divider',
                            bgcolor: menuConfig.hover_effect === effect.id ? 'primary.50' : 'transparent',
                            '&:hover': { borderColor: 'primary.light' },
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {menuConfig.hover_effect === effect.id && <CheckCircle color="primary" fontSize="small" />}
                            <Box>
                              <Typography variant="body2" fontWeight={600}>{effect.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{effect.description}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>

                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Weitere Design-Optionen
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Untermenü-Indikator</InputLabel>
                        <Select
                          value={menuConfig.submenu_indicator}
                          label="Untermenü-Indikator"
                          onChange={e => updateConfig('submenu_indicator', e.target.value as MenuConfig['submenu_indicator'])}
                        >
                          <MenuItem value="chevron">Chevron (▾)</MenuItem>
                          <MenuItem value="arrow">Pfeil (→)</MenuItem>
                          <MenuItem value="dot">Punkt (•)</MenuItem>
                          <MenuItem value="none">Keiner</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControlLabel
                        control={<Switch checked={menuConfig.show_icons} onChange={e => updateConfig('show_icons', e.target.checked)} />}
                        label="Icons anzeigen"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControlLabel
                        control={<Switch checked={menuConfig.animate_submenu} onChange={e => updateConfig('animate_submenu', e.target.checked)} />}
                        label="Untermenü animieren"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControlLabel
                        control={<Switch checked={menuConfig.sticky} onChange={e => updateConfig('sticky', e.target.checked)} />}
                        label="Sticky Navigation"
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Tab 2: Color Theme */}
              {activeTab === 2 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Vorgefertigte Farb-Themes
                  </Typography>
                  <Grid container spacing={1.5} sx={{ mb: 3 }}>
                    {PRESET_COLOR_THEMES.map(preset => (
                      <Grid size={{ xs: 6, sm: 4 }} key={preset.id}>
                        <Card
                          variant={menuConfig.color_theme_id === preset.id ? 'elevation' : 'outlined'}
                          sx={{
                            cursor: 'pointer',
                            border: 2,
                            borderColor: menuConfig.color_theme_id === preset.id ? 'primary.main' : 'divider',
                            overflow: 'hidden',
                          }}
                          onClick={() => applyPresetColorTheme(preset.id)}
                        >
                          <CardActionArea>
                            <Box
                              sx={{
                                height: 40,
                                background: preset.backgroundColor,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 0.5,
                                px: 1,
                              }}
                            >
                              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: preset.textColor }} />
                              <Typography
                                variant="caption"
                                sx={{ color: preset.textColor, fontSize: 9, fontWeight: 600 }}
                                noWrap
                              >
                                {preset.name}
                              </Typography>
                              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: preset.accentColor }} />
                            </Box>
                            <CardContent sx={{ p: 1, textAlign: 'center' }}>
                              <Typography variant="caption">{preset.name}</Typography>
                              {menuConfig.color_theme_id === preset.id && (
                                <CheckCircle color="primary" sx={{ fontSize: 14, ml: 0.5 }} />
                              )}
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Aus Dekaden-Theme übernehmen
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Wählen Sie ein Dekaden-Design – Farben und Stil werden automatisch angepasst.
                  </Typography>
                  <Grid container spacing={1.5} sx={{ mb: 3 }}>
                    {decadeThemes.map(dt => (
                      <Grid size={{ xs: 6, sm: 4, md: 3 }} key={dt.id}>
                        <Card
                          variant={menuConfig.linked_decade_theme === dt.id ? 'elevation' : 'outlined'}
                          sx={{
                            cursor: 'pointer',
                            border: 2,
                            borderColor: menuConfig.linked_decade_theme === dt.id ? 'secondary.main' : 'divider',
                            overflow: 'hidden',
                          }}
                          onClick={() => applyDecadeTheme(dt)}
                        >
                          <CardActionArea>
                            <Box
                              sx={{
                                height: 36,
                                background: `linear-gradient(135deg, ${dt.primaryColor} 0%, ${dt.secondaryColor} 100%)`,
                              }}
                            />
                            <CardContent sx={{ p: 1, textAlign: 'center' }}>
                              <Typography variant="caption" fontWeight={600} display="block">{dt.name}</Typography>
                              <Chip label={dt.decade} size="small" sx={{ fontSize: 9, height: 16 }} />
                            </CardContent>
                          </CardActionArea>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  <Divider sx={{ my: 2 }} />
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Typography variant="subtitle2" fontWeight={600}>
                        <FormatColorFill sx={{ mr: 1, fontSize: 18, verticalAlign: 'middle' }} />
                        Individuelle Farbanpassung
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {(Object.keys(menuConfig.custom_colors) as (keyof MenuColorTheme)[])
                          .filter(k => k !== 'id' && k !== 'name')
                          .map(colorKey => {
                            const labels: Record<string, string> = {
                              backgroundColor: 'Hintergrundfarbe',
                              textColor: 'Textfarbe',
                              hoverBackgroundColor: 'Hover-Hintergrund',
                              hoverTextColor: 'Hover-Textfarbe',
                              activeColor: 'Aktive Farbe',
                              borderColor: 'Rahmenfarbe',
                              subMenuBackground: 'Untermenü-Hintergrund',
                              accentColor: 'Akzentfarbe',
                            };
                            const val = menuConfig.custom_colors[colorKey] as string;
                            return (
                              <Grid size={{ xs: 6, sm: 4 }} key={colorKey}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Box
                                    component="input"
                                    type="color"
                                    value={val.startsWith('rgba') ? '#ffffff' : val}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                      updateCustomColor(colorKey, e.target.value)
                                    }
                                    sx={{ width: 40, height: 40, border: 'none', borderRadius: 1, cursor: 'pointer', p: 0 }}
                                  />
                                  <Typography variant="caption">{labels[colorKey] || colorKey}</Typography>
                                </Box>
                              </Grid>
                            );
                          })}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </Box>
              )}

              {/* Tab 3: Typography & Spacing */}
              {activeTab === 3 && (
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Schrift & Typografie
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" gutterBottom>
                        Schriftgröße: <strong>{menuConfig.font_size}px</strong>
                      </Typography>
                      <Slider
                        value={menuConfig.font_size}
                        min={11}
                        max={24}
                        step={1}
                        onChange={(_, v) => updateConfig('font_size', v as number)}
                        marks
                        valueLabelDisplay="auto"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Schriftstärke</InputLabel>
                        <Select
                          value={menuConfig.font_weight}
                          label="Schriftstärke"
                          onChange={e => updateConfig('font_weight', e.target.value)}
                        >
                          <MenuItem value="300">300 – Light</MenuItem>
                          <MenuItem value="400">400 – Regular</MenuItem>
                          <MenuItem value="500">500 – Medium</MenuItem>
                          <MenuItem value="600">600 – Semibold</MenuItem>
                          <MenuItem value="700">700 – Bold</MenuItem>
                          <MenuItem value="800">800 – ExtraBold</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" gutterBottom>
                        Buchstabenabstand: <strong>{menuConfig.letter_spacing}px</strong>
                      </Typography>
                      <Slider
                        value={menuConfig.letter_spacing}
                        min={-1}
                        max={8}
                        step={0.5}
                        onChange={(_, v) => updateConfig('letter_spacing', v as number)}
                        valueLabelDisplay="auto"
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 3 }} />
                  <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    Abstände & Form
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" gutterBottom>
                        Horizontales Padding: <strong>{menuConfig.item_padding_x}px</strong>
                      </Typography>
                      <Slider
                        value={menuConfig.item_padding_x}
                        min={4}
                        max={48}
                        step={2}
                        onChange={(_, v) => updateConfig('item_padding_x', v as number)}
                        valueLabelDisplay="auto"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" gutterBottom>
                        Vertikales Padding: <strong>{menuConfig.item_padding_y}px</strong>
                      </Typography>
                      <Slider
                        value={menuConfig.item_padding_y}
                        min={2}
                        max={24}
                        step={2}
                        onChange={(_, v) => updateConfig('item_padding_y', v as number)}
                        valueLabelDisplay="auto"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <Typography variant="body2" gutterBottom>
                        Border Radius: <strong>{menuConfig.border_radius}px</strong>
                      </Typography>
                      <Slider
                        value={menuConfig.border_radius}
                        min={0}
                        max={24}
                        step={1}
                        onChange={(_, v) => updateConfig('border_radius', v as number)}
                        valueLabelDisplay="auto"
                      />
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Right Panel: Live Preview */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Paper sx={{ p: 3, position: 'sticky', top: 24 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Visibility color="action" />
              <Typography variant="subtitle1" fontWeight={600}>Live-Vorschau</Typography>
              {menuConfig.linked_decade_theme && (
                <Chip
                  label={`Dekaden: ${menuConfig.linked_decade_theme}`}
                  size="small"
                  color="secondary"
                  variant="outlined"
                />
              )}
            </Box>

            <MenuPreview items={navItems} config={menuConfig} />

            <Divider sx={{ my: 3 }} />

            <Typography variant="subtitle2" gutterBottom fontWeight={600}>Aktuelle Konfiguration</Typography>
            <Stack spacing={0.5}>
              <Typography variant="caption">
                <strong>Design:</strong> {MENU_DESIGNS.find(d => d.id === menuConfig.design_style)?.name}
              </Typography>
              <Typography variant="caption">
                <strong>Hover-Effekt:</strong> {HOVER_EFFECTS.find(h => h.id === menuConfig.hover_effect)?.name}
              </Typography>
              <Typography variant="caption">
                <strong>Farb-Theme:</strong> {menuConfig.custom_colors.name}
              </Typography>
              <Typography variant="caption">
                <strong>Menüpunkte:</strong> {navItems.length} Hauptpunkte,{' '}
                {navItems.reduce((acc, i) => acc + (i.children?.length || 0), 0)} Untermenüs
              </Typography>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="caption" fontWeight={600}>Generiertes CSS (Vorschau)</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box
                  component="pre"
                  sx={{
                    fontSize: 10,
                    bgcolor: 'grey.900',
                    color: 'grey.100',
                    p: 1.5,
                    borderRadius: 1,
                    overflow: 'auto',
                    maxHeight: 200,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {generateMenuCSS(menuConfig)}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MenuEditor;
