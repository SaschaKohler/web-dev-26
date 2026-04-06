import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Tabs,
  Tab,
  IconButton,
  Stack
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  ContentCopy,
  Layers,
  Settings
} from '@mui/icons-material';
import { layoutsApi, PageLayout } from '../api/layouts';
import PageRenderer from '../components/PageRenderer';
import LayoutEditor from '../components/LayoutEditor';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminLayouts: React.FC = () => {
  const [layouts, setLayouts] = useState<PageLayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  
  const [previewLayout, setPreviewLayout] = useState<PageLayout | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editorDialogOpen, setEditorDialogOpen] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<PageLayout | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    layout_type: 'custom',
    description: '',
    is_active: true
  });

  useEffect(() => {
    loadLayouts();
  }, []);

  const loadLayouts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await layoutsApi.getAllLayouts();
      setLayouts(data);
    } catch (err) {
      setError('Fehler beim Laden der Layouts. Bitte versuchen Sie es erneut.');
      console.error('Error loading layouts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePreview = async (layoutId: number) => {
    try {
      const layout = await layoutsApi.getLayoutWithSections(layoutId);
      setPreviewLayout(layout);
    } catch (err) {
      setError('Fehler beim Laden der Vorschau.');
      console.error('Error loading preview:', err);
    }
  };

  const handleClosePreview = () => {
    setPreviewLayout(null);
  };

  const handleOpenCreateDialog = () => {
    setSelectedLayout(null);
    setFormData({
      name: '',
      display_name: '',
      layout_type: 'custom',
      description: '',
      is_active: true
    });
    setEditDialogOpen(true);
  };

  const handleOpenEditDialog = (layout: PageLayout) => {
    setSelectedLayout(layout);
    setFormData({
      name: layout.name,
      display_name: layout.display_name,
      layout_type: layout.layout_type,
      description: layout.description || '',
      is_active: layout.is_active
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedLayout(null);
  };

  const handleSaveLayout = async () => {
    try {
      setError(null);
      if (selectedLayout) {
        await layoutsApi.updateLayout(selectedLayout.id, formData);
        setSuccess('Layout erfolgreich aktualisiert!');
      } else {
        await layoutsApi.createLayout(formData);
        setSuccess('Layout erfolgreich erstellt!');
      }
      handleCloseEditDialog();
      await loadLayouts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Fehler beim Speichern des Layouts.');
      console.error('Error saving layout:', err);
    }
  };

  const handleOpenDeleteDialog = (layout: PageLayout) => {
    setSelectedLayout(layout);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedLayout(null);
  };

  const handleDeleteLayout = async () => {
    if (!selectedLayout) return;
    
    try {
      setError(null);
      await layoutsApi.deleteLayout(selectedLayout.id);
      setSuccess('Layout erfolgreich gelöscht!');
      handleCloseDeleteDialog();
      await loadLayouts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Fehler beim Löschen des Layouts.');
      console.error('Error deleting layout:', err);
    }
  };

  const handleDuplicateLayout = async (layout: PageLayout) => {
    try {
      setError(null);
      const newLayout = {
        name: `${layout.name}_copy`,
        display_name: `${layout.display_name} (Kopie)`,
        layout_type: layout.layout_type,
        description: layout.description,
        is_active: false
      };
      await layoutsApi.createLayout(newLayout);
      setSuccess('Layout erfolgreich dupliziert!');
      await loadLayouts();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Fehler beim Duplizieren des Layouts.');
      console.error('Error duplicating layout:', err);
    }
  };

  const handleOpenEditor = (layout: PageLayout) => {
    setSelectedLayout(layout);
    setEditorDialogOpen(true);
  };

  const handleCloseEditor = () => {
    setEditorDialogOpen(false);
    setSelectedLayout(null);
    loadLayouts();
  };

  const layoutTypes = [
    { value: 'landing', label: 'Landing Page' },
    { value: 'about', label: 'About Page' },
    { value: 'services', label: 'Services Page' },
    { value: 'portfolio', label: 'Portfolio Page' },
    { value: 'contact', label: 'Contact Page' },
    { value: 'custom', label: 'Custom Layout' }
  ];

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography>Laden...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Layout-Verwaltung
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenCreateDialog}
          size="large"
        >
          Neues Layout
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab icon={<Layers />} label="Alle Layouts" iconPosition="start" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 3
          }}
        >
          {layouts.map((layout) => (
            <Card
              key={layout.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h5" component="h2">
                    {layout.display_name}
                  </Typography>
                  {layout.is_active && (
                    <Chip label="Aktiv" color="success" size="small" />
                  )}
                </Box>
                
                <Chip
                  label={layout.layout_type_display}
                  size="small"
                  sx={{ mb: 2 }}
                />
                
                {layout.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {layout.description}
                  </Typography>
                )}
                
                <Typography variant="caption" color="text.secondary">
                  {layout.sections?.length || 0} Sections
                </Typography>
              </CardContent>
              
              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    size="small"
                    onClick={() => handlePreview(layout.id)}
                    title="Vorschau"
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOpenEditor(layout)}
                    title="Sections & Blocks bearbeiten"
                  >
                    <Settings />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenEditDialog(layout)}
                    title="Layout-Einstellungen"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDuplicateLayout(layout)}
                    title="Duplizieren"
                  >
                    <ContentCopy />
                  </IconButton>
                </Stack>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleOpenDeleteDialog(layout)}
                  title="Löschen"
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Box>

        {layouts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Keine Layouts vorhanden
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Erstellen Sie Ihr erstes Layout oder führen Sie das populate_layouts.py Script aus.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleOpenCreateDialog}
            >
              Erstes Layout erstellen
            </Button>
          </Box>
        )}
      </TabPanel>

      {/* Create/Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedLayout ? 'Layout bearbeiten' : 'Neues Layout erstellen'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Technischer Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              helperText="Eindeutiger Name ohne Leerzeichen (z.B. my_landing)"
              required
            />
            <TextField
              fullWidth
              label="Anzeigename"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              required
            />
            <TextField
              fullWidth
              select
              label="Layout-Typ"
              value={formData.layout_type}
              onChange={(e) => setFormData({ ...formData, layout_type: e.target.value })}
            >
              {layoutTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Beschreibung"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Abbrechen</Button>
          <Button onClick={handleSaveLayout} variant="contained">
            {selectedLayout ? 'Aktualisieren' : 'Erstellen'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Layout löschen?</DialogTitle>
        <DialogContent>
          <Typography>
            Möchten Sie das Layout "{selectedLayout?.display_name}" wirklich löschen?
            Diese Aktion kann nicht rückgängig gemacht werden.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Abbrechen</Button>
          <Button onClick={handleDeleteLayout} color="error" variant="contained">
            Löschen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={!!previewLayout}
        onClose={handleClosePreview}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogTitle>
          Vorschau: {previewLayout?.display_name}
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflow: 'auto' }}>
          {previewLayout && <PageRenderer layout={previewLayout} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Schließen</Button>
          {previewLayout && (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => {
                handleClosePreview();
                handleOpenEditDialog(previewLayout);
              }}
            >
              Bearbeiten
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Layout Editor Dialog */}
      <Dialog
        open={editorDialogOpen}
        onClose={handleCloseEditor}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' }
        }}
      >
        <DialogContent sx={{ p: 3 }}>
          {selectedLayout && (
            <LayoutEditor
              layoutId={selectedLayout.id}
              onClose={handleCloseEditor}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditor}>Schließen</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminLayouts;
