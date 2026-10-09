const jwt = require('jsonwebtoken');
const ApiLog = require('../models/ApiLog');

const requestLogger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // Capture original res.send & res.json to inspect response payload safely
  const originalJson = res.json;
  let responsePayload = null;

  res.json = function (data) {
    // If fetching logs list, summarize response to prevent dumping all logs recursively inside the log record
    const url = req.originalUrl || req.url || '';
    if (url.includes('/api/logs') && req.method === 'GET' && data && Array.isArray(data.logs)) {
      responsePayload = {
        message: 'Fetched API logs list from MongoDB',
        count: data.logs.length,
        totalLogs: data.totalLogs,
      };
    } else {
      responsePayload = data;
    }
    return originalJson.apply(this, arguments);
  };

  // Once response finishes, log and persist to MongoDB asynchronously
  res.on('finish', async () => {
    const durationMs = Date.now() - start;
    const statusCode = res.statusCode;
    const url = req.originalUrl || req.url;

    // Ignore health check polling logs if desired, or keep all /api routes
    if (!url.startsWith('/api')) return;

    // Identify user if Bearer token present
    let userEmail = 'Anonymous';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.decode(token);
        if (decoded && decoded.email) {
          userEmail = decoded.email;
        } else if (decoded && decoded.id) {
          userEmail = decoded.id;
        }
      } catch (e) {
        // token decode error ignored for logger
      }
    }

    // Determine category
    let category = 'API';
    if (url.includes('/api/auth')) category = 'AUTH';
    if (url.includes('/api/admin')) category = 'ADMIN';

    // Mask sensitive passwords in logged request body
    let sanitizedBody = { ...req.body };
    if (sanitizedBody.password) sanitizedBody.password = '••••••••';
    if (sanitizedBody.confirmPassword) sanitizedBody.confirmPassword = '••••••••';

    // Print to server console with colored status
    const statusColor = statusCode >= 500 ? '\x1b[31m' : statusCode >= 400 ? '\x1b[33m' : statusCode >= 300 ? '\x1b[36m' : '\x1b[32m';
    const resetColor = '\x1b[0m';
    console.log(
      `[${timestamp}] ${req.method} ${url} ${statusColor}${statusCode}${resetColor} - ${durationMs}ms [User: ${userEmail}]`
    );

    // Save to MongoDB asynchronously
    try {
      await ApiLog.create({
        method: req.method,
        url,
        statusCode,
        durationMs,
        ip: req.ip || req.connection.remoteAddress || '127.0.0.1',
        userEmail: req.user ? req.user.email : userEmail,
        requestBody: sanitizedBody,
        responseData: responsePayload || {},
        category,
      });
    } catch (err) {
      console.error('Error saving API log to MongoDB:', err.message);
    }
  });

  next();
};

module.exports = requestLogger;
