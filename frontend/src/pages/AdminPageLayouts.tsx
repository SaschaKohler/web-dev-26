import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  Alert,
  Chip,
  IconButton,
  CircularProgress,
  TableContainer
} from '@mui/material';
import { Save, Clear, Refresh } from '@mui/icons-material';
import { layoutsApi, PageLayout } from '../api/layouts';

interface Page {
  id: number;
  title: string;
  slug: string;
  layout: number | null;
  is_published: boolean;
}

const AdminPageLayouts: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [layouts, setLayouts] = useState<PageLayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [changes, setChanges] = useState<Map<number, number | null>>(new Map());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [pagesData, layoutsData] = await Promise.all([
        layoutsApi.getPages(),
        layoutsApi.getAllLayouts()
      ]);
      setPages(pagesData);
      setLayouts(layoutsData);
      setChanges(new Map());
    } catch (err) {
      setError('Fehler beim Laden der Daten.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLayoutChange = (pageId: number, layoutId: string) => {
    const newChanges = new Map(changes);
    const value = layoutId === '' ? null : parseInt(layoutId);
    newChanges.set(pageId, value);
    setChanges(newChanges);
  };

  const handleSaveChanges = async () => {
    try {
      setError(null);
      const promises = Array.from(changes.entries()).map(([pageId, layoutId]) => {
        if (layoutId === null) {
          return layoutsApi.removeLayoutFromPage(pageId);
        } else {
          return layoutsApi.assignLayoutToPage(pageId, layoutId);
        }
      });
      
      await Promise.all(promises);
      setSuccess(`${changes.size} Seite(n) erfolgreich aktualisiert!`);
      await loadData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Fehler beim Speichern der Änderungen.');
      console.error('Error saving changes:', err);
    }
  };

  const handleClearChanges = () => {
    setChanges(new Map());
  };

  const getCurrentLayout = (page: Page): string | number => {
    if (changes.has(page.id)) {
      const value = changes.get(page.id);
      return value === null || value === undefined ? '' : value.toString();
    }
    return page.layout?.toString() || '';
  };

  const getLayoutName = (layoutId: number | null): string => {
    if (!layoutId) return 'Kein Layout';
    const layout = layouts.find(l => l.id === layoutId);
    return layout?.display_name || 'Unbekannt';
  };

  const hasChanges = changes.size > 0;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Seiten-Layout-Zuordnung
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Weisen Sie Ihren Seiten moderne Layouts zu
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton onClick={loadData} title="Aktualisieren">
            <Refresh />
          </IconButton>
          {hasChanges && (
            <>
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={handleClearChanges}
              >
                Verwerfen
              </Button>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSaveChanges}
              >
                {changes.size} Änderung(en) speichern
              </Button>
            </>
          )}
        </Box>
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

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Seite</strong></TableCell>
                <TableCell><strong>Slug</strong></TableCell>
                <TableCell><strong>Aktuelles Layout</strong></TableCell>
                <TableCell><strong>Neues Layout</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pages.map((page) => {
                const hasChange = changes.has(page.id);
                const currentValue = getCurrentLayout(page);
                
                return (
                  <TableRow 
                    key={page.id}
                    sx={{ 
                      backgroundColor: hasChange ? 'action.hover' : 'inherit',
                      '&:hover': { backgroundColor: 'action.selected' }
                    }}
                  >
                    <TableCell>
                      <Typography variant="body1" fontWeight={600}>
                        {page.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        /{page.slug}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {getLayoutName(page.layout)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ minWidth: 250 }}>
                      <Select
                        fullWidth
                        size="small"
                        value={currentValue}
                        onChange={(e) => handleLayoutChange(page.id, e.target.value as string)}
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>Kein Layout</em>
                        </MenuItem>
                        {layouts.map((layout) => (
                          <MenuItem key={layout.id} value={layout.id}>
                            {layout.display_name} ({layout.layout_type_display})
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      {page.is_published ? (
                        <Chip label="Veröffentlicht" color="success" size="small" />
                      ) : (
                        <Chip label="Entwurf" color="default" size="small" />
                      )}
                      {hasChange && (
                        <Chip 
                          label="Geändert" 
                          color="warning" 
                          size="small" 
                          sx={{ ml: 1 }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {pages.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Keine Seiten vorhanden
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Erstellen Sie zuerst Seiten im Django Admin.
          </Typography>
        </Box>
      )}

      {layouts.length === 0 && pages.length > 0 && (
        <Alert severity="info" sx={{ mt: 3 }}>
          Keine Layouts verfügbar. Erstellen Sie zuerst Layouts unter /admin/layouts
        </Alert>
      )}

      <Box sx={{ mt: 4, p: 3, backgroundColor: 'background.default', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          💡 Hinweise
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          • Wählen Sie ein Layout aus dem Dropdown, um es einer Seite zuzuweisen
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          • "Kein Layout" verwendet das Standard-Template der Seite
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          • Änderungen werden erst nach dem Klick auf "Speichern" übernommen
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Layouts können unter <strong>/admin/layouts</strong> erstellt und bearbeitet werden
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminPageLayouts;
