import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  LinearProgress,
  Alert,
  Skeleton,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  Visibility,
  Public,
  Devices,
  Schedule,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { API_BASE_URL } from '../api/config';

interface AnalyticsData {
  overview: {
    total_views: number;
    total_visitors: number;
    avg_daily_views: number;
    trend_percent: number;
    trend_direction: 'up' | 'down' | 'stable';
    period_days: number;
    devices?: Record<string, number>;
    countries?: Record<string, number>;
  } | null;
  chart: Array<{
    date: string;
    views: number;
    visitors: number;
  }>;
  pages: Array<{
    page_path: string;
    views: number;
  }>;
  sources: {
    referrers: Array<{
      referrer_domain: string;
      count: number;
    }>;
    direct: number;
  };
  realtime: {
    active_last_30min: number;
    top_active_pages: Array<{
      page_path: string;
      count: number;
    }>;
  } | null;
}

const COLORS = ['#1976d2', '#dc004e', '#f50057', '#4caf50', '#ff9800', '#9c27b0'];

export default function AnalyticsDashboard() {
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<AnalyticsData>({
    overview: null,
    chart: [],
    pages: [],
    sources: { referrers: [], direct: 0 },
    realtime: null,
  });

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [overviewRes, chartRes, pagesRes, sourcesRes, realtimeRes] = await Promise.all([
        fetch(`${API_BASE_URL}/analytics/overview/?days=${days}`),
        fetch(`${API_BASE_URL}/analytics/chart/?days=${days}`),
        fetch(`${API_BASE_URL}/analytics/pages/?days=${days}`),
        fetch(`${API_BASE_URL}/analytics/sources/?days=${days}`),
        fetch(`${API_BASE_URL}/analytics/realtime/`),
      ]);

      const [overview, chart, pages, sources, realtime] = await Promise.all([
        overviewRes.json(),
        chartRes.json(),
        pagesRes.json(),
        sourcesRes.json(),
        realtimeRes.json(),
      ]);

      setData({
        overview: overview.data || null,
        chart: chart.data || [],
        pages: pages.data || [],
        sources: sources.data || { referrers: [], direct: 0 },
        realtime: realtime.data || null,
      });
    } catch (err) {
      setError('Fehler beim Laden der Analytics-Daten.');
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  // Prepare pie chart data for devices
  const deviceData = data.overview?.devices
    ? Object.entries(data.overview.devices).map(([name, value]) => ({
        name: name === 'desktop' ? 'Desktop' : name === 'mobile' ? 'Mobile' : 'Tablet',
        value,
      }))
    : [];

  // Prepare sources data
  const sourcesData = [
    { name: 'Direkt', value: data.sources.direct },
    ...data.sources.referrers.map((r) => ({
      name: r.referrer_domain || 'Unbekannt',
      value: r.count,
    })),
  ].slice(0, 5);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Website Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            DSGVO-konforme Statistiken - keine persönlichen Daten gespeichert
          </Typography>
        </Box>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Zeitraum</InputLabel>
          <Select value={days} label="Zeitraum" onChange={(e) => setDays(Number(e.target.value))}>
            <MenuItem value={7}>7 Tage</MenuItem>
            <MenuItem value={30}>30 Tage</MenuItem>
            <MenuItem value={90}>90 Tage</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <LinearProgress sx={{ mb: 3 }} />
      ) : null}

      {/* Realtime Stats */}
      {data.realtime && (
        <Card sx={{ mb: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: 'success.main',
                animation: 'pulse 2s infinite',
              }}
            />
            <Typography variant="h6">
              {data.realtime.active_last_30min} aktive Besucher (letzte 30 Min)
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Visibility color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Page Views
                </Typography>
              </Box>
              {loading ? (
                <Skeleton variant="text" width={100} height={40} />
              ) : (
                <Typography variant="h3" sx={{ fontWeight: 600 }}>
                  {formatNumber(data.overview?.total_views || 0)}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Besucher
                </Typography>
              </Box>
              {loading ? (
                <Skeleton variant="text" width={100} height={40} />
              ) : (
                <Typography variant="h3" sx={{ fontWeight: 600 }}>
                  {formatNumber(data.overview?.total_visitors || 0)}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Schedule color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Ø pro Tag
                </Typography>
              </Box>
              {loading ? (
                <Skeleton variant="text" width={100} height={40} />
              ) : (
                <Typography variant="h3" sx={{ fontWeight: 600 }}>
                  {formatNumber(data.overview?.avg_daily_views || 0)}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {data.overview?.trend_direction === 'up' ? (
                  <TrendingUp color="success" sx={{ mr: 1 }} />
                ) : (
                  <TrendingDown color="error" sx={{ mr: 1 }} />
                )}
                <Typography variant="body2" color="text.secondary">
                  Trend (Vorperiode)
                </Typography>
              </Box>
              {loading ? (
                <Skeleton variant="text" width={100} height={40} />
              ) : (
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 600,
                    color: data.overview?.trend_direction === 'up' ? 'success.main' : 'error.main',
                  }}
                >
                  {(data.overview?.trend_percent || 0) > 0 ? '+' : ''}
                  {data.overview?.trend_percent ?? 0}%
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Chart */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Besucherentwicklung
          </Typography>
          <Box sx={{ height: 300 }}>
            {loading ? (
              <Skeleton variant="rectangular" height={300} />
            ) : data.chart.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(parseISO(date), 'dd.MM', { locale: de })}
                    stroke="#666"
                  />
                  <YAxis stroke="#666" />
                  <Tooltip
                    labelFormatter={(date) => format(parseISO(date as string), 'dd.MM.yyyy', { locale: de })}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#1976d2"
                    strokeWidth={2}
                    name="Page Views"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="#dc004e"
                    strokeWidth={2}
                    name="Besucher"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography color="text.secondary">Noch keine Daten vorhanden</Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Secondary Stats */}
      <Grid container spacing={3}>
        {/* Top Pages */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Beliebteste Seiten
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" height={250} />
              ) : data.pages.length > 0 ? (
                <Box sx={{ height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.pages.slice(0, 5).map((p) => ({
                        name: p.page_path === '/' ? 'Home' : p.page_path.slice(1, 20),
                        views: p.views,
                      }))}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="views" fill="#1976d2" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Typography color="text.secondary">Noch keine Daten</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Traffic Sources */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Traffic-Quellen
              </Typography>
              {loading ? (
                <Skeleton variant="rectangular" height={250} />
              ) : sourcesData.length > 0 ? (
                <Box sx={{ height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={sourcesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {sourcesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              ) : (
                <Typography color="text.secondary">Noch keine Daten</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Devices */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Devices sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Geräte
                </Typography>
              </Box>
              {loading ? (
                <Skeleton variant="text" height={100} />
              ) : deviceData.length > 0 ? (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {deviceData.map((device) => (
                    <Chip
                      key={device.name}
                      label={`${device.name}: ${device.value}`}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">Keine Daten</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Countries */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Public sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Länder
                </Typography>
              </Box>
              {loading ? (
                <Skeleton variant="text" height={100} />
              ) : data.overview?.countries && Object.keys(data.overview.countries || {}).length > 0 ? (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {Object.entries(data.overview.countries || {}).map(([country, count]) => (
                    <Chip
                      key={country}
                      label={`${country || 'Unbekannt'}: ${count}`}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">Keine Daten</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
