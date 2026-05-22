import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ApiError } from '../lib/api'
import {
  normalizeOrganizationSlug,
  validateOrganizationSlug,
  validatePassword,
} from '../lib/auth-validation'
import { useAuth } from '../context/AuthContext'

export default function SignupPage() {
  const { register, isAuthenticated, isLoading: authLoading } = useAuth()
  const [organizationName, setOrganizationName] = useState('')
  const [organizationSlug, setOrganizationSlug] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!authLoading && isAuthenticated) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)

    const slugError = validateOrganizationSlug(organizationSlug)
    if (slugError) {
      setError(slugError)
      return
    }

    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        organizationName,
        organizationSlug,
        email,
        password,
        ...(name.trim() ? { name: name.trim() } : {}),
      })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Registrering mislyktes. Prøv igjen.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>RoutePilot</h1>
        <p className="auth-subtitle">Opprett konto og organisasjon</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Organisasjonsnavn
            <input
              type="text"
              name="organizationName"
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
              autoComplete="organization"
              required
              disabled={isSubmitting || authLoading}
            />
          </label>

          <label>
            Organisasjon (slug)
            <span className="auth-hint">
              Kun små bokstaver, tall og bindestrek
            </span>
            <input
              type="text"
              name="organizationSlug"
              value={organizationSlug}
              onChange={(e) =>
                setOrganizationSlug(normalizeOrganizationSlug(e.target.value))
              }
              autoComplete="off"
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
            <span className="auth-hint">Minst 8 tegn</span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
              disabled={isSubmitting || authLoading}
            />
          </label>

          <label>
            Navn (valgfritt)
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              disabled={isSubmitting || authLoading}
            />
          </label>

          {error ? <p className="auth-error" role="alert">{error}</p> : null}

          <button
            type="submit"
            className="auth-submit"
            disabled={isSubmitting || authLoading}
          >
            {isSubmitting ? 'Oppretter konto…' : 'Opprett konto'}
          </button>
        </form>

        <p className="auth-footer">
          Har du allerede konto?{' '}
          <Link className="auth-link" to="/login">
            Logg inn
          </Link>
        </p>
      </div>
    </section>
  )
}
