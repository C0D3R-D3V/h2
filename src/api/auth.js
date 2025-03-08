
// Auth API client for frontend

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} [userData.email] - User's email (required if mobile not provided)
 * @param {string} [userData.mobile] - User's mobile number (required if email not provided)
 * @param {string} userData.password - User's password
 * @returns {Promise<Object>} Registration response
 */
export const register = async (userData) => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Login a user with email or mobile
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.identifier - Email or mobile number
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} Login response
 */
export const login = async (credentials) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify(credentials),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout the current user
 * @returns {Promise<Object>} Logout response
 */
export const logout = async () => {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include', // Important for cookies
    });
    
    return await response.json();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Get the current logged-in user
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await fetch('/api/user', {
      method: 'GET',
      credentials: 'include', // Important for cookies
    });
    
    return await response.json();
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const router = express.Router();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    
    // Validate input
    if ((!email && !mobile) || !password || !name) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide name, password, and either email or mobile' 
      });
    }
    
    // Check if user already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1 OR mobile = $2',
      [email || null, mobile || null]
    );
    
    if (userExists.rows.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists with this email or mobile' 
      });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = await pool.query(
      'INSERT INTO users (name, email, mobile, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email, mobile',
      [name, email || null, mobile || null, hashedPassword]
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.rows[0].id },
      process.env.JWT_SECRET || 'your-default-secret',
      { expiresIn: '24h' }
    );
    
    // Set cookie with token
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    // Return user info
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.rows[0].id,
        name: newUser.rows[0].name,
        email: newUser.rows[0].email,
        mobile: newUser.rows[0].mobile
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    // Validate input
    if (!identifier || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide email/mobile and password' 
      });
    }
    
    // Check if identifier is email or mobile
    const isEmail = identifier.includes('@');
    
    // Find the user
    const user = await pool.query(
      isEmail 
        ? 'SELECT * FROM users WHERE email = $1 AND is_active = TRUE'
        : 'SELECT * FROM users WHERE mobile = $1 AND is_active = TRUE',
      [identifier]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    // Update last login time
    await pool.query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.rows[0].id]
    );
    
    // Create session
    const sessionToken = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET || 'your-default-secret',
      { expiresIn: '24h' }
    );
    
    // Store session in database
    await pool.query(
      'INSERT INTO sessions (user_id, session_token, expires_at) VALUES ($1, $2, NOW() + INTERVAL \'24 hours\')',
      [user.rows[0].id, sessionToken]
    );
    
    // Set token in cookie
    res.cookie('auth_token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    // Return user info (without password)
    const { password: _, ...userWithoutPassword } = user.rows[0];
    
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token: sessionToken
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Logout user
router.post('/logout', async (req, res) => {
  try {
    // Get token from cookie
    const token = req.cookies.auth_token;
    
    if (token) {
      // Remove session from database
      await pool.query(
        'DELETE FROM sessions WHERE session_token = $1',
        [token]
      );
      
      // Clear cookie
      res.clearCookie('auth_token');
    }
    
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    // Get token from cookie or authorization header
    const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret');
    
    // Get user from database
    const user = await pool.query(
      'SELECT id, name, email, mobile, created_at, last_login FROM users WHERE id = $1',
      [decoded.id]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      user: user.rows[0]
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

module.exports = router;
