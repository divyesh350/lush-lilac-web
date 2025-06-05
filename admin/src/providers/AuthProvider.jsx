import { createContext, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    isAuthenticated, 
    isLoading, 
    setLoading, 
    setError,
    login,
    logout,
    clearError 
  } = useAuthStore();

  useEffect(() => {
    const handleAuth = async () => {
      if (!isAuthenticated && location.pathname !== '/admin/login') {
        navigate('/admin/login');
      }
    };

    handleAuth();
  }, [isAuthenticated, location.pathname, navigate]);

  const handleLogin = async (email, password) => {
    const loginToast = toast.loading('Signing in...');
    try {
      setLoading(true);
      clearError();
      const { user, accessToken, refreshToken } = await authService.login(email, password);
      login(user, accessToken, refreshToken);
      toast.success('Welcome back, ' + user.name + '!', {
        id: loginToast,
      });
      navigate('/admin');
    } catch (error) {
      toast.error(error.message || 'Login failed', {
        id: loginToast,
      });
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const logoutToast = toast.loading('Signing out...');
    try {
      setLoading(true);
      await authService.logout();
      logout();
      toast.success('Signed out successfully', {
        id: logoutToast,
      });
      navigate('/admin/login');
    } catch (error) {
      toast.error('Error signing out', {
        id: logoutToast,
      });
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    handleLogin,
    handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 