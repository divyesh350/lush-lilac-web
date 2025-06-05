import { create } from 'zustand';
import { axiosInstance } from '../services/authService';

const useAdminStore = create((set) => ({
  loading: false,
  error: null,

  // Delete all users (excluding admins)
  deleteAllUsers: async () => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.delete('/admin/users');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete users';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Delete all products
  deleteAllProducts: async () => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.delete('/admin/products');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete products';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Delete all orders
  deleteAllOrders: async () => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.delete('/admin/orders');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete orders';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Delete all artworks
  deleteAllArtworks: async () => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.delete('/admin/artworks');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete artworks';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Delete all newsletters
  deleteAllNewsletters: async () => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.delete('/admin/newsletters');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete newsletters';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Reset entire database
  resetDatabase: async () => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.delete('/admin/reset');
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to reset database';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // Clear error
  clearError: () => set({ error: null })
}));

export default useAdminStore; 