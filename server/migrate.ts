const { Pool } = require("@neondatabase/serverless");
const { drizzle } = require("drizzle-orm/neon-serverless");

// This script pushes the schema directly to the database
async function main() {
  console.log("Starting database migration...");
  
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  // Create the tables based on the schema
  console.log("Creating database tables if they don't exist...");
  
  // We'll manually create each table in the correct order
  try {
    // First handle users table
    await pool.query(`
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
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log("Created users table (if not exists)");
    
    // Then trades table (requires users)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS trades (
        id SERIAL PRIMARY KEY,
        type VARCHAR(10) NOT NULL,
        amount DECIMAL NOT NULL,
        price DECIMAL NOT NULL,
        currency VARCHAR(10) NOT NULL,
        status VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        completed_at TIMESTAMP,
        cancelled_at TIMESTAMP,
        user_id INTEGER NOT NULL REFERENCES users(id),
        counterparty_id INTEGER REFERENCES users(id),
        payment_method VARCHAR(50)
      );
    `);
    console.log("Created trades table (if not exists)");
    
    // Messages table (requires users and trades)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        trade_id INTEGER NOT NULL REFERENCES trades(id),
        sender_id INTEGER NOT NULL REFERENCES users(id),
        receiver_id INTEGER NOT NULL REFERENCES users(id),
        text TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW(),
        is_read BOOLEAN DEFAULT FALSE
      );
    `);
    console.log("Created messages table (if not exists)");
    
    // Disputes table (requires users and trades)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS disputes (
        id SERIAL PRIMARY KEY,
        trade_id INTEGER NOT NULL REFERENCES trades(id),
        trade_amount DECIMAL NOT NULL,
        trade_currency VARCHAR(10) NOT NULL,
        reason VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(20) NOT NULL,
        resolution VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW(),
        resolved_at TIMESTAMP,
        user_id INTEGER NOT NULL REFERENCES users(id)
      );
    `);
    console.log("Created disputes table (if not exists)");
    
    // Admin notes (requires disputes and users)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_notes (
        id SERIAL PRIMARY KEY,
        dispute_id INTEGER NOT NULL REFERENCES disputes(id),
        text TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT NOW(),
        admin_id INTEGER NOT NULL REFERENCES users(id)
      );
    `);
    console.log("Created admin_notes table (if not exists)");
    
    // Ratings table (requires users and trades)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        trade_id INTEGER NOT NULL REFERENCES trades(id),
        rating INTEGER NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        rated_by INTEGER NOT NULL REFERENCES users(id)
      );
    `);
    console.log("Created ratings table (if not exists)");
    
    // Wallet balances (requires users)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wallet_balances (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        currency VARCHAR(10) NOT NULL,
        amount DECIMAL NOT NULL DEFAULT 0,
        usd_value DECIMAL NOT NULL DEFAULT 0
      );
    `);
    console.log("Created wallet_balances table (if not exists)");
    
    // Transactions (requires users)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        type VARCHAR(20) NOT NULL,
        amount DECIMAL NOT NULL,
        currency VARCHAR(10) NOT NULL,
        date TIMESTAMP DEFAULT NOW(),
        details TEXT
      );
    `);
    console.log("Created transactions table (if not exists)");
    
    console.log("All tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error);
    process.exit(1);
  }
  
  await pool.end();
  console.log("Database migration completed");
}

main().catch((error) => {
  console.error("Migration error:", error);
  process.exit(1);
});