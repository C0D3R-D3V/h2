
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Create a pool connection to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const auth = {
  // Register a new user
  registerUser: async (userData) => {
    const { name, email, mobile, password } = userData;
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const query = `
      INSERT INTO users (name, email, mobile, password) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, name, email, mobile, created_at
    `;
    
    try {
      const result = await pool.query(query, [name, email, mobile, hashedPassword]);
      return result.rows[0];
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  // Login user
  loginUser: async (identifier, password) => {
    // Determine if identifier is email or mobile
    const isEmail = identifier.includes('@');
    
    const query = `
      SELECT id, name, email, mobile, password, is_active 
      FROM users 
      WHERE ${isEmail ? 'email' : 'mobile'} = $1
    `;
    
    try {
      const result = await pool.query(query, [identifier]);
      const user = result.rows[0];
      
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      
      if (!user.is_active) {
        return { success: false, message: 'Account is inactive' };
      }
      
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return { success: false, message: 'Invalid password' };
      }
      
      // Update last login
      await pool.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [user.id]);
      
      // Create session
      const sessionToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Session expires in 7 days
      
      await pool.query(
        'INSERT INTO sessions (user_id, session_token, expires_at) VALUES ($1, $2, $3)',
        [user.id, sessionToken, expiresAt]
      );
      
      return { 
        success: true, 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          mobile: user.mobile
        },
        sessionToken
      };
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  },

  // Verify session
  verifySession: async (sessionToken) => {
    const query = `
      SELECT u.id, u.name, u.email, u.mobile 
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.session_token = $1 AND s.expires_at > CURRENT_TIMESTAMP
    `;
    
    try {
      const result = await pool.query(query, [sessionToken]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error verifying session:', error);
      throw error;
    }
  },

  // Logout user (delete session)
  logoutUser: async (sessionToken) => {
    try {
      await pool.query('DELETE FROM sessions WHERE session_token = $1', [sessionToken]);
      return true;
    } catch (error) {
      console.error('Error logging out user:', error);
      throw error;
    }
  }
};

module.exports = auth;
