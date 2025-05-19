const Artwork = require("../models/Artwork");

// Upload new artwork (user-uploaded or admin predefined)
exports.uploadArtwork = async (req, res) => {
  try {
    const { title, description, isPredefined } = req.body;
    const fileUrl = req.file?.path; // from Cloudinary upload middleware
    if (!fileUrl) return res.status(400).json({ message: "Artwork file is required" });

    const artwork = new Artwork({
      title,
      description,
      fileUrl,
      uploadedBy: req.user.id,
      isPredefined: isPredefined || false,
    });

    await artwork.save();
    res.status(201).json({ message: "Artwork uploaded", artwork });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

// Get all artworks (with optional filter for predefined or user)
exports.getArtworks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.predefined) {
      filter.isPredefined = req.query.predefined === "true";
    }
    const artworks = await Artwork.find(filter).populate("uploadedBy", "email");
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch artworks", error: err.message });
  }
};

// Delete artwork by ID (only admin or uploader)
exports.deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: "Artwork not found" });

    // Only admin or uploader can delete
    if (artwork.uploadedBy.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this artwork" });
    }

    await artwork.remove();
    res.json({ message: "Artwork deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};
