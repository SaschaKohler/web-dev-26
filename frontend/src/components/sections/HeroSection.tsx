import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundColor?: string;
  ctaText?: string;
  ctaLink?: string;
  height?: string | number;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  backgroundImage,
  backgroundColor = 'primary.main',
  ctaText,
  ctaLink,
  height = '70vh'
}) => {
  return (
    <Box
      sx={{
        position: 'relative',
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundColor: !backgroundImage ? backgroundColor : 'transparent',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        '&::before': backgroundImage ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        } : {}
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '4rem' },
            fontWeight: 700,
            mb: 2,
            textShadow: backgroundImage ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none'
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              mb: 4,
              maxWidth: '800px',
              mx: 'auto',
              textShadow: backgroundImage ? '1px 1px 2px rgba(0,0,0,0.3)' : 'none'
            }}
          >
            {subtitle}
          </Typography>
        )}
        {ctaText && (
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            href={ctaLink}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              }
            }}
          >
            {ctaText}
          </Button>
        )}
      </Container>
    </Box>
  );
};

export default HeroSection;
