type PlaceholderPageProps = {
  title: string
  description?: string
}

export default function PlaceholderPage({
  title,
  description = 'Kommer i en senere fase.',
}: PlaceholderPageProps) {
  return (
    <div className="page-content">
      <h1>{title}</h1>
      <p className="page-muted">{description}</p>
    </div>
  )
}
