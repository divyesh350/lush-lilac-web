import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import { motion } from 'framer-motion';
import {RiArrowLeftCircleLine} from "@remixicon/react"
import Spinner from '../components/ui/Spinner';
// FaArrowLeft
const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { fetchOrderById, ordersLoading: loading, ordersError: error } = useCartStore();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId)
        .then(data => setOrder(data))
        .catch(err => console.error("Failed to fetch order details:", err));
    }
  }, [orderId, fetchOrderById]);

  if (loading) {
    return (
      <Spinner/>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bg-main dark:bg-gray-900 text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main dark:bg-gray-900 text-text-primary dark:text-gray-300">
        Order not found.
      </div>
    );
  }

  return (
    <div className="bg-bg-main dark:bg-gray-900 py-12 mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <button 
            onClick={() => navigate('/orders')}
            className="flex items-center text-medium-purple dark:text-gray-300 hover:text-primary dark:hover:text-primary mb-4 transition-colors duration-200"
          >
            <RiArrowLeftCircleLine className="mr-2" />
            Back to Orders
          </button>

          <h1 className="text-3xl md:text-4xl font-semibold text-dark-purple dark:text-white mb-6">Order Details #{order._id.slice(-6)}</h1>

          {/* Order Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center border-b border-[#F9F0F7] dark:border-gray-700 pb-4 mb-4">
              <h2 className="text-xl font-semibold text-dark-purple dark:text-white">Summary</h2>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                order.status === 'delivered' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                  : order.status === 'cancelled' 
                  ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100' 
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>
            <p className="text-medium-purple dark:text-gray-300">Order Number: #{order._id.slice(-6)}</p>
            <p className="text-medium-purple dark:text-gray-300">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p className="text-medium-purple dark:text-gray-300">Payment Status: {order.paymentInfo?.paid ? 'Paid ✅' : 'Unpaid ❌'}</p>
            <p className="text-medium-purple dark:text-gray-300">Payment Method: {order.paymentMethod?.toUpperCase() || 'N/A'}</p>
            <p className="text-medium-purple dark:text-gray-300 font-semibold mt-4">Total Amount: ₹{order.totalAmount.toFixed(2)}</p>
          </div>

          {/* Shipping Address */}
           {order.shippingAddress && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-dark-purple dark:text-white mb-4">Shipping Address</h2>
              <p className="text-medium-purple dark:text-gray-300">{order.shippingAddress}</p>
            
            </div>
           )}

          {/* Items */} 
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-dark-purple dark:text-white mb-4">Items</h2>
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item._id || item.productId} className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
                  <img src={item.productSnapshot?.thumbnailUrl} alt={item.productSnapshot?.title} className="w-16 h-16 object-cover rounded mr-4" />
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium text-dark-purple dark:text-white">{item.productSnapshot?.title}</h3>
                    {item.variant && Object.keys(item.variant).length > 0 && (
                        <p className="text-sm text-medium-purple dark:text-gray-300">
                            Variant: {Object.entries(item.variant)
                                .filter(([key]) => key !== '_id' && key !== 'stock')
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(', ')}
                        </p>
                    )}
                    <p className="text-sm text-medium-purple dark:text-gray-300">Quantity: {item.quantity}</p>
                    <p className="text-sm font-semibold text-dark-purple dark:text-white">Price: ₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>


        </motion.div>
      </div>
    </div>
  );
};

export default OrderDetails; 