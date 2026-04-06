import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  IconButton,
  Divider,
  Stack,
  useTheme,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

interface SiteSettings {
  site_name?: string;
  site_tagline?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
}

interface FooterProps {
  style?: string;
  backgroundColor?: string;
  textColor?: string;
  showSocialLinks?: boolean;
  showContactInfo?: boolean;
  siteSettings?: SiteSettings;
  customHtml?: string;
}

const Footer: React.FC<FooterProps> = ({
  style = 'standard',
  backgroundColor,
  textColor,
  showSocialLinks = true,
  showContactInfo = true,
  siteSettings = {},
  customHtml,
}) => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FacebookIcon />, url: siteSettings.facebook_url, label: 'Facebook' },
    { icon: <InstagramIcon />, url: siteSettings.instagram_url, label: 'Instagram' },
    { icon: <LinkedInIcon />, url: siteSettings.linkedin_url, label: 'LinkedIn' },
  ].filter(link => link.url);

  const contactInfo = [
    { icon: <EmailIcon />, text: siteSettings.contact_email, href: `mailto:${siteSettings.contact_email}` },
    { icon: <PhoneIcon />, text: siteSettings.contact_phone, href: `tel:${siteSettings.contact_phone}` },
    { icon: <LocationOnIcon />, text: siteSettings.address },
  ].filter(info => info.text);

  const footerStyles = {
    backgroundColor: backgroundColor || theme.palette.grey[900],
    color: textColor || theme.palette.common.white,
    py: style === 'minimal' ? 3 : style === 'extended' ? 8 : 6,
    mt: 'auto',
  };

  if (customHtml) {
    return (
      <Box component="footer" sx={footerStyles}>
        <Container maxWidth="lg">
          <div dangerouslySetInnerHTML={{ __html: customHtml }} />
        </Container>
      </Box>
    );
  }

  return (
    <Box component="footer" sx={footerStyles}>
      <Container maxWidth="lg">
        {style === 'extended' && (
          <>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={4}
              sx={{ mb: 4 }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {siteSettings.site_name || 'Lebens- und Sozialberatung'}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {siteSettings.site_tagline || 'Professionelle Beratung und Unterstützung'}
                </Typography>
              </Box>

              {showContactInfo && contactInfo.length > 0 && (
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Kontakt
                  </Typography>
                  {contactInfo.map((info, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ mr: 1, opacity: 0.8 }}>{info.icon}</Box>
                      {info.href ? (
                        <Link
                          href={info.href}
                          color="inherit"
                          underline="hover"
                          sx={{ opacity: 0.8 }}
                        >
                          {info.text}
                        </Link>
                      ) : (
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          {info.text}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}

              {showSocialLinks && socialLinks.length > 0 && (
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    Folgen Sie uns
                  </Typography>
                  <Box>
                    {socialLinks.map((link, index) => (
                      <IconButton
                        key={index}
                        component="a"
                        href={link.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                        sx={{ color: textColor || theme.palette.common.white }}
                      >
                        {link.icon}
                      </IconButton>
                    ))}
                  </Box>
                </Box>
              )}
            </Stack>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)', mb: 3 }} />
          </>
        )}

        {style === 'standard' && (
          <>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={3}
              sx={{ mb: 3, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' } }}
            >
              <Box>
                <Typography variant="h6" gutterBottom>
                  {siteSettings.site_name || 'Lebens- und Sozialberatung'}
                </Typography>
                {showContactInfo && contactInfo.length > 0 && (
                  <Box>
                    {contactInfo.slice(0, 2).map((info, index) => (
                      <Typography key={index} variant="body2" sx={{ opacity: 0.8, mb: 0.5 }}>
                        {info.text}
                      </Typography>
                    ))}
                  </Box>
                )}
              </Box>
              {showSocialLinks && socialLinks.length > 0 && (
                <Box>
                  {socialLinks.map((link, index) => (
                    <IconButton
                      key={index}
                      component="a"
                      href={link.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      sx={{ color: textColor || theme.palette.common.white }}
                    >
                      {link.icon}
                    </IconButton>
                  ))}
                </Box>
              )}
            </Stack>
            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)', mb: 2 }} />
          </>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © {currentYear} {siteSettings.site_name || 'Lebens- und Sozialberatung'}. Alle Rechte vorbehalten.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link href="/impressum" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
              Impressum
            </Link>
            <Link href="/datenschutz" color="inherit" underline="hover" sx={{ opacity: 0.8 }}>
              Datenschutz
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
