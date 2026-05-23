import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import DeleteRouteButton from '../components/DeleteRouteButton'
import AssignRoutePanel from '../components/AssignRoutePanel'
import RouteOptimizationResult from '../components/RouteOptimizationResult'
import PageToolbar from '../components/PageToolbar'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import {
  getActiveRoutes,
  getRoutesPendingDriverAssignment,
  routeDetailToJobShape,
} from '../lib/routes'
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

function routeOptionLabel(route: RouteDetail): string {
  const date = route.plannedDate.slice(0, 10)
  const vehicle = route.vehicle?.name
  const driver = route.driver?.name
  const meta = [vehicle, driver].filter(Boolean).join(' · ')
  return meta
    ? `${date} · ${meta} · ${route.stops.length} stopp`
    : `${date} · ${route.stops.length} stopp`
}

export default function RoutesPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const navigationState = location.state as RoutesPageState | null
  const [routeSummary, setRouteSummary] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [reoptimizing, setReoptimizing] = useState(false)

  const { data: routes, isLoading, reload } = useAsync(() => api.listRoutes(), [])
  const { data: drivers } = useAsync(() => api.listDrivers(), [])

  const activeRoutes = getActiveRoutes(routes ?? [])
  const pendingRoutes = getRoutesPendingDriverAssignment(activeRoutes)

  const navigationRouteId = navigationState?.route.routeId
  const navigationRoute = navigationRouteId
    ? activeRoutes.find((route) => route.id === navigationRouteId)
    : undefined

  const defaultPending = pendingRoutes[0]
  const defaultActive = defaultPending ?? activeRoutes[0]

  const activeRouteDetail =
    navigationRoute ??
    defaultActive ??
    null

  const active = activeRouteDetail
    ? routeDetailToJobShape(activeRouteDetail)
    : null

  const routeDetail = activeRouteDetail
  const needsDriverConfirmation = routeDetail?.status === 'PLANNED'
  const pendingIndex = routeDetail
    ? pendingRoutes.findIndex((route) => route.id === routeDetail.id)
    : -1

  async function advanceAfterAssignment() {
    const refreshed = await reload({ silent: true })
    const nextPending = getRoutesPendingDriverAssignment(
      getActiveRoutes(refreshed ?? []),
    )

    if (nextPending.length > 0) {
      navigate('/routes', {
        state: routeDetailToJobShape(nextPending[0]),
        replace: true,
      })
      return
    }

    navigate('/routes', { replace: true, state: null })
  }

  if (isLoading) {
    return (
      <div className="page-content">
        <p className="page-muted">Laster ruter…</p>
      </div>
    )
  }

  if (activeRoutes.length === 0) {
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

  if (pendingRoutes.length === 0 && !navigationRoute) {
    return (
      <div className="page-content">
        <PageToolbar
          title="Ruter"
          description="Alle planlagte ruter er bekreftet."
        />
        <div className="assign-route-panel__success" role="status">
          Alle sjåfører er bekreftet for {activeRoutes.length}{' '}
          {activeRoutes.length === 1 ? 'rute' : 'ruter'}.
        </div>
        <p className="page-muted" style={{ marginTop: 16 }}>
          <Link to="/map" className="btn-secondary">
            Vis på kart
          </Link>
          {' · '}
          <Link to="/deliveries">Ny optimalisering</Link>
        </p>
      </div>
    )
  }

  if (!active?.route || !routeDetail) {
    return (
      <div className="page-content">
        <p className="page-muted">Laster rute…</p>
      </div>
    )
  }

  return (
    <div className="page-content">
      <PageToolbar
        title="Ruter"
        description={
          pendingRoutes.length > 0
            ? `Bekreft sjåfør (${pendingRoutes.length} gjenstår)`
            : 'Planlagte kjøreruter.'
        }
        action={
          <Link to="/map" className="btn-secondary">
            Vis på kart
          </Link>
        }
      />

      {pendingRoutes.length > 1 ? (
        <div className="filter-bar">
          <label>
            Velg rute
            <select
              value={active.route.routeId}
              onChange={(e) => {
                const picked = pendingRoutes.find((r) => r.id === e.target.value)
                if (picked) {
                  navigate('/routes', {
                    state: routeDetailToJobShape(picked),
                    replace: true,
                  })
                }
              }}
            >
              {pendingRoutes.map((r, index) => (
                <option key={r.id} value={r.id}>
                  {index + 1}. {routeOptionLabel(r)}
                </option>
              ))}
            </select>
          </label>
          {pendingIndex >= 0 ? (
            <span className="page-muted">
              Rute {pendingIndex + 1} av {pendingRoutes.length}
            </span>
          ) : null}
        </div>
      ) : pendingRoutes.length === 1 ? (
        <p className="page-muted">
          Rute 1 av 1 · {routeOptionLabel(pendingRoutes[0])}
        </p>
      ) : null}

      {needsDriverConfirmation ? (
        <AssignRoutePanel
          key={routeDetail.id}
          route={routeDetail}
          drivers={drivers ?? []}
          onAssigned={advanceAfterAssignment}
        />
      ) : null}

      <RouteOptimizationResult
        job={active.job.id ? active.job : undefined}
        route={active.route}
        routeDetail={routeDetail}
        drivers={drivers ?? []}
        deliveries={
          routeDetail.stops.map((s) => ({
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
          }))
        }
        vehicle={
          routeDetail.vehicle
            ? {
                id: routeDetail.vehicle.id,
                organizationId: routeDetail.organizationId,
                depotId: null,
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

      {routeDetail.status === 'IN_PROGRESS' && (
        <div className="route-actions">
          <button
            type="button"
            className="btn-secondary"
            disabled={reoptimizing}
            onClick={async () => {
              setReoptimizing(true)
              setActionError(null)
              try {
                await api.reoptimizeRoute(routeDetail.id)
                await reload()
              } catch (err) {
                setActionError(
                  err instanceof ApiError ? err.message : 'Re-opt feilet',
                )
              } finally {
                setReoptimizing(false)
              }
            }}
          >
            {reoptimizing ? 'Optimaliserer…' : 'Re-optimaliser gjenværende'}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={async () => {
              setActionError(null)
              try {
                const summary = await api.generateRouteSummary(routeDetail.id)
                setRouteSummary(summary.summary)
              } catch (err) {
                setActionError(
                  err instanceof ApiError ? err.message : 'Sammendrag feilet',
                )
              }
            }}
          >
            Generer sammendrag
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => void api.downloadRoutePdf(routeDetail.id)}
          >
            Last ned PDF
          </button>
        </div>
      )}

      {routeSummary && (
        <div className="route-summary-box">
          <h3>Rutesammendrag</h3>
          <p>{routeSummary}</p>
        </div>
      )}

      {actionError && <p className="form-error">{actionError}</p>}

      <p className="page-muted route-empty__back">
        {routeDetail.status !== 'IN_PROGRESS' ? (
          <>
            <DeleteRouteButton
              routeId={routeDetail.id}
              routeLabel={routeOptionLabel(routeDetail)}
              onDeleted={async () => {
                await reload()
                await advanceAfterAssignment()
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
