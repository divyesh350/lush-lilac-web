const express = require("express");
const router = express.Router();
const { getAdminAnalytics } = require("../controllers/analytics.controller");
const {requireRole, verifyToken} = require("../middlewares/auth.middleware");

router.get("/", verifyToken, requireRole("admin"), getAdminAnalytics);

module.exports = router;

