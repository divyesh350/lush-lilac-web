import { useState } from 'react';
import { RiAddLine, RiDeleteBinLine, RiEditLine, RiEyeLine } from 'react-icons/ri';
import BaseTable from './BaseTable';
import TablePagination from './TablePagination';
import TableToolbar from './TableToolbar';

const UsersTable = ({
  users,
  onEdit,
  onDelete,
  onView,
  onAdd,
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
            {value.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-gray-500">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === 'admin'
              ? 'bg-purple-100 text-purple-800'
              : value === 'editor'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
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
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(row.id)}
            className="p-1 text-gray-600 hover:text-primary"
            title="View User"
          >
            <RiEyeLine />
          </button>
          <button
            onClick={() => onEdit(row.id)}
            className="p-1 text-gray-600 hover:text-primary"
            title="Edit User"
          >
            <RiEditLine />
          </button>
          <button
            onClick={() => onDelete(row.id)}
            className="p-1 text-gray-600 hover:text-red-500"
            title="Delete User"
          >
            <RiDeleteBinLine />
          </button>
        </div>
      ),
    },
  ];

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
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
    setSelectedRows(checked ? paginatedUsers.map((user) => user.id) : []);
  };

  const toolbarActions = [
    {
      label: 'Add User',
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
        onSearch={setSearchQuery}
        actions={toolbarActions}
        selectedCount={selectedRows.length}
      />
      <BaseTable
        columns={columns}
        data={paginatedUsers}
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

export default UsersTable; 