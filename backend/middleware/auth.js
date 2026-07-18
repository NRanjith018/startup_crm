import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/apiResponse.js';
import User from '../models/User.js';

/**
 * protect
 * Authentication middleware that checks Bearer tokens in incoming headers.
 * Populates req.user with decoded Mongoose User objects (excluding passwords).
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(
      res,
      'No token provided, access denied',
      401
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user payload to the request lifecycle
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return errorResponse(
        res,
        'User belonging to this token no longer exists',
        401
      );
    }
    
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(
        res,
        'Token has expired, please login again',
        401
      );
    }
    return errorResponse(
      res,
      'Token is invalid',
      401
    );
  }
};

export default protect;
