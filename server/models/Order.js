const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  variant: {
    size: String,
    color: String,
    material: String,
  },
  quantity: Number,
  price: Number,
});

const paymentInfoSchema = new mongoose.Schema({
  paymentId: String,
  orderId: String,
  signature: String,
  paid: Boolean,
  method: String,
  amount: Number,
  currency: String,
  timestamp: Date,
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [orderItemSchema],
    totalAmount: Number,
    shippingAddress: String,
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

