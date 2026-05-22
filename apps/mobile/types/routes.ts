export type RouteStatus =
  | 'PLANNED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type RouteStopStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'SKIPPED';

export type DeliveryPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export type RouteStop = {
  id: string;
  stopOrder: number;
  estimatedArrival: string | null;
  actualArrival: string | null;
  status: RouteStopStatus;
  delivery: {
    id: string;
    customerName: string;
    phone: string | null;
    address: string;
    latitude: number;
    longitude: number;
    weightKg: number;
    volumeM3: number | null;
    notes: string | null;
    status: string;
    priority: DeliveryPriority;
  };
};

export type DriverRoute = {
  id: string;
  organizationId: string;
  driverId: string | null;
  vehicleId: string | null;
  status: RouteStatus;
  plannedDate: string;
  totalDistanceMeters: number | null;
  totalDurationSeconds: number | null;
  capacityUsedKg: number | null;
  startedAt: string | null;
  finishedAt: string | null;
  vehicle: {
    id: string;
    name: string;
    startAddress: string;
    endAddress: string;
    startLatitude: number;
    startLongitude: number;
    endLatitude: number;
    endLongitude: number;
  } | null;
  driver: {
    id: string;
    name: string;
    phone: string | null;
  } | null;
  stops: RouteStop[];
  createdAt: string;
  updatedAt: string;
};
