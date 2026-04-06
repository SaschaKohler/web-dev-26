import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { Circle } from '@mui/icons-material';

interface TimelineItem {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  date?: string;
}

interface TimelineProps {
  title?: string;
  subtitle?: string;
  items: TimelineItem[];
  paddingY?: number;
  backgroundColor?: string;
  backgroundImage?: string;
  lineColor?: string;
  dotColor?: string;
}

const Timeline: React.FC<TimelineProps> = ({
  title,
  subtitle,
  items,
  paddingY = 8,
  backgroundColor,
  backgroundImage,
  lineColor = 'primary.main',
  dotColor = 'primary.main'
}) => {
  return (
    <Box sx={{ 
      py: paddingY, 
      backgroundColor: backgroundColor || 'background.default',
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <Container maxWidth="md">
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
        
        <Box sx={{ position: 'relative' }}>
          {/* Timeline line */}
          <Box
            sx={{
              position: 'absolute',
              left: { xs: '20px', md: '50%' },
              top: 0,
              bottom: 0,
              width: '2px',
              backgroundColor: lineColor,
              transform: { md: 'translateX(-50%)' }
            }}
          />
          
          {items.map((item, index) => (
            <Box
              key={item.id}
              sx={{
                position: 'relative',
                mb: 6,
                display: 'flex',
                flexDirection: { xs: 'row', md: index % 2 === 0 ? 'row' : 'row-reverse' },
                alignItems: 'center'
              }}
            >
              {/* Timeline dot */}
              <Box
                sx={{
                  position: 'absolute',
                  left: { xs: '11px', md: '50%' },
                  transform: { md: 'translateX(-50%)' },
                  zIndex: 2
                }}
              >
                <Circle
                  sx={{
                    fontSize: 20,
                    color: dotColor,
                    backgroundColor: 'background.paper',
                    borderRadius: '50%'
                  }}
                />
              </Box>
              
              {/* Content */}
              <Box
                sx={{
                  width: { xs: 'calc(100% - 60px)', md: 'calc(50% - 40px)' },
                  ml: { xs: '60px', md: index % 2 === 0 ? 0 : '40px' },
                  mr: { md: index % 2 === 0 ? '40px' : 0 }
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: 4
                    }
                  }}
                >
                  {item.date && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'primary.main',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 1
                      }}
                    >
                      {item.date}
                    </Typography>
                  )}
                  <Typography variant="h5" gutterBottom sx={{ mt: 1 }}>
                    {item.title}
                  </Typography>
                  {item.subtitle && (
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                      {item.subtitle}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    {item.content}
                  </Typography>
                </Paper>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Timeline;
