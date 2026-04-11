import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Slider,
  Popover,
  Tooltip
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';

// Inline Color Picker Component
interface ColorPickerButtonProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPickerButton: React.FC<ColorPickerButtonProps> = ({ color, onChange }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  // Common color palette
  const colors = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
    '#FF0000', '#FF4D4D', '#FF9999', '#00FF00', '#4DFF4D', '#99FF99',
    '#0000FF', '#4D4DFF', '#9999FF', '#FFFF00', '#FFFF4D', '#FFFF99',
    '#FF00FF', '#FF4DFF', '#FF99FF', '#00FFFF', '#4DFFFF', '#99FFFF',
    '#FF8800', '#FFAA4D', '#FFCC99', '#8800FF', '#AA4DFF', '#CC99FF',
    '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe',
    '#43e97b', '#38f9d7', '#fa709a', '#fee140', '#30cfd0', '#330867'
  ];

  return (
    <>
      <Tooltip title={color}>
        <Button
          onClick={handleClick}
          sx={{
            width: 40,
            height: 40,
            minWidth: 40,
            backgroundColor: color,
            border: '2px solid #ddd',
            borderRadius: 1,
            p: 0,
            '&:hover': {
              borderColor: '#1976d2',
              backgroundColor: color
            }
          }}
        />
      </Tooltip>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, width: 280 }}>
          <Typography variant="subtitle2" gutterBottom>Farbwähler</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {colors.map((c) => (
              <Box
                key={c}
                onClick={() => {
                  onChange(c);
                  handleClose();
                }}
                sx={{
                  width: 28,
                  height: 28,
                  backgroundColor: c,
                  borderRadius: 0.5,
                  cursor: 'pointer',
                  border: color === c ? '2px solid #1976d2' : '1px solid #ddd',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    borderColor: '#1976d2'
                  }
                }}
              />
            ))}
          </Box>
          <TextField
            fullWidth
            size="small"
            label="Hex Farbe"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#1976d2"
            sx={{
              '& input': {
                backgroundColor: color,
                color: (theme) => {
                  const hex = color.replace('#', '');
                  const r = parseInt(hex.substr(0, 2), 16);
                  const g = parseInt(hex.substr(2, 2), 16);
                  const b = parseInt(hex.substr(4, 2), 16);
                  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                  return brightness > 128 ? '#000' : '#fff';
                }
              }
            }}
          />
        </Box>
      </Popover>
    </>
  );
};

interface GradientStop {
  color: string;
  position: number;
}

interface GradientConfig {
  type: 'linear' | 'radial';
  angle: number;
  stops: GradientStop[];
}

