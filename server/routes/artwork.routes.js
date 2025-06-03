const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware"); // ⬅️ Use local upload middleware
const {
  uploadArtwork,
  getArtworks,
  deleteArtwork,
  getUserArtworks,
} = require("../controllers/artwork.controller");

// Upload artwork - authenticated users
router.post("/", verifyToken, upload.single("file"), uploadArtwork);
router.get("/user", verifyToken, getUserArtworks);
// Get artworks - public or authenticated
router.get("/", getArtworks);

// Delete artwork - only admin or uploader
router.delete("/:id", verifyToken, deleteArtwork);

module.exports = router;
