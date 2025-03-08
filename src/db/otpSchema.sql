
-- Create table for storing OTPs
CREATE TABLE IF NOT EXISTS user_otps (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE
);

-- Create index on email to speed up lookups
CREATE INDEX IF NOT EXISTS idx_user_otps_email ON user_otps(email);

-- Create index on expires_at to aid in cleanup of expired OTPs
CREATE INDEX IF NOT EXISTS idx_user_otps_expires_at ON user_otps(expires_at);
