import { useState } from 'react';
import { motion } from 'framer-motion';
import { RiLockLine, RiNotificationLine } from 'react-icons/ri';

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [logoutAll, setLogoutAll] = useState(true);

  const [notifications, setNotifications] = useState({
    newOrders: true,
    customerMessages: true,
    productReviews: false,
    lowStock: true,
    marketingUpdates: false,
  });

  const handleNotificationToggle = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl text-primary mb-2">Settings</h2>
        <p className="text-gray-500">Manage your account settings and preferences.</p>
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

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-full">
              <RiNotificationLine className="text-primary text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Notification Settings</h3>
          </div>

          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center">
                <div>
                  <p className="text-gray-800 font-medium">
                    {key
                      .split(/(?=[A-Z])/)
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {key === 'newOrders'
                      ? 'Get notified when a new order is placed'
                      : key === 'customerMessages'
                      ? 'Get notified for new customer messages'
                      : key === 'productReviews'
                      ? 'Get notified for new product reviews'
                      : key === 'lowStock'
                      ? 'Get notified when products are low in stock'
                      : 'Receive marketing tips and updates'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={() => handleNotificationToggle(key)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings; 