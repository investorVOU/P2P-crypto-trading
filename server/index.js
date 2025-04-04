const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { setupAuth } = require('./auth');
const tradeRoutes = require('./routes/trades');
const userRoutes = require('./routes/users');
const walletRoutes = require('./routes/wallet');
const adminRoutes = require('./routes/admin');
const { exec } = require('child_process');

// Import database connection
require('./db');

// Initialize database if needed
const initializeDatabase = async () => {
  return new Promise((resolve, reject) => {
    console.log('Checking if database needs to be initialized...');
    exec('node migrate-tables.js', (error, stdout, stderr) => {
      if (error) {
        console.error('Error initializing database:', error);
        console.error(stderr);
        reject(error);
        return;
      }
      console.log(stdout);
      
      // Seed database with sample data if in development mode
      if (process.env.NODE_ENV !== 'production') {
        console.log('Development mode detected, seeding database with sample data...');
        exec('node seed-data.js', (seedError, seedStdout, seedStderr) => {
          if (seedError) {
            console.error('Error seeding database:', seedError);
            console.error(seedStderr);
            // Don't reject here, as the tables were created successfully
            console.log('Continuing without sample data...');
          } else {
            console.log(seedStdout);
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
};

const app = express();
const PORT = process.env.PORT || 8000;

// Generate a session secret if not provided
if (!process.env.SESSION_SECRET) {
  process.env.SESSION_SECRET = 'p2p-trading-platform-dev-secret';
  console.warn('Warning: Using default session secret. Set SESSION_SECRET environment variable for production.');
}

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://yourapp.replit.app' : true,
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Setup authentication
const { isAuthenticated, isAdmin } = setupAuth(app);

// Define the registration, login and user routes directly
// API Routes with authentication middleware
app.use('/api/trades', isAuthenticated, tradeRoutes);
app.use('/api/users', userRoutes); // Some endpoints public, auth checked inside
app.use('/api/wallet', isAuthenticated, walletRoutes);
app.use('/api/admin', isAuthenticated, isAdmin, adminRoutes);

// Serve static assets
app.use(express.static(path.join(__dirname, '../client/dist')));

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

// Root route - serve HTML
app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, '..', 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({
      message: 'P2P Trading Platform API',
      version: '1.0.0'
    });
  }
});

// API documentation route
app.get('/api', (req, res) => {
  const apiDocPath = path.join(__dirname, '..', 'public', 'api.html');
  if (fs.existsSync(apiDocPath)) {
    res.sendFile(apiDocPath);
  } else {
    res.json({
      message: 'P2P Trading Platform API Documentation',
      version: '1.0.0',
      endpoints: [
        // Authentication endpoints
        { method: 'POST', path: '/api/register', description: 'Register a new user account' },
        { method: 'POST', path: '/api/login', description: 'Log in to an existing account' },
        { method: 'POST', path: '/api/logout', description: 'Log out the current user' },
        { method: 'GET', path: '/api/user', description: 'Get the current logged-in user data' },
        
        // Trade endpoints (require authentication)
        { method: 'GET', path: '/api/trades', description: 'Get all trades (authenticated)' },
        { method: 'GET', path: '/api/trades/:id', description: 'Get a specific trade (authenticated)' },
        { method: 'POST', path: '/api/trades', description: 'Create a new trade (authenticated)' },
        { method: 'PUT', path: '/api/trades/:id/status', description: 'Update trade status (authenticated)' },
        
        // Wallet endpoints (require authentication)
        { method: 'GET', path: '/api/wallet/balances', description: 'Get wallet balances (authenticated)' },
        { method: 'GET', path: '/api/wallet/transactions', description: 'Get wallet transactions (authenticated)' },
        
        // Admin endpoints (require admin authentication)
        { method: 'GET', path: '/api/admin/users', description: 'Get all users (admin only)' },
        { method: 'GET', path: '/api/admin/disputes', description: 'Get all disputes (admin only)' },
        { method: 'PUT', path: '/api/admin/disputes/:id/resolve', description: 'Resolve a dispute (admin only)' }
      ]
    });
  }
});

// Initialize database and start server
(async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();

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
