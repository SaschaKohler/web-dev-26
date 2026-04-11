import React, { useState, useRef } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  AppBar,
  Toolbar,
  Chip,
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  useScrollTrigger,
  Slide,
} from '@mui/material';
import {
  Check,
  Close,
  Web,
  Palette,
  Schedule,
  Security,
  TrendingUp,
  Support,
  Star,
} from '@mui/icons-material';
import { API_BASE_URL } from '../api/config';
import HeroSection from '../components/sections/HeroSection';

// Warme, einladende Farbpalette
const warmColors = {
  cream: '#FAF7F2',
  warmWhite: '#FDFCFA',
  terracotta: '#C4A484',
  softCoral: '#D4A574',
  sage: '#9CAF88',
  warmGray: '#8B8680',
  charcoal: '#4A4A4A',
};

const pricingPlans = [
  {
    id: 'starter',
    name: 'Sanfter Start',
    price: '€29',
    period: '/Monat',
    description: 'oder €890 einmalig',
    features: [
      'Deine persönliche LSB Website',
      '8 liebevoll gestaltete Seiten',
      'Perfekt auf Smartphone & Tablet',
      'Gefunden werden auf Google',
      'Besucher-Statistiken inklusive',
      'Persönliche Beratung per E-Mail',
      'Sicher mit SSL-Schutz',
      'Deine eigene Web-Adresse',
    ],
    ctaText: 'Jetzt starten',
  },
  {
    id: 'pro',
    name: 'Wachstum',
    price: '€49',
    period: '/Monat',
    description: 'oder €1.490 einmalig',
    features: [
      'Alles aus Sanfter Start',
      'Design ganz nach deinem Geschmack',
      'Online-Terminbuchung für Klient:innen',
      'Blog für deine Expertise',
      'Noch besser gefunden werden',
      'Google Business Verknüpfung',
      'Persönliche Beratung mit Priorität',
      'Schnelle Hilfe bei Fragen',
    ],
    highlighted: true,
    popular: true,
    ctaText: 'Beliebteste Wahl',
  },
  {
    id: 'premium',
    name: 'Freiheit',
    price: '€79',
    period: '/Monat',
    description: 'Volle Flexibilität',
    features: [
      'Alles aus Wachstum',
      'Deine eigene Domain möglich',
      'Mehrsprachig für alle Klient:innen',
      'Intelligente Terminverwaltung',
      'Newsletter für deine Community',
      'Persönlicher Ansprechpartner',
      'Premium Themes',
      'API-Zugriff',
      'Persönlicher Account Manager',
    ],
    ctaText: 'Premium wählen',
  },
];

const features = [
  {
    id: 1,
    title: 'Alles bereit für dich',
    content: 'Von Impressum bis Kontakt - alle wichtigen Seiten sind liebevoll vorbereitet. Du musst nur noch deine Geschichte erzählen.',
    iconName: 'Web',
    iconColor: '#C4A484', // terracotta
  },
  {
    id: 2,
    title: 'Ganz einfach gestaltet',
    content: 'Ohne technisches Know-how. Mit unserem intuitiven Editor passt du alles mit wenigen Klicks an - ganz nach deinem Geschmack.',
    iconName: 'Palette',
    iconColor: '#D4A574', // soft coral
  },
  {
    id: 3,
    title: 'Termine rund um die Uhr',
    content: 'Deine Klient:innen buchen bequem online, wann es ihnen passt. Du behältst dabei stets die volle Kontrolle über deinen Kalender.',
    iconName: 'Schedule',
    iconColor: '#9CAF88', // sage
  },
  {
    id: 4,
    title: 'Sicher und rechtssicher',
    content: 'Datenschutz und Impressum sind bereits perfekt für LSBs vorbereitet. Eine Sorge weniger für dich.',
    iconName: 'Security',
    iconColor: '#B8A08F', // warm taupe
  },
  {
    id: 5,
    title: 'Gefunden werden',
    content: 'Wir sorgen dafür, dass Menschen, die deine Unterstützung brauchen, dich auch finden können.',
    iconName: 'TrendingUp',
    iconColor: '#C9A87C', // warm gold
  },
  {
    id: 6,
    title: 'Wir sind für dich da',
    content: 'Unser freundliches Team aus Österreich hilft dir persönlich bei allen Fragen - per E-Mail oder Telefon.',
    iconName: 'Support',
    iconColor: '#A8B5A0', // sage green
  },
];

