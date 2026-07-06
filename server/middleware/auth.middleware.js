// middleware/auth.middleware.js
// Protects routes by requiring a valid JWT in the Authorization header.
// Usage: router.get('/profile', protect, profileController)

const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { ApiError } = require('../utils/apiResponse');

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Unauthorized Access. No token provided.'));
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(new ApiError(401, 'Unauthorized Access. No token provided.'));
  }

  try {
    // jwt.verify throws TokenExpiredError / JsonWebTokenError on failure.
    // Both are caught centrally by middleware/errorHandler.js.
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // { id, email, name }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { protect };
