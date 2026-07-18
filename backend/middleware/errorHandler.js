import { errorResponse } from '../utils/apiResponse.js';

/**
 * errorHandler
 * Global Express error handling middleware.
 * Catches Mongoose ValidationErrors, CastErrors, MongoDB duplicate keys, and JWT signatures expiration.
 */
const errorHandler = (err, req, res, next) => {
  // Log error to server console
  console.error('API Error Encountered:', err);

  const isDev = process.env.NODE_ENV === 'development';

  // 1. Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    return errorResponse(
      res,
      'Resource not found',
      404,
      isDev ? err.stack : null
    );
  }

  // 2. Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return errorResponse(
      res,
      'Validation Error',
      400,
      messages
    );
  }

  // 3. MongoDB Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    return errorResponse(
      res,
      'Email already exists',
      409,
      isDev ? err.stack : null
    );
  }

  // 4. JWT Verification Errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(
      res,
      'Invalid token. Authorization denied.',
      401,
      isDev ? err.stack : null
    );
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(
      res,
      'Token has expired. Please log in again.',
      401,
      isDev ? err.stack : null
    );
  }

  // 5. Everything else (Fallback standard server errors)
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server error';
  return errorResponse(
    res,
    message,
    statusCode,
    isDev ? err.stack : null
  );
};

export default errorHandler;
