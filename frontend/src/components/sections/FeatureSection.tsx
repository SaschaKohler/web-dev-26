import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import * as Icons from '@mui/icons-material';

interface Feature {
  id: number;
  title: string;
  content: string;
  iconName?: string;
  iconColor?: string;
}

interface FeatureSectionProps {
  title?: string;
  subtitle?: string;
  features: Feature[];
  columns?: { xs: number; sm: number; md: number };
  paddingY?: number;
}

const FeatureSection: React.FC<FeatureSectionProps> = ({
  title,
  subtitle,
  features,
  columns = { xs: 1, sm: 2, md: 3 },
  paddingY = 8
}) => {
  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  return (
    <Box sx={{ py: paddingY, backgroundColor: 'background.default' }}>
      <Container maxWidth="lg">
        {title && (
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h2" gutterBottom>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto' }}>
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
          {features.map((feature) => (
            <Paper
              key={feature.id}
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                transition: 'all 0.3s ease',
                border: '1px solid',
                borderColor: 'divider',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 4,
                  borderColor: 'primary.main'
                }
              }}
            >
              {feature.iconName && (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    backgroundColor: feature.iconColor || 'primary.main',
                    color: 'white',
                    mb: 2,
                    fontSize: 32
                  }}
                >
                  {getIcon(feature.iconName)}
                </Box>
              )}
              <Typography variant="h5" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feature.content}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FeatureSection;
