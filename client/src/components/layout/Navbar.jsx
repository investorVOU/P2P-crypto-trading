import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { toggleDarkMode, toggleSidebar } from '../../features/ui/uiSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, isAdmin } = useSelector((state) => state.auth);
  const { isDarkMode, notificationCount } = useSelector((state) => state.ui);
  
  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };
  
  return (
    <nav className="fixed top-0 inset-x-0 z-30 bg-white dark:bg-secondary-800 shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Left side - Logo and mobile menu toggle */}
          <div className="flex items-center">
            {isAuthenticated && (
              <button
                type="button"
                className="md:hidden mr-2 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"
                onClick={() => dispatch(toggleSidebar())}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <Link to="/" className="flex items-center">
              <svg
                className="h-8 w-8 text-primary-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              <span className="ml-2 text-xl font-bold text-secondary-900 dark:text-white">P2P Trade</span>
            </Link>
          </div>
          
          {/* Right side - Navigation and user menu */}
          <div className="flex items-center space-x-4">
            {/* Theme toggle */}
            <button
              type="button"
              className="text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300"
              onClick={() => dispatch(toggleDarkMode())}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
            
            {/* User menu (when authenticated) */}
            {isAuthenticated ? (
              <div className="relative">
                <div className="flex items-center">
                  {/* Notification indicator */}
                  {notificationCount > 0 && (
                    <div className="relative mr-3">
                      <svg className="h-6 w-6 text-secondary-500 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <div className="absolute -top-1 -right-1 bg-danger-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </div>
                    </div>
                  )}
                  
                  {/* User info */}
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-medium">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="ml-2 hidden md:block">
                      <div className="text-sm font-medium text-secondary-900 dark:text-white">
                        {user?.username || 'User'}
                      </div>
                      <div className="text-xs text-secondary-500 dark:text-secondary-400">
                        {isAdmin ? 'Administrator' : 'Trader'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 py-1 bg-white dark:bg-secondary-800 rounded-md shadow-lg border border-secondary-200 dark:border-secondary-700 hidden group-hover:block">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 dark:text-secondary-300 dark:hover:bg-secondary-700"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 dark:text-secondary-300 dark:hover:bg-secondary-700"
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 dark:text-secondary-300 dark:hover:bg-secondary-700"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    type="button"
                    className="w-full text-left block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 dark:text-secondary-300 dark:hover:bg-secondary-700"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 text-sm font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
