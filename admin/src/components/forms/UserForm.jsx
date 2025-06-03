import { useState, useEffect } from 'react';
import BaseForm from './BaseForm';
import FormField from './FormField';
import useUserStore from '../../store/userStore';

const UserForm = ({
  userId,
  isEditing,
  onCancel,
}) => {
  const { 
    selectedUser, 
    fetchUserById, 
    updateUser, 
    createUser,
    loading 
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
    if (isEditing && userId) {
      fetchUserById(userId);
    }
  }, [isEditing, userId, fetchUserById]);

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
      if (isEditing) {
        await updateUser(userId, formData);
      } else {
        await createUser(formData);
      }
      onCancel();
    } catch (error) {
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
          required
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