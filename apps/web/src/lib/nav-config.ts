export type UserRole = 'ADMIN' | 'DISPATCHER' | 'DRIVER'

export type NavItem = {
  label: string
  path: string
}

const adminNav: NavItem[] = [
  { label: 'Dashboard', path: '/' },
  { label: 'Brukere', path: '/users' },
  { label: 'Sjåfører', path: '/drivers' },
  { label: 'Kjøretøy', path: '/vehicles' },
  { label: 'Depot', path: '/depots' },
  { label: 'Leveranser', path: '/deliveries' },
  { label: 'Kart', path: '/map' },
  { label: 'Ruter', path: '/routes' },
  { label: 'Arkiv', path: '/archive' },
  { label: 'Rapporter', path: '/reports' },
  { label: 'Organisasjon', path: '/settings/org' },
]

const dispatcherNav: NavItem[] = [
  { label: 'Dashboard', path: '/' },
  { label: 'Leveranser', path: '/deliveries' },
  { label: 'Kart', path: '/map' },
  { label: 'Ruter', path: '/routes' },
  { label: 'Arkiv', path: '/archive' },
  { label: 'Rapporter', path: '/reports' },
  { label: 'Sjåfører', path: '/drivers' },
  { label: 'Kjøretøy', path: '/vehicles' },
  { label: 'Depot', path: '/depots' },
]

export function getNavItemsForRole(role: string): NavItem[] {
  if (role === 'ADMIN') return adminNav
  if (role === 'DISPATCHER') return dispatcherNav
  return []
}

export function isWebAppRole(role: string): boolean {
  return role === 'ADMIN' || role === 'DISPATCHER'
}
