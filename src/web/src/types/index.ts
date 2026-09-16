export type ShipmentStatus = 'IN_TRANSIT' | 'DELIVERED' | 'DELAYED' | 'EXCEPTION' | 'CUSTOMS_HOLD';

export interface Milestone {
  id: string;
  title: string;
  location: string;
  timestamp: string;
  completed: boolean;
  active?: boolean;
}

export interface Telemetry {
  temperatureC: number;
  humidityPercent: number;
  shockG: number;
  latitude: number;
  longitude: number;
  lastUpdated: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  carrier: string;
  status: ShipmentStatus;
  estimatedDelivery: string;
  weightKg: number;
  milestones: Milestone[];
  telemetry?: Telemetry;
  exceptionReason?: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface DashboardMetrics {
  totalShipments: number;
  inTransitCount: number;
  onTimeDeliveryRatePercent: number;
  exceptionCount: number;
  activeAlertsCount: number;
  statusDistribution: {
    inTransit: number;
    delivered: number;
    delayed: number;
    exception: number;
  };
  recentActivities: {
    id: string;
    timestamp: string;
    description: string;
    type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  }[];
}

export interface SearchFilters {
  query?: string;
  status?: string;
  carrier?: string;
  origin?: string;
}
