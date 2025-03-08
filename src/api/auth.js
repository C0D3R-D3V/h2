
// Auth API client for frontend

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} [userData.email] - User's email (required if mobile not provided)
 * @param {string} [userData.mobile] - User's mobile number (required if email not provided)
 * @param {string} userData.password - User's password
 * @returns {Promise<Object>} Registration response
 */
export const register = async (userData) => {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Login a user with email or mobile
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.identifier - Email or mobile number
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} Login response
 */
export const login = async (credentials) => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for cookies
      body: JSON.stringify(credentials),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Logout the current user
 * @returns {Promise<Object>} Logout response
 */
export const logout = async () => {
  try {
    const response = await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include', // Important for cookies
    });
    
    return await response.json();
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

/**
 * Get the current logged-in user
 * @returns {Promise<Object>} Current user data
 */
export const getCurrentUser = async () => {
  try {
    const response = await fetch('/api/user', {
      method: 'GET',
      credentials: 'include', // Important for cookies
    });
    
    return await response.json();
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};
