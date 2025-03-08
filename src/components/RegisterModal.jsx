
import { useState } from 'react';
import { register } from '../api/auth';
import './RegisterModal.css';

const RegisterModal = ({ onClose, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [useMobile, setUseMobile] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error
    setError('');
    
    // Form validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (useMobile && !formData.mobile) {
      setError('Mobile number is required');
      return;
    }
    
    if (!useMobile && !formData.email) {
      setError('Email is required');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create payload based on whether using email or mobile
      const payload = {
        name: formData.name,
        password: formData.password
      };
      
      if (useMobile) {
        payload.mobile = formData.mobile;
      } else {
        payload.email = formData.email;
      }
      
      const response = await register(payload);
      
      if (response.success) {
        onRegisterSuccess(response.user);
        onClose();
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleIdentifierType = () => {
    setUseMobile(!useMobile);
    setFormData(prev => ({
      ...prev,
      email: '',
      mobile: ''
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content register-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>Register for FestX</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          {useMobile ? (
            <div className="form-group">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your 10-digit mobile number"
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <div className="form-action">
            <button 
              type="button" 
              className="toggle-identifier-btn"
              onClick={toggleIdentifierType}
            >
              Use {useMobile ? 'Email' : 'Mobile Number'} Instead
            </button>
          </div>
          
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="modal-footer">
          <p>Already have an account? <a href="#" onClick={() => onClose('login')}>Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
import { useState } from 'react';
import './LoginModal.css'; // Reusing the same CSS

export default function RegisterModal({ onClose, onRegister }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useMobile, setUseMobile] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleIdentifierType = () => {
    setUseMobile(!useMobile);
    setFormData({
      ...formData,
      email: useMobile ? '' : formData.email,
      mobile: useMobile ? formData.mobile : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);

    try {
      // Prepare data for API
      const apiData = {
        name: formData.name,
        password: formData.password,
      };
      
      // Add either email or mobile based on selected option
      if (useMobile) {
        apiData.mobile = formData.mobile;
      } else {
        apiData.email = formData.email;
      }
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Handle successful registration
      if (onRegister) {
        onRegister(data.user);
      }
      
      // Close modal
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content login-modal">
        <button className="modal-close" onClick={() => onClose()}>×</button>
        <h2>Create Your Account</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          {!useMobile ? (
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required={!useMobile}
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter your mobile number"
                required={useMobile}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <div className="form-action">
            <button 
              type="button" 
              className="toggle-identifier-btn"
              onClick={toggleIdentifierType}
            >
              Use {useMobile ? 'Email' : 'Mobile Number'} Instead
            </button>
          </div>
          
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>
        
        <div className="modal-footer">
          <p>Already have an account? <a href="#" onClick={() => onClose('login')}>Login</a></p>
        </div>
      </div>
    </div>
  );
}
