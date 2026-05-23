export type UserRole = 'ADMIN' | 'DISPATCHER' | 'DRIVER'

export type DriverStatus =
  | 'AVAILABLE'
  | 'ON_ROUTE'
  | 'UNAVAILABLE'
  | 'OFF_DUTY'

export type VehicleStatus =
  | 'AVAILABLE'
  | 'IN_USE'
  | 'MAINTENANCE'
  | 'UNAVAILABLE'

export type DeliveryStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'DELIVERED'
  | 'FAILED'
  | 'CANCELLED'

export type DeliveryPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL'

export type OrgUser = {
  id: string
  organizationId: string
  email: string
  role: UserRole
  name: string | null
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export type Driver = {
  id: string
  organizationId: string
  userId: string | null
  vehicleId: string | null
  activeRouteId: string | null
  name: string
  phone: string | null
  email: string | null
  status: DriverStatus
  createdAt: string
  updatedAt: string
}

export type Depot = {
  id: string
  organizationId: string
  name: string
  address: string
  latitude: number
  longitude: number
  createdAt: string
  updatedAt: string
}

export type CreateDepotPayload = {
  name: string
  address: string
}

export type UpdateDepotPayload = Partial<CreateDepotPayload>

export type Vehicle = {
  id: string
  organizationId: string
  depotId: string | null
  name: string
  registrationNumber: string
  startAddress: string
  endAddress: string
  maxWeightKg: number
  maxVolumeM3: number
  startLatitude: number
  startLongitude: number
  endLatitude: number
  endLongitude: number
  status: VehicleStatus
  createdAt: string
  updatedAt: string
}

export type Delivery = {
  id: string
  organizationId: string
  customerName: string
  phone: string | null
  address: string
  latitude: number
  longitude: number
  weightKg: number
  volumeM3: number | null
  priority: DeliveryPriority
  deadline: string | null
  timeWindowStart: string | null
  timeWindowEnd: string | null
  notes: string | null
  status: DeliveryStatus
  createdAt: string
  updatedAt: string
}

export type AddressSuggestion = {
  latitude: number
  longitude: number
  displayName: string
}

export type CreateUserPayload = {
  email: string
  password: string
  role: UserRole
  name?: string
  avatarUrl?: string
}

export type UpdateUserPayload = {
  password?: string
  role?: UserRole
  name?: string
  avatarUrl?: string | null
}

export type CreateDriverPayload = {
  name: string
  phone?: string
  email: string
  password: string
  status?: DriverStatus
}

export type UpdateDriverPayload = {
  name?: string
  phone?: string
  email?: string
  status?: DriverStatus
  password?: string
}

export type CreateVehiclePayload = {
  name: string
  registrationNumber: string
  startAddress: string
  endAddress: string
  maxWeightKg: number
  maxVolumeM3: number
  status?: VehicleStatus
  depotId?: string
}

export type UpdateVehiclePayload = Partial<CreateVehiclePayload>

export type CreateDeliveryPayload = {
  customerName: string
  phone?: string
  address: string
  weightKg: number
  volumeM3?: number
  priority?: DeliveryPriority
  deadline?: string
  timeWindowStart?: string
  timeWindowEnd?: string
  notes?: string
  status?: DeliveryStatus
}

export type UpdateDeliveryPayload = Partial<CreateDeliveryPayload> & {
  deadline?: string | null
  timeWindowStart?: string | null
  timeWindowEnd?: string | null
}

export type OptimizationJobStatus =
  | 'PENDING'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'

export type OptimizationObjective =
  | 'MINIMIZE_TOTAL_DISTANCE'
  | 'MINIMIZE_TOTAL_TIME'
  | 'BALANCE_WORKLOAD'
  | 'PRIORITIZE_URGENT'
  | 'MINIMIZE_LATE_DELIVERIES'

export type CreateOptimizationJobPayload = {
  plannedDate: string
  /** Én bil (bakoverkompatibel) */
  vehicleId?: string
  /** Flere kjøretøy (VRP) */
  vehicleIds?: string[]
  driverIds?: string[]
  deliveryIds: string[]
  objective?: OptimizationObjective
  routeStartTime?: string
  returnToDepot?: boolean
  respectCapacity?: boolean
  respectTimeWindows?: boolean
}

export type OptimizationRouteStop = {
  deliveryId: string
  order: number
  estimatedArrival: string | null
}

export type OptimizationRouteResult = {
  routeId: string
  driverId: string | null
  vehicleId: string
  totalDistanceMeters: number
  totalDurationSeconds: number
  capacityUsedKg?: number
  optimizerCost?: number
  stops: OptimizationRouteStop[]
}

export type OptimizationJobResult = {
  routes: OptimizationRouteResult[]
  unassignedDeliveries: string[]
  warnings: string[]
}

export type RouteStatus =
  | 'PLANNED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'

export type RouteStopStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'SKIPPED'

export type ProofOfDeliveryDetail = {
  id: string
  photoUrl: string | null
  signatureUrl: string | null
  note: string | null
  latitude: number | null
  longitude: number | null
  capturedAt: string
}

export type RouteStopDetail = {
  id: string
  stopOrder: number
  estimatedArrival: string | null
  actualArrival: string | null
  status: RouteStopStatus
  proofOfDelivery: ProofOfDeliveryDetail | null
  delivery: {
    id: string
    customerName: string
    phone: string | null
    address: string
    latitude: number
    longitude: number
    weightKg: number
    volumeM3: number | null
    notes: string | null
    status: DeliveryStatus
    priority: DeliveryPriority
  }
}

export type RouteDetail = {
  id: string
  organizationId: string
  driverId: string | null
  vehicleId: string | null
  status: RouteStatus
  plannedDate: string
  totalDistanceMeters: number | null
  totalDurationSeconds: number | null
  actualDistanceMeters: number | null
  actualDurationSeconds: number | null
  capacityUsedKg: number | null
  startedAt: string | null
  finishedAt: string | null
  driver: {
    id: string
    name: string
    phone: string | null
  } | null
  vehicle: {
    id: string
    name: string
    startAddress: string
    endAddress: string
    startLatitude: number
    startLongitude: number
    endLatitude: number
    endLongitude: number
  } | null
  stops: RouteStopDetail[]
  createdAt: string
  updatedAt: string
}

export type OptimizationJob = {
  id: string
  organizationId: string
  status: OptimizationJobStatus
  objective: OptimizationObjective
  plannedDate: string
  request: CreateOptimizationJobPayload
  result: OptimizationJobResult | null
  errorMessage: string | null
  startedAt: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export type DashboardAlertType =
  | 'DEADLINE_AT_RISK'
  | 'OVER_CAPACITY'
  | 'NO_DRIVER'
  | 'FAILED_DELIVERY'

export type DashboardAlert = {
  type: DashboardAlertType
  severity: 'warning' | 'error'
  message: string
  deliveryId?: string
  routeId?: string
  driverId?: string
}

export type DashboardSummary = {
  date: string
  metrics: {
    deliveries: {
      total: number
      pending: number
      assigned: number
      inProgress: number
      delivered: number
      failed: number
      cancelled: number
    }
    routes: {
      active: number
      plannedToday: number
      completedToday: number
    }
    delayedDeliveries: number
    averageRouteDurationSeconds: number | null
    totalEstimatedDistanceMeters: number
    capacityUtilizationPercent: number | null
  }
  alerts: DashboardAlert[]
}

export type LiveRouteStop = {
  id: string
  stopOrder: number
  status: RouteStopStatus
  estimatedArrival: string | null
  actualArrival: string | null
  isDelayed: boolean
  delivery: {
    id: string
    customerName: string
    address: string
    latitude: number
    longitude: number
    status: DeliveryStatus
    priority: string
    phone: string | null
  }
}

export type DriverLocationSnapshot = {
  latitude: number
  longitude: number
  recordedAt: string
  heading: number | null
  speed: number | null
}

export type LiveRoute = {
  id: string
  status: RouteStatus
  plannedDate: string
  driver: { id: string; name: string; phone: string | null } | null
  driverLocation: DriverLocationSnapshot | null
  vehicle: {
    id: string
    name: string
    startLatitude: number
    startLongitude: number
    endLatitude: number
    endLongitude: number
    maxWeightKg: number
  } | null
  totalDistanceMeters: number | null
  capacityUsedKg: number | null
  stops: LiveRouteStop[]
  completedStops: number
  totalStops: number
}

export type DashboardDeliveriesStatus = {
  date: string
  byStatus: Array<{ status: DeliveryStatus; count: number }>
  delayed: Array<{
    id: string
    customerName: string
    address: string
    status: DeliveryStatus
    deadline: string | null
    reason: string
  }>
}

export type DailyReport = {
  date: string
  deliveries: {
    pending: number
    assigned: number
    inProgress: number
    delivered: number
    failed: number
    cancelled: number
    total: number
  }
  routes: {
    planned: number
    completed: number
    active: number
  }
  totals: {
    distanceMeters: number
    durationSeconds: number
    stopsCompleted: number
    stopsFailed: number
  }
  onTimeRate: number | null
}

export type DriverPerformanceRow = {
  driverId: string
  name: string
  routesCompleted: number
  stopsCompleted: number
  stopsFailed: number
  onTimePercent: number | null
  avgDelayMinutes: number | null
}

export type DriverPerformanceReport = {
  from: string
  to: string
  drivers: DriverPerformanceRow[]
}

export type RouteEfficiencyRow = {
  routeId: string
  plannedDate: string
  driver: { id: string; name: string } | null
  vehicle: { id: string; name: string } | null
  plannedDistanceMeters: number | null
  actualDurationSeconds: number | null
  capacityUtilizationPercent: number | null
  stopCompletionRate: number | null
  avgArrivalDeltaMinutes: number | null
}

export type RouteEfficiencyReport = {
  from: string
  to: string
  routes: RouteEfficiencyRow[]
}

export type ImportCsvResult = {
  created: Delivery[]
  errors: Array<{ row: number; message: string }>
}

export type PlannedVsActualReport = {
  from: string
  to: string
  routes: Array<{
    routeId: string
    plannedDate: string
    plannedDistanceMeters: number | null
    actualDistanceMeters: number | null
    plannedDurationSeconds: number | null
    actualDurationSeconds: number | null
    stops: Array<{
      stopId: string
      stopOrder: number
      customerName: string
      estimatedArrival: string | null
      actualArrival: string | null
      deltaMinutes: number | null
    }>
  }>
}
