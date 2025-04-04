import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create an axios instance with default configuration
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Add a request interceptor to handle authentication
api.interceptors.request.use(
  (config) => {
    // Get token from storage if available
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different error types
    if (error.response) {
      // Server responded with an error status (4xx, 5xx)
      console.error('API Error:', error.response.data);
      
      // Handle unauthorized access (401)
      if (error.response.status === 401) {
        // Clear token from storage
        localStorage.removeItem('token');
        
        // Redirect to login page or handle as needed
        // For React Native, we might need to handle this differently
      }
    } else if (error.request) {
      // Request made but no response received (network error)
      console.error('Network Error:', error.request);
    } else {
      // Error setting up the request
      console.error('Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Mock API calls for development (will be replaced by real API calls later)
// This helps us test the frontend without a backend initially
export const mockApi = {
  // Trades
  fetchTrades: () => {
    return Promise.resolve({
      data: [
        {
          id: 1,
          type: 'buy',
          amount: 0.5,
          price: 40000,
          currency: 'BTC',
          status: 'open',
          createdAt: new Date().toISOString(),
          paymentMethod: 'Bank Transfer',
          counterparty: {
            id: 2,
            username: 'seller123',
            rating: 4.8
          }
        },
        {
          id: 2,
          type: 'sell',
          amount: 1.2,
          price: 2800,
          currency: 'ETH',
          status: 'in_escrow',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          paymentMethod: 'Credit Card',
          counterparty: {
            id: 3,
            username: 'buyer456',
            rating: 4.2
          }
        },
        {
          id: 3,
          type: 'buy',
          amount: 1000,
          price: 1,
          currency: 'USDT',
          status: 'completed',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          paymentMethod: 'PayPal',
          counterparty: {
            id: 4,
            username: 'crypto_trader',
            rating: 4.9
          }
        }
      ]
    });
  },
  
  fetchTradeById: (id) => {
    // Fake specific trade detail
    return Promise.resolve({
      data: {
        id: parseInt(id),
        type: 'buy',
        amount: 0.5,
        price: 40000,
        currency: 'BTC',
        status: 'open',
        createdAt: new Date().toISOString(),
        paymentMethod: 'Bank Transfer',
        counterparty: {
          id: 2,
          username: 'seller123',
          rating: 4.8
        }
      }
    });
  },
  
  // User and Authentication
  getUserProfile: (userId) => {
    return Promise.resolve({
      data: {
        id: parseInt(userId),
        username: 'demouser',
        fullName: 'Demo User',
        email: 'demo@example.com',
        phone: '+1234567890',
        verified: true,
        completedTrades: 12,
        successRate: 98,
        responseTime: 5,
        rating: 4.7,
        createdAt: new Date(Date.now() - 5184000000).toISOString()
      }
    });
  },
  
  // Wallet
  getWalletBalances: () => {
    return Promise.resolve({
      data: [
        {
          currency: 'BTC',
          amount: 0.25,
          usdValue: 10000
        },
        {
          currency: 'ETH',
          amount: 1.5,
          usdValue: 4200
        },
        {
          currency: 'USDT',
          amount: 1000,
          usdValue: 1000
        },
        {
          currency: 'USD',
          amount: 500,
          usdValue: 500
        }
      ]
    });
  },
  
  getTransactions: () => {
    return Promise.resolve({
      data: [
        {
          id: 1,
          type: 'deposit',
          amount: 0.1,
          currency: 'BTC',
          date: new Date().toISOString()
        },
        {
          id: 2,
          type: 'withdraw',
          amount: -0.05,
          currency: 'BTC',
          date: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: 3,
          type: 'trade',
          amount: 0.2,
          currency: 'ETH',
          date: new Date(Date.now() - 172800000).toISOString()
        }
      ]
    });
  },
  
  // Messages
  getMessages: (tradeId) => {
    return Promise.resolve({
      data: [
        {
          id: 1,
          tradeId: parseInt(tradeId),
          senderId: 1,
          receiverId: 2,
          text: 'Hello, I am interested in this trade.',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 2,
          tradeId: parseInt(tradeId),
          senderId: 2,
          receiverId: 1,
          text: 'Great! I can process the payment once you confirm.',
          timestamp: new Date(Date.now() - 3000000).toISOString()
        },
        {
          id: 3,
          tradeId: parseInt(tradeId),
          senderId: 1,
          receiverId: 2,
          text: 'Perfect. I will send the funds to escrow now.',
          timestamp: new Date(Date.now() - 2400000).toISOString()
        }
      ]
    });
  },
  
  // Admin
  getAdminStats: () => {
    return Promise.resolve({
      data: {
        activeTrades: 15,
        completedTrades: 247,
        disputedTrades: 3,
        activeUsers: 42,
        totalVolume: 12580,
        userGrowth: 12
      }
    });
  },
  
  getDisputes: () => {
    return Promise.resolve({
      data: [
        {
          id: 1,
          tradeId: 5,
          tradeAmount: 0.5,
          tradeCurrency: 'BTC',
          reason: 'payment_issues',
          description: 'I sent the payment but seller claims they did not receive it.',
          status: 'pending',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          user: {
            id: 1,
            username: 'demouser'
          }
        },
        {
          id: 2,
          tradeId: 8,
          tradeAmount: 2.0,
          tradeCurrency: 'ETH',
          reason: 'seller_not_responding',
          description: 'I paid 3 days ago but seller has not released the funds from escrow.',
          status: 'pending',
          createdAt: new Date(Date.now() - 259200000).toISOString(),
          user: {
            id: 3,
            username: 'buyer456'
          }
        },
        {
          id: 3,
          tradeId: 10,
          tradeAmount: 1000,
          tradeCurrency: 'USDT',
          reason: 'fraud',
          description: 'The buyer claims they paid but no payment was received in my account.',
          status: 'resolved',
          createdAt: new Date(Date.now() - 432000000).toISOString(),
          user: {
            id: 4,
            username: 'crypto_trader'
          }
        }
      ]
    });
  }
};

// For development, we'll use the mock API
// In production, this would be replaced by the real API
export default process.env.NODE_ENV === 'production' ? api : mockApi;
