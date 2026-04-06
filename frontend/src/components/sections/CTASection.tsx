import React from 'react';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

interface CTASectionProps {
  title: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundColor?: string;
  paddingY?: number;
}

const CTASection: React.FC<CTASectionProps> = ({
  title,
  subtitle,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  backgroundColor = 'primary.main',
  paddingY = 10
}) => {
  return (
    <Box
      sx={{
        py: paddingY,
        backgroundColor,
        color: 'white'
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="h6"
              sx={{ mb: 4, opacity: 0.9 }}
            >
              {subtitle}
            </Typography>
          )}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
          >
            {primaryButtonText && (
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                href={primaryButtonLink}
                sx={{
                  px: 4,
                  py: 1.5,
                  backgroundColor: 'white',
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)'
                  }
                }}
              >
                {primaryButtonText}
              </Button>
            )}
            {secondaryButtonText && (
              <Button
                variant="outlined"
                size="large"
                href={secondaryButtonLink}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderColor: 'white',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                {secondaryButtonText}
              </Button>
            )}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default CTASection;
