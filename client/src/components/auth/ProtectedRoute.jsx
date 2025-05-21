import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const hasChecked = useRef(false);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!hasChecked.current && !isAuthenticated) {
        hasChecked.current = true;
        const isAuth = await checkAuth();
        if (!isAuth) {
          navigate('/login', { replace: true });
        }
      }
    };

    if (!isLoading) {
      verifyAuth();
    }
  }, [isAuthenticated, isLoading, checkAuth, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute; 