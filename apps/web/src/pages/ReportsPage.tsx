import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import PageToolbar from '../components/PageToolbar'
import * as api from '../lib/api'
import { DELIVERY_STATUS_LABELS } from '../lib/labels'

const MAX_RANGE_DAYS = 90
const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#22c55e', '#ef4444', '#94a3b8']

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function daysAgoIso(days: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() - days)
  return d.toISOString().slice(0, 10)
}

function validateRange(from: string, to: string): string | null {
  if (!from || !to) return 'Velg både fra- og til-dato'
  if (from > to) return 'Fra-dato må være før eller lik til-dato'
  const fromMs = new Date(`${from}T12:00:00Z`).getTime()
  const toMs = new Date(`${to}T12:00:00Z`).getTime()
  const diffDays = (toMs - fromMs) / (24 * 60 * 60 * 1000)
  if (diffDays > MAX_RANGE_DAYS) {
    return `Maksimalt intervall er ${MAX_RANGE_DAYS} dager`
  }
  return null
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h} t ${m} min`
  return `${m} min`
}

function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`
  return `${meters} m`
}

export default function ReportsPage() {
  const [dailyDate, setDailyDate] = useState(todayIso)
  const [rangeFrom, setRangeFrom] = useState(() => daysAgoIso(6))
  const [rangeTo, setRangeTo] = useState(todayIso)
  const [rangeError, setRangeError] = useState<string | null>(null)

  const rangeValid = useMemo(
    () => validateRange(rangeFrom, rangeTo),
    [rangeFrom, rangeTo],
  )

  const dailyQuery = useQuery({
    queryKey: ['reports', 'daily', dailyDate],
    queryFn: () => api.getReportsDaily(dailyDate),
    staleTime: 60_000,
  })

  const driverQuery = useQuery({
    queryKey: ['reports', 'driver-performance', rangeFrom, rangeTo],
    queryFn: () =>
      api.getReportsDriverPerformance({ from: rangeFrom, to: rangeTo }),
    enabled: rangeValid === null,
    staleTime: 60_000,
  })

  const efficiencyQuery = useQuery({
    queryKey: ['reports', 'route-efficiency', rangeFrom, rangeTo],
    queryFn: () =>
      api.getReportsRouteEfficiency({ from: rangeFrom, to: rangeTo }),
    enabled: rangeValid === null,
    staleTime: 60_000,
  })

  const plannedVsActualQuery = useQuery({
    queryKey: ['reports', 'planned-vs-actual', rangeFrom, rangeTo],
    queryFn: () =>
      api.getReportsPlannedVsActual({ from: rangeFrom, to: rangeTo }),
    enabled: rangeValid === null,
    staleTime: 60_000,
  })

  const deliveryChartData = useMemo(() => {
    const d = dailyQuery.data?.deliveries
    if (!d) return []
    return [
      { name: DELIVERY_STATUS_LABELS.PENDING, value: d.pending },
      { name: DELIVERY_STATUS_LABELS.ASSIGNED, value: d.assigned },
      { name: DELIVERY_STATUS_LABELS.IN_PROGRESS, value: d.inProgress },
      { name: DELIVERY_STATUS_LABELS.DELIVERED, value: d.delivered },
      { name: DELIVERY_STATUS_LABELS.FAILED, value: d.failed },
      { name: DELIVERY_STATUS_LABELS.CANCELLED, value: d.cancelled },
    ].filter((row) => row.value > 0)
  }, [dailyQuery.data])

  const driverChartData = useMemo(
    () =>
      (driverQuery.data?.drivers ?? []).map((d) => ({
        name: d.name,
        fullført: d.stopsCompleted,
        feilet: d.stopsFailed,
        punktlighet: d.onTimePercent ?? 0,
      })),
    [driverQuery.data],
  )

  const applyRange = () => {
    const err = validateRange(rangeFrom, rangeTo)
    setRangeError(err)
    if (!err) {
      void driverQuery.refetch()
      void efficiencyQuery.refetch()
      void plannedVsActualQuery.refetch()
    }
  }

  const queryError =
    dailyQuery.error?.message ??
    driverQuery.error?.message ??
    efficiencyQuery.error?.message

  return (
    <div className="page-content reports-page">
      <PageToolbar
        title="Rapporter"
        description="Daglig oversikt, sjåførytelse og rute-effektivitet"
      />

      {(queryError || rangeError) && (
        <p className="page-error" role="alert">
          {rangeError ?? queryError}
        </p>
      )}

      <section className="reports-section">
        <h2 className="reports-section-title">Daglig rapport</h2>
        <div className="reports-filters">
          <label className="reports-filter">
            <span>Dato</span>
            <input
              type="date"
              value={dailyDate}
              onChange={(e) => setDailyDate(e.target.value)}
            />
          </label>
          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              void api.downloadReportCsv(
                `/reports/daily/export.csv?date=${dailyDate}`,
                `daily-${dailyDate}.csv`,
              )
            }
          >
            Last ned CSV
          </button>
        </div>

        {dailyQuery.isLoading && <p className="page-muted">Laster…</p>}

        {dailyQuery.data && (
          <>
            <div className="reports-metrics">
              <div className="reports-metric-card">
                <span className="reports-metric-value">
                  {dailyQuery.data.routes.planned}
                </span>
                <span className="reports-metric-label">Ruter planlagt</span>
              </div>
              <div className="reports-metric-card">
                <span className="reports-metric-value">
                  {dailyQuery.data.routes.completed}
                </span>
                <span className="reports-metric-label">Fullført</span>
              </div>
              <div className="reports-metric-card">
                <span className="reports-metric-value">
                  {dailyQuery.data.onTimeRate != null
                    ? `${dailyQuery.data.onTimeRate}%`
                    : '—'}
                </span>
                <span className="reports-metric-label">Punktlighet</span>
              </div>
              <div className="reports-metric-card">
                <span className="reports-metric-value">
                  {formatDistance(dailyQuery.data.totals.distanceMeters)}
                </span>
                <span className="reports-metric-label">Total distanse</span>
              </div>
            </div>

            <div className="reports-charts-grid">
              <div className="reports-panel">
                <h3>Leveringer på ruter</h3>
                {deliveryChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={deliveryChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {deliveryChartData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={CHART_COLORS[i % CHART_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="page-muted">Ingen leveringer denne dagen.</p>
                )}
              </div>

              <div className="reports-panel">
                <h3>Stopp</h3>
                <p>
                  Fullført: <strong>{dailyQuery.data.totals.stopsCompleted}</strong>
                  {' · '}
                  Feilet: <strong>{dailyQuery.data.totals.stopsFailed}</strong>
                  {' · '}
                  Varighet:{' '}
                  <strong>
                    {formatDuration(dailyQuery.data.totals.durationSeconds)}
                  </strong>
                </p>
              </div>
            </div>
          </>
        )}
      </section>

      <section className="reports-section">
        <h2 className="reports-section-title">Periode</h2>
        <div className="reports-filters">
          <label className="reports-filter">
            <span>Fra</span>
            <input
              type="date"
              value={rangeFrom}
              onChange={(e) => {
                setRangeFrom(e.target.value)
                setRangeError(null)
              }}
            />
          </label>
          <label className="reports-filter">
            <span>Til</span>
            <input
              type="date"
              value={rangeTo}
              onChange={(e) => {
                setRangeTo(e.target.value)
                setRangeError(null)
              }}
            />
          </label>
          <button type="button" className="btn btn-primary" onClick={applyRange}>
            Oppdater periode
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() =>
              void api.downloadReportCsv(
                `/reports/route-efficiency/export.csv?from=${rangeFrom}&to=${rangeTo}`,
                `route-efficiency-${rangeFrom}-${rangeTo}.csv`,
              )
            }
          >
            Eksporter effektivitet CSV
          </button>
        </div>

        <div className="reports-charts-grid">
          <div className="reports-panel">
            <h3>Sjåførytelse</h3>
            {driverQuery.isLoading && <p className="page-muted">Laster…</p>}
            {driverChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={driverChartData} margin={{ bottom: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="fullført" fill="#22c55e" />
                  <Bar dataKey="feilet" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              !driverQuery.isLoading && (
                <p className="page-muted">Ingen sjåførdata i perioden.</p>
              )
            )}
          </div>

          <div className="reports-panel">
            <h3>Rute-effektivitet</h3>
            {efficiencyQuery.isLoading && <p className="page-muted">Laster…</p>}
            {efficiencyQuery.data && efficiencyQuery.data.routes.length > 0 ? (
              <div className="reports-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Rute</th>
                      <th>Sjåfør</th>
                      <th>Fullføring</th>
                      <th>Kapasitet</th>
                      <th>Forsinkelse (min)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {efficiencyQuery.data.routes.map((row) => (
                      <tr key={row.routeId}>
                        <td>
                          {row.plannedDate}
                          <span className="reports-route-id">
                            {row.routeId.slice(-6)}
                          </span>
                        </td>
                        <td>{row.driver?.name ?? '—'}</td>
                        <td>
                          {row.stopCompletionRate != null
                            ? `${row.stopCompletionRate}%`
                            : '—'}
                        </td>
                        <td>
                          {row.capacityUtilizationPercent != null
                            ? `${row.capacityUtilizationPercent}%`
                            : '—'}
                        </td>
                        <td>
                          {row.avgArrivalDeltaMinutes != null
                            ? row.avgArrivalDeltaMinutes
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              !efficiencyQuery.isLoading && (
                <p className="page-muted">Ingen fullførte ruter i perioden.</p>
              )
            )}
          </div>

          <div className="reports-panel">
            <h3>Planlagt vs. faktisk</h3>
            {plannedVsActualQuery.isLoading && (
              <p className="page-muted">Laster…</p>
            )}
            {plannedVsActualQuery.data &&
            plannedVsActualQuery.data.routes.length > 0 ? (
              <div className="reports-table-wrap">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Rute</th>
                      <th>Planlagt km</th>
                      <th>Faktisk km</th>
                      <th>Planlagt tid</th>
                      <th>Faktisk tid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plannedVsActualQuery.data.routes.map((row) => (
                      <tr key={row.routeId}>
                        <td>{row.plannedDate}</td>
                        <td>
                          {row.plannedDistanceMeters != null
                            ? formatDistance(row.plannedDistanceMeters)
                            : '—'}
                        </td>
                        <td>
                          {row.actualDistanceMeters != null
                            ? formatDistance(row.actualDistanceMeters)
                            : '—'}
                        </td>
                        <td>
                          {row.plannedDurationSeconds != null
                            ? formatDuration(row.plannedDurationSeconds)
                            : '—'}
                        </td>
                        <td>
                          {row.actualDurationSeconds != null
                            ? formatDuration(row.actualDurationSeconds)
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              !plannedVsActualQuery.isLoading && (
                <p className="page-muted">Ingen rutedata i perioden.</p>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
