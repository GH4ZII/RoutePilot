import { useState, type FormEvent } from 'react'
import AdminOnly from '../components/AdminOnly'
import FormModal from '../components/FormModal'
import PageToolbar from '../components/PageToolbar'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import { USER_ROLE_LABELS } from '../lib/labels'
import { useAsync } from '../lib/useAsync'
import type { OrgUser, UserRole } from '../types/domain'

const ROLES: UserRole[] = ['ADMIN', 'DISPATCHER', 'DRIVER']

export default function UsersPage() {
  const { data: users, error, isLoading, reload, setError } = useAsync(
    () => api.listUsers(),
    [],
  )
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<OrgUser | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<UserRole>('DISPATCHER')

  function openCreate() {
    setEditing(null)
    setEmail('')
    setPassword('')
    setName('')
    setRole('DISPATCHER')
    setModalOpen(true)
  }

  function openEdit(user: OrgUser) {
    setEditing(user)
    setEmail(user.email)
    setPassword('')
    setName(user.name ?? '')
    setRole(user.role)
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
      if (editing) {
        await api.updateUser(editing.id, {
          role,
          name: name.trim() || undefined,
          ...(password ? { password } : {}),
        })
      } else {
        await api.createUser({
          email,
          password,
          role,
          name: name.trim() || undefined,
        })
      }
      closeModal()
      await reload()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Lagring mislyktes')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(user: OrgUser) {
    if (!confirm(`Slette bruker ${user.email}?`)) return
    setError(null)
    try {
      await api.deleteUser(user.id)
      await reload()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Sletting mislyktes')
    }
  }

  return (
    <AdminOnly>
      <div className="page-content">
        <PageToolbar
          title="Brukere"
          description="Administrer brukere og roller i organisasjonen."
          action={
            <button type="button" className="btn-primary" onClick={openCreate}>
              Legg til bruker
            </button>
          }
        />

        {error ? <p className="page-error" role="alert">{error}</p> : null}

        {isLoading ? (
          <p className="page-muted">Laster brukere…</p>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Navn</th>
                  <th>E-post</th>
                  <th>Rolle</th>
                  <th aria-label="Handlinger" />
                </tr>
              </thead>
              <tbody>
                {users?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="table-empty">
                      Ingen brukere ennå.
                    </td>
                  </tr>
                ) : (
                  users?.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name ?? '—'}</td>
                      <td>{user.email}</td>
                      <td>{USER_ROLE_LABELS[user.role]}</td>
                      <td className="table-actions">
                        <button
                          type="button"
                          className="btn-link"
                          onClick={() => openEdit(user)}
                        >
                          Rediger
                        </button>
                        <button
                          type="button"
                          className="btn-link btn-link--danger"
                          onClick={() => handleDelete(user)}
                        >
                          Slett
                        </button>
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
            title={editing ? 'Rediger bruker' : 'Ny bruker'}
            onClose={closeModal}
            onSubmit={handleSubmit}
            submitLabel={editing ? 'Lagre' : 'Opprett'}
            isSubmitting={isSubmitting}
          >
            <div className="form-grid">
              <label>
                E-post
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={!!editing}
                />
              </label>
              <label>
                {editing ? 'Nytt passord (valgfritt)' : 'Passord'}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!editing}
                  minLength={8}
                />
              </label>
              <label>
                Navn
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label>
                Rolle
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {USER_ROLE_LABELS[r]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </FormModal>
        ) : null}
      </div>
    </AdminOnly>
  )
}
