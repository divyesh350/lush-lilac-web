import { useState } from 'react';
import { motion } from 'framer-motion';
import { RiSearchLine, RiFilterLine, RiEyeLine, RiPencilLine } from 'react-icons/ri';

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const orders = [
    {
      id: 'ORD-38294',
      customer: 'Emma Thompson',
      date: 'May 31, 2025',
      amount: '₹1,249.00',
      status: 'pending',
    },
    {
      id: 'ORD-38293',
      customer: 'Michael Johnson',
      date: 'May 30, 2025',
      amount: '₹789.50',
      status: 'processing',
    },
    {
      id: 'ORD-38292',
      customer: 'Sophia Garcia',
      date: 'May 30, 2025',
      amount: '₹2,349.00',
      status: 'delivered',
    },
    {
      id: 'ORD-38291',
      customer: 'William Davis',
      date: 'May 29, 2025',
      amount: '₹459.99',
      status: 'cancelled',
    },
  ];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'badge-pending';
      case 'processing':
        return 'badge-processing';
      case 'delivered':
        return 'badge-delivered';
      case 'cancelled':
        return 'badge-cancelled';
      default:
        return '';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl text-primary mb-2">Orders</h2>
        <p className="text-gray-500">Manage and track your customer orders.</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <RiFilterLine />
            <span>More Filters</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-3 px-6 font-medium">Order ID</th>
                <th className="pb-3 px-6 font-medium">Customer</th>
                <th className="pb-3 px-6 font-medium">Date</th>
                <th className="pb-3 px-6 font-medium">Amount</th>
                <th className="pb-3 px-6 font-medium">Status</th>
                <th className="pb-3 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-4 px-6">{order.id}</td>
                  <td className="py-4 px-6">{order.customer}</td>
                  <td className="py-4 px-6">{order.date}</td>
                  <td className="py-4 px-6">{order.amount}</td>
                  <td className="py-4 px-6">
                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary">
                        <RiEyeLine />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary">
                        <RiPencilLine />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-gray-500 text-sm">Showing 1-4 of 248 orders</p>
        <div className="flex gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-primary hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed">
            ←
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-primary hover:text-primary">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-primary hover:text-primary">
            3
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-primary hover:text-primary">
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders; 