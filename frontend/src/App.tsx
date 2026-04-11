import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ThemeContextProvider, useThemeContext } from './contexts/ThemeContext';
import { AdminThemeProvider, useAdminTheme } from './contexts/AdminThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import PageLayout from './components/layout/PageLayout';
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
import Onboarding from './pages/Onboarding';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import MenuEditor from './pages/admin/MenuEditor';

function ThemedRoutes() {
  const location = useLocation();
  const { theme: websiteTheme } = useThemeContext();
  const { theme: adminTheme } = useAdminTheme();
  
  const isAdminRoute = location.pathname.startsWith('/admin');
  const currentTheme = isAdminRoute ? adminTheme : websiteTheme;
  
  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<PageLayout><Home /></PageLayout>} />
        <Route path="/about" element={<PageLayout><About /></PageLayout>} />
        <Route path="/services" element={<PageLayout><Services /></PageLayout>} />
        <Route path="/booking" element={<PageLayout><Booking /></PageLayout>} />
        <Route path="/faq" element={<PageLayout><FAQ /></PageLayout>} />
        <Route path="/contact" element={<PageLayout><Contact /></PageLayout>} />
        <Route path="/impressum" element={<PageLayout><Impressum /></PageLayout>} />
        <Route path="/onboarding" element={<Onboarding />} />
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
        <Route path="/admin/analytics" element={<ProtectedRoute><AdminLayout><AnalyticsDashboard /></AdminLayout></ProtectedRoute>} />
        <Route path="/admin/menu-editor" element={<ProtectedRoute><AdminLayout><MenuEditor /></AdminLayout></ProtectedRoute>} />
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