import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Skeleton,
} from '@mui/material';
import {
  LocalShippingOutlined as ShippingIcon,
  CheckCircleOutlined as OnTimeIcon,
  WarningAmberOutlined as AlertIcon,
  TimerOutlined as TransitIcon,
  Circle as ActivityDot,
} from '@mui/icons-material';
import { apiClient } from '../services/api';
import { DashboardMetrics } from '../types';
import { KpiCard } from '../components/common/KpiCard';

export const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get<DashboardMetrics>('/dashboard')
      .then((res) => {
        setMetrics(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load dashboard metrics', err);
        setLoading(false);
      });
  }, []);

  if (loading || !metrics) {
    return (
      <Box p={2}>
        <Typography variant="h5" mb={3}>Dashboard Overview</Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rounded" height={120} />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Logistics & Supply Chain Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            Real-time tracking telemetry and SLA exception monitoring
          </Typography>
        </Box>
        <Chip label="Live Network Active" color="success" size="small" variant="outlined" />
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="Total Active Shipments"
            value={metrics.totalShipments.toLocaleString()}
            subtitle="Across 42 global routes"
            icon={<ShippingIcon />}
            color="#2563eb"
            trend="+5.2%"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="In-Transit Active"
            value={metrics.inTransitCount.toLocaleString()}
            subtitle="Currently on road/sea"
            icon={<TransitIcon />}
            color="#0284c7"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="On-Time Delivery Rate"
            value={`${metrics.onTimeDeliveryRatePercent}%`}
            subtitle="Target: >95.0%"
            icon={<OnTimeIcon />}
            color="#16a34a"
            trend="+1.4%"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <KpiCard
            title="SLA Exceptions"
            value={metrics.exceptionCount}
            subtitle="Requires dispatch intervention"
            icon={<AlertIcon />}
            color="#dc2626"
            trend="-2"
          />
        </Grid>
      </Grid>

      {/* Status Breakdown & Activity Stream */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Shipment Status Distribution
              </Typography>
              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" fontWeight={600}>In Transit ({metrics.statusDistribution.inTransit})</Typography>
                  <Typography variant="body2" color="text.secondary">56.7%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={56.7} sx={{ height: 8, borderRadius: 4, bgcolor: '#e0f2fe', '& .MuiLinearProgress-bar': { bgcolor: '#0284c7' } }} />
              </Box>

              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" fontWeight={600}>Delivered ({metrics.statusDistribution.delivered})</Typography>
                  <Typography variant="body2" color="text.secondary">39.8%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={39.8} sx={{ height: 8, borderRadius: 4, bgcolor: '#dcfce7', '& .MuiLinearProgress-bar': { bgcolor: '#16a34a' } }} />
              </Box>

              <Box mb={3}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" fontWeight={600}>Delayed ({metrics.statusDistribution.delayed})</Typography>
                  <Typography variant="body2" color="text.secondary">2.3%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={2.3} sx={{ height: 8, borderRadius: 4, bgcolor: '#fef3c7', '& .MuiLinearProgress-bar': { bgcolor: '#d97706' } }} />
              </Box>

              <Box mb={1}>
                <Box display="flex" justifyContent="space-between" mb={0.5}>
                  <Typography variant="body2" fontWeight={600}>Exception ({metrics.statusDistribution.exception})</Typography>
                  <Typography variant="body2" color="text.secondary">1.2%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={1.2} sx={{ height: 8, borderRadius: 4, bgcolor: '#fee2e2', '& .MuiLinearProgress-bar': { bgcolor: '#dc2626' } }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" mb={1}>
                Live Network Activity Stream
              </Typography>
              <List disablePadding>
                {metrics.recentActivities.map((act) => (
                  <ListItem key={act.id} sx={{ px: 0, py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <ActivityDot
                        sx={{
                          fontSize: 10,
                          color:
                            act.type === 'ERROR'
                              ? '#dc2626'
                              : act.type === 'WARNING'
                              ? '#d97706'
                              : act.type === 'SUCCESS'
                              ? '#16a34a'
                              : '#2563eb',
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={act.description}
                      secondary={act.timestamp}
                      primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: 11 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
