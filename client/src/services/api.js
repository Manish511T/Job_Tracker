import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
};

// Job Applications API
export const jobAPI = {
  getAll: () => api.get('/job-applications'),
  getById: (id) => api.get(`/job-applications/${id}`),
  create: (jobData) => api.post('/job-applications', jobData),
  update: (id, jobData) => api.put(`/job-applications/${id}`, jobData),
  delete: (id) => api.delete(`/job-applications/${id}`),
  getStats: () => api.get('/job-applications/stats/summary'),
};

// JD Parser API
export const jdAPI = {
  parseJobDescription: (jobDescription) =>
    api.post('/parse-jd', { jobDescription }),
};

// Smart Recall API
export const smartRecallAPI = {
  search: (query) => api.get(`/smart-recall/search?query=${query}`),
};

// Resume Upload API
export const resumeAPI = {
  upload: (jobId, formData) =>
    api.post(`/resumes/${jobId}/upload-resume`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  delete: (jobId) => api.delete(`/resumes/${jobId}/resume`),
};

export default api;
