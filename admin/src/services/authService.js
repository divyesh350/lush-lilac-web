import axios from 'axios';
import useAuthStore from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds

const authService = {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });



      const { user, accessToken, refreshToken } = response.data;

      // Check if user has admin role
      if (!user || user.role !== 'admin') {
        console.error('User role check failed:', user);
        throw new Error('Access denied. Admin privileges required.');
      }

      // Store tokens in auth store
      useAuthStore.getState().setTokens(accessToken, refreshToken);
      useAuthStore.getState().setUser(user);

      // Start auto refresh after successful login
      authService.startAutoRefresh();

      return { user, accessToken, refreshToken };
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw error.message || 'Login failed';
    }
  },

  async refreshToken() {
    try {
      const { refreshToken, user } = useAuthStore.getState();
      
      // Don't refresh if we don't have a refresh token or user
      if (!refreshToken || !user) {
        console.log('Skipping refresh - no token or user');
        return null;
      }
      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken,
      });


      const { user: newUser, accessToken, refreshToken: newRefreshToken } = response.data;

      // Check if user has admin role
      if (!newUser || newUser.role !== 'admin') {
        console.error('User role check failed during refresh:', newUser);
        throw new Error('Access denied. Admin privileges required.');
      }

      // Update tokens in auth store
      useAuthStore.getState().setTokens(accessToken, newRefreshToken);
      useAuthStore.getState().setUser(newUser);

      return { user: newUser, accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error('Refresh token error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      // If refresh fails, clear tokens and redirect to login
      useAuthStore.getState().logout();
      window.location.href = '/admin/login';
      throw error.response?.data?.message || error.message;
    }
  },

  async logout() {
    try {
      const { refreshToken } = useAuthStore.getState();
      if (refreshToken) {
        await axios.post(`${API_URL}/auth/logout`, {
          refreshToken,
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear the store and stop refresh
      authService.stopAutoRefresh();
      useAuthStore.getState().logout();
    }
  },

  // Auto refresh functionality
  refreshInterval: null,
  isRefreshing: false,

  startAutoRefresh() {
    // Clear any existing interval
    this.stopAutoRefresh();

    // Set up interval for subsequent refreshes
    this.refreshInterval = setInterval(async () => {
      if (!this.isRefreshing) {
        try {
          this.isRefreshing = true;
          await this.refreshToken();
        } catch (error) {
          console.error('Auto refresh failed:', error);
          this.stopAutoRefresh();
        } finally {
          this.isRefreshing = false;
        }
      }
    }, REFRESH_INTERVAL);
  },

  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
    this.isRefreshing = false;
  },
};

// Create axios instance with interceptors
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error('Response interceptor error:', {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { accessToken, refreshToken } = await authService.refreshToken();
        if (accessToken && refreshToken) {
          useAuthStore.getState().setTokens(accessToken, refreshToken);
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed in interceptor:', refreshError);
        // If refresh token fails, logout user
        useAuthStore.getState().logout();
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Only start auto refresh if we have both tokens and user
const { accessToken, refreshToken, user } = useAuthStore.getState();
if (accessToken && refreshToken && user) {
  console.log('Starting auto refresh on page load');
  authService.startAutoRefresh();
}

export { authService, axiosInstance }; 