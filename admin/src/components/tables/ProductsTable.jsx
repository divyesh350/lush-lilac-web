import { useState, useCallback } from 'react';
import { RiAddLine, RiDeleteBinLine, RiEditLine } from 'react-icons/ri';
import BaseTable from './BaseTable';
import TablePagination from './TablePagination';
import TableToolbar from './TableToolbar';
import debounce from 'lodash/debounce';

const ProductsTable = ({
  products,
  onEdit,
  onDelete,
  onAdd,
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Create a debounced search handler
  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchQuery(value);
    }, 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (value) => {
    debouncedSearch(value);
  };

  const columns = [
    {
      key: 'name',
      label: 'Product Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.images[0]}
            alt={value}
            className="w-10 h-10 rounded-lg object-cover"
          />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'sku',
      label: 'SKU',
      sortable: true,
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (value) => `₹${value}`,
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === 'active'
              ? 'bg-green-100 text-green-800'
              : value === 'draft'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(row.id)}
            className="p-1 text-gray-600 hover:text-primary"
          >
            <RiEditLine />
          </button>
          <button
            onClick={() => onDelete(row.id)}
            className="p-1 text-gray-600 hover:text-red-500"
          >
            <RiDeleteBinLine />
          </button>
        </div>
      ),
    },
  ];

  const filteredProducts = products.filter((product) =>
    Object.values(product).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key, direction) => {
    // Implement sorting logic here
    console.log('Sorting by:', key, direction);
  };

  const handleSelect = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (checked) => {
    setSelectedRows(checked ? paginatedProducts.map((product) => product.id) : []);
  };

  const toolbarActions = [
    {
      label: 'Add Product',
      icon: <RiAddLine />,
      onClick: onAdd,
    },
    {
      label: 'Delete Selected',
      icon: <RiDeleteBinLine />,
      onClick: () => {
        // Implement bulk delete
        console.log('Deleting:', selectedRows);
      },
      disabled: selectedRows.length === 0,
      variant: 'secondary',
    },
  ];

  return (
    <div>
      <TableToolbar
        searchQuery={searchQuery}
        onSearch={handleSearchChange}
        actions={toolbarActions}
        selectedCount={selectedRows.length}
      />
      <BaseTable
        columns={columns}
        data={paginatedProducts}
        onSort={handleSort}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        selectedRows={selectedRows}
        loading={loading}
      />
      <div className="mt-4">
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default ProductsTable; 