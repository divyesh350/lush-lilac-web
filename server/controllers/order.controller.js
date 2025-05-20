const Order = require("../models/Order");
const Product = require("../models/Product");
const razorpay = require("../config/razorpay");
const sendEmail = require("../utils/email.util");
const generateReceiptPDF = require("../utils/pdfReceipt.util");

// Create Razorpay payment order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // Razorpay accepts amount in paisa
      currency,
      receipt: receipt || `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to create Razorpay order", error: err.message });
  }
};

exports.createCodOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    if (!items || !totalAmount || !shippingAddress) {
      return res.status(400).json({ message: "Missing required order fields" });
    }

    // Check if all products support COD
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.codAvailable) {
        return res.status(400).json({
          message: `COD is not available for product: ${product?.title || "unknown"}`,
        });
      }
    }

    const newOrder = new Order({
      user: req.user._id,
      items,
      totalAmount,
      shippingAddress,
      status: "pending",
      paymentMethod: "cod",
      paymentInfo: {
        paid: false,
        method: "cod",
        amount: totalAmount,
        currency: "INR"
      }
    });

    const savedOrder = await newOrder.save();
    const populatedOrder = await Order.findById(savedOrder._id).populate("user", "name email");

    // 📄 Generate PDF
    const pdfBuffer = await generateReceiptPDF(populatedOrder);

    // 📧 Send Email with PDF attached
    await sendEmail(
      populatedOrder.user.email,
      "Your Lush Lilac Order Receipt (Cash on Delivery)",
      "Thank you for your order! Please find attached your order receipt. Payment will be collected upon delivery.",
      [
        {
          filename: `receipt_${populatedOrder._id}.pdf`,
          content: pdfBuffer,
        },
      ]
    );

    // 📦 Send PDF buffer to frontend as base64 (or you can save & send a URL)
    res.status(201).json({
      message: "Order placed successfully with Cash on Delivery",
      order: savedOrder,
      receiptPDF: `data:application/pdf;base64,${pdfBuffer.toString("base64")}`,
    });
  } catch (error) {
    res.status(500).json({ message: "COD order creation failed", error: error.message });
  }
};
// Create a new order (after successful payment)

exports.createOrder = async (req, res) => {
    try {
      const { items, totalAmount, shippingAddress, paymentInfo } = req.body;
  
      if (!items || !totalAmount || !shippingAddress || !paymentInfo) {
        return res.status(400).json({ message: "Missing required order fields" });
      }
  
      const newOrder = new Order({
        user: req.user._id,
        items,
        totalAmount,
        shippingAddress,
        paymentInfo,
      });
  
      const savedOrder = await newOrder.save();
      const populatedOrder = await Order.findById(savedOrder._id).populate("user", "name email");
  
      // 📄 Generate PDF
      const pdfBuffer = await generateReceiptPDF(populatedOrder);
  
      // 📧 Send Email with PDF attached
      await sendEmail(
        populatedOrder.user.email,
        "Your Lush Lilac Order Receipt",
        "Please find attached your order receipt.",
        [
          {
            filename: `receipt_${populatedOrder._id}.pdf`,
            content: pdfBuffer,
          },
        ]
      );
  
      // 📦 Send PDF buffer to frontend as base64 (or you can save & send a URL)
      res.status(201).json({
        message: "Order placed successfully",
        order: savedOrder,
        receiptPDF: `data:application/pdf;base64,${pdfBuffer.toString("base64")}`,
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to create order", error: err.message });
    }
  };

// Get logged-in user's orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user orders", error: err.message });
  }
};
exports.getOrders = async (req, res) => {
  try {
    const {
      status,
      userId,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Access control: Customers only see their own orders
    // Admins can filter by any userId or see all orders if no userId filter provided
    if (req.user.role === "customer") {
      query.userId = req.user.id;
    } else if (userId) {
      query.userId = userId;
    }

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Pagination calculations
    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate("userId", "name email") // populate user info (optional)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }); // latest orders first

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};


// Admin or Owner: Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = order.user._id.equals(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to get order", error: err.message });
  }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: "Failed to update order status", error: err.message });
  }
};

