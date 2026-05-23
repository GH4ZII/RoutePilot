import { useMemo, useState, type FormEvent } from 'react'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import { todayIsoDate } from '../lib/format'
import type {
  Delivery,
  Driver,
  OptimizationJob,
  OptimizationObjective,
  Vehicle,
} from '../types/domain'

type OptimizeRoutePanelProps = {
  pendingDeliveries: Delivery[]
  vehicles: Vehicle[]
  drivers: Driver[]
  selectedIds: Set<string>
  onSelectAllPending: () => void
  onClearSelection: () => void
  onJobComplete: (job: OptimizationJob) => void
  onReloadDeliveries: () => Promise<void>
}

const JOB_STATUS_LABELS: Record<string, string> = {
  PENDING: 'I kø…',
  RUNNING: 'Optimaliserer…',
  COMPLETED: 'Ferdig',
  FAILED: 'Feilet',
}

const OBJECTIVE_OPTIONS: { value: OptimizationObjective; label: string }[] = [
  { value: 'MINIMIZE_TOTAL_TIME', label: 'Minimer kjøretid' },
  { value: 'MINIMIZE_TOTAL_DISTANCE', label: 'Minimer distanse' },
  { value: 'BALANCE_WORKLOAD', label: 'Balanser arbeidslast' },
  { value: 'PRIORITIZE_URGENT', label: 'Prioriter hasteleveringer' },
  { value: 'MINIMIZE_LATE_DELIVERIES', label: 'Minimer forsinkelser' },
]

