import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RiCloseLine } from 'react-icons/ri';
import UsersTable from '../../components/tables/UsersTable';
import UserForm from '../../components/forms/UserForm';
import useUserStore from '../../store/userStore';

const Users = () => {
  const { 
    users = [],
    loading, 
    error, 
    fetchUsers, 
    deleteUser,
    currentPage,
    totalPages 
  } = useUserStore();

  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [fetchUsers, currentPage]);

  const handleView = (id) => {
    // Implement view functionality if needed
    console.log('View user:', id);
  };

  const handleEdit = (id) => {
    setSelectedUser(id);
    setShowUserForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleAdd = () => {
    setSelectedUser(null);
    setShowUserForm(true);
  };

  const handlePageChange = (page) => {
    fetchUsers(page);
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl text-primary mb-2">Users</h2>
        <p className="text-gray-500">Manage your customer accounts and permissions.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <UsersTable
          users={users}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </motion.div>

      {/* User Form Modal */}
      {showUserForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">
                  {selectedUser ? 'Edit User' : 'Add User'}
                </h2>
                <button
                  onClick={() => {
                    setShowUserForm(false);
                    setSelectedUser(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <RiCloseLine className="w-6 h-6" />
                </button>
              </div>
              <UserForm
                userId={selectedUser}
                isEditing={!!selectedUser}
                onCancel={() => {
                  setShowUserForm(false);
                  setSelectedUser(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users; 