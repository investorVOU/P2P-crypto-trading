const express = require('express');
const router = express.Router();
const { db } = require('../data/inMemoryDb');

// Get admin statistics
router.get('/stats', (req, res) => {
  // In a real app, we would verify that the user is an admin
  
  // Calculate statistics
  const activeTrades = db.trades.filter(t => 
    t.status === 'open' || t.status === 'in_escrow'
  ).length;
  
  const completedTrades = db.trades.filter(t => t.status === 'completed').length;
  
  const disputedTrades = db.trades.filter(t => t.status === 'disputed').length;
  
  const activeUsers = db.users.length;
  
  // Calculate total volume (USD) of completed trades
  const totalVolume = db.trades
    .filter(t => t.status === 'completed')
    .reduce((sum, trade) => {
      const usdValue = calculateUsdValue(trade.amount, trade.currency);
      return sum + usdValue;
    }, 0);
  
  // Mock user growth percentage
  const userGrowth = 12;
  
  res.json({
    activeTrades,
    completedTrades,
    disputedTrades,
    activeUsers,
    totalVolume,
    userGrowth
  });
});

// Get all trades (admin view)
router.get('/trades', (req, res) => {
  // In a real app, we would verify that the user is an admin
  
  // Format trades with user information
  const formattedTrades = db.trades.map(trade => {
    const user = db.users.find(u => u.id === trade.userId);
    const counterparty = db.users.find(u => u.id === trade.counterpartyId);
    
    return {
      ...trade,
      user: user ? {
        id: user.id,
        username: user.username
      } : null,
      counterparty: counterparty ? {
        id: counterparty.id,
        username: counterparty.username
      } : null
    };
  });
  
  res.json(formattedTrades);
});

// Get all disputes (admin view)
router.get('/disputes', (req, res) => {
  // In a real app, we would verify that the user is an admin
  
  // Format disputes with user information
  const formattedDisputes = db.disputes.map(dispute => {
    const user = db.users.find(u => u.id === dispute.userId);
    
    return {
      ...dispute,
      user: user ? {
        id: user.id,
        username: user.username
      } : null
    };
  });
  
  res.json(formattedDisputes);
});

// Resolve a dispute
router.put('/disputes/:id/resolve', (req, res) => {
  const disputeId = parseInt(req.params.id);
  const { resolution, notes } = req.body;
  
  // Validate required fields
  if (!resolution) {
    return res.status(400).json({ message: 'Resolution is required' });
  }
  
  // Find dispute
  const disputeIndex = db.disputes.findIndex(d => d.id === disputeId);
  
  if (disputeIndex === -1) {
    return res.status(404).json({ message: 'Dispute not found' });
  }
  
  // Update dispute status
  db.disputes[disputeIndex].status = 'resolved';
  db.disputes[disputeIndex].resolution = resolution;
  db.disputes[disputeIndex].resolvedAt = new Date().toISOString();
  
  // Add admin notes if provided
  if (notes) {
    db.disputes[disputeIndex].adminNotes.push({
      text: notes,
      timestamp: new Date().toISOString(),
      adminId: 1 // In a real app, this would be the admin's ID
    });
  }
  
  // Find the associated trade
  const tradeId = db.disputes[disputeIndex].tradeId;
  const tradeIndex = db.trades.findIndex(t => t.id === tradeId);
  
  if (tradeIndex !== -1) {
    // Update trade status based on resolution
    if (resolution === 'cancelled') {
      db.trades[tradeIndex].status = 'cancelled';
    } else {
      db.trades[tradeIndex].status = 'completed';
    }
    
    db.trades[tradeIndex].updatedAt = new Date().toISOString();
  }
  
  // Get user information for response
  const user = db.users.find(u => u.id === db.disputes[disputeIndex].userId);
  
  res.json({
    ...db.disputes[disputeIndex],
    user: user ? {
      id: user.id,
      username: user.username
    } : null
  });
});

// Get all users (admin view)
router.get('/users', (req, res) => {
  // In a real app, we would verify that the user is an admin
  
  // Format users (remove sensitive information)
  const formattedUsers = db.users.map(({ password, ...user }) => user);
  
  res.json(formattedUsers);
});

// Update user (admin only)
router.put('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const updateData = req.body;
  
  // Find user
  const userIndex = db.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Update user data
  Object.keys(updateData).forEach(key => {
    db.users[userIndex][key] = updateData[key];
  });
  
  // Update timestamp
  db.users[userIndex].updatedAt = new Date().toISOString();
  
  // Don't send sensitive information
  const { password, ...updatedUser } = db.users[userIndex];
  
  res.json(updatedUser);
});

// Helper function to calculate USD value based on currency
function calculateUsdValue(amount, currency) {
  switch(currency) {
    case 'BTC':
      return amount * 40000; // Example BTC price
    case 'ETH':
      return amount * 2800; // Example ETH price
    case 'USDT':
      return amount; // USDT is pegged to USD
    case 'USD':
      return amount;
    default:
      return amount;
  }
}

module.exports = router;
