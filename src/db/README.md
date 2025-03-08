
# Database Setup for FestX

This directory contains the database schema and instructions for setting up user authentication.

## Setting Up PostgreSQL

To use this schema with PostgreSQL in your Replit project:

1. Open a new tab in Replit and type "Database"
2. In the "Database" panel, click "create a database"
3. Once your database is created, you can access the connection details in the environment variables

## Running the Schema

You can run the schema by:

1. Opening the SQL Explorer in the Database tab
2. Copying the contents of `schema.sql` into the SQL Explorer
3. Running the queries to create the tables

## Schema Explanation

The database schema includes:

- **users**: Main table for user registration with email/mobile auth
- **sessions**: Manages user login sessions
- **password_reset**: Handles password recovery
- **user_profile**: Stores additional user information
- **login_attempts**: Tracks failed login attempts for security
- **event_registrations**: Tracks which events users register for

## Common Queries

Common operations are documented as comments at the end of the schema.sql file, including:
- User registration
- Login authentication
- Session management
- Security monitoring

## Next Steps

To integrate this database with your FestX application, you'll need to:

1. Install a PostgreSQL client for your JavaScript application:
   ```
   npm install pg
   ```

2. Create a database connection module in your application
3. Implement the registration and login functionality using the database
