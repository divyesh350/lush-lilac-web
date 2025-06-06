import { useState, useEffect } from 'react';
import BaseForm from './BaseForm';
import FormField from './FormField';
import useUserStore from '../../store/userStore';
import toast from 'react-hot-toast';

const UserForm = ({
  user,
  isEditing,
  onCancel,
}) => {
  const { 
    selectedUser, 
    fetchUser, 
    updateUser, 
    createUser,
    loading,
    clearSelectedUser
  } = useUserStore();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    if (isEditing && user?._id) {
      fetchUser(user._id);
    }
    return () => {
      clearSelectedUser();
    };
  }, [isEditing, user, fetchUser, clearSelectedUser]);

  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || '',
        email: selectedUser.email || '',
        role: selectedUser.role || '',
        phone: selectedUser.phone || '',
        address: selectedUser.address || ''
      });
    }
  }, [selectedUser]);

  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'customer', label: 'Customer' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && user?._id) {
        await updateUser(user._id, formData);
        toast.success('User updated successfully');
      } else {
        await createUser(formData);
        toast.success('User created successfully');
      }
      onCancel();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error saving user';
      toast.error(errorMessage);
      console.error('Error saving user:', error);
    }
  };

  return (
    <BaseForm
      title={isEditing ? 'Edit User' : 'Add User'}
      isEditing={true}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      loading={loading}
    >
      <div className="space-y-6">
        <FormField
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <FormField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        {!isEditing && (
          <FormField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        )}

        <FormField
          label="Role"
          name="role"
          type="select"
          value={formData.role}
          onChange={handleChange}
          options={roleOptions}
          required
        />

        <FormField
          label="Phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Enter phone number"
        />

        <FormField
          label="Address"
          name="address"
          type="textarea"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter address"
        />
      </div>
    </BaseForm>
  );
};

export default UserForm; 