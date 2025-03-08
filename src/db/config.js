
/**
 * Database configuration for the application
 */

module.exports = {
  // Default connection string for local development
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/festx',
  
  // Pool configuration
  pool: {
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // How long to wait for a connection from the pool
  }
};
