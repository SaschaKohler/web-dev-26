import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { API_BASE_URL } from '../api/config';

const plans = [
  { value: 'starter', label: 'Starter (€890)' },
  { value: 'pro', label: 'Pro (€1.490)' },
  { value: 'premium', label: 'Premium' },
];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

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
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Alert severity="success" sx={{ mb: 3 }}>
            Website erfolgreich erstellt!
          </Alert>
          <Typography variant="h6" gutterBottom>
            Zugangsdaten
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography><strong>Website:</strong> {result.site.site_url}</Typography>
            <Typography><strong>Admin:</strong> {result.site.admin_url}</Typography>
            <Typography><strong>Username:</strong> {result.credentials.username}</Typography>
            <Typography><strong>Passwort:</strong> {result.credentials.password}</Typography>
          </Box>
          <Button variant="contained" onClick={() => setResult(null)}>
            Neue Website erstellen
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Neue LSB Website erstellen
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="E-Mail"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Website Name (Praxisname)"
            required
            value={formData.site_name}
            onChange={(e) => setFormData({ ...formData, site_name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Vorname"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Nachname"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Paket"
            value={formData.plan}
            onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
            sx={{ mb: 3 }}
          >
            {plans.map((plan) => (
              <MenuItem key={plan.value} value={plan.value}>
                {plan.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Website erstellen'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
