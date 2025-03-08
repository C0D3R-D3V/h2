
const fs = require('fs');
const path = require('path');
const pool = require('./index');

async function initDatabase() {
  try {
    console.log('Initializing database...');
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, 'users.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Execute the SQL script
    await pool.query(sqlScript);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Run the initialization if this script is executed directly
if (require.main === module) {
  initDatabase()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = initDatabase;
