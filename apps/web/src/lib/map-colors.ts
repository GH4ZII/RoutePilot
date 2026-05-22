import type { DeliveryStatus } from '../types/domain'

export const DELIVERY_MARKER_COLORS: Record<DeliveryStatus, string> = {
  PENDING: '#64748b',
  ASSIGNED: '#4f46e5',
  IN_PROGRESS: '#2563eb',
  DELIVERED: '#16a34a',
  FAILED: '#dc2626',
  CANCELLED: '#94a3b8',
}

export const DEPOT_MARKER_COLOR = '#7c3aed'

export const ROUTE_LINE_COLOR = '#4f46e5'
