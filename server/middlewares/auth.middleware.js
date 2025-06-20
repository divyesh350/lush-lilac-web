const jwt = require('jsonwebtoken');
const User = require("../models/User");


exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Forbidden", error: err.message });
  }
};

exports.requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      console.log('User role:', req.user.role);
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
};