export default function OptimizeRoutePanel({
  pendingDeliveries,
  vehicles,
  drivers,
  selectedIds,
  onSelectAllPending,
  onClearSelection,
  onJobComplete,
  onReloadDeliveries,
}: OptimizeRoutePanelProps) {
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<Set<string>>(
    () => new Set(),
  )
  const [driverByVehicle, setDriverByVehicle] = useState<Record<string, string>>(
    {},
  )
  const [plannedDate, setPlannedDate] = useState(todayIsoDate())
  const [routeStartTime, setRouteStartTime] = useState('08:00')
  const [objective, setObjective] = useState<OptimizationObjective>(
    'MINIMIZE_TOTAL_TIME',
  )
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const availableVehicles = useMemo(
    () => vehicles.filter((v) => v.status === 'AVAILABLE'),
    [vehicles],
  )

  const availableDrivers = useMemo(
    () => drivers.filter((d) => d.status === 'AVAILABLE'),
    [drivers],
  )

  function toggleVehicle(id: string) {
    setSelectedVehicleIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  async function handleOptimize(event: FormEvent) {
    event.preventDefault()
    setError(null)

    const vehicleIds = [...selectedVehicleIds]
    if (vehicleIds.length < 1) {
      setError('Velg minst ett tilgjengelig kjøretøy')
      return
    }
    if (selectedIds.size < 1) {
      setError('Velg minst én ventende leveranse')
      return
    }

    const driverIds = vehicleIds.map((vid) => driverByVehicle[vid] ?? '')

    setIsRunning(true)
    setProgress('Oppretter jobb…')

    try {
      const job = await api.createOptimizationJob({
        plannedDate,
        vehicleIds,
        driverIds: driverIds.some((d) => d) ? driverIds : undefined,
        deliveryIds: [...selectedIds],
        objective,
        routeStartTime,
        returnToDepot: true,
      })

      setProgress(JOB_STATUS_LABELS[job.status] ?? job.status)
      const finished = await api.pollOptimizationJob(job.id, {
        onPoll: (j) => setProgress(JOB_STATUS_LABELS[j.status] ?? j.status),
      })

      if (finished.status === 'FAILED') {
        throw new ApiError(
          finished.errorMessage ?? 'Optimalisering feilet',
          500,
        )
      }

      onJobComplete(finished)
      await onReloadDeliveries()
      setProgress(null)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Optimalisering mislyktes')
      setProgress(null)
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <section className="optimize-panel">
      <header className="optimize-panel__header">
        <div className="optimize-panel__header-icon" aria-hidden>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d="M3 17h18M5 17V7l7-4 7 4v10M9 17v-4h6v4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <h2>Optimaliser ruter</h2>
          <p className="optimize-panel__subtitle">
            Fordeler valgte leveranser på kjøretøy med kapasitet, tidsvinduer og deadlines.
          </p>
        </div>
      </header>

      <form className="optimize-panel__form" onSubmit={handleOptimize}>
        <div className="optimize-panel__fields">
          <label>
            Planlagt dato
            <input
              type="date"
              value={plannedDate}
              onChange={(e) => setPlannedDate(e.target.value)}
              required
              disabled={isRunning}
            />
          </label>
          <label>
            Avgangstid
            <input
              type="time"
              value={routeStartTime}
              onChange={(e) => setRouteStartTime(e.target.value)}
              required
              disabled={isRunning}
            />
          </label>
          <label>
            Optimaliseringsmål
            <select
              value={objective}
              onChange={(e) =>
                setObjective(e.target.value as OptimizationObjective)
              }
              disabled={isRunning}
            >
              {OBJECTIVE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="optimize-panel__section">
          <div className="optimize-panel__section-head">
            <h3>Tilgjengelige kjøretøy</h3>
            <span className="optimize-panel__section-meta">
              {selectedVehicleIds.size} valgt
            </span>
          </div>

          {availableVehicles.length === 0 ? (
            <p className="optimize-panel__empty">Ingen tilgjengelige kjøretøy.</p>
          ) : (
            <ul className="optimize-panel__vehicle-grid">
              {availableVehicles.map((v) => {
                const isSelected = selectedVehicleIds.has(v.id)
                return (
                  <li key={v.id}>
                    <label
                      className={`optimize-vehicle-card${isSelected ? ' optimize-vehicle-card--selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        className="optimize-vehicle-card__input"
                        checked={isSelected}
                        onChange={() => toggleVehicle(v.id)}
                        disabled={isRunning}
                      />
                      <span className="optimize-vehicle-card__body">
                        <span className="optimize-vehicle-card__name">{v.name}</span>
                        <span className="optimize-vehicle-card__reg">
                          {v.registrationNumber}
                        </span>
                      </span>
                    </label>
                    {isSelected ? (
                      <label className="optimize-vehicle-card__driver">
                        Sjåfør
                        <select
                          value={driverByVehicle[v.id] ?? ''}
                          onChange={(e) =>
                            setDriverByVehicle((prev) => ({
                              ...prev,
                              [v.id]: e.target.value,
                            }))
                          }
                          disabled={isRunning}
                        >
                          <option value="">Ingen</option>
                          {availableDrivers.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    ) : null}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="optimize-panel__footer">
          <div className="optimize-panel__selection">
            <span className="optimize-panel__selection-count">
              <strong>{selectedIds.size}</strong>
              {' av '}
              {pendingDeliveries.length}
              {' ventende valgt'}
            </span>
            <div className="optimize-panel__selection-actions">
              <button
                type="button"
                className="btn-link"
                onClick={onSelectAllPending}
                disabled={isRunning || pendingDeliveries.length === 0}
              >
                Velg alle
              </button>
              <button
                type="button"
                className="btn-link"
                onClick={onClearSelection}
                disabled={isRunning || selectedIds.size === 0}
              >
                Tøm valg
              </button>
            </div>
          </div>

          {error ? <p className="page-error" role="alert">{error}</p> : null}
          {progress ? (
            <p className="optimize-panel__progress">{progress}</p>
          ) : null}

          <button
            type="submit"
            className="btn-primary optimize-panel__submit"
            disabled={
              isRunning ||
              selectedIds.size < 1 ||
              selectedVehicleIds.size < 1
            }
          >
            {isRunning ? 'Optimaliserer…' : 'Optimaliser ruter'}
          </button>
        </div>
      </form>
    </section>
  )
}
