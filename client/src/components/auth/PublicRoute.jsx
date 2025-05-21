import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const PublicRoute = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const hasChecked = useRef(false);

  useEffect(() => {
    const verifyAuth = async () => {
      if (!hasChecked.current && !isAuthenticated) {
        hasChecked.current = true;
        const isAuth = await checkAuth();
        if (isAuth) {
          navigate('/', { replace: true });
        }
      }
    };

    if (!isLoading) {
      verifyAuth();
    }
  }, [isAuthenticated, isLoading, checkAuth, navigate]);

  return children;
};

export default PublicRoute; 