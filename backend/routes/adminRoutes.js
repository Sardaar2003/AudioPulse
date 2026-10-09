const express = require('express');
const router = express.Router();
const { getUsers, updateUserStatus } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/users', protect, adminOnly, getUsers);
router.patch('/users/:id/status', protect, adminOnly, updateUserStatus);

module.exports = router;
