import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  WarningAmberOutlined as AlertIcon,
  AltRouteOutlined as RerouteIcon,
  PhoneInTalkOutlined as ContactIcon,
  AssignmentTurnedInOutlined as ResolveIcon,
} from '@mui/icons-material';
import { apiClient } from '../services/api';
import { Shipment } from '../types';

export const ExceptionWorkbench: React.FC = () => {
  const [exceptions, setExceptions] = useState<Shipment[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionNotes, setActionNotes] = useState('');

  useEffect(() => {
    apiClient.get<Shipment[]>('/search').then((res) => {
      const activeExceptions = res.data.filter((s) => s.status === 'EXCEPTION' || s.status === 'DELAYED');
      setExceptions(activeExceptions);
    });
  }, []);

  const handleOpenAction = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setDialogOpen(true);
  };

  const handleResolveAction = () => {
    if (selectedShipment) {
      setExceptions(exceptions.filter((e) => e.id !== selectedShipment.id));
    }
    setDialogOpen(false);
    setActionNotes('');
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Exception Workbench</Typography>
          <Typography variant="body2" color="text.secondary">
            Active SLA delay queues, cold chain breaches, and resolution workflows
          </Typography>
        </Box>
        <Chip label={`${exceptions.length} Active Exceptions`} color="error" fontWeight={600} />
      </Box>

      {/* Exception Action Cards */}
      <Grid container spacing={3}>
        {exceptions.map((shp) => (
          <Grid item xs={12} key={shp.id}>
            <Card sx={{ borderLeft: `6px solid ${shp.severity === 'CRITICAL' ? '#dc2626' : '#d97706'}` }}>
              <CardContent sx={{ p: 2.5 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar sx={{ bgcolor: shp.severity === 'CRITICAL' ? '#fee2e2' : '#fef3c7', color: shp.severity === 'CRITICAL' ? '#dc2626' : '#d97706' }}>
                        <AlertIcon />
                      </Avatar>
                      <Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="h6" fontWeight={700}>{shp.id}</Typography>
                          <Chip label={shp.severity} size="small" color={shp.severity === 'CRITICAL' ? 'error' : 'warning'} />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Carrier: {shp.carrier} | Route: {shp.origin} → {shp.destination}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <Typography variant="subtitle2" color="error" fontWeight={600}>
                      {shp.exceptionReason || 'Customs documentation discrepancy'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Sensor Alert: Temperature exceedance recorded at 21:15 UTC
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={3} display="flex" justifyContent="flex-end" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<RerouteIcon />}
                      onClick={() => handleOpenAction(shp)}
                    >
                      Re-route
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      startIcon={<ResolveIcon />}
                      onClick={() => handleOpenAction(shp)}
                    >
                      Resolve
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Resolution Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>Dispatch Intervention: {selectedShipment?.id}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" mb={2}>
            Select resolution action for <strong>{selectedShipment?.trackingNumber}</strong> ({selectedShipment?.carrier}):
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Resolution Action Notes"
            placeholder="Describe dispatch instructions, driver communication, or container rerouting details..."
            value={actionNotes}
            onChange={(e) => setActionNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleResolveAction}>
            Submit Resolution
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