const howItWorks = [
  {
    number: '01',
    title: 'Dein passendes Paket',
    description: 'Entscheide dich für den Weg, der zu dir passt. Ob Schritt für Schritt oder alles auf einmal - ganz wie du dich wohlfühlst.',
  },
  {
    number: '02',
    title: 'Deine Geschichte',
    description: 'Erzähle uns von deiner Praxis. Wir gestalten dir eine Website, die wirklich zu dir passt - warm, einladend, professionell.',
  },
  {
    number: '03',
    title: 'Sicher bezahlen',
    description: 'Bezahle bequem und sicher online. Deine neue Website ist im Handumdrehen bereit für deine ersten Besucher.',
  },
  {
    number: '04',
    title: 'Los gehts!',
    description: 'Du erhältst alles, was du brauchst, direkt in dein E-Mail-Postfach. Und wenn du magst, passst du alles ganz persönlich an.',
  },
];

const testimonials = [
  {
    id: 1,
    quote: 'Endlich fühlt sich meine Online-Präsenz so an, wie ich sie mir gewünscht habe. Warm, einladend und professionell - ganz ohne technischen Stress.',
    author: 'Mag. Anna Schmidt',
    role: 'Lebens- und Sozialberaterin',
    location: 'Wien',
  },
  {
    id: 2,
    quote: 'Meine Klient:innen finden mich jetzt so viel leichter. Die Terminbuchung funktioniert wie von Zauberhand, und ich habe endlich mehr Zeit für das, was wirklich zählt.',
    author: 'Peter Weber',
    role: 'Dipl.-LSB',
    location: 'Graz',
  },
  {
    id: 3,
    quote: 'Ich war anfangs unsicher, ob ich das technisch hinkriege. Aber es war so einfach! Und das Team war wirklich lieb und geduldig mit all meinen Fragen.',
    author: 'Dr. Maria Huber',
    role: 'Lebens- und Sozialberaterin',
    location: 'Linz',
  },
];

const faqs = [
  {
    question: 'Wie schnell ist meine Website bereit?',
    answer: 'Sobald du dich entschieden hast, ist deine Website im Handumdrehen online. Du erhältst sofort deine Zugangsdaten und kannst loslegen.',
  },
  {
    question: 'Kann ich meine eigene Internet-Adresse nutzen?',
    answer: 'Ja, ab unserem Wachstum-Paket kannst du deine eigene Domain verwenden (z.B. www.deine-praxis.at). Wir helfen dir dabei, falls du möchtest.',
  },
  {
    question: 'Ist alles rechtssicher für meine Praxis?',
    answer: 'Absolut. Impressum, Datenschutz und alles, was du brauchst, ist perfekt für Lebens- und Sozialberater:innen vorbereitet. Eine Sorge weniger.',
  },
  {
    question: 'Wie funktioniert die Terminbuchung?',
    answer: 'Ab dem Wachstum-Paket können deine Klient:innen ganz einfach online Termine buchen - bequem für sie, entspannend für dich. Alles synchronisiert sich mit deinem Kalender.',
  },
  {
    question: 'Kann ich später mehr Funktionen hinzufügen?',
    answer: 'Natürlich! Du kannst jederzeit auf ein größeres Paket wechseln. Wir berechnen fair die Differenz, sodass du nichts doppelt bezahlst.',
  },
];

