import { create } from 'zustand';
import { axiosInstance } from '../services/authService';
import { toast } from 'react-hot-toast';

const useNewsletterStore = create((set) => ({
  subscribers: [],
  loading: false,
  error: null,

  // Fetch all subscribers
  fetchSubscribers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get('/newsletter/subscribers');
      set({ subscribers: response.data.data, loading: false });
      
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch subscribers',
        loading: false 
      });
      toast.error('Failed to fetch subscribers');
    }
  },

  // Send newsletter
  sendNewsletter: async (subject, content) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post('/newsletter/send', {
        subject,
        content
      });
      toast.success('Newsletter sent successfully');
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to send newsletter',
        loading: false 
      });
      toast.error('Failed to send newsletter');
      throw error;
    }
  },

  // Delete subscriber
  deleteSubscriber: async (email) => {
    set({ loading: true, error: null });
    try {
      await axiosInstance.post('/newsletter/unsubscribe', { email });
      set(state => ({
        subscribers: state.subscribers.filter(sub => sub.email !== email),
        loading: false
      }));
      toast.success('Subscriber removed successfully');
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to remove subscriber',
        loading: false 
      });
      toast.error('Failed to remove subscriber');
    }
  }
}));

export default useNewsletterStore; 