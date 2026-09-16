import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Switch,
  FormControlLabel,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  CloudDoneOutlined as AzureIcon,
  StorageOutlined as DbIcon,
  KeyOutlined as KeyVaultIcon,
  SecurityOutlined as RbacIcon,
} from '@mui/icons-material';

export const Administration: React.FC = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Administration & System Control</Typography>
          <Typography variant="body2" color="text.secondary">
            Integration health, RBAC matrix, and automated alert notification channels
          </Typography>
        </Box>
      </Box>

      {/* Integration Status Grid */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <AzureIcon sx={{ color: '#0284c7' }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>Azure APIM</Typography>
                <Typography variant="caption" color="text.secondary">apim-scih-prod-001</Typography>
              </Box>
            </Box>
            <Chip label="Healthy" color="success" size="small" />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <AzureIcon sx={{ color: '#2563eb' }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>Container Apps</Typography>
                <Typography variant="caption" color="text.secondary">cae-scih-prod-001</Typography>
              </Box>
            </Box>
            <Chip label="2 Apps Running" color="success" size="small" />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <DbIcon sx={{ color: '#16a34a' }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>PostgreSQL Flex</Typography>
                <Typography variant="caption" color="text.secondary">psql-scih-prod-001</Typography>
              </Box>
            </Box>
            <Chip label="VNet Connected" color="success" size="small" />
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <KeyVaultIcon sx={{ color: '#d97706' }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={600}>Azure Key Vault</Typography>
                <Typography variant="caption" color="text.secondary">kvscihprod001</Typography>
              </Box>
            </Box>
            <Chip label="Active" color="success" size="small" />
          </Paper>
        </Grid>
      </Grid>

      {/* System Settings & Notification Channels */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>Automated Notification Controls</Typography>
              <Box py={1}>
                <FormControlLabel control={<Switch defaultChecked color="primary" />} label="Cold Chain Temperature Breach Alerts" />
              </Box>
              <Divider />
              <Box py={1}>
                <FormControlLabel control={<Switch defaultChecked color="primary" />} label="Customs Hold Webhook Dispatch (Teams / Slack)" />
              </Box>
              <Divider />
              <Box py={1}>
                <FormControlLabel control={<Switch defaultChecked color="primary" />} label="Automated SLA Exceedance Escalation" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>System Role Access Matrix (RBAC)</Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell fontWeight={700}>Role</TableCell>
                    <TableCell fontWeight={700}>Search</TableCell>
                    <TableCell fontWeight={700}>Intervention</TableCell>
                    <TableCell fontWeight={700}>Admin</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell fontWeight={600}>Logistics Director</TableCell>
                    <TableCell><Chip label="Full" color="success" size="small" /></TableCell>
                    <TableCell><Chip label="Full" color="success" size="small" /></TableCell>
                    <TableCell><Chip label="Full" color="success" size="small" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell fontWeight={600}>Dispatch Operator</TableCell>
                    <TableCell><Chip label="Full" color="success" size="small" /></TableCell>
                    <TableCell><Chip label="Full" color="success" size="small" /></TableCell>
                    <TableCell><Chip label="Read-Only" color="default" size="small" /></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell fontWeight={600}>Compliance Auditor</TableCell>
                    <TableCell><Chip label="Read-Only" color="default" size="small" /></TableCell>
                    <TableCell><Chip label="None" color="error" size="small" /></TableCell>
                    <TableCell><Chip label="None" color="error" size="small" /></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
