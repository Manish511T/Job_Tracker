const express = require('express');
const JobApplication = require('../models/JobApplication');
const { protect } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Protect all routes
router.use(protect);

// Get all job applications for the user
router.get('/', async (req, res) => {
  try {
    const applications = await JobApplication.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single job application
router.get('/:id', async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);

    if (!application || application.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new job application
router.post(
  '/',
  [
    body('companyName').trim().notEmpty().withMessage('Company name is required'),
    body('role').trim().notEmpty().withMessage('Role is required'),
    body('source')
      .isIn(['LinkedIn', 'Naukri', 'Indeed', 'Referral', 'Company Website', 'Other'])
      .withMessage('Invalid source'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const {
        companyName,
        role,
        jobDescription,
        resumeVersion,
        source,
        location,
        jobType,
        notes,
      } = req.body;

      const application = new JobApplication({
        userId: req.userId,
        companyName,
        role,
        jobDescription,
        resumeVersion,
        source,
        location,
        jobType,
        notes,
      });

      await application.save();
      res.status(201).json(application);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Update job application
router.put('/:id', async (req, res) => {
  try {
    let application = await JobApplication.findById(req.params.id);

    if (!application || application.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    // Update allowed fields
    const allowedUpdates = [
      'companyName',
      'role',
      'jobDescription',
      'resumeVersion',
      'source',
      'status',
      'salary',
      'notes',
      'interviewDate',
      'location',
      'jobType',
    ];

    allowedUpdates.forEach((update) => {
      if (req.body[update] !== undefined) {
        application[update] = req.body[update];
      }
    });

    await application.save();
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete job application
router.delete('/:id', async (req, res) => {
  try {
    const application = await JobApplication.findById(req.params.id);

    if (!application || application.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    await JobApplication.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Job application deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await JobApplication.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(req.userId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
