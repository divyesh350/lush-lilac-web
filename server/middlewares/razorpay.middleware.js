const crypto = require("crypto");
const razorpay = require("../config/razorpay");
require("dotenv").config();

const verifyRazorpayPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentInfo, // Optional: can be enriched later
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ message: "Missing Razorpay payment fields" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }
    // 🧠 Verify payment details from Razorpay API

    const payment = await razorpay.payments.fetch(razorpay_payment_id);
    if (payment.status !== "captured") {
      return res.status(400).json({ message: "Payment not captured yet" });
    }
    req.body.paymentInfo = {
      paymentId: payment.id,
      orderId: payment.order_id,
      signature: razorpay_signature,
      paid: payment.status === "captured",
      method: payment.method,
      provider: payment?.card?.network || payment?.bank || payment?.wallet,
      last4: payment?.card?.last4, // last 4 digits of card if applicable
      amount: payment.amount / 100, // convert paise to INR
      currency: payment.currency,
    };

    next();
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to verify Razorpay payment",
        error: error.message,
      });
  }
};

module.exports = verifyRazorpayPayment;
