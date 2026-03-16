import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { jobAPI, jdAPI } from '../services/api';
import Navbar from '../components/Navbar';
import './AddJob.css';

const AddJob = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    jobDescription: '',
    resumeVersion: 'version-1',
    source: 'LinkedIn',
    location: '',
    jobType: 'Full-time',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showParser, setShowParser] = useState(false);
  const [rawJD, setRawJD] = useState('');
  const [parsingLoading, setParsingLoading] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  if (!isAuthenticated) {
    navigate('/');
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleParseJD = async () => {
    if (!rawJD.trim()) {
      setError('Please paste a job description to parse');
      return;
    }

    setParsingLoading(true);
    setError('');

    try {
      const response = await jdAPI.parseJobDescription(rawJD);
      setParsedData(response.data.data);
    } catch (err) {
      setError('Error parsing job description. Please try again.');
      console.error(err);
    } finally {
      setParsingLoading(false);
    }
  };

  const handleAutoFill = () => {
    if (parsedData) {
      setFormData((prev) => ({
        ...prev,
        companyName: parsedData.company || prev.companyName,
        role: parsedData.role || prev.role,
        location: parsedData.location || prev.location,
        jobDescription: rawJD || prev.jobDescription,
        notes: parsedData.skills
          ? `Skills Required: ${parsedData.skills.join(', ')}\nExperience: ${parsedData.experience}\nSummary: ${parsedData.summary}`
          : prev.notes,
      }));
      setShowParser(false);
      setParsedData(null);
      setRawJD('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await jobAPI.create(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          'An error occurred'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-job-page">
      <Navbar />

      <div className="add-job-container">
        <h1>Add Job Application</h1>

        {error && <div className="error-message">{error}</div>}

        {/* JD Parser Section */}
        <div className="jd-parser-section">
          <button
            type="button"
            className="toggle-parser-btn"
            onClick={() => setShowParser(!showParser)}
          >
            {showParser ? '✕ Close JD Parser' : '📄 Parse Job Description'}
          </button>

          {showParser && (
            <div className="parser-card">
              <h3>Job Description Parser</h3>
              <p className="parser-info">Paste your job description below and we'll auto-extract the details</p>

              <textarea
                value={rawJD}
                onChange={(e) => setRawJD(e.target.value)}
                placeholder="Paste the complete job description here..."
                className="jd-textarea"
                rows="8"
              />

              <button
                type="button"
                className="parse-btn"
                onClick={handleParseJD}
                disabled={parsingLoading}
              >
                {parsingLoading ? 'Parsing...' : 'Parse JD'}
              </button>

              {parsedData && (
                <div className="parsed-results">
                  <h4>Parsed Data</h4>
                  <div className="result-grid">
                    {parsedData.company && (
                      <div className="result-item">
                        <strong>Company:</strong> {parsedData.company}
                      </div>
                    )}
                    {parsedData.role && (
                      <div className="result-item">
                        <strong>Role:</strong> {parsedData.role}
                      </div>
                    )}
                    {parsedData.location && (
                      <div className="result-item">
                        <strong>Location:</strong> {parsedData.location}
                      </div>
                    )}
                    {parsedData.experience && (
                      <div className="result-item">
                        <strong>Experience:</strong> {parsedData.experience}
                      </div>
                    )}
                    {parsedData.skills && parsedData.skills.length > 0 && (
                      <div className="result-item full-width">
                        <strong>Skills Required:</strong>
                        <div className="skills-list">
                          {parsedData.skills.map((skill, idx) => (
                            <span key={idx} className="skill-tag">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {parsedData.summary && (
                      <div className="result-item full-width">
                        <strong>Summary:</strong>
                        <p>{parsedData.summary}</p>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="auto-fill-btn"
                    onClick={handleAutoFill}
                  >
                    ✓ Auto-fill Form with Parsed Data
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="job-form">
          <div className="form-row">
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g., Google"
                required
              />
            </div>

            <div className="form-group">
              <label>Role *</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g., Software Engineer"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Source</label>
              <select name="source" value={formData.source} onChange={handleChange}>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Naukri">Naukri</option>
                <option value="Indeed">Indeed</option>
                <option value="Referral">Referral</option>
                <option value="Company Website">Company Website</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Remote, New York"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Job Type</label>
              <select name="jobType" value={formData.jobType} onChange={handleChange}>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div className="form-group">
              <label>Resume Version</label>
              <input
                type="text"
                name="resumeVersion"
                value={formData.resumeVersion}
                onChange={handleChange}
                placeholder="e.g., version-1"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Job Description</label>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="Paste the job description here..."
              rows="6"
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any additional notes..."
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Application'}
            </button>
            <button type="button" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddJob;
