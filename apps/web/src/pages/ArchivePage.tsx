import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DeleteRouteButton from '../components/DeleteRouteButton'
import PageToolbar from '../components/PageToolbar'
import RouteOptimizationResult from '../components/RouteOptimizationResult'
import StatusBadge from '../components/StatusBadge'
import * as api from '../lib/api'
import { formatDateTime } from '../lib/format'
import { ROUTE_STATUS_LABELS, routeStatusClass } from '../lib/labels'
import { routeDetailToJobShape } from '../lib/routes'
import { useAsync } from '../lib/useAsync'
import type { RouteDetail } from '../types/domain'

function routeToDeliveries(route: RouteDetail) {
  return route.stops.map((s) => ({
    id: s.delivery.id,
    organizationId: route.organizationId,
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
    createdAt: route.createdAt,
    updatedAt: route.updatedAt,
  }))
}

export default function ArchivePage() {
  const navigate = useNavigate()
  const { data: routes, isLoading, reload } = useAsync(
    () => api.listRoutes('COMPLETED'),
    [],
  )
  const { data: drivers } = useAsync(() => api.listDrivers(), [])
  const [selectedRouteId, setSelectedRouteId] = useState('')

  useEffect(() => {
    if (routes?.length && !routes.some((route) => route.id === selectedRouteId)) {
      setSelectedRouteId(routes[0]?.id ?? '')
    }
  }, [routes, selectedRouteId])

  const selectedRoute =
    routes?.find((route) => route.id === selectedRouteId) ?? routes?.[0]

  if (isLoading) {
    return (
      <div className="page-content">
        <p className="page-muted">Laster arkiv…</p>
      </div>
    )
  }

  if (!routes?.length || !selectedRoute) {
    return (
      <div className="page-content">
        <PageToolbar
          title="Arkiv"
          description="Fullførte ruter lagres her etter kjøring."
        />
        <div className="route-empty">
          <p>Ingen fullførte ruter ennå.</p>
          <p className="page-muted">
            Når en sjåfør fullfører en rute i mobilappen, flyttes den hit
            automatisk.
          </p>
        </div>
      </div>
    )
  }

  const active = routeDetailToJobShape(selectedRoute)

  return (
    <div className="page-content">
      <PageToolbar
        title="Arkiv"
        description="Fullførte ruter. Aktive ruter vises under Ruter og Kart."
      />

      {routes.length > 1 ? (
        <div className="filter-bar">
          <label>
            Velg rute
            <select
              value={selectedRoute.id}
              onChange={(e) => setSelectedRouteId(e.target.value)}
            >
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.plannedDate.slice(0, 10)} · {route.stops.length} stopp
                  {route.driver ? ` · ${route.driver.name}` : ''}
                </option>
              ))}
            </select>
          </label>
        </div>
      ) : null}

      <div className="archive-route-meta">
        <StatusBadge
          label={ROUTE_STATUS_LABELS[selectedRoute.status]}
          className={routeStatusClass(selectedRoute.status)}
        />
        {selectedRoute.finishedAt ? (
          <p className="page-muted">
            Fullført {formatDateTime(selectedRoute.finishedAt)}
          </p>
        ) : null}
        <DeleteRouteButton
          routeId={selectedRoute.id}
          routeLabel={`${selectedRoute.plannedDate.slice(0, 10)} · ${selectedRoute.stops.length} stopp`}
          confirmMessage={`Slette ruten ${selectedRoute.plannedDate.slice(0, 10)} · ${selectedRoute.stops.length} stopp fra arkivet? Dette kan ikke angres.`}
          onDeleted={reload}
        />
      </div>

      <RouteOptimizationResult
        route={active.route}
        routeDetail={selectedRoute}
        deliveries={routeToDeliveries(selectedRoute)}
        vehicle={
          selectedRoute.vehicle
            ? {
                id: selectedRoute.vehicle.id,
                organizationId: selectedRoute.organizationId,
                name: selectedRoute.vehicle.name,
                registrationNumber: '',
                startAddress: selectedRoute.vehicle.startAddress,
                endAddress: selectedRoute.vehicle.endAddress,
                maxWeightKg: 0,
                maxVolumeM3: 0,
                startLatitude: selectedRoute.vehicle.startLatitude,
                startLongitude: selectedRoute.vehicle.startLongitude,
                endLatitude: selectedRoute.vehicle.endLatitude,
                endLongitude: selectedRoute.vehicle.endLongitude,
                status: 'AVAILABLE',
                createdAt: selectedRoute.createdAt,
                updatedAt: selectedRoute.updatedAt,
              }
            : undefined
        }
        drivers={drivers ?? []}
      />

      <p className="page-muted route-empty__back">
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
