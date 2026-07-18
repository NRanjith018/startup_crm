import { validationResult } from 'express-validator';
import { errorResponse } from '../utils/apiResponse.js';

/**
 * validate
 * Reusable validation builder that accepts chains of express-validator rules,
 * executes them, and returns formatted 400 Bad Request error arrays on failure.
 *
 * @param {Array} validations - Array of validation rules
 * @returns {Function} Express middleware handler
 */
export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    for (let validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));

    return errorResponse(res, 'Validation Error', 400, formattedErrors);
  };
};
