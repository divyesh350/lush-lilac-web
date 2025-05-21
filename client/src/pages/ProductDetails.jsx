import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';

// Mock product data
const mockProduct = {
  id: '1',
  title: 'Floral Phone Case',
  description: 'Adorn your phone with this beautiful floral case featuring delicate lilac flowers on a soft pastel background. Perfect for adding a touch of cuteness to your everyday tech!',
  price: 19.99,
  variants: [
    { id: 1, phoneModel: 'iPhone 13/14', color: 'Lilac' },
    { id: 2, phoneModel: 'iPhone 13/14', color: 'Pink' },
    { id: 3, phoneModel: 'iPhone 13 Pro/14 Pro', color: 'Lilac' },
    { id: 4, phoneModel: 'iPhone 13 Pro/14 Pro', color: 'Pink' },
    { id: 5, phoneModel: 'Samsung Galaxy S22', color: 'Lilac' },
    { id: 6, phoneModel: 'Samsung Galaxy S22', color: 'Pink' }
  ],
  media: [
    { url: 'https://via.placeholder.com/500x500/F9F0F7/9B6B9E?text=Floral+Phone+Case', type: 'image' },
    { url: 'https://via.placeholder.com/500x500/FFE4E1/9B6B9E?text=Floral+Phone+Case+2', type: 'image' },
    { url: 'https://via.placeholder.com/500x500/FFF4D2/9B6B9E?text=Floral+Phone+Case+3', type: 'image' }
  ],
  reviews: [
    { id: 1, user: 'Emily S.', rating: 5, comment: 'I absolutely love this phone case! It\'s so pretty and well-made.', date: '2023-05-10' },
    { id: 2, user: 'Jessica T.', rating: 4, comment: 'Beautiful design and good quality. Slightly thicker than I expected.', date: '2023-04-22' },
    { id: 3, user: 'Michael K.', rating: 5, comment: 'Bought this for my girlfriend and she adores it!', date: '2023-04-15' }
  ],
  relatedProducts: [
    { id: 2, title: 'Butterfly Phone Case', price: 22.99, media: [] },
    { id: 3, title: 'Pastel Mouse Pad', price: 14.99, media: [] },
    { id: 4, title: 'Flower Mirror', price: 24.99, media: [] }
  ]
};

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({
    phoneModel: '',
    color: ''
  });
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      // In a real app, fetch product by ID from API
      setProduct(mockProduct);
      if (mockProduct.variants && mockProduct.variants.length > 0) {
        setSelectedVariants({
          phoneModel: mockProduct.variants[0].phoneModel,
          color: mockProduct.variants[0].color
        });
      }
      setIsLoading(false);
    }, 800);
  }, [id]);

  // Handle quantity change
  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity > 0 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  // Handle variant selection
  const handleVariantChange = (type, value) => {
    setSelectedVariants(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Handle adding to cart
  const handleAddToCart = () => {
    // In a real app, dispatch an action to add to cart
    console.log('Added to cart:', {
      product,
      variants: selectedVariants,
      quantity
    });
    // Show success notification
  };

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    // In a real app, dispatch an action to toggle wishlist
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-semibold text-dark-purple mb-4">Product Not Found</h1>
        <p className="text-medium-purple mb-8">The product you are looking for does not exist or has been removed.</p>
        <Button to="/shop">Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div className="bg-bg-main py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-8 text-sm">
          <Link to="/" className="text-medium-purple hover:text-primary">Home</Link>
          <span className="mx-2 text-medium-purple">/</span>
          <Link to="/shop" className="text-medium-purple hover:text-primary">Shop</Link>
          <span className="mx-2 text-medium-purple">/</span>
          <span className="text-primary">{product.title}</span>
        </nav>

        {/* Product Details */}
        <div className="flex flex-col md:flex-row gap-10 mb-16">
          {/* Product Images */}
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white rounded-lg overflow-hidden shadow-sm mb-4">
              <img 
                src={product.media[selectedImage].url} 
                alt={product.title} 
                className="w-full h-auto object-contain aspect-square"
              />
            </div>
            
            {/* Thumbnail gallery */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.media.map((image, index) => (
                <motion.button 
                  key={index} 
                  className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 ${selectedImage === index ? 'border-primary' : 'border-transparent'}`}
                  onClick={() => setSelectedImage(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img 
                    src={image.url} 
                    alt={`${product.title} ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-semibold text-dark-purple mb-2">{product.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i key={star} className={`ri-star-${star <= 4.5 ? 'fill' : 'line'}`}></i>
                ))}
              </div>
              <span className="text-medium-purple">({product.reviews.length} reviews)</span>
            </div>
            
            <p className="text-2xl font-medium text-dark-purple mb-6">${product.price.toFixed(2)}</p>
            
            <p className="text-medium-purple mb-6">{product.description}</p>
            
            {/* Variants Selection */}
            <div className="mb-6 space-y-4">
              {/* Phone Model Variant */}
              <div>
                <label className="block text-dark-purple font-medium mb-2">Phone Model</label>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(product.variants.map(v => v.phoneModel))].map((model) => (
                    <button
                      key={model}
                      className={`px-4 py-2 rounded-button border ${
                        selectedVariants.phoneModel === model
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-medium-purple border-[#F9F0F7] hover:border-primary'
                      }`}
                      onClick={() => handleVariantChange('phoneModel', model)}
                    >
                      {model}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Color Variant */}
              <div>
                <label className="block text-dark-purple font-medium mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {[...new Set(product.variants
                    .filter(v => v.phoneModel === selectedVariants.phoneModel)
                    .map(v => v.color))
                  ].map((color) => (
                    <button
                      key={color}
                      className={`px-4 py-2 rounded-button border ${
                        selectedVariants.color === color
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-medium-purple border-[#F9F0F7] hover:border-primary'
                      }`}
                      onClick={() => handleVariantChange('color', color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Quantity Selector */}
            <div className="flex items-center mb-8">
              <label className="block text-dark-purple font-medium mr-4">Quantity</label>
              <div className="flex items-center border border-[#F9F0F7] rounded-button overflow-hidden">
                <button 
                  className="w-10 h-10 flex items-center justify-center text-primary hover:bg-[#F9F0F7]"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <i className="ri-subtract-line"></i>
                </button>
                <span className="w-10 h-10 flex items-center justify-center text-dark-purple">
                  {quantity}
                </span>
                <button 
                  className="w-10 h-10 flex items-center justify-center text-primary hover:bg-[#F9F0F7]"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                >
                  <i className="ri-add-line"></i>
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Button
                onClick={handleAddToCart}
                icon="ri-shopping-bag-line"
                iconPosition="left"
                className="flex-1"
              >
                Add to Cart
              </Button>
              
              <motion.button 
                className={`w-12 h-12 flex items-center justify-center rounded-button border ${
                  isWishlisted 
                    ? 'bg-[#F9F0F7] border-primary' 
                    : 'bg-white border-[#F9F0F7]'
                }`}
                onClick={handleWishlistToggle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className={`${isWishlisted ? 'ri-flower-fill' : 'ri-flower-line'} text-primary text-xl`}></i>
              </motion.button>
            </div>
            
            {/* Additional Info */}
            <div className="border-t border-[#F9F0F7] pt-6 text-medium-purple text-sm">
              <p className="flex items-center mb-2">
                <i className="ri-truck-line mr-2"></i>
                Free shipping for orders over $35
              </p>
              <p className="flex items-center mb-2">
                <i className="ri-refresh-line mr-2"></i>
                Easy 30 day returns
              </p>
              <p className="flex items-center">
                <i className="ri-shield-check-line mr-2"></i>
                Secure checkout
              </p>
            </div>
          </motion.div>
        </div>

        {/* Review Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-dark-purple mb-6">Customer Reviews</h2>
          
          {product.reviews.length > 0 ? (
            <div className="space-y-6">
              {product.reviews.map((review) => (
                <motion.div 
                  key={review.id} 
                  className="bg-white p-6 rounded-lg shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-dark-purple">{review.user}</h3>
                    <span className="text-sm text-medium-purple">{review.date}</span>
                  </div>
                  <div className="flex text-yellow-400 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i key={star} className={`ri-star-${star <= review.rating ? 'fill' : 'line'}`}></i>
                    ))}
                  </div>
                  <p className="text-medium-purple">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <p className="text-medium-purple mb-4">No reviews yet. Be the first to review this product!</p>
              <Button variant="outline">Write a Review</Button>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-semibold text-dark-purple mb-6">You May Also Like</h2>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
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
            {product.relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 