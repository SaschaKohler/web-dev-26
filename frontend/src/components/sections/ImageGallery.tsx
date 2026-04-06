import React, { useState } from 'react';
import { Box, Container, Typography, Dialog, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';

interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  title?: string;
}

interface ImageGalleryProps {
  title?: string;
  subtitle?: string;
  images: GalleryImage[];
  columns?: { xs: number; sm: number; md: number };
  paddingY?: number;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  title,
  subtitle,
  images,
  columns = { xs: 1, sm: 2, md: 3 },
  paddingY = 8
}) => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  return (
    <Box sx={{ py: paddingY }}>
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
            gap: 2
          }}
        >
          {images.map((image) => (
            <Box
              key={image.id}
              onClick={() => setSelectedImage(image)}
              sx={{
                position: 'relative',
                paddingTop: '75%',
                overflow: 'hidden',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  '& img': {
                    filter: 'brightness(0.8)'
                  }
                }
              }}
            >
              <Box
                component="img"
                src={image.url}
                alt={image.alt}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'filter 0.3s ease'
                }}
              />
              {image.title && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    p: 2
                  }}
                >
                  <Typography variant="body2">{image.title}</Typography>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Container>

      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
        fullWidth
      >
        {selectedImage && (
          <Box sx={{ position: 'relative', backgroundColor: 'black' }}>
            <IconButton
              onClick={() => setSelectedImage(null)}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)'
                }
              }}
            >
              <Close />
            </IconButton>
            <Box
              component="img"
              src={selectedImage.url}
              alt={selectedImage.alt}
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '90vh',
                objectFit: 'contain'
              }}
            />
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default ImageGallery;
