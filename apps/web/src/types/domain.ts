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
  maxWeightKg: number
  maxVolumeM3: number
  startLatitude: number
  startLongitude: number
  endLatitude: number
  endLongitude: number
  status?: VehicleStatus
}

export type UpdateVehiclePayload = Partial<CreateVehiclePayload>

export type CreateDeliveryPayload = {
  customerName: string
  phone?: string
  address: string
  latitude: number
  longitude: number
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
