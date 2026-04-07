import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  TextField,
  Paper
} from '@mui/material';
import { Palette, Settings as SettingsIcon } from '@mui/icons-material';
import { templatesApi, DesignTemplate, SiteSettings } from '../api/templates';
import TemplateCard from '../components/TemplateCard';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<DesignTemplate[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activating, setActivating] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<DesignTemplate | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [templatesData, settingsData] = await Promise.all([
        templatesApi.getAllTemplates(),
        templatesApi.getSiteSettings()
      ]);
      setTemplates(templatesData);
      setSiteSettings(settingsData);
    } catch (err) {
      setError('Fehler beim Laden der Daten. Bitte versuchen Sie es erneut.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateTemplate = async (templateId: number) => {
    try {
      setActivating(true);
      setError(null);
      await templatesApi.activateTemplate(templateId);
      setSuccess('Template erfolgreich aktiviert!');
      await loadData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Fehler beim Aktivieren des Templates.');
      console.error('Error activating template:', err);
    } finally {
      setActivating(false);
    }
  };

  const handlePreviewTemplate = (template: DesignTemplate) => {
    setPreviewTemplate(template);
  };

  const handleClosePreview = () => {
    setPreviewTemplate(null);
  };

  const handleUpdateSettings = async (updatedSettings: Partial<SiteSettings>) => {
    try {
      setError(null);
      const updated = await templatesApi.updateSiteSettings(updatedSettings);
      setSiteSettings(updated);
      setSuccess('Einstellungen erfolgreich gespeichert!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Fehler beim Speichern der Einstellungen.');
      console.error('Error updating settings:', err);
    }
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Design & Einstellungen
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Verwalten Sie das Erscheinungsbild und die Einstellungen Ihrer Website
        </Typography>
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
          <Tab icon={<Palette />} label="Design Templates" iconPosition="start" />
          <Tab icon={<SettingsIcon />} label="Website Einstellungen" iconPosition="start" />
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
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onActivate={handleActivateTemplate}
              onPreview={handlePreviewTemplate}
              isActivating={activating}
            />
          ))}
        </Box>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {siteSettings && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Website Informationen
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
                gap: 2
              }}
            >
              <TextField
                fullWidth
                label="Website Name"
                value={siteSettings.site_name}
                onChange={(e) => setSiteSettings({ ...siteSettings, site_name: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Slogan"
                value={siteSettings.site_tagline}
                onChange={(e) => setSiteSettings({ ...siteSettings, site_tagline: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="E-Mail"
                type="email"
                value={siteSettings.contact_email}
                onChange={(e) => setSiteSettings({ ...siteSettings, contact_email: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Telefon"
                value={siteSettings.contact_phone}
                onChange={(e) => setSiteSettings({ ...siteSettings, contact_phone: e.target.value })}
                margin="normal"
              />
              <Box sx={{ gridColumn: '1 / -1' }}>
                <TextField
                  fullWidth
                  label="Adresse"
                  multiline
                  rows={3}
                  value={siteSettings.address}
                  onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                  margin="normal"
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 2,
                mt: 2
              }}
            >
              <TextField
                fullWidth
                label="Facebook URL"
                value={siteSettings.facebook_url || ''}
                onChange={(e) => setSiteSettings({ ...siteSettings, facebook_url: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Instagram URL"
                value={siteSettings.instagram_url || ''}
                onChange={(e) => setSiteSettings({ ...siteSettings, instagram_url: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="LinkedIn URL"
                value={siteSettings.linkedin_url || ''}
                onChange={(e) => setSiteSettings({ ...siteSettings, linkedin_url: e.target.value })}
                margin="normal"
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => handleUpdateSettings(siteSettings)}
              >
                Einstellungen Speichern
              </Button>
            </Box>
          </Paper>
        )}
      </TabPanel>

      <Dialog open={!!previewTemplate} onClose={handleClosePreview} maxWidth="md" fullWidth>
        <DialogTitle>
          Vorschau: {previewTemplate?.display_name}
        </DialogTitle>
        <DialogContent>
          {previewTemplate && (
            <Box>
              <Typography variant="body1" paragraph>
                {previewTemplate.description}
              </Typography>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Farbpalette
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
                  gap: 2
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 80,
                      bgcolor: previewTemplate.primary_color,
                      borderRadius: 1,
                      mb: 1
                    }}
                  />
                  <Typography variant="caption">Primärfarbe</Typography>
                  <Typography variant="caption" display="block">
                    {previewTemplate.primary_color}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 80,
                      bgcolor: previewTemplate.secondary_color,
                      borderRadius: 1,
                      mb: 1
                    }}
                  />
                  <Typography variant="caption">Sekundärfarbe</Typography>
                  <Typography variant="caption" display="block">
                    {previewTemplate.secondary_color}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: '100%',
                      height: 80,
                      bgcolor: previewTemplate.accent_color,
                      borderRadius: 1,
                      mb: 1
                    }}
                  />
                  <Typography variant="caption">Akzentfarbe</Typography>
                  <Typography variant="caption" display="block">
                    {previewTemplate.accent_color}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Typografie
              </Typography>
              <Typography variant="body2">
                Überschriften: {previewTemplate.heading_font}
              </Typography>
              <Typography variant="body2">
                Fließtext: {previewTemplate.font_family}
              </Typography>

              <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                Design-Details
              </Typography>
              <Typography variant="body2">
                Eckenradius: {previewTemplate.border_radius}px
              </Typography>
              <Typography variant="body2">
                Button-Stil: {previewTemplate.button_style}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePreview}>Schließen</Button>
          {previewTemplate && !previewTemplate.is_active && (
            <Button
              variant="contained"
              onClick={() => {
                handleActivateTemplate(previewTemplate.id);
                handleClosePreview();
              }}
            >
              Dieses Template Aktivieren
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTemplates;
