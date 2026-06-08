export const sendSuccess = (res, data = null, statusCode = 200, meta = null) => {
    const response = { statusCode, status: 'success' };

    if (data !== null) response.data = data;
    if (meta !== null) response.meta = meta;

    return res.status(statusCode).json(response);
};

export const sendError = (res, message, statusCode = 400, errors = null) => {
    const response = { statusCode, status: 'error', message };

    if (errors !== null) response.errors = errors;

    return res.status(statusCode).json(response);
};