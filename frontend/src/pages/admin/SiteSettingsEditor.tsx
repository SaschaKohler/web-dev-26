import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  Snackbar,
  Stack,
  Divider,
} from '@mui/material';
import { Save } from '@mui/icons-material';
import { siteSettingsApi, SiteSettings } from '../../api/globalTemplates';

const SiteSettingsEditor: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await siteSettingsApi.getCurrent();
      setSettings(data);
    } catch (error) {
      showSnackbar('Fehler beim Laden der Einstellungen', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSave = async () => {
    if (!settings) return;
    try {
      setLoading(true);
      await siteSettingsApi.updateCurrent(settings);
      showSnackbar('Einstellungen erfolgreich gespeichert', 'success');
      loadSettings();
    } catch (error) {
      showSnackbar('Fehler beim Speichern der Einstellungen', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof SiteSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  if (!settings) {
    return <Typography>Laden...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Website-Einstellungen
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Konfigurieren Sie allgemeine Website-Einstellungen und Kontaktinformationen
      </Typography>

      <Card>
        <CardContent>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Allgemeine Informationen
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Website-Name"
                  value={settings.site_name}
                  onChange={(e) => handleChange('site_name', e.target.value)}
                  fullWidth
                  required
                />
                <TextField
                  label="Tagline"
                  value={settings.site_tagline || ''}
                  onChange={(e) => handleChange('site_tagline', e.target.value)}
                  fullWidth
                  helperText="Kurze Beschreibung Ihrer Website"
                />
                <TextField
                  label="Logo URL"
                  value={settings.logo_url || ''}
                  onChange={(e) => handleChange('logo_url', e.target.value)}
                  fullWidth
                />
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" gutterBottom>
                Kontaktinformationen
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="E-Mail"
                  type="email"
                  value={settings.contact_email || ''}
                  onChange={(e) => handleChange('contact_email', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Telefon"
                  value={settings.contact_phone || ''}
                  onChange={(e) => handleChange('contact_phone', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Adresse"
                  value={settings.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  fullWidth
                  multiline
                  rows={2}
                />
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" gutterBottom>
                Social Media
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Facebook URL"
                  value={settings.facebook_url || ''}
                  onChange={(e) => handleChange('facebook_url', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Instagram URL"
                  value={settings.instagram_url || ''}
                  onChange={(e) => handleChange('instagram_url', e.target.value)}
                  fullWidth
                />
                <TextField
                  label="LinkedIn URL"
                  value={settings.linkedin_url || ''}
                  onChange={(e) => handleChange('linkedin_url', e.target.value)}
                  fullWidth
                />
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" gutterBottom>
                Benutzerdefinierter Code
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Custom CSS"
                  value={settings.custom_css || ''}
                  onChange={(e) => handleChange('custom_css', e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  helperText="Benutzerdefiniertes CSS für Ihre Website"
                />
                <TextField
                  label="Custom JavaScript"
                  value={settings.custom_js || ''}
                  onChange={(e) => handleChange('custom_js', e.target.value)}
                  fullWidth
                  multiline
                  rows={4}
                  helperText="Benutzerdefiniertes JavaScript für Ihre Website"
                />
              </Stack>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 2 }}>
              <Button onClick={loadSettings} disabled={loading}>
                Zurücksetzen
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                disabled={loading}
              >
                Speichern
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>

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

export default SiteSettingsEditor;
