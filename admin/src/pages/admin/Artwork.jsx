import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RiDeleteBinLine, RiAddLine } from 'react-icons/ri';
import useArtworkStore from '../../store/artworkStore';
import BaseTable from '../../components/tables/BaseTable';
import TablePagination from '../../components/tables/TablePagination';
import TableToolbar from '../../components/tables/TableToolbar';

const Artwork = () => {
  const { 
    artworks, 
    loading, 
    fetchArtworks, 
    deleteArtwork,
    currentPage,
    totalPages 
  } = useArtworkStore();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchArtworks(currentPage);
  }, [fetchArtworks, currentPage]);

  const columns = [
    {
      key: 'title',
      label: 'Artwork',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
            <img
              src={row.fileUrl}
              alt={value}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-medium">{value}</div>
            <div className="text-sm text-gray-500">{row.description}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'uploadedBy',
      label: 'Uploaded By',
      sortable: true,
      render: (value) => value?.email || 'N/A',
    },
    {
      key: 'createdAt',
      label: 'Uploaded On',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDelete(row._id)}
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      try {
        await deleteArtwork(id);
      } catch (error) {
        console.error('Failed to delete artwork:', error);
      }
    }
  };

  const handlePageChange = (page) => {
    fetchArtworks(page);
  };

  const toolbarActions = [
    {
      label: 'Add Artwork',
      icon: <RiAddLine />,
      onClick: () => {
        // Implement add artwork functionality
        console.log('Add artwork clicked');
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Artwork Management</h1>
      </div>

      <TableToolbar
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        actions={toolbarActions}
      />

      <BaseTable
        columns={columns}
        data={filteredArtworks}
        loading={loading}
      />

      <div className="mt-4">
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Artwork; 