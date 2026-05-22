import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getNavItemsForRole } from '../lib/nav-config'

export default function AppLayout() {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  const navItems = getNavItemsForRole(user.role)

  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-brand">
          <span className="app-brand-title">RoutePilot</span>
          <span className="app-brand-org">{user.organization.name}</span>
        </div>

        <nav className="app-nav" aria-label="Hovedmeny">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                isActive ? 'app-nav-link active' : 'app-nav-link'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="app-sidebar-footer">
          <p className="app-user-meta">
            {user.name ?? user.email}
            <span className="app-user-role">{user.role}</span>
          </p>
          <button type="button" className="app-signout" onClick={logout}>
            Logg ut
          </button>
        </div>
      </aside>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}
