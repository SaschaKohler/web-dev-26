import React from 'react';
import { Typography, Container, Paper, Box } from '@mui/material';
import DynamicPage from '../components/DynamicPage';

function About() {
  const fallbackContent = (
    <Container maxWidth="lg">
      <Box my={4}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" gutterBottom>
            Über mich
          </Typography>
          <Typography variant="body1">
            Informationen über unsere Praxis und unser Team.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );

  return <DynamicPage slug="about" fallbackContent={fallbackContent} />;
}

export default About;