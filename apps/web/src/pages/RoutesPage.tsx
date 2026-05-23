import { Link, useLocation, useNavigate } from 'react-router-dom'
import DeleteRouteButton from '../components/DeleteRouteButton'
import AssignRoutePanel from '../components/AssignRoutePanel'
import RouteOptimizationResult from '../components/RouteOptimizationResult'
import PageToolbar from '../components/PageToolbar'
import * as api from '../lib/api'
import { getActiveRoutes, routeDetailToJobShape } from '../lib/routes'
import { useAsync } from '../lib/useAsync'
import type {
  OptimizationJob,
  OptimizationRouteResult,
} from '../types/domain'

export type RoutesPageState = {
  job: OptimizationJob
  route: OptimizationRouteResult
}

export default function RoutesPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const navigationState = location.state as RoutesPageState | null

  const { data: routes, isLoading, reload } = useAsync(() => api.listRoutes(), [])
  const { data: drivers } = useAsync(() => api.listDrivers(), [])

  const activeRoutes = getActiveRoutes(routes ?? [])

  const fromApi = activeRoutes[0]
  const navigationActive =
    navigationState &&
    activeRoutes.some((route) => route.id === navigationState.route.routeId)
      ? navigationState
      : null
  const active =
    navigationActive ?? (fromApi ? routeDetailToJobShape(fromApi) : null)

  const routeDetail =
    activeRoutes.find((r) => r.id === active?.route.routeId) ?? fromApi

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
            Flyt: opprett leveranser → optimaliser ruter → tildel sjåfør her →
            sjåfør kjører i mobilappen.
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

      {activeRoutes.length > 1 ? (
        <div className="filter-bar">
          <label>
            Velg rute
            <select
              value={active.route.routeId}
              onChange={(e) => {
                const picked = activeRoutes.find((r) => r.id === e.target.value)
                if (picked) {
                  navigate('/routes', {
                    state: routeDetailToJobShape(picked),
                    replace: true,
                  })
                }
              }}
            >
              {activeRoutes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.plannedDate.slice(0, 10)} · {r.stops.length} stopp
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      {routeDetail ? (
        <AssignRoutePanel
          route={routeDetail}
          drivers={drivers ?? []}
          onAssigned={(updated) => {
            reload()
            navigate('/routes', {
              state: routeDetailToJobShape(updated),
              replace: true,
            })
          }}
        />
      ) : null}

      <RouteOptimizationResult
        job={active.job.id ? active.job : undefined}
        route={active.route}
        routeDetail={routeDetail}
        drivers={drivers ?? []}
        deliveries={
          routeDetail?.stops.map((s) => ({
            id: s.delivery.id,
            organizationId: routeDetail.organizationId,
            customerName: s.delivery.customerName,
            phone: s.delivery.phone,
            address: s.delivery.address,
            latitude: s.delivery.latitude,
            longitude: s.delivery.longitude,
            weightKg: s.delivery.weightKg,
            volumeM3: s.delivery.volumeM3,
            priority: s.delivery.priority,
            deadline: null,
            timeWindowStart: null,
            timeWindowEnd: null,
            notes: s.delivery.notes,
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
        {routeDetail && routeDetail.status !== 'IN_PROGRESS' ? (
          <>
            <DeleteRouteButton
              routeId={routeDetail.id}
              routeLabel={`${routeDetail.plannedDate.slice(0, 10)} · ${routeDetail.stops.length} stopp`}
              onDeleted={async () => {
                await reload()
                navigate('/routes', { replace: true, state: null })
              }}
            />
            {' · '}
          </>
        ) : null}
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
