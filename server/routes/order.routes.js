const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { requireRole, verifyToken } = require("../middlewares/auth.middleware");
const verifyRazorpayPayment = require("../middlewares/razorpay.middleware");
// Customer: create order (after payment success)
router.post("/", verifyToken, requireRole(["customer"]), verifyRazorpayPayment,orderController.createOrder);

// Customer: create Cash on Delivery order
router.post("/create-cod", verifyToken, requireRole(["customer"]), orderController.createCodOrder);

// Customer: get own orders
router.get("/my", verifyToken, requireRole(["customer"]), orderController.getMyOrders);

// Admin: get all orders with filters & pagination
router.get("/", verifyToken, requireRole(["admin"]), orderController.getOrders);

// Admin or Owner: get single order by ID
router.get("/:id", verifyToken, requireRole(["customer", "admin"]), orderController.getOrderById);

// Admin: update order status
router.put("/:id/status", verifyToken, requireRole(["admin"]), orderController.updateOrderStatus);

// Customer: create Razorpay payment order (payment intent)
router.post("/create-payment", verifyToken, requireRole(["customer"]), orderController.createRazorpayOrder);

module.exports = router;
