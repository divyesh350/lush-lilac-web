import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ArtworkTable from '../../components/tables/ArtworkTable';

const Artwork = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Sample data - replace with API call
  const [artworks] = useState([
    {
      id: 1,
      name: 'Floral Pattern',
      category: 'Patterns',
      type: 'vector',
      thumbnail: 'https://placehold.co/100x100',
      dimensions: { width: 2000, height: 2000 },
      fileSize: 256000,
      lastModified: '2024-03-15T10:30:00',
    },
    {
      id: 2,
      name: 'Product Mockup',
      category: 'Mockups',
      type: 'raster',
      thumbnail: 'https://placehold.co/100x100',
      dimensions: { width: 3000, height: 2000 },
      fileSize: 512000,
      lastModified: '2024-03-14T15:45:00',
    },
    {
      id: 3,
      name: 'Logo Design',
      category: 'Logos',
      type: 'vector',
      thumbnail: 'https://placehold.co/100x100',
      dimensions: { width: 1000, height: 1000 },
      fileSize: 128000,
      lastModified: '2024-03-10T09:15:00',
    },
  ]);

  const handleView = (id) => {
    navigate(`/admin/artwork/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/artwork/${id}/edit`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      setLoading(true);
      try {
        // Implement API call to delete artwork
        console.log('Deleting artwork:', id);
        // After successful deletion, update the artworks list
      } catch (error) {
        console.error('Error deleting artwork:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAdd = () => {
    navigate('/admin/artwork/new');
  };

  const handleDownload = async (id) => {
    setLoading(true);
    try {
      // Implement API call to download artwork
      console.log('Downloading artwork:', id);
      // After successful download, update the UI if needed
    } catch (error) {
      console.error('Error downloading artwork:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl text-primary mb-2">Artwork</h2>
        <p className="text-gray-500">Manage your product artwork and designs.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ArtworkTable
          artworks={artworks}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          onDownload={handleDownload}
          loading={loading}
        />
      </motion.div>
    </div>
  );
};

export default Artwork; 