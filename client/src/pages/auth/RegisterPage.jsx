import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, resetAuthError } from '../../features/auth/authSlice';
import { addNotification } from '../../features/ui/uiSlice';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    acceptTerms: false,
  });
  
  const [errors, setErrors] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  
  useEffect(() => {
    // Reset any auth errors when mounting component
    dispatch(resetAuthError());
  }, [dispatch]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear specific field error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validate username
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Validate confirmPassword
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Validate fullName (optional)
    if (formData.fullName && formData.fullName.length < 2) {
      newErrors.fullName = 'Full name is too short';
    }
    
    // Validate terms
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const userData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          full_name: formData.fullName,
        };
        
        const resultAction = await dispatch(register(userData));
        if (register.fulfilled.match(resultAction)) {
          // Successfully registered
          dispatch(
            addNotification({
              type: 'success',
              title: 'Registration Successful',
              message: 'Welcome to P2P Trade! Your account has been created successfully.',
            })
          );
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Registration error:', err);
      }
    } else {
      // Form has errors
      dispatch(
        addNotification({
          type: 'error',
          title: 'Validation Error',
          message: 'Please fix the errors in the form and try again.',
        })
      );
    }
  };
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-secondary-900 dark:text-white">Create your account</h2>
          <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
              Sign in
            </Link>
          </p>
        </div>
        
        <div className="mt-8 bg-white dark:bg-secondary-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-danger-50 dark:bg-danger-900 dark:bg-opacity-10 border-l-4 border-danger-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-danger-700 dark:text-danger-400">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Username*
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`form-input ${errors.username ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                  placeholder="Choose a username"
                />
                {errors.username && <p className="form-error">{errors.username}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Email address*
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${errors.email ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Full name (optional)
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`form-input ${errors.fullName ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && <p className="form-error">{errors.fullName}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Password*
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${errors.password ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                  placeholder="Create a password"
                />
                {errors.password && <p className="form-error">{errors.password}</p>}
              </div>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Confirm password*
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${errors.confirmPassword ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500' : ''}`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded dark:border-secondary-600 dark:bg-secondary-800 ${
                  errors.acceptTerms ? 'border-danger-500' : ''
                }`}
              />
              <label htmlFor="acceptTerms" className="ml-2 block text-sm text-secondary-700 dark:text-secondary-300">
                I accept the{' '}
                <Link to="/terms" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.acceptTerms && <p className="form-error mt-1">{errors.acceptTerms}</p>}
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-primary py-2"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create account'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-300 dark:border-secondary-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm bg-white dark:bg-secondary-700 text-sm font-medium text-secondary-700 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-600"
                >
                  <svg className="h-5 w-5 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                    />
                  </svg>
                  <span className="ml-2">Google</span>
                </a>
              </div>
              
              <div>
                <a
                  href="#"
                  className="w-full inline-flex justify-center py-2 px-4 border border-secondary-300 dark:border-secondary-600 rounded-md shadow-sm bg-white dark:bg-secondary-700 text-sm font-medium text-secondary-700 dark:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-600"
                >
                  <svg className="h-5 w-5 text-[#24292F] dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
                  </svg>
                  <span className="ml-2">GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
