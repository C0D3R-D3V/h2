const pool = require('./index');
const bcrypt = require('bcrypt');

// Register a new user
async function registerUser(userData) {
  const { username, email, password, fullName, phone } = userData;

  try {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the user into the database
    const query = `
      INSERT INTO users (username, email, password, full_name, phone) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING id, username, email, full_name, phone, created_at
    `;

    const values = [username, email, hashedPassword, fullName, phone];
    const result = await pool.query(query, values);

    return result.rows[0];
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

// Login a user
async function loginUser(email, password) {
  try {
    // Find the user by email
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return { success: false, message: 'User not found' };
    }

    const user = result.rows[0];

    // Compare the passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, message: 'Invalid password' };
    }

    // Remove the password from the user object before returning
    delete user.password;

    return { success: true, user };
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
}

// User registration
//const registerUser = async (username, email, mobile, password) => { ... } //Removed - Replaced above


// User login
//const loginUser = async (identifier, password) => { ... } //Removed - Replaced above

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