const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  name: String, // e.g., "Large", "iPhone 14", etc.
  size: String,
  color: String,
  material: String,
  price: { type: Number, default: 0 }, // additional amount added to basePrice
  stock: { type: Number, default: 0 },
});

const mediaSchema = new mongoose.Schema({
  url: String,
  type: { type: String, enum: ["image", "video"] },
  public_id: String,
});

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, unique: true, lowercase: true, trim: true }, // SEO-friendly URL
    description: String,
    category: { type: String }, // e.g., 'phone_case', 'candle', 'mouse_pad'
    basePrice: { type: Number, required: true },
    productionTime: { type: Number, default: 3 }, // days to fulfill
    variants: [variantSchema],
    media: [mediaSchema],
    codAvailable: {
      type: Boolean,
      default: false, // or true if cod is allowed
    },
    customizable: { type: Boolean, default: false }, // whether artwork upload is allowed
    personalizationInstructions: { type: String },

    isActive: { type: Boolean, default: true }, // soft delete toggle
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
