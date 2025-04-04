import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import WalletAuthContext from '../contexts/WalletAuthContext';
import WalletConnectButton from '../components/WalletConnectButton';

const HomePage = () => {
  const { isAuthenticated, user } = useContext(WalletAuthContext);

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="block">Secure P2P</span>
                <span className="block text-indigo-200">Crypto Trading</span>
              </h1>
              <p className="mt-6 text-xl text-indigo-100 max-w-3xl">
                Trade cryptocurrencies directly with other users in a secure, 
                decentralized environment with built-in escrow protection.
              </p>
              <div className="mt-10 flex space-x-4">
                <Link 
                  to="/trades" 
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
                >
                  Browse Trades
                </Link>
                {!isAuthenticated && (
                  <div className="inline-block">
                    <WalletConnectButton />
                  </div>
                )}
                {isAuthenticated && (
                  <Link 
                    to="/create-trade" 
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600"
                  >
                    Create Trade
                  </Link>
                )}
              </div>
            </div>
            <div className="mt-12 lg:mt-0">
              <div className="pl-4 ml-12 relative lg:m-0">
                <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl overflow-hidden p-8">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-blue-500 rounded-full"></div>
                        <span className="text-white font-medium">Bitcoin</span>
                      </div>
                      <span className="text-white font-medium">$48,950</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-indigo-500 rounded-full"></div>
                        <span className="text-white font-medium">Ethereum</span>
                      </div>
                      <span className="text-white font-medium">$3,650</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 bg-purple-500 rounded-full"></div>
                        <span className="text-white font-medium">Solana</span>
                      </div>
                      <span className="text-white font-medium">$178</span>
                    </div>
                    <div className="pt-6 border-t border-white/20">
                      <div className="flex justify-between items-center">
                        <span className="text-white">Active traders</span>
                        <span className="bg-green-500 text-white text-sm px-2 py-1 rounded-full">1,240+</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Features</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
              Why choose our platform
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Trade with confidence using our secure P2P trading platform
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Secure Escrow System</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Our built-in escrow system ensures that all trades are secure and funds are
                      only released when both parties confirm.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Real-time Chat</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Communicate directly with your trading partner through our
                      encrypted real-time messaging system.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-lg">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Dispute Resolution</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Our experienced moderators are available to help resolve
                      any disputes that may arise during trades.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to start trading?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Connect your wallet and start trading cryptocurrencies securely with other users.
          </p>
          <div className="mt-8 flex justify-center">
            {isAuthenticated ? (
              <Link
                to="/trades"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
              >
                Browse Available Trades
              </Link>
            ) : (
              <div className="transform scale-110">
                <WalletConnectButton />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;