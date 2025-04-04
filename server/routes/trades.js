const express = require('express');
const router = express.Router();
const { db } = require('../data/inMemoryDb');

// Get all trades
router.get('/', (req, res) => {
  const trades = db.trades.map(trade => {
    // Add counterparty info if available
    let counterparty = null;
    if (trade.counterpartyId) {
      const user = db.users.find(u => u.id === trade.counterpartyId);
      if (user) {
        counterparty = {
          id: user.id,
          username: user.username,
          rating: user.rating
        };
      }
    }
    
    return {
      ...trade,
      counterparty
    };
  });
  
  res.json(trades);
});

// Get specific trade by ID
router.get('/:id', (req, res) => {
  const tradeId = parseInt(req.params.id);
  const trade = db.trades.find(t => t.id === tradeId);
  
  if (!trade) {
    return res.status(404).json({ message: 'Trade not found' });
  }
  
  // Add counterparty info if available
  let counterparty = null;
  if (trade.counterpartyId) {
    const user = db.users.find(u => u.id === trade.counterpartyId);
    if (user) {
      counterparty = {
        id: user.id,
        username: user.username,
        rating: user.rating
      };
    }
  }
  
  res.json({
    ...trade,
    counterparty
  });
});

// Create a new trade
router.post('/', (req, res) => {
  const { type, amount, currency, price = calculatePrice(currency) } = req.body;
  
  // Validate required fields
  if (!type || !amount || !currency) {
    return res.status(400).json({ message: 'Type, amount, and currency are required' });
  }
  
  // Create new trade
  const newTrade = {
    id: db.trades.length + 1,
    type,
    amount: parseFloat(amount),
    price,
    currency,
    status: 'open',
    createdAt: new Date().toISOString(),
    userId: 1, // In a real app, this would be the authenticated user's ID
    counterpartyId: 2, // This would be assigned when someone takes the trade
    paymentMethod: req.body.paymentMethod || 'Bank Transfer'
  };
  
  db.trades.push(newTrade);
  
  // Add counterparty info
  const counterparty = db.users.find(u => u.id === newTrade.counterpartyId);
  
  res.status(201).json({
    ...newTrade,
    counterparty: counterparty ? {
      id: counterparty.id,
      username: counterparty.username,
      rating: counterparty.rating
    } : null
  });
});

// Update trade status
router.put('/:id/status', (req, res) => {
  const tradeId = parseInt(req.params.id);
  const { status } = req.body;
  
  // Validate required fields
  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }
  
  // Find and update trade
  const tradeIndex = db.trades.findIndex(t => t.id === tradeId);
  
  if (tradeIndex === -1) {
    return res.status(404).json({ message: 'Trade not found' });
  }
  
  // Update status
  db.trades[tradeIndex].status = status;
  db.trades[tradeIndex].updatedAt = new Date().toISOString();
  
  // For completed trades, update user statistics
  if (status === 'completed') {
    // Find both users involved in the trade
    const seller = db.users.find(u => 
      u.id === (db.trades[tradeIndex].type === 'sell' ? 
                db.trades[tradeIndex].userId : 
                db.trades[tradeIndex].counterpartyId)
    );
    
    const buyer = db.users.find(u => 
      u.id === (db.trades[tradeIndex].type === 'buy' ? 
                db.trades[tradeIndex].userId : 
                db.trades[tradeIndex].counterpartyId)
    );
    
    // Update completed trades count
    if (seller) {
      const sellerIndex = db.users.findIndex(u => u.id === seller.id);
      if (sellerIndex !== -1) {
        db.users[sellerIndex].completedTrades = (db.users[sellerIndex].completedTrades || 0) + 1;
      }
    }
    
    if (buyer) {
      const buyerIndex = db.users.findIndex(u => u.id === buyer.id);
      if (buyerIndex !== -1) {
        db.users[buyerIndex].completedTrades = (db.users[buyerIndex].completedTrades || 0) + 1;
      }
    }
  }
  
  // Get updated trade with counterparty info
  const updatedTrade = db.trades[tradeIndex];
  let counterparty = null;
  
  if (updatedTrade.counterpartyId) {
    const user = db.users.find(u => u.id === updatedTrade.counterpartyId);
    if (user) {
      counterparty = {
        id: user.id,
        username: user.username,
        rating: user.rating
      };
    }
  }
  
  res.json({
    ...updatedTrade,
    counterparty
  });
});

// Get messages for a trade
router.get('/:id/messages', (req, res) => {
  const tradeId = parseInt(req.params.id);
  
  // Validate trade exists
  const trade = db.trades.find(t => t.id === tradeId);
  if (!trade) {
    return res.status(404).json({ message: 'Trade not found' });
  }
  
  // Get messages for this trade
  const messages = db.messages.filter(m => m.tradeId === tradeId);
  
  res.json(messages);
});

// Send a message in a trade
router.post('/:id/messages', (req, res) => {
  const tradeId = parseInt(req.params.id);
  const { text, senderId, receiverId } = req.body;
  
  // Validate required fields
  if (!text || !senderId || !receiverId) {
    return res.status(400).json({ message: 'Text, senderId, and receiverId are required' });
  }
  
  // Validate trade exists
  const trade = db.trades.find(t => t.id === tradeId);
  if (!trade) {
    return res.status(404).json({ message: 'Trade not found' });
  }
  
  // Create new message
  const newMessage = {
    id: db.messages.length + 1,
    tradeId,
    senderId,
    receiverId,
    text,
    timestamp: new Date().toISOString(),
    isRead: false
  };
  
  db.messages.push(newMessage);
  
  res.status(201).json(newMessage);
});

// Create a dispute for a trade
router.post('/:id/disputes', (req, res) => {
  const tradeId = parseInt(req.params.id);
  const { reason, description, evidence } = req.body;
  
  // Validate required fields
  if (!reason || !description) {
    return res.status(400).json({ message: 'Reason and description are required' });
  }
  
  // Validate trade exists
  const trade = db.trades.find(t => t.id === tradeId);
  if (!trade) {
    return res.status(404).json({ message: 'Trade not found' });
  }
  
  // Update trade status to disputed
  const tradeIndex = db.trades.findIndex(t => t.id === tradeId);
  db.trades[tradeIndex].status = 'disputed';
  db.trades[tradeIndex].updatedAt = new Date().toISOString();
  
  // Create new dispute
  const newDispute = {
    id: db.disputes.length + 1,
    tradeId,
    tradeAmount: trade.amount,
    tradeCurrency: trade.currency,
    reason,
    description,
    evidence: evidence || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
    userId: 1, // In a real app, this would be the authenticated user's ID
    adminNotes: []
  };
  
  db.disputes.push(newDispute);
  
  res.status(201).json(newDispute);
});

// Helper function to calculate price based on currency
function calculatePrice(currency) {
  switch(currency) {
    case 'BTC':
      return 40000 + Math.random() * 2000;
    case 'ETH':
      return 2800 + Math.random() * 200;
    case 'USDT':
      return 1;
    case 'USD':
      return 1;
    default:
      return 1;
  }
}

module.exports = router;
