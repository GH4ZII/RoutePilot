import { useState, type FormEvent } from 'react'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import type { Driver, RouteDetail } from '../types/domain'

type AssignRoutePanelProps = {
  route: RouteDetail
  drivers: Driver[]
  onAssigned: (route: RouteDetail) => void
}

export default function AssignRoutePanel({
  route,
  drivers,
  onAssigned,
}: AssignRoutePanelProps) {
  const [driverId, setDriverId] = useState(route.driverId ?? '')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const availableDrivers = drivers.filter((d) => d.status === 'AVAILABLE')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!driverId) {
      setError('Velg sjåfør')
      return
    }
    setError(null)
    setIsSaving(true)
    try {
      const updated = await api.assignRoute(route.id, driverId)
      onAssigned(updated)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Tildeling feilet')
    } finally {
      setIsSaving(false)
    }
  }

  if (
    route.status !== 'PLANNED' &&
    route.status !== 'ASSIGNED'
  ) {
    return null
  }

  return (
    <form className="assign-route-panel" onSubmit={handleSubmit}>
      <h3>Tildel sjåfør</h3>
      <p className="page-muted">
        Koble ruten til en tilgjengelig sjåfør før kjøring i mobilappen.
      </p>
      <label>
        Sjåfør
        <select
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          disabled={isSaving}
        >
          <option value="">Velg sjåfør</option>
          {availableDrivers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </label>
      {error ? <p className="page-error" role="alert">{error}</p> : null}
      <button type="submit" className="btn-primary" disabled={isSaving}>
        {isSaving ? 'Tildeler…' : 'Tildel rute'}
      </button>
    </form>
  )
}
