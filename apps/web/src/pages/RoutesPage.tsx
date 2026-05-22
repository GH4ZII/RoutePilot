import { Link, useLocation, useNavigate } from 'react-router-dom'
import RouteOptimizationResult from '../components/RouteOptimizationResult'
import PageToolbar from '../components/PageToolbar'
import * as api from '../lib/api'
import { useAsync } from '../lib/useAsync'
import type {
  OptimizationJob,
  OptimizationRouteResult,
  RouteDetail,
} from '../types/domain'

export type RoutesPageState = {
  job: OptimizationJob
  route: OptimizationRouteResult
}

function routeDetailToJobShape(
  route: RouteDetail,
): { job: OptimizationJob; route: OptimizationRouteResult } {
  return {
    job: {
      id: '',
      organizationId: route.organizationId,
      status: 'COMPLETED',
      objective: 'MINIMIZE_TOTAL_TIME',
      plannedDate: route.plannedDate.slice(0, 10),
      request: {
        plannedDate: route.plannedDate.slice(0, 10),
        vehicleIds: route.vehicleId ? [route.vehicleId] : [],
        deliveryIds: route.stops.map((s) => s.delivery.id),
      },
      result: null,
      errorMessage: null,
      startedAt: null,
      completedAt: null,
      createdAt: route.createdAt,
      updatedAt: route.updatedAt,
    },
    route: {
      routeId: route.id,
      driverId: route.driverId,
      vehicleId: route.vehicleId ?? '',
      totalDistanceMeters: route.totalDistanceMeters ?? 0,
      totalDurationSeconds: route.totalDurationSeconds ?? 0,
      stops: route.stops.map((s) => ({
        deliveryId: s.delivery.id,
        order: s.stopOrder,
        estimatedArrival: s.estimatedArrival,
      })),
    },
  }
}

export default function RoutesPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const navigationState = location.state as RoutesPageState | null

  const { data: routes, isLoading } = useAsync(() => api.listRoutes(), [])

  const fromApi = routes?.[0]
  const active = navigationState ?? (fromApi ? routeDetailToJobShape(fromApi) : null)

  const routeDetail =
    routes?.find((r) => r.id === active?.route.routeId) ?? fromApi

  if (isLoading) {
    return (
      <div className="page-content">
        <p className="page-muted">Laster ruter…</p>
      </div>
    )
  }

  if (!active?.route) {
    return (
      <div className="page-content">
        <PageToolbar
          title="Ruter"
          description="Planlagte kjøreruter etter optimalisering."
        />
        <div className="route-empty">
          <p>Ingen rute vist ennå.</p>
          <p className="page-muted">
            Gå til Leveranser, velg ventende leveranser og trykk{' '}
            <strong>Optimaliser rute</strong>.
          </p>
          <Link to="/deliveries" className="btn-primary">
            Gå til leveranser
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content">
      <PageToolbar
        title="Ruter"
        description="Siste planlagte rute."
        action={
          <Link to="/map" className="btn-secondary">
            Vis på kart
          </Link>
        }
      />

      {routes && routes.length > 1 ? (
        <div className="filter-bar">
          <label>
            Velg rute
            <select
              value={active.route.routeId}
              onChange={(e) => {
                const picked = routes.find((r) => r.id === e.target.value)
                if (picked) {
                  navigate('/routes', {
                    state: routeDetailToJobShape(picked),
                    replace: true,
                  })
                }
              }}
            >
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.plannedDate.slice(0, 10)} · {r.stops.length} stopp
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      <RouteOptimizationResult
        job={active.job.id ? active.job : undefined}
        route={active.route}
        routeDetail={routeDetail}
        deliveries={
          routeDetail?.stops.map((s) => ({
            id: s.delivery.id,
            organizationId: routeDetail.organizationId,
            customerName: s.delivery.customerName,
            phone: null,
            address: s.delivery.address,
            latitude: s.delivery.latitude,
            longitude: s.delivery.longitude,
            weightKg: 0,
            volumeM3: null,
            priority: s.delivery.priority,
            deadline: null,
            timeWindowStart: null,
            timeWindowEnd: null,
            notes: null,
            status: s.delivery.status,
            createdAt: routeDetail.createdAt,
            updatedAt: routeDetail.updatedAt,
          })) ?? []
        }
        vehicle={
          routeDetail?.vehicle
            ? {
                id: routeDetail.vehicle.id,
                organizationId: routeDetail.organizationId,
                name: routeDetail.vehicle.name,
                registrationNumber: '',
                startAddress: routeDetail.vehicle.startAddress,
                endAddress: routeDetail.vehicle.endAddress,
                maxWeightKg: 0,
                maxVolumeM3: 0,
                startLatitude: routeDetail.vehicle.startLatitude,
                startLongitude: routeDetail.vehicle.startLongitude,
                endLatitude: routeDetail.vehicle.endLatitude,
                endLongitude: routeDetail.vehicle.endLongitude,
                status: 'AVAILABLE',
                createdAt: routeDetail.createdAt,
                updatedAt: routeDetail.updatedAt,
              }
            : undefined
        }
      />

      <p className="page-muted route-empty__back">
        <Link to="/deliveries">Ny optimalisering</Link>
        {' · '}
        <button
          type="button"
          className="btn-link"
          onClick={() => navigate(-1)}
        >
          Tilbake
        </button>
      </p>
    </div>
  )
}
