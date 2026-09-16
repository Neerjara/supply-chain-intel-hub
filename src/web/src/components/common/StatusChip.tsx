import React from 'react';
import { Chip } from '@mui/material';
import { ShipmentStatus } from '../../types';

interface StatusChipProps {
  status: ShipmentStatus;
  size?: 'small' | 'medium';
}

export const StatusChip: React.FC<StatusChipProps> = ({ status, size = 'small' }) => {
  const getStatusConfig = (status: ShipmentStatus) => {
    switch (status) {
      case 'IN_TRANSIT':
        return { label: 'In Transit', color: '#0284c7', bg: '#e0f2fe' };
      case 'DELIVERED':
        return { label: 'Delivered', color: '#16a34a', bg: '#dcfce7' };
      case 'DELAYED':
        return { label: 'Delayed', color: '#d97706', bg: '#fef3c7' };
      case 'EXCEPTION':
        return { label: 'Exception', color: '#dc2626', bg: '#fee2e2' };
      case 'CUSTOMS_HOLD':
        return { label: 'Customs Hold', color: '#9333ea', bg: '#f3e8ff' };
      default:
        return { label: status, color: '#64748b', bg: '#f1f5f9' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      size={size}
      style={{
        backgroundColor: config.bg,
        color: config.color,
        fontWeight: 600,
        borderRadius: 6,
      }}
    />
  );
};
