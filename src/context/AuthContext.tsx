import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../pages/Login/types/types';
import { AuthRepository } from '../pages/Login/repositories/AuthRepository';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (user: User, accessToken: string, refreshToken: string, rememberMe?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REFRESH_INTERVAL = 60 * 1000; // Check every minute
const ACCESS_TOKEN_EXPIRATION = 3 * 60 * 60; // 3 hours in seconds
const REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60; // 7 days in seconds
const REFRESH_THRESHOLD = 30 * 60; // Refresh 30 min before accessToken expires (in seconds)

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
    return localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  });

  const [refreshToken, setRefreshToken] = useState<string | null>(() => {
    return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
  });

  const [lastLogin, setLastLogin] = useState<number>(() => {
    const savedLastLogin = localStorage.getItem('lastLogin') || sessionStorage.getItem('lastLogin');
    return savedLastLogin ? parseInt(savedLastLogin, 10) : 0;
  });

  const [rememberMe, setRememberMe] = useState<boolean>(() => {
    return localStorage.getItem('rememberMe') === 'true';
  });

  const login = (userData: User, accessToken: string, refreshTokenValue: string, shouldRemember: boolean = false) => {
    const now = Date.now();
    setIsAuthenticated(true);
    setUser(userData);
    setToken(accessToken);
    setRefreshToken(refreshTokenValue);
    setLastLogin(now);
    setRememberMe(shouldRemember);

    const storage = shouldRemember ? localStorage : sessionStorage;
    storage.setItem('isAuthenticated', 'true');
    storage.setItem('user', JSON.stringify(userData));
    storage.setItem('accessToken', accessToken);
    storage.setItem('refreshToken', refreshTokenValue);
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
    setRefreshToken(null);
    setLastLogin(0);
    setRememberMe(false);

    // Clear from both storages
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('lastLogin');
    localStorage.removeItem('rememberMe');

    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('lastLogin');
  };

  useEffect(() => {
    if (isAuthenticated && (!token || !refreshToken)) {
      logout();
    }
  }, [isAuthenticated, token, refreshToken]);

  useEffect(() => {
    const checkTokenRefresh = async () => {
      if (!isAuthenticated || !token || !refreshToken || !lastLogin) return;

      const now = Date.now();
      const secondsSinceLogin = Math.floor((now - lastLogin) / 1000);

      // Check if refreshToken has expired (7 days)
      if (secondsSinceLogin > REFRESH_TOKEN_EXPIRATION) {
        console.log('Refresh token expired (7 days). Logging out...');
        logout();
        return;
      }

      // Refresh accessToken BEFORE it expires (30 min before 3 hours = 2.5 hours)
      if (secondsSinceLogin > ACCESS_TOKEN_EXPIRATION - REFRESH_THRESHOLD) {
        try {
          console.log('Refreshing access token before expiration...');
          const response = await AuthRepository.refreshToken(refreshToken);
          const newAccessToken = response.accessToken;

          setToken(newAccessToken);
          setLastLogin(now);

          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem('accessToken', newAccessToken);
          storage.setItem('lastLogin', now.toString());

          console.log('Access token refreshed successfully');
        } catch (error) {
          console.error('Failed to refresh token:', error);
          logout();
        }
      }
    };

    checkTokenRefresh();

    const intervalId = setInterval(checkTokenRefresh, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isAuthenticated, token, refreshToken, lastLogin, rememberMe]);

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
