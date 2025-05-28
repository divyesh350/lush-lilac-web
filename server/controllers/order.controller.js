const Order = require("../models/Order");
const Product = require("../models/Product");
const razorpay = require("../config/razorpay");
const sendEmail = require("../utils/email.util");
const generateReceiptPDF = require("../utils/pdfReceipt.util");
const generateReceiptHTML = require("../utils/htmlReceipt.util");

// Util: Build Order Items Array
const buildOrderItems = async (items, checkCod = false) => {
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error(`Product not found: ${item.productId}`);
    }

    if (checkCod && !product.codAvailable) {
      throw new Error(`COD is not available for product: ${product.title}`);
    }

    const variant = product.variants.find(
      (v) =>
        v.size === item.variant.size &&
        v.color === item.variant.color &&
        v.material === item.variant.material
    );

    if (!variant) {
      throw new Error(`Variant not found for product: ${product.title}`);
    }

    const variantKey = [variant.size, variant.color, variant.material]
      .filter(Boolean)
      .join("-");

    const thumbnailUrl =
      product.media.find((m) => m.type === "image")?.url || "";

    orderItems.push({
      productId: item.productId,
      variant: item.variant,
      quantity: item.quantity,
      price: item.price,
      variantKey,
      productSnapshot: {
        title: product.title,
        thumbnailUrl,
        basePrice: product.basePrice,
        codAvailable: product.codAvailable
      },
    });
  }

  return orderItems;
};

// ================================
// Razorpay: Create Payment Order
// ================================
// ================================
// Create Razorpay Order
// ================================
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;
    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency,
      receipt: receipt || `receipt_order_${Date.now()}`,
    });
 
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({
      message: "Failed to create Razorpay order",
      error: err.message,
    });
  }
};

// ================================
// Create Order (Razorpay or COD)
// ================================
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod, paymentInfo } = req.body;

    if (!items || !totalAmount || !shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: "Missing required order fields" });
    }

    if (!["razorpay", "cod"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    // Validate Razorpay paymentInfo
    if (paymentMethod === "razorpay") {
      if (!paymentInfo?.paymentId || !paymentInfo?.orderId || !paymentInfo?.signature) {
        return res.status(400).json({ message: "Incomplete Razorpay payment info" });
      }

      const existingOrder = await Order.findOne({
        "paymentInfo.paymentId": paymentInfo.paymentId,
      });

      if (existingOrder) {
        return res.status(400).json({
          message: "This Razorpay payment has already been used.",
        });
      }
    }

    // Build order items with snapshot (ensure codAvailable is included)
    const orderItems = await buildOrderItems(items);

    const newOrder = new Order({
      user: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: "pending",
      paymentMethod,
      paymentInfo: paymentMethod === "cod" ? { paid: false, method: "cod" } : paymentInfo,
    });

    const savedOrder = await newOrder.save();
    const populatedOrder = await Order.findById(savedOrder._id).populate("user", "name email").populate("items.productId", "title"); // Populate product title for HTML receipt

    // Generate PDF and HTML receipts
    const pdfBuffer = await generateReceiptPDF(populatedOrder);
    const htmlBody = generateReceiptHTML(populatedOrder);

    await sendEmail(
      populatedOrder.user.email,
      "Your Lush Lilac Order Receipt",
      null, // text body (set to null)
      [{ filename: `receipt_${populatedOrder._id}.pdf`, content: pdfBuffer }],
      htmlBody // html body
    );

    res.status(201).json({
      message: "Order placed successfully",
      success:true,
      order: savedOrder,
      receiptPDF: `data:application/pdf;base64,${pdfBuffer.toString("base64")}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create order", error: err.message , success:false});
  }
};

// ================================
// Create COD Order
// ================================
exports.createCodOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress } = req.body;

    if (!items || !totalAmount || !shippingAddress) {
      return res.status(400).json({ message: "Missing required order fields" });
    }

    // Build order items with snapshot (checks cod availability)
    const orderItems = await buildOrderItems(items, true);

    const newOrder = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      status: "pending",
      paymentMethod: "cod",
      paymentInfo: {
        paid: false,
        method: "cod",
        amount: totalAmount,
        currency: "INR",
      },
    });

    const savedOrder = await newOrder.save();
    const populatedOrder = await Order.findById(savedOrder._id).populate(
      "user",
      "name email"
    ).populate("items.productId", "title"); // Populate product title for HTML receipt

     // Generate PDF and HTML receipts
    const pdfBuffer = await generateReceiptPDF(populatedOrder);
    const htmlBody = generateReceiptHTML(populatedOrder);

    await sendEmail(
      populatedOrder.user.email,
      "Your Lush Lilac Order Receipt (Cash on Delivery)",
      null, // text body (set to null)
      [{ filename: `receipt_${populatedOrder._id}.pdf`, content: pdfBuffer }],
      htmlBody // html body
    );

    res.status(201).json({
      message: "Order placed successfully with Cash on Delivery",
      order: savedOrder,
      receiptPDF: `data:application/pdf;base64,${pdfBuffer.toString("base64")}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create COD order", error: err.message});
  }
};

// ================================
// Get My Orders
// ================================
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch user orders", error: err.message });
  }
};

// ================================
// Get Orders (Admin/Customer)
// ================================
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

    if (req.user.role === "customer") {
      query.user = req.user._id;
    } else if (userId) {
      query.user = userId;
    }

    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate("user", "name email")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: err.message });
  }
};

// ================================
// Get Order By ID (Admin/Owner)
// ================================
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    const isOwner = order.user._id.equals(req.user._id);
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    res.status(200).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get order", error: err.message });
  }
};

// ================================
// Admin: Update Order Status
// ================================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update order status", error: err.message });
  }
};
