import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  FileDownloadOutlined as ExportIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/api';
import { Shipment } from '../types';
import { StatusChip } from '../components/common/StatusChip';

export const TransactionSearch: React.FC = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [carrierFilter, setCarrierFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchShipments = () => {
    setLoading(true);
    apiClient
      .get<Shipment[]>('/search', {
        params: {
          query: query || undefined,
          status: statusFilter,
          carrier: carrierFilter,
        },
      })
      .then((res) => {
        setShipments(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to search transactions', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchShipments();
  }, [statusFilter, carrierFilter]);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Transaction Search</Typography>
          <Typography variant="body2" color="text.secondary">
            Query across global shipments, containers, and historical manifests
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<ExportIcon />}>
          Export CSV
        </Button>
      </Box>

      {/* Filter Control Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search ID, Tracking #, Origin, Destination..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchShipments()}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: '#64748b', mr: 1, fontSize: 20 }} />,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                select
                size="small"
                label="Status Filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value="IN_TRANSIT">In Transit</MenuItem>
                <MenuItem value="DELIVERED">Delivered</MenuItem>
                <MenuItem value="DELAYED">Delayed</MenuItem>
                <MenuItem value="EXCEPTION">Exception</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                select
                size="small"
                label="Carrier Filter"
                value={carrierFilter}
                onChange={(e) => setCarrierFilter(e.target.value)}
              >
                <MenuItem value="ALL">All Carriers</MenuItem>
                <MenuItem value="FedEx Freight">FedEx Freight</MenuItem>
                <MenuItem value="DHL Express">DHL Express</MenuItem>
                <MenuItem value="UPS Supply Chain">UPS Supply Chain</MenuItem>
                <MenuItem value="XPO Logistics">XPO Logistics</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={2}>
              <Button fullWidth variant="contained" onClick={fetchShipments}>
                Search
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Data Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Shipment ID</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Tracking Number</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Route (Origin → Dest)</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Carrier</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Est. Delivery</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shipments.map((row) => (
              <TableRow key={row.id} hover>
                <TableCell fontWeight={600} sx={{ color: '#2563eb' }}>{row.id}</TableCell>
                <TableCell>{row.trackingNumber}</TableCell>
                <TableCell>{row.origin} → {row.destination}</TableCell>
                <TableCell>{row.carrier}</TableCell>
                <TableCell><StatusChip status={row.status} /></TableCell>
                <TableCell>{new Date(row.estimatedDelivery).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <Tooltip title="View Detailed Journey">
                    <IconButton size="small" color="primary" onClick={() => navigate(`/journey/${row.id}`)}>
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
