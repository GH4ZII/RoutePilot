import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import MapPage from './MapPage'
import { renderWithRouter } from '../test/test-utils'

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { role: 'DISPATCHER', organizationId: 'org-1' },
  }),
}))

vi.mock('../lib/useAsync', () => ({
  useAsync: () => ({
    data: [],
    error: null,
    isLoading: false,
    reload: vi.fn(),
  }),
}))

vi.mock('../components/DeliveryMap', () => ({
  default: () => <div data-testid="delivery-map">Kart</div>,
}))

describe('MapPage', () => {
  it('renders without crash when delivery list is empty', () => {
    renderWithRouter(<MapPage />)
    expect(screen.getByTestId('delivery-map')).toBeInTheDocument()
  })
})
