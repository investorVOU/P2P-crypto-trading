
import React from 'react';
import { Link } from 'react-router-dom';
import WalletConnectButton from '../components/WalletConnectButton';

const HomePage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              <span className="block">Secure P2P</span>
              <span className="block text-indigo-200">Crypto Trading</span>
            </h1>
            <p className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto">
              Trade cryptocurrencies directly with other users in a secure, 
              decentralized environment with built-in escrow protection.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Link 
                to="/trades" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
              >
                Browse Trades
              </Link>
              <div className="inline-block">
                <WalletConnectButton />
              </div>
            </div>
          </div>

          {/* Live Market Stats */}
          <div className="mt-12 bg-white/10 backdrop-blur-md rounded-lg shadow-xl overflow-hidden p-8 max-w-md mx-auto">
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

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Choose Our Platform</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-4">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Escrow</h3>
              <p className="text-gray-600">Trade with confidence using our built-in escrow system that protects both buyers and sellers.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-4">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Chat</h3>
              <p className="text-gray-600">Communicate directly with your trading partners through our secure messaging system.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-4">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Dispute Resolution</h3>
              <p className="text-gray-600">Our dedicated support team helps resolve any trading disputes quickly and fairly.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trading Stats */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">$10M+</div>
              <div className="mt-2 text-gray-600">Trading Volume</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">50K+</div>
              <div className="mt-2 text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">100K+</div>
              <div className="mt-2 text-gray-600">Completed Trades</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600">99.9%</div>
              <div className="mt-2 text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100"></div>
                <div className="ml-4">
                  <div className="font-semibold">Alex Thompson</div>
                  <div className="text-gray-500 text-sm">Verified Trader</div>
                </div>
              </div>
              <p className="text-gray-600">"The escrow system gives me peace of mind when trading. Best P2P platform I've used!"</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100"></div>
                <div className="ml-4">
                  <div className="font-semibold">Sarah Chen</div>
                  <div className="text-gray-500 text-sm">Crypto Enthusiast</div>
                </div>
              </div>
              <p className="text-gray-600">"Fast, secure, and reliable. The support team is always helpful when needed."</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100"></div>
                <div className="ml-4">
                  <div className="font-semibold">Michael Davis</div>
                  <div className="text-gray-500 text-sm">Regular Trader</div>
                </div>
              </div>
              <p className="text-gray-600">"The real-time chat feature makes negotiating trades smooth and efficient."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
