const express = require("express");
const router = express.Router();
const {
  deleteAllUsers,
  deleteAllProducts,
  deleteAllOrders,
  deleteAllArtworks,
  deleteAllNewsletters,
  totalDatabaseReset,
} = require("../controllers/admin.controller");

const { verifyToken, requireRole } = require("../middlewares/auth.middleware");

// Protect all routes: Only Admins
router.use(verifyToken, requireRole("admin"));

router.delete("/users", deleteAllUsers);
router.delete("/products", deleteAllProducts);
router.delete("/orders", deleteAllOrders);
router.delete("/artworks", deleteAllArtworks);
router.delete("/newsletters", deleteAllNewsletters);
router.delete("/reset", totalDatabaseReset);

module.exports = router;
