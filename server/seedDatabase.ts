import { db } from './db';
import { 
  users, trades, messages, disputes, adminNotes, ratings, walletBalances, transactions
} from '../shared/schema';

/**
 * This script initializes the database with sample data for development
 */
async function seedDatabase() {
  console.log('Starting database seeding...');
  
  try {
    // First check if we already have data
    const existingUsers = await db.select({ count: { value: db.sql`count(*)` } }).from(users);
    
    if (existingUsers[0].count.value > 0) {
      console.log('Database already contains data. Skipping seeding.');
      return;
    }
    
    // Create sample users
    console.log('Creating sample users...');
    const createdUsers = await db.insert(users).values([
      {
        username: 'demouser',
        email: 'demo@example.com',
        fullName: 'Demo User',
        verified: true,
        completedTrades: 12,
        successRate: 98,
        responseTime: 5,
        rating: 4.7,
        isAdmin: true,
        createdAt: new Date(Date.now() - 5184000000) // 60 days ago
      },
      {
        username: 'seller123',
        email: 'seller@example.com',
        fullName: 'Seller User',
        verified: true,
        completedTrades: 45,
        successRate: 96,
        responseTime: 8,
        rating: 4.8,
        isAdmin: false,
        createdAt: new Date(Date.now() - 10368000000) // 120 days ago
      },
      {
        username: 'buyer456',
        email: 'buyer@example.com',
        fullName: 'Buyer User',
        verified: false,
        completedTrades: 3,
        successRate: 100,
        responseTime: 15,
        rating: 4.2,
        isAdmin: false,
        createdAt: new Date(Date.now() - 1296000000) // 15 days ago
      },
      {
        username: 'crypto_trader',
        email: 'trader@example.com',
        fullName: 'Crypto Trader',
        verified: true,
        completedTrades: 78,
        successRate: 99,
        responseTime: 3,
        rating: 4.9,
        isAdmin: false,
        createdAt: new Date(Date.now() - 31536000000) // 365 days ago
      }
    ]).returning();
    
    console.log(`Created ${createdUsers.length} sample users`);
    
    // Create sample trades
    console.log('Creating sample trades...');
    const createdTrades = await db.insert(trades).values([
      {
        type: 'buy',
        amount: 0.5,
        price: 40000,
        currency: 'BTC',
        status: 'open',
        createdAt: new Date(),
        userId: 1,
        counterpartyId: 2,
        paymentMethod: 'Bank Transfer'
      },
      {
        type: 'sell',
        amount: 1.2,
        price: 2800,
        currency: 'ETH',
        status: 'in_escrow',
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        userId: 3,
        counterpartyId: 4,
        paymentMethod: 'Credit Card'
      },
      {
        type: 'buy',
        amount: 1000,
        price: 1,
        currency: 'USDT',
        status: 'completed',
        createdAt: new Date(Date.now() - 172800000), // 2 days ago
        completedAt: new Date(Date.now() - 86400000), // 1 day ago
        userId: 1,
        counterpartyId: 4,
        paymentMethod: 'PayPal'
      },
      {
        type: 'sell',
        amount: 0.75,
        price: 39500,
        currency: 'BTC',
        status: 'disputed',
        createdAt: new Date(Date.now() - 432000000), // 5 days ago
        userId: 2,
        counterpartyId: 3,
        paymentMethod: 'Bank Transfer'
      },
      {
        type: 'buy',
        amount: 5,
        price: 2750,
        currency: 'ETH',
        status: 'cancelled',
        createdAt: new Date(Date.now() - 604800000), // 7 days ago
        cancelledAt: new Date(Date.now() - 518400000), // 6 days ago
        userId: 4,
        counterpartyId: 1,
        paymentMethod: 'Credit Card'
      }
    ]).returning();
    
    console.log(`Created ${createdTrades.length} sample trades`);
    
    // Create sample messages
    console.log('Creating sample messages...');
    const createdMessages = await db.insert(messages).values([
      {
        tradeId: 1,
        senderId: 1,
        receiverId: 2,
        text: 'Hello, I am interested in this trade.',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        isRead: true
      },
      {
        tradeId: 1,
        senderId: 2,
        receiverId: 1,
        text: 'Great! I can process the payment once you confirm.',
        timestamp: new Date(Date.now() - 3000000), // 50 minutes ago
        isRead: true
      },
      {
        tradeId: 1,
        senderId: 1,
        receiverId: 2,
        text: 'Perfect. I will send the funds to escrow now.',
        timestamp: new Date(Date.now() - 2400000), // 40 minutes ago
        isRead: false
      },
      {
        tradeId: 2,
        senderId: 3,
        receiverId: 4,
        text: 'I have sent the payment via credit card. Please check.',
        timestamp: new Date(Date.now() - 43200000), // 12 hours ago
        isRead: true
      },
      {
        tradeId: 2,
        senderId: 4,
        receiverId: 3,
        text: 'Payment received. I will release the ETH from escrow now.',
        timestamp: new Date(Date.now() - 39600000), // 11 hours ago
        isRead: true
      }
    ]).returning();
    
    console.log(`Created ${createdMessages.length} sample messages`);
    
    // Create sample disputes
    console.log('Creating sample disputes...');
    const createdDisputes = await db.insert(disputes).values([
      {
        tradeId: 4,
        tradeAmount: 0.75,
        tradeCurrency: 'BTC',
        reason: 'payment_issues',
        description: 'I sent the payment but seller claims they did not receive it.',
        status: 'pending',
        createdAt: new Date(Date.now() - 345600000), // 4 days ago
        userId: 3
      },
      {
        tradeId: 2,
        tradeAmount: 2.0,
        tradeCurrency: 'ETH',
        reason: 'seller_not_responding',
        description: 'I paid 3 days ago but seller has not released the funds from escrow.',
        status: 'pending',
        createdAt: new Date(Date.now() - 259200000), // 3 days ago
        userId: 1
      }
    ]).returning();
    
    console.log(`Created ${createdDisputes.length} sample disputes`);
    
    // Create sample admin notes
    console.log('Creating sample admin notes...');
    const createdNotes = await db.insert(adminNotes).values([
      {
        disputeId: 2,
        text: 'Contacted seller via email.',
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        adminId: 1
      }
    ]).returning();
    
    console.log(`Created ${createdNotes.length} sample admin notes`);
    
    // Create sample ratings
    console.log('Creating sample ratings...');
    const createdRatings = await db.insert(ratings).values([
      {
        userId: 2,
        tradeId: 3,
        rating: 5,
        comment: 'Excellent trader, very responsive!',
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        ratedBy: 1
      },
      {
        userId: 4,
        tradeId: 3,
        rating: 4,
        comment: 'Good experience overall.',
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        ratedBy: 1
      },
      {
        userId: 1,
        tradeId: 3,
        rating: 5,
        comment: 'Very trustworthy buyer.',
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        ratedBy: 4
      }
    ]).returning();
    
    console.log(`Created ${createdRatings.length} sample ratings`);
    
    // Create sample wallet balances
    console.log('Creating sample wallet balances...');
    const createdBalances = await db.insert(walletBalances).values([
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
    ]).returning();
    
    console.log(`Created ${createdBalances.length} sample wallet balances`);
    
    // Create sample transactions
    console.log('Creating sample transactions...');
    const createdTransactions = await db.insert(transactions).values([
      {
        userId: 1,
        type: 'deposit',
        amount: 0.1,
        currency: 'BTC',
        date: new Date(),
        details: 'Initial deposit'
      },
      {
        userId: 1,
        type: 'withdraw',
        amount: -0.05,
        currency: 'BTC',
        date: new Date(Date.now() - 86400000), // 1 day ago
        details: 'Withdrawal to external wallet'
      },
      {
        userId: 1,
        type: 'trade',
        amount: 0.2,
        currency: 'ETH',
        date: new Date(Date.now() - 172800000), // 2 days ago
        details: 'Trade completion'
      },
      {
        userId: 1,
        type: 'deposit',
        amount: 500,
        currency: 'USDT',
        date: new Date(Date.now() - 259200000), // 3 days ago
        details: 'USDT deposit'
      },
      {
        userId: 1,
        type: 'trade',
        amount: -200,
        currency: 'USDT',
        date: new Date(Date.now() - 345600000), // 4 days ago
        details: 'Purchase of BTC'
      },
      {
        userId: 2,
        type: 'deposit',
        amount: 1.0,
        currency: 'BTC',
        date: new Date(Date.now() - 432000000), // 5 days ago
        details: 'Initial deposit'
      },
      {
        userId: 3,
        type: 'deposit',
        amount: 5.0,
        currency: 'ETH',
        date: new Date(Date.now() - 518400000), // 6 days ago
        details: 'Initial deposit'
      },
      {
        userId: 4,
        type: 'deposit',
        amount: 5000,
        currency: 'USDT',
        date: new Date(Date.now() - 604800000), // 7 days ago
        details: 'Initial deposit'
      }
    ]).returning();
    
    console.log(`Created ${createdTransactions.length} sample transactions`);
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase().catch((error) => {
  console.error('Database seeding error:', error);
  process.exit(1);
});