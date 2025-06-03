const express = require("express");
const { verifyToken, requireRole } = require("../middlewares/auth.middleware");
const {
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById
} = require("../controllers/user.controller");

const router = express.Router();

// Public routes (requires authentication)
router.get("/profile", verifyToken, getUserProfile);
router.put("/profile", verifyToken, updateUserProfile);
router.delete("/profile", verifyToken, deleteUserAccount);

// Admin routes
router.get("/", verifyToken, requireRole("admin"), getAllUsers);
router.get("/:id", verifyToken, requireRole("admin"), getUserById);
router.put("/:id", verifyToken, requireRole("admin"), updateUserById);
router.delete("/:id", verifyToken, requireRole("admin"), deleteUserById);

module.exports = router;

