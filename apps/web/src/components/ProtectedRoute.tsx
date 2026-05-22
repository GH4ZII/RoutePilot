import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({
  children,
}: {
  children: ReactNode
}) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <section className="auth-page">
        <p className="auth-subtitle">Laster…</p>
      </section>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}
