export function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Not found',
    path: req.originalUrl,
  });
}

export function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || error.status || 500;

  if (res.headersSent) {
    next(error);
    return;
  }

  console.error('Backend request failed', {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message: error.message,
    code: error.code || null,
    details: error.details || null,
    hint: error.hint || null,
  });

  res.status(statusCode).json({
    error: error.message || 'Internal server error',
  });
}
