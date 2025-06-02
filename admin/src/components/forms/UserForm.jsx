import BaseForm from './BaseForm';
import FormField from './FormField';

const UserForm = ({
  user,
  isEditing,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'staff', label: 'Staff' },
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' },
  ];

  return (
    <BaseForm
      title={isEditing ? 'Edit User' : 'Add User'}
      isEditing={isEditing}
      onSubmit={onSubmit}
      onCancel={onCancel}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="First Name"
            name="firstName"
            value={user?.firstName || ''}
            onChange={onChange}
            disabled={!isEditing}
            required
          />

          <FormField
            label="Last Name"
            name="lastName"
            value={user?.lastName || ''}
            onChange={onChange}
            disabled={!isEditing}
            required
          />
        </div>

        <FormField
          label="Email"
          name="email"
          type="email"
          value={user?.email || ''}
          onChange={onChange}
          disabled={!isEditing}
          required
        />

        {!isEditing && (
          <FormField
            label="Password"
            name="password"
            type="password"
            value={user?.password || ''}
            onChange={onChange}
            required
          />
        )}

        <FormField
          label="Role"
          name="role"
          type="select"
          value={user?.role || ''}
          onChange={onChange}
          disabled={!isEditing}
          options={roleOptions}
          required
        />

        <FormField
          label="Status"
          name="status"
          type="select"
          value={user?.status || 'active'}
          onChange={onChange}
          disabled={!isEditing}
          options={statusOptions}
          required
        />

        <FormField
          label="Phone"
          name="phone"
          value={user?.phone || ''}
          onChange={onChange}
          disabled={!isEditing}
          placeholder="Enter phone number"
        />

        <FormField
          label="Address"
          name="address"
          type="textarea"
          value={user?.address || ''}
          onChange={onChange}
          disabled={!isEditing}
          placeholder="Enter address"
        />
      </div>
    </BaseForm>
  );
};

export default UserForm; 