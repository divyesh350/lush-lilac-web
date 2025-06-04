const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const {
  uploadArtwork,
  getArtworks,
  deleteArtwork,
  getUserArtworks,
} = require("../controllers/artwork.controller");

// Custom upload handler with timeout
const handleUpload = (req, res, next) => {
  // Set a longer timeout for the request
  req.setTimeout(180000); // 3 minutes
  res.setTimeout(180000); // 3 minutes

  // Create a timeout handler
  const uploadTimeout = setTimeout(() => {
    console.error("Upload timed out after 3 minutes");
    return res.status(408).json({
      message: "File upload failed",
      error: "Upload timed out. Please try with smaller files or check your internet connection.",
    });
  }, 180000);

  // Handle the upload
  upload.array("media", 10)(req, res, (err) => {
    // Clear the timeout since the request completed
    clearTimeout(uploadTimeout);

    if (err) {
      console.error("Upload middleware error:", err);
      return res.status(400).json({
        message: "File upload failed",
        error: err.message,
      });
    }
    next();
  });
};

// Routes
router.post("/", verifyToken, handleUpload, uploadArtwork);
router.get("/user", verifyToken, getUserArtworks);
router.get("/", getArtworks);
router.delete("/:id", verifyToken, deleteArtwork);

module.exports = router;
