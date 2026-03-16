const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: [true, 'Please provide company name'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Please provide job role'],
      trim: true,
    },
    resumeVersion: {
      type: String,
      default: 'version-1',
    },
    resumeFile: {
      filename: String,
      originalName: String,
      path: String,
      size: Number,
      mimeType: String,
      uploadedAt: {
        type: Date,
        default: null,
      },
    },
    jobDescription: {
      type: String,
      trim: true,
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    source: {
      type: String,
      enum: ['LinkedIn', 'Naukri', 'Indeed', 'Referral', 'Company Website', 'Other'],
      default: 'LinkedIn',
    },
    status: {
      type: String,
      enum: ['Applied', 'Interview', 'Rejected', 'Offer'],
      default: 'Applied',
    },
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD',
      },
    },
    notes: {
      type: String,
      trim: true,
    },
    interviewDate: {
      type: Date,
    },
    location: {
      type: String,
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Freelance'],
      default: 'Full-time',
    },
  },
  { timestamps: true }
);

// Index for faster queries
jobApplicationSchema.index({ userId: 1, createdAt: -1 });
jobApplicationSchema.index({ status: 1 });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);
