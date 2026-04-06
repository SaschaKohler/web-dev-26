import React from 'react';
import Cal from '@calcom/embed-react';
import { Typography, Container } from '@mui/material';

function Booking() {
  return (
    <Container>
      <Typography variant="h2">Booking</Typography>
      <Cal calLink="your-cal-link" />
    </Container>
  );
}

export default Booking;