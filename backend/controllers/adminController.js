const User = require('../models/User');

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// @desc    Approve or reject a user account
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value provided' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = status;
    if (status !== 'approved') {
      user.currentSessionId = null; // Invalidate active session if revoked or pending
    }
    await user.save();

    return res.json({
      message: `User status successfully updated to ${status}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    return res.status(500).json({ message: 'Failed to update user status' });
  }
};

module.exports = {
  getUsers,
  updateUserStatus,
};
