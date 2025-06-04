const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  url: String,
  type: { type: String, enum: ["image", "video"] },
  public_id: String,
});
const artworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    media: [mediaSchema],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPredefined: { type: Boolean, default: false }, // true for your predefined designs
  },
  { timestamps: true }
);

module.exports = mongoose.model("Artwork", artworkSchema);
