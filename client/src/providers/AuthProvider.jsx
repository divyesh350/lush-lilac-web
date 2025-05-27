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
    loading,
  } = useAuthStore();

  const [internalLoading, setInternalLoading] = useState(true);

  const stableCheckAuth = useCallback(checkAuth, [checkAuth]);
  const stableSetAccessToken = useCallback(setAccessToken, [setAccessToken]);
  const stableSetUser = useCallback(setUser, [setUser]);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const isAuthenticated = await stableCheckAuth();

        if (!isAuthenticated) {
          stableSetAccessToken(null);
          stableSetUser(null);
        }
      } catch (err) {
        console.error('Session restore failed:', err);
        stableSetAccessToken(null);
        stableSetUser(null);
      } finally {
        setInternalLoading(false);
      }
    };

    if (hasHydrated) {
      restoreSession();
    }
  }, [hasHydrated, stableCheckAuth, stableSetAccessToken, stableSetUser]);

  // ✅ Fallback if hydration never triggers (e.g., dev edge case)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasHydrated) {
        setHasHydrated(); // force hydration to continue
      }
    }, 3000);

    return () => clearTimeout(timeout);
  }, [hasHydrated, setHasHydrated]);

  if (!hasHydrated || internalLoading) return <Spinner />;

  return children;
};

export default AuthProvider;
