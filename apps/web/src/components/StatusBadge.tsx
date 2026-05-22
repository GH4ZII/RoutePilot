type StatusBadgeProps = {
  label: string
  className: string
}

export default function StatusBadge({ label, className }: StatusBadgeProps) {
  return <span className={className}>{label}</span>
}
