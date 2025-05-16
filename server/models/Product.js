const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  size: String,
  color: String,
  material: String,
  stock: {
    type: Number,
    default: 0,
  },
});

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    media: [String], // Cloudinary URLs (images/videos)
    variants: [variantSchema],
    designs: [String], // Optional predefined POD designs
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
