const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variant: {
    size: String,
    color: String,
    material: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true, // capture price at order time
  },
});

const paymentInfoSchema = new mongoose.Schema({
  paymentId: String,
  orderId: String,
  signature: String,
  paid: {
    type: Boolean,
    default: false,
  },
  method: String,
  amount: Number,
  currency: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    artwork: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artwork",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "in production", "supplied", "completed"],
      default: "pending",
    },
    paymentInfo: paymentInfoSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
