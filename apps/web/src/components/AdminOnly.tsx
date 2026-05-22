import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'

type AdminOnlyProps = {
  children: ReactNode
}

export default function AdminOnly({ children }: AdminOnlyProps) {
  const { user } = useAuth()

  if (user?.role !== 'ADMIN') {
    return (
      <div className="page-content">
        <h1>Ingen tilgang</h1>
        <p className="page-muted">Kun administratorer har tilgang til denne siden.</p>
      </div>
    )
  }

  return children
}
