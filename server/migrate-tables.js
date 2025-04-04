const { query, pool } = require('./db');

async function createTables() {
  const userTable = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      full_name VARCHAR(255),
      verified BOOLEAN DEFAULT FALSE,
      wallet_address VARCHAR(255) UNIQUE,
      completed_trades INT DEFAULT 0,
      success_rate NUMERIC(5,2) DEFAULT 0,
      response_time INT DEFAULT 0,
      rating NUMERIC(3,2) DEFAULT 0,
      is_admin BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  const tradesTable = `
    CREATE TABLE IF NOT EXISTS trades (
      id SERIAL PRIMARY KEY,
      type VARCHAR(50) NOT NULL,
      amount NUMERIC(20,8) NOT NULL,
      price NUMERIC(20,2) NOT NULL,
      currency VARCHAR(10) NOT NULL,
      status VARCHAR(50) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      completed_at TIMESTAMPTZ,
      cancelled_at TIMESTAMPTZ,
      user_id INT REFERENCES users(id),
      counterparty_id INT REFERENCES users(id),
      payment_method VARCHAR(100)
    );
  `;

  const messagesTable = `
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      trade_id INT REFERENCES trades(id),
      sender_id INT REFERENCES users(id),
      recipient_id INT REFERENCES users(id),
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      read BOOLEAN DEFAULT FALSE
    );
  `;

  const disputesTable = `
    CREATE TABLE IF NOT EXISTS disputes (
      id SERIAL PRIMARY KEY,
      trade_id INT REFERENCES trades(id),
      trade_amount NUMERIC(20,8),
      trade_currency VARCHAR(10),
      reason VARCHAR(255) NOT NULL,
      description TEXT,
      status VARCHAR(50) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      resolved_at TIMESTAMPTZ,
      resolution TEXT,
      user_id INT REFERENCES users(id)
    );
  `;

  const adminNotesTable = `
    CREATE TABLE IF NOT EXISTS admin_notes (
      id SERIAL PRIMARY KEY,
      dispute_id INT REFERENCES disputes(id),
      admin_id INT REFERENCES users(id),
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  const ratingsTable = `
    CREATE TABLE IF NOT EXISTS ratings (
      id SERIAL PRIMARY KEY,
      trade_id INT REFERENCES trades(id),
      rater_id INT REFERENCES users(id),
      rated_id INT REFERENCES users(id),
      rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
      comment TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  const walletBalancesTable = `
    CREATE TABLE IF NOT EXISTS wallet_balances (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id),
      currency VARCHAR(10) NOT NULL,
      amount NUMERIC(20,8) NOT NULL,
      usd_value NUMERIC(20,2) NOT NULL
    );
  `;

  const transactionsTable = `
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id),
      type VARCHAR(50) NOT NULL,
      amount NUMERIC(20,8) NOT NULL,
      currency VARCHAR(10) NOT NULL,
      date TIMESTAMPTZ DEFAULT NOW(),
      details TEXT
    );
  `;

  const sessionsTable = `
    CREATE TABLE IF NOT EXISTS "session" (
      "sid" varchar NOT NULL COLLATE "default",
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL,
      CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
    );
  `;
  
  const walletNoncesTable = `
    CREATE TABLE IF NOT EXISTS wallet_nonces (
      address VARCHAR(255) PRIMARY KEY,
      nonce TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  try {
    await query(userTable);
    console.log('Users table created or already exists');
    
    await query(tradesTable);
    console.log('Trades table created or already exists');
    
    await query(messagesTable);
    console.log('Messages table created or already exists');
    
    await query(disputesTable);
    console.log('Disputes table created or already exists');
    
    await query(adminNotesTable);
    console.log('Admin notes table created or already exists');
    
    await query(ratingsTable);
    console.log('Ratings table created or already exists');
    
    await query(walletBalancesTable);
    console.log('Wallet balances table created or already exists');
    
    await query(transactionsTable);
    console.log('Transactions table created or already exists');
    
    await query(sessionsTable);
    console.log('Sessions table created or already exists');
    
    await query(walletNoncesTable);
    console.log('Wallet nonces table created or already exists');
    
    return true;
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

async function main() {
  try {
    await createTables();
    console.log('All database tables created successfully!');
  } catch (error) {
    console.error('Error in database migration:', error);
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the migration
main();