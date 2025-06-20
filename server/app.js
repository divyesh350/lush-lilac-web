// app.js
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const path = require("path");

const app = express();

// Security headers
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://lush-lilac-web.vercel.app',
  'https://lush-lilac-admin.vercel.app',
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

app.use(morgan("dev"));
app.use(compression());

// Rate limiters
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again after 15 minutes",
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later.",
});

const relaxedLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: "Too many requests, please try again later.",
});

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import routes
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const artworkRoutes = require("./routes/artwork.routes");
const userRoutes = require("./routes/user.routes");
const newsletterRoutes = require("./routes/newsletter.routes");
const adminRoutes = require("./routes/admin.routes");

// API Routes with consistent prefix
const API_PREFIX = '/api/v1';
app.use(`${API_PREFIX}/auth`, strictLimiter, authRoutes);
app.use(`${API_PREFIX}/products`, relaxedLimiter, productRoutes);
app.use(`${API_PREFIX}/orders`, strictLimiter, orderRoutes);
app.use(`${API_PREFIX}/analytics`, relaxedLimiter, analyticsRoutes);
app.use(`${API_PREFIX}/artworks`, relaxedLimiter, artworkRoutes);
app.use(`${API_PREFIX}/users`, relaxedLimiter, userRoutes);
app.use(`${API_PREFIX}/newsletter`, strictLimiter, newsletterRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);

// Apply rate limiter to login route
const authController = require("./controllers/auth.controller");
app.post(`${API_PREFIX}/auth/login`, loginLimiter, authController.login);

// Health check route
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
  });
}

// Error handling
const errorHandler = require("./middlewares/error.middleware");
app.use(errorHandler);

module.exports = app;
