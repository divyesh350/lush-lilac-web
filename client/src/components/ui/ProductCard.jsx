import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from './Button';
import { RiImageLine, RiFlowerFill, RiFlowerLine, RiShoppingBagLine } from '@remixicon/react';
import useWishlistStore from '../../store/useWishlistStore';

const ProductCard = ({ 
  product, 
  isNew = false, 
  variant = 'default',
  onAddToCart,
  onAddToWishlist
}) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const isWishlisted = isInWishlist(product._id);

  // Memoize handlers to prevent unnecessary re-renders
  const handleWishlistToggle = useCallback((e) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
      if (onAddToWishlist) {
        onAddToWishlist(product);
      }
    }
  }, [product, onAddToWishlist, isWishlisted, removeFromWishlist, addToWishlist]);

  const handleAddToCart = useCallback((e) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product);
    }
  }, [product, onAddToCart]);

  // Memoize computed values
  const badgeStyles = useMemo(() => {
    if (variant === 'primary') {
      return 'bg-[#FFE4E1] dark:bg-gray-600 text-[#6BBBFF] dark:text-primary';
    }
    if (variant === 'secondary') {
      return 'bg-[#FFF4D2] dark:bg-gray-600 text-dark-purple dark:text-primary';
    }
    return 'bg-[#D4F1F4] dark:bg-gray-600 text-dark-purple dark:text-primary';
  }, [variant]);

  const priceStyles = useMemo(() => {
    return variant === 'primary' 
      ? 'text-[#6BBBFF] dark:text-primary' 
      : 'text-medium-purple dark:text-text-secondary';
  }, [variant]);

  const titleStyles = useMemo(() => {
    return variant === 'primary'
      ? 'text-[#6BBBFF] dark:text-primary'
      : 'text-dark-purple dark:text-text-primary';
  }, [variant]);

  // Memoize the main image URL
  const mainImageUrl = useMemo(() => {
    return product.media?.[0]?.url;
  }, [product.media]);

  return (
    <motion.div 
      className="category-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Product Image */}
      <Link to={`/product/${product._id}`}>
        <div className="relative h-64 bg-[#F9F0F7] dark:bg-gray-700 overflow-hidden group">
          {mainImageUrl ? (
            <img 
              src={mainImageUrl} 
              alt={product.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary opacity-50">
              <RiImageLine className="w-12 h-12" />
            </div>
          )}
          
          {/* New badge */}
          {isNew && (
            <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs ${badgeStyles}`}>
              New
            </div>
          )}

         
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4">
        {variant === 'new-arrival' ? (
          <>
            {/* New arrival card layout */}
            <div className="flex justify-between items-center mb-2">
              <span className={`${badgeStyles} px-3 py-1 rounded-full text-xs`}>
                New
              </span>
              <span className={`${priceStyles} font-medium`}>
                <small className='text-dark-purple dark:text-text-primary relative -top-1 text-sm'>₹</small>{product.basePrice}
              </span>
            </div>
            <h3 className={`${titleStyles} font-medium`}>
              {product.title}
            </h3>
            <div className="flex justify-between items-center mt-2">
              <Button 
                variant={variant === 'primary' ? 'primary' : 'secondary'} 
                className="px-4 py-2 text-sm"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Default card layout */}
            <h3 className="text-dark-purple dark:text-text-primary font-medium">{product.title}</h3>
            <div className="flex justify-between items-center mt-2">
              <span className="text-medium-purple dark:text-text-secondary font-medium text-base">
                <small className='text-dark-purple dark:text-text-primary relative -top-1 text-sm'>₹</small>{product.basePrice?.toFixed(2)}
              </span>
              <div className="flex space-x-2">
                <motion.button 
                  className={`w-8 h-8 flex items-center justify-center rounded-button border ${
                    isWishlisted 
                      ? 'bg-[#F9F0F7] dark:bg-gray-700 border-primary' 
                      : 'bg-white dark:bg-gray-800 border-[#F9F0F7] dark:border-gray-700'
                  }`}
                  onClick={handleWishlistToggle}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isWishlisted ? 
                    <RiFlowerFill className="w-5 h-5 text-primary" /> : 
                    <RiFlowerLine className="w-5 h-5 text-primary" />
                  }
                </motion.button>

                <motion.button 
                  className="w-8 h-8 flex items-center justify-center rounded-button border bg-white dark:bg-gray-800 border-[#F9F0F7] dark:border-gray-700 hover:border-primary"
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RiShoppingBagLine className="w-5 h-5 text-primary" />
                </motion.button>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard; 