const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: String,
  color: String,
  material: String,
  stock: Number,
});

const mediaSchema = new mongoose.Schema({
  url: String,
  type: { type: String, enum: ['image', 'video'] },
  public_id: String,
});

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    variants: [variantSchema],
    media: [mediaSchema],
    codAvailable: {
      type: Boolean,
      default: true, // or false if Razorpay-only by default
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
