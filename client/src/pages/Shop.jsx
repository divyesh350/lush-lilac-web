import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';
import { RiArrowLeftSFill, RiArrowRightSFill } from '@remixicon/react';
import useProductStore from '../store/useProductStore';
import Spinner from '../components/ui/Spinner';

// Constants
const CATEGORIES = ['all', 'phone_case', 'mouse_pad', 'mirrors', 'tumblers', 'candles'];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const Shop = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const { 
    products, 
    loading, 
    error, 
    filters, 
    pagination,
    fetchProducts,
    setFilters,
    setPagination
  } = useProductStore();

  const [selectedFilters, setSelectedFilters] = useState({
    category: categoryParam || 'all'
  });

  // Update filters when URL category changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedFilters(prev => ({
        ...prev,
        category: categoryParam
      }));
      setFilters(mapFiltersToAPI({ category: categoryParam }));
    }
  }, [categoryParam, setFilters]);

  // Memoized filter mapping
  const mapFiltersToAPI = useCallback((filters) => ({
    category: filters.category === 'all' ? '' : filters.category,
    search: ''
  }), []);

  // Memoized filter change handler
  const handleFilterChange = useCallback((filterType, value) => {
    const newFilters = {
      ...selectedFilters,
      [filterType]: value
    };
    setSelectedFilters(newFilters);
    setFilters(mapFiltersToAPI(newFilters));
  }, [selectedFilters, setFilters, mapFiltersToAPI]);

  // Memoized pagination handler
  const handlePageChange = useCallback((page) => {
    setPagination(prev => ({ ...prev, page }));
  }, [setPagination]);

  // Memoized clear filters handler
  const handleClearFilters = useCallback(() => {
    const defaultFilters = { category: 'all' };
    setSelectedFilters(defaultFilters);
    setFilters(mapFiltersToAPI(defaultFilters));
  }, [setFilters, mapFiltersToAPI]);

  // Fetch products when filters or pagination changes
  useEffect(() => {
    fetchProducts();
  }, [filters, pagination.page, fetchProducts]);

  // Memoized category title
  const categoryTitle = useMemo(() => {
    const currentCategory = selectedFilters.category;
    if (currentCategory === 'all') return 'All Products';
    
    return currentCategory
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }, [selectedFilters.category]);

  // Memoized pagination buttons
  const paginationButtons = useMemo(() => {
    if (pagination.pages <= 1) return null;

    return (
      <div className="flex justify-center">
        <div className="flex flex-wrap justify-center gap-2">
          <button 
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 text-primary dark:text-text-primary border border-[#F9F0F7] dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            <RiArrowLeftSFill className="text-lg sm:text-xl" />
          </button>
          
          {[...Array(pagination.pages)].map((_, index) => (
            <button
              key={index + 1}
              className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-sm sm:text-base ${
                pagination.page === index + 1
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-gray-800 text-primary dark:text-text-primary border border-[#F9F0F7] dark:border-gray-700'
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          
          <button 
            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 text-primary dark:text-text-primary border border-[#F9F0F7] dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.pages}
          >
            <RiArrowRightSFill className="text-lg sm:text-xl" />
          </button>
        </div>
      </div>
    );
  }, [pagination, handlePageChange]);

  // Loading state
  if (loading) {
    return (
     <Spinner/>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center max-w-2xl mx-auto mt-12">
        <h3 className="text-xl text-red-500 dark:text-red-400 mb-4">Error Loading Products</h3>
        <p className="text-medium-purple dark:text-text-secondary mb-6">{error}</p>
        <Button onClick={fetchProducts}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="bg-bg-main dark:bg-gray-900 min-h-[calc(100vh-4rem)] pt-16 sm:pt-20 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-dark-purple dark:text-primary mb-3 sm:mb-4">
            {categoryTitle} 🌸
          </h1>
          <p className="text-sm sm:text-base text-medium-purple dark:text-text-secondary max-w-xl mx-auto px-4">
            {selectedFilters.category === 'all'
              ? 'Discover our complete collection of adorable accessories designed to bring joy to your everyday life.'
              : `Browse our collection of ${categoryTitle.toLowerCase()} designed to bring joy to your everyday life.`
            }
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <motion.div 
            className="lg:w-1/4 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-sm h-fit lg:sticky lg:top-24"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-lg sm:text-xl font-medium text-dark-purple dark:text-primary mb-4 sm:mb-6">Filters</h2>
            
            {/* Category Filter */}
            <div className="mb-4 sm:mb-6">
              <h3 className="text-medium-purple dark:text-text-secondary font-medium mb-3 sm:mb-4 text-sm sm:text-base">Category</h3>
              <div className="space-y-2 sm:space-y-3">
                {CATEGORIES.map((cat) => (
                  <div key={cat} className="flex items-center">
                    <input 
                      type="radio" 
                      id={`cat-${cat}`} 
                      name="category" 
                      checked={selectedFilters.category === cat}
                      onChange={() => handleFilterChange('category', cat)}
                      className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 accent-primary cursor-pointer"
                    />
                    <label htmlFor={`cat-${cat}`} className="text-medium-purple dark:text-text-secondary cursor-pointer text-sm sm:text-base">
                      {cat === 'all' ? 'All Categories' : cat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Clear Filters Button */}
            {selectedFilters.category !== 'all' && (
              <Button 
                variant="outline" 
                className="w-full mt-4 text-sm sm:text-base"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            )}
          </motion.div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {products.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 sm:p-8 text-center">
                <h3 className="text-lg sm:text-xl text-dark-purple dark:text-primary mb-3 sm:mb-4">No products found</h3>
                <p className="text-sm sm:text-base text-medium-purple dark:text-text-secondary mb-4 sm:mb-6">
                  We couldn't find any products matching your criteria. Try changing your filters.
                </p>
                <Button onClick={handleClearFilters} className="text-sm sm:text-base">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </motion.div>
                
                {/* Pagination */}
                {paginationButtons && (
                  <div className="mt-8 sm:mt-10">
                    {paginationButtons}
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