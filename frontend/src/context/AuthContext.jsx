import React, { createContext, useContext, useState, useEffect } from 'react';
import { logger } from '../utils/logger';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('audio_app_token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [sessionInvalidated, setSessionInvalidated] = useState(false);

  // Helper headers
  const getAuthHeaders = (authToken = token) => ({
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
  });

  // Verify active session / get user profile on load
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: getAuthHeaders(token),
        });

        const data = await res.json();
        logger.api('GET', '/api/auth/me', res.status, data);

        if (res.ok) {
          setUser(data);
          setSessionInvalidated(false);
        } else {
          // Check for single active session invalidation code
          if (data.code === 'SESSION_INVALIDATED') {
            logger.auth('SESSION_INVALIDATED', 'User logged in elsewhere');
            handleSessionInvalidated();
          } else {
            // Token expired or user deleted
            logoutLocally();
          }
        }
      } catch (err) {
        logger.error('Session check error', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, [token]);

  const handleSessionInvalidated = () => {
    localStorage.removeItem('audio_app_token');
    localStorage.removeItem('audio_app_user');
    setToken(null);
    setUser(null);
    setSessionInvalidated(true);
  };

  const logoutLocally = () => {
    localStorage.removeItem('audio_app_token');
    localStorage.removeItem('audio_app_user');
    setToken(null);
    setUser(null);
  };

  const login = async (email, password) => {
    setAuthError(null);
    try {
      logger.auth('Attempting login', { email });
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      logger.api('POST', '/api/auth/login', res.status, data);

      if (!res.ok) {
        setAuthError(data.message || 'Login failed');
        return { success: false, data };
      }

      // Successful login
      localStorage.setItem('audio_app_token', data.token);
      localStorage.setItem('audio_app_user', JSON.stringify(data));
      setToken(data.token);
      setUser(data);
      setSessionInvalidated(false);
      logger.auth('Login successful', { user: data.email, role: data.role });
      return { success: true, data };
    } catch (err) {
      const msg = 'Network error during login';
      logger.error(msg, err);
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password) => {
    setAuthError(null);
    try {
      logger.auth('Attempting registration', { email, name });
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      logger.api('POST', '/api/auth/register', res.status, data);

      if (!res.ok) {
        setAuthError(data.message || 'Registration failed');
        return { success: false, data };
      }

      logger.auth('Registration successful (Pending Admin Approval)', { email });
      return { success: true, data };
    } catch (err) {
      const msg = 'Network error during registration';
      logger.error(msg, err);
      setAuthError(msg);
      return { success: false, message: msg };
    }
  };

  const logout = async () => {
    if (token) {
      try {
        logger.auth('Logging out user', { email: user?.email });
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: getAuthHeaders(token),
        });
      } catch (err) {
        logger.error('Logout API error', err);
      }
    }
    logoutLocally();
  };

  const acknowledgeSessionInvalidated = () => {
    setSessionInvalidated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        sessionInvalidated,
        handleSessionInvalidated,
        login,
        register,
        logout,
        getAuthHeaders,
        acknowledgeSessionInvalidated,
        setAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
