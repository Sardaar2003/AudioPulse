const express = require('express');
const router = express.Router();
const {
  getKeywordGroups,
  saveKeywordGroup,
  deleteKeywordGroup,
} = require('../controllers/keywordController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getKeywordGroups);
router.post('/', protect, saveKeywordGroup);
router.delete('/:id', protect, deleteKeywordGroup);

module.exports = router;
