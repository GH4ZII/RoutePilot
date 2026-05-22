import type {
  AuthResponse,
  AuthUser,
  LoginCredentials,
} from '@/types/auth';
import type { DriverRoute } from '@/types/routes';
import { resolveApiBaseUrl } from '@/lib/api-base-url';
import { getStoredToken } from '@/lib/auth-storage';

const API_BASE_URL = resolveApiBaseUrl();

if (__DEV__) {
  console.log('[RoutePilot] API base URL:', API_BASE_URL);
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function parseErrorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as {
      message?: string | string[];
      error?: string;
    };
    if (Array.isArray(body.message)) {
      return body.message.join(', ');
    }
    if (typeof body.message === 'string') {
      return body.message;
    }
    if (typeof body.error === 'string') {
      return body.error;
    }
  } catch {
    // ignore JSON parse errors
  }
  return response.statusText || 'Request failed';
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = await getStoredToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await parseErrorMessage(response);
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function getMe(): Promise<AuthUser> {
  return request<AuthUser>('/auth/me');
}

export type { DriverRoute, RouteStop } from '@/types/routes';

export function getMyRoutes(): Promise<DriverRoute[]> {
  return request<DriverRoute[]>('/routes/me');
}

/** @deprecated Bruk getMyRoutes */
export function getMyRouteToday(): Promise<DriverRoute | null> {
  return request<DriverRoute | null>('/routes/me/today');
}

export function getRoute(id: string): Promise<DriverRoute> {
  return request<DriverRoute>(`/routes/${id}`);
}

export function startRoute(id: string): Promise<DriverRoute> {
  return request<DriverRoute>(`/routes/${id}/start`, { method: 'POST' });
}

export function finishRoute(id: string): Promise<DriverRoute> {
  return request<DriverRoute>(`/routes/${id}/finish`, { method: 'POST' });
}

export function completeRouteStop(id: string): Promise<DriverRoute> {
  return request<DriverRoute>(`/route-stops/${id}/complete`, { method: 'POST' });
}

export function failRouteStop(
  id: string,
  reason?: string,
): Promise<DriverRoute> {
  return request<DriverRoute>(`/route-stops/${id}/fail`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

export function submitProofOfDelivery(
  stopId: string,
  payload: {
    note?: string;
    latitude?: number;
    longitude?: number;
    photoUrl?: string;
  },
): Promise<DriverRoute> {
  return request<DriverRoute>(`/route-stops/${stopId}/proof`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
