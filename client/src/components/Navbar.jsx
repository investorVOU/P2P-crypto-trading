import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, toggleDarkMode } from '../features/ui/uiSlice';
import { logout } from '../features/auth/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.ui);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white dark:bg-secondary-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            {isAuthenticated && (
              <button
                onClick={() => dispatch(toggleSidebar())}
                className="inline-flex items-center justify-center p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 focus:outline-none focus:bg-secondary-100 focus:text-secondary-500 transition duration-150 ease-in-out"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
                P2P Trading
              </Link>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link to="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-secondary-500 hover:text-secondary-700 hover:border-secondary-300 transition duration-150 ease-in-out">
                Home
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-secondary-500 hover:text-secondary-700 hover:border-secondary-300 transition duration-150 ease-in-out">
                    Dashboard
                  </Link>
                  <Link to="/trades" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-secondary-500 hover:text-secondary-700 hover:border-secondary-300 transition duration-150 ease-in-out">
                    Trades
                  </Link>
                  <Link to="/wallet" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-secondary-500 hover:text-secondary-700 hover:border-secondary-300 transition duration-150 ease-in-out">
                    Wallet
                  </Link>
                </>
              ) : (
                <Link to="/about" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-secondary-500 hover:text-secondary-700 hover:border-secondary-300 transition duration-150 ease-in-out">
                  About
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            <button
              onClick={() => dispatch(toggleDarkMode())}
              className="p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-100 focus:outline-none focus:bg-secondary-100 focus:text-secondary-500 transition duration-150 ease-in-out"
            >
              {darkMode ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            {isAuthenticated ? (
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <Link to="/profile" className="flex items-center text-sm font-medium text-secondary-700 hover:text-secondary-900 mr-4">
                    {user?.username || 'User'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn btn-secondary"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
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
