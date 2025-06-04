import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "../components/ui/Button";
import {
  RiSubtractLine,
  RiAddLine,
  RiDeleteBinLine,
  RiSecurePaymentLine,
  RiMoneyDollarCircleLine,
} from "@remixicon/react";
import useCartStore from "src/store/useCartStore";
import { useAuthStore } from "src/store/useAuthStore";
import toast from "react-hot-toast";

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const {
    items: cartItems,
    updateQuantity,
    removeFromCart,
    getTotalAmount,
    processOrder,
    loading,
    clearCart,
    error,
  } = useCartStore();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  // Calculate if COD is available for all items
  const isCodGloballyAvailable = cartItems.every(item => item.productSnapshot?.codAvailable !== false);

  // Calculate subtotal using the store's getTotalAmount
  const subtotal = getTotalAmount();

  // Apply mock shipping cost (free above $35)
  const shippingCost = subtotal >= 35 ? 0 : 4.99;

  // Calculate total
  const total = subtotal + shippingCost;

  // Handle quantity change
  const handleQuantityChange = (productId, variant, change) => {
    const currentItem = cartItems.find(
      (item) =>
        item.productId === productId &&
        item.variant.size === variant.size &&
        item.variant.color === variant.color &&
        item.variant.material === variant.material
    );

    if (currentItem) {
      const newQuantity = currentItem.quantity + change;
      if (newQuantity > 0 && newQuantity <= 10) {
        updateQuantity(productId, variant, newQuantity);
      }
    }
  };

  // Handle remove item
  const handleRemoveItem = (productId, variant) => {
    removeFromCart(productId, variant);
  };

  // Handle payment method selection
  const handlePaymentMethodSelect = async (method) => {
    if (!["razorpay", "cod"].includes(method)) {
      toast.error("Invalid payment method selected");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to proceed with checkout");
      navigate("/login");
      return;
    }

    if (!shippingAddress.trim()) {
      toast.error("Please enter your shipping address");
      return;
    }

    setSelectedPaymentMethod(method);
    setShowPaymentModal(false); // Close modal when initiating payment

    try {
      const res = await processOrder(shippingAddress, method); // Await the promise from processOrder
      // If the promise resolves, the order was successful
      // Pass order data and receiptPDF to the success page
      navigate("/payment-success", { state: { order: res.order, receiptPDF: res.receiptPDF } });
    } catch (error) {
      // If the promise rejects, there was a failure or cancellation
      console.error("Order processing failed or cancelled:", error);
      // The processOrder promise already handles showing a toast message
      navigate("/payment-failure");
    } finally {
      // Ensure loading state is reset regardless of success or failure
      get().set({ loading: false });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
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
          <h1 className="text-3xl md:text-4xl font-semibold text-dark-purple dark:text-white mb-3 mt-10">
            Your Cart 🛍️
          </h1>
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
            <h2 className="text-xl font-medium text-dark-purple dark:text-white mb-4">
              Your cart is empty
            </h2>
            <p className="text-medium-purple dark:text-gray-300 mb-6">
              Looks like you haven't added any cute items to your cart yet.
            </p>
            <Button to="/shop">Start Shopping</Button>
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
                  <h2 className="text-xl font-medium text-dark-purple dark:text-white">
                    Shopping Cart ({cartItems.length} items)
                  </h2>
                </div>

                <div className="divide-y divide-[#F9F0F7] dark:divide-gray-700">
                  {cartItems.map((item) => (
                    <motion.div
                      key={`${item.productSnapshot.title}-${item.variant.size}-${item.variant.color}-${item.variant.material}`}
                      className="p-6 flex flex-col sm:flex-row gap-4"
                      variants={itemVariants}
                    >
                      {/* Product Image */}
                      <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.productSnapshot.thumbnailUrl}
                          alt={item.productSnapshot.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-grow">
                        <Link
                          to={`/product/${item.productId}`}
                          className="text-lg font-medium text-dark-purple dark:text-white hover:text-primary dark:hover:text-primary"
                        >
                          {item.productSnapshot.title}
                        </Link>

                        {/* Variants */}
                        <div className="text-sm text-medium-purple dark:text-gray-300 mt-1 space-y-1">
                          {Object.entries(item.variant).map(([key, value]) => (
                            <p key={key}>
                              {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                              {value}
                            </p>
                          ))}
                        </div>

                        {/* Price */}
                        <div className="text-primary font-medium mt-2">
                          <small className="text-dark-purple dark:text-text-primary relative -top-1 text-sm">
                            ₹
                          </small>
                          {item.price.toFixed(2)}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col sm:items-end gap-2">
                        <div className="flex items-center border border-[#F9F0F7] dark:border-gray-700 rounded-button overflow-hidden">
                          <button
                            className="w-8 h-8 flex items-center justify-center text-primary hover:bg-[#F9F0F7] dark:hover:bg-gray-700"
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.variant,
                                -1
                              )
                            }
                            disabled={item.quantity <= 1}
                          >
                            <RiSubtractLine className="w-5 h-5" />
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center text-dark-purple dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            className="w-8 h-8 flex items-center justify-center text-primary hover:bg-[#F9F0F7] dark:hover:bg-gray-700"
                            onClick={() =>
                              handleQuantityChange(
                                item.productId,
                                item.variant,
                                1
                              )
                            }
                            disabled={item.quantity >= 10}
                          >
                            <RiAddLine className="w-5 h-5" />
                          </button>
                        </div>

                        <button
                          className="text-xs text-medium-purple dark:text-gray-400 hover:text-primary dark:hover:text-primary flex items-center"
                          onClick={() =>
                            handleRemoveItem(item.productId, item.variant)
                          }
                        >
                          <RiDeleteBinLine className="w-4 h-4 mr-1" /> Remove
                        </button>

                        <div className="text-dark-purple dark:text-white font-medium mt-1">
                          <small className="text-dark-purple dark:text-text-primary relative -top-1 text-sm">
                            ₹
                          </small>
                          {(item.price * item.quantity).toFixed(2)}
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
                  <h2 className="text-xl font-medium text-dark-purple dark:text-white">
                    Order Summary
                  </h2>
                </div>

                <div className="p-6 space-y-4">
                  {/* Shipping Address */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-dark-purple dark:text-white">
                      Shipping Address
                    </label>
                    <textarea
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-[#F9F0F7] dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                      placeholder="Enter your complete shipping address"
                    />
                  </div>

                  <div className="flex justify-between">
                    <span className="text-medium-purple dark:text-gray-300">
                      Subtotal
                    </span>
                    <span className="text-dark-purple dark:text-white font-medium">
                      <small className="text-dark-purple dark:text-text-primary relative -top-1 text-sm">
                        ₹
                      </small>
                      {subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-medium-purple dark:text-gray-300">
                      Shipping
                    </span>
                    <span className="text-dark-purple dark:text-white font-medium">
                      {shippingCost === 0
                        ? "Free"
                        : `₹${shippingCost.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-[#F9F0F7] dark:border-gray-700">
                    <div className="flex justify-between text-lg">
                      <span className="font-medium text-dark-purple dark:text-white">
                        Total
                      </span>
                      <span className="font-semibold text-dark-purple dark:text-white">
                        <small className="text-dark-purple dark:text-text-primary relative -top-1 text-sm">
                          ₹
                        </small>
                        {total.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs text-medium-purple dark:text-gray-400 mt-1">
                      Including taxes and duties
                    </p>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    fullWidth
                    className="mt-6"
                    onClick={() => setShowPaymentModal(true)}
                    disabled={loading || !shippingAddress.trim()}
                  >
                    {loading ? "Processing..." : "Proceed to Checkout"}
                  </Button>

                  <div className="text-center mt-4">
                    <Link
                      to="/shop"
                      className="text-primary hover:underline text-sm"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Payment Method Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-medium text-dark-purple dark:text-white mb-4">
                Select Payment Method
              </h3>

              <div className="space-y-4">
                {/* Razorpay */}
                <button
                  onClick={() => handlePaymentMethodSelect("razorpay")}
                  className="w-full flex items-center justify-between p-4 border border-[#F9F0F7] dark:border-gray-700 rounded-lg hover:border-primary dark:hover:border-primary"
                >
                  <div className="flex items-center">
                    <RiSecurePaymentLine className="w-5 h-5 text-primary mr-2" />
                    <span className="text-dark-purple dark:text-white">
                      Pay with Razorpay
                    </span>
                  </div>
                </button>

                {/* Cash on Delivery (Conditionally rendered) */}
                {isCodGloballyAvailable && (
                  <button
                    onClick={() => handlePaymentMethodSelect("cod")}
                    className="w-full flex items-center justify-between p-4 border border-[#F9F0F7] dark:border-gray-700 rounded-lg hover:border-primary dark:hover:border-primary"
                  >
                    <div className="flex items-center">
                      <RiMoneyDollarCircleLine className="w-5 h-5 text-primary mr-2" />
                      <span className="text-dark-purple dark:text-white">
                        Cash on Delivery
                      </span>
                    </div>
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowPaymentModal(false)}
                className="mt-6 w-full text-center text-medium-purple dark:text-gray-300 hover:text-primary dark:hover:text-primary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
