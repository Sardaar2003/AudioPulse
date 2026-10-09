const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_audio_analysis_2026');

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found. Authorization denied.' });
      }

      // Check for account approval
      if (user.status !== 'approved') {
        return res.status(403).json({
          message: 'Access denied. Account requires admin approval.',
          code: 'ACCOUNT_NOT_APPROVED',
          status: user.status
        });
      }

      // Enforce Single Active Session per user
      if (user.currentSessionId !== decoded.sessionId) {
        return res.status(401).json({
          message: 'Your session has ended because your account was logged into from another browser or device.',
          code: 'SESSION_INVALIDATED'
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth verification error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed or expired.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided.' });
  }
};

module.exports = { protect };
