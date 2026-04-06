import React from 'react';
import { Box, Container, Typography } from '@mui/material';

interface Stat {
  id: number;
  title: string;
  content: string;
  icon_name?: string;
  icon_color?: string;
}

interface StatsSectionProps {
  title?: string;
  subtitle?: string;
  stats: Stat[];
  backgroundColor?: string;
  backgroundImage?: string;
  paddingTop?: number;
  paddingBottom?: number;
  columns?: { xs: number; sm: number; md: number };
}

const StatsSection: React.FC<StatsSectionProps> = ({
  title,
  subtitle,
  stats,
  backgroundColor,
  backgroundImage,
  paddingTop = 80,
  paddingBottom = 80,
  columns = { xs: 1, sm: 2, md: 4 }
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
        position: 'relative',
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
          {stats.map((stat) => (
            <Box
              key={stat.id}
              sx={{
                textAlign: 'center',
                p: 3,
              }}
            >
              <Typography
                variant="h2"
                component="div"
                sx={{
                  fontWeight: 700,
                  color: stat.icon_color || 'primary.main',
                  mb: 1,
                }}
              >
                {stat.content}
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                {stat.title}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default StatsSection;
