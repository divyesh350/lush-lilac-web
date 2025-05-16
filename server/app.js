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

// TODO: Import routes here
const authRoutes = require('./routes/auth.routes');

app.use('/api/v1/auth', authRoutes);


// Health check route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

module.exports = app;

