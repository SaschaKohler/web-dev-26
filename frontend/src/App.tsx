import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeContextProvider, useThemeContext } from './contexts/ThemeContext';
import { AdminThemeProvider, useAdminTheme } from './contexts/AdminThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
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
import UserManagement from './pages/admin/UserManagement';

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
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout><AdminDashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/templates" element={<ProtectedRoute><AdminLayout><AdminTemplates /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/page-layouts" element={<ProtectedRoute><AdminLayout><AdminPageLayouts /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/layouts" element={<ProtectedRoute><AdminLayout><AdminLayouts /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/global-templates" element={<ProtectedRoute><AdminLayout><GlobalTemplatesManager /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/navigation" element={<ProtectedRoute><AdminLayout><NavigationEditor /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/site-settings" element={<ProtectedRoute><AdminLayout><SiteSettingsEditor /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/seo" element={<ProtectedRoute><AdminLayout><PageSEOEditor /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/decade-themes" element={<ProtectedRoute><AdminLayout><DecadeThemeManager /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><AdminLayout><UserManagement /></AdminLayout></ProtectedRoute>} />
      </Routes>
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeContextProvider>
        <AdminThemeProvider>
          <Router>
            <ThemedRoutes />
          </Router>
        </AdminThemeProvider>
      </ThemeContextProvider>
    </AuthProvider>
  );
}

export default App;