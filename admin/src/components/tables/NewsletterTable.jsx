import { useState } from 'react';
import { RiAddLine, RiDeleteBinLine, RiEditLine, RiEyeLine, RiSendPlaneLine } from 'react-icons/ri';
import BaseTable from './BaseTable';
import TablePagination from './TablePagination';
import TableToolbar from './TableToolbar';

const NewsletterTable = ({
  newsletters,
  onEdit,
  onDelete,
  onView,
  onAdd,
  onSend,
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const columns = [
    {
      key: 'title',
      label: 'Campaign',
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">{row.description}</div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === 'draft'
              ? 'bg-gray-100 text-gray-800'
              : value === 'scheduled'
              ? 'bg-blue-100 text-blue-800'
              : value === 'sent'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: 'subscribers',
      label: 'Subscribers',
      sortable: true,
      render: (value) => value.toLocaleString(),
    },
    {
      key: 'openRate',
      label: 'Open Rate',
      sortable: true,
      render: (value) => `${value}%`,
    },
    {
      key: 'scheduledFor',
      label: 'Scheduled For',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleString() : '-',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(row.id)}
            className="p-1 text-gray-600 hover:text-primary"
            title="View Campaign"
          >
            <RiEyeLine />
          </button>
          <button
            onClick={() => onEdit(row.id)}
            className="p-1 text-gray-600 hover:text-primary"
            title="Edit Campaign"
          >
            <RiEditLine />
          </button>
          {row.status === 'draft' && (
            <button
              onClick={() => onSend(row.id)}
              className="p-1 text-gray-600 hover:text-green-500"
              title="Send Campaign"
            >
              <RiSendPlaneLine />
            </button>
          )}
          <button
            onClick={() => onDelete(row.id)}
            className="p-1 text-gray-600 hover:text-red-500"
            title="Delete Campaign"
          >
            <RiDeleteBinLine />
          </button>
        </div>
      ),
    },
  ];

  const filteredNewsletters = newsletters.filter((newsletter) =>
    Object.values(newsletter).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredNewsletters.length / itemsPerPage);
  const paginatedNewsletters = filteredNewsletters.slice(
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
    setSelectedRows(checked ? paginatedNewsletters.map((newsletter) => newsletter.id) : []);
  };

  const toolbarActions = [
    {
      label: 'Create Campaign',
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
        data={paginatedNewsletters}
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

export default NewsletterTable; 