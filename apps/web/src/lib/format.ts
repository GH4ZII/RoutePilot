export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  return new Date(value).toLocaleString('nb-NO', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

export function toDatetimeLocalValue(value: string | null | undefined): string {
  if (!value) return ''
  const date = new Date(value)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function fromDatetimeLocalValue(value: string): string | undefined {
  if (!value.trim()) return undefined
  return new Date(value).toISOString()
}

/** Same calendar day as deadline: 08:00 start, deadline as end (siste frist). */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / 1000).toFixed(1)} km`
}

export function formatDuration(seconds: number): string {
  const totalMinutes = Math.round(seconds / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours > 0) {
    return `${hours} t ${minutes} min`
  }
  return `${minutes} min`
}

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

export function timeWindowsFromDeadline(deadlineLocal: string): {
  timeWindowStart: string
  timeWindowEnd: string
} | null {
  if (!deadlineLocal.trim()) return null
  const [datePart] = deadlineLocal.split('T')
  if (!datePart) return null

  const defaultStart = `${datePart}T08:00`
  if (deadlineLocal <= defaultStart) {
    return {
      timeWindowStart: `${datePart}T06:00`,
      timeWindowEnd: deadlineLocal,
    }
  }

  return {
    timeWindowStart: defaultStart,
    timeWindowEnd: deadlineLocal,
  }
}
