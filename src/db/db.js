
// Database connection module for FestX
const { Pool } = require('pg');

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database connected:', res.rows[0]);
  }
});

// Helper methods for common database operations
const db = {
  // Execute a query with parameters
  query: (text, params) => pool.query(text, params),

  // Get a client from the pool
  getClient: async () => {
    const client = await pool.connect();
    const query = client.query;
    const release = client.release;

    // Set a timeout of 5 seconds, after which we will log this client's last query
    const timeout = setTimeout(() => {
      console.error('A client has been checked out for more than 5 seconds!');
      console.error(`The last executed query on this client was: ${client.lastQuery}`);
    }, 5000);

    // Monkey patch the query method to keep track of the last query executed
    client.query = (...args) => {
      client.lastQuery = args;
      return query.apply(client, args);
    };

    client.release = () => {
      clearTimeout(timeout);
      client.query = query;
      client.release = release;
      return release.apply(client);
    };

    return client;
  },

  // User related methods
  users: {
    // Register a new user
    create: async (userData) => {
      const { name, email, mobile, password } = userData;
      
      const query = `
        INSERT INTO users (name, email, mobile, password) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id, name, email, mobile, created_at
      `;
      
      try {
        const result = await pool.query(query, [name, email, mobile, password]);
        return result.rows[0];
      } catch (error) {
        console.error('Error creating user:', error);
        throw error;
      }
    },

    // Find user by email or mobile
    findByCredentials: async (identifier) => {
      // Determine if identifier is email or mobile
      const isEmail = identifier.includes('@');
      
      const query = `
        SELECT id, name, email, mobile, password, is_active 
        FROM users 
        WHERE ${isEmail ? 'email' : 'mobile'} = $1
      `;
      
      try {
        const result = await pool.query(query, [identifier]);
        return result.rows[0];
      } catch (error) {
        console.error('Error finding user:', error);
        throw error;
      }
    },

    // Update last login time
    updateLastLogin: async (userId) => {
      const query = `
        UPDATE users 
        SET last_login = CURRENT_TIMESTAMP 
        WHERE id = $1
      `;
      
      try {
        await pool.query(query, [userId]);
      } catch (error) {
        console.error('Error updating last login:', error);
        throw error;
      }
    }
  },

  // Session related methods
  sessions: {
    // Create a new session
    create: async (userId, token, expiresIn = '24 hours') => {
      const query = `
        INSERT INTO sessions (user_id, session_token, expires_at) 
        VALUES ($1, $2, NOW() + INTERVAL '${expiresIn}') 
        RETURNING id, session_token, expires_at
      `;
      
      try {
        const result = await pool.query(query, [userId, token]);
        return result.rows[0];
      } catch (error) {
        console.error('Error creating session:', error);
        throw error;
      }
    },

    // Find session by token
    findByToken: async (token) => {
      const query = `
        SELECT s.id, s.user_id, s.expires_at, u.name, u.email, u.mobile 
        FROM sessions s 
        JOIN users u ON s.user_id = u.id 
        WHERE s.session_token = $1 AND s.expires_at > CURRENT_TIMESTAMP
      `;
      
      try {
        const result = await pool.query(query, [token]);
        return result.rows[0];
      } catch (error) {
        console.error('Error finding session:', error);
        throw error;
      }
    },

    // Delete a session (logout)
    delete: async (token) => {
      const query = `
        DELETE FROM sessions 
        WHERE session_token = $1
      `;
      
      try {
        await pool.query(query, [token]);
      } catch (error) {
        console.error('Error deleting session:', error);
        throw error;
      }
    }
  },

  // Login attempts related methods
  loginAttempts: {
    // Record a login attempt
    record: async (identifier, ipAddress, success) => {
      // Determine if identifier is email or mobile
      const isEmail = identifier.includes('@');
      
      const query = `
        INSERT INTO login_attempts (${isEmail ? 'email' : 'mobile'}, ip_address, success) 
        VALUES ($1, $2, $3)
      `;
      
      try {
        await pool.query(query, [identifier, ipAddress, success]);
      } catch (error) {
        console.error('Error recording login attempt:', error);
        throw error;
      }
    },

    // Check if too many failed attempts
    tooManyFailedAttempts: async (identifier, minutes = 30, maxAttempts = 5) => {
      // Determine if identifier is email or mobile
      const isEmail = identifier.includes('@');
      
      const query = `
        SELECT COUNT(*) 
        FROM login_attempts 
        WHERE ${isEmail ? 'email' : 'mobile'} = $1 
        AND attempt_time > (NOW() - INTERVAL '${minutes} minutes') 
        AND success = FALSE
      `;
      
      try {
        const result = await pool.query(query, [identifier]);
        return parseInt(result.rows[0].count) >= maxAttempts;
      } catch (error) {
        console.error('Error checking failed attempts:', error);
        throw error;
      }
    }
  },

  // Event registrations
  events: {
    // Register user for an event
    register: async (userId, eventName, ticketType, paymentStatus = 'pending') => {
      const query = `
        INSERT INTO event_registrations (user_id, event_name, ticket_type, payment_status) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id, event_name, registration_date, ticket_type, payment_status
      `;
      
      try {
        const result = await pool.query(query, [userId, eventName, ticketType, paymentStatus]);
        return result.rows[0];
      } catch (error) {
        console.error('Error registering for event:', error);
        throw error;
      }
    },

    // Get user's registered events
    getUserEvents: async (userId) => {
      const query = `
        SELECT id, event_name, registration_date, ticket_type, payment_status 
        FROM event_registrations 
        WHERE user_id = $1
      `;
      
      try {
        const result = await pool.query(query, [userId]);
        return result.rows;
      } catch (error) {
        console.error('Error getting user events:', error);
        throw error;
      }
    }
  }
};

module.exports = db;
