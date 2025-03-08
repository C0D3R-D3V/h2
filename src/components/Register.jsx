
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
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
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Here you would typically make an API call to your backend
    // For now, simulate a registration success
    console.log('Registration attempt with:', formData);
    
    // Redirect to login page after successful registration
    navigate('/login');
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Register</h1>
        {error && <div className="error-message">{error}</div>}
        <form id="registerForm" onSubmit={handleSubmit}>
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
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              value={formData.confirmPassword}
              onChange={handleChange}
              required 
            />
          </div>
          
          <button type="submit" className="submit-btn">Register</button>
        </form>
        <p className="switch-form">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
        <p className="back-home">
          <Link to="/">Back to Homepage</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
