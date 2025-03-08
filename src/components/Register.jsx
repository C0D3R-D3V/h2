import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
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

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }

    if (!formData.email.trim() && !formData.mobile.trim()) {
      setError('Email or mobile number is required');
      return false;
    }

    if (formData.email.trim() && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }

    if (formData.mobile.trim() && !/^\d{10}$/.test(formData.mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email || undefined,
          mobile: formData.mobile || undefined,
          password: formData.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Registration successful - redirect to login
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-wrapper">
        <div className="register-form-container">
          <div className="register-header">
            <h1>Create Account</h1>
            <p>Join FestX 2023 and get exclusive access!</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username" 
                name="username" 
                value={formData.username}
                onChange={handleChange}
                required 
                placeholder="Choose a username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
              />
              <small>Enter either email or mobile number (or both)</small>
            </div>

            <div className="form-group">
              <label htmlFor="mobile">Mobile Number</label>
              <input 
                type="tel" 
                id="mobile" 
                name="mobile" 
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your mobile number" 
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
                placeholder="Create a password" 
              />
              <small>Password must be at least 6 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                value={formData.confirmPassword}
                onChange={handleChange}
                required 
                placeholder="Confirm your password" 
              />
            </div>

            <div className="terms-privacy">
              <label>
                <input type="checkbox" required />
                I agree to the <a href="#terms">Terms of Service</a> and <a href="#privacy">Privacy Policy</a>
              </label>
            </div>

            <div className="form-actions">
              <Link to="/" className="back-button">Back</Link>
              <button type="submit" className="register-button" disabled={loading}>
                {loading ? 'Registering...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="login-prompt">
            <p>Already have an account?</p>
            <Link to="/login" className="login-link">Login Here</Link>
          </div>
        </div>

        <div className="register-benefits">
          <h3>Benefits of Joining</h3>
          <ul className="benefits-list">
            <li>Early access to event tickets</li>
            <li>Exclusive merchandise discounts</li>
            <li>Participate in contests and win prizes</li>
            <li>Priority seating for selected events</li>
            <li>Get notified about upcoming events</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Register;