
const session = require('express-session');
const connectPg = require('connect-pg-simple');
const { pool } = require('./db');
const { eq } = require('drizzle-orm');
const { 
  users, trades, messages, disputes, adminNotes, ratings, walletBalances, transactions, walletNonces
} = require('../shared/schema.js');

// Create PostgreSQL session store
const PostgresSessionStore = connectPg(session);

// Database storage implementation
class DatabaseStorage {
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true
    });
  }

  // User methods
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user) {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getAllUsers() {
    return await db.select().from(users);
  }

  // Trade methods
  async getTrades(status = null) {
    try {
      let query = 'SELECT * FROM trades';
      const params = [];
      
      if (status) {
        query += ' WHERE status = $1';
        params.push(status);
      }
      
      query += ' ORDER BY created_at DESC';
      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error getting trades:', error);
      throw error;
    }
  }

  // Wallet authentication methods
  async getUserByWalletAddress(address) {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, address));
    return user;
  }
  
  async getWalletNonce(address) {
    const [nonce] = await db.select().from(walletNonces).where(eq(walletNonces.address, address));
    return nonce;
  }
  
  async createOrUpdateWalletNonce(address, nonce) {
    const existingNonce = await this.getWalletNonce(address);
    
    if (existingNonce) {
      const [updatedNonce] = await db
        .update(walletNonces)
        .set({ 
          nonce,
          createdAt: new Date()
        })
        .where(eq(walletNonces.address, address))
        .returning();
      return updatedNonce;
    } else {
      const [newNonce] = await db
        .insert(walletNonces)
        .values({
          address,
          nonce
        })
        .returning();
      return newNonce;
    }
  }
}

// Create and export an instance of the storage
const storage = new DatabaseStorage();

async function getTrades(userId = null, status = null) {
  try {
    let query = 'SELECT * FROM trades';
    const params = [];
    
    if (userId && status) {
      query += ' WHERE user_id = $1 AND status = $2';
      params.push(userId, status);
    } else if (userId) {
      query += ' WHERE user_id = $1';
      params.push(userId);
    } else if (status) {
      query += ' WHERE status = $1';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await db.query(query, params);
    return result.rows;
  } catch (error) {
    console.error('Error getting trades:', error);
    throw error;
  }
}

module.exports = { 
  storage,
  getTrades 
};
