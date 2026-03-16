const express = require('express');
const multer = require('multer');
const JobApplication = require('../models/JobApplication');
const { protect } = require('../middleware/auth');
const { handleFileUpload, deleteFile } = require('../utils/uploadHandler');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Allow PDF, Word docs, images
    const allowedMimes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          'Invalid file type. Only PDF, Word documents, and images are allowed.'
        )
      );
    }
  },
});

router.use(protect);

// Upload resume for a job application
router.post('/:jobId/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    // Verify job application belongs to user
    const jobApplication = await JobApplication.findById(req.params.jobId);
    if (!jobApplication || jobApplication.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    // Delete old resume if exists
    if (jobApplication.resumeFile && jobApplication.resumeFile.filename) {
      deleteFile(jobApplication.resumeFile.filename);
    }

    // Save new resume
    const resumeData = handleFileUpload(req.file, 'resumes');
    resumeData.uploadedAt = new Date();

    jobApplication.resumeFile = resumeData;
    await jobApplication.save();

    res.status(200).json({
      message: 'Resume uploaded successfully',
      resume: resumeData,
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({
      message: 'Error uploading resume',
      error: error.message,
    });
  }
});

// Delete resume for a job application
router.delete('/:jobId/resume', async (req, res) => {
  try {
    const jobApplication = await JobApplication.findById(req.params.jobId);
    if (!jobApplication || jobApplication.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    if (jobApplication.resumeFile && jobApplication.resumeFile.filename) {
      deleteFile(jobApplication.resumeFile.filename);
      jobApplication.resumeFile = undefined;
      await jobApplication.save();

      return res.status(200).json({ message: 'Resume deleted successfully' });
    }

    res.status(400).json({ message: 'No resume to delete' });
  } catch (error) {
    console.error('Resume delete error:', error);
    res.status(500).json({
      message: 'Error deleting resume',
      error: error.message,
    });
  }
});

module.exports = router;
