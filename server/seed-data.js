const { Pool } = require('pg');
const { hashPassword } = require('./auth');

// Connect to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function seedData() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Clear existing data
    await client.query('TRUNCATE users, trades, messages, disputes, admin_notes, ratings, wallet_balances, transactions CASCADE');
    
    // Reset sequences
    await client.query(`
      ALTER SEQUENCE users_id_seq RESTART WITH 1;
      ALTER SEQUENCE trades_id_seq RESTART WITH 1;
      ALTER SEQUENCE messages_id_seq RESTART WITH 1;
      ALTER SEQUENCE disputes_id_seq RESTART WITH 1;
      ALTER SEQUENCE admin_notes_id_seq RESTART WITH 1;
      ALTER SEQUENCE ratings_id_seq RESTART WITH 1;
      ALTER SEQUENCE wallet_balances_id_seq RESTART WITH 1;
      ALTER SEQUENCE transactions_id_seq RESTART WITH 1;
    `);
    
    // Create sample users
    const adminPassword = await hashPassword('admin123');
    const user1Password = await hashPassword('password123');
    const user2Password = await hashPassword('password456');
    const user3Password = await hashPassword('password789');
    
    await client.query(`
      INSERT INTO users (username, email, full_name, password, verified, completed_trades, success_rate, response_time, rating, is_admin, created_at)
      VALUES 
        ('admin', 'admin@example.com', 'Admin User', $1, TRUE, 0, 0, 0, 0, TRUE, NOW() - INTERVAL '30 days'),
        ('alice', 'alice@example.com', 'Alice Smith', $2, TRUE, 15, 98.5, 10, 4.8, FALSE, NOW() - INTERVAL '20 days'),
        ('bob', 'bob@example.com', 'Bob Jones', $3, TRUE, 8, 92.0, 15, 4.5, FALSE, NOW() - INTERVAL '15 days'),
        ('carol', 'carol@example.com', 'Carol Davis', $4, TRUE, 3, 100.0, 5, 5.0, FALSE, NOW() - INTERVAL '5 days')
    `, [adminPassword, user1Password, user2Password, user3Password]);
    
    // Create sample trades
    await client.query(`
      INSERT INTO trades (type, amount, price, currency, status, created_at, completed_at, cancelled_at, user_id, counterparty_id, payment_method)
      VALUES 
        ('sell', 0.5, 35000, 'BTC', 'completed', NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days', NULL, 2, 3, 'Bank Transfer'),
        ('buy', 2.5, 2800, 'ETH', 'completed', NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days', NULL, 3, 2, 'PayPal'),
        ('sell', 1000, 1.2, 'XRP', 'cancelled', NOW() - INTERVAL '6 days', NULL, NOW() - INTERVAL '5 days', 2, 4, 'Credit Card'),
        ('buy', 0.25, 40000, 'BTC', 'disputed', NOW() - INTERVAL '4 days', NULL, NULL, 4, 3, 'Bank Transfer'),
        ('sell', 500, 1.5, 'USDT', 'in_escrow', NOW() - INTERVAL '2 days', NULL, NULL, 3, 4, 'Venmo'),
        ('buy', 10, 250, 'LTC', 'open', NOW() - INTERVAL '1 day', NULL, NULL, 2, NULL, 'Cash App')
    `);
    
    // Create sample messages
    await client.query(`
      INSERT INTO messages (trade_id, sender_id, receiver_id, text, timestamp, is_read)
      VALUES 
        (1, 2, 3, 'Hi, I\'m interested in this trade.', NOW() - INTERVAL '10 days 2 hours', TRUE),
        (1, 3, 2, 'Great! Let me know when you\'ve sent the payment.', NOW() - INTERVAL '10 days 1 hour', TRUE),
        (1, 2, 3, 'Payment sent. Transaction ID: TX123456', NOW() - INTERVAL '9 days 23 hours', TRUE),
        (1, 3, 2, 'Payment received. Releasing escrow now.', NOW() - INTERVAL '9 days 22 hours', TRUE),
        (4, 4, 3, 'I sent the payment but haven\'t received the BTC yet.', NOW() - INTERVAL '4 days 5 hours', TRUE),
        (4, 3, 4, 'I don\'t see any payment on my end yet.', NOW() - INTERVAL '4 days 4 hours', TRUE),
        (4, 4, 3, 'I have the confirmation number: PYMNT789', NOW() - INTERVAL '4 days 3 hours', TRUE),
        (4, 3, 4, 'Let me check again with my bank.', NOW() - INTERVAL '4 days 2 hours', FALSE),
        (5, 3, 4, 'Are you ready to complete this trade?', NOW() - INTERVAL '1 day 12 hours', TRUE),
        (5, 4, 3, 'Yes, processing the payment now.', NOW() - INTERVAL '1 day 6 hours', FALSE)
    `);
    
    // Create sample disputes
    await client.query(`
      INSERT INTO disputes (trade_id, trade_amount, trade_currency, reason, description, status, resolution, created_at, resolved_at, user_id)
      VALUES 
        (4, 0.25, 'BTC', 'payment_issue', 'Payment was sent but the seller claims they did not receive it', 'pending', NULL, NOW() - INTERVAL '3 days 12 hours', NULL, 4)
    `);
    
    // Create sample admin notes
    await client.query(`
      INSERT INTO admin_notes (dispute_id, text, timestamp, admin_id)
      VALUES 
        (1, 'Contacted buyer for payment proof', NOW() - INTERVAL '3 days 10 hours', 1),
        (1, 'Contacted seller\'s bank to verify transaction', NOW() - INTERVAL '3 days 8 hours', 1),
        (1, 'Bank confirmed payment was processed correctly', NOW() - INTERVAL '3 days 4 hours', 1)
    `);
    
    // Create sample ratings
    await client.query(`
      INSERT INTO ratings (user_id, trade_id, rating, comment, created_at, rated_by)
      VALUES 
        (3, 1, 5, 'Great seller, fast transaction!', NOW() - INTERVAL '9 days', 2),
        (2, 1, 5, 'Smooth trade, would trade again!', NOW() - INTERVAL '9 days', 3),
        (2, 2, 4, 'Good communication, but a bit slow to respond.', NOW() - INTERVAL '7 days', 3),
        (3, 2, 5, 'Perfect buyer, no issues at all.', NOW() - INTERVAL '7 days', 2)
    `);
    
    // Create sample wallet balances
    await client.query(`
      INSERT INTO wallet_balances (user_id, currency, amount, usd_value)
      VALUES 
        (1, 'BTC', 1.5, 60000),
        (1, 'ETH', 10, 28000),
        (1, 'USDT', 5000, 5000),
        (2, 'BTC', 0.8, 32000),
        (2, 'ETH', 5, 14000),
        (2, 'XRP', 5000, 6000),
        (3, 'BTC', 0.3, 12000),
        (3, 'LTC', 20, 5000),
        (3, 'ETH', 3, 8400),
        (4, 'BTC', 0.1, 4000),
        (4, 'USDT', 2000, 2000)
    `);
    
    // Create sample transactions
    await client.query(`
      INSERT INTO transactions (user_id, type, amount, currency, date, details)
      VALUES 
        (2, 'deposit', 1.0, 'BTC', NOW() - INTERVAL '25 days', 'Initial deposit'),
        (2, 'withdraw', 0.2, 'BTC', NOW() - INTERVAL '15 days', 'Withdrawal to external wallet'),
        (2, 'trade', 0.5, 'BTC', NOW() - INTERVAL '10 days', 'Trade #1 - Sell BTC'),
        (3, 'deposit', 5.0, 'ETH', NOW() - INTERVAL '20 days', 'Initial deposit'),
        (3, 'trade', 2.5, 'ETH', NOW() - INTERVAL '8 days', 'Trade #2 - Buy ETH'),
        (3, 'withdraw', 0.5, 'ETH', NOW() - INTERVAL '5 days', 'Withdrawal to external wallet'),
        (4, 'deposit', 0.3, 'BTC', NOW() - INTERVAL '10 days', 'Initial deposit'),
        (4, 'withdraw', 0.05, 'BTC', NOW() - INTERVAL '7 days', 'Withdrawal to external wallet'),
        (4, 'trade', 0.25, 'BTC', NOW() - INTERVAL '4 days', 'Trade #4 - Buy BTC')
    `);
    
    await client.query('COMMIT');
    console.log('Database seeded successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', err);
    throw err;
  } finally {
    client.release();
  }
}

async function main() {
  console.log('Starting database seeding...');
  
  try {
    await seedData();
    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();