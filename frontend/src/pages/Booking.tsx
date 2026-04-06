import React from 'react';
import Cal from '@calcom/embed-react';
import { Typography, Container, Box, Paper } from '@mui/material';
import DynamicPage from '../components/DynamicPage';

function Booking() {
  // Fallback-Content falls kein Layout zugeordnet ist
  const fallbackContent = (
    <Container maxWidth="lg">
      <Box my={4}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h3" gutterBottom>
            Terminbuchung
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Buchen Sie hier Ihren persönlichen Beratungstermin.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Cal calLink="your-cal-link" />
          </Box>
        </Paper>
      </Box>
    </Container>
  );

  return (
    <>
      <DynamicPage slug="booking" fallbackContent={fallbackContent} />
      {/* Cal.com Integration - wird nach dem dynamischen Content angezeigt */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>
            Wählen Sie Ihren Wunschtermin
          </Typography>
          <Cal calLink="your-cal-link" />
        </Paper>
      </Container>
    </>
  );
}

export default Booking;