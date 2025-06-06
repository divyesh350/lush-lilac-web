import { useState, useCallback } from 'react';
import { RiSearchLine } from 'react-icons/ri';
import BaseTable from './BaseTable';
import TablePagination from './TablePagination';
import TableToolbar from './TableToolbar';
import debounce from 'lodash/debounce';

const OrdersTable = ({
  orders = [],
  onView,
  onStatusChange,
  loading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onSearch,
}) => {
  const [searchInput, setSearchInput] = useState('');

  // Create a debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      onSearch(value);
    }, 300),
    [onSearch]
  );

  const handleSearchChange = (value) => {
    setSearchInput(value); // Update local state immediately
    debouncedSearch(value); // Debounce the search
  };

  const columns = [
    {
      key: 'orderId',
      label: 'Order ID',
      sortable: true,
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <span className="font-medium">{row._id}</span>
        </div>
      ),
    },
    {
      key: 'customer',
      label: 'Customer',
      sortable: true,
      render: (_, row) => (
        <div>
          {row.user ? (
            <>
              <div className="font-medium">{row.user.name}</div>
              <div className="text-sm text-gray-500">{row.user.email}</div>
            </>
          ) : (
            <span className="text-gray-500">Guest User</span>
          )}
        </div>
      ),
    },
    {
      key: 'items',
      label: 'Items',
      render: (_, row) => (
        <div>
          <div className="font-medium">{row.items.length} items</div>
          <div className="text-sm text-gray-500">
            {row.items.map(item => item.name).join(', ')}
          </div>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      label: 'Total',
      sortable: true,
      render: (value) => `₹${value}`,
    },
    {
      key: 'paymentMethod',
      label: 'Payment',
      render: (value) => (
        <span className="capitalize">{value}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value, row) => (
        <select
          value={value}
          onChange={(e) => onStatusChange(row._id, e.target.value)}
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'completed'
              ? 'bg-green-100 text-green-800'
              : value === 'in production'
              ? 'bg-blue-100 text-blue-800'
              : value === 'supplied'
              ? 'bg-purple-100 text-purple-800'
              : value === 'accepted'
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
      ),
    },
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (_, row) => (
        <div>
          <div>{new Date(row.createdAt).toLocaleDateString()}</div>
          <div className="text-sm text-gray-500">
            {new Date(row.createdAt).toLocaleTimeString()}
          </div>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button
          onClick={() => onView(row)}
          className="px-3 py-1 text-sm text-primary hover:text-primary-dark"
        >
          View Details
        </button>
      ),
    },
  ];

  const handleSort = (key, direction) => {
    // Implement sorting logic here
    console.log('Sorting by:', key, direction);
  };

  return (
    <div>
      <TableToolbar
        searchQuery={searchInput}
        onSearch={handleSearchChange}
        placeholder="Search orders by ID, customer name, or email..."
      />
      <BaseTable
        columns={columns}
        data={orders}
        onSort={handleSort}
        loading={loading}
      />
      <div className="mt-4">
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default OrdersTable; 