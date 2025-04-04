// In-memory database for development and testing
// This will be replaced with a real database in production

// Initialize the database structure
let db = {
  users: [],
  trades: [],
  messages: [],
  disputes: [],
  ratings: [],
  walletBalances: [],
  transactions: [],
};

// Initialize the database with sample data
function initializeDatabase() {
  // Reset the database
  db = {
    users: [],
    trades: [],
    messages: [],
    disputes: [],
    ratings: [],
    walletBalances: [],
    transactions: [],
  };
  
  // Create sample users
  db.users = [
    {
      id: 1,
      username: 'demouser',
      email: 'demo@example.com',
      fullName: 'Demo User',
      verified: true,
      completedTrades: 12,
      successRate: 98,
      responseTime: 5,
      rating: 4.7,
      isAdmin: true,
      createdAt: new Date(Date.now() - 5184000000).toISOString() // 60 days ago
    },
    {
      id: 2,
      username: 'seller123',
      email: 'seller@example.com',
      fullName: 'Seller User',
      verified: true,
      completedTrades: 45,
      successRate: 96,
      responseTime: 8,
      rating: 4.8,
      isAdmin: false,
      createdAt: new Date(Date.now() - 10368000000).toISOString() // 120 days ago
    },
    {
      id: 3,
      username: 'buyer456',
      email: 'buyer@example.com',
      fullName: 'Buyer User',
      verified: false,
      completedTrades: 3,
      successRate: 100,
      responseTime: 15,
      rating: 4.2,
      isAdmin: false,
      createdAt: new Date(Date.now() - 1296000000).toISOString() // 15 days ago
    },
    {
      id: 4,
      username: 'crypto_trader',
      email: 'trader@example.com',
      fullName: 'Crypto Trader',
      verified: true,
      completedTrades: 78,
      successRate: 99,
      responseTime: 3,
      rating: 4.9,
      isAdmin: false,
      createdAt: new Date(Date.now() - 31536000000).toISOString() // 365 days ago
    }
  ];
  
  // Create sample trades
  db.trades = [
    {
      id: 1,
      type: 'buy',
      amount: 0.5,
      price: 40000,
      currency: 'BTC',
      status: 'open',
      createdAt: new Date().toISOString(),
      userId: 1,
      counterpartyId: 2,
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 2,
      type: 'sell',
      amount: 1.2,
      price: 2800,
      currency: 'ETH',
      status: 'in_escrow',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      userId: 3,
      counterpartyId: 4,
      paymentMethod: 'Credit Card'
    },
    {
      id: 3,
      type: 'buy',
      amount: 1000,
      price: 1,
      currency: 'USDT',
      status: 'completed',
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      completedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      userId: 1,
      counterpartyId: 4,
      paymentMethod: 'PayPal'
    },
    {
      id: 4,
      type: 'sell',
      amount: 0.75,
      price: 39500,
      currency: 'BTC',
      status: 'disputed',
      createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
      userId: 2,
      counterpartyId: 3,
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 5,
      type: 'buy',
      amount: 5,
      price: 2750,
      currency: 'ETH',
      status: 'cancelled',
      createdAt: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
      cancelledAt: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
      userId: 4,
      counterpartyId: 1,
      paymentMethod: 'Credit Card'
    }
  ];
  
  // Create sample messages
  db.messages = [
    {
      id: 1,
      tradeId: 1,
      senderId: 1,
      receiverId: 2,
      text: 'Hello, I am interested in this trade.',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      isRead: true
    },
    {
      id: 2,
      tradeId: 1,
      senderId: 2,
      receiverId: 1,
      text: 'Great! I can process the payment once you confirm.',
      timestamp: new Date(Date.now() - 3000000).toISOString(), // 50 minutes ago
      isRead: true
    },
    {
      id: 3,
      tradeId: 1,
      senderId: 1,
      receiverId: 2,
      text: 'Perfect. I will send the funds to escrow now.',
      timestamp: new Date(Date.now() - 2400000).toISOString(), // 40 minutes ago
      isRead: false
    },
    {
      id: 4,
      tradeId: 2,
      senderId: 3,
      receiverId: 4,
      text: 'I have sent the payment via credit card. Please check.',
      timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      isRead: true
    },
    {
      id: 5,
      tradeId: 2,
      senderId: 4,
      receiverId: 3,
      text: 'Payment received. I will release the ETH from escrow now.',
      timestamp: new Date(Date.now() - 39600000).toISOString(), // 11 hours ago
      isRead: true
    }
  ];
  
  // Create sample disputes
  db.disputes = [
    {
      id: 1,
      tradeId: 4,
      tradeAmount: 0.75,
      tradeCurrency: 'BTC',
      reason: 'payment_issues',
      description: 'I sent the payment but seller claims they did not receive it.',
      status: 'pending',
      createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      userId: 3,
      adminNotes: []
    },
    {
      id: 2,
      tradeId: 6,
      tradeAmount: 2.0,
      tradeCurrency: 'ETH',
      reason: 'seller_not_responding',
      description: 'I paid 3 days ago but seller has not released the funds from escrow.',
      status: 'pending',
      createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      userId: 1,
      adminNotes: [
        {
          text: 'Contacted seller via email.',
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          adminId: 1
        }
      ]
    },
    {
      id: 3,
      tradeId: 7,
      tradeAmount: 1000,
      tradeCurrency: 'USDT',
      reason: 'fraud',
      description: 'The buyer claims they paid but no payment was received in my account.',
      status: 'resolved',
      resolution: 'seller', // Resolved in favor of the seller
      createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
      resolvedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      userId: 4,
      adminNotes: [
        {
          text: 'Buyer could not provide proof of payment.',
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          adminId: 1
        }
      ]
    }
  ];
  
  // Create sample ratings
  db.ratings = [
    {
      id: 1,
      userId: 2,
      tradeId: 3,
      rating: 5,
      comment: 'Excellent trader, very responsive!',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      ratedBy: 1
    },
    {
      id: 2,
      userId: 4,
      tradeId: 3,
      rating: 4,
      comment: 'Good experience overall.',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      ratedBy: 1
    },
    {
      id: 3,
      userId: 1,
      tradeId: 3,
      rating: 5,
      comment: 'Very trustworthy buyer.',
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      ratedBy: 4
    }
  ];
  
  // Create sample wallet balances
  db.walletBalances = [
    {
      userId: 1,
      currency: 'BTC',
      amount: 0.25,
      usdValue: 10000
    },
    {
      userId: 1,
      currency: 'ETH',
      amount: 1.5,
      usdValue: 4200
    },
    {
      userId: 1,
      currency: 'USDT',
      amount: 1000,
      usdValue: 1000
    },
    {
      userId: 1,
      currency: 'USD',
      amount: 500,
      usdValue: 500
    },
    {
      userId: 2,
      currency: 'BTC',
      amount: 1.2,
      usdValue: 48000
    },
    {
      userId: 3,
      currency: 'ETH',
      amount: 5.0,
      usdValue: 14000
    },
    {
      userId: 4,
      currency: 'USDT',
      amount: 5000,
      usdValue: 5000
    }
  ];
  
  // Create sample transactions
  db.transactions = [
    {
      id: 1,
      userId: 1,
      type: 'deposit',
      amount: 0.1,
      currency: 'BTC',
      date: new Date().toISOString(),
      details: 'Initial deposit'
    },
    {
      id: 2,
      userId: 1,
      type: 'withdraw',
      amount: -0.05,
      currency: 'BTC',
      date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      details: 'Withdrawal to external wallet'
    },
    {
      id: 3,
      userId: 1,
      type: 'trade',
      amount: 0.2,
      currency: 'ETH',
      date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      details: 'Trade completion'
    },
    {
      id: 4,
      userId: 1,
      type: 'deposit',
      amount: 500,
      currency: 'USDT',
      date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      details: 'USDT deposit'
    },
    {
      id: 5,
      userId: 1,
      type: 'trade',
      amount: -200,
      currency: 'USDT',
      date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      details: 'Purchase of BTC'
    },
    {
      id: 6,
      userId: 2,
      type: 'deposit',
      amount: 1.0,
      currency: 'BTC',
      date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
      details: 'Initial deposit'
    },
    {
      id: 7,
      userId: 3,
      type: 'deposit',
      amount: 5.0,
      currency: 'ETH',
      date: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
      details: 'Initial deposit'
    },
    {
      id: 8,
      userId: 4,
      type: 'deposit',
      amount: 5000,
      currency: 'USDT',
      date: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
      details: 'Initial deposit'
    }
  ];
  
  console.log('In-memory database initialized with sample data');
}

module.exports = {
  db,
  initializeDatabase
};
