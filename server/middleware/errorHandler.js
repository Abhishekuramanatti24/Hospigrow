// middleware/errorHandler.js
// Central place that catches every error thrown (or passed via next(err)) in the app.
// Keeps controllers free of repetitive try/catch boilerplate for response formatting.

const { ApiError } = require('../utils/apiResponse');

// Wrap async controller functions so thrown errors are forwarded to next()
// instead of crashing the process or requiring manual try/catch everywhere.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 handler for routes that don't exist
const notFound = (req, res, next) => {
  const err = new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`);
  next(err);
};

// Final error handler - must be registered last in the middleware chain
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Handle JWT-specific errors with friendly messages
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Unauthorized Access. Invalid token.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token Expired. Please log in again.';
  }

  if (process.env.NODE_ENV === 'development' && !err.isApiError) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

module.exports = { asyncHandler, notFound, errorHandler };
