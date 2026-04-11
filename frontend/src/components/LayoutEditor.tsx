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
  Alert,
  Grid,
  FormControlLabel,
  Switch,
  Divider
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
import IconSelector from './IconSelector';
import WysiwygEditor from './WysiwygEditor';
import GradientSelector from './GradientSelector';

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
    background_gradient: '',
    padding_top: 80,
    padding_bottom: 80,
    is_full_width: false,
    is_visible: true,
    metadata: {} as Record<string, any>
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
    metadata: {} as Record<string, any>,
    order: 0,
    is_visible: true
  });

  // Section type configurations with specific fields
  const sectionTypeConfig: Record<string, {
    label: string;
    description: string;
    fields: string[];
    blockTypes: string[];
  }> = {
    hero: {
      label: 'Hero Section',
      description: 'Große Bühne mit Titel, Untertitel und Call-to-Action',
      fields: ['title', 'subtitle', 'cta_text', 'cta_link', 'height', 'text_align', 'overlay_opacity'],
      blockTypes: []
    },
    features: {
      label: 'Features Section',
      description: 'Feature-Grid mit Icons',
      fields: ['title', 'subtitle', 'columns'],
      blockTypes: ['feature']
    },
    cards: {
      label: 'Card Grid',
      description: 'Karten mit Bild, Text und Link',
      fields: ['title', 'subtitle', 'columns', 'card_elevation'],
      blockTypes: ['card']
    },
    timeline: {
      label: 'Timeline',
      description: 'Zeitstrahl mit Ereignissen',
      fields: ['title', 'subtitle', 'line_color', 'dot_color'],
      blockTypes: ['timeline_item']
    },
    gallery: {
      label: 'Image Gallery',
      description: 'Bildergalerie',
      fields: ['title', 'subtitle', 'columns'],
      blockTypes: ['image']
    },
    video: {
      label: 'Video Section',
      description: 'Video-Einbettung',
      fields: ['title', 'subtitle', 'video_url'],
      blockTypes: []
    },
    testimonials: {
      label: 'Testimonials',
      description: 'Kundenstimmen mit Avatar',
      fields: ['title', 'subtitle', 'columns', 'card_elevation'],
      blockTypes: ['testimonial']
    },
    cta: {
      label: 'Call to Action',
      description: 'Aufforderung zum Handeln',
      fields: ['title', 'subtitle', 'primary_button_text', 'primary_button_link', 'secondary_button_text', 'secondary_button_link', 'text_align', 'overlay_opacity'],
      blockTypes: []
    },
    text: {
      label: 'Text Content',
      description: 'Reiner Textbereich',
      fields: ['title', 'subtitle', 'text_align'],
      blockTypes: ['text']
    },
    team: {
      label: 'Team Members',
      description: 'Team-Mitglieder mit Foto',
      fields: ['title', 'subtitle', 'columns'],
      blockTypes: ['team_member']
    },
    pricing: {
      label: 'Pricing Table',
      description: 'Preistabelle',
      fields: ['title', 'subtitle'],
      blockTypes: ['pricing_plan']
    },
    faq: {
      label: 'FAQ Accordion',
      description: 'Häufig gestellte Fragen',
      fields: ['title', 'subtitle', 'accordion_spacing'],
      blockTypes: ['faq_item']
    },
    contact_form: {
      label: 'Contact Form',
      description: 'Kontaktformular',
      fields: ['title', 'subtitle'],
      blockTypes: []
    },
    stats: {
      label: 'Stats/Numbers',
      description: 'Statistiken mit Zahlen',
      fields: ['title', 'subtitle', 'columns'],
      blockTypes: ['stat']
    },
    logo_grid: {
      label: 'Logo Grid',
      description: 'Logo-Raster',
      fields: ['title', 'subtitle', 'columns'],
      blockTypes: ['logo']
    },
    process_steps: {
      label: 'Process Steps',
      description: 'Prozessschritte',
      fields: ['title', 'subtitle', 'columns'],
      blockTypes: ['step']
    },
    newsletter: {
      label: 'Newsletter Signup',
      description: 'Newsletter-Anmeldung',
      fields: ['title', 'subtitle', 'content', 'button_text', 'placeholder_text', 'overlay_opacity'],
      blockTypes: []
    }
  };

  // Block type configurations with specific fields
  const blockTypeConfig: Record<string, {
    label: string;
    fields: string[];
  }> = {
    text: {
      label: 'Text Block',
      fields: ['title', 'subtitle', 'content']
    },
    image: {
      label: 'Image',
      fields: ['image_url', 'image_alt', 'link_url']
    },
    video: {
      label: 'Video',
      fields: ['video_url']
    },
    card: {
      label: 'Card',
      fields: ['title', 'subtitle', 'content', 'image_url', 'image_alt', 'link_url', 'link_text']
    },
    timeline_item: {
      label: 'Timeline Item',
      fields: ['title', 'subtitle', 'content', 'date']
    },
    testimonial: {
      label: 'Testimonial',
      fields: ['content', 'name', 'role', 'image_url', 'image_alt']
    },
    team_member: {
      label: 'Team Member',
      fields: ['title', 'subtitle', 'content', 'image_url', 'image_alt']
    },
    feature: {
      label: 'Feature',
      fields: ['title', 'content', 'icon_name', 'icon_color']
    },
    stat: {
      label: 'Statistic',
      fields: ['title', 'content', 'icon_name', 'icon_color']
    },
    step: {
      label: 'Process Step',
      fields: ['title', 'content', 'icon_name', 'icon_color']
    },
    button: {
      label: 'Button',
      fields: ['link_text', 'link_url']
    },
    icon: {
      label: 'Icon',
      fields: ['icon_name', 'icon_color']
    },
    faq_item: {
      label: 'FAQ Item',
      fields: ['title', 'content']
    },
    pricing_plan: {
      label: 'Pricing Plan',
      fields: ['title', 'subtitle', 'content', 'link_text', 'link_url']
    },
    logo: {
      label: 'Logo',
      fields: ['image_url', 'link_url']
    }
  };

  // Helper to check if a field should be shown
  const shouldShowField = (type: string, field: string, isSection: boolean) => {
    const config = isSection ? sectionTypeConfig[type] : blockTypeConfig[type];
    if (!config) return true; // Show all if no config
    return config.fields.includes(field);
  };

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

  const sectionTypes = Object.entries(sectionTypeConfig).map(([value, config]) => ({
    value,
    label: config.label
  }));

  const blockTypes = Object.entries(blockTypeConfig).map(([value, config]) => ({
    value,
    label: config.label
  }));

  const backgroundTypes = [
    { value: 'none', label: 'None' },
    { value: 'color', label: 'Solid Color' },
    { value: 'gradient', label: 'Gradient' },
    { value: 'image', label: 'Image' },
    { value: 'pattern', label: 'Pattern' }
  ];

  const patternOptions = [
    { value: 'dots', label: 'Punkte', pattern: 'radial-gradient(circle, #000 1px, transparent 1px)', size: '20px 20px' },
    { value: 'grid', label: 'Raster', pattern: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', size: '20px 20px' },
    { value: 'lines-diagonal', label: 'Diagonale Linien', pattern: 'repeating-linear-gradient(45deg, #000, #000 1px, transparent 1px, transparent 10px)', size: 'auto' },
    { value: 'lines-horizontal', label: 'Horizontale Linien', pattern: 'repeating-linear-gradient(0deg, #000, #000 1px, transparent 1px, transparent 10px)', size: 'auto' },
    { value: 'checkerboard', label: 'Schachbrett', pattern: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', size: '20px 20px' },
    { value: 'crosshatch', label: 'Kreuzschraffur', pattern: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, #000 0, #000 1px, transparent 0, transparent 50%)', size: '10px 10px' },
    { value: 'dots-large', label: 'Große Punkte', pattern: 'radial-gradient(circle, #000 2px, transparent 2px)', size: '30px 30px' },
    { value: 'zigzag', label: 'Zickzack', pattern: 'linear-gradient(135deg, #000 25%, transparent 25%) -10px 0, linear-gradient(225deg, #000 25%, transparent 25%) -10px 0, linear-gradient(315deg, #000 25%, transparent 25%), linear-gradient(45deg, #000 25%, transparent 25%)', size: '20px 20px' }
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
        background_gradient: section.metadata?.background_gradient || '',
        padding_top: section.padding_top,
        padding_bottom: section.padding_bottom,
        is_full_width: section.is_full_width,
        is_visible: section.is_visible,
        metadata: {
          ...section.metadata,
          pattern_type: section.metadata?.pattern_type || 'dots',
          pattern_color: section.metadata?.pattern_color || '#000000'
        }
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
        background_gradient: '',
        padding_top: 80,
        padding_bottom: 80,
        is_full_width: false,
        is_visible: true,
        metadata: {}
      });
    }
    setSectionDialogOpen(true);
  };

  const handleSaveSection = async () => {
    try {
      setError(null);
      const data = {
        ...sectionForm,
        page_layout: layoutId,
        metadata: {
          ...sectionForm.metadata,
          ...(sectionForm.background_type === 'gradient' && sectionForm.background_gradient ? {
            background_gradient: sectionForm.background_gradient
          } : {}),
          ...(sectionForm.background_type === 'pattern' ? {
            pattern_type: sectionForm.metadata?.pattern_type || 'dots',
            pattern_color: sectionForm.metadata?.pattern_color || '#000000'
          } : {})
        }
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
        metadata: block.metadata || {},
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
        metadata: {},
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
          <Box sx={{ pt: 2 }}>
            {/* Section Type Info */}
            <Paper variant="outlined" sx={{ p: 2, mb: 3, backgroundColor: 'primary.light', color: 'primary.contrastText' }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {sectionTypeConfig[sectionForm.section_type]?.label || 'Section'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {sectionTypeConfig[sectionForm.section_type]?.description || ''}
              </Typography>
            </Paper>

            <Grid container spacing={2}>
              {/* Section Type & Order - Always visible */}
              <Grid size={{ xs: 12, md: 6 }}>
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
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Reihenfolge"
                  value={sectionForm.order}
                  onChange={(e) => setSectionForm({ ...sectionForm, order: parseInt(e.target.value) })}
                />
              </Grid>

              {/* Title - Always visible */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Titel"
                  value={sectionForm.title}
                  onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
                />
              </Grid>

              {/* Subtitle - Always visible */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Untertitel"
                  value={sectionForm.subtitle}
                  onChange={(e) => setSectionForm({ ...sectionForm, subtitle: e.target.value })}
                />
              </Grid>

              {/* CTA Fields - Hero & CTA sections */}
              {shouldShowField(sectionForm.section_type, 'cta_text', true) && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="CTA Button Text"
                    value={sectionForm.metadata?.cta_text || ''}
                    onChange={(e) => setSectionForm({ 
                      ...sectionForm, 
                      metadata: { ...sectionForm.metadata, cta_text: e.target.value }
                    })}
                    placeholder="z.B. Jetzt anfragen"
                  />
                </Grid>
              )}

              {shouldShowField(sectionForm.section_type, 'cta_link', true) && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="CTA Link URL"
                    value={sectionForm.metadata?.cta_link || ''}
                    onChange={(e) => setSectionForm({ 
                      ...sectionForm, 
                      metadata: { ...sectionForm.metadata, cta_link: e.target.value }
                    })}
                    placeholder="https://..."
                  />
                </Grid>
              )}

              {/* Height - Hero section */}
              {shouldShowField(sectionForm.section_type, 'height', true) && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Höhe"
                    value={sectionForm.metadata?.height || ''}
                    onChange={(e) => setSectionForm({ 
                      ...sectionForm, 
                      metadata: { ...sectionForm.metadata, height: e.target.value }
                    })}
                    placeholder="70vh oder 500px"
                  />
                </Grid>
              )}

              {/* Text Align - Hero, CTA, Text sections */}
              {shouldShowField(sectionForm.section_type, 'text_align', true) && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="Text-Ausrichtung"
                    value={sectionForm.metadata?.text_align || 'center'}
                    onChange={(e) => setSectionForm({ 
                      ...sectionForm, 
                      metadata: { ...sectionForm.metadata, text_align: e.target.value }
                    })}
                  >
                    <MenuItem value="left">Links</MenuItem>
                    <MenuItem value="center">Zentriert</MenuItem>
                    <MenuItem value="right">Rechts</MenuItem>
                  </TextField>
                </Grid>
              )}

              {/* Overlay Opacity - Hero, CTA, Newsletter sections */}
              {shouldShowField(sectionForm.section_type, 'overlay_opacity', true) && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    inputProps={{ min: 0, max: 1, step: 0.1 }}
                    label="Overlay Transparenz (0-1)"
                    value={sectionForm.metadata?.overlay_opacity ?? 0.5}
                    onChange={(e) => setSectionForm({ 
                      ...sectionForm, 
                      metadata: { ...sectionForm.metadata, overlay_opacity: parseFloat(e.target.value) }
                    })}
                  />
                </Grid>
              )}

              {/* Columns - Grid sections */}
              {shouldShowField(sectionForm.section_type, 'columns', true) && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    select
                    fullWidth
                    label="Spalten (Desktop)"
                    value={sectionForm.metadata?.columns || 3}
                    onChange={(e) => setSectionForm({ 
                      ...sectionForm, 
                      metadata: { ...sectionForm.metadata, columns: parseInt(e.target.value) }
                    })}
                  >
                    <MenuItem value={1}>1 Spalte</MenuItem>
                    <MenuItem value={2}>2 Spalten</MenuItem>
                    <MenuItem value={3}>3 Spalten</MenuItem>
                    <MenuItem value={4}>4 Spalten</MenuItem>
                    <MenuItem value={6}>6 Spalten</MenuItem>
                  </TextField>
                </Grid>
              )}

              {/* Card Elevation - Cards, Testimonials */}
              {shouldShowField(sectionForm.section_type, 'card_elevation', true) && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    inputProps={{ min: 0, max: 24, step: 1 }}
                    label="Schatten (0-24)"
                    value={sectionForm.metadata?.card_elevation ?? 1}
                    onChange={(e) => setSectionForm({ 
                      ...sectionForm, 
                      metadata: { ...sectionForm.metadata, card_elevation: parseInt(e.target.value) }
                    })}
                  />
                </Grid>
              )}

              {/* Timeline Colors */}
              {shouldShowField(sectionForm.section_type, 'line_color', true) && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Linienfarbe (Hex)"
                    value={sectionForm.metadata?.line_color || ''}
                    onChange={(e) => setSectionForm({ 
                      ...sectionForm, 
                      metadata: { ...sectionForm.metadata, line_color: e.target.value }
                    })}
                    placeholder="#1976d2"
                  />
                </Grid>
              )}

              {shouldShowField(sectionForm.section_type, 'dot_color', true) && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Punktfarbe (Hex)"
                    value={sectionForm.metadata?.dot_color || ''}
                    onChange={(e) => setSectionForm({ 
                      ...sectionForm, 
                      metadata: { ...sectionForm.metadata, dot_color: e.target.value }
                    })}
                    placeholder="#1976d2"
                  />
                </Grid>
              )}

              {/* Video URL */}
              {shouldShowField(sectionForm.section_type, 'video_url', true) && (
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Video URL"
                    value={sectionForm.metadata?.video_url || ''}
                    onChange={(e) => setSectionForm({ 
                      ...sectionForm, 
                      metadata: { ...sectionForm.metadata, video_url: e.target.value }
                    })}
                    placeholder="https://youtube.com/... oder https://vimeo.com/..."
                  />
                </Grid>
              )}

              {/* Buttons - CTA Section */}
              {shouldShowField(sectionForm.section_type, 'primary_button_text', true) && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Primärer Button Text"
                    value={sectionForm.metadata?.primary_button_text || ''}
                    onChange={(e) => setSectionForm({ 
                      ...sectionForm, 
                      metadata: { ...sectionForm.metadata, primary_button_text: e.target.value }
                    })}
                    placeholder="z.B. Mehr erfahren"
                  />
                </Grid>
              )}

              {shouldShowField(sectionForm.section_type, 'primary_button_link', true) && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Primärer Button Link"
                    value={sectionForm.metadata?.primary_button_link || ''}
                    onChange={(e) => setSectionForm({ 
                      ...sectionForm, 
                      metadata: { ...sectionForm.metadata, primary_button_link: e.target.value }
                    })}
                    placeholder="https://..."
                  />
                </Grid>
              )}

              {shouldShowField(sectionForm.section_type, 'secondary_button_text', true) && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Sekundärer Button Text"
                    value={sectionForm.metadata?.secondary_button_text || ''}
                    onChange={(e) => setSectionForm({ 
                      ...sectionForm, 
                      metadata: { ...sectionForm.metadata, secondary_button_text: e.target.value }
                    })}
                    placeholder="z.B. Kontakt"
                  />
                </Grid>
              )}

              {shouldShowField(sectionForm.section_type, 'secondary_button_link', true) && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Sekundärer Button Link"
                    value={sectionForm.metadata?.secondary_button_link || ''}
                    onChange={(e) => setSectionForm({ 
                      ...sectionForm, 
                      metadata: { ...sectionForm.metadata, secondary_button_link: e.target.value }
                    })}
                    placeholder="https://..."
                  />
                </Grid>
              )}

              {/* Newsletter specific fields */}
              {shouldShowField(sectionForm.section_type, 'content', true) && sectionForm.section_type === 'newsletter' && (
                <Grid size={{ xs: 12 }}>
                  <WysiwygEditor
                    label="Zusätzlicher Text"
                    value={sectionForm.metadata?.content || ''}
                    onChange={(value) => setSectionForm({ 
                      ...sectionForm, 
                      metadata: { ...sectionForm.metadata, content: value }
                    })}
                    minHeight={100}
                  />
                </Grid>
              )}

              {shouldShowField(sectionForm.section_type, 'button_text', true) && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Button Text"
                    value={sectionForm.metadata?.button_text || ''}
                    onChange={(e) => setSectionForm({ 
                      ...sectionForm, 
                      metadata: { ...sectionForm.metadata, button_text: e.target.value }
                    })}
                    placeholder="z.B. Abonnieren"
                  />
                </Grid>
              )}

              {shouldShowField(sectionForm.section_type, 'placeholder_text', true) && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Placeholder Text"
                    value={sectionForm.metadata?.placeholder_text || ''}
                    onChange={(e) => setSectionForm({ 
                      ...sectionForm, 
                      metadata: { ...sectionForm.metadata, placeholder_text: e.target.value }
                    })}
                    placeholder="z.B. Ihre E-Mail Adresse"
                  />
                </Grid>
              )}

              {/* FAQ Accordion Spacing */}
              {shouldShowField(sectionForm.section_type, 'accordion_spacing', true) && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Abstand zwischen Items (px)"
                    value={sectionForm.metadata?.accordion_spacing ?? 2}
                    onChange={(e) => setSectionForm({ 
                      ...sectionForm, 
                      metadata: { ...sectionForm.metadata, accordion_spacing: parseInt(e.target.value) }
                    })}
                  />
                </Grid>
              )}
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Background Settings */}
            <Typography variant="subtitle2" gutterBottom>Erscheinungsbild</Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
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
              </Grid>
              
              {sectionForm.background_type === 'color' && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Hintergrundfarbe (Hex)"
                    value={sectionForm.background_color}
                    onChange={(e) => setSectionForm({ ...sectionForm, background_color: e.target.value })}
                    placeholder="#1976d2"
                  />
                </Grid>
              )}
              
              {sectionForm.background_type === 'gradient' && (
                <Grid size={{ xs: 12 }}>
                  <GradientSelector
                    value={sectionForm.background_gradient}
                    onChange={(value) => setSectionForm({ ...sectionForm, background_gradient: value })}
                  />
                </Grid>
              )}

              {sectionForm.background_type === 'image' && (
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Hintergrundbild URL"
                    value={sectionForm.background_image}
                    onChange={(e) => setSectionForm({ ...sectionForm, background_image: e.target.value })}
                  />
                </Grid>
              )}

              {sectionForm.background_type === 'pattern' && (
                <>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      select
                      fullWidth
                      label="Muster auswählen"
                      value={sectionForm.metadata?.pattern_type || 'dots'}
                      onChange={(e) => setSectionForm({
                        ...sectionForm,
                        metadata: { ...sectionForm.metadata, pattern_type: e.target.value }
                      })}
                    >
                      {patternOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                backgroundColor: '#e0e0e0',
                                backgroundImage: option.pattern,
                                backgroundSize: option.size,
                                borderRadius: 0.5,
                                border: '1px solid #ccc'
                              }}
                            />
                            {option.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      type="color"
                      label="Musterfarbe"
                      value={sectionForm.metadata?.pattern_color || '#000000'}
                      onChange={(e) => setSectionForm({
                        ...sectionForm,
                        metadata: { ...sectionForm.metadata, pattern_color: e.target.value }
                      })}
                      sx={{ '& input': { height: 40, padding: 0 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Paper
                      variant="outlined"
                      sx={{
                        height: 80,
                        backgroundColor: sectionForm.background_color || '#f5f5f5',
                        backgroundImage: patternOptions.find(p => p.value === (sectionForm.metadata?.pattern_type || 'dots'))?.pattern.replace(/#000/g, sectionForm.metadata?.pattern_color || '#000000'),
                        backgroundSize: patternOptions.find(p => p.value === (sectionForm.metadata?.pattern_type || 'dots'))?.size,
                        borderRadius: 1
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      Vorschau des Musters
                    </Typography>
                  </Grid>
                </>
              )}

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Padding oben (px)"
                  value={sectionForm.padding_top}
                  onChange={(e) => setSectionForm({ ...sectionForm, padding_top: parseInt(e.target.value) })}
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Padding unten (px)"
                  value={sectionForm.padding_bottom}
                  onChange={(e) => setSectionForm({ ...sectionForm, padding_bottom: parseInt(e.target.value) })}
                />
              </Grid>
            </Grid>
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
          <Typography variant="caption" display="block" color="text.secondary">
            {blockTypeConfig[blockForm.block_type]?.label || 'Block'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              {/* Block Type & Order - Always visible */}
              <Grid size={{ xs: 12, md: 6 }}>
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
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Reihenfolge"
                  value={blockForm.order}
                  onChange={(e) => setBlockForm({ ...blockForm, order: parseInt(e.target.value) })}
                />
              </Grid>

              {/* Title - Most block types */}
              {shouldShowField(blockForm.block_type, 'title', false) && (
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label={blockForm.block_type === 'testimonial' ? 'Name' : 'Titel'}
                    value={blockForm.title}
                    onChange={(e) => setBlockForm({ ...blockForm, title: e.target.value })}
                    placeholder={blockForm.block_type === 'timeline_item' ? 'Ereignis-Titel' : 
                                 blockForm.block_type === 'pricing_plan' ? 'Plan-Name (z.B. Basic)' : 'Titel'}
                  />
                </Grid>
              )}

              {/* Subtitle - Most block types */}
              {shouldShowField(blockForm.block_type, 'subtitle', false) && (
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label={blockForm.block_type === 'testimonial' ? 'Rolle/Position' : 
                             blockForm.block_type === 'timeline_item' ? 'Ort/Unternehmen' :
                             blockForm.block_type === 'pricing_plan' ? 'Preis (z.B. €29/Monat)' : 'Untertitel'}
                    value={blockForm.subtitle}
                    onChange={(e) => setBlockForm({ ...blockForm, subtitle: e.target.value })}
                  />
                </Grid>
              )}

              {/* Content with WYSIWYG for text-heavy blocks */}
              {shouldShowField(blockForm.block_type, 'content', false) && (
                <Grid size={{ xs: 12 }}>
                  {blockForm.block_type === 'text' || blockForm.block_type === 'testimonial' ? (
                    <WysiwygEditor
                      label={blockForm.block_type === 'testimonial' ? 'Testimonial Text' : 'Inhalt'}
                      value={blockForm.content}
                      onChange={(value) => setBlockForm({ ...blockForm, content: value })}
                      placeholder={blockForm.block_type === 'testimonial' ? '"Wir sind sehr zufrieden mit..."' : 'Inhalt eingeben...'}
                      minHeight={blockForm.block_type === 'testimonial' ? 100 : 150}
                    />
                  ) : (
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label={blockForm.block_type === 'pricing_plan' ? 'Beschreibung' : 
                               blockForm.block_type === 'timeline_item' ? 'Beschreibung' : 'Inhalt'}
                      value={blockForm.content}
                      onChange={(e) => setBlockForm({ ...blockForm, content: e.target.value })}
                    />
                  )}
                </Grid>
              )}

              {/* Date - Timeline Item */}
              {shouldShowField(blockForm.block_type, 'date', false) && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label="Datum/Zeitraum"
                    value={blockForm.metadata?.date || ''}
                    onChange={(e) => setBlockForm({ 
                      ...blockForm, 
                      metadata: { ...blockForm.metadata, date: e.target.value }
                    })}
                    placeholder="z.B. Jan 2024 oder 2020-2024"
                  />
                </Grid>
              )}

              {/* Image Fields - Card, Image, Team Member, Testimonial */}
              {shouldShowField(blockForm.block_type, 'image_url', false) && (
                <>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label={blockForm.block_type === 'logo' ? 'Logo URL' : 'Bild URL'}
                      value={blockForm.image_url}
                      onChange={(e) => setBlockForm({ ...blockForm, image_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </Grid>
                  {blockForm.block_type !== 'logo' && (
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Bild Alt-Text"
                        value={blockForm.image_alt}
                        onChange={(e) => setBlockForm({ ...blockForm, image_alt: e.target.value })}
                        placeholder="Beschreibung für Screenreader"
                      />
                    </Grid>
                  )}
                </>
              )}

              {/* Video URL */}
              {shouldShowField(blockForm.block_type, 'video_url', false) && (
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Video URL"
                    value={blockForm.video_url}
                    onChange={(e) => setBlockForm({ ...blockForm, video_url: e.target.value })}
                    placeholder="YouTube oder Vimeo URL"
                  />
                </Grid>
              )}

              {/* Link Fields */}
              {shouldShowField(blockForm.block_type, 'link_url', false) && (
                <>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label={blockForm.block_type === 'logo' ? 'Website URL (optional)' : 'Link URL'}
                      value={blockForm.link_url}
                      onChange={(e) => setBlockForm({ ...blockForm, link_url: e.target.value })}
                      placeholder="https://..."
                    />
                  </Grid>
                  {shouldShowField(blockForm.block_type, 'link_text', false) && (
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        fullWidth
                        label={blockForm.block_type === 'pricing_plan' ? 'CTA Text' : 'Link Text'}
                        value={blockForm.link_text}
                        onChange={(e) => setBlockForm({ ...blockForm, link_text: e.target.value })}
                        placeholder={blockForm.block_type === 'pricing_plan' ? 'Jetzt buchen' : 'Mehr erfahren'}
                      />
                    </Grid>
                  )}
                </>
              )}

              {/* Icon Fields - Feature, Stat, Step */}
              {shouldShowField(blockForm.block_type, 'icon_name', false) && (
                <>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <IconSelector
                      label="Icon auswählen"
                      value={blockForm.icon_name}
                      onChange={(iconName) => setBlockForm({ ...blockForm, icon_name: iconName })}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      type="color"
                      label="Icon Farbe"
                      value={blockForm.icon_color || '#1976d2'}
                      onChange={(e) => setBlockForm({ ...blockForm, icon_color: e.target.value })}
                      sx={{
                        '& input': {
                          height: 40,
                          padding: 0
                        }
                      }}
                    />
                  </Grid>
                </>
              )}

              {/* Testimonial - Name and Role as separate fields in metadata if needed */}
              {blockForm.block_type === 'testimonial' && (
                <>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Kundenname"
                      value={blockForm.metadata?.name || ''}
                      onChange={(e) => setBlockForm({ 
                        ...blockForm, 
                        metadata: { ...blockForm.metadata, name: e.target.value },
                        title: e.target.value // Sync with title
                      })}
                      placeholder="Max Mustermann"
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Position/Unternehmen"
                      value={blockForm.metadata?.role || ''}
                      onChange={(e) => setBlockForm({ 
                        ...blockForm, 
                        metadata: { ...blockForm.metadata, role: e.target.value },
                        subtitle: e.target.value // Sync with subtitle
                      })}
                      placeholder="CEO, Beispiel GmbH"
                    />
                  </Grid>
                </>
              )}

              {/* Pricing Plan Features (stored as array in metadata) */}
              {blockForm.block_type === 'pricing_plan' && (
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Features (eine pro Zeile)"
                    value={(blockForm.metadata?.features || []).join('\n')}
                    onChange={(e) => setBlockForm({ 
                      ...blockForm, 
                      metadata: { 
                        ...blockForm.metadata, 
                        features: e.target.value.split('\n').filter(f => f.trim())
                      }
                    })}
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                    helperText="Jede Zeile wird als ein Feature-Punkt angezeigt"
                  />
                </Grid>
              )}

              {/* FAQ Item - Title is question, content is answer */}
              {blockForm.block_type === 'faq_item' && (
                <>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Frage"
                      value={blockForm.title}
                      onChange={(e) => setBlockForm({ ...blockForm, title: e.target.value })}
                      placeholder="Wie funktioniert...?"
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <WysiwygEditor
                      label="Antwort"
                      value={blockForm.content}
                      onChange={(value) => setBlockForm({ ...blockForm, content: value })}
                      placeholder="Die Antwort auf diese Frage ist..."
                      minHeight={120}
                    />
                  </Grid>
                </>
              )}

              {/* Visibility Toggle */}
              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={blockForm.is_visible}
                      onChange={(e) => setBlockForm({ ...blockForm, is_visible: e.target.checked })}
                    />
                  }
                  label="Sichtbar"
                />
              </Grid>
            </Grid>
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
