import { create } from 'zustand';
import axios from '../api/axios';

const useNewsletterStore = create((set) => ({
  loading: false,
  error: null,
  success: false,

  // Subscribe to newsletter
  subscribe: async (email) => {
    try {
      set({ loading: true, error: null, success: false });
      const response = await axios.post('/newsletter/subscribe', { email });
      set({ loading: false, success: true });
      return response.data;
    } catch (error) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to subscribe',
        success: false 
      });
      throw error;
    }
  },

  // Unsubscribe from newsletter
  unsubscribe: async (email) => {
    try {
      set({ loading: true, error: null, success: false });
      const response = await axios.post('/newsletter/unsubscribe', { email });
      set({ loading: false, success: true });
      return response.data;
    } catch (error) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to unsubscribe',
        success: false 
      });
      throw error;
    }
  },

  // Admin: Send newsletter to all subscribers
  sendNewsletter: async ({ subject, content }) => {
    try {
      set({ loading: true, error: null, success: false });
      const response = await axios.post('/newsletter/send', { subject, content });
      set({ loading: false, success: true });
      return response.data;
    } catch (error) {
      set({ 
        loading: false, 
        error: error.response?.data?.message || 'Failed to send newsletter',
        success: false 
      });
      throw error;
    }
  },

  // Reset store state
  reset: () => set({ loading: false, error: null, success: false }),
}));

export default useNewsletterStore;
