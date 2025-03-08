
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
const auth = require('../db/auth');
const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { name, email, mobile, password, confirmPassword } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }
    
    // Register user
    const user = await auth.registerUser({ name, email, mobile, password });
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Check for duplicate key violation
    if (error.code === '23505') { // PostgreSQL unique constraint violation
      if (error.detail.includes('email')) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
      } else if (error.detail.includes('mobile')) {
        return res.status(400).json({ success: false, message: 'Mobile number already in use' });
      }
    }
    
    res.status(500).json({ success: false, message: 'Error registering user' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Email/mobile and password are required' });
    }
    
    const result = await auth.loginUser(identifier, password);
    
    if (!result.success) {
      return res.status(401).json({ success: false, message: result.message });
    }
    
    // Set session cookie
    res.cookie('session_token', result.sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({
      success: true,
      message: 'Login successful',
      user: result.user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Error logging in' });
  }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
  try {
    const sessionToken = req.cookies.session_token;
    
    if (sessionToken) {
      await auth.logoutUser(sessionToken);
      res.clearCookie('session_token');
    }
    
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, message: 'Error logging out' });
  }
});

// Get current user endpoint
router.get('/me', async (req, res) => {
  try {
    const sessionToken = req.cookies.session_token;
    
    if (!sessionToken) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    
    const user = await auth.verifySession(sessionToken);
    
    if (!user) {
      res.clearCookie('session_token');
      return res.status(401).json({ success: false, message: 'Invalid or expired session' });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ success: false, message: 'Error getting user info' });
  }
});

module.exports = router;
