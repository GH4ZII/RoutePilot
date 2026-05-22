import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'
import DashboardPage from './pages/DashboardPage'
import DriverWebNoticePage from './pages/DriverWebNoticePage'
import LoginPage from './pages/LoginPage'
import PlaceholderPage from './pages/PlaceholderPage'
import SignupPage from './pages/SignupPage'
import UsersPage from './pages/UsersPage'
import DriversPage from './pages/DriversPage'
import VehiclesPage from './pages/VehiclesPage'
import DeliveriesPage from './pages/DeliveriesPage'
import MapPage from './pages/MapPage'

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
        <Route path="users" element={<UsersPage />} />
        <Route path="drivers" element={<DriversPage />} />
        <Route path="vehicles" element={<VehiclesPage />} />
        <Route path="deliveries" element={<DeliveriesPage />} />
        <Route path="map" element={<MapPage />} />
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
