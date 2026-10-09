const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

const generateToken = (id, email, role, sessionId) => {
  return jwt.sign(
    { id, email, role, sessionId },
    process.env.JWT_SECRET || 'super_secret_jwt_key_audio_analysis_2026',
    { expiresIn: '7d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Salt and hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user (default status = pending)
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
      status: 'pending',
    });

    if (user) {
      return res.status(201).json({
        message: 'Registration successful! Your account is currently pending admin approval.',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data received' });
    }
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// @desc    Authenticate user & get token (Enforces Admin Approval & Single Active Session)
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Admin Approval Check
    if (user.status === 'pending') {
      return res.status(403).json({
        message: 'Your account is pending admin approval. You will be able to log in once approved.',
        code: 'PENDING_APPROVAL',
      });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({
        message: 'Your account access request was rejected by an administrator.',
        code: 'ACCOUNT_REJECTED',
      });
    }

    // Generate fresh session ID to invalidate previous sessions for this user
    const newSessionId = crypto.randomUUID();
    user.currentSessionId = newSessionId;
    await user.save();

    const token = generateToken(user._id, user.email, user.role, newSessionId);

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc    Logout user & clear session
// @route   POST /api/auth/logout
// @access  Protected
const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.currentSessionId = null;
      await user.save();
    }
    return res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Error during logout' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Protected
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving profile' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
};
