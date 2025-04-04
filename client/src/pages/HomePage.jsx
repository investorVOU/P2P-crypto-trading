import React from 'react';
import { Link } from 'react-router-dom';
import WalletConnectButton from '../components/WalletConnectButton';

const HomePage = () => {
  return (
    <div className="bg-white">
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
    </div>
  );
};

export default HomePage;