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

export type Vehicle = {
  id: string
  organizationId: string
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
}

export type UpdateUserPayload = {
  password?: string
  role?: UserRole
  name?: string
}

export type CreateDriverPayload = {
  name: string
  phone?: string
  email?: string
  status?: DriverStatus
}

export type UpdateDriverPayload = {
  name?: string
  phone?: string
  email?: string
  status?: DriverStatus
}

export type CreateVehiclePayload = {
  name: string
  registrationNumber: string
  startAddress: string
  endAddress: string
  maxWeightKg: number
  maxVolumeM3: number
  status?: VehicleStatus
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
  vehicleId: string
  driverId?: string
  deliveryIds: string[]
  objective?: OptimizationObjective
  routeStartTime?: string
  returnToDepot?: boolean
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

export type RouteStopDetail = {
  id: string
  stopOrder: number
  estimatedArrival: string | null
  status: RouteStopStatus
  delivery: {
    id: string
    customerName: string
    address: string
    latitude: number
    longitude: number
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
