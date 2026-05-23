import { useState } from 'react'
import * as api from '../lib/api'
import { ApiError } from '../lib/api'

type DeleteRouteButtonProps = {
  routeId: string
  routeLabel: string
  onDeleted: () => void | Promise<void>
  className?: string
  confirmMessage?: string
}

export default function DeleteRouteButton({
  routeId,
  routeLabel,
  onDeleted,
  className = 'btn-link btn-link--danger',
  confirmMessage = `Slette ruten ${routeLabel}? Leveranser som kun var tildelt denne ruten settes tilbake til «Venter».`,
}: DeleteRouteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    if (!confirm(confirmMessage)) {
      return
    }

    setIsDeleting(true)
    setError(null)
    try {
      await api.deleteRoute(routeId)
      await onDeleted()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Sletting mislyktes')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="delete-route-action">
      <button
        type="button"
        className={className}
        disabled={isDeleting}
        onClick={handleDelete}
      >
        {isDeleting ? 'Sletter…' : 'Slett rute'}
      </button>
      {error ? (
        <p className="page-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
