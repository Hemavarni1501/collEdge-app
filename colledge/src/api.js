// src/api.js
// Centralized API configuration.
// In production: reads REACT_APP_API_URL from Vercel env vars (your Render backend URL)
// In development: falls back to localhost

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

console.log('🔗 CollEdge API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
});

export default api;
export { API_URL };
