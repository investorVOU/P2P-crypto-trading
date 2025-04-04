const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const connectPg = require('connect-pg-simple');
const { scrypt, randomBytes, timingSafeEqual } = require('crypto');
const { promisify } = require('util');
const { storage } = require('./storage');
const { Pool } = require('pg');

const scryptAsync = promisify(scrypt);
const SESSION_SECRET = process.env.SESSION_SECRET || 'p2p-trading-platform-secret';

// Password hashing logic
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

// Setup auth middleware
function setupAuth(app) {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const pgStore = connectPg(session);
  
  const sessionOptions = {
    store: new pgStore({
      pool,
      createTableIfMissing: true,
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === 'production',
    }
  };

  app.use(session(sessionOptions));
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport to use local strategy
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      
      // For now we'll assume we store the password directly in the database
      // In production, we would store the hashed password and compare it
      const passwordMatch = await comparePasswords(password, user.password);
      
      if (!passwordMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // Serialize/deserialize user
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Authentication routes
  app.post('/api/register', async (req, res) => {
    try {
      const { username, email, full_name, password } = req.body;
      
      // Check if username or email already exists
      const existingUserByUsername = await storage.getUserByUsername(username);
      if (existingUserByUsername) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      
      // In a real app we would also check for existing email
      
      // Hash the password before storing it
      const hashedPassword = await hashPassword(password);
      
      // Create the new user
      const user = await storage.createUser({
        username,
        email,
        fullName: full_name,
        password: hashedPassword,
        verified: false,
        isAdmin: false
      });
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      // Log the user in
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to login after registration' });
        }
        
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({ error: info.message || 'Authentication failed' });
      }
      
      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post('/api/logout', (req, res) => {
    req.logout(function(err) {
      if (err) {
        return res.status(500).json({ error: 'Logout failed' });
      }
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/user', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });

  // Middleware to check if user is authenticated
  function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ error: 'Authentication required' });
  }

  // Middleware to check if user is admin
  function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
      return next();
    }
    res.status(403).json({ error: 'Admin access required' });
  }

  return {
    isAuthenticated,
    isAdmin
  };
}

module.exports = { setupAuth, hashPassword, comparePasswords };