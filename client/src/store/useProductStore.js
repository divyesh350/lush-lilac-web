import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

const useProductStore = create(
  persist(
    (set, get) => ({
      // State
      products: [],
      featuredProducts: [],
      selectedProduct: null,
      loading: false,
      error: null,
      filters: {
        category: '',
        search: '',
        minPrice: '',
        maxPrice: '',
        size: '',
        color: '',
        material: '',
      },
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },

      // Actions
      setFilters: (filters) => set({ filters: { ...get().filters, ...filters } }),
      setPagination: (pagination) => set({ pagination: { ...get().pagination, ...pagination } }),
      setSelectedProduct: (product) => set({ selectedProduct: product }),

      // Fetch Products
      fetchProducts: async () => {
        try {
          set({ loading: true, error: null });
          const { filters, pagination } = get();
          
          const queryParams = new URLSearchParams({
            page: pagination.page,
            limit: pagination.limit,
            ...filters,
          });

          const response = await api.get(`/products?${queryParams}`);
          const { products, total, pages } = response.data;

          // Filter out inactive products
          const activeProducts = products.filter(product => product.isActive !== false);
          
          // Recalculate total and pages based on active products
          const activeTotal = activeProducts.length;
          const activePages = Math.ceil(activeTotal / pagination.limit);
          set({
            products: activeProducts,
            pagination: {
              ...pagination,
              total: activeTotal,
              pages: activePages,
            },
            loading: false,
          });
        } catch (error) {
          set({
            error: error.response?.data?.message || 'Failed to fetch products',
            loading: false,
          });
        }
      },

      // Fetch Featured Products
      fetchFeaturedProducts: async () => {
        try {
          set({ loading: true, error: null });
          const { pagination } = get();
          
          const queryParams = new URLSearchParams({
            page: pagination.page,
            limit: pagination.limit,
          });

          const response = await api.get(`/products/featured?${queryParams}`);

          if (response.data.success) {
            const { products, total, pages } = response.data;
            
            // Filter out inactive products
            const activeProducts = products.filter(product => product.isActive !== false);
            
            // Recalculate total and pages based on active products
            const activeTotal = activeProducts.length;
            const activePages = Math.ceil(activeTotal / pagination.limit);

            set({ 
              featuredProducts: activeProducts,
              pagination: {
                ...pagination,
                total: activeTotal,
                pages: activePages,
              },
              loading: false 
            });
          } else {
            throw new Error(response.data.message || 'Failed to fetch featured products');
          }
        } catch (error) {
          console.error('Error fetching featured products:', error);
          set({
            error: error.response?.data?.message || error.message || 'Failed to fetch featured products',
            loading: false,
          });
        }
      },

      // Fetch Single Product
      fetchProductById: async (id) => {
        try {
          set({ loading: true, error: null });
          const response = await api.get(`/products/${id}`);
          
          // Check if product is active
          if (response.data.isActive === false) {
            throw new Error('Product is not available');
          }
          
          set({ selectedProduct: response.data, loading: false });
        } catch (error) {
          set({
            error: error.response?.data?.message || error.message || 'Failed to fetch product',
            loading: false,
          });
          throw error;
        }
      },

      

     

      

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'product-storage',
      partialize: (state) => ({
        filters: state.filters,
        pagination: state.pagination,
      }),
    }
  )
);

export default useProductStore; 