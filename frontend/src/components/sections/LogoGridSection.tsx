import React from 'react';
import { Box, Container, Typography } from '@mui/material';

interface Logo {
  id: number;
  title: string;
  image_url: string;
  image_alt?: string;
  link_url?: string;
}

interface LogoGridSectionProps {
  title?: string;
  subtitle?: string;
  logos: Logo[];
  backgroundColor?: string;
  backgroundImage?: string;
  paddingTop?: number;
  paddingBottom?: number;
  columns?: { xs: number; sm: number; md: number };
  logoHeight?: number;
}

const LogoGridSection: React.FC<LogoGridSectionProps> = ({
  title,
  subtitle,
  logos,
  backgroundColor,
  backgroundImage,
  paddingTop = 80,
  paddingBottom = 80,
  columns = { xs: 2, sm: 3, md: 4 },
  logoHeight = 100
}) => {
  return (
    <Box
      sx={{
        py: `${paddingTop}px`,
        pb: `${paddingBottom}px`,
        backgroundColor: backgroundColor || 'transparent',
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="lg">
        {(title || subtitle) && (
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            {title && (
              <Typography
                variant="h2"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700 }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                variant="h5"
                color="text.secondary"
                sx={{ maxWidth: '800px', mx: 'auto' }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: `repeat(${columns.xs}, 1fr)`,
              sm: `repeat(${columns.sm}, 1fr)`,
              md: `repeat(${columns.md}, 1fr)`
            },
            gap: 4
          }}
        >
          {logos.map((logo) => (
            <Box
              key={logo.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                height: `${logoHeight}px`,
                filter: 'grayscale(100%)',
                opacity: 0.7,
                transition: 'all 0.3s ease',
                '&:hover': {
                  filter: 'grayscale(0%)',
                  opacity: 1,
                },
              }}
            >
              {logo.link_url ? (
                <a
                  href={logo.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}
                >
                  <img
                    src={logo.image_url}
                    alt={logo.image_alt || logo.title}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </a>
              ) : (
                <img
                  src={logo.image_url}
                  alt={logo.image_alt || logo.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default LogoGridSection;
