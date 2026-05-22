import { useState, type FormEvent } from 'react'
import FormModal from '../components/FormModal'
import PageToolbar from '../components/PageToolbar'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import {
  VEHICLE_STATUS_LABELS,
  vehicleStatusClass,
} from '../lib/labels'
import { useAsync } from '../lib/useAsync'
import type { Vehicle, VehicleStatus } from '../types/domain'

const STATUSES: VehicleStatus[] = [
  'AVAILABLE',
  'IN_USE',
  'MAINTENANCE',
  'UNAVAILABLE',
]

const emptyForm = () => ({
  name: '',
  registrationNumber: '',
  maxWeightKg: '1000',
  maxVolumeM3: '10',
  startLatitude: '58.1467',
  startLongitude: '7.9956',
  endLatitude: '58.1467',
  endLongitude: '7.9956',
  status: 'AVAILABLE' as VehicleStatus,
})

export default function VehiclesPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | ''>('')

  const { data: vehicles, error, isLoading, reload, setError } = useAsync(
    () => api.listVehicles(statusFilter || undefined),
    [statusFilter],
  )

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Vehicle | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState(emptyForm)

  function openCreate() {
    setEditing(null)
    setForm(emptyForm())
    setModalOpen(true)
  }

  function openEdit(vehicle: Vehicle) {
    setEditing(vehicle)
    setForm({
      name: vehicle.name,
      registrationNumber: vehicle.registrationNumber,
      maxWeightKg: String(vehicle.maxWeightKg),
      maxVolumeM3: String(vehicle.maxVolumeM3),
      startLatitude: String(vehicle.startLatitude),
      startLongitude: String(vehicle.startLongitude),
      endLatitude: String(vehicle.endLatitude),
      endLongitude: String(vehicle.endLongitude),
      status: vehicle.status,
    })
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditing(null)
  }

  function updateField<K extends keyof ReturnType<typeof emptyForm>>(
    key: K,
    value: ReturnType<typeof emptyForm>[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      const payload = {
        name: form.name,
        registrationNumber: form.registrationNumber,
        maxWeightKg: Number(form.maxWeightKg),
        maxVolumeM3: Number(form.maxVolumeM3),
        startLatitude: Number(form.startLatitude),
        startLongitude: Number(form.startLongitude),
        endLatitude: Number(form.endLatitude),
        endLongitude: Number(form.endLongitude),
        status: form.status,
      }
      if (editing) {
        await api.updateVehicle(editing.id, payload)
      } else {
        await api.createVehicle(payload)
      }
      closeModal()
      await reload()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Lagring mislyktes')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(vehicle: Vehicle) {
    if (!confirm(`Slette kjøretøy ${vehicle.name}?`)) return
    setError(null)
    try {
      await api.deleteVehicle(vehicle.id)
      await reload()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Sletting mislyktes')
    }
  }

  return (
    <div className="page-content">
      <PageToolbar
        title="Kjøretøy"
        description="Flåte, kapasitet og depot-koordinater."
        action={
          isAdmin ? (
            <button type="button" className="btn-primary" onClick={openCreate}>
              Legg til kjøretøy
            </button>
          ) : undefined
        }
      />

      <div className="filter-bar">
        <label>
          Filtrer status
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as VehicleStatus | '')
            }
          >
            <option value="">Alle</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {VEHICLE_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? <p className="page-error" role="alert">{error}</p> : null}

      {isLoading ? (
        <p className="page-muted">Laster kjøretøy…</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Navn</th>
                <th>Reg.nr</th>
                <th>Maks vekt (kg)</th>
                <th>Depot</th>
                <th>Status</th>
                <th aria-label="Handlinger" />
              </tr>
            </thead>
            <tbody>
              {vehicles?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-empty">
                    Ingen kjøretøy ennå.
                  </td>
                </tr>
              ) : (
                vehicles?.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>{vehicle.name}</td>
                    <td>{vehicle.registrationNumber}</td>
                    <td>{vehicle.maxWeightKg}</td>
                    <td className="table-coords">
                      {vehicle.startLatitude}, {vehicle.startLongitude}
                    </td>
                    <td>
                      <StatusBadge
                        label={VEHICLE_STATUS_LABELS[vehicle.status]}
                        className={vehicleStatusClass(vehicle.status)}
                      />
                    </td>
                    <td className="table-actions">
                      <button
                        type="button"
                        className="btn-link"
                        onClick={() => openEdit(vehicle)}
                      >
                        Rediger
                      </button>
                      {isAdmin ? (
                        <button
                          type="button"
                          className="btn-link btn-link--danger"
                          onClick={() => handleDelete(vehicle)}
                        >
                          Slett
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen ? (
        <FormModal
          title={editing ? 'Rediger kjøretøy' : 'Nytt kjøretøy'}
          onClose={closeModal}
          onSubmit={handleSubmit}
          submitLabel={editing ? 'Lagre' : 'Opprett'}
          isSubmitting={isSubmitting}
        >
          <div className="form-grid">
            <label>
              Navn
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
              />
            </label>
            <label>
              Registreringsnummer
              <input
                type="text"
                value={form.registrationNumber}
                onChange={(e) =>
                  updateField('registrationNumber', e.target.value)
                }
                required
              />
            </label>
            <label>
              Maks vekt (kg)
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.maxWeightKg}
                onChange={(e) => updateField('maxWeightKg', e.target.value)}
                required
              />
            </label>
            <label>
              Maks volum (m³)
              <input
                type="number"
                min="0.001"
                step="0.001"
                value={form.maxVolumeM3}
                onChange={(e) => updateField('maxVolumeM3', e.target.value)}
                required
              />
            </label>
            <label>
              Depot start — breddegrad
              <input
                type="number"
                step="any"
                value={form.startLatitude}
                onChange={(e) => updateField('startLatitude', e.target.value)}
                required
              />
            </label>
            <label>
              Depot start — lengdegrad
              <input
                type="number"
                step="any"
                value={form.startLongitude}
                onChange={(e) => updateField('startLongitude', e.target.value)}
                required
              />
            </label>
            <label>
              Depot slutt — breddegrad
              <input
                type="number"
                step="any"
                value={form.endLatitude}
                onChange={(e) => updateField('endLatitude', e.target.value)}
                required
              />
            </label>
            <label>
              Depot slutt — lengdegrad
              <input
                type="number"
                step="any"
                value={form.endLongitude}
                onChange={(e) => updateField('endLongitude', e.target.value)}
                required
              />
            </label>
            <label>
              Status
              <select
                value={form.status}
                onChange={(e) =>
                  updateField('status', e.target.value as VehicleStatus)
                }
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {VEHICLE_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </FormModal>
      ) : null}
    </div>
  )
}
