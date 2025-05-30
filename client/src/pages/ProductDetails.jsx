import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import useProductStore from '../store/useProductStore';
import useWishlistStore from '../store/useWishlistStore';
import useCartStore from '../store/useCartStore';
import { RiSubtractLine, RiAddLine, RiFlowerFill, RiFlowerLine, RiShoppingBagFill, RiShoppingBagLine } from '@remixicon/react';
import Spinner from '../components/ui/Spinner';

const ProductDetails = () => {
  const { id } = useParams();
  const { 
    selectedProduct, 
    fetchProductById, 
    loading: productLoading, 
    error: productError 
  } = useProductStore();

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { items, addToCart, removeFromCart } = useCartStore();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Remove the memoized isWishlisted and use direct check
  const isWishlisted = selectedProduct ? isInWishlist(selectedProduct._id) : false;

  // Check if product is in cart
  const isInCart = useMemo(() => {
    if (!selectedProduct || !selectedVariant) return false;
    return items.some(item => 
      item.productId === selectedProduct._id && 
      item.variant.size === selectedVariant.size &&
      item.variant.color === selectedVariant.color &&
      item.variant.material === selectedVariant.material
    );
  }, [items, selectedProduct, selectedVariant]);

  // Memoize the product loading effect
  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        try {
          await fetchProductById(id);
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      }
    };
    
    loadProduct();
  }, [id, fetchProductById]);

  // Set initial variant when product loads
  useEffect(() => {
    if (selectedProduct?.variants?.length > 0) {
      setSelectedVariant(selectedProduct.variants[0]);
    }
  }, [selectedProduct]);

  // Memoize handlers
  const handleQuantityChange = useCallback((change) => {
    setQuantity(prev => {
      const newQuantity = prev + change;
      if (newQuantity > 0 && newQuantity <= 10) {
        return newQuantity;
      }
      return prev;
    });
  }, []);

  const handleVariantChange = useCallback((variant) => {
    setSelectedVariant(variant);
  }, []);

  const handleCartToggle = useCallback(() => {
    if (!selectedProduct || !selectedVariant) return;
    
    if (isInCart) {
      removeFromCart(selectedProduct._id, selectedVariant);
    } else {
      addToCart(selectedProduct, selectedVariant, quantity);
    }
  }, [selectedProduct, selectedVariant, quantity, isInCart, addToCart, removeFromCart]);

  const handleWishlistToggle = useCallback(() => {
    if (!selectedProduct) return;
    
    if (isWishlisted) {
      removeFromWishlist(selectedProduct._id);
    } else {
      addToWishlist(selectedProduct);
    }
  }, [selectedProduct, isWishlisted, addToWishlist, removeFromWishlist]);

  // Memoize computed values
  const totalPrice = useMemo(() => {
    return (selectedProduct?.basePrice || 0) + (selectedVariant?.price || 0);
  }, [selectedProduct?.basePrice, selectedVariant?.price]);

  const productMedia = useMemo(() => {
    return selectedProduct?.media || [];
  }, [selectedProduct?.media]);

  const productReviews = useMemo(() => {
    return selectedProduct?.reviews || [];
  }, [selectedProduct?.reviews]);

  const relatedProducts = useMemo(() => {
    return selectedProduct?.relatedProducts || [];
  }, [selectedProduct?.relatedProducts]);

  // Memoize stock status
  const stockStatus = useMemo(() => {
    if (!selectedVariant) {
      return {
        hasStock: false,
        message: 'Select a variant to see stock',
        color: 'gray'
      };
    }
    
    return {
      hasStock: selectedVariant.stock > 0,
      message: selectedVariant.stock > 0 ? `${selectedVariant.stock} in stock` : 'Out of stock',
      color: selectedVariant.stock > 0 ? 'green' : 'red'
    };
  }, [selectedVariant]);

  if (productLoading) {
    return (
      <Spinner/>
    );
  }

  if (productError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-semibold text-dark-purple mb-4">Error Loading Product</h1>
        <p className="text-medium-purple mb-8">{productError}</p>
        <Button to="/shop">Continue Shopping</Button>
      </div>
    );
  }

  if (!selectedProduct) {
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
          <span className="text-primary">{selectedProduct.title}</span>
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
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm mb-4">
              <img 
                src={productMedia[selectedImage]?.url} 
                alt={selectedProduct.title} 
                className="w-full h-auto object-contain aspect-square"
                loading="lazy"
              />
            </div>
            
            {/* Thumbnail gallery */}
            {productMedia.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {productMedia.map((image, index) => (
                  <motion.button 
                    key={index} 
                    className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImage(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img 
                      src={image.url} 
                      alt={`${selectedProduct.title} ${index + 1}`} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Title and Best Seller Badge */}
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-semibold text-dark-purple dark:text-primary">{selectedProduct.title}</h1>
              {selectedProduct?.isFeatured && (
                <span className="bg-yellow-200 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-yellow-700 dark:text-yellow-100">
                  Best Seller
                </span>
              )}
            </div>
            
            {/* Price */}
            <p className="text-2xl font-medium text-dark-purple dark:text-primary mb-6">
              <small className='text-dark-purple dark:text-text-primary relative -top-2 text-sm'>₹</small>{totalPrice.toFixed(2)}
            </p>
            
            {/* Stock Status */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full bg-${stockStatus.color}-500`}></span>
                <span className={`text-sm font-medium text-${stockStatus.color}-600 dark:text-${stockStatus.color}-400`}>
                  {stockStatus.message}
                </span>
              </div>
            </div>
            
            <p className="text-medium-purple dark:text-text-secondary mb-6">{selectedProduct.description}</p>
            
            {/* Variants Selection */}
            {selectedProduct.variants && selectedProduct.variants.length > 0 && (
              <div className="mb-6 space-y-4">
                <div>
                  <label className="block text-dark-purple dark:text-primary font-medium mb-2">Variants</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.variants.map((variant) => (
                      <button
                        key={variant._id}
                        className={`px-4 py-2 rounded-button border ${
                          selectedVariant?._id === variant._id
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white dark:bg-gray-800 text-medium-purple dark:text-text-secondary border-[#F9F0F7] hover:border-primary'
                        }`}
                        onClick={() => handleVariantChange(variant)}
                      >
                        {variant.name} {variant.size && `(${variant.size})`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Quantity Selector */}
            <div className="flex items-center mb-8">
              <label className="block text-dark-purple dark:text-primary font-medium mr-4">Quantity</label>
              <div className="flex items-center border border-[#F9F0F7] dark:border-gray-700 rounded-button overflow-hidden">
                <button 
                  className="w-10 h-10 flex items-center justify-center text-primary hover:bg-[#F9F0F7] dark:hover:bg-gray-700"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <RiSubtractLine className="w-5 h-5" />
                </button>
                <span className="w-10 h-10 flex items-center justify-center text-dark-purple dark:text-primary">
                  {quantity}
                </span>
                <button 
                  className="w-10 h-10 flex items-center justify-center text-primary hover:bg-[#F9F0F7] dark:hover:bg-gray-700"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                >
                  <RiAddLine className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Button
                onClick={handleCartToggle}
                icon={isInCart ? "ri-shopping-bag-fill" : "ri-shopping-bag-line"}
                iconPosition="left"
                className="flex-1"
                disabled={!selectedVariant || selectedVariant.stock === 0}
              >
                {selectedVariant?.stock === 0 ? 'Out of Stock' : isInCart ? 'Remove from Cart' : 'Add to Cart'}
              </Button>
              
              <motion.button 
                className={`w-12 h-12 flex items-center justify-center rounded-button border ${
                  isWishlisted 
                    ? 'bg-[#F9F0F7] dark:bg-gray-700 border-primary' 
                    : 'bg-white dark:bg-gray-800 border-[#F9F0F7] dark:border-gray-700'
                }`}
                onClick={handleWishlistToggle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isWishlisted ? 
                  <RiFlowerFill className="w-6 h-6 text-primary" /> : 
                  <RiFlowerLine className="w-6 h-6 text-primary" />
                }
              </motion.button>
            </div>
            
            {/* Additional Info */}
            <div className="border-t border-[#F9F0F7] dark:border-gray-700 pt-6 text-medium-purple dark:text-text-secondary text-sm">
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
          
          {productReviews.length > 0 ? (
            <div className="space-y-6">
              {productReviews.map((review) => (
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
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-dark-purple mb-6">
              <div className="flex items-center gap-2">
                <RiFlowerFill className="w-7 h-7 text-primary" />
                You May Also Like
              </div>
            </h2>
            
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
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails; 