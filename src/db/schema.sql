
-- User Authentication Schema

-- Create users table for registration and login
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    mobile VARCHAR(15) UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create sessions table to manage user login sessions
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create password_reset table for password recovery
CREATE TABLE password_reset (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    reset_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create user_profile table for additional user information
CREATE TABLE user_profile (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,
    profile_picture VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    pincode VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create login_attempts table to track failed login attempts (security feature)
CREATE TABLE login_attempts (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100),
    mobile VARCHAR(15),
    ip_address VARCHAR(45),
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    success BOOLEAN DEFAULT FALSE
);

-- Create event_registrations table to track which events users are registered for
CREATE TABLE event_registrations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    event_name VARCHAR(100) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ticket_type VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending',
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Functions and triggers

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update the timestamp when a user is updated
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

-- Trigger to update the timestamp when a user profile is updated
CREATE TRIGGER update_user_profile_timestamp
BEFORE UPDATE ON user_profile
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

-- Sample queries for login and registration

-- 1. Register a new user with email
-- INSERT INTO users (name, email, password) VALUES ('John Doe', 'john@example.com', 'hashed_password_here');

-- 2. Register a new user with mobile
-- INSERT INTO users (name, mobile, password) VALUES ('Jane Smith', '9876543210', 'hashed_password_here');

-- 3. Login query with email
-- SELECT id, name, email, password FROM users WHERE email = 'john@example.com' AND is_active = TRUE;

-- 4. Login query with mobile
-- SELECT id, name, mobile, password FROM users WHERE mobile = '9876543210' AND is_active = TRUE;

-- 5. Create a session after successful login
-- INSERT INTO sessions (user_id, session_token, expires_at) VALUES (1, 'random_token_here', NOW() + INTERVAL '24 hours');

-- 6. Update last login time after successful login
-- UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = 1;

-- 7. Check if a session is valid
-- SELECT u.id, u.name, u.email, u.mobile FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.session_token = 'token_here' AND s.expires_at > CURRENT_TIMESTAMP;

-- 8. Record a failed login attempt
-- INSERT INTO login_attempts (email, ip_address, success) VALUES ('john@example.com', '192.168.1.1', FALSE);

-- 9. Check for too many failed login attempts (for rate limiting)
-- SELECT COUNT(*) FROM login_attempts WHERE (email = 'john@example.com' OR mobile = '9876543210') AND attempt_time > (NOW() - INTERVAL '30 minutes') AND success = FALSE;

-- 10. Register for an event
-- INSERT INTO event_registrations (user_id, event_name, ticket_type) VALUES (1, 'Concert Night', 'VIP');
