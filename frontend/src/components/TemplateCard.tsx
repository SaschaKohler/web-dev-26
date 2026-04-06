import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box, Chip } from '@mui/material';
import { Check, Palette } from '@mui/icons-material';
import { DesignTemplate } from '../api/templates';

interface TemplateCardProps {
  template: DesignTemplate;
  onActivate: (templateId: number) => void;
  onPreview: (template: DesignTemplate) => void;
  isActivating?: boolean;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ 
  template, 
  onActivate, 
  onPreview,
  isActivating = false 
}) => {
  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        border: template.is_active ? '2px solid' : '1px solid',
        borderColor: template.is_active ? 'primary.main' : 'divider',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4
        }
      }}
    >
      {template.is_active && (
        <Chip 
          icon={<Check />}
          label="Aktiv"
          color="primary"
          size="small"
          sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}
        />
      )}
      
      <Box 
        sx={{ 
          height: 120,
          background: `linear-gradient(135deg, ${template.primary_color} 0%, ${template.secondary_color} 50%, ${template.accent_color} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        <Palette sx={{ fontSize: 48, color: 'white', opacity: 0.8 }} />
      </Box>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {template.display_name}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {template.description}
        </Typography>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Box 
            sx={{ 
              width: 32, 
              height: 32, 
              borderRadius: 1, 
              bgcolor: template.primary_color,
              border: '1px solid',
              borderColor: 'divider'
            }} 
            title="Primärfarbe"
          />
          <Box 
            sx={{ 
              width: 32, 
              height: 32, 
              borderRadius: 1, 
              bgcolor: template.secondary_color,
              border: '1px solid',
              borderColor: 'divider'
            }} 
            title="Sekundärfarbe"
          />
          <Box 
            sx={{ 
              width: 32, 
              height: 32, 
              borderRadius: 1, 
              bgcolor: template.accent_color,
              border: '1px solid',
              borderColor: 'divider'
            }} 
            title="Akzentfarbe"
          />
        </Box>

        <Typography variant="caption" display="block" sx={{ mt: 2 }}>
          Schriftart: {template.heading_font.split(',')[0]}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          size="small" 
          onClick={() => onPreview(template)}
          variant="outlined"
        >
          Vorschau
        </Button>
        <Button 
          size="small" 
          onClick={() => onActivate(template.id)}
          variant="contained"
          disabled={template.is_active || isActivating}
        >
          {template.is_active ? 'Aktiv' : 'Aktivieren'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default TemplateCard;
