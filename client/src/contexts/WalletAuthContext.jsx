import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

// Create context
const WalletAuthContext = createContext(null);

// Get ethers dynamically
let ethers = null;

export const WalletAuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletError, setWalletError] = useState(null);

  useEffect(() => {
    async function loadEthers() {
      try {
        const ethersModule = await import('ethers');
        ethers = ethersModule;
        console.log('Ethers library loaded in context');
      } catch (error) {
        console.error('Failed to load ethers library in context:', error);
      }
    }
    
    loadEthers();
    
    // Check wallet connection status on page load
    checkWalletConnection();
    
    // Add wallet event listeners
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
      window.ethereum.on('disconnect', handleDisconnect);
    }
    
    return () => {
      // Clean up listeners
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', () => {});
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, []);

  // Check if wallet is connected and get account
  const checkWalletConnection = async () => {
    setLoading(true);
    
    try {
      // If ethereum is not available or ethers is not loaded yet, skip
      if (!window.ethereum || !ethers) {
        setLoading(false);
        return;
      }
      
      // Check if we're already authorized to access the wallet
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        const address = accounts[0].address;
        setWalletAddress(address);
        setIsWalletConnected(true);
        
        // Get authentication status from server
        try {
          const userResponse = await axios.get('/api/user');
          
          // If not authenticated with the server but wallet is connected, authenticate
          if (userResponse.status !== 200 || !userResponse.data) {
            await authenticateWithServer(address);
          } else {
            // User is already authenticated
            dispatch({ 
              type: 'auth/login/fulfilled', 
              payload: userResponse.data 
            });
          }
        } catch (error) {
          // Not authenticated, try to authenticate
          await authenticateWithServer(address);
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
      setWalletError('Error connecting to wallet');
    } finally {
      setLoading(false);
    }
  };

  // Handle account changes
  const handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      setIsWalletConnected(false);
      setWalletAddress('');
      // Logout user
      dispatch({ type: 'auth/logout/fulfilled' });
    } else {
      // User switched accounts, update state
      setWalletAddress(accounts[0]);
      setIsWalletConnected(true);
      // Re-authenticate with new account
      await authenticateWithServer(accounts[0]);
    }
  };

  // Handle disconnect
  const handleDisconnect = () => {
    setIsWalletConnected(false);
    setWalletAddress('');
    // Logout user
    dispatch({ type: 'auth/logout/fulfilled' });
  };

  // Authenticate with server
  const authenticateWithServer = async (address) => {
    if (!ethers || !address) return false;
    
    try {
      // Get nonce to sign
      const nonceResponse = await axios.get(`/api/wallet/nonce/${address}`);
      const { nonce } = nonceResponse.data;
      
      // Sign the nonce
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(nonce);
      
      // Authenticate with server
      const authResponse = await axios.post('/api/wallet/auth', {
        address,
        signature
      });
      
      if (authResponse.status === 200) {
        dispatch({ 
          type: 'auth/login/fulfilled', 
          payload: authResponse.data 
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Authentication error:', error);
      setWalletError('Authentication failed');
      return false;
    }
  };

  // Connect wallet
  const connectWallet = async () => {
    if (isWalletConnected) return true;
    
    if (!window.ethereum) {
      setWalletError('No Ethereum wallet detected. Please install MetaMask, Trust Wallet or another compatible wallet.');
      return false;
    }
    
    if (!ethers) {
      setWalletError('Web3 library not loaded. Please refresh the page and try again.');
      return false;
    }
    
    setWalletError(null);
    setLoading(true);
    
    try {
      // Request accounts
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const address = accounts[0];
      
      if (!address) {
        throw new Error('No account selected');
      }
      
      setWalletAddress(address);
      setIsWalletConnected(true);
      
      // Authenticate with server
      const success = await authenticateWithServer(address);
      
      if (!success) {
        throw new Error('Server authentication failed');
      }
      
      return true;
    } catch (error) {
      console.error('Wallet connection error:', error);
      setWalletError(error.message || 'Failed to connect wallet');
      setIsWalletConnected(false);
      setWalletAddress('');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Disconnect wallet (for UI purposes, the actual connection remains in the browser)
  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setWalletAddress('');
    // Logout from Redux store
    dispatch({ type: 'auth/logout/fulfilled' });
    return true;
  };

  // Detect if on mobile device
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // Deep link to mobile wallet apps
  const openMobileWallet = () => {
    // This link format works with MetaMask, Trust Wallet, and many others
    window.location.href = 'https://metamask.app.link/dapp/' + window.location.href.split('//')[1];
  };

  // Context value
  const value = {
    loading,
    user,
    walletAddress,
    isWalletConnected,
    walletError,
    connectWallet,
    disconnectWallet,
    isMobile,
    openMobileWallet
  };

  return (
    <WalletAuthContext.Provider value={value}>
      {children}
    </WalletAuthContext.Provider>
  );
};

// Custom hook to use the wallet auth context
export const useWalletAuth = () => {
  const context = useContext(WalletAuthContext);
  if (!context) {
    throw new Error('useWalletAuth must be used within a WalletAuthProvider');
  }
  return context;
};