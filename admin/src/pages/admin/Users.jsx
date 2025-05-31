import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import UsersTable from '../../components/tables/UsersTable';

const Users = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Sample data - replace with API call
  const [users] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-03-15T10:30:00',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'editor',
      status: 'active',
      lastLogin: '2024-03-14T15:45:00',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: 'user',
      status: 'inactive',
      lastLogin: '2024-03-10T09:15:00',
    },
  ]);

  const handleView = (id) => {
    navigate(`/admin/users/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/users/${id}/edit`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setLoading(true);
      try {
        // Implement API call to delete user
        console.log('Deleting user:', id);
        // After successful deletion, update the users list
      } catch (error) {
        console.error('Error deleting user:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAdd = () => {
    navigate('/admin/users/new');
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
        />
      </motion.div>
    </div>
  );
};

export default Users; 