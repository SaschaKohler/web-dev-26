import React from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Paper,
  Typography,
  Breadcrumbs,
  Link as MuiLink,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Divider
} from '@mui/material';
import {
  Dashboard,
  Layers,
  Pages,
  Home as HomeIcon,
  History,
  People,
  AccountCircle,
  Logout,
  Analytics as AnalyticsIcon,
  MenuOpen as MenuOpenIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const adminTabs = [
    { label: 'Dashboard', value: '/admin', icon: <Dashboard /> },
    { label: 'Analytics', value: '/admin/analytics', icon: <AnalyticsIcon /> },
    { label: 'Dekaden-Themes', value: '/admin/decade-themes', icon: <History /> },
    { label: 'Layouts', value: '/admin/layouts', icon: <Layers /> },
    { label: 'Seiten-Zuordnung', value: '/admin/page-layouts', icon: <Pages /> },
    { label: 'Menü-Editor', value: '/admin/menu-editor', icon: <MenuOpenIcon /> },
    { label: 'Benutzerverwaltung', value: '/admin/users', icon: <People /> }
  ];

  const currentTab = adminTabs.find(tab => tab.value === location.pathname)?.value || '/admin';

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  const getPageTitle = () => {
    const tab = adminTabs.find(t => t.value === location.pathname);
    return tab?.label || 'Admin';
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    navigate('/');
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Panel
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {user?.username}
            </Typography>
            <IconButton
              size="large"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Angemeldet als
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {user?.username}
          </Typography>
          {user?.email && (
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
          )}
        </Box>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <Logout fontSize="small" sx={{ mr: 1 }} />
          Abmelden
        </MenuItem>
      </Menu>

      <Container maxWidth="xl" sx={{ pt: 3, pb: 6 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 2 }}>
          <MuiLink
            component={Link}
            to="/"
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            underline="hover"
            color="inherit"
          >
            <HomeIcon fontSize="small" />
            Home
          </MuiLink>
          <Typography color="text.primary">Admin</Typography>
          {location.pathname !== '/admin' && (
            <Typography color="text.primary">{getPageTitle()}</Typography>
          )}
        </Breadcrumbs>

        {/* Admin Navigation Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              '& .MuiTab-root': {
                minHeight: 64,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500
              }
            }}
          >
            {adminTabs.map((tab) => (
              <Tab
                key={tab.value}
                label={tab.label}
                value={tab.value}
                icon={tab.icon}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Paper>

        {/* Page Content */}
        <Box>{children}</Box>
      </Container>
    </Box>
  );
};

export default AdminLayout;
