import React, { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Grid,
  Paper,
  Typography,
  InputAdornment
} from '@mui/material';
import * as Icons from '@mui/icons-material';
import { Search } from '@mui/icons-material';

// Common MUI Icons organized by category
const iconCategories = {
  common: [
    'Home', 'Settings', 'Person', 'Search', 'Menu', 'Close', 'ArrowBack', 'ArrowForward',
    'ArrowUpward', 'ArrowDownward', 'ExpandMore', 'ExpandLess', 'Check', 'CheckCircle',
    'Cancel', 'Delete', 'Edit', 'Save', 'Add', 'Remove', 'Refresh', 'MoreVert'
  ],
  communication: [
    'Email', 'Phone', 'Chat', 'Forum', 'ContactSupport', 'Help', 'HelpOutline',
    'LiveHelp', 'QuestionAnswer', 'Message', 'Textsms', 'Feedback', 'Send'
  ],
  business: [
    'Business', 'BusinessCenter', 'Work', 'WorkOutline', 'TrendingUp', 'TrendingDown',
    'Assessment', 'Analytics', 'BarChart', 'PieChart', 'ShowChart', 'Timeline',
    'AttachMoney', 'Euro', 'AccountBalance', 'AccountBalanceWallet', 'ShoppingCart',
    'Store', 'Storefront', 'LocalOffer', 'Loyalty', 'Redeem', 'CardGiftcard'
  ],
  social: [
    'People', 'Person', 'Group', 'Groups', 'Share', 'ThumbUp', 'ThumbDown', 'Star',
    'StarOutline', 'StarHalf', 'Favorite', 'FavoriteBorder', 'Bookmark', 'BookmarkBorder',
    'Celebration', 'Event', 'EventAvailable', 'EventNote', 'LocalActivity', 'LocalFireDepartment'
  ],
  technology: [
    'Computer', 'DesktopMac', 'Laptop', 'PhoneIphone', 'Tablet', 'TabletMac', 'Devices',
    'DeviceHub', 'Dns', 'Storage', 'Cloud', 'CloudQueue', 'CloudUpload', 'CloudDownload',
    'Wifi', 'Bluetooth', 'Cast', 'Cable', 'DeveloperBoard', 'Memory', 'Router'
  ],
  content: [
    'AddPhotoAlternate', 'Image', 'Photo', 'PhotoLibrary', 'PhotoCamera', 'Videocam',
    'VideoLibrary', 'MusicNote', 'Audiotrack', 'Mic', 'Headphones', 'Movie', 'PlayCircle',
    'Pause', 'Stop', 'SkipNext', 'SkipPrevious', 'VolumeUp', 'VolumeDown', 'VolumeMute'
  ],
  navigation: [
    'Menu', 'Apps', 'Home', 'AccountCircle', 'ExitToApp', 'Login', 'Logout', 'Lock',
    'LockOpen', 'Visibility', 'VisibilityOff', 'Notifications', 'NotificationsActive',
    'Language', 'LocationOn', 'LocationOff', 'Map', 'MyLocation', 'Explore', 'NearMe'
  ],
  action: [
    'Info', 'InfoOutline', 'Warning', 'Error', 'ErrorOutline', 'Help', 'HelpOutline',
    'CheckCircle', 'CheckCircleOutline', 'Cancel', 'HighlightOff', 'Block', 'Done',
    'DoneAll', 'Verified', 'NewReleases', 'Announcement', 'Flag', 'Report', 'ReportProblem'
  ],
  files: [
    'Folder', 'FolderOpen', 'InsertDriveFile', 'Description', 'Article', 'Book',
    'LibraryBooks', 'MenuBook', 'PictureAsPdf', 'AttachFile', 'CloudUpload', 'CloudDownload',
    'Download', 'Upload', 'Link', 'LinkOff', 'Launch', 'OpenInNew', 'OpenInBrowser'
  ],
  misc: [
    'Lightbulb', 'Eco', 'Recycling', 'VolunteerActivism', 'Handyman', 'Build', 'Construction',
    'Engineering', 'Architecture', 'DesignServices', 'Brush', 'ColorLens', 'Palette',
    'ImageAspectRatio', 'AutoAwesome', 'AutoFixHigh', 'Filter', 'Tune', 'Settings'
  ]
};

const allIcons = Object.values(iconCategories).flat();

interface IconSelectorProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
  fullWidth?: boolean;
}

const IconSelector: React.FC<IconSelectorProps> = ({
  value,
  onChange,
  label = 'Icon',
  fullWidth = true
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('common');

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  const filteredIcons = searchTerm
    ? allIcons.filter(icon => icon.toLowerCase().includes(searchTerm.toLowerCase()))
    : iconCategories[selectedCategory as keyof typeof iconCategories] || [];

  return (
    <Box>
      <TextField
        select
        fullWidth={fullWidth}
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{ mb: 2 }}
      >
        <MenuItem value="">
          <em>Kein Icon</em>
        </MenuItem>
        {allIcons.slice(0, 20).map((iconName) => (
          <MenuItem key={iconName} value={iconName}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {getIcon(iconName)}
              <span>{iconName}</span>
            </Box>
          </MenuItem>
        ))}
      </TextField>

      <TextField
        fullWidth={fullWidth}
        size="small"
        placeholder="Icon suchen..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          )
        }}
        sx={{ mb: 2 }}
      />

      {!searchTerm && (
        <TextField
          select
          fullWidth={fullWidth}
          size="small"
          label="Kategorie"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="common">Allgemein</MenuItem>
          <MenuItem value="communication">Kommunikation</MenuItem>
          <MenuItem value="business">Business</MenuItem>
          <MenuItem value="social">Social</MenuItem>
          <MenuItem value="technology">Technologie</MenuItem>
          <MenuItem value="content">Medien</MenuItem>
          <MenuItem value="navigation">Navigation</MenuItem>
          <MenuItem value="action">Aktionen</MenuItem>
          <MenuItem value="files">Dateien</MenuItem>
          <MenuItem value="misc">Sonstiges</MenuItem>
        </TextField>
      )}

      <Paper
        variant="outlined"
        sx={{
          maxHeight: 200,
          overflow: 'auto',
          p: 1
        }}
      >
        <Grid container spacing={1}>
          {filteredIcons.slice(0, 48).map((iconName) => {
            const IconComponent = (Icons as any)[iconName];
            if (!IconComponent) return null;
            return (
              <Grid size={{ xs: 2 }} key={iconName}>
                <Paper
                  onClick={() => onChange(iconName)}
                  sx={{
                    p: 1,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    backgroundColor: value === iconName ? 'primary.main' : 'background.paper',
                    color: value === iconName ? 'primary.contrastText' : 'text.primary',
                    '&:hover': {
                      backgroundColor: value === iconName ? 'primary.dark' : 'action.hover'
                    }
                  }}
                  title={iconName}
                >
                  <IconComponent fontSize="small" />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
        {filteredIcons.length === 0 && (
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
            Keine Icons gefunden
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default IconSelector;
