import { create } from 'zustand';
import { axiosInstance } from '../services/authService';
import toast from 'react-hot-toast';

const useUserStore = create((set, get) => ({
    users: [],
    loading: false,
    error: null,
    selectedUser: null,
    totalUsers: 0,
    currentPage: 1,
    totalPages: 1,

    // Get all users
    fetchUsers: async (page = 1) => {
        const userToast = toast.loading('Fetching users...');
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.get(`/users?page=${page}&limit=10`);
            
            // Update to handle the correct response structure
            set({ 
                users: response.data.data || [],
                totalUsers: response.data.count || 0,
                currentPage: page,
                totalPages: Math.ceil((response.data.count || 0) / 10),
                loading: false 
            });

            toast.success('Users updated', {
                id: userToast,
            });
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch users';
            set({ 
                error: errorMessage, 
                loading: false,
                users: []
            });
            toast.error(errorMessage, {
                id: userToast,
            });
            throw error;
        }
    },

    // Get single user
    fetchUser: async (id) => {
        const userToast = toast.loading('Fetching user details...');
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.get(`/users/${id}`);
            set({ 
                selectedUser: response.data,
                loading: false 
            });
            
            toast.success('User details loaded', {
                id: userToast,
            });
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch user';
            set({ 
                error: errorMessage, 
                loading: false 
            });
            toast.error(errorMessage, {
                id: userToast,
            });
            throw error;
        }
    },

    // Create user
    createUser: async (data) => {
        const userToast = toast.loading('Creating user...');
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.post('/users', data);
            set((state) => ({
                users: [response.data, ...state.users],
                loading: false
            }));
            toast.success('User created successfully', {
                id: userToast,
            });
            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to create user';
            set({ 
                error: errorMessage, 
                loading: false 
            });
            toast.error(errorMessage, {
                id: userToast,
            });
            throw error;
        }
    },

    // Update user
    updateUser: async (id, data) => {
        const userToast = toast.loading('Updating user...');
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.put(`/users/${id}`, data);
            
            // Update the user in the users array
            set((state) => ({
                users: state.users.map((user) => 
                    user._id === id ? response.data : user
                ),
                selectedUser: response.data,
                loading: false
            }));

            toast.success('User updated successfully', {
                id: userToast,
            });
            
            return { success: true, data: response.data };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update user';
            set({ 
                error: errorMessage, 
                loading: false 
            });
            toast.error(errorMessage, {
                id: userToast,
            });
            throw error;
        }
    },

    // Delete user
    deleteUser: async (id) => {
        const userToast = toast.loading('Deleting user...');
        try {
            set({ loading: true, error: null });
            await axiosInstance.delete(`/users/${id}`);
            
            // Remove the user from the users array
            set((state) => ({
                users: state.users.filter((user) => user._id !== id),
                loading: false
            }));

            toast.success('User deleted successfully', {
                id: userToast,
            });
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to delete user';
            set({ 
                error: errorMessage, 
                loading: false 
            });
            toast.error(errorMessage, {
                id: userToast,
            });
            throw error;
        }
    },

    // Toggle user status
    toggleUserStatus: async (userId, isActive) => {
        const userToast = toast.loading('Updating user status...');
        try {
            set({ loading: true, error: null });
            await axiosInstance.put(`/users/${userId}`, { isActive });
            
            // Refresh users list
            await get().fetchUsers(get().currentPage);

            toast.success(`User ${isActive ? 'activated' : 'deactivated'} successfully`, {
                id: userToast,
            });
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update user status';
            set({ 
                error: errorMessage, 
                loading: false 
            });
            toast.error(errorMessage, {
                id: userToast,
            });
            throw error;
        }
    },

    // Clear selected user
    clearSelectedUser: () => set({ selectedUser: null }),

    // Clear error
    clearError: () => set({ error: null })
}));

export default useUserStore; 