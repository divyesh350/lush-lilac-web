import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import {
  RiSubtractLine,
  RiAddLine,
  RiDeleteBinLine,
  RiSecurePaymentLine
} from '@remixicon/react';

// Mock cart data
const mockCartItems = [
  {
    id: 1,
    product: {
      id: 1,
      title: 'Floral Phone Case',
      price: 19.99,
      media: [{ url: 'https://via.placeholder.com/100x100/F9F0F7/9B6B9E?text=Floral+Case' }]
    },
    variant: {
      phoneModel: 'iPhone 13/14',
      color: 'Lilac'
    },
    quantity: 1
  },
  {
    id: 2,
    product: {
      id: 3,
      title: 'Flower Mirror',
      price: 24.99,
      media: [{ url: 'https://via.placeholder.com/100x100/FFF4D2/9B6B9E?text=Flower+Mirror' }]
    },
    variant: {
      size: 'Medium',
      color: 'Pink'
    },
    quantity: 2
  }
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Calculate subtotal
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  // Apply mock shipping cost (free above $35)
  const shippingCost = subtotal >= 35 ? 0 : 4.99;
  
  // Calculate total
  const total = subtotal + shippingCost - couponDiscount;

  // Handle quantity change
  const handleQuantityChange = (itemId, change) => {
    const updatedItems = cartItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0 && newQuantity <= 10) {
          return { ...item, quantity: newQuantity };
        }
      }
      return item;
    });
    setCartItems(updatedItems);
  };

  // Handle remove item
  const handleRemoveItem = (itemId) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
  };

  // Handle apply coupon
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    // Mock coupon validation
    if (couponCode.toUpperCase() === 'LILAC10') {
      setCouponApplied(true);
      setCouponDiscount(subtotal * 0.1); // 10% discount
    } else {
      setCouponApplied(false);
      setCouponDiscount(0);
    }
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="bg-bg-main dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-semibold text-dark-purple dark:text-white mb-3 mt-10">Your Cart 🛍️</h1>
          <p className="text-medium-purple dark:text-gray-300 max-w-xl mx-auto">
            Review your items and proceed to checkout when you're ready!
          </p>
        </motion.div>

        {cartItems.length === 0 ? (
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center max-w-xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">🌸</div>
            <h2 className="text-xl font-medium text-dark-purple dark:text-white mb-4">Your cart is empty</h2>
            <p className="text-medium-purple dark:text-gray-300 mb-6">
              Looks like you haven't added any cute items to your cart yet.
            </p>
            <Button to="/shop">
              Start Shopping
            </Button>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <motion.div 
              className="lg:w-2/3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[#F9F0F7] dark:border-gray-700">
                  <h2 className="text-xl font-medium text-dark-purple dark:text-white">Shopping Cart ({cartItems.length} items)</h2>
                </div>
                
                <div className="divide-y divide-[#F9F0F7] dark:divide-gray-700">
                  {cartItems.map((item) => (
                    <motion.div 
                      key={item.id} 
                      className="p-6 flex flex-col sm:flex-row gap-4"
                      variants={itemVariants}
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                        <img 
                          src={item.product.media[0].url} 
                          alt={item.product.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-grow">
                        <Link 
                          to={`/product/${item.product.id}`} 
                          className="text-lg font-medium text-dark-purple dark:text-white hover:text-primary dark:hover:text-primary"
                        >
                          {item.product.title}
                        </Link>
                        
                        {/* Variants */}
                        <div className="text-sm text-medium-purple dark:text-gray-300 mt-1 space-y-1">
                          {Object.entries(item.variant).map(([key, value]) => (
                            <p key={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: {value}</p>
                          ))}
                        </div>
                        
                        {/* Price */}
                        <div className="text-primary font-medium mt-2">
                          ${item.product.price.toFixed(2)}
                        </div>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex flex-col sm:items-end gap-2">
                        <div className="flex items-center border border-[#F9F0F7] dark:border-gray-700 rounded-button overflow-hidden">
                          <button 
                            className="w-8 h-8 flex items-center justify-center text-primary hover:bg-[#F9F0F7] dark:hover:bg-gray-700"
                            onClick={() => handleQuantityChange(item.id, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <RiSubtractLine className="w-5 h-5" />
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center text-dark-purple dark:text-white">
                            {item.quantity}
                          </span>
                          <button 
                            className="w-8 h-8 flex items-center justify-center text-primary hover:bg-[#F9F0F7] dark:hover:bg-gray-700"
                            onClick={() => handleQuantityChange(item.id, 1)}
                            disabled={item.quantity >= 10}
                          >
                            <RiAddLine className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <button 
                          className="text-xs text-medium-purple dark:text-gray-400 hover:text-primary dark:hover:text-primary flex items-center"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <RiDeleteBinLine className="w-4 h-4 mr-1" /> Remove
                        </button>
                        
                        <div className="text-dark-purple dark:text-white font-medium mt-1">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div 
              className="lg:w-1/3"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden sticky top-20">
                <div className="p-6 border-b border-[#F9F0F7] dark:border-gray-700">
                  <h2 className="text-xl font-medium text-dark-purple dark:text-white">Order Summary</h2>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-medium-purple dark:text-gray-300">Subtotal</span>
                    <span className="text-dark-purple dark:text-white font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-medium-purple dark:text-gray-300">Shipping</span>
                    <span className="text-dark-purple dark:text-white font-medium">
                      {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  
                  {couponApplied && (
                    <div className="flex justify-between text-green-500">
                      <span>Discount (10%)</span>
                      <span>-${couponDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="pt-4 border-t border-[#F9F0F7] dark:border-gray-700">
                    <div className="flex justify-between text-lg">
                      <span className="font-medium text-dark-purple dark:text-white">Total</span>
                      <span className="font-semibold text-dark-purple dark:text-white">${total.toFixed(2)}</span>
                    </div>
                    
                    <p className="text-xs text-medium-purple dark:text-gray-400 mt-1">
                      Including taxes and duties
                    </p>
                  </div>
                  
                  {/* Coupon Code */}
                  <form onSubmit={handleApplyCoupon} className="pt-4">
                    <label className="block text-dark-purple dark:text-white font-medium mb-2">Have a coupon?</label>
                    <div className="flex">
                      <input 
                        type="text" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code" 
                        className="cute-input dark:bg-gray-700 dark:text-white dark:border-gray-600 flex-1 py-2 px-3 rounded-l-button text-dark-purple"
                      />
                      <button 
                        type="submit" 
                        className="bg-primary hover:bg-[#D4B6D0] text-white px-4 py-2 rounded-r-button font-medium transition-all duration-300 btn-hover whitespace-nowrap"
                      >
                        Apply
                      </button>
                    </div>
                    {couponApplied && (
                      <p className="text-xs text-green-500 mt-1">Coupon applied successfully!</p>
                    )}
                    {couponCode && !couponApplied && (
                      <p className="text-xs text-red-500 mt-1">Invalid coupon code</p>
                    )}
                  </form>
                  
                  {/* Checkout Button */}
                  <Button 
                    fullWidth 
                    className="mt-6"
                    icon="ri-secure-payment-line"
                    iconPosition="left"
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <div className="text-center mt-4">
                    <Link to="/shop" className="text-primary hover:underline text-sm">
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart; 