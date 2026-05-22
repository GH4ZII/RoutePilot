import type { ReactNode } from 'react'

type PageToolbarProps = {
  title: string
  description?: string
  action?: ReactNode
}

export default function PageToolbar({
  title,
  description,
  action,
}: PageToolbarProps) {
  return (
    <div className="page-toolbar">
      <div>
        <h1>{title}</h1>
        {description ? <p className="page-muted">{description}</p> : null}
      </div>
      {action ? <div className="page-toolbar-actions">{action}</div> : null}
    </div>
  )
}
