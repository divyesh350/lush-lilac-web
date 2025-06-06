import { create } from 'zustand';
import { axiosInstance } from '../services/authService';
import toast from 'react-hot-toast';

const useOrderStore = create((set, get) => ({
  // State
  orders: [],
  totalOrders: 0,
  currentPage: 1,
  totalPages: 1,
  selectedOrder: null,
  loading: false,
  error: null,

  // Filters
  filters: {
    status: '',
    userId: '',
    startDate: '',
    endDate: '',
  },

  // Actions
  setLoading: (isLoading) => set({ loading: isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  resetFilters: () => set({
    filters: {
      status: '',
      userId: '',
      startDate: '',
      endDate: '',
    }
  }),

  // Fetch Orders
  fetchOrders: async (page = 1) => {
    const orderToast = toast.loading('Fetching orders...');
    
    try {
      set({ loading: true, error: null });
      
      const response = await axiosInstance.get(`/orders?page=${page}&limit=10`);
      set({
        orders: response.data.orders || [],
        totalOrders: response.data.total || 0,
        currentPage: response.data.page,
        totalPages: response.data.pages,
        loading: false
      });

      toast.success('Orders updated', {
        id: orderToast,
      });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch orders';
      set({ 
        error: errorMessage, 
        loading: false,
        orders: []
      });
      toast.error(errorMessage, {
        id: orderToast,
      });
      throw error;
    }
  },

  // Get Single Order
  getOrder: async (id) => {
    const orderToast = toast.loading('Fetching order details...');
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get(`/orders/${id}`);
      set({ selectedOrder: response.data });
      toast.success('Order details loaded', {
        id: orderToast,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch order';
      set({ error: errorMessage });
      toast.error(errorMessage, {
        id: orderToast,
      });
    } finally {
      set({ loading: false });
    }
  },

  // Update Order Status
  updateOrderStatus: async (id, status) => {
    const orderToast = toast.loading('Updating order status...');
    try {
      set({ loading: true, error: null });
      await axiosInstance.put(`/orders/${id}/status`, { status });
      
      // Update the order in the list
      set(state => ({
        orders: state.orders.map(order => 
          order._id === id ? { ...order, status } : order
        ),
        loading: false
      }));

      toast.success('Order status updated successfully', {
        id: orderToast,
      });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update order status';
      set({ error: errorMessage });
      toast.error(errorMessage, {
        id: orderToast,
      });
      throw error;
    }
  },

  // Format currency
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  },

  // Format date
  formatDate: (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  // Get status badge color
  getStatusColor: (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      'in production': 'bg-purple-100 text-purple-800',
      supplied: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  },
}));

export default useOrderStore; 