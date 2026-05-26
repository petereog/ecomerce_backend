const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const err = new Error('Not authorized, no token');
      err.statusCode = 401;
      return next(err);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!req.user) {
      const err = new Error('User not found');
      err.statusCode = 401;
      return next(err);
    }

    next();
  } catch (err) {
    err.statusCode = 401;
    err.message = 'Not authorized, invalid token';
    next(err);
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  const err = new Error('Admin access only');
  err.statusCode = 403;
  next(err);
};