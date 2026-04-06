import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';

interface Step {
  id: number;
  title: string;
  content: string;
  icon_name?: string;
  icon_color?: string;
  order: number;
}

interface ProcessStepsSectionProps {
  title?: string;
  subtitle?: string;
  steps: Step[];
  backgroundColor?: string;
  backgroundImage?: string;
  paddingTop?: number;
  paddingBottom?: number;
  columns?: { xs: number; sm: number; md: number };
}

const ProcessStepsSection: React.FC<ProcessStepsSectionProps> = ({
  title,
  subtitle,
  steps,
  backgroundColor,
  backgroundImage,
  paddingTop = 80,
  paddingBottom = 80,
  columns = { xs: 1, sm: 2, md: 4 }
}) => {
  const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

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
          {sortedSteps.map((step, index) => (
            <Paper
              key={step.id}
              elevation={2}
              sx={{
                p: 3,
                height: '100%',
                position: 'relative',
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: step.icon_color || 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  mx: 'auto',
                  mb: 2,
                }}
              >
                {index + 1}
              </Box>
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                {step.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {step.content}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default ProcessStepsSection;
