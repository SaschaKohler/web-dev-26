import React from 'react';
import { Typography, Container, Paper, Box, Button } from '@mui/material';
import DynamicPage from '../components/DynamicPage';

function Home() {
  // Fallback-Content falls kein Layout zugeordnet ist
  const fallbackContent = (
    <Container maxWidth="lg">
      <Box my={4}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" gutterBottom>
            Willkommen
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Herzlich willkommen auf unserer Website für Lebens- und Sozialberatung.
          </Typography>
          <Button variant="contained" color="primary" href="/booking">
            Termin buchen
          </Button>
        </Paper>
      </Box>
    </Container>
  );

  return <DynamicPage slug="home" fallbackContent={fallbackContent} />;
}

export default Home;