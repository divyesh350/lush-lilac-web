import { motion } from 'framer-motion';

const Users = () => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl text-primary mb-2">Users</h2>
        <p className="text-gray-500">Manage your customer accounts and permissions.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6"
      >
        <p className="text-gray-500">User management functionality coming soon...</p>
      </motion.div>
    </div>
  );
};

export default Users; 