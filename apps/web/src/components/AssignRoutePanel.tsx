import { useEffect, useMemo, useState, type FormEvent } from 'react'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import type { Driver, RouteDetail } from '../types/domain'

type AssignRoutePanelProps = {
  route: RouteDetail
  drivers: Driver[]
  onAssigned: () => void | Promise<void>
}

function assignedDriverId(route: RouteDetail): string {
  return route.driverId ?? route.driver?.id ?? ''
}

function driverName(route: RouteDetail, drivers: Driver[]): string {
  if (route.driver?.name) {
    return route.driver.name
  }
  const id = assignedDriverId(route)
  return drivers.find((driver) => driver.id === id)?.name ?? 'Sjåfør'
}

export default function AssignRoutePanel({
  route,
  drivers,
  onAssigned,
}: AssignRoutePanelProps) {
  const initialDriverId = assignedDriverId(route)
  const [driverId, setDriverId] = useState(initialDriverId)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const isConfirmed = route.status === 'ASSIGNED'

  useEffect(() => {
    setDriverId(assignedDriverId(route))
    setError(null)
    setSuccess(null)
  }, [route.id, route.driverId, route.driver?.id, route.status])

  const selectableDrivers = useMemo(() => {
    const byId = new Map<string, Driver>()
    for (const driver of drivers) {
      if (driver.status === 'AVAILABLE') {
        byId.set(driver.id, driver)
      }
    }
    const currentId = assignedDriverId(route)
    if (currentId) {
      const current = drivers.find((driver) => driver.id === currentId)
      if (current) {
        byId.set(current.id, current)
      }
    }
    return [...byId.values()]
  }, [drivers, route])

  const hasAssignedDriver = Boolean(initialDriverId)
  const isUnchanged = hasAssignedDriver && driverId === initialDriverId

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!driverId) {
      setError('Velg sjåfør')
      return
    }
    setError(null)
    setSuccess(null)
    setIsSaving(true)
    try {
      await api.assignRoute(route.id, driverId)
      await onAssigned()
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
      <h3>{hasAssignedDriver ? 'Sjåfør' : 'Tildel sjåfør'}</h3>

      {isConfirmed && isUnchanged ? (
        <p className="assign-route-panel__success" role="status">
          {success ?? `${driverName(route, drivers)} er bekreftet for ruten.`}
        </p>
      ) : (
        <p className="page-muted">
          {hasAssignedDriver
            ? route.driver
              ? `${route.driver.name} er foreslått for denne ruten. Bekreft eller velg en annen sjåfør.`
              : 'Bekreft sjåfør for ruten, eller velg en annen.'
            : 'Koble ruten til en tilgjengelig sjåfør før kjøring i mobilappen.'}
        </p>
      )}

      <label>
        Sjåfør
        <select
          value={driverId}
          onChange={(e) => {
            setDriverId(e.target.value)
            setSuccess(null)
          }}
          disabled={isSaving}
        >
          {!hasAssignedDriver ? <option value="">Velg sjåfør</option> : null}
          {selectableDrivers.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
              {d.id === initialDriverId && isConfirmed ? ' (bekreftet)' : ''}
              {d.id === initialDriverId && !isConfirmed ? ' (tildelt)' : ''}
            </option>
          ))}
        </select>
      </label>
      {error ? <p className="page-error" role="alert">{error}</p> : null}
      {success && !isConfirmed ? (
        <p className="assign-route-panel__success" role="status">
          {success}
        </p>
      ) : null}
      <button
        type="submit"
        className="btn-primary"
        disabled={isSaving || (isConfirmed && isUnchanged)}
      >
        {isSaving
          ? 'Lagrer…'
          : isConfirmed && isUnchanged
            ? 'Sjåfør bekreftet'
            : isUnchanged
              ? 'Bekreft sjåfør'
              : hasAssignedDriver
                ? 'Endre sjåfør'
                : 'Tildel rute'}
      </button>
    </form>
  )
}
