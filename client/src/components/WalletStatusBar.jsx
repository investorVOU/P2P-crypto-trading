import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import WalletConnectButton from './WalletConnectButton';
import WalletAuthContext from '../contexts/WalletAuthContext';

const WalletStatusBar = () => {
  const { isAuthenticated, isAdmin, user, isLoading } = useContext(WalletAuthContext);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo and site name */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-900">P2P Trading</span>
            </Link>
            
            {/* Navigation links */}
            <nav className="ml-8 flex space-x-4">
              <Link to="/trades" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Trades
              </Link>
              {isAuthenticated && (
                <Link to="/create-trade" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Create Trade
                </Link>
              )}
              {isAuthenticated && (
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className="text-indigo-600 hover:text-indigo-900 px-3 py-2 rounded-md text-sm font-medium">
                  Admin
                </Link>
              )}
            </nav>
          </div>
          
          {/* Right side - wallet connection or user info */}
          <div className="flex items-center">
            {isAuthenticated && user && (
              <div className="mr-4 flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  {user.username ? user.username.charAt(0).toUpperCase() : '?'}
                </div>
                <span className="ml-2 text-sm font-medium text-gray-700">{user.username || 'User'}</span>
              </div>
            )}
            <WalletConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default WalletStatusBar;