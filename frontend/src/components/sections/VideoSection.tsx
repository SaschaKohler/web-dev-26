import React from 'react';
import { Box, Container, Typography } from '@mui/material';

interface VideoSectionProps {
  title?: string;
  subtitle?: string;
  videoUrl: string;
  aspectRatio?: string;
  paddingY?: number;
}

const VideoSection: React.FC<VideoSectionProps> = ({
  title,
  subtitle,
  videoUrl,
  aspectRatio = '16/9',
  paddingY = 8
}) => {
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const isVimeo = videoUrl.includes('vimeo.com');
  
  const getEmbedUrl = () => {
    if (isYouTube) {
      const videoId = videoUrl.split('v=')[1]?.split('&')[0] || videoUrl.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (isVimeo) {
      const videoId = videoUrl.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return videoUrl;
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
              <Typography variant="h6" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        )}
        
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            paddingTop: `calc(100% / (${aspectRatio}))`,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 4
          }}
        >
          {(isYouTube || isVimeo) ? (
            <Box
              component="iframe"
              src={getEmbedUrl()}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
            />
          ) : (
            <Box
              component="video"
              controls
              src={videoUrl}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default VideoSection;
