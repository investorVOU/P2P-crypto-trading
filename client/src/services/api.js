import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create a configured axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Handle API errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle error responses
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Wallet Authentication API
export const walletAuthAPI = {
  // Get nonce for wallet signing
  getNonce: async (address) => {
    const response = await api.get(`/wallet-auth/nonce/${address}`);
    return response.data;
  },
  
  // Verify signature and authenticate
  verifySignature: async (address, signature) => {
    const response = await api.post('/wallet-auth/verify', { address, signature });
    return response.data;
  },
};

// User API
export const userAPI = {
  // Get current user profile with stats
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  
  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },
  
  // Logout current user
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },
};

// Trades API
export const tradesAPI = {
  // Get public trade listings
  getPublicTrades: async (filters = {}) => {
    const response = await api.get('/public/trades', { params: filters });
    return response.data;
  },
  
  // Get all trades for current user
  getUserTrades: async (status) => {
    const params = status ? { status } : {};
    const response = await api.get('/trades', { params });
    return response.data;
  },
  
  // Get single trade by ID
  getTradeById: async (id) => {
    const response = await api.get(`/trades/${id}`);
    return response.data;
  },
  
  // Create a new trade
  createTrade: async (tradeData) => {
    const response = await api.post('/trades', tradeData);
    return response.data;
  },
  
  // Update trade status
  updateTradeStatus: async (id, status) => {
    const response = await api.put(`/trades/${id}/status`, { status });
    return response.data;
  },
  
  // Get messages for a trade
  getMessages: async (tradeId) => {
    const response = await api.get(`/trades/${tradeId}/messages`);
    return response.data;
  },
  
  // Send a message in a trade
  sendMessage: async (tradeId, content) => {
    const response = await api.post(`/trades/${tradeId}/messages`, { content });
    return response.data;
  },
  
  // Create a dispute for a trade
  createDispute: async (tradeId, reason, details) => {
    const response = await api.post(`/trades/${tradeId}/disputes`, { reason, details });
    return response.data;
  },
  
  // Rate a trade partner
  rateTrade: async (tradeId, rating, comment) => {
    const response = await api.post(`/trades/${tradeId}/ratings`, { rating, comment });
    return response.data;
  },
};

// Wallet API
export const walletAPI = {
  // Get wallet balances
  getBalances: async () => {
    const response = await api.get('/wallet/balances');
    return response.data;
  },
  
  // Get transaction history
  getTransactions: async () => {
    const response = await api.get('/wallet/transactions');
    return response.data;
  },
  
  // Deposit funds
  deposit: async (amount, currency) => {
    const response = await api.post('/wallet/deposit', { amount, currency });
    return response.data;
  },
  
  // Withdraw funds
  withdraw: async (amount, currency, address) => {
    const response = await api.post('/wallet/withdraw', { amount, currency, address });
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  // Get all users
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  
  // Get all disputes
  getAllDisputes: async () => {
    const response = await api.get('/admin/disputes');
    return response.data;
  },
  
  // Resolve a dispute
  resolveDispute: async (id, resolution, notes) => {
    const response = await api.put(`/admin/disputes/${id}/resolve`, { resolution, notes });
    return response.data;
  },
  
  // Get admin dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
};

// Market API
export const marketAPI = {
  // Get current cryptocurrency prices
  getPrices: async () => {
    const response = await api.get('/public/prices');
    return response.data;
  },
};