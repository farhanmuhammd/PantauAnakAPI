import { AppError } from '../utils/errors.js';
import { sendError } from '../utils/response.js';

export const errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.errors ?? null);
  }

  if (err.name === 'CastError') {
    return sendError(res, 'Invalid ID format', 400);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return sendError(res, `${field} already exists`, 409);
  }

  console.error(err);
  sendError(res, 'Internal server error', 500);
};