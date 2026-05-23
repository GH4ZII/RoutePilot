import type {
  DashboardAlertType,
  DeliveryPriority,
  DeliveryStatus,
  DriverStatus,
  UserRole,
  VehicleStatus,
} from '../types/domain'

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Admin',
  DISPATCHER: 'Dispatcher',
  DRIVER: 'Sjåfør',
}

export const DRIVER_STATUS_LABELS: Record<DriverStatus, string> = {
  AVAILABLE: 'Tilgjengelig',
  ON_ROUTE: 'På rute',
  UNAVAILABLE: 'Utilgjengelig',
  OFF_DUTY: 'Fri',
}

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  AVAILABLE: 'Tilgjengelig',
  IN_USE: 'I bruk',
  MAINTENANCE: 'Vedlikehold',
  UNAVAILABLE: 'Utilgjengelig',
}

export const DELIVERY_STATUS_LABELS: Record<DeliveryStatus, string> = {
  PENDING: 'Venter',
  ASSIGNED: 'Tildelt',
  IN_PROGRESS: 'Under levering',
  DELIVERED: 'Levert',
  FAILED: 'Feilet',
  CANCELLED: 'Kansellert',
}

export const DASHBOARD_ALERT_LABELS: Record<DashboardAlertType, string> = {
  DEADLINE_AT_RISK: 'Deadline',
  OVER_CAPACITY: 'Kapasitet',
  NO_DRIVER: 'Sjåfør',
  FAILED_DELIVERY: 'Feilet levering',
}

export const DELIVERY_PRIORITY_LABELS: Record<DeliveryPriority, string> = {
  LOW: 'Lav',
  NORMAL: 'Normal',
  HIGH: 'Høy',
  CRITICAL: 'Kritisk',
}

function statusModifier(value: string): string {
  return value.toLowerCase().replace(/_/g, '-')
}

export function driverStatusClass(status: DriverStatus): string {
  return `status-badge status-badge--${statusModifier(status)}`
}

export function vehicleStatusClass(status: VehicleStatus): string {
  return `status-badge status-badge--${statusModifier(status)}`
}

export function deliveryStatusClass(status: DeliveryStatus): string {
  return `status-badge status-badge--${statusModifier(status)}`
}

export function deliveryPriorityClass(priority: DeliveryPriority): string {
  return `priority-badge priority-badge--${priority.toLowerCase()}`
}
