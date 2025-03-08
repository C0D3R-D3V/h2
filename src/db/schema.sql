
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
    user_id INTEGER PRIMARY KEY,
    profile_pic VARCHAR(255),
    bio TEXT,
    college VARCHAR(100),
    graduation_year INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create login_attempts table to track failed login attempts
CREATE TABLE login_attempts (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100),
    mobile VARCHAR(15),
    ip_address VARCHAR(45),
    success BOOLEAN NOT NULL,
    attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events and Registration Tables

-- Create events table for fest events
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    location VARCHAR(100),
    capacity INTEGER,
    event_type VARCHAR(50),
    is_featured BOOLEAN DEFAULT FALSE,
    thumbnail_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create event_registrations table to track user event registrations
CREATE TABLE event_registrations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES events(id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT unique_registration UNIQUE (event_id, user_id)
);

-- Tickets System

-- Create tickets table for fest tickets
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    ticket_type VARCHAR(50) NOT NULL,
    event_id INTEGER,
    price DECIMAL(10, 2) NOT NULL,
    purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ticket_code VARCHAR(20) UNIQUE NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_event FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Quiz System

-- Create quizzes table for fest quizzes
CREATE TABLE quizzes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    time_limit INTEGER, -- in minutes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create quiz_questions table for quiz questions
CREATE TABLE quiz_questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- {"a": "Option A", "b": "Option B", etc.}
    correct_option VARCHAR(10) NOT NULL,
    points INTEGER DEFAULT 1,
    CONSTRAINT fk_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id)
);

-- Create quiz_submissions table for user quiz submissions
CREATE TABLE quiz_submissions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    percentage DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create quiz_answers table for user quiz answers
CREATE TABLE quiz_answers (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    selected_option VARCHAR(10) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_quiz FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
    CONSTRAINT fk_question FOREIGN KEY (question_id) REFERENCES quiz_questions(id),
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Notification System

-- Create notifications table for user notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER, -- NULL for global notifications
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create chatbot_queries table for chatbot interaction history
CREATE TABLE chatbot_queries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    query_text TEXT NOT NULL,
    response_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    responded_at TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create timestamp update function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for timestamp updates
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

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
