import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';

// Mock products for demonstration
const mockProducts = [
  { id: 1, title: 'Floral Phone Case', price: 19.99, media: [] },
  { id: 2, title: 'Pastel Mouse Pad', price: 14.99, media: [] },
  { id: 3, title: 'Flower Mirror', price: 24.99, media: [] },
  { id: 4, title: 'Lilac Candle', price: 16.99, media: [] },
  { id: 5, title: 'Butterfly Phone Case', price: 22.99, media: [] },
  { id: 6, title: 'Floral Mouse Pad', price: 18.99, media: [] },
  { id: 7, title: 'Heart-Shaped Mirror', price: 29.99, media: [] },
  { id: 8, title: 'Pink Tumbler', price: 21.99, media: [] }
];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    category: category || 'all',
    price: 'all',
    sort: 'newest'
  });

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      // In a real app, this would be an API call based on filters
      setProducts(mockProducts);
      setIsLoading(false);
    }, 800);
  }, [selectedFilters]);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
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

  return (
    <div className="bg-bg-main min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-semibold text-dark-purple mb-3">
            {category ? `${category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}` : 'All Products'} 🌸
          </h1>
          <p className="text-medium-purple max-w-xl mx-auto">
            Browse our collection of adorable accessories designed to bring joy to your everyday life.
          </p>
        </motion.div>

        {/* Filters and Product Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div 
            className="lg:w-1/4 bg-white p-6 rounded-lg shadow-sm h-fit"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-medium text-dark-purple mb-4">Filters</h2>
            
            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-medium-purple font-medium mb-2">Category</h3>
              <div className="space-y-2">
                {['all', 'phone-cases', 'mouse-pads', 'mirrors', 'tumblers', 'candles'].map((cat) => (
                  <div key={cat} className="flex items-center">
                    <input 
                      type="radio" 
                      id={`cat-${cat}`} 
                      name="category" 
                      checked={selectedFilters.category === cat}
                      onChange={() => handleFilterChange('category', cat)}
                      className="mr-2 accent-primary"
                    />
                    <label htmlFor={`cat-${cat}`} className="text-medium-purple cursor-pointer">
                      {cat === 'all' ? 'All Categories' : cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price Filter */}
            <div className="mb-6">
              <h3 className="text-medium-purple font-medium mb-2">Price</h3>
              <div className="space-y-2">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under15', label: 'Under $15' },
                  { id: '15to25', label: '$15 - $25' },
                  { id: 'over25', label: 'Over $25' }
                ].map((price) => (
                  <div key={price.id} className="flex items-center">
                    <input 
                      type="radio" 
                      id={`price-${price.id}`} 
                      name="price" 
                      checked={selectedFilters.price === price.id}
                      onChange={() => handleFilterChange('price', price.id)}
                      className="mr-2 accent-primary"
                    />
                    <label htmlFor={`price-${price.id}`} className="text-medium-purple cursor-pointer">
                      {price.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Sort By */}
            <div>
              <h3 className="text-medium-purple font-medium mb-2">Sort By</h3>
              <select 
                value={selectedFilters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="cute-input w-full py-2 px-3 rounded text-dark-purple"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </motion.div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {isLoading ? (
              <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
              </div>
            ) : (
              <>
                {products.length === 0 ? (
                  <div className="bg-white rounded-lg p-8 text-center">
                    <h3 className="text-xl text-dark-purple mb-4">No products found</h3>
                    <p className="text-medium-purple mb-6">
                      We couldn't find any products matching your criteria. Try changing your filters.
                    </p>
                    <Button 
                      onClick={() => setSelectedFilters({ category: 'all', price: 'all', sort: 'newest' })}
                    >
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </motion.div>
                )}
                
                {/* Pagination - simplified for now */}
                {products.length > 0 && (
                  <div className="mt-10 flex justify-center">
                    <div className="flex space-x-2">
                      <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-primary border border-[#F9F0F7]">
                        <i className="ri-arrow-left-s-line"></i>
                      </button>
                      <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white">1</button>
                      <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-primary border border-[#F9F0F7]">2</button>
                      <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-primary border border-[#F9F0F7]">3</button>
                      <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-primary border border-[#F9F0F7]">
                        <i className="ri-arrow-right-s-line"></i>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop; 