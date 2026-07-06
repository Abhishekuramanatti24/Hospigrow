// context/AuthContext.jsx
// Single source of truth for authentication state across the app.
// Exposes: user, isAuthenticated, loading (initial hydration check),
// login(), logout().

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from '../services/auth.service';
import { tokenStorage } from '../utils/tokenStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we verify any existing token

  // On first mount, check if a token already exists (e.g. page refresh) and
  // re-hydrate the user by hitting /api/profile. If the token is invalid or
  // expired, the api.js response interceptor will fire `auth:unauthorized`.
  useEffect(() => {
    const bootstrap = async () => {
      const existingToken = tokenStorage.findToken();
      if (!existingToken) {
        setLoading(false);
        return;
      }
      try {
        const profile = await authService.getProfile();
        setUser(profile);
      } catch {
        tokenStorage.clearSession();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  // Listen for global 401s dispatched by the Axios interceptor so we clear
  // React state too (not just storage) and the UI reacts immediately.
  useEffect(() => {
    const handleUnauthorized = () => setUser(null);
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = useCallback(async (email, password, remember) => {
    const { token, user: loggedInUser } = await authService.login(email, password);
    tokenStorage.saveSession({ token, user: loggedInUser, remember });
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Even if the network call fails, we still want to clear the local
      // session — the user's intent to log out should always succeed locally.
    } finally {
      tokenStorage.clearSession();
      setUser(null);
    }
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
