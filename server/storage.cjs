const { query, pool } = require('./db');

class DatabaseStorage {
  constructor() {
    this.sessionStore = null; // We'll initialize this when needed
  }

  // User methods
  async getUser(id) {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  async getUserByUsername(username) {
    const result = await query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  }

  async createUser(user) {
    const { username, email, password, fullName, walletAddress } = user;
    const result = await query(
      'INSERT INTO users (username, email, password, full_name, wallet_address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, email, password, fullName, walletAddress]
    );
    return result.rows[0];
  }

  async getAllUsers() {
    const result = await query('SELECT * FROM users');
    return result.rows;
  }

  // Wallet authentication methods
  async getUserByWalletAddress(address) {
    const result = await query('SELECT * FROM users WHERE wallet_address = $1', [address]);
    return result.rows[0];
  }
  
  async getWalletNonce(address) {
    const result = await query('SELECT * FROM wallet_nonces WHERE address = $1', [address]);
    return result.rows[0];
  }
  
  async createOrUpdateWalletNonce(address, nonce) {
    // Check if nonce exists for this address
    const existingNonce = await this.getWalletNonce(address);
    
    if (existingNonce) {
      // Update existing nonce
      const result = await query(
        'UPDATE wallet_nonces SET nonce = $1, created_at = NOW() WHERE address = $2 RETURNING *',
        [nonce, address]
      );
      return result.rows[0];
    } else {
      // Create new nonce
      const result = await query(
        'INSERT INTO wallet_nonces (address, nonce) VALUES ($1, $2) RETURNING *',
        [address, nonce]
      );
      return result.rows[0];
    }
  }
}

// Create and export an instance of the storage
const storage = new DatabaseStorage();

module.exports = { storage };