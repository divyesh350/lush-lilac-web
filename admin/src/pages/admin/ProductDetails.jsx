import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { RiArrowLeftLine } from 'react-icons/ri';
import ProductForm from '../../components/forms/ProductForm';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [product, setProduct] = useState({
    name: 'Floral Summer Dress',
    sku: 'DR-001',
    price: '2499',
    stock: '45',
    description: 'A beautiful floral summer dress perfect for warm days.',
    category: 'Dresses',
    images: ['https://placehold.co/400x400'],
    status: 'active',
    featured: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to update product
    setIsEditing(false);
  };

  const handleImageDelete = (index) => {
    setProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/products')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary"
          >
            <RiArrowLeftLine />
            <span>Back to Products</span>
          </button>
          <h2 className="text-2xl text-primary">Product Details</h2>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit Product'}
        </button>
      </div>

      {/* Product Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ProductForm
          product={product}
          isEditing={isEditing}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditing(false)}
          onImageDelete={handleImageDelete}
        />
      </motion.div>
    </div>
  );
};

export default ProductDetails; 