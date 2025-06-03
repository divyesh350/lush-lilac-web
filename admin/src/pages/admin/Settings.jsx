import { useState } from 'react';
import { motion } from 'framer-motion';
import { RiLockLine, RiDatabase2Line, RiDeleteBinLine } from 'react-icons/ri';
import useAdminStore from '../../store/adminStore';
import toast from 'react-hot-toast';

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [logoutAll, setLogoutAll] = useState(true);

  const { 
    loading,
    deleteAllUsers,
    deleteAllProducts,
    deleteAllOrders,
    deleteAllArtworks,
    deleteAllNewsletters,
    resetDatabase
  } = useAdminStore();

  const handleServerAction = async (action) => {
    const toastId = toast.loading(`Performing ${action}...`);
    try {
      switch (action) {
        case 'reset-db':
          await resetDatabase();
          toast.success('Database reset successfully', { id: toastId });
          break;
        case 'delete-users':
          await deleteAllUsers();
          toast.success('All users deleted successfully', { id: toastId });
          break;
        case 'delete-artworks':
          await deleteAllArtworks();
          toast.success('All artworks deleted successfully', { id: toastId });
          break;
        case 'delete-products':
          await deleteAllProducts();
          toast.success('All products deleted successfully', { id: toastId });
          break;
        case 'delete-orders':
          await deleteAllOrders();
          toast.success('All orders deleted successfully', { id: toastId });
          break;
        case 'delete-newsletters':
          await deleteAllNewsletters();
          toast.success('All newsletters deleted successfully', { id: toastId });
          break;
        default:
          throw new Error('Invalid action');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Failed to ${action}`;
      toast.error(errorMessage, { id: toastId });
      console.error('Action failed:', error);
    }
  };

  const confirmAction = (action, message) => {
    if (window.confirm(message)) {
      handleServerAction(action);
    }
  };

  const serverActions = [
    {
      title: 'Reset Database',
      description: 'Reset the entire database to its initial state. This will delete all data.',
      action: 'reset-db',
      icon: <RiDatabase2Line className="text-red-500" />,
      confirmMessage: 'Are you sure you want to reset the entire database? This action cannot be undone.',
    },
    {
      title: 'Delete All Users',
      description: 'Remove all user accounts from the database.',
      action: 'delete-users',
      icon: <RiDeleteBinLine className="text-red-500" />,
      confirmMessage: 'Are you sure you want to delete all users? This action cannot be undone.',
    },
    {
      title: 'Delete All Artworks',
      description: 'Remove all artwork files and records.',
      action: 'delete-artworks',
      icon: <RiDeleteBinLine className="text-red-500" />,
      confirmMessage: 'Are you sure you want to delete all artworks? This action cannot be undone.',
    },
    {
      title: 'Delete All Products',
      description: 'Remove all products and their variants.',
      action: 'delete-products',
      icon: <RiDeleteBinLine className="text-red-500" />,
      confirmMessage: 'Are you sure you want to delete all products? This action cannot be undone.',
    },
    {
      title: 'Delete All Orders',
      description: 'Remove all order records and history.',
      action: 'delete-orders',
      icon: <RiDeleteBinLine className="text-red-500" />,
      confirmMessage: 'Are you sure you want to delete all orders? This action cannot be undone.',
    },
    {
      title: 'Delete All Newsletters',
      description: 'Remove all newsletter subscriptions and records.',
      action: 'delete-newsletters',
      icon: <RiDeleteBinLine className="text-red-500" />,
      confirmMessage: 'Are you sure you want to delete all newsletters? This action cannot be undone.',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl text-primary mb-2">Settings</h2>
        <p className="text-gray-500">Manage your account settings and server actions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Update */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full">
              <RiLockLine className="text-primary text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Update Password</h3>
          </div>

          <form className="space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label htmlFor="new-password" className="block text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="logout-all"
                checked={logoutAll}
                onChange={(e) => setLogoutAll(e.target.checked)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="logout-all" className="ml-2 text-gray-700">
                Logout from all devices
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Update Password
            </button>
          </form>
        </motion.div>

        {/* Server Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center bg-red-100 rounded-full">
              <RiDatabase2Line className="text-red-500 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Server Actions</h3>
          </div>

          <div className="space-y-4">
            {serverActions.map((action) => (
              <div key={action.action} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  {action.icon}
                  <div>
                    <p className="text-gray-800 font-medium">{action.title}</p>
                    <p className="text-gray-500 text-sm">{action.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => confirmAction(action.action, action.confirmMessage)}
                  disabled={loading}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Execute'}
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings; 