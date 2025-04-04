const { query, pool } = require('./db');
const { scrypt, randomBytes } = require('crypto');
const { promisify } = require('util');

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}

async function seedData() {
  try {
    // Check if users already exist to avoid duplicate seed data
    const usersCheck = await query('SELECT COUNT(*) FROM users');
    if (usersCheck.rows[0].count > 0) {
      console.log('Data already seeded, skipping...');
      return;
    }

    // Seed Users
    const adminPassword = await hashPassword('admin123');
    const user1Password = await hashPassword('password123');
    const user2Password = await hashPassword('password456');

    const adminUserQuery = `
      INSERT INTO users (username, email, password, full_name, verified, is_admin)
      VALUES ('admin', 'admin@example.com', $1, 'Admin User', TRUE, TRUE)
      RETURNING id
    `;
    const adminResult = await query(adminUserQuery, [adminPassword]);
    const adminId = adminResult.rows[0].id;
    console.log(`Created admin user with ID: ${adminId}`);

    const user1Query = `
      INSERT INTO users (username, email, password, full_name, verified, completed_trades, success_rate, response_time, rating)
      VALUES ('user1', 'user1@example.com', $1, 'Test User One', TRUE, 15, 95.5, 10, 4.8)
      RETURNING id
    `;
    const user1Result = await query(user1Query, [user1Password]);
    const user1Id = user1Result.rows[0].id;
    console.log(`Created user1 with ID: ${user1Id}`);

    const user2Query = `
      INSERT INTO users (username, email, password, full_name, verified, completed_trades, success_rate, response_time, rating)
      VALUES ('user2', 'user2@example.com', $1, 'Test User Two', TRUE, 8, 87.5, 15, 4.2)
      RETURNING id
    `;
    const user2Result = await query(user2Query, [user2Password]);
    const user2Id = user2Result.rows[0].id;
    console.log(`Created user2 with ID: ${user2Id}`);

    // Seed Trades
    const tradeInsertQuery = `
      INSERT INTO trades (type, amount, price, currency, status, user_id, counterparty_id, payment_method)
      VALUES 
      ('buy', 0.5, 20000, 'BTC', 'completed', $1, $2, 'bank_transfer'),
      ('sell', 1.2, 1800, 'ETH', 'completed', $2, $1, 'paypal'),
      ('buy', 500, 1.1, 'USDT', 'active', $1, $2, 'bank_transfer'),
      ('sell', 0.8, 22000, 'BTC', 'pending', $2, $1, 'revolut')
      RETURNING id
    `;
    const tradeResult = await query(tradeInsertQuery, [user1Id, user2Id]);
    const tradeIds = tradeResult.rows.map(row => row.id);
    console.log(`Created trades with IDs: ${tradeIds.join(', ')}`);

    // Seed Messages
    const messagesQuery = `
      INSERT INTO messages (trade_id, sender_id, receiver_id, text)
      VALUES 
      ($1, $2, $3, 'Hey, I''m interested in this trade.'),
      ($1, $3, $2, 'Great! I can proceed with it.'),
      ($2, $3, $2, 'Payment sent, please confirm.'),
      ($2, $2, $3, 'Received, releasing funds now.')
    `;
    await query(messagesQuery, [tradeIds[0], user1Id, user2Id]);
    console.log('Created sample messages');

    // Seed a dispute
    const disputeQuery = `
      INSERT INTO disputes (trade_id, trade_amount, trade_currency, reason, description, status, user_id)
      VALUES ($1, 1.2, 'ETH', 'payment_not_received', 'I never received the payment for this trade.', 'pending', $2)
      RETURNING id
    `;
    const disputeResult = await query(disputeQuery, [tradeIds[1], user1Id]);
    const disputeId = disputeResult.rows[0].id;
    console.log(`Created dispute with ID: ${disputeId}`);

    // Seed admin note for the dispute
    const adminNoteQuery = `
      INSERT INTO admin_notes (dispute_id, admin_id, text)
      VALUES ($1, $2, 'Checking the payment confirmation with the payment provider.')
    `;
    await query(adminNoteQuery, [disputeId, adminId]);
    console.log('Created admin note for dispute');

    // Seed ratings
    const ratingsQuery = `
      INSERT INTO ratings (trade_id, rater_id, rated_id, stars, text)
      VALUES 
      ($1, $2, $3, 5, 'Great trader, smooth transaction!'),
      ($1, $3, $2, 4, 'Good experience overall.')
    `;
    await query(ratingsQuery, [tradeIds[0], user1Id, user2Id]);
    console.log('Created sample ratings');

    // Seed wallet balances
    const walletBalancesQuery = `
      INSERT INTO wallet_balances (user_id, currency, amount, usd_value)
      VALUES 
      ($1, 'BTC', 1.5, 30000),
      ($1, 'ETH', 10, 18000),
      ($1, 'USDT', 5000, 5000),
      ($2, 'BTC', 0.8, 16000),
      ($2, 'ETH', 5, 9000),
      ($2, 'USDT', 2000, 2000)
    `;
    await query(walletBalancesQuery, [user1Id, user2Id]);
    console.log('Created sample wallet balances');

    // Seed transactions
    const transactionsQuery = `
      INSERT INTO transactions (user_id, type, amount, currency, details)
      VALUES 
      ($1, 'deposit', 1.5, 'BTC', 'Initial deposit'),
      ($1, 'deposit', 10, 'ETH', 'Initial deposit'),
      ($1, 'deposit', 5000, 'USDT', 'Initial deposit'),
      ($2, 'deposit', 0.8, 'BTC', 'Initial deposit'),
      ($2, 'deposit', 5, 'ETH', 'Initial deposit'),
      ($2, 'deposit', 2000, 'USDT', 'Initial deposit'),
      ($1, 'trade', 0.5, 'BTC', 'Purchased from user2'),
      ($2, 'trade', 1.2, 'ETH', 'Sold to user1')
    `;
    await query(transactionsQuery, [user1Id, user2Id]);
    console.log('Created sample transactions');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

async function main() {
  try {
    await seedData();
  } catch (error) {
    console.error('Failed to seed database:', error);
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the seed function
main();