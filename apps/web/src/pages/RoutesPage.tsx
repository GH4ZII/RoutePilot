import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import DeleteRouteButton from '../components/DeleteRouteButton'
import AssignRoutePanel from '../components/AssignRoutePanel'
import RouteOptimizationResult from '../components/RouteOptimizationResult'
import PageToolbar from '../components/PageToolbar'
import StatusBadge from '../components/StatusBadge'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import { ROUTE_STATUS_LABELS, routeStatusClass } from '../lib/labels'
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
  const [selectedRouteId, setSelectedRouteId] = useState('')
  const [actionError, setActionError] = useState<string | null>(null)
  const [reoptimizing, setReoptimizing] = useState(false)

  const { data: routes, isLoading, reload } = useAsync(() => api.listRoutes(), [])
  const { data: drivers } = useAsync(() => api.listDrivers(), [])

  const activeRoutes = getActiveRoutes(routes ?? [])
  const pendingRoutes = getRoutesPendingDriverAssignment(activeRoutes)

  const navigationRouteId = navigationState?.route.routeId

  useEffect(() => {
    if (!activeRoutes.length) {
      setSelectedRouteId('')
      return
    }

    const fromNavigation =
      navigationRouteId &&
      activeRoutes.some((route) => route.id === navigationRouteId)
        ? navigationRouteId
        : null

    setSelectedRouteId((prev) => {
      if (prev && activeRoutes.some((route) => route.id === prev)) {
        return prev
      }
      return (
        fromNavigation ??
        pendingRoutes[0]?.id ??
        activeRoutes[0]?.id ??
        ''
      )
    })
  }, [activeRoutes, navigationRouteId, pendingRoutes])

  const routeDetail =
    activeRoutes.find((route) => route.id === selectedRouteId) ??
    activeRoutes[0] ??
    null

  const active = routeDetail ? routeDetailToJobShape(routeDetail) : null

  const showDriverPanel =
    routeDetail?.status === 'PLANNED' ||
    routeDetail?.status === 'ASSIGNED' ||
    routeDetail?.status === 'IN_PROGRESS'
  const pendingIndex = routeDetail
    ? pendingRoutes.findIndex((route) => route.id === routeDetail.id)
    : -1

  async function selectRouteAfterChange(nextRoutes: RouteDetail[]) {
    const nextPending = getRoutesPendingDriverAssignment(nextRoutes)
    const nextId = nextPending[0]?.id ?? nextRoutes[0]?.id ?? ''
    setSelectedRouteId(nextId)
    navigate('/routes', { replace: true, state: null })
  }

  async function handleRouteDeleted() {
    const refreshed = await reload({ silent: true })
    await selectRouteAfterChange(getActiveRoutes(refreshed ?? []))
  }

  async function advanceAfterAssignment() {
    const refreshed = await reload({ silent: true })
    const nextRoutes = getActiveRoutes(refreshed ?? [])
    const updated = nextRoutes.find((route) => route.id === selectedRouteId)
    if (updated?.status === 'IN_PROGRESS') {
      return
    }
    await selectRouteAfterChange(nextRoutes)
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

  if (!active?.route || !routeDetail) {
    return (
      <div className="page-content">
        <p className="page-muted">Laster rute…</p>
      </div>
    )
  }

  const toolbarDescription =
    pendingRoutes.length > 0
      ? `Bekreft sjåfør (${pendingRoutes.length} gjenstår)`
      : `${activeRoutes.length} ${activeRoutes.length === 1 ? 'rute' : 'ruter'}`

  return (
    <div className="page-content">
      <PageToolbar
        title="Ruter"
        description={toolbarDescription}
        action={
          <>
            <DeleteRouteButton
              routeId={routeDetail.id}
              routeLabel={routeOptionLabel(routeDetail)}
              className="btn-secondary"
              inProgress={routeDetail.status === 'IN_PROGRESS'}
              onDeleted={handleRouteDeleted}
            />
            <Link to="/map" className="btn-secondary">
              Vis på kart
            </Link>
          </>
        }
      />

      {activeRoutes.length > 1 ? (
        <div className="filter-bar">
          <label>
            Velg rute
            <select
              value={routeDetail.id}
              onChange={(e) => setSelectedRouteId(e.target.value)}
            >
              {activeRoutes.map((route) => (
                <option key={route.id} value={route.id}>
                  {routeOptionLabel(route)}
                </option>
              ))}
            </select>
          </label>
          {pendingRoutes.length > 0 && pendingIndex >= 0 ? (
            <span className="page-muted">
              {pendingIndex + 1} av {pendingRoutes.length} venter bekreftelse
            </span>
          ) : (
            <StatusBadge
              label={ROUTE_STATUS_LABELS[routeDetail.status]}
              className={routeStatusClass(routeDetail.status)}
            />
          )}
        </div>
      ) : (
        <div className="routes-page-meta">
          <StatusBadge
            label={ROUTE_STATUS_LABELS[routeDetail.status]}
            className={routeStatusClass(routeDetail.status)}
          />
          <span className="page-muted">{routeOptionLabel(routeDetail)}</span>
        </div>
      )}

      {showDriverPanel ? (
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
            onClick={() => void api.downloadRoutePdf(routeDetail.id)}
          >
            Last ned PDF
          </button>
        </div>
      )}

      {actionError && <p className="form-error">{actionError}</p>}

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
