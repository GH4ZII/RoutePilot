const AVATAR_COLORS = [
  '#4f46e5',
  '#7c3aed',
  '#2563eb',
  '#0891b2',
  '#059669',
  '#ca8a04',
  '#ea580c',
  '#dc2626',
]

export function userInitials(name: string | null, email: string): string {
  const source = (name?.trim() || email.split('@')[0] || '?').trim()
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return source.slice(0, 2).toUpperCase()
}

export function userAvatarColor(seed: string): string {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function userDisplayName(name: string | null, email: string): string {
  return name?.trim() || email
}

const MAX_AVATAR_BYTES = 2 * 1024 * 1024

export function readAvatarFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Kun bildefiler er tillatt'))
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      reject(new Error('Bildet må være under 2 MB'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Kunne ikke lese bildet'))
      }
    }
    reader.onerror = () => reject(new Error('Kunne ikke lese bildet'))
    reader.readAsDataURL(file)
  })
}
