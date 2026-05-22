import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="page-content">
      <h1>Dashboard</h1>
      <p className="page-muted">
        Innlogget som {user.name ?? user.email}
      </p>

      <dl className="dashboard-details">
        <div>
          <dt>E-post</dt>
          <dd>{user.email}</dd>
        </div>
        <div>
          <dt>Rolle</dt>
          <dd>{user.role}</dd>
        </div>
        <div>
          <dt>Organisasjon</dt>
          <dd>
            {user.organization.name} ({user.organization.slug})
          </dd>
        </div>
      </dl>
    </div>
  )
}
