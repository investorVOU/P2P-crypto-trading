const express = require('express');
const router = express.Router();
const { query } = require('../db');

// Calculate USD value for a cryptocurrency amount
function calculateUsdValue(amount, currency) {
  // In a real application, this would fetch from a price API
  const rates = {
    'BTC': 25000,
    'ETH': 1800,
    'USDT': 1,
    'USDC': 1,
    'XRP': 0.5,
    'SOL': 50,
    'ADA': 0.3,
    'DOT': 5
  };
  
  const rate = rates[currency] || 0;
  return amount * rate;
}

// Get all users
router.get('/users', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        id, username, email, full_name, verified, completed_trades, 
        success_rate, response_time, rating, is_admin, created_at
      FROM 
        users 
      ORDER BY 
        created_at DESC
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Get user by ID with full details
router.get('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Get user details
    const userResult = await query(`
      SELECT 
        id, username, email, full_name, verified, completed_trades, 
        success_rate, response_time, rating, is_admin, created_at
      FROM 
        users 
      WHERE 
        id = $1
    `, [userId]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's wallet balances
    const balancesResult = await query(`
      SELECT * FROM wallet_balances WHERE user_id = $1
    `, [userId]);
    
    // Get user's trades
    const tradesResult = await query(`
      SELECT * FROM trades 
      WHERE user_id = $1 OR counterparty_id = $1
      ORDER BY created_at DESC
    `, [userId]);
    
    // Get user's disputes
    const disputesResult = await query(`
      SELECT d.*, t.amount as trade_amount, t.currency as trade_currency 
      FROM disputes d
      JOIN trades t ON d.trade_id = t.id
      WHERE d.user_id = $1
      ORDER BY d.created_at DESC
    `, [userId]);
    
    // Get user's ratings
    const ratingsResult = await query(`
      SELECT r.*, u.username as rater_username
      FROM ratings r
      JOIN users u ON r.rater_id = u.id
      WHERE r.rated_id = $1
      ORDER BY r.created_at DESC
    `, [userId]);
    
    // Get user's transactions
    const transactionsResult = await query(`
      SELECT * FROM transactions
      WHERE user_id = $1
      ORDER BY date DESC
    `, [userId]);
    
    // Combine data
    const userData = {
      ...userResult.rows[0],
      wallet_balances: balancesResult.rows,
      trades: tradesResult.rows,
      disputes: disputesResult.rows,
      ratings: ratingsResult.rows,
      transactions: transactionsResult.rows
    };
    
    res.json(userData);
  } catch (err) {
    console.error('Error fetching user details:', err);
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { verified, isAdmin } = req.body;
    
    // Build update query based on provided fields
    let updates = [];
    let params = [];
    let paramCount = 1;
    
    if (verified !== undefined) {
      updates.push(`verified = $${paramCount}`);
      params.push(verified);
      paramCount++;
    }
    
    if (isAdmin !== undefined) {
      updates.push(`is_admin = $${paramCount}`);
      params.push(isAdmin);
      paramCount++;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ message: 'No update fields provided' });
    }
    
    // Add user ID as the last parameter
    params.push(userId);
    
    const result = await query(`
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING id, username, email, full_name, verified, is_admin
    `, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// Get all trades with details
router.get('/trades', async (req, res) => {
  try {
    // Optional query filters
    const { status, currency } = req.query;
    let whereClause = '';
    let params = [];
    let paramCount = 1;
    
    if (status) {
      whereClause += `WHERE t.status = $${paramCount} `;
      params.push(status);
      paramCount++;
    }
    
    if (currency) {
      if (whereClause === '') {
        whereClause += `WHERE t.currency = $${paramCount} `;
      } else {
        whereClause += `AND t.currency = $${paramCount} `;
      }
      params.push(currency);
      paramCount++;
    }
    
    const result = await query(`
      SELECT 
        t.*,
        u1.username as creator_username,
        u2.username as counterparty_username
      FROM 
        trades t
      LEFT JOIN 
        users u1 ON t.user_id = u1.id
      LEFT JOIN 
        users u2 ON t.counterparty_id = u2.id
      ${whereClause}
      ORDER BY 
        t.created_at DESC
    `, params);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching trades:', err);
    res.status(500).json({ message: 'Failed to fetch trades' });
  }
});

// Get trade by ID with all related data
router.get('/trades/:id', async (req, res) => {
  try {
    const tradeId = req.params.id;
    
    // Get trade details
    const tradeResult = await query(`
      SELECT 
        t.*,
        u1.username as creator_username,
        u2.username as counterparty_username
      FROM 
        trades t
      LEFT JOIN 
        users u1 ON t.user_id = u1.id
      LEFT JOIN 
        users u2 ON t.counterparty_id = u2.id
      WHERE 
        t.id = $1
    `, [tradeId]);
    
    if (tradeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Trade not found' });
    }
    
    // Get messages for this trade
    const messagesResult = await query(`
      SELECT 
        m.*,
        u.username as sender_username
      FROM 
        messages m
      JOIN 
        users u ON m.sender_id = u.id
      WHERE 
        m.trade_id = $1
      ORDER BY 
        m.created_at ASC
    `, [tradeId]);
    
    // Get disputes for this trade
    const disputesResult = await query(`
      SELECT 
        d.*,
        u.username as user_username
      FROM 
        disputes d
      JOIN 
        users u ON d.user_id = u.id
      WHERE 
        d.trade_id = $1
    `, [tradeId]);
    
    // Get ratings for this trade
    const ratingsResult = await query(`
      SELECT 
        r.*,
        u1.username as rater_username,
        u2.username as rated_username
      FROM 
        ratings r
      JOIN 
        users u1 ON r.rater_id = u1.id
      JOIN 
        users u2 ON r.rated_id = u2.id
      WHERE 
        r.trade_id = $1
    `, [tradeId]);
    
    // Combine data
    const tradeData = {
      ...tradeResult.rows[0],
      messages: messagesResult.rows,
      disputes: disputesResult.rows,
      ratings: ratingsResult.rows
    };
    
    res.json(tradeData);
  } catch (err) {
    console.error('Error fetching trade details:', err);
    res.status(500).json({ message: 'Failed to fetch trade details' });
  }
});

// Get all disputes
router.get('/disputes', async (req, res) => {
  try {
    // Optional status filter
    const { status } = req.query;
    let whereClause = '';
    let params = [];
    
    if (status) {
      whereClause = 'WHERE d.status = $1';
      params.push(status);
    }
    
    const result = await query(`
      SELECT 
        d.*,
        t.amount as trade_amount,
        t.currency as trade_currency,
        t.status as trade_status,
        u.username as user_username,
        COUNT(an.id) as note_count
      FROM 
        disputes d
      JOIN 
        trades t ON d.trade_id = t.id
      JOIN 
        users u ON d.user_id = u.id
      LEFT JOIN 
        admin_notes an ON d.id = an.dispute_id
      ${whereClause}
      GROUP BY 
        d.id, t.amount, t.currency, t.status, u.username
      ORDER BY 
        CASE WHEN d.status = 'pending' THEN 0 ELSE 1 END,
        d.created_at DESC
    `, params);
    
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching disputes:', err);
    res.status(500).json({ message: 'Failed to fetch disputes' });
  }
});

// Get dispute by ID with all related data
router.get('/disputes/:id', async (req, res) => {
  try {
    const disputeId = req.params.id;
    
    // Get dispute details
    const disputeResult = await query(`
      SELECT 
        d.*,
        t.amount as trade_amount,
        t.currency as trade_currency,
        t.type as trade_type,
        t.status as trade_status,
        t.user_id as trade_creator_id,
        t.counterparty_id as trade_counterparty_id,
        u.username as user_username
      FROM 
        disputes d
      JOIN 
        trades t ON d.trade_id = t.id
      JOIN 
        users u ON d.user_id = u.id
      WHERE 
        d.id = $1
    `, [disputeId]);
    
    if (disputeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Dispute not found' });
    }
    
    // Get trade participants usernames
    const trade = disputeResult.rows[0];
    const usersResult = await query(`
      SELECT id, username FROM users WHERE id IN ($1, $2)
    `, [trade.trade_creator_id, trade.trade_counterparty_id]);
    
    const users = {};
    usersResult.rows.forEach(user => {
      users[user.id] = user.username;
    });
    
    // Get admin notes for this dispute
    const notesResult = await query(`
      SELECT 
        an.*,
        u.username as admin_username
      FROM 
        admin_notes an
      JOIN 
        users u ON an.admin_id = u.id
      WHERE 
        an.dispute_id = $1
      ORDER BY 
        an.created_at ASC
    `, [disputeId]);
    
    // Get trade messages
    const messagesResult = await query(`
      SELECT 
        m.*,
        u.username as sender_username
      FROM 
        messages m
      JOIN 
        users u ON m.sender_id = u.id
      WHERE 
        m.trade_id = $1
      ORDER BY 
        m.created_at ASC
    `, [trade.trade_id]);
    
    // Combine data
    const disputeData = {
      ...trade,
      creator_username: users[trade.trade_creator_id],
      counterparty_username: users[trade.trade_counterparty_id],
      admin_notes: notesResult.rows,
      trade_messages: messagesResult.rows
    };
    
    res.json(disputeData);
  } catch (err) {
    console.error('Error fetching dispute details:', err);
    res.status(500).json({ message: 'Failed to fetch dispute details' });
  }
});

// Add admin note to a dispute
router.post('/disputes/:id/notes', async (req, res) => {
  try {
    const disputeId = req.params.id;
    const adminId = req.user.id;
    const { content } = req.body;
    
    // Validate input
    if (!content) {
      return res.status(400).json({ message: 'Note content is required' });
    }
    
    // Check if dispute exists
    const disputeCheck = await query(
      'SELECT id FROM disputes WHERE id = $1',
      [disputeId]
    );
    
    if (disputeCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Dispute not found' });
    }
    
    // Create note
    const noteResult = await query(
      'INSERT INTO admin_notes (dispute_id, admin_id, content) VALUES ($1, $2, $3) RETURNING *',
      [disputeId, adminId, content]
    );
    
    // Get admin username
    const adminResult = await query(
      'SELECT username FROM users WHERE id = $1',
      [adminId]
    );
    
    const noteData = {
      ...noteResult.rows[0],
      admin_username: adminResult.rows[0].username
    };
    
    res.status(201).json(noteData);
  } catch (err) {
    console.error('Error adding admin note:', err);
    res.status(500).json({ message: 'Failed to add admin note' });
  }
});

// Resolve a dispute
router.put('/disputes/:id/resolve', async (req, res) => {
  try {
    const disputeId = req.params.id;
    const adminId = req.user.id;
    const { resolution, winnerUserId } = req.body;
    
    // Validate input
    if (!resolution || !winnerUserId) {
      return res.status(400).json({ message: 'Resolution and winner user ID are required' });
    }
    
    // Get dispute details
    const disputeResult = await query(`
      SELECT d.*, t.id as trade_id, t.amount, t.currency, t.user_id, t.counterparty_id
      FROM disputes d
      JOIN trades t ON d.trade_id = t.id
      WHERE d.id = $1
    `, [disputeId]);
    
    if (disputeResult.rows.length === 0) {
      return res.status(404).json({ message: 'Dispute not found' });
    }
    
    const dispute = disputeResult.rows[0];
    
    // Check if dispute is already resolved
    if (dispute.status === 'resolved') {
      return res.status(400).json({ message: 'Dispute is already resolved' });
    }
    
    // Validate winner ID is one of the trade participants
    if (winnerUserId !== dispute.user_id && winnerUserId !== dispute.counterparty_id) {
      return res.status(400).json({ message: 'Winner must be one of the trade participants' });
    }
    
    // Start a transaction
    await query('BEGIN');
    
    // Update dispute status
    const updateResult = await query(`
      UPDATE disputes
      SET status = 'resolved', resolution = $1, resolved_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [resolution, disputeId]);
    
    // Update trade status based on the winner
    let tradeStatus;
    if (winnerUserId === dispute.user_id) {
      // If the user who raised the dispute wins, cancel the trade
      tradeStatus = 'cancelled';
      await query(`
        UPDATE trades
        SET status = 'cancelled', cancelled_at = NOW()
        WHERE id = $1
      `, [dispute.trade_id]);
    } else {
      // If the counterparty wins, complete the trade
      tradeStatus = 'completed';
      await query(`
        UPDATE trades
        SET status = 'completed', completed_at = NOW()
        WHERE id = $1
      `, [dispute.trade_id]);
      
      // Update user stats
      await query(`
        UPDATE users
        SET completed_trades = completed_trades + 1
        WHERE id IN ($1, $2)
      `, [dispute.user_id, dispute.counterparty_id]);
    }
    
    // Add admin note about resolution
    await query(`
      INSERT INTO admin_notes (dispute_id, admin_id, content)
      VALUES ($1, $2, $3)
    `, [
      disputeId,
      adminId,
      `Dispute resolved: ${resolution}. Trade marked as ${tradeStatus}.`
    ]);
    
    // Commit transaction
    await query('COMMIT');
    
    // Get updated dispute data
    const resolvedDisputeResult = await query(`
      SELECT 
        d.*,
        t.status as trade_status,
        u1.username as user_username,
        u2.username as admin_username
      FROM 
        disputes d
      JOIN 
        trades t ON d.trade_id = t.id
      JOIN 
        users u1 ON d.user_id = u1.id
      JOIN 
        users u2 ON u2.id = $2
      WHERE 
        d.id = $1
    `, [disputeId, adminId]);
    
    res.json(resolvedDisputeResult.rows[0]);
  } catch (err) {
    // Rollback in case of error
    await query('ROLLBACK');
    console.error('Error resolving dispute:', err);
    res.status(500).json({ message: 'Failed to resolve dispute' });
  }
});

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    // Get user counts
    const userCounts = await query(`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as new_users_week,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as new_users_month
      FROM users
    `);
    
    // Get trade stats
    const tradeStats = await query(`
      SELECT 
        COUNT(*) as total_trades,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_trades,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_trades,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_trades,
        COUNT(CASE WHEN status = 'disputed' THEN 1 END) as disputed_trades,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as new_trades_week,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as new_trades_month,
        SUM(CASE WHEN status = 'completed' THEN amount * price ELSE 0 END) as total_volume
      FROM trades
    `);
    
    // Get dispute stats
    const disputeStats = await query(`
      SELECT 
        COUNT(*) as total_disputes,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_disputes,
        COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_disputes,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '7 days' THEN 1 END) as new_disputes_week,
        COUNT(CASE WHEN created_at > NOW() - INTERVAL '30 days' THEN 1 END) as new_disputes_month
      FROM disputes
    `);
    
    // Get wallet stats
    const walletStats = await query(`
      SELECT 
        SUM(usd_value) as total_balance_usd,
        COUNT(DISTINCT user_id) as users_with_balance
      FROM wallet_balances
    `);
    
    // Get recent trades
    const recentTrades = await query(`
      SELECT t.*, u1.username as creator_username, u2.username as counterparty_username
      FROM trades t
      LEFT JOIN users u1 ON t.user_id = u1.id
      LEFT JOIN users u2 ON t.counterparty_id = u2.id
      ORDER BY t.created_at DESC
      LIMIT 5
    `);
    
    // Get recent disputes
    const recentDisputes = await query(`
      SELECT d.*, t.amount as trade_amount, t.currency as trade_currency, 
             u.username as user_username
      FROM disputes d
      JOIN trades t ON d.trade_id = t.id
      JOIN users u ON d.user_id = u.id
      ORDER BY d.created_at DESC
      LIMIT 5
    `);
    
    // Combine all data
    const stats = {
      users: userCounts.rows[0],
      trades: tradeStats.rows[0],
      disputes: disputeStats.rows[0],
      wallets: walletStats.rows[0],
      recent_trades: recentTrades.rows,
      recent_disputes: recentDisputes.rows
    };
    
    res.json(stats);
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
});

module.exports = router;