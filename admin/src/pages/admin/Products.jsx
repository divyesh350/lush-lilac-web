import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RiAddLine, RiSearchLine, RiFilterLine } from 'react-icons/ri';

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl text-primary mb-2">Products</h2>
        <p className="text-gray-500">Manage your product catalog and inventory.</p>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <RiFilterLine />
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
            <RiAddLine />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Product Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => navigate('/admin/products/1')}
        >
          <div className="aspect-square bg-gray-100 rounded-lg mb-4"></div>
          <h3 className="font-medium mb-1">Floral Summer Dress</h3>
          <p className="text-gray-500 text-sm mb-2">SKU: DR-001</p>
          <div className="flex justify-between items-center">
            <span className="font-medium">₹2,499</span>
            <span className="text-sm text-gray-500">In Stock: 45</span>
          </div>
        </motion.div>

        {/* Add more product cards here */}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-8">
        <p className="text-gray-500 text-sm">Showing 1-12 of 48 products</p>
        <div className="flex gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed">
            ←
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-primary hover:text-primary">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-primary hover:text-primary">
            3
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-primary hover:text-primary">
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products; 