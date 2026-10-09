const express = require('express');
const router = express.Router();
const { getLogs, clearLogs } = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getLogs);
router.delete('/', protect, clearLogs);

module.exports = router;
