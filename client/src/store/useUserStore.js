import { create } from 'zustand';
import api from '../api/axios';
import { useAuthStore } from './useAuthStore';

const useUserStore = create((set, get) => ({
  // State
  user: null,
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  // Get user profile
  getUserProfile: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get('/users/profile');
      
      if (response.data.success) {
        set({ user: response.data.data, loading: false });
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to fetch profile');
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch profile',
        loading: false 
      });
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      set({ loading: true, error: null });
      
      // Validate required fields
      const { name, email, phone, address } = profileData;
      if (!name && !email && !phone && !address) {
        throw new Error('At least one field is required for update');
      }

      const response = await api.put('/users/profile', profileData);
      
      if (response.data.success) {
        set({ user: response.data.data, loading: false });
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to update profile',
        loading: false 
      });
      throw error;
    }
  },

  // Delete user account
  deleteUserAccount: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.delete('/users/profile');
      
      if (response.data.success) {
        // Clear user data from store
        set({ user: null, loading: false });
        
        // Logout user using auth store
        useAuthStore.getState().logout();
        
        return response.data.message;
      } else {
        throw new Error(response.data.message || 'Failed to delete account');
      }
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete account',
        loading: false 
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => set({
    user: null,
    loading: false,
    error: null
  }),
}));

export default useUserStore;
