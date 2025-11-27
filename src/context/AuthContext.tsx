import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../pages/Login/types/types';
import { AuthRepository } from '../pages/Login/repositories/AuthRepository';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string, rememberMe?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REFRESH_INTERVAL = 60 * 1000; // Check every minute
const TOKEN_EXPIRATION_TIME = 3 * 60 * 60 * 1000; // 3 hours
const REFRESH_THRESHOLD = TOKEN_EXPIRATION_TIME - (30 * 60 * 1000); // Refresh 30 min before expiry (at 2.5 hours)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem('isAuthenticated') || sessionStorage.getItem('isAuthenticated');
    return savedAuth === 'true';
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  });

  const [lastLogin, setLastLogin] = useState<number>(() => {
    const savedLastLogin = localStorage.getItem('lastLogin') || sessionStorage.getItem('lastLogin');
    return savedLastLogin ? parseInt(savedLastLogin, 10) : 0;
  });

  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    return localStorage.getItem('rememberMe') === 'true';
  });

  const login = (userData: User, authToken: string, shouldRemember: boolean = false) => {
    const now = Date.now();
    setIsAuthenticated(true);
    setUser(userData);
    setToken(authToken);
    setLastLogin(now);
    setRememberMe(shouldRemember);

    const storage = shouldRemember ? localStorage : sessionStorage;
    storage.setItem('isAuthenticated', 'true');
    storage.setItem('user', JSON.stringify(userData));
    storage.setItem('authToken', authToken);
    storage.setItem('lastLogin', now.toString());

    if (shouldRemember) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberMe');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    setLastLogin(0);
    setRememberMe(false);

    // Clear from both storages
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('lastLogin');
    localStorage.removeItem('rememberMe');

    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('lastLogin');
  };

  useEffect(() => {
    if (isAuthenticated && !token) {
      logout();
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    const checkTokenRefresh = async () => {
      if (!isAuthenticated || !token || !lastLogin) return;

      const now = Date.now();
      const timeSinceLogin = now - lastLogin;

      // Refresh token BEFORE it expires (at 2.5 hours instead of after 3 hours)
      if (timeSinceLogin > REFRESH_THRESHOLD) {
        try {
          console.log('Refreshing token before expiration...');
          const response = await AuthRepository.refreshToken(token);
          const newToken = response.token;

          setToken(newToken);
          setLastLogin(now);

          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem('authToken', newToken);
          storage.setItem('lastLogin', now.toString());

          console.log('Token refreshed successfully');
        } catch (error) {
          console.error('Failed to refresh token:', error);
          logout();
        }
      }
    };

    checkTokenRefresh();

    const intervalId = setInterval(checkTokenRefresh, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isAuthenticated, token, lastLogin, rememberMe]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
