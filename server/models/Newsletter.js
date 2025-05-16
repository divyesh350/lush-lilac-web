const mongoose = require("mongoose");

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: { createdAt: "subscribedAt" } }
);

module.exports = mongoose.model("NewsletterSubscriber", newsletterSubscriberSchema);

