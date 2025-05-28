const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variant: {
    type: Object,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  variantKey: {
    type: String,
    required: true,
  },
  productSnapshot: {
    title: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    basePrice: { type: Number, required: true },
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
  method: String, // e.g. "card", "upi", "netbanking", "wallet"
  provider: String, // e.g. "Visa", "ICICI", "Google Pay", etc.
  last4: String, // last 4 digits of card if applicable
  amount: Number,
  currency: String,
  status: String, // e.g. "captured", "failed", etc.
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
    paymentMethod: {
      type: String,
      enum: ["razorpay", "cod"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
