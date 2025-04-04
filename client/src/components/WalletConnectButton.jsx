import React, { useContext, useState } from 'react';
import WalletAuthContext from '../contexts/WalletAuthContext';

const WalletConnectButton = () => {
  const { connectWallet, disconnectWallet, currentAccount, isLoading, setIsLoading, error, setCurrentAccount, setBalance } = useContext(WalletAuthContext);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask to use this feature');
      }

      setIsLoading(true);
      setIsConnecting(true);

      // Check if already connected
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock your MetaMask wallet.');
      }

      const address = accounts[0];
      setCurrentAccount(address);

      // Get the balance
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });

      // Convert balance from wei to ether
      const etherBalance = parseInt(balance, 16) / Math.pow(10, 18);
      setBalance(etherBalance.toFixed(4));

    } catch (error) {
      console.error('Error in connect button handler:', error);
      let errorMessage = 'Failed to connect wallet. ';

      if (error.code === 4001) {
        errorMessage = 'You rejected the connection request. Please try again.';
      } else if (error.code === -32002) {
        errorMessage = 'Please check MetaMask. Connection request pending.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
  };

  // Helper function to truncate address for display
  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Always show connect button regardless of browser type
  const showConnectButton = () => {
    if (!currentAccount) {
      return (
        <button
          onClick={handleConnectWallet}
          disabled={isLoading || isConnecting}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
            isLoading || isConnecting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isLoading || isConnecting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Connect Wallet</span>
            </>
          )}
        </button>
      );
    }
    return (
      <button
        onClick={handleDisconnectWallet}
        className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg transition-colors duration-200"
      >
        <span className="font-medium">{truncateAddress(currentAccount)}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    );
  };

  return showConnectButton();
};

export default WalletConnectButton;