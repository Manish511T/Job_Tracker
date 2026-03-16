import React, { useState, useEffect } from 'react';
import { smartRecallAPI } from '../services/api';
import './SmartRecall.css';

const SmartRecall = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [intro, setIntro] = useState('');
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  const [tempIntro, setTempIntro] = useState('');

  // Load self-introduction on mount
  useEffect(() => {
    const savedIntro = localStorage.getItem('selfIntroduction') || '';
    setIntro(savedIntro);
    setTempIntro(savedIntro);
  }, []);

  // Listen for F2 key press
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        setIsOpen(!isOpen);
        setQuery('');
        setResults([]);
        setError('');
      }
      // Close on Escape
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  const handleSaveIntro = () => {
    localStorage.setItem('selfIntroduction', tempIntro);
    setIntro(tempIntro);
    setIsEditingIntro(false);
  };

  const handleCopyIntro = () => {
    if (intro) {
      navigator.clipboard.writeText(intro);
      alert('Introduction copied to clipboard!');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await smartRecallAPI.search(query);
      setResults(response.data.results || []);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Error searching applications'
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        className="smart-recall-btn"
        onClick={() => setIsOpen(true)}
        title="Quick access to your job applications"
      >
        🚀 Smart Recall
      </button>
    );
  }

  return (
    <div className="smart-recall-overlay">
      <div className="smart-recall-modal">
        <div className="smart-recall-header">
          <h2>🚀 Smart Recall Assistant</h2>
          <p>Search by company name or role (ESC to close)</p>
          <button
            className="close-btn"
            onClick={() => setIsOpen(false)}
            title="Close (ESC)"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by company name or role..."
            className="search-input"
            autoFocus
          />
          <button type="submit" disabled={loading}>
            {loading ? '⏳ Searching...' : '🔍 Search'}
          </button>
        </form>

        {/* Self Introduction Section */}
        <div className="intro-section">
          <div className="intro-header">
            <h3>📝 Quick Introduction</h3>
            <button
              type="button"
              className="edit-intro-btn"
              onClick={() => setIsEditingIntro(!isEditingIntro)}
            >
              {isEditingIntro ? '✕ Cancel' : '✏️ Edit'}
            </button>
          </div>

          {!isEditingIntro ? (
            <div className="intro-display">
              {intro ? (
                <>
                  <p>{intro}</p>
                  <button
                    type="button"
                    className="copy-intro-btn"
                    onClick={handleCopyIntro}
                    title="Copy to clipboard"
                  >
                    📋 Copy
                  </button>
                </>
              ) : (
                <p className="intro-placeholder">
                  Add a self-introduction to quickly reference during calls...
                </p>
              )}
            </div>
          ) : (
            <div className="intro-edit">
              <textarea
                value={tempIntro}
                onChange={(e) => setTempIntro(e.target.value)}
                placeholder="E.g., Hi, I'm a software engineer with 5 years of experience in full-stack development..."
                className="intro-textarea"
                rows="3"
              />
              <button
                type="button"
                className="save-intro-btn"
                onClick={handleSaveIntro}
              >
                ✓ Save Introduction
              </button>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="results-container">
          {results.length === 0 && !loading && !error && query && (
            <p className="no-results">No applications found. Try another search.</p>
          )}

          {results.map((result) => (
            <div key={result.id} className="recall-card">
              <div className="card-header">
                <div className="card-title">
                  <h3>{result.role}</h3>
                  <p className="company">{result.company}</p>
                </div>
                <span className={`status-badge status-${result.status.toLowerCase()}`}>
                  {result.status}
                </span>
              </div>

              <div className="card-body">
                <div className="meta-info">
                  <span className="meta-item">
                    <strong>Resume:</strong> {result.resumeVersion}
                  </span>
                </div>

                <div className="brief-section">
                  <h4>🎯 Key Points:</h4>
                  <ul className="brief-list">
                    {result.brief.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>

                {result.summary && (
                  <div className="summary-section">
                    <h4>📋 JD Summary:</h4>
                    <p>{result.summary}...</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="smart-recall-footer">
          <p>
            Found <strong>{results.length}</strong> result{results.length !== 1 ? 's' : ''}
            {results.length > 0 && ' • Press ESC to close'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartRecall;
