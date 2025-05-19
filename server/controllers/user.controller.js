const Artwork = require("../models/Artwork");

exports.getUserArtworks = async (req, res) => {
    try {
      const artworks = await Artwork.find({ uploadedBy: req.user.id });
      if (!artworks.length) {
        return res.status(200).json({ message: "No artworks found for this user", artworks: [] });
      }
      res.json(artworks);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user artworks", error: error.message });
    }
  };
  

