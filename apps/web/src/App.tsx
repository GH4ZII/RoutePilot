import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'
import DashboardPage from './pages/DashboardPage'
import DriverWebNoticePage from './pages/DriverWebNoticePage'
import LoginPage from './pages/LoginPage'
import PlaceholderPage from './pages/PlaceholderPage'
import SignupPage from './pages/SignupPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route
        path="/driver-notice"
        element={
          <ProtectedRoute>
            <DriverWebNoticePage />
          </ProtectedRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <RoleRoute>
              <AppLayout />
            </RoleRoute>
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route
          path="users"
          element={<PlaceholderPage title="Brukere" />}
        />
        <Route
          path="drivers"
          element={<PlaceholderPage title="Sjåfører" />}
        />
        <Route
          path="vehicles"
          element={<PlaceholderPage title="Kjøretøy" />}
        />
        <Route
          path="deliveries"
          element={<PlaceholderPage title="Leveranser" />}
        />
        <Route
          path="routes"
          element={<PlaceholderPage title="Ruter" />}
        />
        <Route
          path="settings/org"
          element={<PlaceholderPage title="Organisasjon" />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
