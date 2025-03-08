
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

// Create a pool for PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/festx'
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
    
    // Create users table if it doesn't exist
    const createTablesQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(100) UNIQUE,
        mobile VARCHAR(15) UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `;
    
    pool.query(createTablesQuery, (err) => {
      if (err) {
        console.error('Error creating tables:', err);
      } else {
        console.log('Database tables created or already exist');
      }
    });
  }
});

// User registration
const registerUser = async (username, email, mobile, password) => {
  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Insert the user into the database
    const query = `
      INSERT INTO users (username, email, mobile, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, mobile, created_at
    `;
    
    const values = [username, email || null, mobile || null, hashedPassword];
    const result = await pool.query(query, values);
    
    return { success: true, user: result.rows[0] };
  } catch (error) {
    console.error('Error registering user:', error);
    
    // Check for duplicate key violation
    if (error.code === '23505') { // PostgreSQL unique constraint violation
      if (error.detail.includes('email')) {
        return { success: false, error: 'Email already registered' };
      } else if (error.detail.includes('mobile')) {
        return { success: false, error: 'Mobile number already registered' };
      } else if (error.detail.includes('username')) {
        return { success: false, error: 'Username already taken' };
      }
    }
    
    return { success: false, error: 'Registration failed. Please try again.' };
  }
};

// User login
const loginUser = async (identifier, password) => {
  try {
    // Check if identifier is email, mobile, or username
    const query = `
      SELECT * FROM users
      WHERE email = $1 OR mobile = $1 OR username = $1
    `;
    
    const result = await pool.query(query, [identifier]);
    
    // If no user found
    if (result.rows.length === 0) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    const user = result.rows[0];
    
    // Compare password
    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      return { success: false, error: 'Invalid credentials' };
    }
    
    // Create a session token
    const token = require('crypto').randomBytes(64).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Token expires in 7 days
    
    // Save session to database
    const sessionQuery = `
      INSERT INTO sessions (user_id, token, expires_at)
      VALUES ($1, $2, $3)
      RETURNING id, token, expires_at
    `;
    
    const sessionResult = await pool.query(sessionQuery, [user.id, token, expiresAt]);
    
    // Return user data (excluding password) and session
    const { password: _, ...userData } = user;
    
    return {
      success: true,
      user: userData,
      session: sessionResult.rows[0]
    };
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, error: 'Login failed. Please try again.' };
  }
};

// Verify session token
const verifySession = async (token) => {
  try {
    const query = `
      SELECT s.*, u.id as user_id, u.username, u.email, u.mobile
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = $1 AND s.expires_at > NOW()
    `;
    
    const result = await pool.query(query, [token]);
    
    if (result.rows.length === 0) {
      return { success: false, error: 'Invalid or expired session' };
    }
    
    return { success: true, session: result.rows[0] };
  } catch (error) {
    console.error('Error verifying session:', error);
    return { success: false, error: 'Session verification failed' };
  }
};

// Logout user (delete session)
const logoutUser = async (token) => {
  try {
    const query = 'DELETE FROM sessions WHERE token = $1';
    await pool.query(query, [token]);
    return { success: true };
  } catch (error) {
    console.error('Error logging out:', error);
    return { success: false, error: 'Logout failed' };
  }
};

module.exports = {
  pool,
  registerUser,
  loginUser,
  verifySession,
  logoutUser
};
