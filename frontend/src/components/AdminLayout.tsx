import React from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Paper,
  Typography,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import {
  Dashboard,
  Palette,
  Layers,
  Pages,
  Home as HomeIcon,
  History
} from '@mui/icons-material';
import { useNavigate, useLocation, Link } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const adminTabs = [
    { label: 'Dashboard', value: '/admin', icon: <Dashboard /> },
    { label: 'Dekaden-Themes', value: '/admin/decade-themes', icon: <History /> },
    { label: 'Layouts', value: '/admin/layouts', icon: <Layers /> },
    { label: 'Seiten-Zuordnung', value: '/admin/page-layouts', icon: <Pages /> }
  ];

  const currentTab = adminTabs.find(tab => tab.value === location.pathname)?.value || '/admin';

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  const getPageTitle = () => {
    const tab = adminTabs.find(t => t.value === location.pathname);
    return tab?.label || 'Admin';
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 3, pb: 6 }}>
      <Container maxWidth="xl">
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
