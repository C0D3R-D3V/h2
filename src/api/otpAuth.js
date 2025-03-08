
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../utils/emailService');

// Configure PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Generate a random 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Request OTP endpoint
router.post('/request-otp', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email is required' 
    });
  }
  
  try {
    // Check if email exists in users table
    const userQuery = 'SELECT id, name FROM users WHERE email = $1';
    const userResult = await pool.query(userQuery, [email]);
    
    // Generate a new OTP
    const otp = generateOTP();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes
    
    // Store OTP in database
    const insertQuery = `
      INSERT INTO user_otps (email, otp, expires_at)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
    await pool.query(insertQuery, [email, otp, expiresAt]);
    
    // Send OTP via email
    await sendOTP(email, otp);
    
    // For new users, we'll create the account when they verify the OTP
    const isNewUser = userResult.rows.length === 0;
    
    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      isNewUser
    });
  } catch (error) {
    console.error('Error requesting OTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP. Please try again later.'
    });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: 'Email and OTP are required'
    });
  }
  
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Find valid OTP
    const otpQuery = `
      SELECT id 
      FROM user_otps 
      WHERE email = $1 AND otp = $2 AND expires_at > NOW() AND is_used = FALSE
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const otpResult = await client.query(otpQuery, [email, otp]);
    
    if (otpResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }
    
    // Mark OTP as used
    await client.query('UPDATE user_otps SET is_used = TRUE WHERE id = $1', [otpResult.rows[0].id]);
    
    // Check if user exists
    const userQuery = 'SELECT id, name FROM users WHERE email = $1';
    const userResult = await client.query(userQuery, [email]);
    
    let userId;
    let isNewUser = false;
    
    if (userResult.rows.length === 0) {
      // Create new user if doesn't exist
      isNewUser = true;
      const createUserQuery = `
        INSERT INTO users (email, name, password)
        VALUES ($1, $2, $3)
        RETURNING id
      `;
      
      // Generate random password for account - user can update later
      const randomPassword = Math.random().toString(36).slice(-10);
      const username = email.split('@')[0]; // Default username from email
      
      const newUserResult = await client.query(createUserQuery, [email, username, randomPassword]);
      userId = newUserResult.rows[0].id;
    } else {
      userId = userResult.rows[0].id;
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Create a session
    const sessionQuery = `
      INSERT INTO sessions (user_id, session_token, expires_at)
      VALUES ($1, $2, NOW() + INTERVAL '24 hours')
    `;
    await client.query(sessionQuery, [userId, token]);
    
    // Record the login
    await client.query('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1', [userId]);
    
    await client.query('COMMIT');
    
    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      token,
      isNewUser,
      userId
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error verifying OTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Error verifying OTP. Please try again.'
    });
  } finally {
    client.release();
  }
});

module.exports = router;
