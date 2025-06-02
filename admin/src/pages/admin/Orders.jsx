import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RiSearchLine, RiFilterLine, RiCloseLine } from 'react-icons/ri';
import useOrderStore from '../../store/orderStore';

const Orders = () => {
  const {
    orders,
    totalOrders,
    currentPage,
    totalPages,
    filters,
    isLoading,
    error,
    fetchOrders,
    setFilters,
    resetFilters,
    updateOrderStatus,
    formatCurrency,
    formatDate,
    getStatusColor,
  } = useOrderStore();

  const [showFilters, setShowFilters] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage, filters]);

  const handleSearch = (e) => {
    setFilters({ userId: e.target.value });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ [name]: value });
  };

  const handlePageChange = (page) => {
    fetchOrders(page);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleViewOrder = async (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => fetchOrders(currentPage)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>
          <p className="text-gray-500">Manage customer orders</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user ID..."
                value={filters.userId}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RiFilterLine className="mr-2" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="in production">In Production</option>
                <option value="supplied">Supplied</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="md:col-span-3 flex justify-end gap-2">
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <RiCloseLine className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      #{order._id.slice(-6)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.user.name}</div>
                    <div className="text-sm text-gray-500">{order.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(order.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="in production">In Production</option>
                      <option value="supplied">Supplied</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.paymentMethod.toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.paymentInfo.paid ? 'Paid' : 'Pending'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="text-primary hover:text-primary-dark"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  Order Details #{selectedOrder._id.slice(-6)}
                </h2>
                <button
                  onClick={() => {
                    setShowOrderDetails(false);
                    setSelectedOrder(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <RiCloseLine className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Name: {selectedOrder.user.name}</p>
                    <p className="text-sm text-gray-600">Email: {selectedOrder.user.email}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Shipping Address</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">{selectedOrder.shippingAddress}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Order Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                        <img
                          src={item.productSnapshot.thumbnailUrl}
                          alt={item.productSnapshot.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.productSnapshot.title}</p>
                          <p className="text-sm text-gray-500">
                            Variant: {item.variantKey}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatCurrency(item.price)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Order Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        {formatCurrency(selectedOrder.totalAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium">
                        {selectedOrder.paymentMethod.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status</span>
                      <span className="font-medium">
                        {selectedOrder.paymentInfo.paid ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Status</span>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="in production">In Production</option>
                        <option value="supplied">Supplied</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders; 