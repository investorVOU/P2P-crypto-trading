const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const connectPg = require('connect-pg-simple');
const { scrypt, randomBytes, timingSafeEqual } = require('crypto');
const { promisify } = require('util');
const { pool } = require('./db');
const { storage } = require('./storage.cjs');
const { generateWalletNonce, verifyWalletSignature } = require('./walletAuth');

const PostgresSessionStore = connectPg(session);
const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}

async function comparePasswords(supplied, stored) {
  const [hashed, salt] = stored.split('.');
  const hashedBuf = Buffer.from(hashed, 'hex');
  const suppliedBuf = await scryptAsync(supplied, salt, 64);
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

function setupAuth(app) {
  // Initialize session store if not already done
  if (!storage.sessionStore) {
    storage.sessionStore = new PostgresSessionStore({
      pool,
      tableName: 'session'
    });
  }

  // Session configuration
  app.use(session({
    store: storage.sessionStore,
    secret: process.env.SESSION_SECRET || 'development-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
    }
  }));

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure local strategy
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return done(null, false, { message: 'Incorrect username or password' });
      }
      
      // Compare password
      const isValid = await comparePasswords(password, user.password);
      if (!isValid) {
        return done(null, false, { message: 'Incorrect username or password' });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  // Serialize/deserialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      
      // Omit password from user object for security
      const userWithoutPassword = { ...user };
      delete userWithoutPassword.password;
      
      done(null, userWithoutPassword);
    } catch (err) {
      done(err);
    }
  });

  // Set up auth routes
  app.post('/api/register', async (req, res, next) => {
    try {
      const { username, email, password, fullName } = req.body;
      
      // Check if username or email already exists
      const existingUserByUsername = await storage.getUserByUsername(username);
      
      if (existingUserByUsername) {
        return res.status(400).json({ message: 'Username already in use' });
      }
      
      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      
      const newUser = await storage.createUser({
        username,
        email,
        password: hashedPassword,
        fullName
      });
      
      // Clone user object without password for security
      const userToReturn = { ...newUser };
      delete userToReturn.password;
      
      // Log in the new user
      req.login(newUser, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(201).json(userToReturn);
      });
    } catch (err) {
      console.error('Registration error:', err);
      
      // Check for uniqueness violation (PostgreSQL error code 23505)
      if (err.code === '23505') {
        if (err.constraint === 'users_email_key') {
          return res.status(400).json({ message: 'Email already in use' });
        }
        return res.status(400).json({ message: 'Username or email already in use' });
      }
      
      next(err);
    }
  });

  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message || 'Authentication failed' });
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        
        // Omit password from response
        delete user.password;
        return res.json(user);
      });
    })(req, res, next);
  });

  app.post('/api/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: 'Logout failed' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
      return res.json(req.user);
    }
    res.status(401).json({ message: 'Not authenticated' });
  });
  
  // Wallet authentication endpoints
  app.get('/api/wallet/nonce/:address', async (req, res) => {
    try {
      const { address } = req.params;
      if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
        return res.status(400).json({ message: 'Invalid wallet address format' });
      }
      
      const nonce = await generateWalletNonce(address);
      res.json({ nonce });
    } catch (err) {
      console.error('Error generating nonce:', err);
      res.status(500).json({ message: 'Failed to generate nonce' });
    }
  });
  
  app.post('/api/wallet/auth', async (req, res, next) => {
    try {
      const { address, signature } = req.body;
      
      if (!address || !signature) {
        return res.status(400).json({ message: 'Address and signature required' });
      }
      
      const verified = await verifyWalletSignature(address, signature);
      if (!verified) {
        return res.status(401).json({ message: 'Invalid signature' });
      }
      
      // Check if user exists with this wallet address
      let user = await storage.getUserByWalletAddress(address.toLowerCase());
      
      if (!user) {
        // Create a new user with wallet address
        const username = `wallet_${address.substring(2, 8)}`;
        const email = `${username}@example.com`;
        const password = await hashPassword(randomBytes(32).toString('hex'));
        
        user = await storage.createUser({
          username,
          email,
          password,
          walletAddress: address.toLowerCase()
        });
      }
      
      // Clone user object without password for security
      const userToReturn = { ...user };
      delete userToReturn.password;
      
      // Log in the user
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(200).json(userToReturn);
      });
    } catch (err) {
      console.error('Wallet auth error:', err);
      next(err);
    }
  });

  // Middleware for route protection
  function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Authentication required' });
  }

  function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.is_admin) {
      return next();
    }
    res.status(403).json({ message: 'Admin access required' });
  }

  return { isAuthenticated, isAdmin };
}

module.exports = {
  setupAuth,
  hashPassword,
  comparePasswords
};