interface GradientSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const GradientSelector: React.FC<GradientSelectorProps> = ({ value, onChange }) => {
  const parseGradient = useCallback((gradientStr: string): GradientConfig => {
    if (!gradientStr || !gradientStr.includes('gradient')) {
      return {
        type: 'linear',
        angle: 45,
        stops: [
          { color: '#667eea', position: 0 },
          { color: '#764ba2', position: 100 }
        ]
      };
    }

    const isRadial = gradientStr.includes('radial');
    const type = isRadial ? 'radial' : 'linear';
    
    let angle = 45;
    if (!isRadial) {
      const angleMatch = gradientStr.match(/(\d+)deg/);
      if (angleMatch) angle = parseInt(angleMatch[1]);
    }

    const stops: GradientStop[] = [];
    const stopRegex = /(#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}|rgba?\([^)]+\))\s*(\d+)%?/g;
    let match;
    while ((match = stopRegex.exec(gradientStr)) !== null) {
      stops.push({
        color: match[1],
        position: parseInt(match[2]) || 0
      });
    }

    if (stops.length < 2) {
      stops.push({ color: '#667eea', position: 0 });
      stops.push({ color: '#764ba2', position: 100 });
    }

    return { type, angle, stops };
  }, []);

  const buildGradientString = useCallback((config: GradientConfig): string => {
    const sortedStops = [...config.stops].sort((a, b) => a.position - b.position);
    const stopsStr = sortedStops.map(s => `${s.color} ${s.position}%`).join(', ');
    
    if (config.type === 'radial') {
      return `radial-gradient(circle, ${stopsStr})`;
    }
    return `linear-gradient(${config.angle}deg, ${stopsStr})`;
  }, []);

  const [config, setConfig] = useState<GradientConfig>(parseGradient(value));
  const lastEmittedValue = useRef<string>(buildGradientString(parseGradient(value)));
  const isUpdating = useRef(false);

  // Update config when external value changes (initial load or parent reset)
  React.useEffect(() => {
    if (isUpdating.current) return;
    const parsed = parseGradient(value);
    const newGradientStr = buildGradientString(parsed);
    if (newGradientStr !== lastEmittedValue.current) {
      setConfig(parsed);
      lastEmittedValue.current = newGradientStr;
    }
  }, [value, parseGradient, buildGradientString]);

  // Emit change when config is updated by user interaction
  const emitChange = useCallback((newConfig: GradientConfig) => {
    isUpdating.current = true;
    const newValue = buildGradientString(newConfig);
    lastEmittedValue.current = newValue;
    onChange(newValue);
    setTimeout(() => {
      isUpdating.current = false;
    }, 0);
  }, [buildGradientString, onChange]);

  const updateStop = (index: number, field: keyof GradientStop, newValue: string | number) => {
    const newStops = [...config.stops];
    newStops[index] = { ...newStops[index], [field]: newValue };
    const newConfig = { ...config, stops: newStops };
    setConfig(newConfig);
    emitChange(newConfig);
  };

  const addStop = () => {
    const newStops = [...config.stops];
    const lastStop = newStops[newStops.length - 1];
    const position = lastStop ? Math.min(lastStop.position + 25, 100) : 50;
    newStops.push({ color: '#ffffff', position });
    const newConfig = { ...config, stops: newStops };
    setConfig(newConfig);
    emitChange(newConfig);
  };

  const removeStop = (index: number) => {
    if (config.stops.length <= 2) return;
    const newStops = config.stops.filter((_, i) => i !== index);
    const newConfig = { ...config, stops: newStops };
    setConfig(newConfig);
    emitChange(newConfig);
  };

  const updateType = (newType: 'linear' | 'radial') => {
    const newConfig = { ...config, type: newType };
    setConfig(newConfig);
    emitChange(newConfig);
  };

  const updateAngle = (newAngle: number) => {
    const newConfig = { ...config, angle: newAngle };
    setConfig(newConfig);
    emitChange(newConfig);
  };

  const loadPreset = (gradientStr: string) => {
    const parsed = parseGradient(gradientStr);
    setConfig(parsed);
    emitChange(parsed);
  };

  const presets = [
    { name: 'Sunset', gradient: 'linear-gradient(45deg, #ff6b6b, #feca57)' },
    { name: 'Ocean', gradient: 'linear-gradient(45deg, #48dbfb, #0abde3)' },
    { name: 'Forest', gradient: 'linear-gradient(45deg, #1dd1a1, #10ac84)' },
    { name: 'Berry', gradient: 'linear-gradient(45deg, #ff9ff3, #f368e0)' },
    { name: 'Night', gradient: 'linear-gradient(45deg, #576574, #222f3e)' },
    { name: 'Gold', gradient: 'linear-gradient(45deg, #feca57, #ff9f43)' },
  ];

  return (
    <Box>
      {/* Preview */}
      <Paper
        variant="outlined"
        sx={{
          height: 80,
          mb: 2,
          background: buildGradientString(config),
          borderRadius: 1
        }}
      />

      {/* Type Toggle */}
      <ToggleButtonGroup
        value={config.type}
        exclusive
        onChange={(_, newType) => newType && updateType(newType)}
        size="small"
        fullWidth
        sx={{ mb: 2 }}
      >
        <ToggleButton value="linear">Linear</ToggleButton>
        <ToggleButton value="radial">Radial</ToggleButton>
      </ToggleButtonGroup>

      {/* Angle Slider (only for linear) */}
      {config.type === 'linear' && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Winkel: {config.angle}°
          </Typography>
          <Slider
            value={config.angle}
            onChange={(_, value) => updateAngle(value as number)}
            min={0}
            max={360}
            step={5}
            marks={[
              { value: 0, label: '0°' },
              { value: 90, label: '90°' },
              { value: 180, label: '180°' },
              { value: 270, label: '270°' },
              { value: 360, label: '360°' },
            ]}
            valueLabelDisplay="auto"
          />
        </Box>
      )}

      {/* Color Stops */}
      <Typography variant="subtitle2" gutterBottom>Farben</Typography>
      <Stack spacing={1} sx={{ mb: 2 }}>
        {config.stops.map((stop, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <ColorPickerButton
              color={stop.color}
              onChange={(newColor) => updateStop(index, 'color', newColor)}
            />
            <Slider
              value={stop.position}
              onChange={(_, value) => updateStop(index, 'position', value as number)}
              min={0}
              max={100}
              sx={{ flexGrow: 1 }}
              valueLabelDisplay="auto"
            />
            <IconButton
              size="small"
              onClick={() => removeStop(index)}
              disabled={config.stops.length <= 2}
              color="error"
            >
              <Delete />
            </IconButton>
          </Box>
        ))}
      </Stack>

      <Button
        startIcon={<Add />}
        onClick={addStop}
        size="small"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
      >
        Farbe hinzufügen
      </Button>

      {/* Presets */}
      <Typography variant="subtitle2" gutterBottom>Voreinstellungen</Typography>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {presets.map((preset) => (
          <Button
            key={preset.name}
            size="small"
            variant="outlined"
            onClick={() => loadPreset(preset.gradient)}
            sx={{
              background: preset.gradient,
              color: 'white',
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              minWidth: 80,
              '&:hover': {
                opacity: 0.9
              }
            }}
          >
            {preset.name}
          </Button>
        ))}
      </Box>

      {/* Output (for debugging/reference) */}
      <TextField
        fullWidth
        size="small"
        value={buildGradientString(config)}
        sx={{ mt: 2 }}
        InputProps={{ readOnly: true }}
        helperText="CSS Gradient Code"
      />
    </Box>
  );
};

export default GradientSelector;
