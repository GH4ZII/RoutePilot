import { fireEvent, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import LoginPage from './LoginPage'
import { renderWithRouter } from '../test/test-utils'

const loginMock = vi.fn()

vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: loginMock,
    isAuthenticated: false,
    isLoading: false,
    user: null,
  }),
}))

vi.mock('../lib/remember-login', () => ({
  getRememberedLogin: () => null,
  getRememberMeEnabled: () => false,
}))

describe('LoginPage', () => {
  it('shows validation error for short password', async () => {
    renderWithRouter(<LoginPage />)

    fireEvent.change(screen.getByPlaceholderText('min-bedrift'), {
      target: { value: 'test-org' },
    })
    fireEvent.change(screen.getByLabelText(/e-post/i), {
      target: { value: 'user@test.no' },
    })
    fireEvent.change(screen.getByLabelText(/^passord$/i), {
      target: { value: 'short' },
    })
    fireEvent.click(screen.getByRole('button', { name: /logg inn/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/minst 8 tegn/i)
    })
    expect(loginMock).not.toHaveBeenCalled()
  })
})
