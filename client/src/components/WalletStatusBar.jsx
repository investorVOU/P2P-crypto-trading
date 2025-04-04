import React from 'react';
import { useWalletAuth } from '../contexts/WalletAuthContext';
import WalletConnectButton from './WalletConnectButton';

const WalletStatusBar = () => {
  const { isWalletConnected, walletAddress, loading, disconnectWallet } = useWalletAuth();

  return (
    <div className="bg-gray-100 border-b border-gray-200 py-2">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="text-sm text-gray-700">
          {loading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Checking wallet...
            </span>
          ) : isWalletConnected ? (
            <span className="flex items-center">
              <svg className="h-4 w-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"></path>
              </svg>
              Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
          ) : (
            <span>Not connected to a wallet</span>
          )}
        </div>
        
        <div>
          {isWalletConnected ? (
            <button
              onClick={disconnectWallet}
              className="text-sm text-gray-600 hover:text-gray-900 flex items-center"
            >
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Disconnect
            </button>
          ) : (
            <WalletConnectButton 
              buttonText="Connect Wallet" 
              className="text-sm bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletStatusBar;