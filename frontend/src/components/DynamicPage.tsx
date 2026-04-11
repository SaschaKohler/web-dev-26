import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, CircularProgress } from '@mui/material';
import { layoutsApi } from '../api/layouts';
import PageRenderer from './PageRenderer';

interface PageData {
  id: number;
  title: string;
  slug: string;
  content: string;
  layout: number | null;
  is_published: boolean;
}

interface DynamicPageProps {
  slug: string;
  fallbackContent?: React.ReactNode;
}

const DynamicPage: React.FC<DynamicPageProps> = ({ slug, fallbackContent }) => {
  const [page, setPage] = useState<PageData | null>(null);
  const [layout, setLayout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const loadPage = async () => {
    try {
      setLoading(true);
      setError(null);

      // Lade Page-Daten
      const pages = await layoutsApi.getPages();
      const currentPage = pages.find((p: any) => p.slug === slug);

      if (!currentPage) {
        setError('Seite nicht gefunden');
        setLoading(false);
        return;
      }

      setPage(currentPage);

      // Wenn ein Layout zugeordnet ist, lade es mit allen Sections
      if (currentPage.layout) {
        const layoutData = await layoutsApi.getLayoutWithSections(currentPage.layout);
        setLayout(layoutData);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading page:', err);
      setError('Fehler beim Laden der Seite');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Seite wird geladen...
        </Typography>
      </Container>
    );
  }

  if (error || !page) {
    // Wenn fallbackContent vorhanden, zeige ihn bei 404 an
    if (fallbackContent) {
      return <>{fallbackContent}</>;
    }
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            {error || 'Seite nicht gefunden'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Die angeforderte Seite konnte nicht geladen werden.
          </Typography>
        </Paper>
      </Container>
    );
  }

  // Wenn ein Layout zugeordnet ist, verwende PageRenderer
  if (layout) {
    return <PageRenderer layout={layout} />;
  }

  // Wenn Page existiert aber kein Layout hat: Standard-Rendering mit Page-Daten
  // (nicht fallbackContent, damit die dynamischen Page-Daten angezeigt werden)

  // Standard-Rendering ohne Layout
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" gutterBottom>
            {page.title}
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ whiteSpace: 'pre-wrap' }}
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default DynamicPage;
