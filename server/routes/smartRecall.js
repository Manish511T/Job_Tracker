const express = require('express');
const JobApplication = require('../models/JobApplication');
const { protect } = require('../middleware/auth');
const { generateAIBrief } = require('../utils/aiBrief');

const router = express.Router();

// Protect all routes
router.use(protect);

// Smart recall search - search by company or role
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Search for company name or role (case-insensitive)
    const applications = await JobApplication.find({
      userId: req.userId,
      $or: [
        { companyName: { $regex: query, $options: 'i' } },
        { role: { $regex: query, $options: 'i' } },
      ],
    })
      .select('companyName role resumeVersion jobDescription status')
      .limit(5)
      .sort({ createdAt: -1 });

    if (applications.length === 0) {
      return res.status(404).json({
        message: 'No applications found matching your search',
        results: [],
      });
    }

    // Generate AI brief for each result
    const results = applications.map((app) => ({
      id: app._id,
      company: app.companyName,
      role: app.role,
      resumeVersion: app.resumeVersion,
      status: app.status,
      summary: app.jobDescription ? app.jobDescription.substring(0, 200) : '',
      brief: generateAIBrief(app.jobDescription),
    }));

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error('Smart recall search error:', error);
    res.status(500).json({
      message: 'Error searching applications',
      error: error.message,
    });
  }
});

module.exports = router;
