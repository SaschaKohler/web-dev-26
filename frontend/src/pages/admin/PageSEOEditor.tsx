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
  Alert,
  Snackbar,
  Stack,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Save, Edit, Search } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

interface Page {
  id: number;
  title: string;
  slug: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  meta_image?: string;
  canonical_url?: string;
  robots_meta?: string;
  og_type?: string;
  twitter_card?: string;
  structured_data?: any;
}

const PageSEOEditor: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [seoData, setSeoData] = useState<Partial<Page>>({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    meta_image: '',
    canonical_url: '',
    robots_meta: 'index, follow',
    og_type: 'website',
    twitter_card: 'summary_large_image',
    structured_data: {},
  });

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Page[]>(`${API_BASE_URL}/pages/`);
      setPages(response.data);
    } catch (error) {
      showSnackbar('Fehler beim Laden der Seiten', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSaveSEO = async () => {
    if (!selectedPage) return;
    try {
      setLoading(true);
      await axios.patch(`${API_BASE_URL}/pages/${selectedPage.id}/`, seoData);
      showSnackbar('SEO-Einstellungen erfolgreich gespeichert', 'success');
      setEditDialogOpen(false);
      loadPages();
    } catch (error) {
      showSnackbar('Fehler beim Speichern der SEO-Einstellungen', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (page: Page) => {
    setSelectedPage(page);
    setSeoData({
      meta_title: page.meta_title || '',
      meta_description: page.meta_description || '',
      meta_keywords: page.meta_keywords || '',
      meta_image: page.meta_image || '',
      canonical_url: page.canonical_url || '',
      robots_meta: page.robots_meta || 'index, follow',
      og_type: page.og_type || 'website',
      twitter_card: page.twitter_card || 'summary_large_image',
      structured_data: page.structured_data || {},
    });
    setEditDialogOpen(true);
  };

  const getSEOScore = (page: Page): { score: number; color: string } => {
    let score = 0;
    if (page.meta_title) score += 25;
    if (page.meta_description) score += 25;
    if (page.meta_keywords) score += 15;
    if (page.meta_image) score += 15;
    if (page.canonical_url) score += 10;
    if (page.structured_data && Object.keys(page.structured_data).length > 0) score += 10;

    if (score >= 80) return { score, color: 'success' };
    if (score >= 50) return { score, color: 'warning' };
    return { score, color: 'error' };
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        SEO-Verwaltung
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Optimieren Sie die SEO-Einstellungen für alle Ihre Seiten
      </Typography>

      <Card>
        <CardContent>
          <List>
            {pages.map((page) => {
              const seoScore = getSEOScore(page);
              return (
                <ListItem
                  key={page.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                  }}
                  secondaryAction={
                    <IconButton onClick={() => openEditDialog(page)} color="primary">
                      <Edit />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {page.title}
                        <Chip
                          label={`SEO: ${seoScore.score}%`}
                          size="small"
                          color={seoScore.color as any}
                        />
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          /{page.slug}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                          {page.meta_title && <Chip label="Meta Title" size="small" variant="outlined" />}
                          {page.meta_description && <Chip label="Meta Description" size="small" variant="outlined" />}
                          {page.meta_keywords && <Chip label="Keywords" size="small" variant="outlined" />}
                          {page.meta_image && <Chip label="OG Image" size="small" variant="outlined" />}
                          {page.structured_data && Object.keys(page.structured_data).length > 0 && (
                            <Chip label="Structured Data" size="small" variant="outlined" />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              );
            })}
          </List>

          {pages.length === 0 && (
            <Alert severity="info">Keine Seiten vorhanden</Alert>
          )}
        </CardContent>
      </Card>

      {/* Edit SEO Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          SEO-Einstellungen bearbeiten: {selectedPage?.title}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <Alert severity="info" icon={<Search />}>
              Optimieren Sie Ihre Seite für Suchmaschinen
            </Alert>

            <Box>
              <Typography variant="h6" gutterBottom>
                Basis SEO
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Meta Title"
                  value={seoData.meta_title}
                  onChange={(e) => setSeoData({ ...seoData, meta_title: e.target.value })}
                  fullWidth
                  helperText={`${(seoData.meta_title || '').length}/60 Zeichen (optimal: 50-60)`}
                />
                <TextField
                  label="Meta Description"
                  value={seoData.meta_description}
                  onChange={(e) => setSeoData({ ...seoData, meta_description: e.target.value })}
                  fullWidth
                  multiline
                  rows={3}
                  helperText={`${(seoData.meta_description || '').length}/320 Zeichen (optimal: 150-160)`}
                />
                <TextField
                  label="Meta Keywords"
                  value={seoData.meta_keywords}
                  onChange={(e) => setSeoData({ ...seoData, meta_keywords: e.target.value })}
                  fullWidth
                  helperText="Komma-getrennte Keywords"
                />
                <TextField
                  label="Meta Image URL"
                  value={seoData.meta_image}
                  onChange={(e) => setSeoData({ ...seoData, meta_image: e.target.value })}
                  fullWidth
                  helperText="Bild für Social Media Sharing (Open Graph)"
                />
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" gutterBottom>
                Erweiterte SEO
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Canonical URL"
                  value={seoData.canonical_url}
                  onChange={(e) => setSeoData({ ...seoData, canonical_url: e.target.value })}
                  fullWidth
                  helperText="Kanonische URL zur Vermeidung von Duplicate Content"
                />
                <FormControl fullWidth>
                  <InputLabel>Robots Meta</InputLabel>
                  <Select
                    value={seoData.robots_meta}
                    onChange={(e) => setSeoData({ ...seoData, robots_meta: e.target.value })}
                    label="Robots Meta"
                  >
                    <MenuItem value="index, follow">Index, Follow (Standard)</MenuItem>
                    <MenuItem value="noindex, follow">NoIndex, Follow</MenuItem>
                    <MenuItem value="index, nofollow">Index, NoFollow</MenuItem>
                    <MenuItem value="noindex, nofollow">NoIndex, NoFollow</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Open Graph Type</InputLabel>
                  <Select
                    value={seoData.og_type}
                    onChange={(e) => setSeoData({ ...seoData, og_type: e.target.value })}
                    label="Open Graph Type"
                  >
                    <MenuItem value="website">Website</MenuItem>
                    <MenuItem value="article">Article</MenuItem>
                    <MenuItem value="profile">Profile</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Twitter Card</InputLabel>
                  <Select
                    value={seoData.twitter_card}
                    onChange={(e) => setSeoData({ ...seoData, twitter_card: e.target.value })}
                    label="Twitter Card"
                  >
                    <MenuItem value="summary">Summary</MenuItem>
                    <MenuItem value="summary_large_image">Summary Large Image</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" gutterBottom>
                Structured Data (JSON-LD)
              </Typography>
              <TextField
                value={JSON.stringify(seoData.structured_data, null, 2)}
                onChange={(e) => {
                  try {
                    setSeoData({ ...seoData, structured_data: JSON.parse(e.target.value) });
                  } catch (err) {
                    // Invalid JSON, ignore
                  }
                }}
                fullWidth
                multiline
                rows={8}
                helperText="Schema.org Structured Data im JSON-LD Format"
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Abbrechen</Button>
          <Button onClick={handleSaveSEO} variant="contained" startIcon={<Save />}>
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

export default PageSEOEditor;
