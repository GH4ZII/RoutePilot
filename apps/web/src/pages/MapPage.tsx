import { useEffect, useMemo, useState } from 'react'
import DeliveryMap, { type DepotPoint, type RouteLine } from '../components/DeliveryMap'
import PageToolbar from '../components/PageToolbar'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import { formatDateTime } from '../lib/format'
import { fetchDrivingRouteGeometry } from '../lib/osrm-route'
import { buildRouteWaypoints } from '../lib/route-waypoints'
import {
  DELIVERY_PRIORITY_LABELS,
  DELIVERY_STATUS_LABELS,
  deliveryPriorityClass,
  deliveryStatusClass,
} from '../lib/labels'
import { ROUTE_LINE_COLOR } from '../lib/map-colors'
import { getActiveRoutes, getArchivedDeliveryIds } from '../lib/routes'
import { useAsync } from '../lib/useAsync'
import type { Delivery, DeliveryStatus, RouteDetail, Vehicle } from '../types/domain'

const STATUSES: DeliveryStatus[] = [
  'PENDING',
  'ASSIGNED',
  'IN_PROGRESS',
  'DELIVERED',
  'FAILED',
  'CANCELLED',
]

function buildDepots(vehicles: Vehicle[]): DepotPoint[] {
  const seen = new Set<string>()
  const depots: DepotPoint[] = []

  for (const vehicle of vehicles) {
    const key = `${vehicle.startLatitude},${vehicle.startLongitude}`
    if (!seen.has(key)) {
      seen.add(key)
      depots.push({
        id: `start-${vehicle.id}`,
        label: vehicle.name,
        address: vehicle.startAddress,
        latitude: vehicle.startLatitude,
        longitude: vehicle.startLongitude,
      })
    }

    const endKey = `${vehicle.endLatitude},${vehicle.endLongitude}`
    if (endKey !== key && !seen.has(endKey)) {
      seen.add(endKey)
      depots.push({
        id: `end-${vehicle.id}`,
        label: `${vehicle.name} (retur)`,
        address: vehicle.endAddress,
        latitude: vehicle.endLatitude,
        longitude: vehicle.endLongitude,
      })
    }
  }

  return depots
}

