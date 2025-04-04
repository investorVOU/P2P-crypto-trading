const express = require('express');
const router = express.Router();
const { db } = require('../data/inMemoryDb');

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  // In a real app, we would validate credentials against a database
  // For this demo, we'll just check if the email matches any user
  const user = db.users.find(u => u.email === email);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Generate a mock JWT token
  // In a real app, this would be a proper JWT
  const token = 'mock_token_' + Math.random().toString(36).substring(2);
  
  res.json({
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin || false
    },
    token
  });
});

// Register new user
router.post('/register', (req, res) => {
  const { username, email, password, fullName } = req.body;
  
  // Validate required fields
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }
  
  // Check if user with same email or username already exists
  const existingUser = db.users.find(u => u.email === email || u.username === username);
  
  if (existingUser) {
    return res.status(409).json({ message: 'User with this email or username already exists' });
  }
  
  // Create new user
  const newUser = {
    id: db.users.length + 1,
    username,
    email,
    fullName: fullName || username,
    verified: false,
    completedTrades: 0,
    successRate: 100,
    responseTime: 0,
    rating: 0,
    isAdmin: false,
    createdAt: new Date().toISOString()
  };
  
  db.users.push(newUser);
  
  // Generate a mock JWT token
  const token = 'mock_token_' + Math.random().toString(36).substring(2);
  
  res.status(201).json({
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      isAdmin: newUser.isAdmin
    },
    token
  });
});

// Get user profile
router.get('/:id/profile', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = db.users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Don't send sensitive information
  const { password, ...profile } = user;
  
  res.json(profile);
});

// Update user profile
router.put('/:id/profile', (req, res) => {
  const userId = parseInt(req.params.id);
  const updateData = req.body;
  
  // Find user
  const userIndex = db.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Fields that cannot be updated directly
  const protectedFields = ['id', 'password', 'email', 'isAdmin', 'createdAt'];
  
  // Update user data
  Object.keys(updateData).forEach(key => {
    if (!protectedFields.includes(key)) {
      db.users[userIndex][key] = updateData[key];
    }
  });
  
  // Update timestamp
  db.users[userIndex].updatedAt = new Date().toISOString();
  
  // Don't send sensitive information
  const { password, ...updatedProfile } = db.users[userIndex];
  
  res.json(updatedProfile);
});

// Rate a user after trade
router.post('/:id/rate', (req, res) => {
  const userId = parseInt(req.params.id);
  const { tradeId, rating, comment } = req.body;
  
  // Validate required fields
  if (!tradeId || !rating) {
    return res.status(400).json({ message: 'TradeId and rating are required' });
  }
  
  // Validate rating range
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }
  
  // Find user
  const userIndex = db.users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Validate trade exists and is completed
  const trade = db.trades.find(t => t.id === parseInt(tradeId) && t.status === 'completed');
  
  if (!trade) {
    return res.status(400).json({ message: 'Trade not found or not completed' });
  }
  
  // Create new rating
  const newRating = {
    id: db.ratings.length + 1,
    userId,
    tradeId: parseInt(tradeId),
    rating,
    comment: comment || '',
    createdAt: new Date().toISOString(),
    ratedBy: 1 // In a real app, this would be the authenticated user's ID
  };
  
  db.ratings.push(newRating);
  
  // Update user's average rating
  const userRatings = db.ratings.filter(r => r.userId === userId);
  const averageRating = userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;
  
  db.users[userIndex].rating = parseFloat(averageRating.toFixed(1));
  
  res.status(201).json({
    message: 'Rating submitted successfully',
    rating: newRating,
    newAverageRating: db.users[userIndex].rating
  });
});

module.exports = router;
