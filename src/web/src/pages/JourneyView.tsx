import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Stepper,
  Step,
  StepLabel,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import {
  Thermostat as TempIcon,
  WaterDrop as HumidityIcon,
  Vibration as ShockIcon,
  LocationOn as GpsIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { apiClient } from '../services/api';
import { Shipment } from '../types';
import { StatusChip } from '../components/common/StatusChip';

export const JourneyView: React.FC = () => {
  const { id = 'SHP-8921' } = useParams();
  const [shipment, setShipment] = useState<Shipment | null>(null);

  useEffect(() => {
    apiClient
      .get<Shipment>(`/shipments/${id}`)
      .then((res) => setShipment(res.data))
      .catch((err) => console.error('Failed to load shipment details', err));
  }, [id]);

  if (!shipment) return <Typography p={3}>Loading shipment journey telemetry...</Typography>;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
            <Typography variant="h5" fontWeight={700}>Journey View: {shipment.id}</Typography>
            <StatusChip status={shipment.status} />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Tracking Number: {shipment.trackingNumber} | Carrier: {shipment.carrier}
          </Typography>
        </Box>
      </Box>

      {/* Route & Timeline Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" mb={3}>Shipment Milestone Progression</Typography>
          <Stepper activeStep={shipment.milestones.findIndex((m) => m.active || !m.completed) - 1} alternativeLabel>
            {shipment.milestones.map((m) => (
              <Step key={m.id} completed={m.completed}>
                <StepLabel
                  optional={<Typography variant="caption" color="text.secondary">{m.timestamp}</Typography>}
                >
                  <Typography variant="subtitle2" fontWeight={600}>{m.title}</Typography>
                  <Typography variant="caption" display="block">{m.location}</Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </CardContent>
      </Card>

      {/* IoT Telemetry Grid */}
      {shipment.telemetry && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" mb={2}>IoT Sensor Live Telemetry</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <TempIcon sx={{ color: shipment.telemetry.temperatureC > 12 ? '#dc2626' : '#2563eb' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Temperature</Typography>
                        <Typography variant="h6" fontWeight={700}>{shipment.telemetry.temperatureC}°C</Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={6}>
                    <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <HumidityIcon sx={{ color: '#0284c7' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Humidity</Typography>
                        <Typography variant="h6" fontWeight={700}>{shipment.telemetry.humidityPercent}%</Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={6}>
                    <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <ShockIcon sx={{ color: '#d97706' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Impact / Shock</Typography>
                        <Typography variant="h6" fontWeight={700}>{shipment.telemetry.shockG} G</Typography>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={6}>
                    <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <GpsIcon sx={{ color: '#16a34a' }} />
                      <Box>
                        <Typography variant="caption" color="text.secondary">GPS Fix</Typography>
                        <Typography variant="subtitle2" fontWeight={700}>{shipment.telemetry.latitude.toFixed(2)}, {shipment.telemetry.longitude.toFixed(2)}</Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" mb={2}>Manifest & Specs</Typography>
                <Box display="flex" justifyContent="space-between" py={1}>
                  <Typography variant="body2" color="text.secondary">Origin Facility</Typography>
                  <Typography variant="body2" fontWeight={600}>{shipment.origin}</Typography>
                </Box>
                <Divider />
                <Box display="flex" justifyContent="space-between" py={1}>
                  <Typography variant="body2" color="text.secondary">Destination Terminal</Typography>
                  <Typography variant="body2" fontWeight={600}>{shipment.destination}</Typography>
                </Box>
                <Divider />
                <Box display="flex" justifyContent="space-between" py={1}>
                  <Typography variant="body2" color="text.secondary">Cargo Weight</Typography>
                  <Typography variant="body2" fontWeight={600}>{shipment.weightKg} kg</Typography>
                </Box>
                <Divider />
                <Box display="flex" justifyContent="space-between" py={1}>
                  <Typography variant="body2" color="text.secondary">Estimated SLA Arrival</Typography>
                  <Typography variant="body2" fontWeight={600}>{new Date(shipment.estimatedDelivery).toLocaleString()}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
