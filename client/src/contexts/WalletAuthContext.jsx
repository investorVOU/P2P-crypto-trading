import React, { createContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export const WalletAuthContext = createContext();

export const WalletAuthProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if wallet is already connected and user is authenticated
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        setIsLoading(true);
        
        // Check if we have a connected account in local storage
        const storedAccount = localStorage.getItem('connectedWallet');
        
        if (storedAccount) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          // Only set the current account if it matches the stored one
          if (accounts.length > 0 && accounts[0].address.toLowerCase() === storedAccount.toLowerCase()) {
            setCurrentAccount(accounts[0].address);
            
            // Check if user is authenticated on the server
            fetchUserData(accounts[0].address);
          } else {
            // Clear stored account if it doesn't match
            localStorage.removeItem('connectedWallet');
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
        setError('Failed to connect to wallet');
        setIsLoading(false);
      }
    };

    checkWalletConnection();
  }, []);

  // Function to fetch user data from the server
  const fetchUserData = async (address) => {
    try {
      // First check if the user exists
      const response = await fetch(`/api/users/wallet/${address}`);
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to authenticate user');
      setIsLoading(false);
    }
  };

  // Connect wallet function
  const connectWallet = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!window.ethereum) {
        throw new Error('Ethereum wallet not found. Please install MetaMask or a similar wallet');
      }
      
      // Request account access
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask or another Web3 wallet');
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      let accounts;
      try {
        accounts = await provider.send('eth_requestAccounts', []);
      } catch (err) {
        if (err.code === 4001) {
          throw new Error('Please connect your wallet to continue');
        }
        throw new Error('Failed to connect wallet: ' + err.message);
      }
      
      if (accounts.length === 0) {
        throw new Error('No accounts found in your wallet');
      }
      
      const address = accounts[0];
      setCurrentAccount(address);
      
      // Get nonce from the server
      const nonceResponse = await fetch(`/api/wallet-auth/nonce?address=${address}`);
      
      if (!nonceResponse.ok) {
        throw new Error('Failed to get authentication nonce');
      }
      
      const { nonce } = await nonceResponse.json();
      
      // Have user sign the nonce
      const message = `Sign this message to authenticate with P2P Trading Platform. Nonce: ${nonce}`;
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);
      
      // Verify the signature on the server
      const verifyResponse = await fetch('/api/wallet-auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, signature }),
      });
      
      if (!verifyResponse.ok) {
        throw new Error('Failed to verify signature');
      }
      
      const userData = await verifyResponse.json();
      setUser(userData);
      
      // Store connected wallet in local storage
      localStorage.setItem('connectedWallet', address);
      
      setIsLoading(false);
      return userData;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setError(error.message || 'Failed to connect wallet');
      setIsLoading(false);
      throw error;
    }
  }, []);

  // Disconnect wallet function
  const disconnectWallet = useCallback(() => {
    setCurrentAccount(null);
    setUser(null);
    localStorage.removeItem('connectedWallet');
  }, []);

  // Provide the context value
  const value = {
    currentAccount,
    user,
    isLoading,
    error,
    connectWallet,
    disconnectWallet,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return (
    <WalletAuthContext.Provider value={value}>
      {children}
    </WalletAuthContext.Provider>
  );
};

export default WalletAuthContext;