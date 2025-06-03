const User = require("../models/User");

// Get user profile (public route)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user?._id).select("-password");
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// Update user profile (public route)
const updateUserProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        
        const user = await User.findById(req.user?._id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        return res.status(200).json({
            success: true,
            data: user,
            message: "Profile updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// Delete user account (public route)
const deleteUserAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user?._id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await User.findByIdAndDelete(req.user?._id);

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// Admin routes
// Get all users (admin route)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        
        return res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// Get single user by ID (admin route)
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// Update user by ID (admin route)
const updateUserById = async (req, res) => {
    try {
        const { name, email, role } = req.body;
        
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;

        await user.save();

        return res.status(200).json({
            success: true,
            data: user,
            message: "User updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

// Delete user by ID (admin route)
const deleteUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
};

