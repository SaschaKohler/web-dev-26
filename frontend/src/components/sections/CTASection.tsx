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
  backgroundImage?: string;
  paddingY?: number;
  textAlign?: 'left' | 'center' | 'right';
  overlayOpacity?: number;
}

const CTASection: React.FC<CTASectionProps> = ({
  title,
  subtitle,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  backgroundColor = 'primary.main',
  backgroundImage,
  paddingY = 10,
  textAlign = 'center',
  overlayOpacity = 0.5
}) => {
  return (
    <Box
      sx={{
        py: paddingY,
        backgroundColor: !backgroundImage ? backgroundColor : 'transparent',
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        position: 'relative',
        '&::before': backgroundImage ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
        } : {}
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign }}>
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
