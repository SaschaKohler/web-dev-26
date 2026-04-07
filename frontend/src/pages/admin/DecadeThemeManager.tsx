import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
  Snackbar,
  Divider,
} from '@mui/material';
import { useThemeContext } from '../../contexts/ThemeContext';
import DecadeThemeSelector from '../../components/DecadeThemeSelector';
import { DecadeTheme } from '../../api/decadeThemes';

const DecadeThemeManager: React.FC = () => {
  const { currentDecadeTheme, setDecadeTheme } = useThemeContext();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleThemeSelect = async (theme: DecadeTheme) => {
    try {
      await setDecadeTheme(theme.id.toString());
      setSnackbarMessage(`Theme "${theme.name}" wurde erfolgreich angewendet!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error applying theme:', error);
      setSnackbarMessage('Fehler beim Anwenden des Themes. Bitte versuchen Sie es erneut.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dekaden-Design Verwaltung
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Wählen Sie ein Design aus verschiedenen Dekaden (90er, 2000er, 2010er, 2020er), 
        um den gesamten Look Ihrer Website zu gestalten. Jede Dekade bietet 3 verschiedene 
        Design-Variationen mit authentischen Stilen der jeweiligen Zeit.
      </Typography>

      {currentDecadeTheme && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Aktuelles Theme:</strong> {currentDecadeTheme.name} ({currentDecadeTheme.decade})
          </Typography>
          <Typography variant="body2">
            {currentDecadeTheme.description}
          </Typography>
        </Alert>
      )}

      <Divider sx={{ my: 3 }} />

      <Paper sx={{ p: 3 }}>
        <DecadeThemeSelector
          currentThemeId={currentDecadeTheme?.id}
          onThemeSelect={handleThemeSelect}
        />
      </Paper>

      <Box sx={{ mt: 4 }}>
        <Alert severity="warning">
          <Typography variant="body2">
            <strong>Hinweis:</strong> Das Anwenden eines neuen Dekaden-Themes überschreibt 
            Ihre aktuellen Design-Einstellungen. Die Seite wird nach der Anwendung automatisch 
            neu geladen, um alle Änderungen anzuzeigen.
          </Typography>
        </Alert>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DecadeThemeManager;
