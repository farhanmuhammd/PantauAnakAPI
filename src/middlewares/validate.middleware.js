import { ValidationError } from '../utils/errors.js';
import { sendError } from '../utils/response.js';

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const fieldErrors = {};
    const unknownKeyErrors = [];

    for (const err of result.error.errors) {
      if (err.code === 'unrecognized_keys') {
        err.keys.forEach((key) => unknownKeyErrors.push(`'${key}' is not a valid field`));
      } else {
        const field = err.path[0];
        fieldErrors[field] = err.message;
      }
    }

    if (unknownKeyErrors.length > 0) {
      return sendError(res, unknownKeyErrors.join(', '), 422);
    }

    return sendError(res, 'Validation failed', 422, fieldErrors);
  }

  req.body = result.data;
  next();
};