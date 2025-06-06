import { useState } from 'react';
import { RiAddLine, RiDeleteBinLine, RiEditLine, RiEyeLine } from 'react-icons/ri';
import BaseTable from './BaseTable';
import TablePagination from './TablePagination';
import TableToolbar from './TableToolbar';
import useUserStore from '../../store/userStore';
import toast from 'react-hot-toast';

const UsersTable = ({
  users = [],
  onEdit,
  onDelete,
  onView,
  onAdd,
  loading = false,
  currentPage,
  totalPages,
  onPageChange
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const { deleteUser } = useUserStore();

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
            {value?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div>
            <div className="font-medium">{value || 'N/A'}</div>
            <div className="text-sm text-gray-500">{row.email || 'N/A'}</div>
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
              : value === 'customer'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value?.charAt(0)?.toUpperCase() + value?.slice(1) || 'N/A'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created At',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(row._id)}
            className="p-1 text-gray-600 hover:text-primary"
            title="View User"
          >
            <RiEyeLine />
          </button>
          <button
            onClick={() => onEdit(row)}
            className="p-1 text-gray-600 hover:text-primary"
            title="Edit User"
          >
            <RiEditLine />
          </button>
          <button
            onClick={() => onDelete(row._id)}
            className="p-1 text-gray-600 hover:text-red-500"
            title="Delete User"
          >
            <RiDeleteBinLine />
          </button>
        </div>
      ),
    },
  ];

  const filteredUsers = (users || []).filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleSort = (key, direction) => {
    // Implement sorting logic here
    console.log('Sorting by:', key, direction);
  };

  const handleSelect = (id) => {
    setSelectedRows((prev) => {
      // If the id is already selected, remove it
      if (prev.includes(id)) {
        return prev.filter(rowId => rowId !== id);
      }
      // Otherwise, add it to the selection
      return [...prev, id];
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      // Select all visible users
      const visibleUserIds = filteredUsers.map(user => user._id);
      setSelectedRows(visibleUserIds);
    } else {
      // Clear selection
      setSelectedRows([]);
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedRows.length} users?`)) {
      try {
        await Promise.all(selectedRows.map(id => deleteUser(id)));
        setSelectedRows([]);
        toast.success('Selected users deleted successfully');
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error deleting users';
        toast.error(errorMessage);
        console.error('Error deleting users:', error);
      }
    }
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
      onClick: handleBulkDelete,
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
        data={filteredUsers}
        onSort={handleSort}
        onSelect={handleSelect}
        onSelectAll={handleSelectAll}
        selectedRows={selectedRows}
        loading={loading}
        selectable={true}
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

export default UsersTable; 