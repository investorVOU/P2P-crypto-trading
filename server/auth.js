const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const connectPg = require('connect-pg-simple');
const { scrypt, randomBytes, timingSafeEqual } = require('crypto');
const { promisify } = require('util');
const { query, pool } = require('./db');

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
  // Session configuration
  app.use(session({
    store: new PostgresSessionStore({
      pool,
      tableName: 'session'
    }),
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
      const result = await query('SELECT * FROM users WHERE username = $1', [username]);
      const user = result.rows[0];
      
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
      const result = await query('SELECT * FROM users WHERE id = $1', [id]);
      const user = result.rows[0];
      if (!user) {
        return done(null, false);
      }
      
      // Omit password from user object
      delete user.password;
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Set up auth routes
  app.post('/api/register', async (req, res, next) => {
    try {
      const { username, email, password, fullName } = req.body;
      
      // Check if username already exists
      const existingUser = await query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: 'Username or email already in use' });
      }
      
      // Hash password and create user
      const hashedPassword = await hashPassword(password);
      const result = await query(
        'INSERT INTO users (username, email, password, full_name) VALUES ($1, $2, $3, $4) RETURNING id, username, email, full_name, is_admin, created_at',
        [username, email, hashedPassword, fullName]
      );
      
      const newUser = result.rows[0];
      
      // Log in the new user
      req.login(newUser, (err) => {
        if (err) {
          return next(err);
        }
        return res.status(201).json(newUser);
      });
    } catch (err) {
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