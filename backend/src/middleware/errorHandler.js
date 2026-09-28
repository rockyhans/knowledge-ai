export function notFoundHandler(_req, res) {
  res.status(404).json({ error: 'Route not found' });
}

export function errorHandler(error, _req, res, _next) {
  let status = error.statusCode || error.status || 500;
  let message = error.message || 'Internal server error';

  try {
    const parsed = JSON.parse(message);
    if (parsed.error?.message) {
      message = parsed.error.message;
      if (parsed.error.code) status = parsed.error.code;
    }
  } catch {
  }

  if (status === 503 || message.includes('high demand') || message.includes('UNAVAILABLE')) {
    status = 503;
    message = 'AI model is temporarily experiencing high demand. Please retry in a few moments.';
  }

  console.error(JSON.stringify({
    level: 'error',
    status,
    message,
    stack: error.stack
  }));

  const responseStatus = typeof status === 'number' && status >= 400 && status < 600 ? status : 500;
  res.status(responseStatus).json({
    error: message
  });
}
