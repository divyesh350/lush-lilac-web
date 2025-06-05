import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { RiAddLine, RiArrowRightLine, RiCloseLine } from 'react-icons/ri';
import useUserStore from '../store/useUserStore';
import useArtworkStore from '../store/useArtworkStore';
import useCartStore from '../store/useCartStore';
import { ArtworkCard, Form, OrderCard, Spinner } from '../components/ui';


const ProfilePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  // Add state for artwork upload modal and form
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [artworkFormData, setArtworkFormData] = useState({
    title: '',
    description: '',
    media: null
  });
  
  // Get user profile data and functions
  const { 
    user,
    loading: profileLoading, 
    error: profileError,
    getUserProfile,
    updateUserProfile 
  } = useUserStore();

  // Get artwork data and functions
  const {
    artworks,
    loading: artworkLoading,
    error: artworkError,
    getUserArtworks,
    uploadArtwork,
    deleteArtwork
  } = useArtworkStore();

  // Get order data and functions from useCartStore
  const {
  
    userOrders,
    ordersLoading,
    ordersError,
    fetchUserOrders,
  } = useCartStore();

  // Fetch user profile, artworks, and orders on mount, only if user is authenticated
  useEffect(() => {
    if (!user) {
      getUserProfile();
      getUserArtworks();
      fetchUserOrders(); // Fetch user orders using useCartStore
    }
  }, [getUserProfile, getUserArtworks, fetchUserOrders]); // Removed user from dependency array
  // Update form data when user profile is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfile(formData);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  // Handle artwork form input changes
  const handleArtworkInputChange = (e) => {
    const { name, value } = e.target;
    setArtworkFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle artwork file selection
  const handleArtworkFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArtworkFormData(prev => ({
        ...prev,
        media: file
      }));
    }
  };

  // Handle artwork form submission
  const handleArtworkSubmit = async (e) => {
    e.preventDefault();
    if (!artworkFormData.media) {
      return;
    }

    try {
      await uploadArtwork(artworkFormData.media, {
        title: artworkFormData.title,
        description: artworkFormData.description
      });
      setShowUploadModal(false);
      setArtworkFormData({
        title: '',
        description: '',
        media: null
      });
    } catch (error) {
      console.error('Failed to upload artwork:', error);
    }
  };

  // Handle artwork deletion
  const handleArtworkDelete = async (artworkId) => {
    try {
      await deleteArtwork(artworkId);
    } catch (error) {
      console.error('Failed to delete artwork:', error);
    }
  };

  // Add safety check for artworks
  const safeArtworks = Array.isArray(artworks) ? artworks : [];
  // Add safety check for orders using userOrders from useCartStore
  const safeOrders = Array.isArray(userOrders) ? userOrders : [];

  if (profileLoading) {
    return (
      <Spinner/>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Profile Update Form */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-dark-purple dark:text-primary mb-6 text-center">
            Profile Information
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-medium-purple dark:text-text-secondary">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 rounded-md border border-[#F9F0F7] dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-text-primary resize-y"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-medium-purple dark:text-text-secondary">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                 className="mt-1 block w-full px-4 py-2 rounded-md border border-[#F9F0F7] dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-text-primary resize-y"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-medium-purple dark:text-text-secondary">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
               className="mt-1 block w-full px-4 py-2 rounded-md border border-[#F9F0F7] dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-text-primary resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={profileLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {profileLoading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </section>

        {/* Artwork Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-dark-purple dark:text-primary">
              Your Artworks
            </h2>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <RiAddLine className="w-5 h-5 mr-2" />
              Upload Artwork
            </button>
          </div>

          {artworkLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : artworkError ? (
            <div className="text-red-500 dark:text-red-400 text-center py-4">{artworkError}</div>
          ) : safeArtworks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No artworks uploaded yet
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {safeArtworks.map(artwork => (
                <ArtworkCard
                  key={artwork._id}
                  artwork={artwork}
                  onDelete={handleArtworkDelete}
                  loading={artworkLoading}
                />
              ))}
            </div>
          )}
        </section>

        {/* Recent Orders Section */}
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-dark-purple dark:text-primary">
              Recent Orders
            </h2>
            <button
              onClick={() => navigate('/orders')}
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark"
            >
              View All Orders
              <RiArrowRightLine className="ml-1" />
            </button>
          </div>

          {ordersLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : ordersError ? (
            <div className="text-red-500 dark:text-red-400 text-center py-4">{ordersError}</div>
          ) : safeOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No recent orders found.
            </div>
          ) : (
            <div className="space-y-4">
              {safeOrders.map(order => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </section>

        {/* Artwork Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upload Artwork
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <RiCloseLine className="w-6 h-6" />
                </button>
              </div>

              <div className="p-4">
                <Form
                  title="Upload New Artwork"
                  fields={[
                    {
                      type: 'text',
                      name: 'title',
                      label: 'Title',
                      value: artworkFormData.title,
                      onChange: handleArtworkInputChange,
                      placeholder: 'Enter artwork title'
                    },
                    {
                      type: 'textarea',
                      name: 'description',
                      label: 'Description',
                      value: artworkFormData.description,
                      onChange: handleArtworkInputChange,
                      placeholder: 'Enter artwork description'
                    },
                    {
                      type: 'file',
                      name: 'media',
                      label: 'Upload Media',
                      onChange: handleArtworkFileChange,
                      accept: 'image/*,video/*',
                      preview: artworkFormData.media ? [artworkFormData.media] : []
                    }
                  ]}
                  buttonText={artworkLoading ? 'Uploading...' : 'Upload Artwork'}
                  onSubmit={handleArtworkSubmit}
                  error={artworkError}
                />
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProfilePage; 