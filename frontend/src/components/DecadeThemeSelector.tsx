import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import { decadeThemesApi, DecadeTheme as ApiDecadeTheme } from '../api/decadeThemes';
import { decadeThemes as localDecadeThemes, DecadeTheme as LocalDecadeTheme } from '../themes/decadeThemes';

type DecadeType = '90s' | '2000s' | '2010s' | '2020s';

interface DecadeThemeSelectorProps {
  currentThemeId?: number;
  onThemeSelect: (theme: ApiDecadeTheme) => void;
}

const DecadeThemeSelector: React.FC<DecadeThemeSelectorProps> = ({
  currentThemeId,
  onThemeSelect,
}) => {
  const [selectedDecade, setSelectedDecade] = useState<DecadeType>('2020s');
  const [previewTheme, setPreviewTheme] = useState<ApiDecadeTheme | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [allThemes, setAllThemes] = useState<ApiDecadeTheme[]>([]);
  const [loading, setLoading] = useState(true);

  const decades: DecadeType[] = ['90s', '2000s', '2010s', '2020s'];

  // Convert local theme to API format
  const convertLocalToApiTheme = (localTheme: LocalDecadeTheme): ApiDecadeTheme => ({
    id: localTheme.id as any,
    theme_id: localTheme.id,
    name: localTheme.name,
    description: localTheme.description,
    decade: localTheme.decade,
    decade_display: localTheme.decade === '90s' ? '1990er' : 
                   localTheme.decade === '2000s' ? '2000er' :
                   localTheme.decade === '2010s' ? '2010er' : '2020er',
    variation: localTheme.variation,
    primary_color: localTheme.primaryColor,
    secondary_color: localTheme.secondaryColor,
    background_color: localTheme.backgroundColor,
    text_color: localTheme.textColor,
    accent_color: localTheme.accentColor || localTheme.primaryColor,
    font_family: localTheme.fontFamily,
    heading_font: localTheme.headingFont,
    border_radius: localTheme.borderRadius,
    spacing_unit: localTheme.spacingUnit,
    card_shadow: localTheme.cardShadow,
    button_style: localTheme.buttonStyle,
    button_style_display: localTheme.buttonStyle,
    custom_css: localTheme.customCSS || '',
    is_predefined: true,
    is_active: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const loadThemes = useCallback(async () => {
    try {
      setLoading(true);
      const themes = await decadeThemesApi.getPredefined();
      // Use local themes as fallback if API returns empty
      if (themes.length === 0) {
        console.log('API returned no themes, using local fallback');
        setAllThemes(localDecadeThemes.map(convertLocalToApiTheme));
      } else {
        setAllThemes(themes);
      }
    } catch (error) {
      console.error('Error loading themes:', error);
      // Use local themes as fallback on error
      setAllThemes(localDecadeThemes.map(convertLocalToApiTheme));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadThemes();
  }, [loadThemes]);

  const currentDecadeThemes = allThemes.filter(theme => theme.decade === selectedDecade);

  const handlePreview = (theme: ApiDecadeTheme) => {
    setPreviewTheme(theme);
    setPreviewOpen(true);
  };

  const handleApplyTheme = (theme: ApiDecadeTheme) => {
    onThemeSelect(theme);
    setPreviewOpen(false);
  };

  const getDecadeLabel = (decade: DecadeType): string => {
    const labels: Record<DecadeType, string> = {
      '90s': '1990er',
      '2000s': '2000er',
      '2010s': '2010er',
      '2020s': '2020er',
    };
    return labels[decade];
  };

  const getDecadeDescription = (decade: DecadeType): string => {
    const descriptions: Record<DecadeType, string> = {
      '90s': 'Neon-Farben, geometrische Muster, kräftige Typografie',
      '2000s': 'Glänzende Buttons, Verläufe, Web 2.0 Ästhetik',
      '2010s': 'Flat Design, Material Design, minimalistisch',
      '2020s': 'Neumorphism, Glassmorphism, moderne Dark Modes',
    };
    return descriptions[decade];
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dekaden-Design Auswahl
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Wählen Sie ein Design aus verschiedenen Dekaden, um den Look Ihrer Website zu gestalten.
      </Typography>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel>Dekade auswählen</InputLabel>
        <Select
          value={selectedDecade}
          label="Dekade auswählen"
          onChange={(e) => setSelectedDecade(e.target.value as DecadeType)}
        >
          {decades.map((decade) => (
            <MenuItem key={decade} value={decade}>
              {getDecadeLabel(decade)} - {getDecadeDescription(decade)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {currentDecadeThemes.length === 0 ? (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Keine Themes für diese Dekade verfügbar. Bitte laden Sie die Seite neu oder kontaktieren Sie den Support.
        </Alert>
      ) : (
      <Grid container spacing={3}>
        {currentDecadeThemes.map((theme) => (
          <Grid size={{ xs: 12, md: 4 }} key={theme.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: currentThemeId === theme.id ? 3 : 1,
                borderColor: currentThemeId === theme.id ? 'primary.main' : 'divider',
                position: 'relative',
              }}
            >
              {currentThemeId === theme.id && (
                <Chip
                  label="Aktiv"
                  color="primary"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 1,
                  }}
                />
              )}
              
              <Box
                sx={{
                  height: 120,
                  background: `linear-gradient(135deg, ${theme.primary_color} 0%, ${theme.secondary_color} 100%)`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 8,
                    left: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: theme.primary_color,
                      borderRadius: theme.border_radius / 4,
                    }}
                  />
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: theme.secondary_color,
                      borderRadius: theme.border_radius / 4,
                    }}
                  />
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: theme.background_color,
                      borderRadius: theme.border_radius / 4,
                    }}
                  />
                </Box>
              </Box>

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {theme.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {theme.description}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" display="block" gutterBottom>
                    <strong>Schriftart:</strong> {theme.font_family.split(',')[0]}
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    <strong>Button-Stil:</strong> {theme.button_style}
                  </Typography>
                  <Typography variant="caption" display="block">
                    <strong>Border Radius:</strong> {theme.border_radius}px
                  </Typography>
                </Box>
              </CardContent>

              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => handlePreview(theme)}
                  sx={{ mb: 1 }}
                >
                  Vorschau
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleApplyTheme(theme)}
                  disabled={currentThemeId === theme.id}
                >
                  {currentThemeId === theme.id ? 'Aktives Theme' : 'Anwenden'}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      )}

      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {previewTheme && (
          <>
            <DialogTitle>
              Vorschau: {previewTheme.name}
            </DialogTitle>
            <DialogContent>
              <Alert severity="info" sx={{ mb: 3 }}>
                Dies ist eine Vorschau des {previewTheme.name} Themes aus den {getDecadeLabel(previewTheme.decade)}.
              </Alert>

              <Box
                sx={{
                  p: 4,
                  backgroundColor: previewTheme.background_color,
                  color: previewTheme.text_color,
                  fontFamily: previewTheme.font_family,
                  borderRadius: `${previewTheme.border_radius}px`,
                  minHeight: 300,
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: previewTheme.heading_font,
                    color: previewTheme.primary_color,
                    mb: 2,
                  }}
                >
                  Beispiel Überschrift
                </Typography>

                <Typography variant="body1" paragraph>
                  Dies ist ein Beispieltext, um zu zeigen, wie Ihr Inhalt mit diesem Theme aussehen wird.
                  Die Schriftart ist {previewTheme.font_family.split(',')[0]} und der Text hat die Farbe {previewTheme.text_color}.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: previewTheme.primary_color,
                      color: '#fff',
                      borderRadius: previewTheme.button_style === 'pill' ? '50px' :
                                   previewTheme.button_style === 'squared' ? '4px' :
                                   previewTheme.button_style === 'soft-rounded' ? '12px' :
                                   `${previewTheme.border_radius}px`,
                    }}
                  >
                    Primärer Button
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: previewTheme.secondary_color,
                      color: previewTheme.secondary_color,
                      borderRadius: previewTheme.button_style === 'pill' ? '50px' :
                                   previewTheme.button_style === 'squared' ? '4px' :
                                   previewTheme.button_style === 'soft-rounded' ? '12px' :
                                   `${previewTheme.border_radius}px`,
                    }}
                  >
                    Sekundärer Button
                  </Button>
                </Box>

                <Box
                  sx={{
                    p: 3,
                    backgroundColor: previewTheme.background_color,
                    boxShadow: previewTheme.card_shadow,
                    borderRadius: `${previewTheme.border_radius}px`,
                    border: `1px solid ${previewTheme.primary_color}20`,
                  }}
                >
                  <Typography variant="h6" sx={{ fontFamily: previewTheme.heading_font, mb: 1 }}>
                    Beispiel Card
                  </Typography>
                  <Typography variant="body2">
                    Dies ist eine Beispiel-Card mit dem Shadow-Stil: {previewTheme.card_shadow}
                  </Typography>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="caption" display="block">
                    <strong>Primärfarbe:</strong> {previewTheme.primary_color}
                  </Typography>
                  <Typography variant="caption" display="block">
                    <strong>Sekundärfarbe:</strong> {previewTheme.secondary_color}
                  </Typography>
                  <Typography variant="caption" display="block">
                    <strong>Hintergrund:</strong> {previewTheme.background_color}
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setPreviewOpen(false)}>
                Schließen
              </Button>
              <Button
                variant="contained"
                onClick={() => handleApplyTheme(previewTheme)}
              >
                Theme Anwenden
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default DecadeThemeSelector;
