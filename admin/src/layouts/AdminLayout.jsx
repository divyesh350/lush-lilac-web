import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { RiDashboardLine, RiShoppingBagLine, RiFileListLine, RiUserLine, RiSettingsLine, RiMailLine, RiPaletteLine, RiMenuLine, RiCloseLine, RiNotification3Line, RiLogoutBoxLine } from 'react-icons/ri';
import { useAuth } from '../providers/AuthProvider';
import useAuthStore from '../store/authStore';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { handleLogout } = useAuth();
  const { user } = useAuthStore();

  const menuItems = [
    { icon: RiDashboardLine, label: 'Dashboard', path: '/admin' },
    { icon: RiShoppingBagLine, label: 'Products', path: '/admin/products' },
    { icon: RiFileListLine, label: 'Orders', path: '/admin/orders' },
    { icon: RiUserLine, label: 'Users', path: '/admin/users' },
    { icon: RiSettingsLine, label: 'Settings', path: '/admin/settings' },
    { icon: RiMailLine, label: 'Newsletter', path: '/admin/newsletter' },
    { icon: RiPaletteLine, label: 'Artwork', path: '/admin/artwork' },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex bg-secondary-light">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 20 }}
            className="w-64 bg-white shadow-lg fixed h-screen flex flex-col z-50"
          >
            <div className="p-6 flex items-center justify-between">
              <h1 className="text-2xl font-heading text-primary">lush lilac</h1>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-gray-500 hover:text-primary"
              >
                <RiCloseLine size={24} />
              </button>
            </div>
            <nav className="flex-1 px-4">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive(item.path)
                          ? 'bg-primary text-white'
                          : 'text-gray-600 hover:bg-purple-50 hover:text-primary'
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-4 border-t">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 w-full text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
              >
                <RiLogoutBoxLine size={20} />
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        {/* Header */}
        <header className="bg-transparent">
          <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-primary mr-4"
              >
                <RiMenuLine size={24} />
              </button>
              <h1 className="text-xl text-primary">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <RiNotification3Line className="text-gray-600 text-xl" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                  3
                </span>
              </div>
              <span className="text-gray-600">Welcome, {user?.firstName || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="container mx-auto px-6 py-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 