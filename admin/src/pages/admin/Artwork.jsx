import { motion } from 'framer-motion';

const Artwork = () => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl text-primary mb-2">Artwork</h2>
        <p className="text-gray-500">Manage your product artwork and designs.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <p className="text-gray-500">Artwork management functionality coming soon...</p>
      </motion.div>
    </div>
  );
};

export default Artwork; 