function HideOnScroll({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export default function Onboarding() {
  const [formData, setFormData] = useState({
    email: '',
    site_name: '',
    first_name: '',
    last_name: '',
    plan: 'starter',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  const handlePlanSelect = (planId: string) => {
    setFormData({ ...formData, plan: planId });
    setOpenDialog(true);
    setActiveStep(0);
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateCheckout = async () => {
    if (!formData.email || !formData.site_name) {
      setError('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    setPaymentLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/stripe/create-checkout/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          site_name: formData.site_name,
          first_name: formData.first_name,
          last_name: formData.last_name,
          plan: formData.plan,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout');
      }

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      }
    } catch (err: any) {
      setError(err.message);
      setPaymentLoading(false);
    }
  };

  const handleFreeOnboarding = async () => {
    if (!formData.email || !formData.site_name) {
      setError('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/onboard/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create site');
      }

      setResult(data);
      setOpenDialog(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const steps = ['Deine Informationen', 'Zahlung', 'Website geht online'];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: warmColors.cream }}>
      {/* Navigation */}
      <HideOnScroll>
        <AppBar position="fixed" sx={{ bgcolor: warmColors.warmWhite, boxShadow: '0 2px 20px rgba(0,0,0,0.05)' }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600, color: warmColors.charcoal }}>
              LSB Websites
            </Typography>
            <Button 
              onClick={scrollToForm}
              sx={{ 
                bgcolor: warmColors.terracotta, 
                color: 'white',
                '&:hover': { bgcolor: warmColors.softCoral }
              }}
            >
              Website erstellen
            </Button>
          </Toolbar>
        </AppBar>
      </HideOnScroll>

      {/* Hero Section */}
      <Box sx={{ pt: 8 }}>
        <HeroSection
          title="Deine Praxis. Online. Einfach."
          subtitle="Eine Website, die so warm und einladend ist wie deine Beratung. Speziell für Lebens- und Sozialberater:innen - mit allem, was du brauchst, um online gut sichtbar zu sein."
          ctaText="Deine Website gestalten"
          ctaLink="#pricing"
          height="85vh"
          backgroundColor={warmColors.terracotta}
          textAlign="center"
        />
      </Box>

      {/* Trust Badges */}
      <Box sx={{ py: 3, bgcolor: warmColors.warmWhite, borderBottom: 1, borderColor: 'rgba(196,164,132,0.2)' }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            {['DSGVO-sicher', 'Aus Österreich', 'Sofort startklar', 'Persönliche Betreuung'].map((badge) => (
              <Grid key={badge}>
                <Chip
                  icon={<Check />}
                  label={badge}
                  variant="outlined"
                  sx={{ borderColor: warmColors.terracotta, color: warmColors.charcoal }}
                  size="small"
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: warmColors.cream }}>
        <Container maxWidth="lg">
          <Typography variant="h2" textAlign="center" gutterBottom sx={{ fontWeight: 500, mb: 2, color: warmColors.charcoal }}>
            Alles, was deine Praxis braucht
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 8, fontWeight: 400 }}>
            Wir haben jedes Detail mit Herz entwickelt - damit du dich auf das konzentrieren kannst, was wirklich zählt: deine Klient:innen.
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={feature.id}>
                <Card elevation={0} sx={{ height: '100%', bgcolor: 'transparent' }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        bgcolor: `${feature.iconColor}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                      }}
                    >
                      {feature.iconName === 'Web' && <Web sx={{ color: feature.iconColor, fontSize: 28 }} />}
                      {feature.iconName === 'Palette' && <Palette sx={{ color: feature.iconColor, fontSize: 28 }} />}
                      {feature.iconName === 'Schedule' && <Schedule sx={{ color: feature.iconColor, fontSize: 28 }} />}
                      {feature.iconName === 'Security' && <Security sx={{ color: feature.iconColor, fontSize: 28 }} />}
                      {feature.iconName === 'TrendingUp' && <TrendingUp sx={{ color: feature.iconColor, fontSize: 28 }} />}
                      {feature.iconName === 'Support' && <Support sx={{ color: feature.iconColor, fontSize: 28 }} />}
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 500, color: warmColors.charcoal }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {feature.content}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works */}
      <Box sx={{ py: 10, bgcolor: warmColors.warmWhite }}>
        <Container maxWidth="lg">
          <Typography variant="h2" textAlign="center" gutterBottom sx={{ fontWeight: 500, mb: 2, color: warmColors.charcoal }}>
            So einfach geht's
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 8, fontWeight: 400 }}>
            In vier sanften Schritten zu deiner neuen Website
          </Typography>
          <Grid container spacing={4}>
            {howItWorks.map((step, index) => (
              <Grid size={{ xs: 12, md: 3 }} key={index}>
                <Card elevation={0} sx={{ height: '100%', bgcolor: 'transparent' }}>
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: warmColors.cream,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 3,
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 300,
                          color: warmColors.terracotta,
                        }}
                      >
                        {step.number}
                      </Typography>
                    </Box>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 500, color: warmColors.charcoal }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {step.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box id="pricing" sx={{ bgcolor: warmColors.cream }}>
        <Container maxWidth="lg" sx={{ py: 10 }}>
          <Typography variant="h2" textAlign="center" gutterBottom sx={{ fontWeight: 500, mb: 2, color: warmColors.charcoal }}>
            Transparent & fair
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 8, fontWeight: 400 }}>
            Wähle, was zu dir passt. Monatlich oder einmalig - ganz ohne versteckte Kosten.
          </Typography>
          <Grid container spacing={4} alignItems="stretch">
            {pricingPlans.map((plan) => (
              <Grid size={{ xs: 12, md: 4 }} key={plan.id}>
                <Card
                  elevation={plan.highlighted ? 4 : 0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    border: plan.highlighted ? `2px solid ${warmColors.terracotta}` : `1px solid ${warmColors.terracotta}40`,
                    borderRadius: 3,
                    bgcolor: warmColors.warmWhite,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 20px 40px rgba(196,164,132,0.15)',
                    },
                  }}
                >
                  {plan.popular && (
                    <Chip
                      icon={<Star />}
                      label="Beliebt"
                      sx={{
                        position: 'absolute',
                        top: -12,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        fontWeight: 600,
                        bgcolor: warmColors.terracotta,
                        color: 'white',
                      }}
                      size="small"
                    />
                  )}
                  <CardContent sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 500, color: warmColors.charcoal }}>
                      {plan.name}
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h2" component="span" sx={{ fontWeight: 600, color: warmColors.terracotta }}>
                        {plan.price}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" component="span" sx={{ ml: 1 }}>
                        {plan.period}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {plan.description}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      {plan.features.map((feature, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
                          <Check sx={{ mr: 1.5, color: warmColors.sage, fontSize: 18, mt: 0.3 }} />
                          <Typography variant="body2" color="text.secondary">
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    <Button
                      variant={plan.highlighted ? 'contained' : 'outlined'}
                      fullWidth
                      onClick={() => handlePlanSelect(plan.id)}
                      sx={{
                        mt: 3,
                        py: 1.5,
                        fontWeight: 500,
                        borderRadius: 2,
                        ...(plan.highlighted
                          ? {
                              bgcolor: warmColors.terracotta,
                              '&:hover': { bgcolor: warmColors.softCoral },
                            }
                          : {
                              borderColor: warmColors.terracotta,
                              color: warmColors.terracotta,
                              '&:hover': { borderColor: warmColors.softCoral, bgcolor: `${warmColors.terracotta}10` },
                            }),
                      }}
                    >
                      {plan.ctaText}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box sx={{ py: 10, bgcolor: warmColors.terracotta, color: 'white' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" textAlign="center" gutterBottom sx={{ fontWeight: 500, mb: 2 }}>
            Was Kolleg:innen sagen
          </Typography>
          <Typography variant="h6" textAlign="center" sx={{ maxWidth: 600, mx: 'auto', mb: 8, fontWeight: 300, opacity: 0.9 }}>
            Echte Geschichten aus der LSB-Community
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial) => (
              <Grid size={{ xs: 12, md: 4 }} key={testimonial.id}>
                <Paper sx={{ p: 4, height: '100%', borderRadius: 3, bgcolor: warmColors.warmWhite }}>
                  <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic', color: warmColors.charcoal, lineHeight: 1.7 }}>
                    "{testimonial.quote}"
                  </Typography>
                  <Box sx={{ pt: 2, borderTop: `1px solid ${warmColors.terracotta}20` }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: warmColors.terracotta }}>
                      {testimonial.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.role}, {testimonial.location}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box sx={{ py: 10, bgcolor: warmColors.warmWhite }}>
        <Container maxWidth="md">
          <Typography variant="h2" textAlign="center" gutterBottom sx={{ fontWeight: 500, mb: 2, color: warmColors.charcoal }}>
            Fragen & Antworten
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', mb: 8, fontWeight: 400 }}>
            Alles, was du wissen möchtest
          </Typography>
          <Grid container spacing={3}>
            {faqs.map((faq, index) => (
              <Grid size={{ xs: 12 }} key={index}>
                <Paper sx={{ p: 4, borderRadius: 3, border: `1px solid ${warmColors.terracotta}20`, bgcolor: 'white' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: warmColors.terracotta }}>
                    {faq.question}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {faq.answer}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Final CTA */}
      <Box sx={{ py: 12, bgcolor: warmColors.softCoral, color: 'white', textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 500, mb: 3 }}>
            Bereit, deine Praxis online zu zeigen?
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 300, mb: 5, opacity: 0.9 }}>
            Wir begleiten dich auf dem Weg zu einer Website, die wirklich zu dir passt.
          </Typography>
          <Button
            variant="contained"
            size="large"
            href="#pricing"
            sx={{
              bgcolor: 'white',
              color: warmColors.terracotta,
              px: 5,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 500,
              borderRadius: 3,
              '&:hover': {
                bgcolor: warmColors.warmWhite,
              },
            }}
          >
            Jetzt deine Website gestalten
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 5, bgcolor: warmColors.charcoal, color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: warmColors.terracotta }}>
                LSB Websites
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                Websites mit Herz für Lebens- und Sozialberater:innen in Österreich.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: warmColors.terracotta }}>
                Wir sind für dich da
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                support@lsbwebsites.at
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }} textAlign={{ xs: 'left', md: 'right' }}>
                © 2026 LSB Websites<br />
                Mit Liebe aus Österreich
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Onboarding Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { bgcolor: warmColors.warmWhite, borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6" sx={{ color: warmColors.charcoal, fontWeight: 500 }}>
            {result ? 'Deine Website ist bereit!' : 'Deine Website erstellen'}
          </Typography>
          <IconButton onClick={() => setOpenDialog(false)} size="small" sx={{ color: warmColors.warmGray }}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {result ? (
            <Fade in>
              <Box>
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2, bgcolor: `${warmColors.sage}20` }}>
                  Deine Website ist nun online!
                </Alert>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: warmColors.charcoal }}>
                  Deine Zugangsdaten:
                </Typography>
                <Paper variant="outlined" sx={{ p: 3, mb: 3, bgcolor: warmColors.cream, borderColor: `${warmColors.terracotta}40`, borderRadius: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Website:</strong>{' '}
                    <a href={result.site.site_url} target="_blank" rel="noopener noreferrer">
                      {result.site.site_url}
                    </a>
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Admin-Bereich:</strong>{' '}
                    <a href={result.site.admin_url} target="_blank" rel="noopener noreferrer">
                      {result.site.admin_url}
                    </a>
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Username:</strong> {result.credentials.username}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Passwort:</strong> {result.credentials.password}
                  </Typography>
                </Paper>
                <Alert severity="info" sx={{ mb: 3, borderRadius: 2, bgcolor: `${warmColors.terracotta}10` }}>
                  Wir haben dir auch eine E-Mail mit allen Details an {result.credentials.email} geschickt.
                </Alert>
                <Button
                  variant="contained"
                  fullWidth
                  href={result.site.admin_url}
                  target="_blank"
                  sx={{ 
                    bgcolor: warmColors.terracotta, 
                    borderRadius: 2,
                    py: 1.5,
                    '&:hover': { bgcolor: warmColors.softCoral }
                  }}
                >
                  Zu deinem Bereich
                </Button>
              </Box>
            </Fade>
          ) : (
            <Box>
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel sx={{ 
                      '& .MuiStepLabel-label': { color: warmColors.warmGray },
                      '& .MuiStepLabel-label.Mui-active': { color: warmColors.terracotta },
                      '& .MuiStepLabel-label.Mui-completed': { color: warmColors.sage }
                    }}>
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Deine E-Mail *"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Name deiner Praxis *"
                    required
                    value={formData.site_name}
                    onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
                    helperText="So wird auch deine Adresse: praxisname.lsbwebsites.at"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Vorname"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Nachname"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Paper variant="outlined" sx={{ p: 3, bgcolor: warmColors.cream, borderColor: `${warmColors.terracotta}40`, borderRadius: 2 }}>
                    <Typography variant="subtitle2" gutterBottom sx={{ color: warmColors.warmGray }}>
                      Dein gewähltes Paket:
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: warmColors.terracotta }}>
                      {pricingPlans.find(p => p.id === formData.plan)?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {pricingPlans.find(p => p.id === formData.plan)?.price}{pricingPlans.find(p => p.id === formData.plan)?.period}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setOpenDialog(false)}
                  sx={{ borderRadius: 2, borderColor: warmColors.terracotta, color: warmColors.terracotta }}
                >
                  Abbrechen
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={formData.plan === 'starter' ? handleFreeOnboarding : handleCreateCheckout}
                  disabled={loading || paymentLoading}
                  sx={{ 
                    borderRadius: 2, 
                    bgcolor: warmColors.terracotta,
                    py: 1.5,
                    '&:hover': { bgcolor: warmColors.softCoral }
                  }}
                >
                  {loading || paymentLoading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : formData.plan === 'starter' ? (
                    'Kostenlos starten'
                  ) : (
                    'Weiter zur Zahlung'
                  )}
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

