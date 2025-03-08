
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    // Validate email
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    // Validate mobile (optional)
    if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
      errors.mobile = 'Mobile number must be 10 digits';
    }
    
    // Validate password
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handleFirstStep = (e) => {
    e.preventDefault();
    
    // Validate only first step fields
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (Object.keys(errors).length === 0) {
      setStep(2);
    } else {
      setFormErrors(errors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
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
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Show success and redirect to login
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const { password } = formData;
    if (!password) return '';
    
    if (password.length < 8) return 'weak';
    if (password.length >= 12 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return 'strong';
    }
    return 'medium';
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Create Your Account</h2>
          <p>Join FestX and get exclusive access to events</p>
          
          <div className="step-indicator">
            <div className={`step ${step === 1 ? 'active' : ''}`}>1</div>
            <div className="step-line"></div>
            <div className={`step ${step === 2 ? 'active' : ''}`}>2</div>
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={step === 1 ? handleFirstStep : handleSubmit} className="register-form">
          {step === 1 ? (
            // Step 1: Basic Information
            <>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-icon-wrapper">
                  <i className="icon-user"></i>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </div>
                {formErrors.name && <span className="error-text">{formErrors.name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-icon-wrapper">
                  <i className="icon-email"></i>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                  />
                </div>
                {formErrors.email && <span className="error-text">{formErrors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="mobile">Mobile Number (Optional)</label>
                <div className="input-icon-wrapper">
                  <i className="icon-phone"></i>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Enter your 10-digit mobile number"
                  />
                </div>
                {formErrors.mobile && <span className="error-text">{formErrors.mobile}</span>}
              </div>
              
              <button type="submit" className="register-button">
                Continue
              </button>
            </>
          ) : (
            // Step 2: Password Setup
            <>
              <div className="form-group">
                <label htmlFor="password">Create Password</label>
                <div className="input-icon-wrapper">
                  <i className="icon-lock"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {formErrors.password && <span className="error-text">{formErrors.password}</span>}
                
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className={`strength-indicator ${passwordStrength()}`}
                        style={{ width: passwordStrength() === 'weak' ? '30%' : passwordStrength() === 'medium' ? '70%' : '100%' }}
                      ></div>
                    </div>
                    <span className="strength-text">
                      {passwordStrength() === 'weak' ? 'Weak password' : 
                       passwordStrength() === 'medium' ? 'Medium strength' : 'Strong password'}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-icon-wrapper">
                  <i className="icon-lock"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                  />
                </div>
                {formErrors.confirmPassword && <span className="error-text">{formErrors.confirmPassword}</span>}
              </div>
              
              <div className="form-group checkbox">
                <input type="checkbox" id="termsAgree" required />
                <label htmlFor="termsAgree">
                  I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
                </label>
              </div>
              
              <div className="form-actions">
                <button type="button" className="back-button" onClick={() => setStep(1)}>
                  Back
                </button>
                <button 
                  type="submit" 
                  className="register-button" 
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </>
          )}
        </form>
        
        <div className="login-prompt">
          <p>Already have an account?</p>
          <Link to="/login" className="login-link">
            Sign In
          </Link>
        </div>
      </div>
      
      <div className="register-benefits">
        <h3>Why Join FestX?</h3>
        <ul className="benefits-list">
          <li>
            <i className="icon-ticket"></i>
            <span>Early access to event tickets</span>
          </li>
          <li>
            <i className="icon-discount"></i>
            <span>Exclusive member discounts</span>
          </li>
          <li>
            <i className="icon-notification"></i>
            <span>Event reminders and updates</span>
          </li>
          <li>
            <i className="icon-fasttrack"></i>
            <span>Fast-track entry at select events</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Register;
