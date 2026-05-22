import { useState, type FormEvent } from 'react'
import AddressAutocomplete from '../components/AddressAutocomplete'
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
  startAddress: '',
  endAddress: '',
  sameReturnDepot: true,
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
    const sameReturnDepot = vehicle.startAddress === vehicle.endAddress
    setForm({
      name: vehicle.name,
      registrationNumber: vehicle.registrationNumber,
      maxWeightKg: String(vehicle.maxWeightKg),
      maxVolumeM3: String(vehicle.maxVolumeM3),
      startAddress: vehicle.startAddress,
      endAddress: vehicle.endAddress,
      sameReturnDepot,
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
      const startAddress = form.startAddress.trim()
      const endAddress = form.sameReturnDepot
        ? startAddress
        : form.endAddress.trim()

      const payload = {
        name: form.name,
        registrationNumber: form.registrationNumber,
        maxWeightKg: Number(form.maxWeightKg),
        maxVolumeM3: Number(form.maxVolumeM3),
        startAddress,
        endAddress,
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
        description="Flåte, kapasitet og depot-adresser."
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
                    <td className="table-address">
                      {vehicle.startAddress}
                      {vehicle.endAddress !== vehicle.startAddress ? (
                        <span className="table-sub">
                          Retur: {vehicle.endAddress}
                        </span>
                      ) : null}
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
            <AddressAutocomplete
              className="form-span-2"
              label="Depotadresse (start)"
              value={form.startAddress}
              onChange={(startAddress) =>
                setForm((prev) => ({
                  ...prev,
                  startAddress,
                  endAddress: prev.sameReturnDepot ? startAddress : prev.endAddress,
                }))
              }
              placeholder="Begynn å skrive adresse…"
              hint="Velg et forslag eller skriv full adresse. Koordinater beregnes ved lagring."
              required
              disabled={isSubmitting}
            />
            <label className="form-span-2 auth-remember">
              <input
                type="checkbox"
                checked={form.sameReturnDepot}
                onChange={(e) => {
                  const checked = e.target.checked
                  setForm((prev) => ({
                    ...prev,
                    sameReturnDepot: checked,
                    endAddress: checked ? prev.startAddress : prev.endAddress,
                  }))
                }}
              />
              <span>Returner til samme depot</span>
            </label>
            {!form.sameReturnDepot ? (
              <AddressAutocomplete
                className="form-span-2"
                label="Depotadresse (retur)"
                value={form.endAddress}
                onChange={(endAddress) => updateField('endAddress', endAddress)}
                placeholder="Begynn å skrive returadresse…"
                required
                disabled={isSubmitting}
              />
            ) : null}
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
