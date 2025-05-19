const mongoose = require("mongoose");

const artworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isPredefined: { type: Boolean, default: false }, // true for your predefined designs
}, { timestamps: true });

module.exports = mongoose.model("Artwork", artworkSchema);
