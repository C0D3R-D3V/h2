
import { useState } from 'react';
import { login } from '../api/auth';
import './LoginModal.css';

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [identifierType, setIdentifierType] = useState('email'); // 'email' or 'mobile'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await login({ identifier, password });
      
      if (response.success) {
        onLoginSuccess(response.user);
        onClose();
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleIdentifierType = () => {
    setIdentifier('');
    setIdentifierType(identifierType === 'email' ? 'mobile' : 'email');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content login-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>Login to FestX</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="identifier">
              {identifierType === 'email' ? 'Email' : 'Mobile Number'}
            </label>
            <input
              type={identifierType === 'email' ? 'email' : 'tel'}
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={identifierType === 'email' ? 'Enter your email' : 'Enter your mobile number'}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="form-action">
            <button 
              type="button" 
              className="toggle-identifier-btn"
              onClick={toggleIdentifierType}
            >
              Use {identifierType === 'email' ? 'Mobile Number' : 'Email'} Instead
            </button>
          </div>
          
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="modal-footer">
          <p>Don't have an account? <a href="#" onClick={() => onClose('register')}>Register</a></p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
import { useState } from 'react';
import './LoginModal.css';

export default function LoginModal({ onClose, onLogin }) {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [identifierType, setIdentifierType] = useState('email');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleIdentifierType = () => {
    setIdentifierType(identifierType === 'email' ? 'mobile' : 'email');
    setFormData({
      ...formData,
      identifier: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Handle successful login
      if (onLogin) {
        onLogin(data.user);
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
        <h2>Login to Your Account</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="identifier">{identifierType === 'email' ? 'Email' : 'Mobile Number'}</label>
            <input
              type={identifierType === 'email' ? 'email' : 'tel'}
              id="identifier"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder={identifierType === 'email' ? 'Enter your email' : 'Enter your mobile number'}
              required
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
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="form-action">
            <button 
              type="button" 
              className="toggle-identifier-btn"
              onClick={toggleIdentifierType}
            >
              Use {identifierType === 'email' ? 'Mobile Number' : 'Email'} Instead
            </button>
          </div>
          
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="modal-footer">
          <p>Don't have an account? <a href="#" onClick={() => onClose('register')}>Register</a></p>
        </div>
      </div>
    </div>
  );
}
