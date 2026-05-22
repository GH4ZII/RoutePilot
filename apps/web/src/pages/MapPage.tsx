import { useEffect, useMemo, useState } from 'react'
import DeliveryMap, { type DepotPoint, type RouteLine } from '../components/DeliveryMap'
import PageToolbar from '../components/PageToolbar'
import StatusBadge from '../components/StatusBadge'
import * as api from '../lib/api'
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
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | ''>('')
  const [selected, setSelected] = useState<Delivery | null>(null)
  const [selectedRouteId, setSelectedRouteId] = useState('')
  const [routeGeometry, setRouteGeometry] = useState<[number, number][]>([])
  const [geometryError, setGeometryError] = useState<string | null>(null)
  const [geometryLoading, setGeometryLoading] = useState(false)

  const {
    data: deliveries,
    error: deliveriesError,
    isLoading: deliveriesLoading,
  } = useAsync(
    () => api.listDeliveries(statusFilter || undefined),
    [statusFilter],
  )

  const { data: vehicles } = useAsync(() => api.listVehicles(), [])
  const { data: routes, error: routesError } = useAsync(() => api.listRoutes(), [])

  const depots = useMemo(
    () => (vehicles ? buildDepots(vehicles) : []),
    [vehicles],
  )

  const selectedRoute: RouteDetail | undefined = useMemo(() => {
    if (!routes?.length) return undefined
    if (selectedRouteId) {
      return routes.find((r) => r.id === selectedRouteId) ?? routes[0]
    }
    return routes[0]
  }, [routes, selectedRouteId])

  useEffect(() => {
    if (routes?.length && !selectedRouteId) {
      setSelectedRouteId(routes[0].id)
    }
  }, [routes, selectedRouteId])

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
            disabled={!routes?.length}
          >
            {!routes?.length ? (
              <option value="">Ingen ruter lagret</option>
            ) : (
              routes.map((r) => (
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
            deliveries={deliveries ?? []}
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
                {(deliveries?.length ?? 0) === 0
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
