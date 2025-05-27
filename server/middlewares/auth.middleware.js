const jwt = require('jsonwebtoken');


exports.verifyToken = (req, res, next) => {
  console.log('JWT_SECRET:', process.env.JWT_SECRET); // Should print your secret string
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ message: 'Access token missing' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token invalid or expired' });
    req.user = user;
    next();
  });
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


