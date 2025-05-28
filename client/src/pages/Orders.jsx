import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import Spinner from '../components/ui/Spinner';

import Button from '../components/ui/Button'; // Assuming you have a Button component
import useCartStore from '../store/useCartStore'; // Import the cart store

const Orders = () => {
  const { isAuthenticated } = useAuthStore(); // Still need isAuthenticated for the prompt
  const { userOrders: orders, ordersLoading: loading, ordersError: error, fetchUserOrders } = useCartStore(); // Use state and action from the store

  useEffect(() => {
    // Fetch orders when the component mounts or isAuthenticated changes
    fetchUserOrders();
  }, [isAuthenticated, fetchUserOrders]);

  // Memoize the list of rendered order components
  const renderedOrders = useMemo(() => {
    return orders.map(order => (
      <motion.div
        key={order._id}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center border-b border-[#F9F0F7] dark:border-gray-700 pb-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-dark-purple dark:text-white">Order #{order._id.slice(-6)}</h3>
            <p className="text-sm text-medium-purple dark:text-gray-300">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            {/* Add Payment Details */}
            <p className="text-sm text-medium-purple dark:text-gray-300">Payment Status: {order.paymentInfo?.paid ? 'Paid ✅' : 'Unpaid ❌'}</p>
            <p className="text-sm text-medium-purple dark:text-gray-300">Payment Method: {order.paymentMethod?.toUpperCase() || 'N/A'}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : order.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'}`}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </div>
        </div>

        {/* Order Items Summary (Optional - can expand later if needed)*/}
         <div className="mb-4">
             <h4 className="text-md font-medium text-dark-purple dark:text-white mb-2">Items:</h4>
             <ul className="text-sm text-medium-purple dark:text-gray-300 list-disc list-inside">
                 {order.items.map(item => (
                     <li key={item._id || item.productId}> {item.productSnapshot?.title || 'Product'} x {item.quantity}</li>
                 ))}
             </ul>
         </div>

        <div className="flex justify-between items-center pt-4 border-t border-[#F9F0F7] dark:border-gray-700">
          <span className="text-lg font-semibold text-dark-purple dark:text-white">Total: ₹{order.totalAmount.toFixed(2)}</span>
          {/* Optional: Add a View Details button */}
           <Link to={`/orders/${order._id}`} className="text-primary hover:underline text-sm">View Details</Link>
        </div>
      </motion.div>
    ));
  }, [orders]);

  if (loading) {
    return (
      <Spinner/>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-main py-12 px-4 sm:px-6 lg:px-8 text-red-500">
        <p className="mb-4">Error: {error}</p>
        {!isAuthenticated && (
           <Button to="/login">Login</Button>
        )}
      </div>
    );
  }

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
            Your Orders 📦
          </h1>
          <p className="text-medium-purple dark:text-gray-300 max-w-xl mx-auto">
            Track the status of your recent orders.
          </p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center max-w-xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-4">😥</div>
            <h2 className="text-xl font-medium text-dark-purple dark:text-white mb-4">
              No orders yet
            </h2>
            <p className="text-medium-purple dark:text-gray-300 mb-6">
              Looks like you haven't placed any orders yet.
            </p>
            <Button to="/shop">Start Shopping</Button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Use the memoized list */}
            {renderedOrders}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders; 