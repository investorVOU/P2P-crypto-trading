const { Pool } = require("@neondatabase/serverless");

/**
 * This script initializes the database with sample data for development
 */
async function seedDatabase() {
  console.log('Starting database seeding...');
  
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    // First check if we already have data
    const checkResult = await pool.query('SELECT COUNT(*) FROM users');
    
    if (parseInt(checkResult.rows[0].count) > 0) {
      console.log('Database already contains data. Skipping seeding.');
      return;
    }
    
    // Create admin user with a special password for exclusive access
    // Note: In a real application, you would hash these passwords before storing them
    // Here we're using a predefined hash for testing purposes
    
    // The passwords below are all hashed versions of 'password123' 
    const hashedPassword = '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c2e0e42c8f9a84d465a658acfd48fcf8182be502790706f1c82f15a9ffa144216.885b8f0044d2d695'; // hash of 'password123'
    const adminPassword = '812ee43eadf2f7c56da80e6c19b20a3a2c03b4a17f718e6bcf267b4c551bceec93139332fe2712df0343549eeecd04fb32c5e8d0aa5747f5d64d4b22744c1e21.51daf1dc70a59ca1'; // hash of 'admin123'
    
    await pool.query(`
      INSERT INTO users (username, email, full_name, password, verified, completed_trades, 
                         success_rate, response_time, rating, is_admin, created_at)
      VALUES 
      ('admin', 'admin@p2ptrade.com', 'Platform Admin', '${adminPassword}', true, 0, 0, 0, 0, true, NOW() - INTERVAL '90 days'),
      ('demouser', 'demo@example.com', 'Demo User', '${hashedPassword}', true, 12, 98, 5, 4.7, false, NOW() - INTERVAL '60 days'),
      ('seller123', 'seller@example.com', 'Seller User', '${hashedPassword}', true, 45, 96, 8, 4.8, false, NOW() - INTERVAL '120 days'),
      ('buyer456', 'buyer@example.com', 'Buyer User', '${hashedPassword}', false, 3, 100, 15, 4.2, false, NOW() - INTERVAL '15 days'),
      ('crypto_trader', 'trader@example.com', 'Crypto Trader', '${hashedPassword}', true, 78, 99, 3, 4.9, false, NOW() - INTERVAL '365 days')
    `);
    console.log('Added sample users including admin user');
    
    // Create sample trades
    await pool.query(`
      INSERT INTO trades (type, amount, price, currency, status, created_at, completed_at, 
                         cancelled_at, user_id, counterparty_id, payment_method)
      VALUES 
      ('buy', 0.5, 40000, 'BTC', 'open', NOW(), NULL, NULL, 2, 3, 'Bank Transfer'),
      ('sell', 1.2, 2800, 'ETH', 'in_escrow', NOW() - INTERVAL '1 day', NULL, NULL, 4, 5, 'Credit Card'),
      ('buy', 1000, 1, 'USDT', 'completed', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', NULL, 2, 5, 'PayPal'),
      ('sell', 0.75, 39500, 'BTC', 'disputed', NOW() - INTERVAL '5 days', NULL, NULL, 3, 4, 'Bank Transfer'),
      ('buy', 5, 2750, 'ETH', 'cancelled', NOW() - INTERVAL '7 days', NULL, NOW() - INTERVAL '6 days', 5, 2, 'Credit Card')
    `);
    console.log('Added sample trades');
    
    // Create sample messages
    await pool.query(`
      INSERT INTO messages (trade_id, sender_id, receiver_id, text, timestamp, is_read)
      VALUES 
      (1, 2, 3, 'Hello, I am interested in this trade.', NOW() - INTERVAL '1 hour', true),
      (1, 3, 2, 'Great! I can process the payment once you confirm.', NOW() - INTERVAL '50 minutes', true),
      (1, 2, 3, 'Perfect. I will send the funds to escrow now.', NOW() - INTERVAL '40 minutes', false),
      (2, 4, 5, 'I have sent the payment via credit card. Please check.', NOW() - INTERVAL '12 hours', true),
      (2, 5, 4, 'Payment received. I will release the ETH from escrow now.', NOW() - INTERVAL '11 hours', true)
    `);
    console.log('Added sample messages');
    
    // Create sample disputes
    await pool.query(`
      INSERT INTO disputes (trade_id, trade_amount, trade_currency, reason, description, 
                          status, resolution, created_at, resolved_at, user_id)
      VALUES 
      (4, 0.75, 'BTC', 'payment_issues', 'I sent the payment but seller claims they did not receive it.', 
       'pending', NULL, NOW() - INTERVAL '4 days', NULL, 4),
      (2, 2.0, 'ETH', 'seller_not_responding', 'I paid 3 days ago but seller has not released the funds from escrow.', 
       'reviewing', NULL, NOW() - INTERVAL '3 days', NULL, 2)
    `);
    console.log('Added sample disputes');
    
    // Create sample admin notes (for admin viewing only)
    await pool.query(`
      INSERT INTO admin_notes (dispute_id, text, timestamp, admin_id)
      VALUES 
      (2, 'Contacted seller via email.', NOW() - INTERVAL '2 days', 1),
      (1, 'Buyer provided payment proof. Investigating with payment provider.', NOW() - INTERVAL '3 days', 1),
      (2, 'Seller responded, claims system issue. Investigating.', NOW() - INTERVAL '1 day', 1)
    `);
    console.log('Added sample admin notes');
    
    // Create sample ratings
    await pool.query(`
      INSERT INTO ratings (user_id, trade_id, rating, comment, created_at, rated_by)
      VALUES 
      (3, 3, 5, 'Excellent trader, very responsive!', NOW() - INTERVAL '1 day', 2),
      (5, 3, 4, 'Good experience overall.', NOW() - INTERVAL '1 day', 2),
      (2, 3, 5, 'Very trustworthy buyer.', NOW() - INTERVAL '1 day', 5)
    `);
    console.log('Added sample ratings');
    
    // Create sample wallet balances
    await pool.query(`
      INSERT INTO wallet_balances (user_id, currency, amount, usd_value)
      VALUES 
      (1, 'BTC', 5.0, 200000),
      (1, 'ETH', 50.0, 140000),
      (1, 'USDT', 100000, 100000),
      (2, 'BTC', 0.25, 10000),
      (2, 'ETH', 1.5, 4200),
      (2, 'USDT', 1000, 1000),
      (2, 'USD', 500, 500),
      (3, 'BTC', 1.2, 48000),
      (4, 'ETH', 5.0, 14000),
      (5, 'USDT', 5000, 5000)
    `);
    console.log('Added sample wallet balances');
    
    // Create sample transactions
    await pool.query(`
      INSERT INTO transactions (user_id, type, amount, currency, date, details)
      VALUES 
      (1, 'deposit', 5.0, 'BTC', NOW() - INTERVAL '120 days', 'Initial platform funds'),
      (1, 'deposit', 50.0, 'ETH', NOW() - INTERVAL '120 days', 'Initial platform funds'),
      (1, 'deposit', 100000, 'USDT', NOW() - INTERVAL '120 days', 'Initial platform funds'),
      (2, 'deposit', 0.1, 'BTC', NOW(), 'Initial deposit'),
      (2, 'withdraw', -0.05, 'BTC', NOW() - INTERVAL '1 day', 'Withdrawal to external wallet'),
      (2, 'trade', 0.2, 'ETH', NOW() - INTERVAL '2 days', 'Trade completion'),
      (2, 'deposit', 500, 'USDT', NOW() - INTERVAL '3 days', 'USDT deposit'),
      (2, 'trade', -200, 'USDT', NOW() - INTERVAL '4 days', 'Purchase of BTC'),
      (3, 'deposit', 1.0, 'BTC', NOW() - INTERVAL '5 days', 'Initial deposit'),
      (4, 'deposit', 5.0, 'ETH', NOW() - INTERVAL '6 days', 'Initial deposit'),
      (5, 'deposit', 5000, 'USDT', NOW() - INTERVAL '7 days', 'Initial deposit')
    `);
    console.log('Added sample transactions');
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the seeding function
seedDatabase().catch((error) => {
  console.error('Database seeding error:', error);
  process.exit(1);
});