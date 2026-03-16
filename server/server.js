const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const jobApplicationRoutes = require('./routes/jobApplications');
const jdParserRoutes = require('./routes/jdParser');
const smartRecallRoutes = require('./routes/smartRecall');
const resumeUploadRoutes = require('./routes/resumeUpload');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/job-applications', jobApplicationRoutes);
app.use('/api/parse-jd', jdParserRoutes);
app.use('/api/smart-recall', smartRecallRoutes);
app.use('/api/resumes', resumeUploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
