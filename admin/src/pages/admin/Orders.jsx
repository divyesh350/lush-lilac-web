import { useEffect, useState, useCallback } from 'react';
import OrdersTable from '../../components/tables/OrdersTable';
import useOrderStore from '../../store/orderStore';
import debounce from 'lodash/debounce';

const Orders = () => {
  const {
    orders,
    totalOrders,
    currentPage,
    totalPages,
    isLoading,
    error,
    fetchOrders,
    updateOrderStatus,
  } = useOrderStore();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Create a debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  useEffect(() => {
    fetchOrders(currentPage, searchQuery);
  }, [currentPage, searchQuery, fetchOrders]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      // Refresh orders after status update
      fetchOrders(currentPage, searchQuery);
    } catch (error) {
      console.error('Failed to update order status:', error);
      // You might want to show a toast or notification here
    }
  };

  const handlePageChange = (page) => {
    fetchOrders(page, searchQuery);
  };

  const handleSearch = (value) => {
    debouncedSearch(value);
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
          onClick={() => fetchOrders(currentPage, searchQuery)}
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
          <p className="text-gray-500">Manage your customer orders</p>
        </div>
        <div className='flex flex-col md:flex-row gap-2'>
          <h2>Total Orders :</h2>
          <p>{totalOrders}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <OrdersTable
          orders={orders}
          onView={handleViewOrder}
          onStatusChange={handleStatusChange}
          loading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onSearch={handleSearch}
        />
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Order Details</h2>
                <button
                  onClick={() => {
                    setShowOrderDetails(false);
                    setSelectedOrder(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Info */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Order Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-medium">{selectedOrder._id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">
                        {new Date(selectedOrder.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedOrder.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : selectedOrder.status === 'in production'
                            ? 'bg-blue-100 text-blue-800'
                            : selectedOrder.status === 'supplied'
                            ? 'bg-purple-100 text-purple-800'
                            : selectedOrder.status === 'accepted'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="accepted">Accepted</option>
                        <option value="in production">In Production</option>
                        <option value="supplied">Supplied</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Payment Method</p>
                      <p className="font-medium capitalize">{selectedOrder.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedOrder.user ? (
                      <>
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium">{selectedOrder.user.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{selectedOrder.user.email}</p>
                        </div>
                      </>
                    ) : (
                      <div className="col-span-2">
                        <p className="text-gray-500">Guest User</p>
                      </div>
                    )}
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Shipping Address</p>
                      <p className="font-medium">{selectedOrder.shippingAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={item.productSnapshot.thumbnailUrl}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <p className="font-medium">₹{item.quantity * item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-medium">Total Amount</p>
                    <p className="text-lg font-medium">₹{selectedOrder.totalAmount}</p>
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