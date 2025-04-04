import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

// Declare ethers variable outside component to be used later
let ethers = null;

const WalletConnectButton = ({ className, buttonText = "Connect Wallet" }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  // Dynamically import ethers.js when component mounts
  useEffect(() => {
    async function loadEthers() {
      try {
        const ethersModule = await import('ethers');
        ethers = ethersModule;
        console.log('Ethers library loaded successfully');
        
        // Check if already connected
        await checkIfWalletIsConnected();
      } catch (error) {
        console.error('Failed to load ethers library:', error);
      }
    }
    
    loadEthers();
    
    // Add event listeners for wallet events
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
      window.ethereum.on('disconnect', handleDisconnect);
    }
    
    return () => {
      // Clean up event listeners
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', () => {});
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, []);
  
  // Check if wallet is already connected
  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum || !ethers) return;
    
    try {
      // Check if we're authorized to access the user's wallet
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        // User is already connected
        const address = accounts[0].address;
        setIsConnected(true);
        setWalletAddress(address);
        
        // Authenticate with the server
        await authenticateWallet(address);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };
  
  // Handle when user changes accounts
  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      // User disconnected all accounts
      setIsConnected(false);
      setWalletAddress('');
      // Dispatch logout action
      dispatch({ type: 'auth/logout/fulfilled' });
    } else {
      // User switched accounts
      setWalletAddress(accounts[0]);
      await authenticateWallet(accounts[0]);
    }
  };
  
  // Handle disconnection
  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress('');
    // Dispatch logout action
    dispatch({ type: 'auth/logout/fulfilled' });
  };
  
  // Authenticate with the server
  const authenticateWallet = async (address) => {
    try {
      if (!ethers || !address) return;
      
      // Get nonce from server
      const nonceResponse = await axios.get(`/api/wallet/nonce/${address}`);
      const { nonce } = nonceResponse.data;
      
      // Sign the nonce with the wallet
      const provider = new ethers.BrowserProvider(window.ethereum);
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
        
        setIsConnected(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  };

  const connectWallet = async () => {
    // If already connected, don't do anything
    if (isConnected) return;
    
    // Handle case where ethereum object isn't available yet on mobile browsers
    if (!window.ethereum) {
      // If we're in MetaMask browser but ethereum object isn't injected yet, show a loading message
      if (isMetaMaskBrowser()) {
        setError('Waiting for MetaMask to connect...');
        
        // Check every second for the ethereum object to be injected
        const checkInterval = setInterval(() => {
          if (window.ethereum) {
            clearInterval(checkInterval);
            connectWallet(); // Retry connection once ethereum is available
          }
        }, 1000);
        
        // Stop checking after 10 seconds
        setTimeout(() => {
          clearInterval(checkInterval);
          if (!window.ethereum) {
            setError('MetaMask not detected. Please make sure MetaMask mobile app is properly installed.');
          }
        }, 10000);
        
        return;
      }
      
      // For non-MetaMask browsers without ethereum object
      if (isMobile()) {
        setError('No wallet detected. Open this page in the MetaMask mobile app browser.');
        return;
      } else {
        setError('No Ethereum wallet detected. Please install MetaMask or another Web3 wallet.');
        return;
      }
    }
    
    if (!ethers) {
      setError('Web3 library not loaded. Please refresh the page and try again.');
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
      
      setWalletAddress(address);
      
      // Authenticate with the server
      const success = await authenticateWallet(address);
      
      if (!success) {
        throw new Error('Authentication failed');
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.response?.data?.message || err.message || 'Error connecting wallet');
      setIsConnected(false);
      setWalletAddress('');
    } finally {
      setLoading(false);
    }
  };
  
  // For mobile detection
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };
  
  // Check if already in MetaMask browser
  const isMetaMaskBrowser = () => {
    return navigator.userAgent.includes('MetaMask');
  };
  
  // Opens wallet app if on mobile
  const openMobileWallet = () => {
    // If we're already in the MetaMask browser, try to connect directly
    if (isMetaMaskBrowser()) {
      connectWallet();
      return;
    }
    
    // Get current URL without protocol
    const currentUrl = window.location.href.split('//')[1];
    
    // This uses the universal linking format that MetaMask mobile supports
    window.location.href = `https://metamask.app.link/dapp/${currentUrl}`;
  };

  // Render button based on connection state
  return (
    <div>
      {error && (
        <div className="mb-2 text-xs text-red-600">
          {error}
        </div>
      )}
      <button
        type="button"
        onClick={isConnected ? () => {} : isMobile() ? openMobileWallet : connectWallet}
        disabled={loading || isConnected}
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
        ) : isConnected ? (
          <>
            <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4)}
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