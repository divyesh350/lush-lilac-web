const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const {requireRole, verifyToken} = require("../middlewares/auth.middleware");


// Customer: create order
router.post("/", verifyToken, orderController.createOrder);
router.post("/create-cod", verifyToken, orderController.createCodOrder);
// Customer: get own orders
router.get("/my", verifyToken, orderController.getMyOrders);

// Admin: get all orders
router.get("/", verifyToken, requireRole(["admin"]), orderController.getOrders);

// Admin or Owner: get one order
router.get("/:id", verifyToken, requireRole(["customer", "admin"]), orderController.getOrderById);

// Admin: update order status
router.put("/:id/status", verifyToken, requireRole(["admin"]), orderController.updateOrderStatus);
// Razorpay order route (customer only)
router.post("/create-payment", verifyToken, requireRole(["customer"]), orderController.createRazorpayOrder);

module.exports = router;

