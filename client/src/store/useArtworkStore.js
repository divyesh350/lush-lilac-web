import { create } from 'zustand';
import api from '../api/axios';

const useArtworkStore = create((set, get) => ({
  // State
  artworks: [],
  loading: false,
  error: null,
  uploadProgress: 0,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),

  // Fetch user's artwork
  getUserArtworks: async () => {
    try {
      set({ loading: true, error: null });
      const response = await api.get('/artworks/user');
      
      // Ensure we're setting an array
      const artworks = Array.isArray(response.data) ? response.data : [];
      set({ artworks, loading: false });
      return artworks;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch artwork',
        loading: false,
        artworks: [] // Reset to empty array on error
      });
      throw error;
    }
  },

  // Upload new artwork
  uploadArtwork: async (file, metadata = {}) => {
    try {
      set({ loading: true, error: null, uploadProgress: 0 });

      // Create FormData
      const formData = new FormData();
      formData.append('media', file);
      
      // Add any additional metadata
      Object.entries(metadata).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Upload with progress tracking
      const response = await api.post('/artworks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          set({ uploadProgress: progress });
        },
      });

      // Update artworks list with new upload
      // Note: response.data.artwork contains the uploaded artwork data
      set((state) => ({
        artworks: [...(Array.isArray(state.artworks) ? state.artworks : []), response.data.artwork],
        loading: false,
        uploadProgress: 100,
      }));

      return response.data.artwork;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to upload artwork',
        loading: false,
        uploadProgress: 0
      });
      throw error;
    }
  },

  // Delete artwork
  deleteArtwork: async (artworkId) => {
    try {
      set({ loading: true, error: null });
      await api.delete(`/artworks/${artworkId}`);
      
      // Remove deleted artwork from state
      set((state) => ({
        artworks: (Array.isArray(state.artworks) ? state.artworks : []).filter(art => art._id !== artworkId),
        loading: false
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete artwork',
        loading: false 
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Reset store
  reset: () => set({
    artworks: [],
    loading: false,
    error: null,
    uploadProgress: 0
  }),
}));

export default useArtworkStore;
