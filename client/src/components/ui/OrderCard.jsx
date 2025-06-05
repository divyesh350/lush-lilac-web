import React from 'react';
import { motion } from 'framer-motion';
import { RiArrowRightLine } from 'react-icons/ri';

const OrderCard = ({ order }) => {
  // Add basic order details display here
  // You'll likely want to display order number, date, status, total, etc.
  // Example placeholder structure:

  // Format date for better readability (optional)
  const orderDate = order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700 flex justify-between items-center"
    >
      <div className="flex-grow">
        <h3 className="text-lg font-semibold text-dark-purple dark:text-primary">
          Order #{order?._id ? order._id.substring(0, 8) + '...' : 'N/A'}
        </h3>
        <p className="text-sm text-medium-purple dark:text-text-secondary">
          Date: {orderDate}
        </p>
        {/* Add more details like status, total, etc. as needed */}
        {order?.totalAmount && (
          <p className="text-md font-medium text-dark-purple dark:text-text-primary">
            Total: ₹{order.totalAmount.toFixed(2)}
          </p>
        )}
      </div>
      <div>
        {/* Example: Link to a detailed order view page */}
        {/* <button className="text-primary hover:text-primary-dark"><RiArrowRightLine /></button> */}
      </div>
    </motion.div>
  );
};

export default OrderCard; 