import type { QueryClient } from '@tanstack/react-query';

import * as api from '@/lib/api';
import type { DriverRoute } from '@/types/routes';

export const MY_ROUTES_QUERY_KEY = ['my-routes'] as const;

const DEFAULT_INTERVAL_MS = 45_000;

/** Updates React Query cache without triggering a visible refetch / scroll reset. */
export async function syncMyRoutes(
  queryClient: QueryClient,
): Promise<DriverRoute[] | null> {
  try {
    const routes = await api.getMyRoutes();
    queryClient.setQueryData<DriverRoute[]>(MY_ROUTES_QUERY_KEY, routes);
    return routes;
  } catch {
    return null;
  }
}

export function startMyRoutesBackgroundSync(
  queryClient: QueryClient,
  options?: {
    intervalMs?: number;
    isEnabled?: () => boolean;
  },
): () => void {
  const intervalMs = options?.intervalMs ?? DEFAULT_INTERVAL_MS;
  const isEnabled = options?.isEnabled ?? (() => true);

  const tick = () => {
    if (!isEnabled()) return;
    void syncMyRoutes(queryClient);
  };

  const id = setInterval(tick, intervalMs);
  return () => clearInterval(id);
}
