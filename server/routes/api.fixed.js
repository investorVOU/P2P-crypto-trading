const express = require('express');
const router = express.Router();
const { storage } = require('../storage.cjs');
const { setupAuth } = require('../auth');
const { ethers } = require('ethers');

// Create a dummy app to get the authentication middleware
const dummyApp = express();
const { isAuthenticated } = setupAuth(dummyApp);

// ===== Wallet Authentication Routes =====

/**
 * Generate a random nonce for wallet authentication
 * @route GET /api/wallet-auth/nonce/:address
 * @param {string} address - Ethereum wallet address
 * @returns {Object} Response containing nonce
 */
router.get('/wallet-auth/nonce/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    // Validate Ethereum address format - using ethers v6
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
    
    // Generate a random nonce for the user to sign
    const nonce = Math.floor(Math.random() * 1000000).toString();
    const message = `Sign this message to authenticate with P2P Trading Platform. Nonce: ${nonce}`;
    
    // Store the nonce in the database
    await storage.createOrUpdateWalletNonce(address, nonce);
    
    res.json({ message, nonce });
  } catch (error) {
    console.error('Error generating nonce:', error);
    res.status(500).json({ error: 'Failed to generate authentication nonce' });
  }
});

/**
 * Verify signed message and authenticate user
 * @route POST /api/wallet-auth/verify
 * @param {string} address - Ethereum wallet address
 * @param {string} signature - Signed message containing nonce
 * @returns {Object} Response with user data if successful
 */
router.post('/wallet-auth/verify', async (req, res) => {
  try {
    const { address, signature } = req.body;
    
    // Validate required fields
    if (!address || !signature) {
      return res.status(400).json({ error: 'Address and signature are required' });
    }
    
    // Validate Ethereum address format - using ethers v6
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ error: 'Invalid Ethereum address' });
    }
    
    // Get the stored nonce for this wallet address
    const storedNonce = await storage.getWalletNonce(address);
    if (!storedNonce) {
      return res.status(400).json({ error: 'No authentication nonce found for this address' });
    }
    
    // Create the message that was signed
    const message = `Sign this message to authenticate with P2P Trading Platform. Nonce: ${storedNonce.nonce}`;
    
    // Verify the signature - using ethers v6
    let recoveredAddress;
    try {
      recoveredAddress = ethers.verifyMessage(message, signature);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    // Check if the recovered address matches the claimed address
    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'Signature verification failed' });
    }
    
    // Get user by wallet address or create new user if they don't exist
    let user = await storage.getUserByWalletAddress(address);
    
    if (!user) {
      // Create a new user with this wallet address
      user = await storage.createUser({
        username: `user_${address.substring(2, 8)}`,
        password: 'WALLET_AUTH_USER', // This is not used for login
        email: null,
        walletAddress: address,
        role: 'user',
        createdAt: new Date(),
      });
    }
    
    // Login the user by setting the session
    req.login(user, (err) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Failed to login' });
      }
      
      // Return user data (excluding sensitive info)
      const { password, ...userData } = user;
      res.json(userData);
    });
    
  } catch (error) {
    console.error('Error in wallet authentication:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

/**
 * Get public trade listings (no authentication required)
 * @route GET /api/public/trades
 * @param {string} status - Filter by trade status
 * @param {string} currency - Filter by currency
 * @param {string} type - Filter by trade type (buy/sell)
 * @returns {Array} List of open trades
 */
router.get('/public/trades', async (req, res) => {
  try {
    const { status, currency, type } = req.query;
    
    // Default filter to only show open trades
    const statusFilter = status || 'open';
    
    // Get trades from database with filters
    let trades = await storage.getTrades(null, statusFilter);
    
    // Apply additional filters if provided
    if (currency) {
      trades = trades.filter(trade => trade.currency === currency);
    }
    
    if (type) {
      trades = trades.filter(trade => trade.type === type);
    }
    
    // Sort by newest first
    trades.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Remove sensitive information for public listing
    const sanitizedTrades = trades.map(trade => {
      const { paymentDetails, ...publicTrade } = trade;
      return publicTrade;
    });
    
    res.json(sanitizedTrades);
  } catch (error) {
    console.error('Error fetching public trades:', error);
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
});

/**
 * Get price information for supported currencies
 * @route GET /api/public/prices
 * @returns {Object} Current prices for supported cryptocurrencies
 */
router.get('/public/prices', async (req, res) => {
  try {
    // In a real application, this would fetch from a price API
    // For now, we're using static sample prices
    const prices = {
      BTC: { usd: 58423.45 },
      ETH: { usd: 2863.21 },
      XRP: { usd: 0.62 },
      LTC: { usd: 182.34 },
      BCH: { usd: 478.91 },
      USDT: { usd: 1.00 },
      USDC: { usd: 1.00 },
      updatedAt: new Date().toISOString()
    };
    
    res.json(prices);
  } catch (error) {
    console.error('Error fetching prices:', error);
    res.status(500).json({ error: 'Failed to fetch price information' });
  }
});

// ===== User Profile Routes =====

/**
 * Get current user profile
 * @route GET /api/profile
 * @returns {Object} User profile data
 */
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    // The user object is already attached to the request by Passport
    const { password, ...userData } = req.user;
    
    // Get additional user stats
    const completedTrades = await storage.getTrades(req.user.id, 'completed');
    const disputedTrades = await storage.getTrades(req.user.id, 'disputed');
    const ratings = await storage.getRatingsByUser(req.user.id);
    
    // Calculate average rating
    let averageRating = 0;
    if (ratings.length > 0) {
      const sum = ratings.reduce((total, rating) => total + rating.rating, 0);
      averageRating = sum / ratings.length;
    }
    
    // Send user profile with stats
    res.json({
      ...userData,
      stats: {
        completedTrades: completedTrades.length,
        disputedTrades: disputedTrades.length,
        totalTrades: completedTrades.length + disputedTrades.length,
        averageRating,
        totalRatings: ratings.length
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

/**
 * Update user profile
 * @route PUT /api/profile
 * @param {Object} req.body - Updated profile fields
 * @returns {Object} Updated user data
 */
router.put('/profile', isAuthenticated, async (req, res) => {
  try {
    const { username, email } = req.body;
    
    // In a real application, this would update the user profile
    // For now, we just return the current user
    
    const { password, ...userData } = req.user;
    res.json({
      ...userData,
      username: username || userData.username,
      email: email || userData.email
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;