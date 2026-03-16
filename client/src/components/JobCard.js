import React from 'react';
import './JobCard.css';

const JobCard = ({ job, onDelete, onStatusChange, onResumeUpload, onResumeDelete }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'status-applied';
      case 'Interview':
        return 'status-interview';
      case 'Rejected':
        return 'status-rejected';
      case 'Offer':
        return 'status-offer';
      default:
        return '';
    }
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      onResumeUpload(job._id, file);
    }
    // Reset input
    e.target.value = '';
  };

  const handleResumeDelete = () => {
    if (window.confirm('Delete this resume?')) {
      onResumeDelete(job._id);
    }
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div>
          <h3>{job.companyName}</h3>
          <p className="role">{job.role}</p>
        </div>
        <button
          className="delete-btn"
          onClick={() => onDelete(job._id)}
          title="Delete"
        >
          ✕
        </button>
      </div>

      <div className="job-card-body">
        {job.location && (
          <p>
            <strong>Location:</strong> {job.location}
          </p>
        )}
        <p>
          <strong>Source:</strong> {job.source}
        </p>
        <p>
          <strong>Job Type:</strong> {job.jobType}
        </p>
        <p>
          <strong>Resume:</strong> {job.resumeVersion}
        </p>
        <p>
          <strong>Applied:</strong> {formatDate(job.applicationDate)}
        </p>

        {job.resumeFile && (
          <div className="resume-file-section">
            <strong>📄 Resume Uploaded:</strong>
            <div className="resume-file-info">
              <a
                href={`${process.env.REACT_APP_API_URL?.split('/api')[0] || 'http://localhost:5000'}${job.resumeFile.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="resume-download-link"
              >
                📥 {job.resumeFile.originalName}
              </a>
              <button
                className="resume-delete-btn"
                onClick={handleResumeDelete}
                title="Delete resume"
              >
                ✕
              </button>
            </div>
            <small>{(job.resumeFile.size / 1024).toFixed(2)} KB</small>
          </div>
        )}

        <div className="resume-upload-section">
          <label htmlFor={`resume-${job._id}`} className="resume-upload-label">
            {job.resumeFile ? '📝 Change Resume' : '📄 Upload Resume'}
          </label>
          <input
            id={`resume-${job._id}`}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleResumeUpload}
            className="resume-upload-input"
          />
        </div>

        {job.jobDescription && (
          <div className="job-description">
            <strong>Description:</strong>
            <p>{job.jobDescription.substring(0, 150)}...</p>
          </div>
        )}

        {job.notes && (
          <div className="notes">
            <strong>Notes:</strong>
            <p>{job.notes}</p>
          </div>
        )}
      </div>

      <div className="job-card-footer">
        <select
          value={job.status}
          onChange={(e) => onStatusChange(job._id, e.target.value)}
          className={`status-select ${getStatusColor(job.status)}`}
        >
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Rejected">Rejected</option>
          <option value="Offer">Offer</option>
        </select>
      </div>
    </div>
  );
};

export default JobCard;
