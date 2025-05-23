// src/providers/AuthProvider.jsx
import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../api/axios';

const AuthProvider = ({ children }) => {
  const { setAccessToken, setUser, checkAuth } = useAuthStore();

  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Check if we have stored auth data
        const storedAuth = localStorage.getItem('auth-storage');
        if (!storedAuth) {
          setAccessToken(null);
          setUser(null);
          return;
        }

        const isAuthenticated = await checkAuth();
        if (!isAuthenticated) {
          setAccessToken(null);
          setUser(null);
        }
      } catch (err) {
        console.error('Session restore failed:', err.response?.data?.message || err.message);
        setAccessToken(null);
        setUser(null);
      }
    };

    restoreSession();
  }, [checkAuth, setAccessToken, setUser]);

  return children;
};

export default AuthProvider;
