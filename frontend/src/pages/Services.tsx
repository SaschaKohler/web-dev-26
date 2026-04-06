import React from 'react';
import { Typography, Container, Paper, Box } from '@mui/material';
import DynamicPage from '../components/DynamicPage';

function Services() {
  const fallbackContent = (
    <Container maxWidth="lg">
      <Box my={4}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" gutterBottom>
            Leistungen
          </Typography>
          <Typography variant="body1">
            Unsere Beratungsleistungen im Überblick.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );

  return <DynamicPage slug="services" fallbackContent={fallbackContent} />;
}

export default Services;