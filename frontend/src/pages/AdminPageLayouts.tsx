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
  TableContainer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Divider,
  Tabs,
  Tab,
  Tooltip,
} from '@mui/material';
import { Save, Clear, Refresh, Add, Delete, RestoreFromTrash, DeleteForever } from '@mui/icons-material';
import { layoutsApi, PageLayout } from '../api/layouts';

interface Page {
  id: number;
  title: string;
  slug: string;
  layout: number | null;
  is_published: boolean;
  is_trashed?: boolean;
  trashed_at?: string | null;
}

const AdminPageLayouts: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [layouts, setLayouts] = useState<PageLayout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [changes, setChanges] = useState<Map<number, number | null>>(new Map());

  const [activeTab, setActiveTab] = useState(0);
  const [trashedPages, setTrashedPages] = useState<Page[]>([]);

  // New page dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newPageForm, setNewPageForm] = useState({
    title: '',
    slug: '',
    content: '',
    is_published: false
  });
  const [creatingPage, setCreatingPage] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [pagesData, layoutsData, trashedData] = await Promise.all([
        layoutsApi.getPages(),
        layoutsApi.getAllLayouts(),
        layoutsApi.getTrashedPages()
      ]);
      setPages(pagesData);
      setLayouts(layoutsData);
      setTrashedPages(trashedData);
      setChanges(new Map());
    } catch (err) {
      setError('Fehler beim Laden der Daten.');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrashPage = async (pageId: number) => {
    try {
      setError(null);
      await layoutsApi.trashPage(pageId);
      setSuccess('Seite in den Papierkorb verschoben.');
      await loadData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Fehler beim Verschieben in den Papierkorb.');
    }
  };

  const handleRestorePage = async (pageId: number) => {
    try {
      setError(null);
      await layoutsApi.restorePage(pageId);
      setSuccess('Seite wiederhergestellt.');
      await loadData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Fehler beim Wiederherstellen.');
    }
  };

  const handleDeletePage = async (pageId: number) => {
    try {
      setError(null);
      await layoutsApi.deletePage(pageId);
      setSuccess('Seite endgültig gelöscht.');
      await loadData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Fehler beim endgültigen Löschen.');
    }
  };

  const handleEmptyTrash = async () => {
    if (!window.confirm(`Alle ${trashedPages.length} Seite(n) im Papierkorb endgültig löschen?`)) return;
    try {
      setError(null);
      await layoutsApi.emptyTrash();
      setSuccess('Papierkorb geleert.');
      await loadData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Fehler beim Leeren des Papierkorbs.');
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

  const handleOpenCreateDialog = () => {
    setNewPageForm({
      title: '',
      slug: '',
      content: '',
      is_published: false
    });
    setCreateDialogOpen(true);
  };

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };

  const handleCreatePage = async () => {
    if (!newPageForm.title.trim() || !newPageForm.slug.trim()) {
      setError('Titel und Slug sind erforderlich');
      return;
    }

    try {
      setCreatingPage(true);
      setError(null);
      await layoutsApi.createPage({
        title: newPageForm.title.trim(),
        slug: newPageForm.slug.trim().toLowerCase().replace(/\s+/g, '-'),
        content: newPageForm.content || '<p></p>',
        is_published: newPageForm.is_published
      });
      setSuccess('Seite erfolgreich erstellt!');
      setCreateDialogOpen(false);
      await loadData();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Fehler beim Erstellen der Seite.');
      console.error('Error creating page:', err);
    } finally {
      setCreatingPage(false);
    }
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
          {activeTab === 0 && (
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleOpenCreateDialog}
            >
              Neue Seite
            </Button>
          )}
          {activeTab === 1 && trashedPages.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteForever />}
              onClick={handleEmptyTrash}
            >
              Papierkorb leeren
            </Button>
          )}
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

      <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 2 }}>
        <Tab label={`Seiten (${pages.length})`} />
        <Tab label={`Papierkorb (${trashedPages.length})`} />
      </Tabs>

      {activeTab === 0 && (
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
                  <TableCell></TableCell>
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
                        <Typography variant="body1" fontWeight={600}>{page.title}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">/{page.slug}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{getLayoutName(page.layout)}</Typography>
                      </TableCell>
                      <TableCell sx={{ minWidth: 250 }}>
                        <Select
                          fullWidth
                          size="small"
                          value={currentValue}
                          onChange={(e) => handleLayoutChange(page.id, e.target.value as string)}
                          displayEmpty
                        >
                          <MenuItem value=""><em>Kein Layout</em></MenuItem>
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
                          <Chip label="Geändert" color="warning" size="small" sx={{ ml: 1 }} />
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="In Papierkorb">
                          <IconButton size="small" color="error" onClick={() => handleTrashPage(page.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {activeTab === 1 && (
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Seite</strong></TableCell>
                  <TableCell><strong>Slug</strong></TableCell>
                  <TableCell><strong>In Papierkorb seit</strong></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {trashedPages.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                      Papierkorb ist leer
                    </TableCell>
                  </TableRow>
                )}
                {trashedPages.map((page) => (
                  <TableRow key={page.id} sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                    <TableCell>
                      <Typography variant="body1" fontWeight={600}>{page.title}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">/{page.slug}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {page.trashed_at ? new Date(page.trashed_at).toLocaleString('de-DE') : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Wiederherstellen">
                          <IconButton size="small" color="primary" onClick={() => handleRestorePage(page.id)}>
                            <RestoreFromTrash fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Endgültig löschen">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => {
                              if (window.confirm(`"${page.title}" endgültig löschen?`)) handleDeletePage(page.id);
                            }}
                          >
                            <DeleteForever fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {activeTab === 0 && pages.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Keine Seiten vorhanden
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Erstellen Sie eine neue Seite, um Layouts zuzuweisen.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleOpenCreateDialog}
          >
            Erste Seite erstellen
          </Button>
        </Box>
      )}

      {activeTab === 0 && layouts.length === 0 && pages.length > 0 && (
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

      {/* Create Page Dialog */}
      <Dialog open={createDialogOpen} onClose={handleCloseCreateDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Neue Seite erstellen</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Titel"
              value={newPageForm.title}
              onChange={(e) => setNewPageForm({ ...newPageForm, title: e.target.value })}
              placeholder="z.B. Über uns"
              required
            />
            <TextField
              fullWidth
              label="Slug (URL-Pfad)"
              value={newPageForm.slug}
              onChange={(e) => setNewPageForm({ ...newPageForm, slug: e.target.value })}
              placeholder="z.B. ueber-uns"
              helperText="Der Slug wird automatisch aus dem Titel generiert, kann aber angepasst werden"
              required
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Inhalt (optional)"
              value={newPageForm.content}
              onChange={(e) => setNewPageForm({ ...newPageForm, content: e.target.value })}
              placeholder="HTML-Inhalt oder leer lassen..."
            />
            <Divider />
            <FormControlLabel
              control={
                <Switch
                  checked={newPageForm.is_published}
                  onChange={(e) => setNewPageForm({ ...newPageForm, is_published: e.target.checked })}
                />
              }
              label="Seite veröffentlichen"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateDialog}>Abbrechen</Button>
          <Button
            variant="contained"
            onClick={handleCreatePage}
            disabled={creatingPage || !newPageForm.title.trim() || !newPageForm.slug.trim()}
          >
            {creatingPage ? <CircularProgress size={24} /> : 'Seite erstellen'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPageLayouts;
