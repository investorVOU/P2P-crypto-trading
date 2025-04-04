const { Pool } = require('pg');
const { drizzle } = require('drizzle-orm/pg-core');
const schema = require('../shared/schema.js');

// Create a connection pool with SSL options for Replit
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Needed for Replit's PostgreSQL connection
  }
});

// Create a drizzle instance
const db = drizzle(pool, { schema });

// Simple function to query the database
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
}

module.exports = {
  query,
  pool,
  db
};