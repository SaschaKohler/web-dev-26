import React from 'react';
import { Box, Container, Typography, Paper, Avatar } from '@mui/material';
import { FormatQuote } from '@mui/icons-material';

interface Testimonial {
  id: number;
  content: string;
  name: string;
  role?: string;
  imageUrl?: string;
}

interface TestimonialSectionProps {
  title?: string;
  subtitle?: string;
  testimonials: Testimonial[];
  columns?: { xs: number; sm: number; md: number };
  paddingY?: number;
  backgroundColor?: string;
  backgroundImage?: string;
  cardElevation?: number;
}

const TestimonialSection: React.FC<TestimonialSectionProps> = ({
  title,
  subtitle,
  testimonials,
  columns = { xs: 1, sm: 2, md: 3 },
  paddingY = 8,
  backgroundColor,
  backgroundImage,
  cardElevation = 2
}) => {
  return (
    <Box sx={{ 
      py: paddingY, 
      backgroundColor: backgroundColor || 'background.default',
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <Container maxWidth="lg">
        {title && (
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="h6" color="text.secondary">
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
            gap: 3
          }}
        >
          {testimonials.map((testimonial) => (
            <Paper
              key={testimonial.id}
              elevation={cardElevation}
              sx={{
                p: 4,
                position: 'relative',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <FormatQuote
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  fontSize: 48,
                  color: 'primary.main',
                  opacity: 0.2
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  mb: 3,
                  fontStyle: 'italic',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                "{testimonial.content}"
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={testimonial.imageUrl}
                  alt={testimonial.name}
                  sx={{ width: 56, height: 56 }}
                >
                  {testimonial.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {testimonial.name}
                  </Typography>
                  {testimonial.role && (
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.role}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default TestimonialSection;
