import React, { useState, useEffect } from 'react';
import { Typography, Container, Paper, Box } from '@mui/material';
import axios from 'axios';
import { API_ENDPOINTS } from '../api/config';

interface Page {
  id: number;
  title: string;
  slug: string;
  content: string;
}

function Impressum() {
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<Page[]>(`${API_ENDPOINTS.pages}/?slug=impressum`)
      .then(response => {
        if (response.data.length > 0) {
          setPage(response.data[0]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching impressum page:', error);
        setLoading(false);
      });
  }, []);

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" gutterBottom>
            {page?.title || 'Impressum'}
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {loading ? 'Lädt...' : page?.content || 'Keine Inhalte verfügbar.'}
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default Impressum;