import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-secondary-800 shadow-inner py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
              P2P Trading
            </Link>
            <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
              Safe and secure peer-to-peer trading platform
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 md:gap-8">
            <div>
              <h3 className="text-sm font-semibold uppercase text-secondary-900 dark:text-white mb-2">
                Resources
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/support" className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold uppercase text-secondary-900 dark:text-white mb-2">
                Legal
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/terms" className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-sm text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-secondary-200 dark:border-secondary-700">
          <p className="text-center text-xs text-secondary-600 dark:text-secondary-400">
            &copy; {new Date().getFullYear()} P2P Trading Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
