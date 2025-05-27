const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { requireRole, verifyToken } = require("../middlewares/auth.middleware");
const verifyRazorpayPayment = require("../middlewares/razorpay.middleware");

// 🟢 Razorpay intent (no payment verification yet)
router.post("/razorpay-order", verifyToken, requireRole(["customer"]), orderController.createRazorpayOrder);

// 🟢 Place order after successful Razorpay payment (assumes middleware already verified it)
router.post("/", verifyToken, requireRole(["customer"]), verifyRazorpayPayment, orderController.createOrder);

// 🟢 Cash on Delivery
router.post("/cod", verifyToken, requireRole(["customer"]), orderController.createCodOrder);

// 🟢 Get current user's orders
router.get("/my", verifyToken, requireRole(["customer"]), orderController.getMyOrders);

// 🟢 Admin: Get all orders
router.get("/", verifyToken, requireRole(["admin"]), orderController.getOrders);

// 🟢 Admin/Customer: Get single order
router.get("/:id", verifyToken, requireRole(["admin", "customer"]), orderController.getOrderById);

// 🟢 Admin: Update order status
router.put("/:id/status", verifyToken, requireRole(["admin"]), orderController.updateOrderStatus);

module.exports = router;
