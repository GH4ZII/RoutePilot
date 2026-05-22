import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import * as api from '../lib/api'
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from '../lib/auth-storage'
import {
  clearRememberedLogin,
  setRememberMeEnabled,
  setRememberedLogin,
} from '../lib/remember-login'
import type {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
} from '../types/auth'

export type LoginOptions = {
  rememberMe?: boolean
}

type AuthContextValue = {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials, options?: LoginOptions) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const logout = useCallback(() => {
    clearStoredToken()
    setUser(null)
  }, [])

  const applyAuthResponse = useCallback(
    (
      response: Awaited<ReturnType<typeof api.login>>,
      rememberMe: boolean,
    ) => {
      setStoredToken(response.accessToken, rememberMe)
      setUser(response.user)
    },
    [],
  )

  const login = useCallback(
    async (credentials: LoginCredentials, options?: LoginOptions) => {
      const rememberMe = options?.rememberMe ?? false
      const response = await api.login(credentials)
      setRememberMeEnabled(rememberMe)
      if (rememberMe) {
        setRememberedLogin({
          organizationSlug: credentials.organizationSlug,
          email: credentials.email,
        })
      } else {
        clearRememberedLogin()
      }
      applyAuthResponse(response, rememberMe)
    },
    [applyAuthResponse],
  )

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      const response = await api.register(credentials)
      setRememberMeEnabled(true)
      setRememberedLogin({
        organizationSlug: credentials.organizationSlug,
        email: credentials.email,
      })
      applyAuthResponse(response, true)
    },
    [applyAuthResponse],
  )

  useEffect(() => {
    const token = getStoredToken()
    if (!token) {
      setIsLoading(false)
      return
    }

    api
      .getMe()
      .then(setUser)
      .catch(() => {
        clearStoredToken()
        setUser(null)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
