import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

vi.mock('leaflet', () => ({
  default: {
    icon: vi.fn(() => ({})),
    map: vi.fn(() => ({
      setView: vi.fn(),
      remove: vi.fn(),
    })),
    tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
    marker: vi.fn(() => ({ addTo: vi.fn(), bindPopup: vi.fn() })),
    polyline: vi.fn(() => ({ addTo: vi.fn() })),
    latLngBounds: vi.fn(),
  },
}))
