import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Paper,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton
} from '@mui/material';
import {
  Palette,
  Layers,
  Pages,
  Settings,
  Dashboard as DashboardIcon,
  TrendingUp,
  Article,
  Visibility,
  Edit,
  Add,
  ArrowForward,
  Refresh,
  History
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { layoutsApi } from '../api/layouts';
import { templatesApi } from '../api/templates';

interface DashboardStats {
  totalPages: number;
  totalLayouts: number;
  totalTemplates: number;
  publishedPages: number;
  activeLayouts: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalPages: 0,
    totalLayouts: 0,
    totalTemplates: 0,
    publishedPages: 0,
    activeLayouts: 0
  });
  const [recentPages, setRecentPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [pages, layouts, templates] = await Promise.all([
        layoutsApi.getPages(),
        layoutsApi.getAllLayouts(),
        templatesApi.getAllTemplates()
      ]);

      setStats({
        totalPages: pages.length,
        totalLayouts: layouts.length,
        totalTemplates: templates.length,
        publishedPages: pages.filter((p: any) => p.is_published).length,
        activeLayouts: layouts.filter((l: any) => l.is_active).length
      });

      setRecentPages(pages.slice(0, 5));
      setLoading(false);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Fehler beim Laden der Dashboard-Daten');
      setLoading(false);
    }
  };

  const adminSections = [
    {
      title: 'Dekaden-Designs',
      description: 'Wählen Sie authentische Design-Stile aus den 90er, 2000er, 2010er oder 2020er Jahren',
      icon: <History sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      route: '/admin/decade-themes',
      stats: '12 Dekaden-Themes',
      actions: [
        { label: 'Dekaden-Themes verwalten', action: () => navigate('/admin/decade-themes') }
      ]
    },
    {
      title: 'Global Templates',
      description: 'Header, Navigation und Footer für Ihre gesamte Website konfigurieren',
      icon: <Settings sx={{ fontSize: 40 }} />,
      color: '#00897b',
      route: '/admin/global-templates',
      stats: 'Header, Nav, Footer',
      actions: [
        { label: 'Templates verwalten', action: () => navigate('/admin/global-templates') },
        { label: 'Navigation bearbeiten', action: () => navigate('/admin/navigation') }
      ]
    },
    {
      title: 'Layout-Verwaltung',
      description: 'Erstellen und bearbeiten Sie moderne, responsive Layouts mit Sections und Blocks',
      icon: <Layers sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      route: '/admin/layouts',
      stats: `${stats.totalLayouts} Layouts (${stats.activeLayouts} aktiv)`,
      actions: [
        { label: 'Layouts verwalten', action: () => navigate('/admin/layouts') },
        { label: 'Neues Layout', action: () => navigate('/admin/layouts') }
      ]
    },
    {
      title: 'Seiten-Zuordnung',
      description: 'Weisen Sie Ihren Seiten moderne Layouts zu',
      icon: <Pages sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
      route: '/admin/page-layouts',
      stats: `${stats.totalPages} Seiten (${stats.publishedPages} veröffentlicht)`,
      actions: [
        { label: 'Zuordnungen verwalten', action: () => navigate('/admin/page-layouts') }
      ]
    },
    {
      title: 'SEO-Verwaltung',
      description: 'Optimieren Sie Meta-Tags, Open Graph und Structured Data für alle Seiten',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#d32f2f',
      route: '/admin/seo',
      stats: 'Suchmaschinenoptimierung',
      actions: [
        { label: 'SEO verwalten', action: () => navigate('/admin/seo') }
      ]
    },
    {
      title: 'Website-Einstellungen',
      description: 'Allgemeine Einstellungen, Kontaktdaten und Social Media Links',
      icon: <Settings sx={{ fontSize: 40 }} />,
      color: '#5e35b1',
      route: '/admin/site-settings',
      stats: 'Globale Einstellungen',
      actions: [
        { label: 'Einstellungen öffnen', action: () => navigate('/admin/site-settings') }
      ]
    }
  ];

  const quickActions = [
    {
      title: 'Dekaden-Theme wählen',
      icon: <History />,
      action: () => navigate('/admin/decade-themes'),
      color: 'secondary'
    },
    {
      title: 'Neues Layout erstellen',
      icon: <Add />,
      action: () => navigate('/admin/layouts'),
      color: 'primary'
    },
    {
      title: 'Seite bearbeiten',
      icon: <Edit />,
      action: () => navigate('/admin/page-layouts'),
      color: 'success'
    }
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <DashboardIcon sx={{ fontSize: 40 }} />
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Zentrale Verwaltung Ihrer Website
          </Typography>
        </Box>
        <IconButton onClick={loadDashboardData} title="Aktualisieren">
          <Refresh />
        </IconButton>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Overview */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {stats.totalPages}
            </Typography>
            <Typography variant="body2">
              Seiten gesamt
            </Typography>
            <Typography variant="caption">
              {stats.publishedPages} veröffentlicht
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {stats.totalLayouts}
            </Typography>
            <Typography variant="body2">
              Layouts
            </Typography>
            <Typography variant="caption">
              {stats.activeLayouts} aktiv
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {stats.totalTemplates}
            </Typography>
            <Typography variant="body2">
              Design-Templates
            </Typography>
          </CardContent>
        </Card>
        <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUp />
              <Typography variant="h4">
                100%
              </Typography>
            </Box>
            <Typography variant="body2">
              System Status
            </Typography>
            <Typography variant="caption">
              Alle Systeme betriebsbereit
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ArrowForward />
          Schnellaktionen
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mt: 1 }}>
          {quickActions.map((action, index) => (
            <Button
              key={index}
              fullWidth
              variant="outlined"
              color={action.color as any}
              startIcon={action.icon}
              onClick={action.action}
              sx={{ py: 1.5 }}
            >
              {action.title}
            </Button>
          ))}
        </Box>
      </Paper>

      {/* Admin Sections */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Verwaltungsbereiche
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
        {adminSections.map((section, index) => (
          <Card key={index} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ color: section.color }}>
                  {section.icon}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {section.title}
                  </Typography>
                  <Chip label={section.stats} size="small" />
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {section.description}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
              {section.actions.map((action, actionIndex) => (
                <Button
                  key={actionIndex}
                  size="small"
                  variant={actionIndex === 0 ? 'contained' : 'outlined'}
                  onClick={action.action}
                  endIcon={<ArrowForward />}
                >
                  {action.label}
                </Button>
              ))}
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Recent Pages */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Article />
          Letzte Seiten
        </Typography>
        <List>
          {recentPages.map((page, index) => (
            <React.Fragment key={page.id}>
              <ListItem
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      edge="end"
                      onClick={() => window.open(`/${page.slug}`, '_blank')}
                      title="Ansehen"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => navigate('/admin/page-layouts')}
                      title="Bearbeiten"
                    >
                      <Edit />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemIcon>
                  <Pages />
                </ListItemIcon>
                <ListItemText
                  primary={page.title}
                  secondary={
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        /{page.slug}
                      </Typography>
                      {page.is_published ? (
                        <Chip label="Veröffentlicht" size="small" color="success" />
                      ) : (
                        <Chip label="Entwurf" size="small" />
                      )}
                      {page.layout && (
                        <Chip label="Layout zugeordnet" size="small" color="primary" />
                      )}
                    </Box>
                  }
                />
              </ListItem>
              {index < recentPages.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
        {recentPages.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            Keine Seiten vorhanden
          </Typography>
        )}
      </Paper>

      {/* Help Section */}
      <Paper sx={{ p: 3, mt: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h6" gutterBottom>
          💡 Schnellstart-Anleitung
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              1. Dekaden-Design wählen
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Wählen Sie einen authentischen Stil aus den 90er, 2000er, 2010er oder 2020er Jahren.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              2. Design anpassen
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Oder passen Sie ein Design-Template unter "Design-Templates" individuell an.
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              3. Layout erstellen
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Erstellen Sie moderne Layouts mit Sections und Blocks unter "Layout-Verwaltung".
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              4. Seiten zuordnen
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Weisen Sie Ihren Seiten die erstellten Layouts unter "Seiten-Zuordnung" zu.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
