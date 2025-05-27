// app.js
require('dotenv').config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const morgan = require("morgan");


const app = express();

// Security headers
app.use(helmet());
// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(morgan("dev"));
// Rate limiter for login route only
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 login attempts
  message: "Too many login attempts, please try again after 15 minutes",
});

// Serve static files from the uploads directory
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import routes here
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const artworkRoutes = require("./routes/artwork.routes");
const userRoutes = require("./routes/user.routes");
const newsletterRoutes = require("./routes/newsletter.routes");

// Import error middleware
const errorHandler = require("./middlewares/error.middleware");

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/artworks", artworkRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/newsletter", newsletterRoutes);

// Apply rate limiter to login route
const authController = require("./controllers/auth.controller");
app.post("/api/v1/auth/login", loginLimiter, authController.login);
// Health check route
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// Apply global error handling middleware
app.use(errorHandler);

module.exports = app;
