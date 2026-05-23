import { useCallback, useEffect, useMemo, useState } from 'react'
import DeliveryMap, {
  type DepotPoint,
  type NumberedStop,
  type RouteLine,
} from '../components/DeliveryMap'
import StatusBadge from '../components/StatusBadge'
import * as api from '../lib/api'
import { formatDateTime } from '../lib/format'
import {
  DASHBOARD_ALERT_LABELS,
  DELIVERY_STATUS_LABELS,
  deliveryStatusClass,
} from '../lib/labels'
import { LIVE_ROUTE_COLORS } from '../lib/map-colors'
import { fetchDrivingRouteGeometry } from '../lib/osrm-route'
import { buildLiveRouteWaypoints } from '../lib/route-waypoints'
import { useAsync } from '../lib/useAsync'
import type {
  DashboardAlert,
  Delivery,
  DeliveryPriority,
  LiveRoute,
} from '../types/domain'

const POLL_MS = 30_000

function formatDuration(seconds: number | null): string {
  if (seconds == null) return '—'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h} t ${m} min`
  return `${m} min`
}

function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`
  return `${meters} m`
}

function alertClass(alert: DashboardAlert): string {
  return alert.severity === 'error' ? 'alert-item--error' : 'alert-item--warning'
}

export default function DashboardPage() {
  const [visibleRouteIds, setVisibleRouteIds] = useState<Set<string>>(new Set())
  const [routeGeometries, setRouteGeometries] = useState<
    Record<string, [number, number][]>
  >({})

  const loadDashboard = useCallback(
    () =>
      Promise.all([
        api.getDashboardSummary(),
        api.getDashboardLiveRoutes(),
        api.getDashboardDeliveriesStatus(),
      ]).then(([summary, liveRoutes, deliveriesStatus]) => ({
        summary,
        liveRoutes,
        deliveriesStatus,
      })),
    [],
  )

  const { data, error, isLoading, reload } = useAsync(loadDashboard, [])

  useEffect(() => {
    const id = window.setInterval(() => reload(), POLL_MS)
    return () => window.clearInterval(id)
  }, [reload])

  const liveRoutes = useMemo(
    () => data?.liveRoutes ?? [],
    [data?.liveRoutes],
  )

  useEffect(() => {
    if (!liveRoutes.length) {
      setVisibleRouteIds(new Set())
      return
    }
    setVisibleRouteIds((prev) => {
      if (prev.size > 0) {
        const next = new Set<string>()
        for (const route of liveRoutes) {
          if (prev.has(route.id)) next.add(route.id)
        }
        if (next.size > 0) return next
      }
      return new Set(liveRoutes.map((r) => r.id))
    })
  }, [liveRoutes])

  useEffect(() => {
    if (!liveRoutes.length) {
      setRouteGeometries({})
      return
    }

    let cancelled = false

    async function loadGeometries() {
      const entries = await Promise.all(
        liveRoutes.map(async (route) => {
          const waypoints = buildLiveRouteWaypoints(route)
          if (waypoints.length < 2) {
            return [route.id, []] as const
          }
          try {
            const geometry = await fetchDrivingRouteGeometry(waypoints)
            return [route.id, geometry] as const
          } catch {
            return [
              route.id,
              waypoints.map((p) => [p.latitude, p.longitude] as [number, number]),
            ] as const
          }
        }),
      )
      if (!cancelled) {
        setRouteGeometries(Object.fromEntries(entries))
      }
    }

    loadGeometries()
    return () => {
      cancelled = true
    }
  }, [liveRoutes])

  const visibleRoutes = useMemo(
    () => liveRoutes.filter((r) => visibleRouteIds.has(r.id)),
    [liveRoutes, visibleRouteIds],
  )

  const routeLines: RouteLine[] = useMemo(() => {
    const lines: RouteLine[] = []
    visibleRoutes.forEach((route, index) => {
      const geometry = routeGeometries[route.id]
      if (!geometry || geometry.length < 2) return
      const color =
        LIVE_ROUTE_COLORS[index % LIVE_ROUTE_COLORS.length] ?? LIVE_ROUTE_COLORS[0]
      const driverName = route.driver?.name ?? 'Uten sjåfør'
      lines.push({
        id: route.id,
        positions: geometry,
        color,
        label: `${driverName} — ${route.vehicle?.name ?? 'Kjøretøy'}`,
      })
    })
    return lines
  }, [visibleRoutes, routeGeometries])

  const numberedStops: NumberedStop[] = useMemo(() => {
    const stops: NumberedStop[] = []
    visibleRoutes.forEach((route, routeIndex) => {
      const color =
        LIVE_ROUTE_COLORS[routeIndex % LIVE_ROUTE_COLORS.length] ??
        LIVE_ROUTE_COLORS[0]
      for (const stop of route.stops) {
        if (
          stop.status === 'COMPLETED' ||
          stop.status === 'SKIPPED'
        ) {
          continue
        }
        stops.push({
          id: stop.id,
          stopOrder: stop.stopOrder,
          latitude: stop.delivery.latitude,
          longitude: stop.delivery.longitude,
          label: stop.delivery.customerName,
          color,
        })
      }
    })
    return stops
  }, [visibleRoutes])

  const depots: DepotPoint[] = useMemo(() => {
    const seen = new Set<string>()
    const points: DepotPoint[] = []
    for (const route of visibleRoutes) {
      if (!route.vehicle) continue
      const key = `${route.vehicle.startLatitude},${route.vehicle.startLongitude}`
      if (!seen.has(key)) {
        seen.add(key)
        points.push({
          id: `depot-${route.vehicle.id}`,
          label: route.vehicle.name,
          address: 'Depot',
          latitude: route.vehicle.startLatitude,
          longitude: route.vehicle.startLongitude,
        })
      }
    }
    return points
  }, [visibleRoutes])

  const mapDeliveries: Delivery[] = useMemo(() => {
    const items: Delivery[] = []
    const seen = new Set<string>()
    for (const route of visibleRoutes) {
      for (const stop of route.stops) {
        if (seen.has(stop.delivery.id)) continue
        seen.add(stop.delivery.id)
        items.push({
          id: stop.delivery.id,
          organizationId: '',
          customerName: stop.delivery.customerName,
          phone: stop.delivery.phone,
          address: stop.delivery.address,
          latitude: stop.delivery.latitude,
          longitude: stop.delivery.longitude,
          weightKg: 0,
          volumeM3: null,
          priority: stop.delivery.priority as DeliveryPriority,
          deadline: null,
          timeWindowStart: null,
          timeWindowEnd: null,
          notes: null,
          status: stop.delivery.status,
          createdAt: '',
          updatedAt: '',
        })
      }
    }
    return items
  }, [visibleRoutes])

  function toggleRoute(routeId: string) {
    setVisibleRouteIds((prev) => {
      const next = new Set(prev)
      if (next.has(routeId)) {
        next.delete(routeId)
      } else {
        next.add(routeId)
      }
      return next
    })
  }

  const summary = data?.summary
  const deliveriesStatus = data?.deliveriesStatus

  return (
    <div className="page-content dashboard-page">
      <div className="page-toolbar">
        <div>
          <h1>Dashboard</h1>
          <p className="page-muted">
            Operasjonsoversikt
            {summary?.date ? ` — ${summary.date}` : ''}
            {isLoading ? ' (oppdaterer…)' : ''}
          </p>
        </div>
        <div className="page-toolbar-actions">
          <button type="button" className="btn-secondary" onClick={() => reload()}>
            Oppdater
          </button>
        </div>
      </div>

      {error ? <p className="page-error">{error}</p> : null}

      {summary ? (
        <section className="dashboard-metrics" aria-label="Nøkkeltall">
          <MetricCard label="Totalt" value={summary.metrics.deliveries.total} />
          <MetricCard
            label="Venter"
            value={summary.metrics.deliveries.pending}
            variant="muted"
          />
          <MetricCard
            label="Tildelt"
            value={summary.metrics.deliveries.assigned}
          />
          <MetricCard
            label="Underveis"
            value={summary.metrics.deliveries.inProgress}
          />
          <MetricCard
            label="Levert"
            value={summary.metrics.deliveries.delivered}
            variant="success"
          />
          <MetricCard
            label="Feilet"
            value={summary.metrics.deliveries.failed}
            variant="danger"
          />
          <MetricCard
            label="Aktive ruter"
            value={summary.metrics.routes.active}
          />
          <MetricCard
            label="Forsinket"
            value={summary.metrics.delayedDeliveries}
            variant={
              summary.metrics.delayedDeliveries > 0 ? 'danger' : undefined
            }
          />
        </section>
      ) : null}

      {summary ? (
        <section className="dashboard-secondary-metrics">
          <p>
            <span className="dashboard-secondary-label">Estimert distanse i dag:</span>{' '}
            {formatDistance(summary.metrics.totalEstimatedDistanceMeters)}
          </p>
          <p>
            <span className="dashboard-secondary-label">Snitt rutevarighet:</span>{' '}
            {formatDuration(summary.metrics.averageRouteDurationSeconds)}
          </p>
          <p>
            <span className="dashboard-secondary-label">Kapasitetsutnyttelse:</span>{' '}
            {summary.metrics.capacityUtilizationPercent != null
              ? `${summary.metrics.capacityUtilizationPercent} %`
              : '—'}
          </p>
          <p>
            <span className="dashboard-secondary-label">Ruter i dag:</span>{' '}
            {summary.metrics.routes.plannedToday} planlagt,{' '}
            {summary.metrics.routes.completedToday} fullført
          </p>
        </section>
      ) : null}

      <div className="dashboard-grid">
        <section className="dashboard-panel">
          <h2>Advarsler</h2>
          {summary?.alerts.length ? (
            <ul className="dashboard-alerts">
              {summary.alerts.map((alert, i) => (
                <li key={`${alert.type}-${alert.deliveryId ?? alert.routeId ?? i}`} className={alertClass(alert)}>
                  <span className="dashboard-alert-type">
                    {DASHBOARD_ALERT_LABELS[alert.type]}
                  </span>
                  <span>{alert.message}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="page-muted">Ingen advarsler akkurat nå.</p>
          )}
        </section>

        <section className="dashboard-panel">
          <h2>Leveringsstatus</h2>
          {deliveriesStatus ? (
            <ul className="dashboard-status-list">
              {deliveriesStatus.byStatus
                .filter((row) => row.count > 0)
                .map((row) => (
                  <li key={row.status}>
                    <StatusBadge
                      label={DELIVERY_STATUS_LABELS[row.status]}
                      className={deliveryStatusClass(row.status)}
                    />
                    <span className="dashboard-status-count">{row.count}</span>
                  </li>
                ))}
            </ul>
          ) : null}
          {deliveriesStatus?.delayed.length ? (
            <>
              <h3 className="dashboard-subheading">Forsinket / i fare</h3>
              <ul className="dashboard-delayed-list">
                {deliveriesStatus.delayed.map((d) => (
                  <li key={d.id}>
                    <strong>{d.customerName}</strong>
                    <span>{d.reason}</span>
                    {d.deadline ? (
                      <span className="dashboard-delayed-meta">
                        Deadline: {formatDateTime(d.deadline)}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </section>

        <section className="dashboard-panel dashboard-panel--routes">
          <h2>Aktive ruter</h2>
          {liveRoutes.length === 0 ? (
            <p className="page-muted">Ingen aktive ruter akkurat nå.</p>
          ) : (
            <ul className="dashboard-route-toggles">
              {liveRoutes.map((route, index) => (
                <LiveRouteToggle
                  key={route.id}
                  route={route}
                  color={
                    LIVE_ROUTE_COLORS[index % LIVE_ROUTE_COLORS.length] ??
                    LIVE_ROUTE_COLORS[0]
                  }
                  visible={visibleRouteIds.has(route.id)}
                  onToggle={() => toggleRoute(route.id)}
                />
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="dashboard-map-section">
        <h2>Kart — live ruter</h2>
        <DeliveryMap
          deliveries={mapDeliveries}
          depots={depots}
          routeLines={routeLines}
          numberedStops={numberedStops}
          className="dashboard-map"
        />
      </section>
    </div>
  )
}

function MetricCard({
  label,
  value,
  variant,
}: {
  label: string
  value: number
  variant?: 'success' | 'danger' | 'muted'
}) {
  return (
    <div className={`dashboard-metric-card dashboard-metric-card--${variant ?? 'default'}`}>
      <span className="dashboard-metric-value">{value}</span>
      <span className="dashboard-metric-label">{label}</span>
    </div>
  )
}

function LiveRouteToggle({
  route,
  color,
  visible,
  onToggle,
}: {
  route: LiveRoute
  color: string
  visible: boolean
  onToggle: () => void
}) {
  const driverLabel = route.driver?.name ?? 'Ingen sjåfør'
  const vehicleLabel = route.vehicle?.name ?? '—'

  return (
    <li className="dashboard-route-toggle">
      <label>
        <input type="checkbox" checked={visible} onChange={onToggle} />
        <span
          className="dashboard-route-color"
          style={{ backgroundColor: color }}
          aria-hidden
        />
        <span className="dashboard-route-toggle-text">
          <strong>{driverLabel}</strong>
          <span>
            {vehicleLabel} · {route.completedStops}/{route.totalStops} stopp
          </span>
        </span>
      </label>
    </li>
  )
}
