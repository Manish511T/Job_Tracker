import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { jobAPI, resumeAPI } from '../services/api';
import Navbar from '../components/Navbar';
import JobCard from '../components/JobCard';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    } else {
      fetchJobs();
    }
  }, [isAuthenticated, navigate]);

  const fetchJobs = async () => {
    try {
      const response = await jobAPI.getAll();
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await jobAPI.delete(id);
        setJobs(jobs.filter((job) => job._id !== id));
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await jobAPI.update(id, { status: newStatus });
      setJobs(jobs.map((job) => (job._id === id ? response.data : job)));
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const handleResumeUpload = async (jobId, file) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await resumeAPI.upload(jobId, formData);
      setJobs(
        jobs.map((job) =>
          job._id === jobId ? { ...job, resumeFile: response.data.resume } : job
        )
      );
      alert('Resume uploaded successfully!');
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert(error.response?.data?.message || 'Error uploading resume');
    }
  };

  const handleResumeDelete = async (jobId) => {
    try {
      await resumeAPI.delete(jobId);
      setJobs(
        jobs.map((job) =>
          job._id === jobId ? { ...job, resumeFile: undefined } : job
        )
      );
      alert('Resume deleted successfully!');
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Error deleting resume');
    }
  };

  const filteredJobs =
    filter === 'All' ? jobs : jobs.filter((job) => job.status === filter);

  return (
    <div className="dashboard">
      <Navbar />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <button className="add-btn" onClick={() => navigate('/add-job')}>
            + Add Job Application
          </button>
        </div>

        <div className="stats-section">
          <div className="stat-card">
            <h3>Total Applications</h3>
            <p>{jobs.length}</p>
          </div>
          <div className="stat-card">
            <h3>Applied</h3>
            <p>{jobs.filter((j) => j.status === 'Applied').length}</p>
          </div>
          <div className="stat-card">
            <h3>Interviews</h3>
            <p>{jobs.filter((j) => j.status === 'Interview').length}</p>
          </div>
          <div className="stat-card">
            <h3>Offers</h3>
            <p>{jobs.filter((j) => j.status === 'Offer').length}</p>
          </div>
        </div>

        <div className="filter-section">
          {['All', 'Applied', 'Interview', 'Rejected', 'Offer'].map((status) => (
            <button
              key={status}
              className={`filter-btn ${filter === status ? 'active' : ''}`}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : filteredJobs.length === 0 ? (
          <p className="no-data">No job applications found</p>
        ) : (
          <div className="jobs-grid">
            {filteredJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onResumeUpload={handleResumeUpload}
                onResumeDelete={handleResumeDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
