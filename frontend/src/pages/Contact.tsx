import React from 'react';
import { Typography, Container, Paper, Box } from '@mui/material';
import DynamicPage from '../components/DynamicPage';

function Contact() {
  const fallbackContent = (
    <Container maxWidth="lg">
      <Box my={4}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" gutterBottom>
            Kontakt
          </Typography>
          <Typography variant="body1">
            Kontaktinformationen werden geladen...
          </Typography>
        </Paper>
      </Box>
    </Container>
  );

  return <DynamicPage slug="contact" fallbackContent={fallbackContent} />;
}

export default Contact;