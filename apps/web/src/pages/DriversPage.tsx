import { useState, type FormEvent } from 'react'
import FormModal from '../components/FormModal'
import PageToolbar from '../components/PageToolbar'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import {
  DRIVER_STATUS_LABELS,
  driverStatusClass,
} from '../lib/labels'
import { useAsync } from '../lib/useAsync'
import type { Driver, DriverStatus } from '../types/domain'

const STATUSES: DriverStatus[] = [
  'AVAILABLE',
  'ON_ROUTE',
  'UNAVAILABLE',
  'OFF_DUTY',
]

export default function DriversPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [statusFilter, setStatusFilter] = useState<DriverStatus | ''>('')

  const { data: drivers, error, isLoading, reload, setError } = useAsync(
    () => api.listDrivers(statusFilter || undefined),
    [statusFilter],
  )

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Driver | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<DriverStatus>('AVAILABLE')

  function openCreate() {
    setEditing(null)
    setName('')
    setPhone('')
    setEmail('')
    setStatus('AVAILABLE')
    setModalOpen(true)
  }

  function openEdit(driver: Driver) {
    setEditing(driver)
    setName(driver.name)
    setPhone(driver.phone ?? '')
    setEmail(driver.email ?? '')
    setStatus(driver.status)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditing(null)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      const payload = {
        name,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        status,
      }
      if (editing) {
        await api.updateDriver(editing.id, payload)
      } else {
        await api.createDriver(payload)
      }
      closeModal()
      await reload()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Lagring mislyktes')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(driver: Driver) {
    if (!confirm(`Slette sjåfør ${driver.name}?`)) return
    setError(null)
    try {
      await api.deleteDriver(driver.id)
      await reload()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Sletting mislyktes')
    }
  }

  return (
    <div className="page-content">
      <PageToolbar
        title="Sjåfører"
        description="Oversikt over sjåfører og status."
        action={
          isAdmin ? (
            <button type="button" className="btn-primary" onClick={openCreate}>
              Legg til sjåfør
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
              setStatusFilter(e.target.value as DriverStatus | '')
            }
          >
            <option value="">Alle</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {DRIVER_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? <p className="page-error" role="alert">{error}</p> : null}

      {isLoading ? (
        <p className="page-muted">Laster sjåfører…</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Navn</th>
                <th>Telefon</th>
                <th>E-post</th>
                <th>Status</th>
                <th aria-label="Handlinger" />
              </tr>
            </thead>
            <tbody>
              {drivers?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="table-empty">
                    Ingen sjåfører ennå.
                  </td>
                </tr>
              ) : (
                drivers?.map((driver) => (
                  <tr key={driver.id}>
                    <td>{driver.name}</td>
                    <td>{driver.phone ?? '—'}</td>
                    <td>{driver.email ?? '—'}</td>
                    <td>
                      <StatusBadge
                        label={DRIVER_STATUS_LABELS[driver.status]}
                        className={driverStatusClass(driver.status)}
                      />
                    </td>
                    <td className="table-actions">
                      <button
                        type="button"
                        className="btn-link"
                        onClick={() => openEdit(driver)}
                      >
                        Rediger
                      </button>
                      {isAdmin ? (
                        <button
                          type="button"
                          className="btn-link btn-link--danger"
                          onClick={() => handleDelete(driver)}
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
          title={editing ? 'Rediger sjåfør' : 'Ny sjåfør'}
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>
            <label>
              Telefon
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <label>
              E-post
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DriverStatus)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {DRIVER_STATUS_LABELS[s]}
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
