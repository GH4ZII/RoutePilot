import { useState, type FormEvent } from 'react'
import FormModal from '../components/FormModal'
import PageToolbar from '../components/PageToolbar'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import {
  fromDatetimeLocalValue,
  formatDateTime,
  toDatetimeLocalValue,
} from '../lib/format'
import {
  DELIVERY_PRIORITY_LABELS,
  DELIVERY_STATUS_LABELS,
  deliveryPriorityClass,
  deliveryStatusClass,
} from '../lib/labels'
import { useAsync } from '../lib/useAsync'
import type {
  Delivery,
  DeliveryPriority,
  DeliveryStatus,
} from '../types/domain'

const STATUSES: DeliveryStatus[] = [
  'PENDING',
  'ASSIGNED',
  'IN_PROGRESS',
  'DELIVERED',
  'FAILED',
  'CANCELLED',
]

const PRIORITIES: DeliveryPriority[] = ['LOW', 'NORMAL', 'HIGH', 'CRITICAL']

const emptyForm = () => ({
  customerName: '',
  phone: '',
  address: '',
  latitude: '58.1467',
  longitude: '7.9956',
  weightKg: '1',
  volumeM3: '',
  priority: 'NORMAL' as DeliveryPriority,
  deadline: '',
  timeWindowStart: '',
  timeWindowEnd: '',
  notes: '',
  status: 'PENDING' as DeliveryStatus,
})

