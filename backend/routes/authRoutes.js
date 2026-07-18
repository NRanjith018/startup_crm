import express from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, updateProfile, logout } from '../controllers/authController.js';
import protect from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Validations definitions
const registerValidations = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters.'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Email must be a valid email address.'),
  body('password')
    .notEmpty()
    .withMessage('Password is required.')
    .isLength({ min: 6 })
    .withMessage('Password must contain at least 6 characters.'),
];

const loginValidations = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Email must be a valid email address.'),
  body('password')
    .notEmpty()
    .withMessage('Password is required.'),
];

const updateProfileValidations = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters.'),
  body('newPassword')
    .optional()
    .isLength({ min: 6 })
    .withMessage('New password must contain at least 6 characters.'),
  body('oldPassword')
    .optional()
    .notEmpty()
    .withMessage('Old password is required to change password.'),
];

// Routes registrations
router.post('/register', validate(registerValidations), register);
router.post('/login', validate(loginValidations), login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, validate(updateProfileValidations), updateProfile);
router.post('/logout', protect, logout);

export default router;
