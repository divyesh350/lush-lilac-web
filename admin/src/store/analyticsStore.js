import { create } from 'zustand';
import { axiosInstance } from '../services/authService';
import toast from 'react-hot-toast';

const useAnalyticsStore = create((set) => ({
  // Analytics Data
  orderCount: 0,
  customerCount: 0,
  productCount: 0,
  revenue: 0,
  dailyRevenue: [],
  monthlyRevenue: [],
  topProducts: [],
  topVariants: [],
  
  // Loading States
  loading: false,
  error: null,
  analytics: null,

  // Actions
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch Analytics Data
  fetchAnalytics: async () => {
    const analyticsToast = toast.loading('Fetching analytics...');
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get('/analytics');
      const {
        orderCount,
        customerCount,
        productCount,
        revenue,
        dailyRevenue,
        monthlyRevenue,
        topProducts,
        topVariants,
      } = response.data;

      set({
        orderCount,
        customerCount,
        productCount,
        revenue,
        dailyRevenue,
        monthlyRevenue,
        topProducts,
        topVariants,
        analytics: response.data,
        loading: false
      });

      toast.success('Analytics updated', {
        id: analyticsToast,
      });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch analytics';
      set({ 
        error: errorMessage,
        loading: false 
      });
      toast.error(errorMessage, {
        id: analyticsToast,
      });
      throw error;
    }
  },

  // Format currency
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  },

  // Format date for daily revenue
  formatDailyDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  },

  // Format date for monthly revenue
  formatMonthlyDate: (dateString) => {
    const date = new Date(dateString + '-01'); // Add day to make it a valid date
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  },

  // Get chart data for daily revenue
  getDailyChartData: () => {
    const { dailyRevenue, formatDailyDate, formatCurrency } = useAnalyticsStore.getState();
    return {
      labels: dailyRevenue.map(item => formatDailyDate(item._id)),
      datasets: [{
        label: 'Daily Revenue',
        data: dailyRevenue.map(item => item.total),
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 2,
        tension: 0.4,
      }]
    };
  },

  // Get chart data for monthly revenue
  getMonthlyChartData: () => {
    const { monthlyRevenue, formatMonthlyDate, formatCurrency } = useAnalyticsStore.getState();
    return {
      labels: monthlyRevenue.map(item => formatMonthlyDate(item._id)),
      datasets: [{
        label: 'Monthly Revenue',
        data: monthlyRevenue.map(item => item.total),
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 2,
        tension: 0.4,
      }]
    };
  },
}));

export default useAnalyticsStore; 