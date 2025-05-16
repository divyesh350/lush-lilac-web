
const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    cloudinaryUrl: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Artwork", artworkSchema);
