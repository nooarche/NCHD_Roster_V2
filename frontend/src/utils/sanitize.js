// Input sanitization utilities
// NOTE: In production, use DOMPurify library

/**
 * Basic HTML sanitization (replace with DOMPurify in production)
 * @param {string} input - User input to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Deep clone utility
 * @param {Object} obj - Object to clone
 * @returns {Object} - Cloned object
 */
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
