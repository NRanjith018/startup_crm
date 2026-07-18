/**
 * cleanObject
 * Recursively inspects and deletes any object keys starting with '$' to prevent MongoDB query injection.
 *
 * @param {Object} obj - Input object to sanitize
 */
const cleanObject = (obj) => {
  if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach((key) => {
      if (key.startsWith('$')) {
        delete obj[key];
      } else {
        cleanObject(obj[key]);
      }
    });
  }
};

/**
 * mongoSanitize
 * Factory function returning a custom NoSQL injection sanitizer middleware compatible with Express v5.
 * Safely mutates query parameter keys, body payloads, and path variables.
 */
const mongoSanitize = () => {
  return (req, res, next) => {
    if (req.body) cleanObject(req.body);
    if (req.query) cleanObject(req.query);
    if (req.params) cleanObject(req.params);
    next();
  };
};

export default mongoSanitize;
