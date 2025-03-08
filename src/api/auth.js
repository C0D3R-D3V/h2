const express = require('express');
const { registerUser, loginUser, verifySession, logoutUser } = require('../db/auth');
const router = express.Router();

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { username, email, mobile, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password are required' });
    }

    // At least one contact method is required
    if (!email && !mobile) {
      return res.status(400).json({ success: false, error: 'Email or mobile number is required' });
    }

    // Password strength check
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }

    // Register user
    const result = await registerUser(username, email, mobile, password);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, error: 'Login ID and password are required' });
    }

    const result = await loginUser(identifier, password);

    if (!result.success) {
      return res.status(401).json(result);
    }

    // Set session token in cookie
    res.cookie('authToken', result.session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'strict'
    });

    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(401).json({ success: false, error: 'Not authenticated' });
    }

    const result = await verifySession(token);

    if (!result.success) {
      return res.status(401).json(result);
    }

    res.json({
      success: true,
      user: {
        id: result.session.user_id,
        username: result.session.username,
        email: result.session.email,
        mobile: result.session.mobile
      }
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ success: false, error: 'Authentication failed' });
  }
});

// Logout endpoint
router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      return res.json({ success: true, message: 'Already logged out' });
    }

    await logoutUser(token);

    // Clear the cookie
    res.clearCookie('authToken');

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ success: false, error: 'Logout failed' });
  }
});

module.exports = router;