import type {
  AuthResponse,
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from '../types/auth'
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
