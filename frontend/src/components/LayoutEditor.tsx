import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  TextField,
  MenuItem,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import {
  ExpandMore,
  Add,
  Delete,
  Edit,
  DragIndicator,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';
import { layoutsApi, Section, ContentBlock } from '../api/layouts';

interface LayoutEditorProps {
  layoutId: number;
  onClose: () => void;
}

const LayoutEditor: React.FC<LayoutEditorProps> = ({ layoutId, onClose }) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [sectionDialogOpen, setSectionDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [currentSectionId, setCurrentSectionId] = useState<number | null>(null);
  
  const [sectionForm, setSectionForm] = useState({
    section_type: 'hero',
    title: '',
    subtitle: '',
    order: 0,
    background_type: 'none',
    background_color: '',
    background_image: '',
    padding_top: 80,
    padding_bottom: 80,
    is_full_width: false,
    is_visible: true
  });

  const [blockForm, setBlockForm] = useState({
    block_type: 'text',
    title: '',
    subtitle: '',
    content: '',
    image_url: '',
    image_alt: '',
    video_url: '',
    link_url: '',
    link_text: '',
    icon_name: '',
    icon_color: '',
    order: 0,
    is_visible: true
  });

  useEffect(() => {
    loadSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layoutId]);

  const loadSections = async () => {
    try {
      setLoading(true);
      const data = await layoutsApi.getSections(layoutId);
      setSections(data.sort((a, b) => a.order - b.order));
    } catch (err) {
      setError('Fehler beim Laden der Sections.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sectionTypes = [
    { value: 'hero', label: 'Hero Section' },
    { value: 'features', label: 'Features Section' },
    { value: 'cards', label: 'Card Grid' },
    { value: 'timeline', label: 'Timeline' },
    { value: 'gallery', label: 'Image Gallery' },
    { value: 'video', label: 'Video Section' },
    { value: 'testimonials', label: 'Testimonials' },
    { value: 'cta', label: 'Call to Action' },
    { value: 'text', label: 'Text Content' },
    { value: 'team', label: 'Team Members' },
    { value: 'pricing', label: 'Pricing Table' },
    { value: 'faq', label: 'FAQ Accordion' },
    { value: 'contact_form', label: 'Contact Form' }
  ];

  const blockTypes = [
    { value: 'text', label: 'Text Block' },
    { value: 'image', label: 'Image' },
    { value: 'video', label: 'Video' },
    { value: 'card', label: 'Card' },
    { value: 'timeline_item', label: 'Timeline Item' },
    { value: 'testimonial', label: 'Testimonial' },
    { value: 'team_member', label: 'Team Member' },
    { value: 'feature', label: 'Feature' },
    { value: 'stat', label: 'Statistic' },
    { value: 'button', label: 'Button' },
    { value: 'icon', label: 'Icon' }
  ];

  const backgroundTypes = [
    { value: 'none', label: 'None' },
    { value: 'color', label: 'Solid Color' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'image', label: 'Image' },
    { value: 'pattern', label: 'Pattern' }
  ];

  const handleOpenSectionDialog = (section?: Section) => {
    if (section) {
      setEditingSection(section);
      setSectionForm({
        section_type: section.section_type,
        title: section.title || '',
        subtitle: section.subtitle || '',
        order: section.order,
        background_type: section.background_type,
        background_color: section.background_color || '',
        background_image: section.background_image || '',
        padding_top: section.padding_top,
        padding_bottom: section.padding_bottom,
        is_full_width: section.is_full_width,
        is_visible: section.is_visible
      });
    } else {
      setEditingSection(null);
      setSectionForm({
        section_type: 'hero',
        title: '',
        subtitle: '',
        order: sections.length,
        background_type: 'none',
        background_color: '',
        background_image: '',
        padding_top: 80,
        padding_bottom: 80,
        is_full_width: false,
        is_visible: true
      });
    }
    setSectionDialogOpen(true);
  };

  const handleSaveSection = async () => {
    try {
      setError(null);
      const data = {
        ...sectionForm,
        page_layout: layoutId
      };
      
      if (editingSection) {
        await layoutsApi.updateSection(editingSection.id, data);
        setSuccess('Section aktualisiert!');
      } else {
        await layoutsApi.createSection(data);
        setSuccess('Section erstellt!');
      }
      
      setSectionDialogOpen(false);
      await loadSections();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Fehler beim Speichern der Section.');
      console.error(err);
    }
  };

  const handleDeleteSection = async (sectionId: number) => {
    if (!window.confirm('Section wirklich löschen?')) return;
    
    try {
      await layoutsApi.deleteSection(sectionId);
      setSuccess('Section gelöscht!');
      await loadSections();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Fehler beim Löschen der Section.');
      console.error(err);
    }
  };

  const handleMoveSection = async (section: Section, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(s => s.id === section.id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (newIndex < 0 || newIndex >= sections.length) return;
    
    try {
      await layoutsApi.updateSection(section.id, { order: newIndex });
      await layoutsApi.updateSection(sections[newIndex].id, { order: currentIndex });
      await loadSections();
    } catch (err) {
      setError('Fehler beim Verschieben der Section.');
      console.error(err);
    }
  };

  const handleOpenBlockDialog = (sectionId: number, block?: ContentBlock) => {
    setCurrentSectionId(sectionId);
    
    if (block) {
      setEditingBlock(block);
      setBlockForm({
        block_type: block.block_type,
        title: block.title,
        subtitle: block.subtitle || '',
        content: block.content,
        image_url: block.image_url || '',
        image_alt: block.image_alt || '',
        video_url: block.video_url || '',
        link_url: block.link_url || '',
        link_text: block.link_text || '',
        icon_name: block.icon_name || '',
        icon_color: block.icon_color || '',
        order: block.order,
        is_visible: block.is_visible
      });
    } else {
      setEditingBlock(null);
      const section = sections.find(s => s.id === sectionId);
      setBlockForm({
        block_type: 'text',
        title: '',
        subtitle: '',
        content: '',
        image_url: '',
        image_alt: '',
        video_url: '',
        link_url: '',
        link_text: '',
        icon_name: '',
        icon_color: '',
        order: section?.content_blocks?.length || 0,
        is_visible: true
      });
    }
    setBlockDialogOpen(true);
  };

  const handleSaveBlock = async () => {
    if (!currentSectionId) return;
    
    try {
      setError(null);
      const data = {
        ...blockForm,
        section: currentSectionId
      };
      
      if (editingBlock) {
        await layoutsApi.updateContentBlock(editingBlock.id, data);
        setSuccess('Block aktualisiert!');
      } else {
        await layoutsApi.createContentBlock(data);
        setSuccess('Block erstellt!');
      }
      
      setBlockDialogOpen(false);
      await loadSections();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Fehler beim Speichern des Blocks.');
      console.error(err);
    }
  };

  const handleDeleteBlock = async (blockId: number) => {
    if (!window.confirm('Block wirklich löschen?')) return;
    
    try {
      await layoutsApi.deleteContentBlock(blockId);
      setSuccess('Block gelöscht!');
      await loadSections();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Fehler beim Löschen des Blocks.');
      console.error(err);
    }
  };

  if (loading) return <Typography>Laden...</Typography>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Sections & Content Blocks</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenSectionDialog()}
          >
            Section hinzufügen
          </Button>
          <Button onClick={onClose}>Schließen</Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {sections.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Keine Sections vorhanden
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenSectionDialog()}
            sx={{ mt: 2 }}
          >
            Erste Section erstellen
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {sections.map((section, index) => (
            <Accordion key={section.id}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <DragIndicator sx={{ color: 'text.secondary' }} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">
                      {section.title || section.section_type_display}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                      <Chip label={section.section_type_display} size="small" />
                      <Chip
                        label={`${section.content_blocks?.length || 0} Blocks`}
                        size="small"
                        variant="outlined"
                      />
                      {!section.is_visible && (
                        <Chip label="Versteckt" size="small" color="warning" />
                      )}
                    </Stack>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveSection(section, 'up');
                      }}
                      disabled={index === 0}
                    >
                      <ArrowUpward />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveSection(section, 'down');
                      }}
                      disabled={index === sections.length - 1}
                    >
                      <ArrowDownward />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSectionDialog(section);
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSection(section.id);
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Stack>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Content Blocks
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<Add />}
                      onClick={() => handleOpenBlockDialog(section.id)}
                    >
                      Block hinzufügen
                    </Button>
                  </Box>
                  
                  {section.content_blocks && section.content_blocks.length > 0 ? (
                    <Stack spacing={1}>
                      {section.content_blocks
                        .sort((a, b) => a.order - b.order)
                        .map((block) => (
                          <Paper key={block.id} variant="outlined" sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="body2" fontWeight={600}>
                                  {block.title || `${block.block_type} Block`}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {block.block_type}
                                </Typography>
                              </Box>
                              <Stack direction="row" spacing={1}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenBlockDialog(section.id, block)}
                                >
                                  <Edit fontSize="small" />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteBlock(block.id)}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Stack>
                            </Box>
                          </Paper>
                        ))}
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      Keine Blocks vorhanden
                    </Typography>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      )}

      {/* Section Dialog */}
      <Dialog open={sectionDialogOpen} onClose={() => setSectionDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSection ? 'Section bearbeiten' : 'Neue Section erstellen'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            <TextField
              select
              fullWidth
              label="Section-Typ"
              value={sectionForm.section_type}
              onChange={(e) => setSectionForm({ ...sectionForm, section_type: e.target.value })}
            >
              {sectionTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              fullWidth
              type="number"
              label="Reihenfolge"
              value={sectionForm.order}
              onChange={(e) => setSectionForm({ ...sectionForm, order: parseInt(e.target.value) })}
            />
            
            <TextField
              fullWidth
              label="Titel"
              value={sectionForm.title}
              onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
              sx={{ gridColumn: '1 / -1' }}
            />
            
            <TextField
              fullWidth
              label="Untertitel"
              value={sectionForm.subtitle}
              onChange={(e) => setSectionForm({ ...sectionForm, subtitle: e.target.value })}
              sx={{ gridColumn: '1 / -1' }}
            />
            
            <TextField
              select
              fullWidth
              label="Hintergrund-Typ"
              value={sectionForm.background_type}
              onChange={(e) => setSectionForm({ ...sectionForm, background_type: e.target.value })}
            >
              {backgroundTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            
            {sectionForm.background_type === 'color' && (
              <TextField
                fullWidth
                label="Hintergrundfarbe (Hex)"
                value={sectionForm.background_color}
                onChange={(e) => setSectionForm({ ...sectionForm, background_color: e.target.value })}
                placeholder="#1976d2"
              />
            )}
            
            {sectionForm.background_type === 'image' && (
              <TextField
                fullWidth
                label="Hintergrundbild URL"
                value={sectionForm.background_image}
                onChange={(e) => setSectionForm({ ...sectionForm, background_image: e.target.value })}
                sx={{ gridColumn: '1 / -1' }}
              />
            )}
            
            <TextField
              fullWidth
              type="number"
              label="Padding oben (px)"
              value={sectionForm.padding_top}
              onChange={(e) => setSectionForm({ ...sectionForm, padding_top: parseInt(e.target.value) })}
            />
            
            <TextField
              fullWidth
              type="number"
              label="Padding unten (px)"
              value={sectionForm.padding_bottom}
              onChange={(e) => setSectionForm({ ...sectionForm, padding_bottom: parseInt(e.target.value) })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSectionDialogOpen(false)}>Abbrechen</Button>
          <Button onClick={handleSaveSection} variant="contained">
            Speichern
          </Button>
        </DialogActions>
      </Dialog>

      {/* Block Dialog */}
      <Dialog open={blockDialogOpen} onClose={() => setBlockDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingBlock ? 'Block bearbeiten' : 'Neuen Block erstellen'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            <TextField
              select
              fullWidth
              label="Block-Typ"
              value={blockForm.block_type}
              onChange={(e) => setBlockForm({ ...blockForm, block_type: e.target.value })}
            >
              {blockTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              fullWidth
              type="number"
              label="Reihenfolge"
              value={blockForm.order}
              onChange={(e) => setBlockForm({ ...blockForm, order: parseInt(e.target.value) })}
            />
            
            <TextField
              fullWidth
              label="Titel"
              value={blockForm.title}
              onChange={(e) => setBlockForm({ ...blockForm, title: e.target.value })}
              sx={{ gridColumn: '1 / -1' }}
            />
            
            <TextField
              fullWidth
              label="Untertitel"
              value={blockForm.subtitle}
              onChange={(e) => setBlockForm({ ...blockForm, subtitle: e.target.value })}
              sx={{ gridColumn: '1 / -1' }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Inhalt"
              value={blockForm.content}
              onChange={(e) => setBlockForm({ ...blockForm, content: e.target.value })}
              sx={{ gridColumn: '1 / -1' }}
            />
            
            {['image', 'card'].includes(blockForm.block_type) && (
              <>
                <TextField
                  fullWidth
                  label="Bild URL"
                  value={blockForm.image_url}
                  onChange={(e) => setBlockForm({ ...blockForm, image_url: e.target.value })}
                  sx={{ gridColumn: '1 / -1' }}
                />
                <TextField
                  fullWidth
                  label="Bild Alt-Text"
                  value={blockForm.image_alt}
                  onChange={(e) => setBlockForm({ ...blockForm, image_alt: e.target.value })}
                  sx={{ gridColumn: '1 / -1' }}
                />
              </>
            )}
            
            {blockForm.block_type === 'video' && (
              <TextField
                fullWidth
                label="Video URL"
                value={blockForm.video_url}
                onChange={(e) => setBlockForm({ ...blockForm, video_url: e.target.value })}
                sx={{ gridColumn: '1 / -1' }}
              />
            )}
            
            {['button', 'card'].includes(blockForm.block_type) && (
              <>
                <TextField
                  fullWidth
                  label="Link URL"
                  value={blockForm.link_url}
                  onChange={(e) => setBlockForm({ ...blockForm, link_url: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Link Text"
                  value={blockForm.link_text}
                  onChange={(e) => setBlockForm({ ...blockForm, link_text: e.target.value })}
                />
              </>
            )}
            
            {blockForm.block_type === 'feature' && (
              <>
                <TextField
                  fullWidth
                  label="Icon Name (MUI)"
                  value={blockForm.icon_name}
                  onChange={(e) => setBlockForm({ ...blockForm, icon_name: e.target.value })}
                  placeholder="CheckCircle"
                />
                <TextField
                  fullWidth
                  label="Icon Farbe (Hex)"
                  value={blockForm.icon_color}
                  onChange={(e) => setBlockForm({ ...blockForm, icon_color: e.target.value })}
                  placeholder="#1976d2"
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockDialogOpen(false)}>Abbrechen</Button>
          <Button onClick={handleSaveBlock} variant="contained">
            Speichern
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LayoutEditor;
