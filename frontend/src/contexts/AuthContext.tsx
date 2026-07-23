import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/authApi';
import { tokenStorage } from '../services/apiClient';
import { User } from '../types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const USER_STORAGE_KEY = 'taskflow_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    const hasToken = Boolean(tokenStorage.getAccessToken());

    if (storedUser && hasToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  async function login(email: string, password: string) {
    const result = await authApi.login(email, password);
    tokenStorage.setTokens(result.accessToken, result.refreshToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(result.user));
    setUser(result.user);
  }

  async function logout() {
    try {
      await authApi.logout();
    } finally {
      tokenStorage.clear();
      localStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
