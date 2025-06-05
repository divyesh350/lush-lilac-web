import { create } from 'zustand';
import { axiosInstance } from '../services/authService';
import toast from 'react-hot-toast';

const useProductStore = create((set, get) => ({
  // State
  products: [],
  totalProducts: 0,
  currentPage: 1,
  totalPages: 1,
  selectedProduct: null,
  isLoading: false,
  error: null,

  // Filters
  filters: {
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    size: '',
    color: '',
    material: '',
  },

  // Actions
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
  resetFilters: () => set({
    filters: {
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      size: '',
      color: '',
      material: '',
    }
  }),

  // Fetch Products
  fetchProducts: async (page = 1) => {
    const { filters } = get();
    const productToast = toast.loading('Fetching products...');
    
    try {
      set({ isLoading: true, error: null });
      
      // Build query string from filters
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        ...filters,
      });

      const response = await axiosInstance.get(`/products?${queryParams}`);
      const { products, total, pages } = response.data;

      set({
        products,
        totalProducts: total,
        currentPage: page,
        totalPages: pages,
      });

      toast.success('Products updated', {
        id: productToast,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch products';
      set({ error: errorMessage });
      toast.error(errorMessage, {
        id: productToast,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Get Single Product
  getProduct: async (id) => {
    const productToast = toast.loading('Fetching product details...');
    try {
      set({ isLoading: true, error: null });
      const response = await axiosInstance.get(`/products/${id}`);
      console.log(response.data)
      set({ selectedProduct: response.data });
      toast.success('Product details loaded', {
        id: productToast,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch product';
      set({ error: errorMessage });
      toast.error(errorMessage, {
        id: productToast,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // Create Product
  createProduct: async (productData) => {
    const productToast = toast.loading('Creating product...');
    try {
      set({ isLoading: true, error: null });
      
      // Create FormData for file upload
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'variants') {
          formData.append(key, JSON.stringify(productData[key]));
        } else if (key === 'media' && productData[key]) {
          productData[key].forEach(file => {
            formData.append('media', file);
          });
        } else {
          formData.append(key, productData[key]);
        }
      });

      const response = await axiosInstance.post('/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh products list
      await get().fetchProducts(get().currentPage);

      toast.success('Product created successfully', {
        id: productToast,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create product';
      set({ error: errorMessage });
      toast.error(errorMessage, {
        id: productToast,
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Update Product
  updateProduct: async (id, productData) => {
    const productToast = toast.loading('Updating product...');
    try {
      set({ isLoading: true, error: null });
      
      // Create FormData for file upload
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'variants') {
          formData.append(key, JSON.stringify(productData[key]));
        } else if (key === 'media' && productData[key]) {
          productData[key].forEach(file => {
            formData.append('media', file);
          });
        } else {
          formData.append(key, productData[key]);
        }
      });

      const response = await axiosInstance.put(`/products/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Refresh products list
      await get().fetchProducts(get().currentPage);

      toast.success('Product updated successfully', {
        id: productToast,
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update product';
      set({ error: errorMessage });
      toast.error(errorMessage, {
        id: productToast,
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete Product
  deleteProduct: async (id) => {
    const productToast = toast.loading('Deleting product...');
    try {
      set({ isLoading: true, error: null });
      await axiosInstance.delete(`/products/${id}`);
      
      // Refresh products list
      await get().fetchProducts(get().currentPage);

      toast.success('Product deleted successfully', {
        id: productToast,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete product';
      set({ error: errorMessage });
      toast.error(errorMessage, {
        id: productToast,
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Toggle Product Status
  toggleProductStatus: async (id, isActive) => {
    const productToast = toast.loading('Updating product status...');
    try {
      set({ isLoading: true, error: null });
      await axiosInstance.put(`/products/${id}`, { isActive });
      
      // Refresh products list
      await get().fetchProducts(get().currentPage);

      toast.success(`Product ${isActive ? 'activated' : 'deactivated'} successfully`, {
        id: productToast,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update product status';
      set({ error: errorMessage });
      toast.error(errorMessage, {
        id: productToast,
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Toggle Featured Status
  toggleFeaturedStatus: async (id, isFeatured) => {
    const productToast = toast.loading('Updating featured status...');
    try {
      set({ isLoading: true, error: null });
      await axiosInstance.put(`/products/${id}`, { isFeatured });
      
      // Refresh products list
      await get().fetchProducts(get().currentPage);

      toast.success(`Product ${isFeatured ? 'featured' : 'unfeatured'} successfully`, {
        id: productToast,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update featured status';
      set({ error: errorMessage });
      toast.error(errorMessage, {
        id: productToast,
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Clear selected product
  clearSelectedProduct: () => set({ selectedProduct: null }),
}));

export default useProductStore; 