import React from 'react';
import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color?: string;
  trend?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = '#2563eb',
  trend,
}) => {
  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing={0.5}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5, color: '#0f172a' }}>
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: `${color}15`, color: color, width: 44, height: 44, borderRadius: 2 }}>
            {icon}
          </Avatar>
        </Box>
        {(subtitle || trend) && (
          <Box display="flex" alignItems="center" gap={1}>
            {trend && (
              <Typography variant="caption" fontWeight={700} sx={{ color: trend.startsWith('+') ? '#16a34a' : '#dc2626' }}>
                {trend}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
