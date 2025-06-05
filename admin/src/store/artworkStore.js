import { create } from 'zustand';
import { axiosInstance } from '../services/authService';
import toast from 'react-hot-toast';

const useArtworkStore = create((set, get) => ({
  artworks: [],
  loading: false,
  error: null,
  totalArtworks: 0,
  currentPage: 1,
  totalPages: 1,

  // Fetch all artworks
  fetchArtworks: async (page = 1) => {
    const artworkToast = toast.loading('Fetching artworks...');
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get(`/artworks`);
      
      // Transform the data to include the first media URL as fileUrl
      const transformedArtworks = response.data.map(artwork => ({
        ...artwork,
        fileUrl: artwork.media?.[0]?.url || ''
      }));
      
      set({ 
        artworks: transformedArtworks,
        totalArtworks: transformedArtworks.length,
        currentPage: page,
        totalPages: Math.ceil(transformedArtworks.length / 10),
        loading: false 
      });

      toast.success('Artworks updated', {
        id: artworkToast,
      });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch artworks';
      set({ 
        error: errorMessage, 
        loading: false,
        artworks: []
      });
      toast.error(errorMessage, {
        id: artworkToast,
      });
      throw error;
    }
  },

  // Delete artwork
  deleteArtwork: async (artworkId) => {
    const artworkToast = toast.loading('Deleting artwork...');
    try {
      set({ loading: true, error: null });
      await axiosInstance.delete(`/artworks/${artworkId}`);
      
      // Remove the artwork from the artworks array
      set((state) => ({
        artworks: state.artworks.filter((artwork) => artwork._id !== artworkId),
        loading: false
      }));

      toast.success('Artwork deleted successfully', {
        id: artworkToast,
      });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete artwork';
      set({ 
        error: errorMessage, 
        loading: false 
      });
      toast.error(errorMessage, {
        id: artworkToast,
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null })
}));

export default useArtworkStore; 