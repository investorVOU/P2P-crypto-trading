const { Pool } = require('pg');

// Connect to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function createTables() {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        verified BOOLEAN DEFAULT FALSE,
        completed_trades INTEGER DEFAULT 0,
        success_rate DECIMAL DEFAULT 0,
        response_time INTEGER DEFAULT 0,
        rating DECIMAL DEFAULT 0,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create trades table
    await client.query(`
      CREATE TABLE IF NOT EXISTS trades (
        id SERIAL PRIMARY KEY,
        type VARCHAR(10) NOT NULL,
        amount DECIMAL NOT NULL,
        price DECIMAL NOT NULL,
        currency VARCHAR(10) NOT NULL,
        status VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        cancelled_at TIMESTAMP,
        user_id INTEGER NOT NULL REFERENCES users(id),
        counterparty_id INTEGER REFERENCES users(id),
        payment_method VARCHAR(50)
      )
    `);
    
    // Create messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        trade_id INTEGER NOT NULL REFERENCES trades(id),
        sender_id INTEGER NOT NULL REFERENCES users(id),
        receiver_id INTEGER NOT NULL REFERENCES users(id),
        text TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_read BOOLEAN DEFAULT FALSE
      )
    `);
    
    // Create disputes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS disputes (
        id SERIAL PRIMARY KEY,
        trade_id INTEGER NOT NULL REFERENCES trades(id),
        trade_amount DECIMAL NOT NULL,
        trade_currency VARCHAR(10) NOT NULL,
        reason VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(20) NOT NULL,
        resolution VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP,
        user_id INTEGER NOT NULL REFERENCES users(id)
      )
    `);
    
    // Create admin_notes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_notes (
        id SERIAL PRIMARY KEY,
        dispute_id INTEGER NOT NULL REFERENCES disputes(id),
        text TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        admin_id INTEGER NOT NULL REFERENCES users(id)
      )
    `);
    
    // Create ratings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        trade_id INTEGER NOT NULL REFERENCES trades(id),
        rating INTEGER NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        rated_by INTEGER NOT NULL REFERENCES users(id)
      )
    `);
    
    // Create wallet_balances table
    await client.query(`
      CREATE TABLE IF NOT EXISTS wallet_balances (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        currency VARCHAR(10) NOT NULL,
        amount DECIMAL NOT NULL DEFAULT 0,
        usd_value DECIMAL NOT NULL DEFAULT 0
      )
    `);
    
    // Create transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        type VARCHAR(20) NOT NULL,
        amount DECIMAL NOT NULL,
        currency VARCHAR(10) NOT NULL,
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        details TEXT
      )
    `);
    
    // Create session table for connect-pg-simple
    await client.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      )
    `);
    
    await client.query('COMMIT');
    console.log('Database tables created successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating database tables:', err);
    throw err;
  } finally {
    client.release();
  }
}

async function main() {
  console.log('Starting database migration...');
  console.log('Creating database tables if they don\'t exist...');
  
  try {
    await createTables();
    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Error during migration:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();