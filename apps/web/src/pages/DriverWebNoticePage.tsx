import { useAuth } from '../context/AuthContext'

export default function DriverWebNoticePage() {
  const { user, logout } = useAuth()

  return (
    <section className="auth-page">
      <div className="auth-card dashboard-card">
        <h1>Bruk mobilappen</h1>
        <p className="auth-subtitle">
          Sjåfører bruker RoutePilot på mobil. Logg inn med samme konto i
          mobilappen (Expo).
        </p>
        {user ? (
          <dl className="dashboard-details">
            <div>
              <dt>Innlogget som</dt>
              <dd>{user.name ?? user.email}</dd>
            </div>
            <div>
              <dt>Organisasjon</dt>
              <dd>{user.organization.name}</dd>
            </div>
          </dl>
        ) : null}
        <button type="button" className="auth-submit" onClick={logout}>
          Logg ut
        </button>
      </div>
    </section>
  )
}
