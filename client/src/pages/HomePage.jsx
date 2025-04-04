import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  return (
    <div className="py-12">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-secondary-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block">Secure Peer-to-Peer</span>
            <span className="block text-primary-600">Crypto Trading Platform</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-secondary-600 dark:text-secondary-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Trade cryptocurrency directly with other users through our secure escrow system.
            Fast, reliable, and with lower fees compared to centralized exchanges.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            {isAuthenticated ? (
              <>
                <div className="rounded-md shadow">
                  <Link
                    to="/trades"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                  >
                    View Trades
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link
                    to="/trades/new"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-secondary-50 dark:bg-secondary-800 dark:text-white dark:hover:bg-secondary-700 md:py-4 md:text-lg md:px-10"
                  >
                    Create Trade
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-md shadow">
                  <Link
                    to="/register"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-secondary-50 dark:bg-secondary-800 dark:text-white dark:hover:bg-secondary-700 md:py-4 md:text-lg md:px-10"
                  >
                    Log In
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-white dark:bg-secondary-800 mt-16 sm:mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 uppercase tracking-wide">Features</h2>
            <p className="mt-1 text-3xl font-extrabold text-secondary-900 dark:text-white sm:text-4xl sm:tracking-tight">
              Why Choose Our Platform
            </p>
            <p className="max-w-xl mt-5 mx-auto text-lg text-secondary-600 dark:text-secondary-400">
              Our platform offers unique benefits to ensure a safe and efficient trading experience.
            </p>
          </div>
          
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-secondary-50 dark:bg-secondary-700 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-600 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-secondary-900 dark:text-white tracking-tight">Secure Escrow</h3>
                    <p className="mt-5 text-base text-secondary-600 dark:text-secondary-400">
                      Our escrow system ensures that both parties fulfill their obligations before releasing funds.
                      Trade with complete peace of mind.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6">
                <div className="flow-root bg-secondary-50 dark:bg-secondary-700 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-600 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-secondary-900 dark:text-white tracking-tight">Low Fees</h3>
                    <p className="mt-5 text-base text-secondary-600 dark:text-secondary-400">
                      Enjoy significantly lower fees compared to centralized exchanges.
                      Keep more of your money while trading.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6">
                <div className="flow-root bg-secondary-50 dark:bg-secondary-700 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-600 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-secondary-900 dark:text-white tracking-tight">Global Trading</h3>
                    <p className="mt-5 text-base text-secondary-600 dark:text-secondary-400">
                      Connect with traders around the world.
                      Our platform supports multiple currencies and payment methods.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6">
                <div className="flow-root bg-secondary-50 dark:bg-secondary-700 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-600 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-secondary-900 dark:text-white tracking-tight">Integrated Chat</h3>
                    <p className="mt-5 text-base text-secondary-600 dark:text-secondary-400">
                      Communicate directly with your trading partner through our secure in-platform messaging system.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6">
                <div className="flow-root bg-secondary-50 dark:bg-secondary-700 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-600 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-secondary-900 dark:text-white tracking-tight">Dispute Resolution</h3>
                    <p className="mt-5 text-base text-secondary-600 dark:text-secondary-400">
                      Our experienced moderators are available to help resolve any disputes that may arise during trades.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-6">
                <div className="flow-root bg-secondary-50 dark:bg-secondary-700 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-600 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-secondary-900 dark:text-white tracking-tight">Reputation System</h3>
                    <p className="mt-5 text-base text-secondary-600 dark:text-secondary-400">
                      Our reputation system helps you find reliable trading partners with a proven track record.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="bg-primary-700 dark:bg-primary-800">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to start trading?</span>
            <span className="block">Create your account today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            Join thousands of users already trading on our platform.
            Get started in minutes with just a few simple steps.
          </p>
          <div className="mt-8 flex justify-center">
            {isAuthenticated ? (
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/trades/new"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
                >
                  Create New Trade
                </Link>
              </div>
            ) : (
              <div className="inline-flex rounded-md shadow">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50"
                >
                  Register Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
