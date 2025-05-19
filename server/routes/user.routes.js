const express = require("express");
const { getUserArtworks } = require("../controllers/user.controller");
const {verifyToken } = require("../middlewares/auth.middleware");

const router = express.Router();
router.get("/artworks", verifyToken, getUserArtworks);
module.exports = router;

