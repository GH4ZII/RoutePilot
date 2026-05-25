import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react'
import DeliveryMap, {
  type DepotPoint,
  type DriverMarker,
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
import {
  liveRouteColorForIndex,
  liveRouteColorForRoute,
} from '../lib/map-colors'
import { fetchDrivingRouteGeometry } from '../lib/osrm-route'
import { buildLiveRouteWaypoints } from '../lib/route-waypoints'
import { subscribeToEvents } from '../lib/sse'
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
    const unsubscribe = subscribeToEvents(
      () => reload(),
      () => reload(),
    )
    return () => {
      window.clearInterval(id)
      unsubscribe()
    }
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
    visibleRoutes.forEach((route) => {
      const geometry = routeGeometries[route.id]
      if (!geometry || geometry.length < 2) return
      const color = liveRouteColorForRoute(route.id, liveRoutes)
      const driverName = route.driver?.name ?? 'Uten sjåfør'
      lines.push({
        id: route.id,
        positions: geometry,
        color,
        label: `${driverName} — ${route.vehicle?.name ?? 'Kjøretøy'}`,
      })
    })
    return lines
  }, [visibleRoutes, routeGeometries, liveRoutes])

  const numberedStops: NumberedStop[] = useMemo(() => {
    const stops: NumberedStop[] = []
    visibleRoutes.forEach((route) => {
      const color = liveRouteColorForRoute(route.id, liveRoutes)
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
  }, [visibleRoutes, liveRoutes])

  const driverMarkers: DriverMarker[] = useMemo(() => {
    const markers: DriverMarker[] = []
    for (const route of visibleRoutes) {
      if (!route.driver || !route.driverLocation) continue
      markers.push({
        id: route.driver.id,
        label: route.driver.name,
        latitude: route.driverLocation.latitude,
        longitude: route.driverLocation.longitude,
      })
    }
    return markers
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

  const deliveryTotal = summary?.metrics.deliveries.total ?? 0
  const deliveredCount = summary?.metrics.deliveries.delivered ?? 0
  const deliveryProgress =
    deliveryTotal > 0 ? Math.round((deliveredCount / deliveryTotal) * 100) : 0

  return (
    <div className="page-content dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header-text">
          <div className="dashboard-header-title-row">
            <h1>Dashboard</h1>
            <span className="dashboard-live-badge" aria-live="polite">
              <span className="dashboard-live-dot" aria-hidden />
              Live
            </span>
          </div>
          <p className="dashboard-header-subtitle">
            Operasjonsoversikt
            {summary?.date ? (
              <>
                {' '}
                · <time dateTime={summary.date}>{summary.date}</time>
              </>
            ) : null}
            {isLoading ? (
              <span className="dashboard-header-loading"> · Oppdaterer…</span>
            ) : null}
          </p>
        </div>
        <button
          type="button"
          className="dashboard-refresh-btn"
          onClick={() => reload()}
          disabled={isLoading}
        >
          Oppdater
        </button>
      </header>

      {error ? <p className="page-error dashboard-error">{error}</p> : null}

      {summary ? (
        <>
          <section className="dashboard-kpi-grid" aria-label="Nøkkeltall">
            <MetricCard
              label="Levert i dag"
              value={deliveredCount}
              variant="success"
              highlight
              hint={`${deliveryProgress} % av ${deliveryTotal}`}
            />
            <MetricCard
              label="Underveis"
              value={summary.metrics.deliveries.inProgress}
              variant="accent"
            />
            <MetricCard
              label="Aktive ruter"
              value={summary.metrics.routes.active}
            />
            <MetricCard
              label="Forsinket"
              value={summary.metrics.delayedDeliveries}
              variant={
                summary.metrics.delayedDeliveries > 0 ? 'danger' : 'muted'
              }
            />
          </section>

          <section className="dashboard-metrics" aria-label="Leveringsdetaljer">
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
              label="Levert"
              value={summary.metrics.deliveries.delivered}
              variant="success"
            />
            <MetricCard
              label="Feilet"
              value={summary.metrics.deliveries.failed}
              variant="danger"
            />
          </section>

          <section
            className="dashboard-insights"
            aria-label="Dagens innsikt"
          >
            <InsightChip
              label="Estimert distanse"
              value={formatDistance(summary.metrics.totalEstimatedDistanceMeters)}
            />
            <InsightChip
              label="Snitt rutevarighet"
              value={formatDuration(summary.metrics.averageRouteDurationSeconds)}
            />
            <InsightChip
              label="Kapasitet"
              value={
                summary.metrics.capacityUtilizationPercent != null
                  ? `${summary.metrics.capacityUtilizationPercent} %`
                  : '—'
              }
            />
            <InsightChip
              label="Ruter i dag"
              value={`${summary.metrics.routes.plannedToday} planlagt · ${summary.metrics.routes.completedToday} fullført`}
            />
          </section>
        </>
      ) : null}

      <div className="dashboard-main">
        <div className="dashboard-sidebar">
          <section className="dashboard-panel">
            <PanelHeader title="Advarsler" count={summary?.alerts.length} />
            {summary?.alerts.length ? (
              <ul className="dashboard-alerts">
                {summary.alerts.map((alert, i) => (
                  <li
                    key={`${alert.type}-${alert.deliveryId ?? alert.routeId ?? i}`}
                    className={alertClass(alert)}
                  >
                    <span className="dashboard-alert-type">
                      {DASHBOARD_ALERT_LABELS[alert.type]}
                    </span>
                    <span>{alert.message}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="dashboard-empty">Ingen advarsler akkurat nå.</p>
            )}
          </section>

          <section className="dashboard-panel">
            <PanelHeader title="Leveringsstatus" />
            {deliveriesStatus ? (
              <ul className="dashboard-status-list">
                {deliveriesStatus.byStatus
                  .filter((row) => row.count > 0)
                  .map((row) => {
                    const share =
                      deliveryTotal > 0
                        ? Math.round((row.count / deliveryTotal) * 100)
                        : 0
                    return (
                      <li key={row.status}>
                        <div className="dashboard-status-row">
                          <StatusBadge
                            label={DELIVERY_STATUS_LABELS[row.status]}
                            className={deliveryStatusClass(row.status)}
                          />
                          <span className="dashboard-status-count">
                            {row.count}
                          </span>
                        </div>
                        <div
                          className="dashboard-status-bar"
                          role="presentation"
                        >
                          <span
                            className="dashboard-status-bar-fill"
                            style={{ width: `${share}%` }}
                          />
                        </div>
                      </li>
                    )
                  })}
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
            <PanelHeader title="Aktive ruter" count={liveRoutes.length} />
            {liveRoutes.length === 0 ? (
              <p className="dashboard-empty">Ingen aktive ruter akkurat nå.</p>
            ) : (
              <div className="dashboard-route-scroll">
                <ul className="dashboard-route-toggles">
                  {liveRoutes.map((route, index) => (
                    <LiveRouteToggle
                      key={route.id}
                      route={route}
                      color={liveRouteColorForIndex(index)}
                      visible={visibleRouteIds.has(route.id)}
                      onToggle={() => toggleRoute(route.id)}
                    />
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>

        <section className="dashboard-map-card">
          <PanelHeader
            title="Live kart"
            subtitle={`${visibleRoutes.length} av ${liveRoutes.length} ruter synlig`}
          />
          <DeliveryMap
            deliveries={mapDeliveries}
            depots={depots}
            driverMarkers={driverMarkers}
            routeLines={routeLines}
            numberedStops={numberedStops}
            fitBoundsKey={[...visibleRouteIds].sort().join(',') || 'none'}
            className="dashboard-map"
          />
        </section>
      </div>
    </div>
  )
}

function PanelHeader({
  title,
  subtitle,
  count,
}: {
  title: string
  subtitle?: string
  count?: number
}) {
  return (
    <div className="dashboard-panel-header">
      <div>
        <h2>{title}</h2>
        {subtitle ? <p className="dashboard-panel-subtitle">{subtitle}</p> : null}
      </div>
      {count != null && count > 0 ? (
        <span className="dashboard-panel-count">{count}</span>
      ) : null}
    </div>
  )
}

function InsightChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="dashboard-insight-chip">
      <span className="dashboard-insight-label">{label}</span>
      <span className="dashboard-insight-value">{value}</span>
    </div>
  )
}

function MetricCard({
  label,
  value,
  variant,
  highlight,
  hint,
}: {
  label: string
  value: number
  variant?: 'success' | 'danger' | 'muted' | 'accent'
  highlight?: boolean
  hint?: string
}) {
  return (
    <div
      className={[
        'dashboard-metric-card',
        `dashboard-metric-card--${variant ?? 'default'}`,
        highlight ? 'dashboard-metric-card--highlight' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="dashboard-metric-value">{value}</span>
      <span className="dashboard-metric-label">{label}</span>
      {hint ? <span className="dashboard-metric-hint">{hint}</span> : null}
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
  const progress =
    route.totalStops > 0
      ? Math.round((route.completedStops / route.totalStops) * 100)
      : 0

  return (
    <li
      className={[
        'dashboard-route-toggle',
        visible ? 'dashboard-route-toggle--active' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ '--route-color': color } as CSSProperties}
    >
      <label>
        <input
          type="checkbox"
          className="dashboard-route-checkbox"
          checked={visible}
          onChange={onToggle}
        />
        <span
          className="dashboard-route-color"
          style={{ backgroundColor: color, boxShadow: `0 0 0 3px ${color}33` }}
          aria-hidden
        />
        <span className="dashboard-route-toggle-text">
          <span className="dashboard-route-toggle-top">
            <strong>{driverLabel}</strong>
            <span className="dashboard-route-progress-pct">{progress}%</span>
          </span>
          <span>
            {vehicleLabel} · {route.completedStops}/{route.totalStops} stopp
          </span>
          <span className="dashboard-route-progress" role="presentation">
            <span
              className="dashboard-route-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </span>
        </span>
      </label>
    </li>
  )
}
