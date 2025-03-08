
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Authentication middleware
const auth = async (req, res, next) => {
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
    
    // Add user object to request
    req.user = result.rows[0];
    next();
    
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

module.exports = auth;
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const auth = async (req, res, next) => {
  try {
    // Get token from cookie or authorization header
    const token = req.cookies.auth_token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret');
    
    // Check if session exists and is valid
    const session = await pool.query(
      'SELECT * FROM sessions WHERE user_id = $1 AND session_token = $2 AND expires_at > CURRENT_TIMESTAMP',
      [decoded.id, token]
    );
    
    if (session.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or expired'
      });
    }
    
    // Get user from database
    const user = await pool.query(
      'SELECT id, name, email, mobile FROM users WHERE id = $1',
      [decoded.id]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Add user to request object
    req.user = user.rows[0];
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Token is invalid'
    });
  }
};

module.exports = auth;
