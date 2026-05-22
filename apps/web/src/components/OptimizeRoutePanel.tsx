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
  const [respectCapacity, setRespectCapacity] = useState(true)
  const [respectTimeWindows, setRespectTimeWindows] = useState(true)
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
        respectCapacity,
        respectTimeWindows,
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
      <div className="optimize-panel__intro">
        <h2>Optimaliser ruter (VRP)</h2>
        <p className="page-muted">
          Fordeler leveranser på flere tilgjengelige kjøretøy med kapasitet,
          tidsvinduer, deadlines og prioritet.
        </p>
      </div>

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

        <fieldset className="optimize-panel__vehicles" disabled={isRunning}>
          <legend>Tilgjengelige kjøretøy</legend>
          {availableVehicles.length === 0 ? (
            <p className="page-muted">Ingen kjøretøy med status AVAILABLE.</p>
          ) : (
            <ul className="optimize-panel__vehicle-list">
              {availableVehicles.map((v) => (
                <li key={v.id} className="optimize-panel__vehicle-row">
                  <label className="optimize-panel__vehicle-check">
                    <input
                      type="checkbox"
                      checked={selectedVehicleIds.has(v.id)}
                      onChange={() => toggleVehicle(v.id)}
                    />
                    <span>
                      {v.name} ({v.registrationNumber}) — maks{' '}
                      {v.maxWeightKg} kg
                    </span>
                  </label>
                  {selectedVehicleIds.has(v.id) ? (
                    <label className="optimize-panel__driver-select">
                      Sjåfør
                      <select
                        value={driverByVehicle[v.id] ?? ''}
                        onChange={(e) =>
                          setDriverByVehicle((prev) => ({
                            ...prev,
                            [v.id]: e.target.value,
                          }))
                        }
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
              ))}
            </ul>
          )}
        </fieldset>

        <div className="optimize-panel__flags">
          <label>
            <input
              type="checkbox"
              checked={respectCapacity}
              onChange={(e) => setRespectCapacity(e.target.checked)}
              disabled={isRunning}
            />
            Respekter kapasitet (vekt, volum, pakker)
          </label>
          <label>
            <input
              type="checkbox"
              checked={respectTimeWindows}
              onChange={(e) => setRespectTimeWindows(e.target.checked)}
              disabled={isRunning}
            />
            Respekter tidsvinduer og deadlines
          </label>
        </div>

        <div className="optimize-panel__selection">
          <span>
            {selectedIds.size} av {pendingDeliveries.length} ventende valgt
          </span>
          <div className="optimize-panel__selection-actions">
            <button
              type="button"
              className="btn-link"
              onClick={onSelectAllPending}
              disabled={isRunning || pendingDeliveries.length === 0}
            >
              Velg alle ventende
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
        {progress ? <p className="optimize-panel__progress">{progress}</p> : null}

        <div className="optimize-panel__actions">
          <button
            type="submit"
            className="btn-primary"
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

      <p className="field-hint optimize-panel__hint">
        Flyt: optimaliser → Ruter → tildel sjåfør → kjør i mobil. Krever API,
        Redis og optimizer (port 8000).
      </p>
    </section>
  )
}
