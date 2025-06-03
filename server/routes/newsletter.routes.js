const express = require("express");
const router = express.Router();
const { 
  subscribe, 
  unsubscribe, 
  sendNewsletter,
  getSubscribers 
} = require("../controllers/newsletter.controller");
const { verifyToken, requireRole } = require("../middlewares/auth.middleware");

// Public routes
router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);

// Admin routes
router.get("/subscribers", verifyToken, requireRole("admin"), getSubscribers);
router.post("/send", verifyToken, requireRole("admin"), sendNewsletter);

module.exports = router;

