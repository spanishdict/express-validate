'use strict';

const validate = require('validate.js');

/**
 * @param {Object} opts - Options
 * @param {Object} opts.query - Constraints for query params
 * @param {boolean} opts.isAsync = false - Whether we have to validate async
 *                                         constraints
 *
 * @return {Function} A express middleware
 */
function createValidateMiddleware(opts) {
  return function validateMiddleware(req, res, next) {
    if (opts.isAsync) {
      validate.async(req.query, opts.query)
        .then(() => {
          req.isValid = true;
        })
        .catch((message) => {
          req.validationMessages = message;
          req.isValid = false;
        })
        .then(next);
    } else {
      const message = validate(req.query, opts.query);
      if (message) {
        req.validationMessages = message;
        req.isValid = false;
      } else {
        req.isValid = true;
      }
      next();
    }
  };
};

module.exports = {
  createValidateMiddleware,
  validate
};
