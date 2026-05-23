import { useState, type ChangeEvent, type FormEvent } from 'react'
import AdminOnly from '../components/AdminOnly'
import FormModal from '../components/FormModal'
import PageToolbar from '../components/PageToolbar'
import UserAvatar from '../components/UserAvatar'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'
import { USER_ROLE_LABELS } from '../lib/labels'
import { readAvatarFile, userDisplayName } from '../lib/user-display'
import { useAsync } from '../lib/useAsync'
import type { OrgUser, UserRole } from '../types/domain'

const ROLES: UserRole[] = ['ADMIN', 'DISPATCHER', 'DRIVER']

const ROLE_SECTIONS: {
  role: UserRole
  description: string
}[] = [
  {
    role: 'ADMIN',
    description: 'Full tilgang til innstillinger, brukere og organisasjonen.',
  },
  {
    role: 'DISPATCHER',
    description: 'Planlegger ruter, leveranser og daglig drift.',
  },
  {
    role: 'DRIVER',
    description: 'Bruker mobilappen for å kjøre og fullføre leveranser.',
  },
]

function UserCard({
  user,
  onEdit,
  onDelete,
}: {
  user: OrgUser
  onEdit: (user: OrgUser) => void
  onDelete: (user: OrgUser) => void
}) {
  return (
    <article className="user-card">
      <div className="user-card__top">
        <UserAvatar
          name={user.name}
          email={user.email}
          avatarUrl={user.avatarUrl}
          size="lg"
        />
        <div className="user-card__info">
          <h3 className="user-card__name">
            {userDisplayName(user.name, user.email)}
          </h3>
          <p className="user-card__email">{user.email}</p>
          <span className="user-card__role">{USER_ROLE_LABELS[user.role]}</span>
        </div>
      </div>
      <div className="user-card__actions">
        <button
          type="button"
          className="btn-link"
          onClick={() => onEdit(user)}
        >
          Rediger
        </button>
        <button
          type="button"
          className="btn-link btn-link--danger"
          onClick={() => onDelete(user)}
        >
          Slett
        </button>
      </div>
    </article>
  )
}

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
  const [avatarUrl, setAvatarUrl] = useState('')
  const [avatarFileError, setAvatarFileError] = useState<string | null>(null)

  function openCreate() {
    setEditing(null)
    setEmail('')
    setPassword('')
    setName('')
    setRole('DISPATCHER')
    setAvatarUrl('')
    setAvatarFileError(null)
    setModalOpen(true)
  }

  function openEdit(user: OrgUser) {
    setEditing(user)
    setEmail(user.email)
    setPassword('')
    setName(user.name ?? '')
    setRole(user.role)
    setAvatarUrl(user.avatarUrl ?? '')
    setAvatarFileError(null)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditing(null)
    setAvatarFileError(null)
  }

  async function handleAvatarFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setAvatarFileError(null)
    try {
      const dataUrl = await readAvatarFile(file)
      setAvatarUrl(dataUrl)
    } catch (err) {
      setAvatarFileError(
        err instanceof Error ? err.message : 'Kunne ikke laste opp bilde',
      )
    }
  }

  function clearAvatar() {
    setAvatarUrl('')
    setAvatarFileError(null)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setIsSubmitting(true)
    setError(null)
    const trimmedAvatar = avatarUrl.trim()
    try {
      if (editing) {
        await api.updateUser(editing.id, {
          role,
          name: name.trim() || undefined,
          avatarUrl: trimmedAvatar || null,
          ...(password ? { password } : {}),
        })
      } else {
        await api.createUser({
          email,
          password,
          role,
          name: name.trim() || undefined,
          ...(trimmedAvatar ? { avatarUrl: trimmedAvatar } : {}),
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

  const usersByRole = ROLES.reduce(
    (acc, roleKey) => {
      acc[roleKey] = users?.filter((u) => u.role === roleKey) ?? []
      return acc
    },
    {} as Record<UserRole, OrgUser[]>,
  )

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
          <>
            <section className="users-summary" aria-label="Oversikt">
              {ROLE_SECTIONS.map(({ role: roleKey }) => (
                <div key={roleKey} className="users-summary-card">
                  <span className="users-summary-value">
                    {usersByRole[roleKey].length}
                  </span>
                  <span className="users-summary-label">
                    {USER_ROLE_LABELS[roleKey]}
                  </span>
                </div>
              ))}
              <div className="users-summary-card">
                <span className="users-summary-value">{users?.length ?? 0}</span>
                <span className="users-summary-label">Totalt</span>
              </div>
            </section>

            <div className="users-sections">
              {ROLE_SECTIONS.map(({ role: roleKey, description }) => {
                const sectionUsers = usersByRole[roleKey]
                return (
                  <section key={roleKey} className="users-section">
                    <header className="users-section__header">
                      <div>
                        <h2>
                          {USER_ROLE_LABELS[roleKey]}
                          <span className="users-section__count">
                            {sectionUsers.length}
                          </span>
                        </h2>
                        <p className="users-section__description">
                          {description}
                        </p>
                      </div>
                    </header>

                    {sectionUsers.length === 0 ? (
                      <p className="users-empty">
                        Ingen brukere i denne rollen ennå.
                      </p>
                    ) : (
                      <div className="users-grid">
                        {sectionUsers.map((user) => (
                          <UserCard
                            key={user.id}
                            user={user}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                          />
                        ))}
                      </div>
                    )}
                  </section>
                )
              })}
            </div>
          </>
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
              <div className="user-avatar-preview">
                <UserAvatar
                  name={name || null}
                  email={email || 'bruker@eksempel.no'}
                  avatarUrl={avatarUrl || null}
                  size="lg"
                />
                <p className="user-avatar-preview__hint">
                  Last opp bilde (maks 2 MB) eller lim inn en bilde-URL.
                </p>
                <div className="user-avatar-upload">
                  <label className="btn-secondary">
                    Velg bilde
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleAvatarFile}
                    />
                  </label>
                  {avatarUrl ? (
                    <button
                      type="button"
                      className="btn-link btn-link--danger"
                      onClick={clearAvatar}
                    >
                      Fjern bilde
                    </button>
                  ) : null}
                </div>
                {avatarFileError ? (
                  <p className="page-error" role="alert">
                    {avatarFileError}
                  </p>
                ) : null}
              </div>
              <label className="form-span-2">
                Bilde-URL (valgfritt)
                <input
                  type="url"
                  value={avatarUrl.startsWith('data:') ? '' : avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://…"
                />
              </label>
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
