import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import { RiDeleteBinLine, RiShoppingBagLine } from '@remixicon/react';

// Mock wishlist data
const mockWishlistItems = [
  {
    id: 1,
    product: {
      id: 1,
      title: 'Floral Phone Case',
      price: 19.99,
      media: [{ url: 'https://via.placeholder.com/100x100/F9F0F7/9B6B9E?text=Floral+Case' }]
    },
    variant: {
      phoneModel: 'iPhone 13/14',
      color: 'Lilac'
    }
  },
  {
    id: 2,
    product: {
      id: 3,
      title: 'Flower Mirror',
      price: 24.99,
      media: [{ url: 'https://via.placeholder.com/100x100/FFF4D2/9B6B9E?text=Flower+Mirror' }]
    },
    variant: {
      size: 'Medium',
      color: 'Pink'
    }
  }
];

const WishList = () => {
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems);

  // Handle remove from wishlist
  const handleRemoveFromWishlist = (itemId) => {
    const updatedItems = wishlistItems.filter(item => item.id !== itemId);
    setWishlistItems(updatedItems);
  };

  // Handle add to cart
  const handleAddToCart = (item) => {
    console.log('Added to cart:', item);
    // TODO: Implement add to cart functionality
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="bg-bg-main dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-semibold text-dark-purple dark:text-white mb-3 mt-10">Your Wishlist 🌸</h1>
          <p className="text-medium-purple dark:text-gray-300 max-w-xl mx-auto">
            Save your favorite items for later!
          </p>
        </motion.div>

        {wishlistItems.length === 0 ? (
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center max-w-xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">💝</div>
            <h2 className="text-xl font-medium text-dark-purple dark:text-white mb-4">Your wishlist is empty</h2>
            <p className="text-medium-purple dark:text-gray-300 mb-6">
              Start adding items to your wishlist to save them for later!
            </p>
            <Button to="/shop">
              Start Shopping
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="p-6 border-b border-[#F9F0F7] dark:border-gray-700">
              <h2 className="text-xl font-medium text-dark-purple dark:text-white">Wishlist Items ({wishlistItems.length})</h2>
            </div>
            
            <div className="divide-y divide-[#F9F0F7] dark:divide-gray-700">
              {wishlistItems.map((item) => (
                <motion.div 
                  key={item.id} 
                  className="p-6 flex flex-col sm:flex-row gap-4"
                  variants={itemVariants}
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                    <img 
                      src={item.product.media[0].url} 
                      alt={item.product.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-grow">
                    <Link 
                      to={`/product/${item.product.id}`} 
                      className="text-lg font-medium text-dark-purple dark:text-white hover:text-primary dark:hover:text-primary"
                    >
                      {item.product.title}
                    </Link>
                    
                    {/* Variants */}
                    <div className="text-sm text-medium-purple dark:text-gray-300 mt-1 space-y-1">
                      {Object.entries(item.variant).map(([key, value]) => (
                        <p key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</p>
                      ))}
                    </div>
                    
                    {/* Price */}
                    <div className="text-primary font-medium mt-2">
                      ${item.product.price.toFixed(2)}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:items-end gap-2">
                    <Button
                      onClick={() => handleAddToCart(item)}
                      icon="ri-shopping-bag-line"
                      iconPosition="left"
                      className="w-full sm:w-auto"
                    >
                      Add to Cart
                    </Button>
                    
                    <button 
                      className="text-xs text-medium-purple dark:text-gray-400 hover:text-primary dark:hover:text-primary flex items-center"
                      onClick={() => handleRemoveFromWishlist(item.id)}
                    >
                      <RiDeleteBinLine className="w-4 h-4 mr-1" /> Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WishList;