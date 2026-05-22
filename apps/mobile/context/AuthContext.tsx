import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import * as api from '@/lib/api';
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from '@/lib/auth-storage';
import {
  clearRememberedLogin,
  setRememberMeEnabled,
  setRememberedLogin,
} from '@/lib/remember-login';
import type { AuthUser, LoginCredentials } from '@/types/auth';

export type LoginOptions = {
  rememberMe?: boolean;
};

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    credentials: LoginCredentials,
    options?: LoginOptions,
  ) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    await clearStoredToken();
    setUser(null);
  }, []);

  const applyAuthResponse = useCallback(
    async (
      response: Awaited<ReturnType<typeof api.login>>,
      rememberMe: boolean,
    ) => {
      await setStoredToken(response.accessToken, rememberMe);
      setUser(response.user);
    },
    [],
  );

  const login = useCallback(
    async (credentials: LoginCredentials, options?: LoginOptions) => {
      const rememberMe = options?.rememberMe ?? false;
      const response = await api.login(credentials);
      if (response.user.role !== 'DRIVER') {
        throw new Error(
          'Denne appen er kun for sjåfører. Bruk webappen for administrator/planlegger.',
        );
      }
      if (!response.user.driverId) {
        throw new Error(
          'Brukeren er ikke koblet til en sjåførprofil. Kontakt planlegger.',
        );
      }
      await setRememberMeEnabled(rememberMe);
      if (rememberMe) {
        await setRememberedLogin({
          organizationSlug: credentials.organizationSlug,
          email: credentials.email,
        });
      } else {
        await clearRememberedLogin();
      }
      await applyAuthResponse(response, rememberMe);
    },
    [applyAuthResponse],
  );

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const token = await getStoredToken();
      if (!token) {
        if (!cancelled) setIsLoading(false);
        return;
      }

      try {
        const me = await api.getMe();
        if (!cancelled) {
          if (me.role !== 'DRIVER' || !me.driverId) {
            await clearStoredToken();
            setUser(null);
          } else {
            setUser(me);
          }
        }
      } catch {
        await clearStoredToken();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
