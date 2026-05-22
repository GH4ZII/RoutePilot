import { useMemo, useState, type FormEvent } from 'react'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import { todayIsoDate } from '../lib/format'
import type {
  Delivery,
  Driver,
  OptimizationJob,
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
  const [vehicleId, setVehicleId] = useState('')
  const [driverId, setDriverId] = useState('')
  const [plannedDate, setPlannedDate] = useState(todayIsoDate())
  const [routeStartTime, setRouteStartTime] = useState('08:00')
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const availableVehicles = useMemo(
    () => vehicles.filter((v) => v.status === 'AVAILABLE' || v.status === 'IN_USE'),
    [vehicles],
  )

  async function handleOptimize(event: FormEvent) {
    event.preventDefault()
    setError(null)

    if (!vehicleId) {
      setError('Velg kjøretøy')
      return
    }
    if (selectedIds.size < 1) {
      setError('Velg minst én ventende leveranse')
      return
    }

    setIsRunning(true)
    setProgress('Oppretter jobb…')

    try {
      const job = await api.createOptimizationJob({
        plannedDate,
        vehicleId,
        driverId: driverId || undefined,
        deliveryIds: [...selectedIds],
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
      <div className="optimize-panel__intro">
        <h2>Optimaliser rute</h2>
        <p className="page-muted">
          Velg ventende leveranser, kjøretøy og start tid. Systemet beregner
          beste rekkefølge og lagrer ruten.
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
            Kjøretøy
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              required
              disabled={isRunning}
            >
              <option value="">Velg kjøretøy</option>
              {availableVehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.registrationNumber})
                </option>
              ))}
            </select>
          </label>
          <label>
            Sjåfør (valgfritt)
            <select
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              disabled={isRunning}
            >
              <option value="">Ingen</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
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
            disabled={isRunning || selectedIds.size < 1}
          >
            {isRunning ? 'Optimaliserer…' : 'Optimaliser rute'}
          </button>
        </div>
      </form>

      <p className="field-hint optimize-panel__hint">
        Krever at API, Redis og Python-tjenesten (port 8000) kjører.
      </p>
    </section>
  )
}
