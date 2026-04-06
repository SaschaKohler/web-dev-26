import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeContextProvider, useThemeContext } from './contexts/ThemeContext';
import { AdminThemeProvider, useAdminTheme } from './contexts/AdminThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Booking from './pages/Booking';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Impressum from './pages/Impressum';
import AdminTemplates from './pages/AdminTemplates';
import AdminLayouts from './pages/AdminLayouts';
import AdminPageLayouts from './pages/AdminPageLayouts';
import AdminDashboard from './pages/AdminDashboard';
import AdminLayout from './components/AdminLayout';
import GlobalTemplatesManager from './pages/admin/GlobalTemplatesManager';
import NavigationEditor from './pages/admin/NavigationEditor';
import SiteSettingsEditor from './pages/admin/SiteSettingsEditor';
import PageSEOEditor from './pages/admin/PageSEOEditor';
import DecadeThemeManager from './pages/admin/DecadeThemeManager';

function ThemedRoutes() {
  const location = useLocation();
  const { theme: websiteTheme } = useThemeContext();
  const { theme: adminTheme } = useAdminTheme();
  
  const isAdminRoute = location.pathname.startsWith('/admin');
  const currentTheme = isAdminRoute ? adminTheme : websiteTheme;
  
  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/templates" element={<AdminLayout><AdminTemplates /></AdminLayout>} />
        <Route path="/admin/page-layouts" element={<AdminLayout><AdminPageLayouts /></AdminLayout>} />
        <Route path="/admin/layouts" element={<AdminLayout><AdminLayouts /></AdminLayout>} />
        <Route path="/admin/global-templates" element={<AdminLayout><GlobalTemplatesManager /></AdminLayout>} />
        <Route path="/admin/navigation" element={<AdminLayout><NavigationEditor /></AdminLayout>} />
        <Route path="/admin/site-settings" element={<AdminLayout><SiteSettingsEditor /></AdminLayout>} />
        <Route path="/admin/seo" element={<AdminLayout><PageSEOEditor /></AdminLayout>} />
        <Route path="/admin/decade-themes" element={<AdminLayout><DecadeThemeManager /></AdminLayout>} />
      </Routes>
    </ThemeProvider>
  );
}

function App() {
  return (
    <ThemeContextProvider>
      <AdminThemeProvider>
        <Router>
          <ThemedRoutes />
        </Router>
      </AdminThemeProvider>
    </ThemeContextProvider>
  );
}

export default App;