import { useState, type FormEvent } from 'react'
import AddressAutocomplete from '../components/AddressAutocomplete'
import FormModal from '../components/FormModal'
import PageToolbar from '../components/PageToolbar'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import { useAsync } from '../lib/useAsync'
import type { Depot } from '../types/domain'

export default function DepotsPage() {
  const { data: depots, error, isLoading, reload, setError } = useAsync(
    () => api.listDepots(),
    [],
  )
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Depot | null>(null)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [saving, setSaving] = useState(false)

  function openCreate() {
    setEditing(null)
    setName('')
    setAddress('')
    setModalOpen(true)
  }

  function openEdit(depot: Depot) {
    setEditing(depot)
    setName(depot.name)
    setAddress(depot.address)
    setModalOpen(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      if (editing) {
        await api.updateDepot(editing.id, { name, address })
      } else {
        await api.createDepot({ name, address })
      }
      setModalOpen(false)
      reload()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Lagring feilet')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(depot: Depot) {
    if (!window.confirm(`Slette depot «${depot.name}»?`)) return
    try {
      await api.deleteDepot(depot.id)
      reload()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Sletting feilet')
    }
  }

  return (
    <div className="page">
      <PageToolbar
        title="Depot"
        description="Administrer lagre og utkjøringspunkter for multi-depot routing."
        action={
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            Nytt depot
          </button>
        }
      />

      {error && <p className="form-error">{error}</p>}
      {isLoading && <p>Laster…</p>}

      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Navn</th>
              <th>Adresse</th>
              <th>Koordinater</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(depots ?? []).map((depot) => (
              <tr key={depot.id}>
                <td>{depot.name}</td>
                <td>{depot.address}</td>
                <td>
                  {depot.latitude.toFixed(5)}, {depot.longitude.toFixed(5)}
                </td>
                <td className="table-actions">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => openEdit(depot)}
                  >
                    Rediger
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleDelete(depot)}
                  >
                    Slett
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen ? (
        <FormModal
          title={editing ? 'Rediger depot' : 'Nytt depot'}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          submitLabel={editing ? 'Lagre' : 'Opprett'}
          isSubmitting={saving}
        >
          <label>
            Navn
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <AddressAutocomplete
            label="Adresse"
            value={address}
            onChange={setAddress}
            required
          />
        </FormModal>
      ) : null}
    </div>
  )
}
