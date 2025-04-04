import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = ({ open }) => {
  const location = useLocation();
  const { isAdmin } = useSelector((state) => state.auth);
  
  // Menu items
  const menuItems = [
    { to: '/dashboard', label: 'Dashboard', icon: 'home' },
    { to: '/trades', label: 'Trades', icon: 'exchange-alt' },
    { to: '/trades/new', label: 'Create Trade', icon: 'plus-circle' },
    { to: '/wallet', label: 'Wallet', icon: 'wallet' },
    { to: '/profile', label: 'Profile', icon: 'user' },
  ];
  
  // Admin menu items
  const adminMenuItems = [
    { to: '/admin', label: 'Admin Dashboard', icon: 'tachometer-alt' },
    { to: '/admin/disputes', label: 'Disputes', icon: 'gavel' },
    { to: '/admin/users', label: 'Users', icon: 'users' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-secondary-800 shadow-lg transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center px-6 border-b border-secondary-200 dark:border-secondary-700">
          <h2 className="text-xl font-semibold text-primary-600 dark:text-primary-400">Menu</h2>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-4">
            {menuItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    isActive(item.to)
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                      : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 dark:text-secondary-300 dark:hover:bg-secondary-700 dark:hover:text-white'
                  }`}
                >
                  <i className={`fas fa-${item.icon} w-5 h-5 mr-3`}></i>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          
          {isAdmin && (
            <>
              <div className="mt-8 mb-4 px-6">
                <h3 className="text-xs font-semibold text-secondary-500 uppercase tracking-wider">
                  Admin
                </h3>
              </div>
              <ul className="space-y-2 px-4">
                {adminMenuItems.map((item) => (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                        isActive(item.to)
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                          : 'text-secondary-600 hover:bg-secondary-100 hover:text-secondary-900 dark:text-secondary-300 dark:hover:bg-secondary-700 dark:hover:text-white'
                      }`}
                    >
                      <i className={`fas fa-${item.icon} w-5 h-5 mr-3`}></i>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </nav>
        
        <div className="p-4 border-t border-secondary-200 dark:border-secondary-700">
          <div className="px-4 py-3 bg-secondary-100 dark:bg-secondary-700 rounded-md">
            <p className="text-sm text-secondary-600 dark:text-secondary-300">
              Need help with trading?
            </p>
            <Link to="/about" className="mt-2 inline-block text-sm text-primary-600 dark:text-primary-400 hover:underline">
              View our guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
