import MockAdapter from 'axios-mock-adapter';
import { apiClient } from './api';
import { DashboardMetrics, Shipment } from '../types';

export const setupMockApi = () => {
  const mock = new MockAdapter(apiClient, { delayResponse: 500 });

  const mockShipments: Shipment[] = [
    {
      id: 'SHP-8921',
      trackingNumber: 'TRK-908234-US',
      origin: 'Chicago, IL',
      destination: 'Dallas, TX',
      carrier: 'FedEx Freight',
      status: 'IN_TRANSIT',
      estimatedDelivery: '2026-09-16T14:00:00Z',
      weightKg: 1420,
      milestones: [
        { id: '1', title: 'Order Created', location: 'Chicago Hub', timestamp: '2026-09-12T08:30:00Z', completed: true },
        { id: '2', title: 'Departed Facility', location: 'Chicago Terminal', timestamp: '2026-09-13T10:15:00Z', completed: true },
        { id: '3', title: 'In Transit', location: 'St. Louis Checkpoint', timestamp: '2026-09-14T09:00:00Z', completed: true, active: true },
        { id: '4', title: 'Out for Delivery', location: 'Dallas Fulfillment Center', timestamp: '2026-09-16T08:00:00Z', completed: false },
        { id: '5', title: 'Delivered', location: 'Dallas Destination', timestamp: '-', completed: false },
      ],
      telemetry: {
        temperatureC: 4.2,
        humidityPercent: 45,
        shockG: 0.1,
        latitude: 38.627,
        longitude: -90.1994,
        lastUpdated: '2026-09-14T21:10:00Z',
      },
    },
    {
      id: 'SHP-7740',
      trackingNumber: 'TRK-109238-CA',
      origin: 'Seattle, WA',
      destination: 'San Jose, CA',
      carrier: 'DHL Express',
      status: 'DELAYED',
      estimatedDelivery: '2026-09-17T18:00:00Z',
      weightKg: 850,
      exceptionReason: 'Severe weather delay near Medford pass',
      severity: 'HIGH',
      milestones: [
        { id: '1', title: 'Order Created', location: 'Seattle Port', timestamp: '2026-09-11T09:00:00Z', completed: true },
        { id: '2', title: 'In Transit', location: 'Medford Transit Hub', timestamp: '2026-09-13T16:20:00Z', completed: true, active: true },
        { id: '3', title: 'Delivered', location: 'San Jose Site', timestamp: '-', completed: false },
      ],
      telemetry: {
        temperatureC: 18.5,
        humidityPercent: 78,
        shockG: 1.4,
        latitude: 42.3265,
        longitude: -122.8756,
        lastUpdated: '2026-09-14T20:45:00Z',
      },
    },
    {
      id: 'SHP-6512',
      trackingNumber: 'TRK-554109-EU',
      origin: 'Atlanta, GA',
      destination: 'Miami, FL',
      carrier: 'UPS Supply Chain',
      status: 'EXCEPTION',
      estimatedDelivery: '2026-09-15T11:00:00Z',
      weightKg: 2100,
      exceptionReason: 'Cold chain temperature threshold exceeded (> 12°C)',
      severity: 'CRITICAL',
      milestones: [
        { id: '1', title: 'Order Created', location: 'Atlanta Depot', timestamp: '2026-09-10T12:00:00Z', completed: true },
        { id: '2', title: 'Temperature Alert', location: 'Jacksonville Terminal', timestamp: '2026-09-14T14:30:00Z', completed: true, active: true },
        { id: '3', title: 'Delivered', location: 'Miami Cold Storage', timestamp: '-', completed: false },
      ],
      telemetry: {
        temperatureC: 14.8,
        humidityPercent: 82,
        shockG: 0.3,
        latitude: 30.3322,
        longitude: -81.6557,
        lastUpdated: '2026-09-14T21:15:00Z',
      },
    },
    {
      id: 'SHP-9901',
      trackingNumber: 'TRK-882731-MX',
      origin: 'New York, NY',
      destination: 'Boston, MA',
      carrier: 'XPO Logistics',
      status: 'DELIVERED',
      estimatedDelivery: '2026-09-14T12:00:00Z',
      weightKg: 340,
      milestones: [
        { id: '1', title: 'Order Created', location: 'NY Hub', timestamp: '2026-09-13T06:00:00Z', completed: true },
        { id: '2', title: 'Out for Delivery', location: 'Boston Local', timestamp: '2026-09-14T08:00:00Z', completed: true },
        { id: '3', title: 'Delivered', location: 'Boston Customer', timestamp: '2026-09-14T11:45:00Z', completed: true },
      ],
    },
  ];

  // Dashboard endpoint mock
  mock.onGet('/dashboard').reply(200, {
    totalShipments: 1482,
    inTransitCount: 840,
    onTimeDeliveryRatePercent: 96.4,
    exceptionCount: 18,
    activeAlertsCount: 5,
    statusDistribution: {
      inTransit: 840,
      delivered: 590,
      delayed: 34,
      exception: 18,
    },
    recentActivities: [
      { id: 'act-1', timestamp: '10 mins ago', description: 'Cold chain alert triggered for SHP-6512 (Temperature: 14.8°C)', type: 'ERROR' },
      { id: 'act-2', timestamp: '25 mins ago', description: 'Shipment SHP-9901 marked DELIVERED in Boston, MA', type: 'SUCCESS' },
      { id: 'act-3', timestamp: '1 hour ago', description: 'Weather delay reported for carrier DHL on SHP-7740', type: 'WARNING' },
      { id: 'act-4', timestamp: '2 hours ago', description: 'Automated reroute dispatched for SHP-8921 via Memphis', type: 'INFO' },
    ],
  } as DashboardMetrics);

  // Search endpoint mock
  mock.onGet('/search').reply((config) => {
    const params = config.params || {};
    let filtered = [...mockShipments];

    if (params.query) {
      const q = params.query.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.trackingNumber.toLowerCase().includes(q) ||
          s.origin.toLowerCase().includes(q) ||
          s.destination.toLowerCase().includes(q)
      );
    }

    if (params.status && params.status !== 'ALL') {
      filtered = filtered.filter((s) => s.status === params.status);
    }

    if (params.carrier && params.carrier !== 'ALL') {
      filtered = filtered.filter((s) => s.carrier === params.carrier);
    }

    return [200, filtered];
  });

  // Single shipment lookup mock
  mock.onGet(/\/shipments\/.+/).reply((config) => {
    const id = config.url?.split('/').pop();
    const shipment = mockShipments.find((s) => s.id === id) || mockShipments[0];
    return [200, shipment];
  });
};
