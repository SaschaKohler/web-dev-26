import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
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
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Close,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { globalTemplatesApi, GlobalTemplate, NavigationItem } from '../../api/globalTemplates';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const GlobalTemplatesManager: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [templates, setTemplates] = useState<GlobalTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<GlobalTemplate | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [navItemDialogOpen, setNavItemDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [formData, setFormData] = useState<Partial<GlobalTemplate>>({
    name: '',
    display_name: '',
    template_type: 'header',
    style: '',
    background_color: '#ffffff',
    text_color: '#333333',
    show_social_links: true,
    show_contact_info: true,
    is_active: true,
  });

  const [navItemForm, setNavItemForm] = useState<Partial<NavigationItem>>({
    label: '',
    url: '',
    order: 0,
    icon_name: '',
    is_external: false,
    is_visible: true,
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const data = await globalTemplatesApi.getAll();
      setTemplates(data);
    } catch (error) {
      showSnackbar('Fehler beim Laden der Templates', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSaveTemplate = async () => {
    // Validierung
    if (!formData.name || !formData.display_name) {
      showSnackbar('Bitte füllen Sie alle erforderlichen Felder aus', 'error');
      return;
    }

    try {
      setLoading(true);
      console.log('Saving template with data:', formData);
      
      if (selectedTemplate) {
        const result = await globalTemplatesApi.update(selectedTemplate.id, formData);
        console.log('Update result:', result);
        showSnackbar('Template erfolgreich aktualisiert', 'success');
      } else {
        const result = await globalTemplatesApi.create(formData);
        console.log('Create result:', result);
        showSnackbar('Template erfolgreich erstellt', 'success');
      }
      setEditDialogOpen(false);
      loadTemplates();
    } catch (error: any) {
      console.error('Error saving template:', error);
      console.error('Error response:', error.response);
      
      let errorMessage = 'Fehler beim Speichern des Templates';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.name) {
          errorMessage = `Name: ${error.response.data.name[0]}`;
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showSnackbar(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = async (id: number) => {
    if (!window.confirm('Möchten Sie dieses Template wirklich löschen?')) return;
    try {
      await globalTemplatesApi.delete(id);
      showSnackbar('Template erfolgreich gelöscht', 'success');
      loadTemplates();
    } catch (error) {
      showSnackbar('Fehler beim Löschen des Templates', 'error');
    }
  };

  const openEditDialog = (template?: GlobalTemplate) => {
    if (template) {
      setSelectedTemplate(template);
      setFormData(template);
    } else {
      setSelectedTemplate(null);
      setFormData({
        name: '',
        display_name: '',
        template_type: 'header',
        style: '',
        background_color: '#ffffff',
        text_color: '#333333',
        show_social_links: true,
        show_contact_info: true,
        is_active: true,
      });
    }
    setEditDialogOpen(true);
  };

  const getTemplatesByType = (type: string) => {
    return templates.filter(t => t.template_type === type);
  };

  const renderTemplateList = (type: string, typeName: string) => {
    const typeTemplates = getTemplatesByType(type);
    
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">{typeName} Templates</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setFormData({ ...formData, template_type: type as any });
              openEditDialog();
            }}
          >
            Neues {typeName} Template
          </Button>
        </Box>

        {typeTemplates.length === 0 ? (
          <Alert severity="info">Keine {typeName} Templates vorhanden</Alert>
        ) : (
          <Stack spacing={2}>
            {typeTemplates.map(template => (
              <Card key={template.id}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">{template.display_name}</Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {template.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Typography variant="caption">
                          Style: <strong>{template.style || 'Standard'}</strong>
                        </Typography>
                        <Typography variant="caption">
                          Status: <strong>{template.is_active ? 'Aktiv' : 'Inaktiv'}</strong>
                        </Typography>
                        {template.template_type === 'navigation' && (
                          <Typography variant="caption">
                            Nav Items: <strong>{template.nav_items?.length || 0}</strong>
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={() => openEditDialog(template)} color="primary">
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteTemplate(template.id)} color="error">
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    );
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Global Templates Verwaltung
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Verwalten Sie Header, Navigation und Footer Templates für Ihre Website
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="Header Templates" />
          <Tab label="Navigation Templates" />
          <Tab label="Footer Templates" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {renderTemplateList('header', 'Header')}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {renderTemplateList('navigation', 'Navigation')}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {renderTemplateList('footer', 'Footer')}
      </TabPanel>

      {/* Edit Template Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedTemplate ? 'Template bearbeiten' : 'Neues Template erstellen'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              label="Name (technisch)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Anzeigename"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Template Typ</InputLabel>
              <Select
                value={formData.template_type}
                onChange={(e) => setFormData({ ...formData, template_type: e.target.value as any })}
                label="Template Typ"
              >
                <MenuItem value="header">Header</MenuItem>
                <MenuItem value="navigation">Navigation</MenuItem>
                <MenuItem value="footer">Footer</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Style"
              value={formData.style}
              onChange={(e) => setFormData({ ...formData, style: e.target.value })}
              fullWidth
              helperText="z.B. modern, classic, minimal, transparent"
            />
            <TextField
              label="Hintergrundfarbe"
              type="color"
              value={formData.background_color}
              onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
              fullWidth
            />
            <TextField
              label="Textfarbe"
              type="color"
              value={formData.text_color}
              onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
              fullWidth
            />
            <TextField
              label="Logo URL"
              value={formData.logo_url || ''}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.show_social_links}
                  onChange={(e) => setFormData({ ...formData, show_social_links: e.target.checked })}
                />
              }
              label="Social Links anzeigen"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.show_contact_info}
                  onChange={(e) => setFormData({ ...formData, show_contact_info: e.target.checked })}
                />
              }
              label="Kontaktinformationen anzeigen"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
              }
              label="Aktiv"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Abbrechen</Button>
          <Button onClick={handleSaveTemplate} variant="contained" startIcon={<Save />}>
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

export default GlobalTemplatesManager;
