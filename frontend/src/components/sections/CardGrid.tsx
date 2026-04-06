import React from 'react';
import { Box, Container, Typography, Card, CardContent, CardMedia, CardActions, Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

interface CardItem {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  imageUrl?: string;
  linkUrl?: string;
  linkText?: string;
}

interface CardGridProps {
  title?: string;
  subtitle?: string;
  cards: CardItem[];
  columns?: { xs: number; sm: number; md: number };
  paddingY?: number;
}

const CardGrid: React.FC<CardGridProps> = ({
  title,
  subtitle,
  cards,
  columns = { xs: 1, sm: 2, md: 3 },
  paddingY = 8
}) => {
  return (
    <Box sx={{ py: paddingY }}>
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
          {cards.map((card) => (
            <Card
              key={card.id}
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
            >
              {card.imageUrl && (
                <CardMedia
                  component="img"
                  height="200"
                  image={card.imageUrl}
                  alt={card.title}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" gutterBottom>
                  {card.title}
                </Typography>
                {card.subtitle && (
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {card.subtitle}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary">
                  {card.content}
                </Typography>
              </CardContent>
              {card.linkUrl && card.linkText && (
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    endIcon={<ArrowForward />}
                    href={card.linkUrl}
                  >
                    {card.linkText}
                  </Button>
                </CardActions>
              )}
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default CardGrid;
