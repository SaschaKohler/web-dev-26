import React, { useState } from 'react';
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
} from '@mui/material';
import {
  decadeThemes,
  DecadeType,
  DecadeTheme,
  getAllDecades,
  getDecadeThemes,
} from '../themes/decadeThemes';

interface DecadeThemeSelectorProps {
  currentThemeId?: string;
  onThemeSelect: (theme: DecadeTheme) => void;
}

const DecadeThemeSelector: React.FC<DecadeThemeSelectorProps> = ({
  currentThemeId,
  onThemeSelect,
}) => {
  const [selectedDecade, setSelectedDecade] = useState<DecadeType>('2020s');
  const [previewTheme, setPreviewTheme] = useState<DecadeTheme | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const decades = getAllDecades();
  const currentDecadeThemes = getDecadeThemes(selectedDecade);

  const handlePreview = (theme: DecadeTheme) => {
    setPreviewTheme(theme);
    setPreviewOpen(true);
  };

  const handleApplyTheme = (theme: DecadeTheme) => {
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
                  background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)`,
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
                      backgroundColor: theme.primaryColor,
                      borderRadius: theme.borderRadius / 4,
                    }}
                  />
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: theme.secondaryColor,
                      borderRadius: theme.borderRadius / 4,
                    }}
                  />
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundColor: theme.backgroundColor,
                      borderRadius: theme.borderRadius / 4,
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
                    <strong>Schriftart:</strong> {theme.fontFamily.split(',')[0]}
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    <strong>Button-Stil:</strong> {theme.buttonStyle}
                  </Typography>
                  <Typography variant="caption" display="block">
                    <strong>Border Radius:</strong> {theme.borderRadius}px
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
                  backgroundColor: previewTheme.backgroundColor,
                  color: previewTheme.textColor,
                  fontFamily: previewTheme.fontFamily,
                  borderRadius: `${previewTheme.borderRadius}px`,
                  minHeight: 300,
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontFamily: previewTheme.headingFont,
                    color: previewTheme.primaryColor,
                    mb: 2,
                  }}
                >
                  Beispiel Überschrift
                </Typography>

                <Typography variant="body1" paragraph>
                  Dies ist ein Beispieltext, um zu zeigen, wie Ihr Inhalt mit diesem Theme aussehen wird.
                  Die Schriftart ist {previewTheme.fontFamily.split(',')[0]} und der Text hat die Farbe {previewTheme.textColor}.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: previewTheme.primaryColor,
                      color: '#fff',
                      borderRadius: previewTheme.buttonStyle === 'pill' ? '50px' :
                                   previewTheme.buttonStyle === 'squared' ? '4px' :
                                   previewTheme.buttonStyle === 'soft-rounded' ? '12px' :
                                   `${previewTheme.borderRadius}px`,
                    }}
                  >
                    Primärer Button
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{
                      borderColor: previewTheme.secondaryColor,
                      color: previewTheme.secondaryColor,
                      borderRadius: previewTheme.buttonStyle === 'pill' ? '50px' :
                                   previewTheme.buttonStyle === 'squared' ? '4px' :
                                   previewTheme.buttonStyle === 'soft-rounded' ? '12px' :
                                   `${previewTheme.borderRadius}px`,
                    }}
                  >
                    Sekundärer Button
                  </Button>
                </Box>

                <Box
                  sx={{
                    p: 3,
                    backgroundColor: previewTheme.backgroundColor,
                    boxShadow: previewTheme.cardShadow,
                    borderRadius: `${previewTheme.borderRadius}px`,
                    border: `1px solid ${previewTheme.primaryColor}20`,
                  }}
                >
                  <Typography variant="h6" sx={{ fontFamily: previewTheme.headingFont, mb: 1 }}>
                    Beispiel Card
                  </Typography>
                  <Typography variant="body2">
                    Dies ist eine Beispiel-Card mit dem Shadow-Stil: {previewTheme.cardShadow}
                  </Typography>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="caption" display="block">
                    <strong>Primärfarbe:</strong> {previewTheme.primaryColor}
                  </Typography>
                  <Typography variant="caption" display="block">
                    <strong>Sekundärfarbe:</strong> {previewTheme.secondaryColor}
                  </Typography>
                  <Typography variant="caption" display="block">
                    <strong>Hintergrund:</strong> {previewTheme.backgroundColor}
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
