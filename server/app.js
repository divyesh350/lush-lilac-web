// app.js
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan('dev'));

// Serve static files from the uploads directory
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes here
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');

// Import error middleware
const errorHandler = require('./middlewares/error.middleware');

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);


// Health check route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// Apply global error handling middleware
app.use(errorHandler);

module.exports = app;

