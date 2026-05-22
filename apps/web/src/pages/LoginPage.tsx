import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ApiError } from '../lib/api'
import { validatePassword } from '../lib/auth-validation'
import { useAuth } from '../context/AuthContext'
import { isWebAppRole } from '../lib/nav-config'
import {
  getRememberMeEnabled,
  getRememberedLogin,
} from '../lib/remember-login'

export default function LoginPage() {
  const { login, isAuthenticated, isLoading: authLoading, user } = useAuth()
  const [organizationSlug, setOrganizationSlug] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const remembered = getRememberedLogin()
    if (remembered) {
      setOrganizationSlug(remembered.organizationSlug)
      setEmail(remembered.email)
    }
    setRememberMe(getRememberMeEnabled())
  }, [])

  if (!authLoading && isAuthenticated && user) {
    if (!isWebAppRole(user.role)) {
      return <Navigate to="/driver-notice" replace />
    }
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    setIsSubmitting(true)

    try {
      await login({ organizationSlug, email, password }, { rememberMe })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Innlogging mislyktes. Prøv igjen.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>RoutePilot</h1>
        <p className="auth-subtitle">Logg inn på organisasjonen din</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Organisasjon (slug)
            <input
              type="text"
              name="organizationSlug"
              value={organizationSlug}
              onChange={(e) => setOrganizationSlug(e.target.value)}
              autoComplete="organization"
              placeholder="min-bedrift"
              required
              disabled={isSubmitting || authLoading}
            />
          </label>

          <label>
            E-post
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              disabled={isSubmitting || authLoading}
            />
          </label>

          <label>
            Passord
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              minLength={8}
              required
              disabled={isSubmitting || authLoading}
            />
          </label>

          <label className="auth-remember">
            <input
              type="checkbox"
              name="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isSubmitting || authLoading}
            />
            <span>Husk meg</span>
          </label>

          {error ? <p className="auth-error" role="alert">{error}</p> : null}

          <button
            type="submit"
            className="auth-submit"
            disabled={isSubmitting || authLoading}
          >
            {isSubmitting ? 'Logger inn…' : 'Logg inn'}
          </button>
        </form>

        <p className="auth-footer">
          Har du ikke konto?{' '}
          <Link className="auth-link" to="/signup">
            Registrer deg
          </Link>
        </p>
      </div>
    </section>
  )
}
