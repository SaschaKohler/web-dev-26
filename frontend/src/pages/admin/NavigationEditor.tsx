import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Alert,
  Snackbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Chip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  ArrowUpward,
  ArrowDownward,
  DragIndicator,
} from '@mui/icons-material';
import { globalTemplatesApi, GlobalTemplate, NavigationItem } from '../../api/globalTemplates';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const NavigationEditor: React.FC = () => {
  const [navTemplates, setNavTemplates] = useState<GlobalTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<GlobalTemplate | null>(null);
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<NavigationItem | null>(null);
  const [_loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [formData, setFormData] = useState<Partial<NavigationItem>>({
    label: '',
    url: '',
    order: 0,
    icon_name: '',
    is_external: false,
    is_visible: true,
    parent: null,
  });

  useEffect(() => {
    loadNavTemplates();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      loadNavItems();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate]);

  const loadNavTemplates = async () => {
    try {
      const data = await globalTemplatesApi.getAll();
      const navs = data.filter(t => t.template_type === 'navigation');
      setNavTemplates(navs);
      if (navs.length > 0 && !selectedTemplate) {
        setSelectedTemplate(navs[0]);
      }
    } catch (error) {
      showSnackbar('Fehler beim Laden der Navigation Templates', 'error');
    }
  };

  const loadNavItems = async () => {
    if (!selectedTemplate) return;
    try {
      setLoading(true);
      const response = await axios.get<NavigationItem[]>(
        `${API_BASE_URL}/navigation-items/?template_id=${selectedTemplate.id}`
      );
      setNavItems(response.data.sort((a, b) => a.order - b.order));
    } catch (error) {
      showSnackbar('Fehler beim Laden der Navigation Items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSaveNavItem = async () => {
    if (!selectedTemplate) return;
    try {
      setLoading(true);
      const data = { ...formData, global_template: selectedTemplate.id };
      
      if (selectedItem) {
        await axios.patch(`${API_BASE_URL}/navigation-items/${selectedItem.id}/`, data);
        showSnackbar('Navigation Item erfolgreich aktualisiert', 'success');
      } else {
        await axios.post(`${API_BASE_URL}/navigation-items/`, data);
        showSnackbar('Navigation Item erfolgreich erstellt', 'success');
      }
      setEditDialogOpen(false);
      loadNavItems();
    } catch (error) {
      showSnackbar('Fehler beim Speichern des Navigation Items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNavItem = async (id: number) => {
    if (!window.confirm('Möchten Sie dieses Navigation Item wirklich löschen?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/navigation-items/${id}/`);
      showSnackbar('Navigation Item erfolgreich gelöscht', 'success');
      loadNavItems();
    } catch (error) {
      showSnackbar('Fehler beim Löschen des Navigation Items', 'error');
    }
  };

  const handleMoveItem = async (item: NavigationItem, direction: 'up' | 'down') => {
    const currentIndex = navItems.findIndex(i => i.id === item.id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === navItems.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const otherItem = navItems[newIndex];

    try {
      await Promise.all([
        axios.patch(`${API_BASE_URL}/navigation-items/${item.id}/`, { order: otherItem.order }),
        axios.patch(`${API_BASE_URL}/navigation-items/${otherItem.id}/`, { order: item.order }),
      ]);
      loadNavItems();
    } catch (error) {
      showSnackbar('Fehler beim Verschieben des Items', 'error');
    }
  };

  const openEditDialog = (item?: NavigationItem) => {
    if (item) {
      setSelectedItem(item);
      setFormData(item);
    } else {
      setSelectedItem(null);
      setFormData({
        label: '',
        url: '',
        order: navItems.length,
        icon_name: '',
        is_external: false,
        is_visible: true,
        parent: null,
      });
    }
    setEditDialogOpen(true);
  };

  const topLevelItems = navItems.filter(item => !item.parent);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Navigation Editor
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Verwalten Sie Ihre Website-Navigation mit Menüeinträgen und Dropdowns
      </Typography>

      {navTemplates.length === 0 ? (
        <Alert severity="warning">
          Keine Navigation Templates vorhanden. Bitte erstellen Sie zuerst ein Navigation Template.
        </Alert>
      ) : (
        <>
          <FormControl sx={{ mb: 3, minWidth: 300 }}>
            <InputLabel>Navigation Template</InputLabel>
            <Select
              value={selectedTemplate?.id || ''}
              onChange={(e) => {
                const template = navTemplates.find(t => t.id === e.target.value);
                setSelectedTemplate(template || null);
              }}
              label="Navigation Template"
            >
              {navTemplates.map(template => (
                <MenuItem key={template.id} value={template.id}>
                  {template.display_name} {template.is_active && '(Aktiv)'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedTemplate && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Navigation Items</Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => openEditDialog()}
                  >
                    Neues Item
                  </Button>
                </Box>

                {navItems.length === 0 ? (
                  <Alert severity="info">Keine Navigation Items vorhanden</Alert>
                ) : (
                  <List>
                    {topLevelItems.map((item, index) => (
                      <ListItem
                        key={item.id}
                        sx={{
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 1,
                          mb: 1,
                        }}
                      >
                        <DragIndicator sx={{ mr: 2, color: 'text.secondary' }} />
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {item.label}
                              {item.icon_name && <Chip label={item.icon_name} size="small" />}
                              {item.is_external && <Chip label="Extern" size="small" color="info" />}
                              {!item.is_visible && <Chip label="Versteckt" size="small" color="warning" />}
                            </Box>
                          }
                          secondary={item.url}
                        />
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleMoveItem(item, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUpward />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleMoveItem(item, 'down')}
                            disabled={index === topLevelItems.length - 1}
                          >
                            <ArrowDownward />
                          </IconButton>
                          <IconButton size="small" onClick={() => openEditDialog(item)} color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteNavItem(item.id)} color="error">
                            <Delete />
                          </IconButton>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Edit Navigation Item Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedItem ? 'Navigation Item bearbeiten' : 'Neues Navigation Item'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="URL"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              fullWidth
              required
              helperText="z.B. /about oder https://external.com"
            />
            <TextField
              label="Icon Name (MUI)"
              value={formData.icon_name}
              onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
              fullWidth
              helperText="z.B. Home, Person, Email"
            />
            <TextField
              label="Reihenfolge"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_external}
                  onChange={(e) => setFormData({ ...formData, is_external: e.target.checked })}
                />
              }
              label="Externer Link"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_visible}
                  onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                />
              }
              label="Sichtbar"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Abbrechen</Button>
          <Button onClick={handleSaveNavItem} variant="contained" startIcon={<Save />}>
            Speichern
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NavigationEditor;
