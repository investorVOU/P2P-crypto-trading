import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8000', // or your server URL in production
  withCredentials: true, // needed for cookies/session
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Handle 401 Unauthorized globally
    if (response && response.status === 401) {
      // Redirect to login or dispatch logout action if needed
    }
    
    return Promise.reject(error);
  }
);

export default api;
