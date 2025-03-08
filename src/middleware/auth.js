
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
