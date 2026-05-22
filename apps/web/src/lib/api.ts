import type {
  AuthResponse,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from '../types/auth'
import type {
  CreateDeliveryPayload,
  CreateDriverPayload,
  CreateUserPayload,
  CreateVehiclePayload,
  Delivery,
  Driver,
  DriverStatus,
  DeliveryStatus,
  OrgUser,
  UpdateDeliveryPayload,
  UpdateDriverPayload,
  UpdateUserPayload,
  UpdateVehiclePayload,
  Vehicle,
  VehicleStatus,
} from '../types/domain'
import { getStoredToken } from './auth-storage'

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? 'http://localhost:3000'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as {
      message?: string | string[]
      error?: string
    }
    if (Array.isArray(body.message)) {
      return body.message.join(', ')
    }
    if (typeof body.message === 'string') {
      return body.message
    }
    if (typeof body.error === 'string') {
      return body.error
    }
  } catch {
    // ignore JSON parse errors
  }
  return response.statusText || 'Request failed'
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const token = getStoredToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const message = await parseErrorMessage(response)
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function register(
  credentials: RegisterCredentials,
): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(credentials),
  })
}

export function getMe(): Promise<AuthUser> {
  return request<AuthUser>('/auth/me')
}

export function listUsers(): Promise<OrgUser[]> {
  return request<OrgUser[]>('/users')
}

export function createUser(payload: CreateUserPayload): Promise<OrgUser> {
  return request<OrgUser>('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateUser(
  id: string,
  payload: UpdateUserPayload,
): Promise<OrgUser> {
  return request<OrgUser>(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function deleteUser(id: string): Promise<void> {
  return request<void>(`/users/${id}`, { method: 'DELETE' })
}

export function listDrivers(status?: DriverStatus): Promise<Driver[]> {
  const query = status ? `?status=${status}` : ''
  return request<Driver[]>(`/drivers${query}`)
}

export function createDriver(payload: CreateDriverPayload): Promise<Driver> {
  return request<Driver>('/drivers', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateDriver(
  id: string,
  payload: UpdateDriverPayload,
): Promise<Driver> {
  return request<Driver>(`/drivers/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function deleteDriver(id: string): Promise<void> {
  return request<void>(`/drivers/${id}`, { method: 'DELETE' })
}

export function listVehicles(status?: VehicleStatus): Promise<Vehicle[]> {
  const query = status ? `?status=${status}` : ''
  return request<Vehicle[]>(`/vehicles${query}`)
}

export function createVehicle(payload: CreateVehiclePayload): Promise<Vehicle> {
  return request<Vehicle>('/vehicles', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateVehicle(
  id: string,
  payload: UpdateVehiclePayload,
): Promise<Vehicle> {
  return request<Vehicle>(`/vehicles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function deleteVehicle(id: string): Promise<void> {
  return request<void>(`/vehicles/${id}`, { method: 'DELETE' })
}

export function listDeliveries(status?: DeliveryStatus): Promise<Delivery[]> {
  const query = status ? `?status=${status}` : ''
  return request<Delivery[]>(`/deliveries${query}`)
}

export function createDelivery(
  payload: CreateDeliveryPayload,
): Promise<Delivery> {
  return request<Delivery>('/deliveries', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateDelivery(
  id: string,
  payload: UpdateDeliveryPayload,
): Promise<Delivery> {
  return request<Delivery>(`/deliveries/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

export function deleteDelivery(id: string): Promise<void> {
  return request<void>(`/deliveries/${id}`, { method: 'DELETE' })
}