export default function DeliveriesPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | ''>('')

  const { data: deliveries, error, isLoading, reload, setError } = useAsync(
    () => api.listDeliveries(statusFilter || undefined),
    [statusFilter],
  )

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Delivery | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState(emptyForm)

  function openCreate() {
    setEditing(null)
    setForm(emptyForm())
    setModalOpen(true)
  }

  function openEdit(delivery: Delivery) {
    setEditing(delivery)
    setForm({
      customerName: delivery.customerName,
      phone: delivery.phone ?? '',
      address: delivery.address,
      latitude: String(delivery.latitude),
      longitude: String(delivery.longitude),
      weightKg: String(delivery.weightKg),
      volumeM3: delivery.volumeM3 != null ? String(delivery.volumeM3) : '',
      priority: delivery.priority,
      deadline: toDatetimeLocalValue(delivery.deadline),
      timeWindowStart: toDatetimeLocalValue(delivery.timeWindowStart),
      timeWindowEnd: toDatetimeLocalValue(delivery.timeWindowEnd),
      notes: delivery.notes ?? '',
      status: delivery.status,
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

  function buildPayload() {
    return {
      customerName: form.customerName,
      phone: form.phone.trim() || undefined,
      address: form.address,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      weightKg: Number(form.weightKg),
      volumeM3: form.volumeM3 ? Number(form.volumeM3) : undefined,
      priority: form.priority,
      deadline: fromDatetimeLocalValue(form.deadline),
      timeWindowStart: fromDatetimeLocalValue(form.timeWindowStart),
      timeWindowEnd: fromDatetimeLocalValue(form.timeWindowEnd),
      notes: form.notes.trim() || undefined,
      status: form.status,
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    try {
      const payload = buildPayload()
      if (editing) {
        await api.updateDelivery(editing.id, payload)
      } else {
        await api.createDelivery(payload)
      }
      closeModal()
      await reload()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Lagring mislyktes')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(delivery: Delivery) {
    if (!confirm(`Slette leveranse til ${delivery.customerName}?`)) return
    setError(null)
    try {
      await api.deleteDelivery(delivery.id)
      await reload()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Sletting mislyktes')
    }
  }

  return (
    <div className="page-content">
      <PageToolbar
        title="Leveranser"
        description="Kunder, adresser, status og leveringsvinduer."
        action={
          <button type="button" className="btn-primary" onClick={openCreate}>
            Legg til leveranse
          </button>
        }
      />

      <div className="filter-bar">
        <label>
          Filtrer status
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as DeliveryStatus | '')
            }
          >
            <option value="">Alle</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {DELIVERY_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? <p className="page-error" role="alert">{error}</p> : null}

      {isLoading ? (
        <p className="page-muted">Laster leveranser…</p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Kunde</th>
                <th>Adresse</th>
                <th>Status</th>
                <th>Prioritet</th>
                <th>Vekt (kg)</th>
                <th>Deadline</th>
                <th aria-label="Handlinger" />
              </tr>
            </thead>
            <tbody>
              {deliveries?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="table-empty">
                    Ingen leveranser ennå.
                  </td>
                </tr>
              ) : (
                deliveries?.map((delivery) => (
                  <tr key={delivery.id}>
                    <td>
                      <strong>{delivery.customerName}</strong>
                      {delivery.phone ? (
                        <span className="table-sub">{delivery.phone}</span>
                      ) : null}
                    </td>
                    <td className="table-address">{delivery.address}</td>
                    <td>
                      <StatusBadge
                        label={DELIVERY_STATUS_LABELS[delivery.status]}
                        className={deliveryStatusClass(delivery.status)}
                      />
                    </td>
                    <td>
                      <StatusBadge
                        label={DELIVERY_PRIORITY_LABELS[delivery.priority]}
                        className={deliveryPriorityClass(delivery.priority)}
                      />
                    </td>
                    <td>{delivery.weightKg}</td>
                    <td>{formatDateTime(delivery.deadline)}</td>
                    <td className="table-actions">
                      <button
                        type="button"
                        className="btn-link"
                        onClick={() => openEdit(delivery)}
                      >
                        Rediger
                      </button>
                      {isAdmin ? (
                        <button
                          type="button"
                          className="btn-link btn-link--danger"
                          onClick={() => handleDelete(delivery)}
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
          title={editing ? 'Rediger leveranse' : 'Ny leveranse'}
          onClose={closeModal}
          onSubmit={handleSubmit}
          submitLabel={editing ? 'Lagre' : 'Opprett'}
          isSubmitting={isSubmitting}
        >
          <div className="form-grid form-grid--wide">
            <label>
              Kundenavn
              <input
                type="text"
                value={form.customerName}
                onChange={(e) => updateField('customerName', e.target.value)}
                required
              />
            </label>
            <label>
              Telefon
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
              />
            </label>
            <label className="form-span-2">
              Adresse
              <input
                type="text"
                value={form.address}
                onChange={(e) => updateField('address', e.target.value)}
                required
              />
            </label>
            <label>
              Breddegrad
              <input
                type="number"
                step="any"
                value={form.latitude}
                onChange={(e) => updateField('latitude', e.target.value)}
                required
              />
            </label>
            <label>
              Lengdegrad
              <input
                type="number"
                step="any"
                value={form.longitude}
                onChange={(e) => updateField('longitude', e.target.value)}
                required
              />
            </label>
            <label>
              Vekt (kg)
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={form.weightKg}
                onChange={(e) => updateField('weightKg', e.target.value)}
                required
              />
            </label>
            <label>
              Volum (m³)
              <input
                type="number"
                min="0.001"
                step="0.001"
                value={form.volumeM3}
                onChange={(e) => updateField('volumeM3', e.target.value)}
              />
            </label>
            <label>
              Prioritet
              <select
                value={form.priority}
                onChange={(e) =>
                  updateField('priority', e.target.value as DeliveryPriority)
                }
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {DELIVERY_PRIORITY_LABELS[p]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select
                value={form.status}
                onChange={(e) =>
                  updateField('status', e.target.value as DeliveryStatus)
                }
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {DELIVERY_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Deadline
              <input
                type="datetime-local"
                value={form.deadline}
                onChange={(e) => updateField('deadline', e.target.value)}
              />
            </label>
            <label>
              Tidsvindu fra
              <input
                type="datetime-local"
                value={form.timeWindowStart}
                onChange={(e) => updateField('timeWindowStart', e.target.value)}
              />
            </label>
            <label>
              Tidsvindu til
              <input
                type="datetime-local"
                value={form.timeWindowEnd}
                onChange={(e) => updateField('timeWindowEnd', e.target.value)}
              />
            </label>
            <label className="form-span-2">
              Notater
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => updateField('notes', e.target.value)}
              />
            </label>
          </div>
        </FormModal>
      ) : null}
    </div>
  )
}
