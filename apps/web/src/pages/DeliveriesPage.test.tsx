import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import DeliveriesPage from './DeliveriesPage'
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
    setError: vi.fn(),
  }),
}))

vi.mock('../components/AddressAutocomplete', () => ({
  default: () => null,
}))

describe('DeliveriesPage', () => {
  it('shows new delivery action', () => {
    renderWithRouter(<DeliveriesPage />)
    expect(
      screen.getByRole('button', { name: /legg til leveranse/i }),
    ).toBeInTheDocument()
  })
})