export default function MapPage() {
  const { user } = useAuth()
  const canUpdateStatus =
    user?.role === 'ADMIN' || user?.role === 'DISPATCHER'
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | ''>('')
  const [selected, setSelected] = useState<Delivery | null>(null)
  const [selectedRouteId, setSelectedRouteId] = useState('')
  const [routeGeometry, setRouteGeometry] = useState<[number, number][]>([])
  const [geometryError, setGeometryError] = useState<string | null>(null)
  const [geometryLoading, setGeometryLoading] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [statusError, setStatusError] = useState<string | null>(null)

  const {
    data: deliveries,
    error: deliveriesError,
    isLoading: deliveriesLoading,
    reload: reloadDeliveries,
  } = useAsync(
    () => api.listDeliveries(statusFilter || undefined),
    [statusFilter],
  )

  const { data: vehicles } = useAsync(() => api.listVehicles(), [])
  const { data: routes, error: routesError } = useAsync(() => api.listRoutes(), [])

  const activeRoutes = useMemo(
    () => getActiveRoutes(routes ?? []),
    [routes],
  )

  const archivedDeliveryIds = useMemo(
    () => getArchivedDeliveryIds(routes ?? []),
    [routes],
  )

  const visibleDeliveries = useMemo(
    () =>
      (deliveries ?? []).filter(
        (delivery) => !archivedDeliveryIds.has(delivery.id),
      ),
    [deliveries, archivedDeliveryIds],
  )

  const depots = useMemo(
    () => (vehicles ? buildDepots(vehicles) : []),
    [vehicles],
  )

  const selectedRoute: RouteDetail | undefined = useMemo(() => {
    if (!activeRoutes.length) return undefined
    if (selectedRouteId) {
      return activeRoutes.find((r) => r.id === selectedRouteId) ?? activeRoutes[0]
    }
    return activeRoutes[0]
  }, [activeRoutes, selectedRouteId])

  useEffect(() => {
    if (activeRoutes.length && !selectedRouteId) {
      setSelectedRouteId(activeRoutes[0].id)
    }
  }, [activeRoutes, selectedRouteId])

  useEffect(() => {
    if (
      selectedRouteId &&
      activeRoutes.length &&
      !activeRoutes.some((route) => route.id === selectedRouteId)
    ) {
      setSelectedRouteId(activeRoutes[0].id)
    }
  }, [activeRoutes, selectedRouteId])

  async function updateDeliveryStatus(status: 'DELIVERED' | 'CANCELLED') {
    if (!selected) return

    setStatusUpdating(true)
    setStatusError(null)
    try {
      const updated = await api.updateDelivery(selected.id, { status })
      setSelected(updated)
      await reloadDeliveries()
    } catch (err) {
      setStatusError(
        err instanceof ApiError ? err.message : 'Kunne ikke oppdatere status',
      )
    } finally {
      setStatusUpdating(false)
    }
  }

  useEffect(() => {
    if (!selectedRoute) {
      setRouteGeometry([])
      return
    }

    let cancelled = false
    setGeometryLoading(true)
    setGeometryError(null)

    fetchDrivingRouteGeometry(buildRouteWaypoints(selectedRoute))
      .then((geometry) => {
        if (!cancelled) {
          setRouteGeometry(geometry)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGeometryError('Kunne ikke hente rutegeometri fra OSRM')
          setRouteGeometry(
            buildRouteWaypoints(selectedRoute).map((p) => [
              p.latitude,
              p.longitude,
            ]),
          )
        }
      })
      .finally(() => {
        if (!cancelled) {
          setGeometryLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [selectedRoute])

  const routeLines: RouteLine[] = useMemo(() => {
    if (!selectedRoute || routeGeometry.length < 2) {
      return []
    }
    return [{ id: selectedRoute.id, positions: routeGeometry }]
  }, [selectedRoute, routeGeometry])

  const error = deliveriesError ?? routesError

  return (
    <div className="page-content map-page">
      <PageToolbar
        title="Kart"
        description="Leveranser, depot og kjørerute. Klikk en markør for detaljer."
      />

      <div className="filter-bar map-page-filters">
        <label>
          Filtrer leveringsstatus
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as DeliveryStatus | '')
              setSelected(null)
            }}
          >
            <option value="">Alle</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {DELIVERY_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Vis rute
          <select
            value={selectedRouteId}
            onChange={(e) => setSelectedRouteId(e.target.value)}
            disabled={!activeRoutes.length}
          >
            {!activeRoutes.length ? (
              <option value="">Ingen aktive ruter</option>
            ) : (
              activeRoutes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.plannedDate.slice(0, 10)} · {r.stops.length} stopp ·{' '}
                  {r.status}
                </option>
              ))
            )}
          </select>
        </label>
        <div className="map-legend">
          <span className="map-legend-item">
            <span
              className="map-legend-dot"
              style={{ background: '#7c3aed' }}
            />
            Depot
          </span>
          <span className="map-legend-item">
            <span
              className="map-legend-dot"
              style={{ background: '#64748b' }}
            />
            Leveranse
          </span>
          <span className="map-legend-item">
            <span
              className="map-legend-line"
              style={{ background: ROUTE_LINE_COLOR }}
            />
            Kjørerute
          </span>
        </div>
      </div>

      {geometryLoading ? (
        <p className="page-muted">Laster rute på kart…</p>
      ) : null}
      {geometryError ? (
        <p className="page-error" role="alert">{geometryError}</p>
      ) : null}
      {error ? <p className="page-error" role="alert">{error}</p> : null}

      {deliveriesLoading ? (
        <p className="page-muted">Laster kartdata…</p>
      ) : (
        <div className="map-layout">
          <DeliveryMap
            className="map-layout-map"
            deliveries={visibleDeliveries}
            depots={depots}
            routeLines={routeLines}
            selectedDeliveryId={selected?.id ?? null}
            onSelectDelivery={setSelected}
          />

          <aside className="map-detail-panel" aria-label="Leveringsdetaljer">
            {selected ? (
              <>
                <h2>{selected.customerName}</h2>
                <p className="map-detail-address">{selected.address}</p>

                <dl className="map-detail-list">
                  <div>
                    <dt>Status</dt>
                    <dd>
                      <StatusBadge
                        label={DELIVERY_STATUS_LABELS[selected.status]}
                        className={deliveryStatusClass(selected.status)}
                      />
                    </dd>
                  </div>
                  <div>
                    <dt>Prioritet</dt>
                    <dd>
                      <StatusBadge
                        label={DELIVERY_PRIORITY_LABELS[selected.priority]}
                        className={deliveryPriorityClass(selected.priority)}
                      />
                    </dd>
                  </div>
                  {selected.phone ? (
                    <div>
                      <dt>Telefon</dt>
                      <dd>{selected.phone}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>Vekt</dt>
                    <dd>{selected.weightKg} kg</dd>
                  </div>
                  {selected.volumeM3 != null ? (
                    <div>
                      <dt>Volum</dt>
                      <dd>{selected.volumeM3} m³</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>Deadline</dt>
                    <dd>{formatDateTime(selected.deadline)}</dd>
                  </div>
                  {selected.notes ? (
                    <div>
                      <dt>Notater</dt>
                      <dd>{selected.notes}</dd>
                    </div>
                  ) : null}
                </dl>

                {canUpdateStatus &&
                selected.status !== 'DELIVERED' &&
                selected.status !== 'CANCELLED' ? (
                  <div className="map-detail-actions">
                    <p className="field-hint">Oppdater leveringsstatus</p>
                    <button
                      type="button"
                      className="btn-primary"
                      disabled={statusUpdating}
                      onClick={() => updateDeliveryStatus('DELIVERED')}
                    >
                      Marker som levert
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      disabled={statusUpdating}
                      onClick={() => updateDeliveryStatus('CANCELLED')}
                    >
                      Kansellér
                    </button>
                    {statusError ? (
                      <p className="page-error" role="alert">
                        {statusError}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <button
                  type="button"
                  className="btn-secondary map-detail-close"
                  onClick={() => setSelected(null)}
                >
                  Lukk
                </button>
              </>
            ) : selectedRoute ? (
              <>
                <h2>Valgt rute</h2>
                <p className="page-muted">
                  {selectedRoute.stops.length} leveringsstopp ·{' '}
                  {selectedRoute.status}
                </p>
                <ol className="map-route-stop-list">
                  {selectedRoute.stops.map((stop) => (
                    <li key={stop.id}>
                      <span className="route-stops-list__order">
                        {stop.stopOrder}
                      </span>
                      <span>{stop.delivery.customerName}</span>
                    </li>
                  ))}
                </ol>
                <p className="field-hint">
                  Den lilla streken følger veinettet (OSRM).
                </p>
              </>
            ) : (
              <p className="page-muted map-detail-empty">
                Klikk en leveranse på kartet for detaljer.
                {(visibleDeliveries.length ?? 0) === 0
                  ? ' Ingen leveranser å vise med valgt filter.'
                  : ' Optimaliser en rute under Leveranser for å se strek her.'}
              </p>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}
