import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import Spinner from '../components/ui/Spinner';

const AuthProvider = ({ children }) => {
  const {
    setAccessToken,
    setUser,
    checkAuth,
    hasHydrated,
    setHasHydrated,
  } = useAuthStore();

  const [internalLoading, setInternalLoading] = useState(true);

  const stableCheckAuth = useCallback(checkAuth, [checkAuth]);
  const stableSetAccessToken = useCallback(setAccessToken, [setAccessToken]);
  const stableSetUser = useCallback(setUser, [setUser]);

  // Session restoration
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const isAuthenticated = await stableCheckAuth();
        if (!isAuthenticated) {
          stableSetAccessToken(null);
          stableSetUser(null);
        }
      } catch {
        // Silently handle auth errors
        stableSetAccessToken(null);
        stableSetUser(null);
      } finally {
        setInternalLoading(false);
      }
    };

    if (hasHydrated) {
      restoreSession();
    } else {
      // If not hydrated, still set loading to false after a timeout
      const timeout = setTimeout(() => {
        setInternalLoading(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [hasHydrated, stableCheckAuth, stableSetAccessToken, stableSetUser]);

  // Fallback if hydration never triggers
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasHydrated) {
        setHasHydrated();
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [hasHydrated, setHasHydrated]);

  // Show spinner only during initial load
  if (internalLoading && hasHydrated) {
    return <Spinner />;
  }

  return children;
};

export default AuthProvider;
