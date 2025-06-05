import { useState } from 'react';
import { RiAddLine, RiDeleteBinLine, RiEditLine, RiEyeLine, RiDownloadLine } from 'react-icons/ri';
import BaseTable from './BaseTable';
import TablePagination from './TablePagination';
import TableToolbar from './TableToolbar';

const ArtworkTable = ({
  artworks,
  onEdit,
  onDelete,
  onView,
  onAdd,
  onDownload,
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const columns = [
    {
      key: 'name',
      label: 'Artwork',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
            <img
              src={row.thumbnail}
              alt={value}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-gray-500">{row.category}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === 'vector'
              ? 'bg-blue-100 text-blue-800'
              : value === 'raster'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: 'dimensions',
      label: 'Dimensions',
      sortable: true,
      render: (value) => `${value.width} × ${value.height}`,
    },
    {
      key: 'fileSize',
      label: 'File Size',
      sortable: true,
      render: (value) => `${(value / 1024).toFixed(1)} KB`,
    },
    {
      key: 'lastModified',
      label: 'Last Modified',
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
            title="View Artwork"
          >
            <RiEyeLine />
          </button>
          <button
            onClick={() => onEdit(row.id)}
            className="p-1 text-gray-600 hover:text-primary"
            title="Edit Artwork"
          >
            <RiEditLine />
          </button>
          <button
            onClick={() => onDownload(row.id)}
            className="p-1 text-gray-600 hover:text-green-500"
            title="Download Artwork"
          >
            <RiDownloadLine />
          </button>
          <button
            onClick={() => onDelete(row.id)}
            className="p-1 text-gray-600 hover:text-red-500"
            title="Delete Artwork"
          >
            <RiDeleteBinLine />
          </button>
        </div>
      ),
    },
  ];

  const filteredArtworks = artworks.filter((artwork) =>
    Object.values(artwork).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);
  const paginatedArtworks = filteredArtworks.slice(
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
    setSelectedRows(checked ? paginatedArtworks.map((artwork) => artwork.id) : []);
  };

  const toolbarActions = [
    {
      label: 'Upload Artwork',
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
        data={paginatedArtworks}
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

export default ArtworkTable; 