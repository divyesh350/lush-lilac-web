import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from './Button';
import { RiImageLine, RiFlowerFill, RiFlowerLine, RiShoppingBagLine } from '@remixicon/react';

const ProductCard = ({ 
  product, 
  isNew = false, 
  variant = 'default',
  onAddToCart,
  onAddToWishlist
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Handle wishlist toggle
  const handleWishlistToggle = (e) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <motion.div 
      className="category-card bg-white rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Product Image */}
      <Link to={`/product/${product.id}`}>
        <div className="relative h-64 bg-[#F9F0F7] overflow-hidden group">
          {product.media && product.media.length > 0 ? (
            <img 
              src={product.media[0].url} 
              alt={product.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary opacity-50">
              <RiImageLine className="w-12 h-12" />
            </div>
          )}
          
          {/* New badge */}
          {isNew && (
            <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs
              ${variant === 'primary' ? 'bg-[#FFE4E1] text-[#6BBBFF]' : 
               variant === 'secondary' ? 'bg-[#FFF4D2] text-dark-purple' : 
               'bg-[#D4F1F4] text-dark-purple'}`
            }>
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
              <span className={`
                ${variant === 'primary' ? 'bg-[#FFE4E1] text-[#6BBBFF]' : 
                 variant === 'secondary' ? 'bg-[#FFF4D2] text-dark-purple' : 
                 'bg-[#D4F1F4] text-dark-purple'} 
                px-3 py-1 rounded-full text-xs`
              }>
                New
              </span>
              <span className={`
                ${variant === 'primary' ? 'text-[#6BBBFF]' : 'text-medium-purple'} 
                font-medium`
              }>
                ${product.price?.toFixed(2)}
              </span>
            </div>
            <h3 className={`
              ${variant === 'primary' ? 'text-[#6BBBFF]' : 'text-dark-purple'} 
              font-medium`
            }>
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
              <motion.button 
                className="w-8 h-8 flex items-center justify-center text-medium-purple hover:text-primary"
                onClick={handleWishlistToggle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {isWishlisted ? <RiFlowerFill className="w-6 h-6" style={{color: '#E8D5E4'}} /> : <RiFlowerLine className="w-6 h-6" />}
              </motion.button>
            </div>
          </>
        ) : (
          <>
            {/* Default card layout */}
            <h3 className="text-dark-purple font-medium">{product.title}</h3>
            <div className="flex justify-between items-center mt-2">
              <span className="text-medium-purple font-medium">${product.price?.toFixed(2)}</span>
              <div className="flex space-x-2">
                <motion.button 
                  className="w-8 h-8 flex items-center justify-center text-medium-purple hover:text-primary"
                  onClick={handleWishlistToggle}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isWishlisted ? <RiFlowerFill className="w-6 h-6" style={{color: '#E8D5E4'}} /> : <RiFlowerLine className="w-6 h-6" />}
                </motion.button>
                <motion.button 
                  className="w-8 h-8 flex items-center justify-center text-medium-purple hover:text-primary"
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RiShoppingBagLine className="w-6 h-6" />
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