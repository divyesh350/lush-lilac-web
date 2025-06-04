const Artwork = require("../models/Artwork");
const { uploadArtworkMediaToCloudinary } = require('../utils/cloudinaryUploader');

exports.getUserArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find({ uploadedBy: req.user.id });
    if (!artworks.length) {
      return res
        .status(200)
        .json({ message: "No artworks found for this user", artworks: [] });
    }
    res.json(artworks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to get user artworks", error: error.message });
  }
};

// Upload new artwork (user-uploaded or admin predefined)
exports.uploadArtwork = async (req, res) => {
  try {
    const { title, description, isPredefined } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        message: 'Missing required fields',
        error: 'Please provide title',
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: 'No media files uploaded',
        error: 'Please upload at least one media file',
      });
    }

    // Prepare media info
    let media = [];
    if (req.files && Array.isArray(req.files)) {
      media = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
        type: file.mimetype ? (file.mimetype.startsWith('video') ? 'video' : 'image') : 'image',
        public_id: file.filename || 'unknown',
        originalname: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      }));
    }

    const artwork = await Artwork.create({
      title,
      description,
      media,
      uploadedBy: req.user.id,
      isPredefined: isPredefined || false,
    });

    res.status(201).json({ 
      message: "Artwork uploaded successfully", 
      artwork 
    });

    // Upload media to Cloudinary in background
    uploadArtworkMediaToCloudinary(artwork._id).catch((error) =>
      console.error('Background upload error:', error)
    );
  } catch (err) {
    res.status(500).json({ 
      message: "Upload failed", 
      error: err.message 
    });
  }
};

// Get all artworks (with optional filter for predefined or user)
exports.getArtworks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.predefined) {
      filter.isPredefined = req.query.predefined === "true";
    }
    const artworks = await Artwork.find(filter)
      .populate("uploadedBy", "email")
      .sort({ createdAt: -1 }); // Sort by newest first
    res.json(artworks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch artworks", error: err.message });
  }
};

// Delete artwork by ID (only admin or uploader)
exports.deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    // Only admin or uploader can delete
    if (
      artwork.uploadedBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this artwork" });
    }

    await artwork.deleteOne();
    res.json({ message: "Artwork deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};
