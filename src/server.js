
const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(bodyParser.json());
app.use(cookieParser());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Validate input functions
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validateMobile = (mobile) => {
  const re = /^\d{10}$/;
  return re.test(mobile);
};

// Check if email or mobile already exists
const checkExists = async (email, mobile) => {
  const query = `
    SELECT id FROM users 
    WHERE email = $1 OR mobile = $2
  `;
  
  try {
    const result = await pool.query(query, [email, mobile]);
    return result.rows.length > 0;
  } catch (error) {
    throw error;
  }
};

// Register route
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    
    // Input validation
    if (!name || (!email && !mobile) || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide all required fields' 
      });
    }
    
    // Validate email format if provided
    if (email && !validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    // Validate mobile number format if provided
    if (mobile && !validateMobile(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid mobile number format'
      });
    }
    
    // Check if user already exists
    const userExists = await checkExists(email || null, mobile || null);
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: 'User with this email or mobile already exists'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Insert user into database
    const insertQuery = `
      INSERT INTO users (name, email, mobile, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, mobile, created_at
    `;
    
    const result = await pool.query(insertQuery, [
      name, 
      email || null, 
      mobile || null, 
      hashedPassword
    ]);
    
    const user = result.rows[0];
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        created_at: user.created_at
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide login credentials'
      });
    }
    
    // Determine if identifier is email or mobile
    const isEmail = identifier.includes('@');
    const identifierType = isEmail ? 'email' : 'mobile';
    
    // Query to find the user
    const query = `
      SELECT id, name, email, mobile, password, is_active
      FROM users 
      WHERE ${identifierType} = $1
    `;
    
    const result = await pool.query(query, [identifier]);
    
    // If no user found
    if (result.rows.length === 0) {
      // Record failed login attempt
      await pool.query(
        `INSERT INTO login_attempts (${identifierType}, ip_address, success) VALUES ($1, $2, FALSE)`,
        [identifier, ipAddress]
      );
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    const user = result.rows[0];
    
    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Please contact support.'
      });
    }
    
    // Check for too many failed login attempts
    const failedAttemptsQuery = `
      SELECT COUNT(*) FROM login_attempts 
      WHERE (email = $1 OR mobile = $2) 
      AND attempt_time > (NOW() - INTERVAL '30 minutes') 
      AND success = FALSE
    `;
    
    const failedAttemptsResult = await pool.query(failedAttemptsQuery, [
      user.email || '',
      user.mobile || ''
    ]);
    
    const failedAttempts = parseInt(failedAttemptsResult.rows[0].count);
    
    if (failedAttempts >= 5) {
      return res.status(429).json({
        success: false,
        message: 'Too many failed login attempts. Please try again later.'
      });
    }
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      // Record failed login attempt
      await pool.query(
        `INSERT INTO login_attempts (${identifierType}, ip_address, success) VALUES ($1, $2, FALSE)`,
        [identifier, ipAddress]
      );
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Create session token
    const sessionToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 1); // 24 hours from now
    
    // Save session to database
    await pool.query(
      `INSERT INTO sessions (user_id, session_token, expires_at) VALUES ($1, $2, $3)`,
      [user.id, sessionToken, expiresAt]
    );
    
    // Update last login time
    await pool.query(
      `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1`,
      [user.id]
    );
    
    // Record successful login attempt
    await pool.query(
      `INSERT INTO login_attempts (${identifierType}, ip_address, success) VALUES ($1, $2, TRUE)`,
      [identifier, ipAddress]
    );
    
    // Set session cookie
    res.cookie('session_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict'
    });
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Logout route
app.post('/api/logout', async (req, res) => {
  try {
    const { session_token } = req.cookies;
    
    if (!session_token) {
      return res.status(400).json({
        success: false,
        message: 'No active session'
      });
    }
    
    // Delete session from database
    await pool.query(
      `DELETE FROM sessions WHERE session_token = $1`,
      [session_token]
    );
    
    // Clear session cookie
    res.clearCookie('session_token');
    
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

// Get current user route
app.get('/api/user', async (req, res) => {
  try {
    const { session_token } = req.cookies;
    
    if (!session_token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
    
    // Check if session is valid
    const query = `
      SELECT u.id, u.name, u.email, u.mobile 
      FROM sessions s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.session_token = $1 AND s.expires_at > CURRENT_TIMESTAMP
    `;
    
    const result = await pool.query(query, [session_token]);
    
    if (result.rows.length === 0) {
      res.clearCookie('session_token');
      return res.status(401).json({
        success: false,
        message: 'Session expired'
      });
    }
    
    const user = result.rows[0];
    
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile
      }
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
