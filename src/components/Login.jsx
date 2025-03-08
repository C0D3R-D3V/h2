
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Here you would typically make an API call to your backend
    // For now, simulate a login success
    console.log('Login attempt with:', formData);
    localStorage.setItem('isLoggedIn', 'true');
    
    // Redirect to homepage after successful login
    navigate('/');
    window.location.reload(); // Force reload to update login state
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        {error && <div className="error-message">{error}</div>}
        <form id="loginForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              value={formData.username}
              onChange={handleChange}
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
          </div>
          
          <button type="submit" className="submit-btn">Login</button>
        </form>
        <p className="switch-form">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        <p className="back-home">
          <Link to="/">Back to Homepage</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
