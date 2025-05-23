const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

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

    // 🛍️ Top Products by Revenue (via productSnapshot)
    const topProducts = await Order.aggregate([
      { $match: { "paymentInfo.paid": true } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productSnapshot.title",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.price" },
          thumbnail: { $first: "$items.productSnapshot.thumbnailUrl" },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);

    // 🎯 Top Variants
    const topVariants = await Order.aggregate([
      { $match: { "paymentInfo.paid": true } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.variantKey",
          totalSold: { $sum: "$items.quantity" },
          revenue: { $sum: "$items.price" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      orderCount,
      customerCount,
      productCount,
      revenue,
      dailyRevenue: last7Days,
      monthlyRevenue: last12Months,
      topProducts,
      topVariants,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch analytics", error: err.message });
  }
};
