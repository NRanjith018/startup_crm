/**
 * successResponse
 * Returns a standardized JSON success response.
 *
 * @param {Object} res - Express response object
 * @param {Object} data - Payload data contents
 * @param {string} message - Response description message
 * @param {number} statusCode - HTTP status code (defaults to 200)
 */
export const successResponse = (res, data, message, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * errorResponse
 * Returns a standardized JSON error response.
 *
 * @param {Object} res - Express response object
 * @param {string} message - Error description message
 * @param {number} statusCode - HTTP status code (defaults to 500)
 * @param {any} errors - Detailed list of validation errors or traces (defaults to null)
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

/**
 * paginatedResponse
 * Returns a standardized JSON paginated success response.
 * Includes total count, selected page, page limit, total pages, and boolean indicators.
 *
 * @param {Object} res - Express response object
 * @param {Array} data - Paginated subset of leads or users
 * @param {number} total - Total records count in collection
 * @param {number} page - Current selected page index
 * @param {number} limit - Items limit size per page
 */
export const paginatedResponse = (res, data, total, page, limit) => {
  const pages = Math.ceil(total / limit);
  return res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: pages || 1,
      hasNext: page < pages,
      hasPrev: page > 1,
    },
  });
};
