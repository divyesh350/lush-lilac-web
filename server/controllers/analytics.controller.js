const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const mongoose = require("mongoose");

exports.getAdminAnalytics = async (req, res) => {
    try {
      const [orderCount, customerCount, productCount, orders] = await Promise.all([
        Order.countDocuments(),
        User.countDocuments({ role: "customer" }),
        Product.countDocuments(),
        Order.find({ "paymentInfo.paid": true }),
      ]);
  
      const revenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  
      // 📅 Daily Revenue - Last 7 days
      const last7Days = await Order.aggregate([
        {
          $match: {
            "paymentInfo.paid": true,
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            total: { $sum: "$totalAmount" },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      // 📆 Monthly Revenue - Last 12 months
      const last12Months = await Order.aggregate([
        {
          $match: {
            "paymentInfo.paid": true,
            createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 11)) },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            total: { $sum: "$totalAmount" },
          },
        },
        { $sort: { _id: 1 } },
      ]);
  
      res.status(200).json({
        orderCount,
        customerCount,
        productCount,
        revenue,
        dailyRevenue: last7Days,
        monthlyRevenue: last12Months,
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch analytics", error: err.message });
    }
  };

