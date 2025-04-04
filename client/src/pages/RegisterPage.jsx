import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../features/auth/authSlice';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isLoading } = useSelector((state) => state.auth);
  
  useEffect(() => {
    // Clear any previous error on component mount
    dispatch(clearError());
  }, [dispatch]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    // Validate username
    if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters long';
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Validate password
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    // Validate terms agreement
    if (!agreeTerms) {
      errors.terms = 'You must agree to the terms and conditions';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Create registration data (omit confirmPassword)
    const { confirmPassword, ...registrationData } = formData;
    
    try {
      const resultAction = await dispatch(register(registrationData));
      if (register.fulfilled.match(resultAction)) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-secondary-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
              Sign in
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-danger-100 border border-danger-400 text-danger-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                  formErrors.username ? 'border-danger-300' : 'border-secondary-300'
                } rounded-md shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                placeholder="Enter a username"
                value={formData.username}
                onChange={handleChange}
              />
              {formErrors.username && (
                <p className="mt-1 text-sm text-danger-600">{formErrors.username}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                  formErrors.email ? 'border-danger-300' : 'border-secondary-300'
                } rounded-md shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                placeholder="Your email address"
                value={formData.email}
                onChange={handleChange}
              />
              {formErrors.email && (
                <p className="mt-1 text-sm text-danger-600">{formErrors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                  formErrors.password ? 'border-danger-300' : 'border-secondary-300'
                } rounded-md shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
              />
              {formErrors.password && (
                <p className="mt-1 text-sm text-danger-600">{formErrors.password}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={`mt-1 appearance-none block w-full px-3 py-2 border ${
                  formErrors.confirmPassword ? 'border-danger-300' : 'border-secondary-300'
                } rounded-md shadow-sm placeholder-secondary-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-danger-600">{formErrors.confirmPassword}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded ${
                formErrors.terms ? 'border-danger-300' : ''
              }`}
              checked={agreeTerms}
              onChange={(e) => {
                setAgreeTerms(e.target.checked);
                if (e.target.checked && formErrors.terms) {
                  setFormErrors(prev => ({ ...prev, terms: '' }));
                }
              }}
            />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-secondary-900 dark:text-secondary-300">
              I agree to the{' '}
              <Link to="/terms" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                Privacy Policy
              </Link>
            </label>
          </div>
          {formErrors.terms && (
            <p className="mt-1 text-sm text-danger-600">{formErrors.terms}</p>
          )}
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading && (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              )}
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
