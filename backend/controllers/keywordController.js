const KeywordGroup = require('../models/KeywordGroup');

// Default initial keyword groups
const defaultGroups = [
  {
    name: 'Security Alerts',
    color: '#ef4444', // Danger Red
    keywords: ['unauthorized', 'password', 'breached', 'risk', 'security', 'alert'],
  },
  {
    name: 'Financial Terms',
    color: '#06b6d4', // Cyan
    keywords: ['refund', 'cancellation', 'transaction', 'cost', 'payment', 'charge'],
  },
  {
    name: 'Compliance & Audit',
    color: '#6366f1', // Indigo
    keywords: ['compliance', 'protocol', 'verified', 'audit', 'supervisor', 'authorization'],
  },
  {
    name: 'Customer Satisfaction',
    color: '#10b981', // Emerald
    keywords: ['help', 'requested', 'system', 'confirm', 'support'],
  },
];

// @desc    Get user keyword groups (seeds defaults if empty)
// @route   GET /api/keywords
// @access  Protected
const getKeywordGroups = async (req, res) => {
  try {
    let groups = await KeywordGroup.find({ userId: req.user._id });

    if (groups.length === 0) {
      console.log(`Seeding initial default keyword groups for user: ${req.user.email}...`);
      const seeded = await KeywordGroup.insertMany(
        defaultGroups.map((g) => ({ ...g, userId: req.user._id }))
      );
      groups = seeded;
    }

    return res.json(groups);
  } catch (error) {
    console.error('Error fetching keyword groups:', error);
    return res.status(500).json({ message: 'Failed to fetch keyword groups' });
  }
};

// @desc    Create or Update a keyword group
// @route   POST /api/keywords
// @access  Protected
const saveKeywordGroup = async (req, res) => {
  try {
    const { id, name, color, keywords } = req.body;

    if (!name || !keywords || !Array.isArray(keywords)) {
      return res.status(400).json({ message: 'Please provide group name and an array of keywords' });
    }

    let group;
    if (id) {
      group = await KeywordGroup.findOne({ _id: id, userId: req.user._id });
      if (!group) return res.status(404).json({ message: 'Keyword group not found' });
      group.name = name;
      group.color = color || group.color;
      group.keywords = keywords;
      await group.save();
    } else {
      group = await KeywordGroup.create({
        name,
        color: color || '#6366f1',
        keywords,
        userId: req.user._id,
      });
    }

    return res.json(group);
  } catch (error) {
    console.error('Error saving keyword group:', error);
    return res.status(500).json({ message: 'Failed to save keyword group' });
  }
};

// @desc    Delete a keyword group
// @route   DELETE /api/keywords/:id
// @access  Protected
const deleteKeywordGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await KeywordGroup.findOneAndDelete({ _id: id, userId: req.user._id });
    if (!group) return res.status(404).json({ message: 'Keyword group not found' });
    return res.json({ message: 'Keyword group deleted successfully', id });
  } catch (error) {
    console.error('Error deleting keyword group:', error);
    return res.status(500).json({ message: 'Failed to delete keyword group' });
  }
};

module.exports = {
  getKeywordGroups,
  saveKeywordGroup,
  deleteKeywordGroup,
};
