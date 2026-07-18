import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * generateToken
 * Helper function to sign a JWT token.
 * 
 * @param {string} userId - User document ID
 * @returns {string} Signed JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * register
 * Registers a new user account.
 * 
 * NOTE FOR PRODUCTION: 
 * Place the express-rate-limit middleware on this route to prevent automated registration spam 
 * (e.g. limit to 5 registration requests per hour per IP).
 */
export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return errorResponse(res, 'Email already exists', 400);
    }

    // Create User
    const user = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(user._id);

    return successResponse(
      res, 
      { token, user }, 
      'User registered successfully.', 
      201
    );
  } catch (err) {
    next(err);
  }
};

/**
 * login
 * Authenticates user credentials.
 * 
 * NOTE FOR PRODUCTION:
 * Place the express-rate-limit middleware on this route to prevent brute-force credential stuffing attacks
 * (e.g. limit to 10 login requests per 15 minutes per IP).
 */
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Fetch user with password field explicitly included
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    // Check account active state
    if (!user.isActive) {
      return errorResponse(res, 'Account is deactivated', 403);
    }

    // Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const token = generateToken(user._id);

    return successResponse(
      res, 
      { token, user }, 
      'User logged in successfully.', 
      200
    );
  } catch (err) {
    next(err);
  }
};

/**
 * getProfile
 * Returns profile details of the authenticated session user.
 */
export const getProfile = async (req, res, next) => {
  try {
    return successResponse(res, req.user, 'User profile fetched successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * updateProfile
 * Modifies the authenticated user profile (allows name and/or password updates).
 */
export const updateProfile = async (req, res, next) => {
  const { name, newPassword, oldPassword } = req.body;

  try {
    // Re-fetch user with password field to check old credentials if password update is requested
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Name update (email updates are disabled for security reasons)
    if (name) {
      user.name = name;
    }

    // Password update
    if (newPassword) {
      if (!oldPassword) {
        return errorResponse(res, 'Old password is required to change password.', 400);
      }
      
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
        return errorResponse(res, 'Invalid old password.', 401);
      }

      user.password = newPassword;
    }

    await user.save();

    // The user schema toJSON hook will automatically strip the password hash
    return successResponse(res, user, 'Profile updated successfully.');
  } catch (err) {
    next(err);
  }
};

/**
 * logout
 * Invalidates user session tokens client-side.
 */
export const logout = async (req, res, next) => {
  try {
    return successResponse(
      res, 
      null, 
      'Logged out successfully. Please clear authorization tokens from client storage.'
    );
  } catch (err) {
    next(err);
  }
};
