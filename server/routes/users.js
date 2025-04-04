const express = require('express');
const router = express.Router();
const { query } = require('../db');

// Helper function to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Authentication required' });
}

// Helper function to check if user is admin
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.is_admin) {
    return next();
  }
  res.status(403).json({ message: 'Admin access required' });
}

// Get current user's profile
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    // Get user stats
    const userStats = await query(`
      SELECT 
        u.*,
        COUNT(DISTINCT t.id) as total_trades,
        COUNT(DISTINCT CASE WHEN t.status = 'completed' THEN t.id END) as completed_trades,
        COUNT(DISTINCT CASE WHEN t.status = 'active' THEN t.id END) as active_trades,
        COUNT(DISTINCT CASE WHEN t.status = 'pending' THEN t.id END) as pending_trades,
        COUNT(DISTINCT CASE WHEN t.status = 'disputed' THEN t.id END) as disputed_trades,
        AVG(r.rating) as avg_rating
      FROM 
        users u
      LEFT JOIN 
        trades t ON u.id = t.user_id OR u.id = t.counterparty_id
      LEFT JOIN 
        ratings r ON u.id = r.rated_id
      WHERE 
        u.id = $1
      GROUP BY 
        u.id
    `, [req.user.id]);
    
    // Get wallet balances
    const walletBalances = await query(`
      SELECT * FROM wallet_balances WHERE user_id = $1
    `, [req.user.id]);
    
    // Get recent trades
    const recentTrades = await query(`
      SELECT * FROM trades
      WHERE user_id = $1 OR counterparty_id = $1
      ORDER BY created_at DESC
      LIMIT 5
    `, [req.user.id]);
    
    // Get recent ratings
    const recentRatings = await query(`
      SELECT r.*, u.username as rater_username
      FROM ratings r
      JOIN users u ON r.rater_id = u.id
      WHERE r.rated_id = $1
      ORDER BY r.created_at DESC
      LIMIT 5
    `, [req.user.id]);
    
    // Combine all data
    const profile = {
      ...userStats.rows[0],
      wallet_balances: walletBalances.rows,
      recent_trades: recentTrades.rows,
      recent_ratings: recentRatings.rows
    };
    
    // Remove sensitive data
    delete profile.password;
    
    res.json(profile);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

// Get user by ID (public profile)
router.get('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Get basic user info and stats
    const userInfo = await query(`
      SELECT 
        id, username, full_name, verified, completed_trades, success_rate, 
        response_time, rating, created_at
      FROM 
        users 
      WHERE 
        id = $1
    `, [userId]);
    
    if (userInfo.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get user's ratings
    const ratings = await query(`
      SELECT r.*, u.username as rater_username
      FROM ratings r
      JOIN users u ON r.rater_id = u.id
      WHERE r.rated_id = $1
      ORDER BY r.created_at DESC
      LIMIT 10
    `, [userId]);
    
    // Combine data
    const profile = {
      ...userInfo.rows[0],
      ratings: ratings.rows
    };
    
    res.json(profile);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});

// Update user profile
router.put('/profile', isAuthenticated, async (req, res) => {
  try {
    const { fullName } = req.body;
    const userId = req.user.id;
    
    // Update user
    const result = await query(
      'UPDATE users SET full_name = $1 WHERE id = $2 RETURNING id, username, email, full_name, verified, completed_trades, success_rate, response_time, rating, created_at',
      [fullName, userId]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Get all users (admin only)
router.get('/', isAdmin, async (req, res) => {
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

// Get admin stats/dashboard
router.get('/admin/stats', isAdmin, async (req, res) => {
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
    
    // Get recent trades
    const recentTrades = await query(`
      SELECT t.*, u1.username as creator_username, u2.username as counterparty_username
      FROM trades t
      LEFT JOIN users u1 ON t.user_id = u1.id
      LEFT JOIN users u2 ON t.counterparty_id = u2.id
      ORDER BY t.created_at DESC
      LIMIT 10
    `);
    
    // Get recent disputes
    const recentDisputes = await query(`
      SELECT d.*, t.amount as trade_amount, t.currency as trade_currency, 
             u.username as user_username
      FROM disputes d
      JOIN trades t ON d.trade_id = t.id
      JOIN users u ON d.user_id = u.id
      ORDER BY d.created_at DESC
      LIMIT 10
    `);
    
    // Combine all data
    const stats = {
      users: userCounts.rows[0],
      trades: tradeStats.rows[0],
      disputes: disputeStats.rows[0],
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