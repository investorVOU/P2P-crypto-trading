const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const tradeRoutes = require('./routes/trades');
const userRoutes = require('./routes/users');
const walletRoutes = require('./routes/wallet');
const adminRoutes = require('./routes/admin');
const { initializeDatabase } = require('./data/inMemoryDb');

const app = express();
const PORT = process.env.PORT || 8000;

// Initialize in-memory database with sample data
initializeDatabase();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use('/api/trades', tradeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'An unexpected error occurred',
      status: err.status || 500
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'P2P Trading Platform API',
    version: '1.0.0'
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;
