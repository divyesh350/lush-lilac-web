import { motion } from 'framer-motion';
import { RiDeleteBin6Line } from 'react-icons/ri';

const ArtworkCard = ({ artwork, onDelete, loading }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
    >
      {/* Artwork Image */}
      <div className="aspect-square relative">
        <img
          src={artwork.media[0]?.url}
          alt={artwork.title || 'Artwork'}
          className="w-full h-full object-cover"
        />
        
        {/* Delete Button Overlay */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(artwork._id)}
          disabled={loading}
          className="absolute top-2 right-2 p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <RiDeleteBin6Line className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Artwork Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {artwork.title || 'Untitled Artwork'}
        </h3>
        {artwork.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {artwork.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ArtworkCard; 