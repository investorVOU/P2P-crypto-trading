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
    // Check if nonce exists for this address
    const existingNonce = await this.getWalletNonce(address);
    
    if (existingNonce) {
      // Update existing nonce
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
      // Create new nonce
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

  // Other methods can be added as needed
}

// Create and export an instance of the storage
const storage = new DatabaseStorage();

module.exports = { storage };