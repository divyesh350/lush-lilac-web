import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import CategoryCard from '../components/ui/CategoryCard';

// Mock data for products
const mockBestsellers = [
  { id: 1, title: 'Floral Phone Case', price: 19.99, media: [] },
  { id: 2, title: 'Pastel Mouse Pad', price: 14.99, media: [] },
  { id: 3, title: 'Flower Mirror', price: 24.99, media: [] },
  { id: 4, title: 'Lilac Candle', price: 16.99, media: [] }
];

const mockNewArrivals = [
  { id: 5, title: 'Butterfly Phone Case', price: 22.99, media: [] },
  { id: 6, title: 'Floral Mouse Pad', price: 18.99, media: [] },
  { id: 7, title: 'Heart-Shaped Mirror', price: 29.99, media: [] }
];

const categories = [
  { name: 'Phone Cases', icon: 'ri-smartphone-line', bgColor: '#FFB5D8' },
  { name: 'Mouse Pads', icon: 'ri-mouse-line', bgColor: '#FFF4D2' },
  { name: 'Mirrors', icon: 'ri-contrast-2-line', bgColor: '#D4F1F4' },
  { name: 'Glass Tumblers', icon: 'ri-cup-line', bgColor: '#E8D5E4' },
  { name: 'Candles', icon: 'ri-fire-line', bgColor: '#FFB5D8' }
];

const Home = () => {
  const [bestsellers, setBestsellers] = useState(mockBestsellers);
  const [newArrivals, setNewArrivals] = useState(mockNewArrivals);

  // In a real app, you would fetch the data from the API
  useEffect(() => {
    // Fetch bestsellers and new arrivals from API
    // For now, we'll use the mock data
  }, []);

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
    <div>
      {/* Hero Section */}
      <div className="hero-bg w-full relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <motion.div 
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-5xl font-semibold text-dark-purple mb-4">
              Welcome to Lush Lilac 🌸
            </h1>
            <p className="text-xl md:text-2xl text-medium-purple mb-8">
              Where Everything is Pretty & Precious 🌷
            </p>
            <p className="text-medium-purple mb-8 max-w-md">
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

      {/* Featured Products */}
      <div className="py-16 bg-featured-pattern bg-cover bg-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold text-dark-purple mb-4">Our Bestsellers 🌟</h2>
            <p className="text-medium-purple max-w-2xl mx-auto">
              Discover our most loved items that are making everyone's day a little brighter and cuter!
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </div>
      </div>

      {/* Shop by Category */}
      <div className="floating-flower-bg py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold text-dark-purple mb-4">Shop by Category 🌷</h2>
            <p className="text-medium-purple max-w-2xl mx-auto">
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

      {/* New Arrivals */}
      <div className="py-16 bg-arrivals-pattern bg-cover bg-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-semibold text-dark-purple mb-4">New Arrivals 🌺</h2>
            <p className="text-medium-purple max-w-2xl mx-auto">
              Check out our latest cute additions to the Lush Lilac family!
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {newArrivals.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                isNew={true} 
                variant={index === 0 ? 'primary' : 'default'} 
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home; 