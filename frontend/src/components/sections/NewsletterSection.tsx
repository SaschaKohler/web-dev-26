import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Alert } from '@mui/material';

interface NewsletterSectionProps {
  title?: string;
  subtitle?: string;
  content?: string;
  buttonText?: string;
  placeholderText?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  paddingTop?: number;
  paddingBottom?: number;
  overlayOpacity?: number;
}

const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  title = 'Subscribe to Our Newsletter',
  subtitle = 'Stay updated with our latest news and updates',
  content,
  buttonText = 'Subscribe',
  placeholderText = 'Enter your email',
  backgroundColor,
  backgroundImage,
  paddingTop = 80,
  paddingBottom = 80,
  overlayOpacity = 0.5
}) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    try {
      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail('');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        py: `${paddingTop}px`,
        pb: `${paddingBottom}px`,
        backgroundColor: backgroundColor || 'primary.main',
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
        } : {},
      }}
    >
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center' }}>
            {title && (
              <Typography
                variant="h2"
                component="h2"
                gutterBottom
                sx={{ fontWeight: 700, color: 'inherit' }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                variant="h5"
                sx={{ mb: 4, opacity: 0.9 }}
              >
                {subtitle}
              </Typography>
            )}
            {content && (
              <Typography
                variant="body1"
                sx={{ mb: 4, opacity: 0.9 }}
              >
                {content}
              </Typography>
            )}

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                maxWidth: '600px',
                mx: 'auto',
                mb: 2,
              }}
            >
              <TextField
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholderText}
                variant="outlined"
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  minWidth: { xs: '100%', sm: '150px' },
                  backgroundColor: 'secondary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'secondary.dark',
                  },
                }}
              >
                {buttonText}
              </Button>
            </Box>

            {status !== 'idle' && (
              <Alert
                severity={status === 'success' ? 'success' : 'error'}
                sx={{ maxWidth: '600px', mx: 'auto' }}
              >
                {message}
              </Alert>
            )}
          </Box>
      </Container>
    </Box>
  );
};

export default NewsletterSection;
