import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../pages/Login/types/types';
import { AuthRepository } from '../pages/Login/repositories/AuthRepository';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REFRESH_INTERVAL = 60 * 1000;
const TOKEN_EXPIRATION_TIME = 3 * 60 * 60 * 1000;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    return savedAuth === 'true';
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('authToken');
  });

  const [lastLogin, setLastLogin] = useState<number>(() => {
    const savedLastLogin = localStorage.getItem('lastLogin');
    return savedLastLogin ? parseInt(savedLastLogin, 10) : 0;
  });

  const login = (userData: User, authToken: string) => {
    const now = Date.now();
    setIsAuthenticated(true);
    setUser(userData);
    setToken(authToken);
    setLastLogin(now);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('lastLogin', now.toString());
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
    setLastLogin(0);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('lastLogin');
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

      if (timeSinceLogin > TOKEN_EXPIRATION_TIME) {
        try {
          const response = await AuthRepository.refreshToken(token);
          const newToken = response.token;

          setToken(newToken);
          setLastLogin(now);
          localStorage.setItem('authToken', newToken);
          localStorage.setItem('lastLogin', now.toString());

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
  }, [isAuthenticated, token, lastLogin]);

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
