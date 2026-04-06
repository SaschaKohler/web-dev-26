import React from 'react';
import { Typography, Container, Paper, Box } from '@mui/material';
import DynamicPage from '../components/DynamicPage';

function Impressum() {
  const fallbackContent = (
    <Container maxWidth="lg">
      <Box my={4}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" gutterBottom>
            Impressum
          </Typography>
          <Typography variant="body1">
            Impressum wird geladen...
          </Typography>
        </Paper>
      </Box>
    </Container>
  );

  return <DynamicPage slug="impressum" fallbackContent={fallbackContent} />;
}

export default Impressum;