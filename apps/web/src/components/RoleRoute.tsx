import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isWebAppRole } from '../lib/nav-config'

type RoleRouteProps = {
  children: ReactNode
  /** Roles allowed on web app shell (admin + dispatcher). */
  webOnly?: boolean
}

export default function RoleRoute({ children, webOnly = true }: RoleRouteProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <section className="auth-page">
        <p>Laster…</p>
      </section>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (webOnly && !isWebAppRole(user.role)) {
    return <Navigate to="/driver-notice" replace />
  }

  return children
}
