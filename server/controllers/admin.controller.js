const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Artwork = require('../models/Artwork');
const Newsletter = require('../models/Newsletter');

exports.deleteAllUsers = async (req, res) => {
  try {
    await User.deleteMany({ role: { $ne: 'admin' } }); // Avoid deleting yourself!
    res.json({ message: 'All users deleted (excluding admins).' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting users', error: err.message });
  }
};

exports.deleteAllProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    res.json({ message: 'All products deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting products', error: err.message });
  }
};

exports.deleteAllOrders = async (req, res) => {
  try {
    await Order.deleteMany({});
    res.json({ message: 'All orders deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting orders', error: err.message });
  }
};

exports.deleteAllArtworks = async (req, res) => {
  try {
    await Artwork.deleteMany({});
    res.json({ message: 'All artworks deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting artworks', error: err.message });
  }
};

exports.deleteAllNewsletters = async (req, res) => {
  try {
    await Newsletter.deleteMany({});
    res.json({ message: 'All newsletter entries deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting newsletters', error: err.message });
  }
};

exports.totalDatabaseReset = async (req, res) => {
  try {
    await Promise.all([
      User.deleteMany({ role: { $ne: 'admin' } }),
      Product.deleteMany({}),
      Order.deleteMany({}),
      Artwork.deleteMany({}),
      Newsletter.deleteMany({}),
    ]);
    res.json({ message: 'Total database reset completed (excluding admins).' });
  } catch (err) {
    res.status(500).json({ message: 'Error performing database reset', error: err.message });
  }
};
