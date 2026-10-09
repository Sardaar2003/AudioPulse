const ApiLog = require('../models/ApiLog');

// @desc    Get paginated and filtered API logs from MongoDB
// @route   GET /api/logs
// @access  Protected
const getLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const category = req.query.category || 'ALL';
    const status = req.query.status || 'ALL';
    const search = req.query.search || '';

    const query = {};

    // Category Filter
    if (category !== 'ALL') {
      query.category = category;
    }

    // Status Filter
    if (status === '2XX') {
      query.statusCode = { $gte: 200, $lt: 300 };
    } else if (status === '4XX') {
      query.statusCode = { $gte: 400, $lt: 500 };
    } else if (status === '5XX') {
      query.statusCode = { $gte: 500 };
    }

    // Search Filter
    if (search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { url: searchRegex },
        { method: searchRegex },
        { userEmail: searchRegex },
        { category: searchRegex },
      ];
    }

    const skip = (page - 1) * limit;

    const totalLogs = await ApiLog.countDocuments(query);
    const logs = await ApiLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalLogs / limit) || 1;

    return res.json({
      logs,
      totalLogs,
      totalPages,
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching API logs:', error);
    return res.status(500).json({ message: 'Failed to fetch API logs from database' });
  }
};

// @desc    Clear API logs from MongoDB
// @route   DELETE /api/logs
// @access  Protected/Admin
const clearLogs = async (req, res) => {
  try {
    await ApiLog.deleteMany({});
    return res.json({ message: 'All API logs cleared from MongoDB database' });
  } catch (error) {
    console.error('Error clearing API logs:', error);
    return res.status(500).json({ message: 'Failed to clear API logs' });
  }
};

module.exports = {
  getLogs,
  clearLogs,
};
