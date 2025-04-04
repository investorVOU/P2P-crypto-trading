import axios from 'axios';
import { store } from '../redux/store';
import { addNotification } from '../features/ui/uiSlice';

// Create an axios instance with base URL and CSRF header
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for auth headers
api.interceptors.request.use(
  (config) => {
    // This can be used to add any auth tokens needed in the future
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for common error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Extract the error message
    const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
    
    // Get status code
    const status = error.response?.status;
    
    // Handle specific error cases
    if (status === 401) {
      // Unauthorized: User not logged in
      store.dispatch(
        addNotification({
          type: 'error',
          title: 'Authentication Required',
          message: 'Please log in to continue.',
        })
      );
    } else if (status === 403) {
      // Forbidden: User doesn't have permission
      store.dispatch(
        addNotification({
          type: 'error',
          title: 'Access Denied',
          message: 'You do not have permission to perform this action.',
        })
      );
    } else if (status === 404) {
      // Not Found
      store.dispatch(
        addNotification({
          type: 'error',
          title: 'Not Found',
          message: 'The requested resource was not found.',
        })
      );
    } else if (status === 429) {
      // Rate limited
      store.dispatch(
        addNotification({
          type: 'warning',
          title: 'Too Many Requests',
          message: 'Please slow down and try again later.',
        })
      );
    } else if (status >= 500) {
      // Server Errors
      store.dispatch(
        addNotification({
          type: 'error',
          title: 'Server Error',
          message: 'Something went wrong on our end. Please try again later.',
        })
      );
    } else {
      // General client errors
      store.dispatch(
        addNotification({
          type: 'error',
          title: 'Operation Failed',
          message: errorMessage,
        })
      );
    }
    
    return Promise.reject(error);
  }
);

export default api;
