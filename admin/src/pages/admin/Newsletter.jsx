import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NewsletterTable from '../../components/tables/NewsletterTable';

const Newsletter = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Sample data - replace with API call
  const [newsletters] = useState([
    {
      id: 1,
      title: 'Spring Collection Launch',
      description: 'Introducing our new spring collection with exclusive offers',
      status: 'draft',
      subscribers: 2500,
      openRate: 45,
      scheduledFor: null,
    },
    {
      id: 2,
      title: 'Weekend Sale',
      description: 'Special weekend discounts on selected items',
      status: 'scheduled',
      subscribers: 2500,
      openRate: 0,
      scheduledFor: '2024-03-20T10:00:00',
    },
    {
      id: 3,
      title: 'New Arrivals',
      description: 'Check out our latest product additions',
      status: 'sent',
      subscribers: 2500,
      openRate: 52,
      scheduledFor: '2024-03-15T09:00:00',
    },
  ]);

  const handleView = (id) => {
    navigate(`/admin/newsletter/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/admin/newsletter/${id}/edit`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      setLoading(true);
      try {
        // Implement API call to delete campaign
        console.log('Deleting campaign:', id);
        // After successful deletion, update the newsletters list
      } catch (error) {
        console.error('Error deleting campaign:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAdd = () => {
    navigate('/admin/newsletter/new');
  };

  const handleSend = async (id) => {
    if (window.confirm('Are you sure you want to send this campaign now?')) {
      setLoading(true);
      try {
        // Implement API call to send campaign
        console.log('Sending campaign:', id);
        // After successful sending, update the newsletter status
      } catch (error) {
        console.error('Error sending campaign:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl text-primary mb-2">Newsletter</h2>
        <p className="text-gray-500">Manage your email campaigns and subscriber list.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <NewsletterTable
          newsletters={newsletters}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
          onSend={handleSend}
          loading={loading}
        />
      </motion.div>
    </div>
  );
};

export default Newsletter; 