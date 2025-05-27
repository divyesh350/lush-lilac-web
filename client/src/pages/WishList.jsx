import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import useWishlistStore from '../store/useWishlistStore';

const WishList = () => {
  const { wishlist, removeFromWishlist } = useWishlistStore();

  return (
    <div className="bg-bg-main dark:bg-gray-900 min-h-[calc(100vh-4rem)] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-semibold text-dark-purple dark:text-primary mb-3">My Wishlist 🌸</h1>
          <p className="text-medium-purple dark:text-text-secondary max-w-xl mx-auto">
            Save your favorite items for later and never miss out on what you love.
          </p>
        </motion.div>

        {wishlist.length === 0 ? (
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl text-dark-purple dark:text-primary mb-4">Your wishlist is empty</h3>
            <p className="text-medium-purple dark:text-text-secondary mb-6">
              Start adding items to your wishlist by browsing our collection!
            </p>
            <Button to="/shop">Start Shopping</Button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {wishlist.map((product) => (
              <motion.div
                key={product._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Link to={`/product/${product._id}`}>
                  <img 
                    src={product.media[0]?.url || '/placeholder.jpg'} 
                    alt={product.title}
                    className="w-full h-64 object-cover"
                  />
                </Link>
                <div className="p-4">
                  <h3 className="text-lg font-medium text-dark-purple dark:text-primary mb-2">
                    {product.title}
                  </h3>
                  <p className="text-medium-purple dark:text-text-secondary mb-4">
                    <small className='text-dark-purple dark:text-text-primary relative -top-1 text-sm'>₹</small>
                    {product.basePrice?.toFixed(2)}
                  </p>
                  <div className="flex space-x-2">
                    <Button className="flex-1">Add to Cart</Button>
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="px-4 py-2 text-red-500 hover:text-red-600 transition-colors duration-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WishList;