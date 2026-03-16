const express = require('express');
const { parseJobDescription } = require('../utils/jdParser');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Parse job description
router.post('/', [body('jobDescription').notEmpty().withMessage('Job description is required')], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { jobDescription } = req.body;
    const parsedData = parseJobDescription(jobDescription);

    res.status(200).json({
      success: true,
      data: parsedData,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error parsing job description', error: error.message });
  }
});

module.exports = router;
