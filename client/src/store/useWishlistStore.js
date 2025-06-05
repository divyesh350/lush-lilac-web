import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],
      
      // Add item to wishlist
      addToWishlist: (product) => {
        const { wishlist } = get();
        const exists = wishlist.some(item => item._id === product._id);
        
        if (!exists) {
          set({ wishlist: [...wishlist, product] });
        }
      },
      
      // Remove item from wishlist
      removeFromWishlist: (productId) => {
        const { wishlist } = get();
        set({ wishlist: wishlist.filter(item => item._id !== productId) });
      },
      
      // Check if item is in wishlist
      isInWishlist: (productId) => {
        const { wishlist } = get();
        return wishlist.some(item => item._id === productId);
      },
      
      // Clear wishlist
      clearWishlist: () => {
        set({ wishlist: [] });
      }
    }),
    {
      name: 'wishlist-storage', // unique name for localStorage
    }
  )
);

export default useWishlistStore; 