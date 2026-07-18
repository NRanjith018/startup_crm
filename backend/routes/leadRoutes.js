import express from 'express';
import { body } from 'express-validator';
import protect from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
  searchLeadsQuick
} from '../controllers/leadController.js';

const router = express.Router();

// Enforce auth protection middleware across all routes in this file
router.use(protect);

// Validations definitions
const leadValidations = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .isLength({ min: 2 })
    .withMessage('Name must contain at least 2 characters.'),
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company is required.'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Email must be a valid email address.'),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'])
    .withMessage('Invalid status value.'),
  body('source')
    .optional()
    .isIn(['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'])
    .withMessage('Invalid source value.'),
  body('phone')
    .optional()
    .trim(),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes description cannot exceed 1000 characters.'),
];

const statusValidations = [
  body('status')
    .notEmpty()
    .withMessage('Status is required.')
    .isIn(['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'])
    .withMessage('Invalid status value.'),
];

// Specific stats paths MUST sit above parameterized :id paths to avoid Express routing conflicts
router.get('/stats/summary', getLeadStats);
router.get('/stats/monthly', getMonthlyStats);
router.get('/search', searchLeadsQuick);

// Standard collection routes mapping
router.route('/')
  .get(getLeads)
  .post(validate(leadValidations), createLead);

// Standard element routing maps
router.route('/:id')
  .get(getLeadById)
  .put(validate(leadValidations), updateLead)
  .delete(deleteLead);

// Status updates
router.patch('/:id/status', validate(statusValidations), updateLeadStatus);

export default router;
