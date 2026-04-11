import React from 'react';
import { Box, Container, Typography, Paper, Button, Chip, Grid } from '@mui/material';
import { Check, Star } from '@mui/icons-material';

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  ctaText: string;
  popular?: boolean;
}

interface PricingSectionProps {
  title?: string;
  subtitle?: string;
  plans: PricingPlan[];
  onPlanSelect?: (planId: string) => void;
  backgroundColor?: string;
  paddingY?: number;
}

const PricingSection: React.FC<PricingSectionProps> = ({
  title = 'Wählen Sie Ihr Paket',
  subtitle,
  plans,
  onPlanSelect,
  backgroundColor = 'background.default',
  paddingY = 10,
}) => {
  return (
    <Box sx={{ py: paddingY, backgroundColor }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '700px', mx: 'auto' }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        <Grid container spacing={4} alignItems="stretch">
          {plans.map((plan) => (
            <Grid size={{ xs: 12, md: 4 }} key={plan.id}>
              <Paper
                elevation={plan.highlighted ? 8 : 2}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  border: plan.highlighted ? '2px solid' : '1px solid',
                  borderColor: plan.highlighted ? 'primary.main' : 'divider',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                  },
                }}
              >
                {plan.popular && (
                  <Chip
                    icon={<Star />}
                    label="Beliebt"
                    color="primary"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -12,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      fontWeight: 600,
                    }}
                  />
                )}

                <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                  {plan.name}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="h2"
                    component="span"
                    sx={{ fontWeight: 700, color: 'primary.main' }}
                  >
                    {plan.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                    {plan.period}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40 }}>
                  {plan.description}
                </Typography>

                <Box sx={{ flexGrow: 1 }}>
                  {plan.features.map((feature, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1.5,
                      }}
                    >
                      <Check
                        sx={{
                          mr: 1.5,
                          color: plan.highlighted ? 'primary.main' : 'success.main',
                          fontSize: 20,
                        }}
                      />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  ))}
                </Box>

                <Button
                  variant={plan.highlighted ? 'contained' : 'outlined'}
                  size="large"
                  fullWidth
                  onClick={() => onPlanSelect?.(plan.id)}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    fontWeight: 600,
                  }}
                >
                  {plan.ctaText}
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default PricingSection;
