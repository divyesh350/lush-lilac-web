import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import CategoryCard from '../components/ui/CategoryCard';
import useProductStore from '@/store/useProductStore';
import { 
  RiSmartphoneLine,
  RiMouseLine,
  RiContrast2Line,
  RiCupLine,
  RiFireLine
} from '@remixicon/react';

const categories = [
  { name: 'Phone Cases', icon: RiSmartphoneLine, bgColor: '#FFB5D8' },
  { name: 'Mouse Pads', icon: RiMouseLine, bgColor: '#FFF4D2' },
  { name: 'Mirrors', icon: RiContrast2Line, bgColor: '#D4F1F4' },
  { name: 'Glass Tumblers', icon: RiCupLine, bgColor: '#E8D5E4' },
  { name: 'Candles', icon: RiFireLine, bgColor: '#FFB5D8' }
];

const Home = () => {
  const { 
    featuredProducts, 
    fetchFeaturedProducts, 
    loading: productsLoading, 
    error: productsError 
  } = useProductStore();

  // Fetch featured products
  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

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

  return (
    <div className="bg-bg-main dark:bg-bg-main">
      {/* Hero Section */}
      <div className="hero-bg w-full relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <motion.div 
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl font-semibold text-dark-purple dark:text-primary mb-4">
              Welcome to Lush Lilac 🌸
            </h1>
            <p className="text-xl md:text-2xl text-medium-purple dark:text-text-secondary mb-8">
              Where Everything is Pretty & Precious 🌷
            </p>
            <p className="text-medium-purple dark:text-text-secondary mb-8 max-w-md">
              Discover our adorable collection of phone cases, mouse pads, mirrors, tumblers, and candles - all designed to bring a touch of cuteness to your everyday life! 🌼
            </p>
            <Button 
              to="/shop" 
              icon="ri-arrow-right-line" 
              iconPosition="right"
            >
              Shop Now
            </Button>
          </motion.div>
        </div>
        {/* Decorative Flowers handled by Layout component */}
      </div>

      {/* Featured Products (Bestsellers) */}
      <div className="py-16 dark:bg-gray-900 bg-cover bg-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold text-dark-purple dark:text-primary mb-4">Our Bestsellers 🌟</h2>
            <p className="text-medium-purple dark:text-text-secondary max-w-2xl mx-auto">
              Discover our most loved items that are making everyone's day a little brighter and cuter!
            </p>
          </motion.div>

          {productsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-medium-purple dark:text-text-secondary">Loading bestsellers...</p>
            </div>
          ) : productsError ? (
            <div className="text-center py-8">
              <p className="text-red-500">{productsError}</p>
            </div>
          ) : !featuredProducts || featuredProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-medium-purple dark:text-text-secondary">No featured products available at the moment.</p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Shop by Category */}
      <div className="floating-flower-bg dark:bg-gray-800 py-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold text-dark-purple dark:text-primary mb-4">Shop by Category 🌷</h2>
            <p className="text-medium-purple dark:text-text-secondary max-w-2xl mx-auto">
              Find your perfect cute accessory by browsing our adorable categories!
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {categories.map((category, index) => (
              <CategoryCard 
                key={index}
                category={category.name}
                icon={category.icon}
                bgColor={category.bgColor}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home; 