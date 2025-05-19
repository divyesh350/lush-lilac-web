const express = require("express");
const router = express.Router();
const { subscribe, unsubscribe, sendNewsletter } = require("../controllers/newsletter.controller");
const {verifyToken , requireRole} = require("../middlewares/auth.middleware");

// Public routes
router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);

// Admin route to send newsletters
router.post("/send", verifyToken, requireRole("admin"), sendNewsletter);

module.exports = router;

