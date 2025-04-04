import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import axios from 'axios';

const WalletConnectButton = ({ className, buttonText = "Connect Wallet" }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('No Ethereum wallet detected. Please install MetaMask or another Web3 wallet.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const address = accounts[0];
      
      if (!address) {
        throw new Error('No account selected');
      }
      
      // Get nonce from server
      const nonceResponse = await axios.get(`/api/wallet/nonce/${address}`);
      const { nonce } = nonceResponse.data;
      
      // Sign the nonce with the wallet
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(nonce);
      
      // Authenticate with the server
      const authResponse = await axios.post('/api/wallet/auth', {
        address,
        signature
      });
      
      // Handle successful authentication
      if (authResponse.status === 200) {
        dispatch({ 
          type: 'auth/login/fulfilled', 
          payload: authResponse.data 
        });
        
        // Redirect based on user role is handled in the parent component
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.response?.data?.message || err.message || 'Error connecting wallet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-2 text-xs text-red-600">
          {error}
        </div>
      )}
      <button
        type="button"
        onClick={connectWallet}
        disabled={loading}
        className={`inline-flex items-center justify-center px-4 py-2 ${className || 'border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50'}`}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </>
        ) : (
          <>
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4C2.89543 4 2 4.89543 2 6V7H18V6C18 4.89543 17.1046 4 16 4H4Z" />
              <path fillRule="evenodd" clipRule="evenodd" d="M18 9H2V14C2 15.1046 2.89543 16 4 16H16C17.1046 16 18 15.1046 18 14V9ZM4 13C4 12.4477 4.44772 12 5 12H6C6.55228 12 7 12.4477 7 13C7 13.5523 6.55228 14 6 14H5C4.44772 14 4 13.5523 4 13ZM9 12C8.44772 12 8 12.4477 8 13C8 13.5523 8.44772 14 9 14H10C10.5523 14 11 13.5523 11 13C11 12.4477 10.5523 12 10 12H9Z" />
            </svg>
            {buttonText}
          </>
        )}
      </button>
    </div>
  );
};

export default WalletConnectButton;