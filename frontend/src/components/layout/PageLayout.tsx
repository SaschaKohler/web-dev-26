import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Navigation from './Navigation';
import Footer from './Footer';
import SEO from '../SEO';
import { globalTemplatesApi, siteSettingsApi, GlobalTemplate, SiteSettings } from '../../api/globalTemplates';

interface PageLayoutProps {
  children: React.ReactNode;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  seoImage?: string;
  seoType?: string;
  canonicalUrl?: string;
  structuredData?: any;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  seoTitle,
  seoDescription,
  seoKeywords,
  seoImage,
  seoType,
  canonicalUrl,
  structuredData,
}) => {
  const [headerTemplate, setHeaderTemplate] = useState<GlobalTemplate | null>(null);
  const [navTemplate, setNavTemplate] = useState<GlobalTemplate | null>(null);
  const [footerTemplate, setFooterTemplate] = useState<GlobalTemplate | null>(null);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const [header, nav, footer, settings] = await Promise.all([
          globalTemplatesApi.getHeader().catch(() => null),
          globalTemplatesApi.getNavigation().catch(() => null),
          globalTemplatesApi.getFooter().catch(() => null),
          siteSettingsApi.getCurrent().catch(() => null),
        ]);

        setHeaderTemplate(header);
        setNavTemplate(nav);
        setFooterTemplate(footer);
        setSiteSettings(settings);
      } catch (error) {
        console.error('Error loading page templates:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, []);

  const handleMobileNavToggle = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  const handleMobileNavClose = () => {
    setMobileNavOpen(false);
  };

  if (loading) {
    return <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</Box>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        image={seoImage}
        type={seoType}
        canonicalUrl={canonicalUrl}
        structuredData={structuredData}
      />

      {navTemplate && (
        <Navigation
          items={navTemplate.nav_items || []}
          style={navTemplate.style}
          backgroundColor={navTemplate.background_color}
          textColor={navTemplate.text_color}
          mobileOpen={mobileNavOpen}
          onMobileClose={handleMobileNavClose}
          onMobileOpen={handleMobileNavToggle}
          menuConfig={navTemplate.metadata?.menu_config}
          logoUrl={headerTemplate?.logo_url || siteSettings?.logo_url}
          logoAlt={headerTemplate?.logo_alt || siteSettings?.site_name}
        />
      )}

      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>

      {footerTemplate && (
        <Footer
          style={footerTemplate.style}
          backgroundColor={footerTemplate.background_color}
          textColor={footerTemplate.text_color}
          showSocialLinks={footerTemplate.show_social_links}
          showContactInfo={footerTemplate.show_contact_info}
          siteSettings={siteSettings || undefined}
          customHtml={footerTemplate.custom_html}
        />
      )}
    </Box>
  );
};

export default PageLayout;
