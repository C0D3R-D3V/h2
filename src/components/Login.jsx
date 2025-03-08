import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Login successful
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to home page
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-form-container">
          <div className="login-header">
            <h1>Welcome Back!</h1>
            <p>Sign in to continue to FestX</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="identifier">Email / Username / Mobile</label>
              <input 
                type="text" 
                id="identifier" 
                name="identifier" 
                value={formData.identifier}
                onChange={handleChange}
                required 
                placeholder="Enter your email, username or mobile"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password}
                onChange={handleChange}
                required 
                placeholder="Enter your password" 
              />
              <div className="forgot-password">
                <a href="#forgot">Forgot Password?</a>
              </div>
            </div>

            <div className="form-button">
              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>

            <div className="social-login">
              <p>Or login with</p>
              <div className="social-buttons">
                <button type="button" className="social-button google">
                  <span className="icon-google"></span>
                  Google
                </button>
                <button type="button" className="social-button facebook">
                  <span className="icon-facebook"></span>
                  Facebook
                </button>
              </div>
            </div>
          </form>

          <div className="register-prompt">
            <p>Don't have an account?</p>
            <Link to="/register" className="register-link">Register Now</Link>
          </div>
        </div>

        <div className="login-features">
          <div className="feature-card">
            <i className="icon-ticket"></i>
            <h3>Get Your Tickets</h3>
            <p>Access early bird tickets and special offers</p>
          </div>
          <div className="feature-card">
            <i className="icon-calendar"></i>
            <h3>Event Schedule</h3>
            <p>Build your personal calendar for the fest</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;