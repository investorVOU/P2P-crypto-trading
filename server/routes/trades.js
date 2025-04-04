const express = require('express');
const router = express.Router();

// Public endpoint for fetching trades
router.get('/public/trades', async (req, res) => {
  try {
    const { type, currency, status } = req.query;
    const trades = await storage.getTrades(null, status);
    res.json(trades);
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
});
const { query } = require('../db');

// Get all trades (with various filter options)
router.get('/', async (req, res) => {
  try {
    const { userId, status, type, currency, limit, browse } = req.query;
    
    // Build the SQL query based on parameters
    let conditions = [];
    let params = [];
    let paramIndex = 1;
    
    // If browse=true is specified, get all 'active' trades available for joining
    if (browse === 'true') {
      conditions.push(`status = 'active'`);
      // Only get trades where the counterparty is not set
      conditions.push(`counterparty_id IS NULL`);
    } 
    // Otherwise, get user-specific trades or filter by user ID
    else if (userId) {
      conditions.push(`(user_id = $${paramIndex} OR counterparty_id = $${paramIndex})`);
      params.push(userId);
      paramIndex++;
    } else if (req.user) {
      // If user is authenticated and no userId specified, show their trades
      conditions.push(`(user_id = $${paramIndex} OR counterparty_id = $${paramIndex})`);
      params.push(req.user.id);
      paramIndex++;
    }
    
    // Add status filter if provided
    if (status) {
      conditions.push(`status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }
    
    // Add type filter (buy/sell) if provided
    if (type) {
      conditions.push(`type = $${paramIndex}`);
      params.push(type);
      paramIndex++;
    }
    
    // Add currency filter if provided
    if (currency) {
      conditions.push(`currency = $${paramIndex}`);
      params.push(currency);
      paramIndex++;
    }
    
    // Build the WHERE clause
    let sql = `SELECT * FROM trades`;
    
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    // Add ordering
    sql += ` ORDER BY created_at DESC`;
    
    // Add limit if provided
    if (limit && !isNaN(parseInt(limit))) {
      sql += ` LIMIT $${paramIndex}`;
      params.push(parseInt(limit));
    }
    
    console.log('Trade query SQL:', sql);
    console.log('Trade query params:', params);
    
    const result = await query(sql, params);
    
    // Include user details for each trade
    const tradesWithUsers = await Promise.all(result.rows.map(async (trade) => {
      const userResult = await query('SELECT id, username, full_name, rating FROM users WHERE id = $1', [trade.user_id]);
      const user = userResult.rows[0] || { username: 'Unknown', full_name: 'Unknown User' };
      
      // Also get counterparty details if available
      let counterparty = null;
      if (trade.counterparty_id) {
        const counterpartyResult = await query('SELECT id, username, full_name, rating FROM users WHERE id = $1', [trade.counterparty_id]);
        counterparty = counterpartyResult.rows[0] || { username: 'Unknown', full_name: 'Unknown User' };
      }
      
      return {
        ...trade,
        user: {
          id: user.id,
          username: user.username,
          fullName: user.full_name,
          rating: user.rating
        },
        counterparty: counterparty ? {
          id: counterparty.id,
          username: counterparty.username,
          fullName: counterparty.full_name,
          rating: counterparty.rating
        } : null
      };
    }));
    
    res.json(tradesWithUsers);
  } catch (err) {
    console.error('Error fetching trades:', err);
    res.status(500).json({ message: 'Failed to fetch trades' });
  }
});

// Get a specific trade by ID with user details and messages
router.get('/:id', async (req, res) => {
  try {
    const tradeId = req.params.id;
    const result = await query(
      'SELECT * FROM trades WHERE id = $1',
      [tradeId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Trade not found' });
    }
    
    const trade = result.rows[0];
    
    // Check if user is authorized to view this trade (if not public active trade)
    // Anyone can view active trades that need a counterparty
    if (!(trade.status === 'active' && trade.counterparty_id === null)) {
      if (!req.user || (trade.user_id !== req.user.id && trade.counterparty_id !== req.user.id && !req.user.is_admin)) {
        return res.status(403).json({ message: 'Not authorized to view this trade' });
      }
    }
    
    // Get creator user details
    const userResult = await query(
      'SELECT id, username, full_name, rating, completed_trades FROM users WHERE id = $1',
      [trade.user_id]
    );
    const user = userResult.rows[0] || { username: 'Unknown', full_name: 'Unknown User' };
    
    // Get counterparty details if available
    let counterparty = null;
    if (trade.counterparty_id) {
      const counterpartyResult = await query(
        'SELECT id, username, full_name, rating, completed_trades FROM users WHERE id = $1',
        [trade.counterparty_id]
      );
      counterparty = counterpartyResult.rows[0] || { username: 'Unknown', full_name: 'Unknown User' };
    }
    
    // Get messages if the user is authenticated and part of the trade
    let messages = [];
    let disputes = [];
    let ratings = [];
    
    if (req.user && (trade.user_id === req.user.id || trade.counterparty_id === req.user.id || req.user.is_admin)) {
      // Get messages
      const messagesResult = await query(
        'SELECT * FROM messages WHERE trade_id = $1 ORDER BY created_at ASC',
        [tradeId]
      );
      messages = messagesResult.rows;
      
      // Get disputes
      const disputesResult = await query(
        'SELECT * FROM disputes WHERE trade_id = $1',
        [tradeId]
      );
      disputes = disputesResult.rows;
      
      // Get ratings
      const ratingsResult = await query(
        'SELECT r.*, u.username as rater_username, u.full_name as rater_full_name FROM ratings r JOIN users u ON r.rater_id = u.id WHERE r.trade_id = $1',
        [tradeId]
      );
      ratings = ratingsResult.rows;
      
      // Mark messages as read if recipient is current user
      if (req.user) {
        await query(
          'UPDATE messages SET read = TRUE WHERE trade_id = $1 AND recipient_id = $2 AND read = FALSE',
          [tradeId, req.user.id]
        );
      }
    }
    
    // Format the response
    const tradeWithDetails = {
      ...trade,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        rating: user.rating,
        completedTrades: user.completed_trades
      },
      counterparty: counterparty ? {
        id: counterparty.id,
        username: counterparty.username,
        fullName: counterparty.full_name,
        rating: counterparty.rating,
        completedTrades: counterparty.completed_trades
      } : null,
      messages,
      disputes,
      ratings,
      // Add calculated fields that might be useful for the frontend
      isCompleted: trade.status === 'completed',
      isCancelled: trade.status === 'cancelled',
      isDisputed: trade.status === 'disputed',
      isPending: trade.status === 'pending',
      isActive: trade.status === 'active',
      totalValue: parseFloat(trade.amount) * parseFloat(trade.price)
    };
    
    res.json(tradeWithDetails);
  } catch (err) {
    console.error('Error fetching trade:', err);
    res.status(500).json({ message: 'Failed to fetch trade' });
  }
});

// Helper function to calculate current market price
function calculatePrice(currency) {
  // In a real application, this would fetch from a price API
  const prices = {
    'BTC': 25000 + Math.random() * 2000,
    'ETH': 1800 + Math.random() * 200,
    'USDT': 1,
    'USDC': 1,
    'XRP': 0.5 + Math.random() * 0.1,
    'SOL': 50 + Math.random() * 10,
    'ADA': 0.3 + Math.random() * 0.05,
    'DOT': 5 + Math.random() * 1
  };
  
  return prices[currency] || 100; // Default price if currency not found
}

// Create a new trade
router.post('/', async (req, res) => {
  try {
    const { type, amount, currency, price, paymentMethod } = req.body;
    const userId = req.user.id;
    
    // Validate input
    if (!type || !amount || !currency || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    if (type !== 'buy' && type !== 'sell') {
      return res.status(400).json({ message: 'Type must be "buy" or "sell"' });
    }
    
    // Use provided price or calculate from market
    const tradePrice = price || calculatePrice(currency);
    
    const result = await query(
      `INSERT INTO trades 
       (type, amount, price, currency, status, user_id, payment_method) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [type, amount, tradePrice, currency, 'active', userId, paymentMethod]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating trade:', err);
    res.status(500).json({ message: 'Failed to create trade' });
  }
});

// Update trade status
router.put('/:id/status', async (req, res) => {
  try {
    const tradeId = req.params.id;
    const { status } = req.body;
    const userId = req.user.id;
    
    // Validate status
    const validStatuses = ['pending', 'active', 'completed', 'cancelled', 'disputed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Check if trade exists and user is authorized
    const tradeResult = await query(
      'SELECT * FROM trades WHERE id = $1',
      [tradeId]
    );
    
    if (tradeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Trade not found' });
    }
    
    const trade = tradeResult.rows[0];
    
    // Check authorization (must be creator, counterparty, or admin)
    if (trade.user_id !== userId && trade.counterparty_id !== userId && !req.user.is_admin) {
      return res.status(403).json({ message: 'Not authorized to update this trade' });
    }
    
    // Set timestamp fields based on status
    let completedAt = null;
    let cancelledAt = null;
    
    if (status === 'completed') {
      completedAt = new Date();
    } else if (status === 'cancelled') {
      cancelledAt = new Date();
    }
    
    // Update the trade
    const updateResult = await query(
      `UPDATE trades 
       SET status = $1, completed_at = $2, cancelled_at = $3
       WHERE id = $4
       RETURNING *`,
      [status, completedAt, cancelledAt, tradeId]
    );
    
    // If a trade is completed, update user stats
    if (status === 'completed') {
      // Update completed_trades count for both users
      await query(
        'UPDATE users SET completed_trades = completed_trades + 1 WHERE id = $1 OR id = $2',
        [trade.user_id, trade.counterparty_id]
      );
      
      // In a real app, we would also update success_rate and other metrics
    }
    
    res.json(updateResult.rows[0]);
  } catch (err) {
    console.error('Error updating trade status:', err);
    res.status(500).json({ message: 'Failed to update trade status' });
  }
});

// Join a trade as counterparty
router.post('/:id/join', async (req, res) => {
  try {
    const tradeId = req.params.id;
    const userId = req.user.id;
    
    // Check if trade exists and is available
    const tradeResult = await query(
      'SELECT * FROM trades WHERE id = $1',
      [tradeId]
    );
    
    if (tradeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Trade not found' });
    }
    
    const trade = tradeResult.rows[0];
    
    // Check if trade is available to join
    if (trade.status !== 'active') {
      return res.status(400).json({ message: 'This trade is not available to join' });
    }
    
    // Check if user is not the creator
    if (trade.user_id === userId) {
      return res.status(400).json({ message: 'You cannot join your own trade' });
    }
    
    // Update the trade
    const updateResult = await query(
      `UPDATE trades 
       SET counterparty_id = $1, status = 'pending'
       WHERE id = $2
       RETURNING *`,
      [userId, tradeId]
    );
    
    res.json(updateResult.rows[0]);
  } catch (err) {
    console.error('Error joining trade:', err);
    res.status(500).json({ message: 'Failed to join trade' });
  }
});

// Get messages for a trade
router.get('/:id/messages', async (req, res) => {
  try {
    const tradeId = req.params.id;
    const userId = req.user.id;
    
    // Check if user is authorized to view messages
    const tradeResult = await query(
      'SELECT * FROM trades WHERE id = $1',
      [tradeId]
    );
    
    if (tradeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Trade not found' });
    }
    
    const trade = tradeResult.rows[0];
    
    // Check authorization (must be creator, counterparty, or admin)
    if (trade.user_id !== userId && trade.counterparty_id !== userId && !req.user.is_admin) {
      return res.status(403).json({ message: 'Not authorized to view messages for this trade' });
    }
    
    // Get messages
    const messagesResult = await query(
      'SELECT * FROM messages WHERE trade_id = $1 ORDER BY created_at ASC',
      [tradeId]
    );
    
    // Mark messages as read if recipient is current user
    await query(
      'UPDATE messages SET read = TRUE WHERE trade_id = $1 AND recipient_id = $2 AND read = FALSE',
      [tradeId, userId]
    );
    
    res.json(messagesResult.rows);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Send a message in a trade
router.post('/:id/messages', async (req, res) => {
  try {
    const tradeId = req.params.id;
    const senderId = req.user.id;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    // Check if trade exists and user is authorized
    const tradeResult = await query(
      'SELECT * FROM trades WHERE id = $1',
      [tradeId]
    );
    
    if (tradeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Trade not found' });
    }
    
    const trade = tradeResult.rows[0];
    
    // Check authorization (must be creator, counterparty, or admin)
    if (trade.user_id !== senderId && trade.counterparty_id !== senderId && !req.user.is_admin) {
      return res.status(403).json({ message: 'Not authorized to send messages in this trade' });
    }
    
    // Determine recipient (the other party)
    let recipientId;
    if (senderId === trade.user_id) {
      recipientId = trade.counterparty_id;
    } else {
      recipientId = trade.user_id;
    }
    
    // Create message
    const messageResult = await query(
      `INSERT INTO messages 
       (trade_id, sender_id, recipient_id, content) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [tradeId, senderId, recipientId, content]
    );
    
    res.status(201).json(messageResult.rows[0]);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Create a dispute for a trade
router.post('/:id/disputes', async (req, res) => {
  try {
    const tradeId = req.params.id;
    const userId = req.user.id;
    const { reason, description } = req.body;
    
    if (!reason) {
      return res.status(400).json({ message: 'Dispute reason is required' });
    }
    
    // Check if trade exists and user is authorized
    const tradeResult = await query(
      'SELECT * FROM trades WHERE id = $1',
      [tradeId]
    );
    
    if (tradeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Trade not found' });
    }
    
    const trade = tradeResult.rows[0];
    
    // Check authorization (must be creator or counterparty)
    if (trade.user_id !== userId && trade.counterparty_id !== userId) {
      return res.status(403).json({ message: 'Not authorized to create a dispute for this trade' });
    }
    
    // Check if trade status allows disputes
    if (trade.status !== 'pending' && trade.status !== 'active') {
      return res.status(400).json({ message: 'Cannot create a dispute for a completed or cancelled trade' });
    }
    
    // Check if dispute already exists
    const existingDispute = await query(
      'SELECT * FROM disputes WHERE trade_id = $1',
      [tradeId]
    );
    
    if (existingDispute.rows.length > 0) {
      return res.status(400).json({ message: 'A dispute already exists for this trade' });
    }
    
    // Create dispute
    const disputeResult = await query(
      `INSERT INTO disputes 
       (trade_id, trade_amount, trade_currency, reason, description, status, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [tradeId, trade.amount, trade.currency, reason, description, 'pending', userId]
    );
    
    // Update trade status to disputed
    await query(
      'UPDATE trades SET status = $1 WHERE id = $2',
      ['disputed', tradeId]
    );
    
    res.status(201).json(disputeResult.rows[0]);
  } catch (err) {
    console.error('Error creating dispute:', err);
    res.status(500).json({ message: 'Failed to create dispute' });
  }
});

// Rate the other party after a trade is completed
router.post('/:id/ratings', async (req, res) => {
  try {
    const tradeId = req.params.id;
    const raterId = req.user.id;
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    // Check if trade exists and is completed
    const tradeResult = await query(
      'SELECT * FROM trades WHERE id = $1',
      [tradeId]
    );
    
    if (tradeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Trade not found' });
    }
    
    const trade = tradeResult.rows[0];
    
    // Check if trade is completed
    if (trade.status !== 'completed') {
      return res.status(400).json({ message: 'Can only rate completed trades' });
    }
    
    // Check if user participated in the trade
    if (trade.user_id !== raterId && trade.counterparty_id !== raterId) {
      return res.status(403).json({ message: 'Not authorized to rate this trade' });
    }
    
    // Determine the rated user
    const ratedId = (raterId === trade.user_id) ? trade.counterparty_id : trade.user_id;
    
    // Check if already rated
    const existingRating = await query(
      'SELECT * FROM ratings WHERE trade_id = $1 AND rater_id = $2',
      [tradeId, raterId]
    );
    
    if (existingRating.rows.length > 0) {
      return res.status(400).json({ message: 'You have already rated this trade' });
    }
    
    // Create rating
    const ratingResult = await query(
      `INSERT INTO ratings 
       (trade_id, rater_id, rated_id, rating, comment) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [tradeId, raterId, ratedId, rating, comment]
    );
    
    // Update user's average rating
    const userRatings = await query(
      'SELECT AVG(rating) as avg_rating FROM ratings WHERE rated_id = $1',
      [ratedId]
    );
    
    if (userRatings.rows.length > 0 && userRatings.rows[0].avg_rating) {
      await query(
        'UPDATE users SET rating = $1 WHERE id = $2',
        [userRatings.rows[0].avg_rating, ratedId]
      );
    }
    
    res.status(201).json(ratingResult.rows[0]);
  } catch (err) {
    console.error('Error creating rating:', err);
    res.status(500).json({ message: 'Failed to create rating' });
  }
});

module.exports = router;