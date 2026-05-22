import type { FormEvent, ReactNode } from 'react'

type FormModalProps = {
  title: string
  onClose: () => void
  onSubmit: (event: FormEvent) => void
  children: ReactNode
  submitLabel: string
  isSubmitting?: boolean
}

export default function FormModal({
  title,
  onClose,
  onSubmit,
  children,
  submitLabel,
  isSubmitting = false,
}: FormModalProps) {
  return (
    <div className="modal-overlay" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Lukk"
          >
            ×
          </button>
        </div>
        <form className="entity-form" onSubmit={onSubmit}>
          {children}
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Avbryt
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Lagrer…' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
