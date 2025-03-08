
import { useState } from 'react';
import './OtpLoginModal.css';

const OtpLoginModal = ({ onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/otp/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOtpSent(true);
        // Start a 60-second countdown timer
        setCountdown(60);
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/otp/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Store token in localStorage
        localStorage.setItem('festx_token', data.token);
        onLoginSuccess({ id: data.userId, email });
        onClose();
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content otp-login-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        
        <h2>Login with Email OTP</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        {!otpSent ? (
          <form onSubmit={handleRequestOtp}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <p className="otp-instructions">
                We've sent a one-time password to {email}
              </p>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                pattern="[0-9]{6}"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-btn" 
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
            
            <div className="resend-otp">
              {countdown > 0 ? (
                <p>Resend OTP in {countdown} seconds</p>
              ) : (
                <button 
                  type="button" 
                  className="resend-btn" 
                  onClick={handleRequestOtp}
                >
                  Resend OTP
                </button>
              )}
            </div>
            
            <div className="change-email">
              <button 
                type="button" 
                className="change-email-btn" 
                onClick={() => setOtpSent(false)}
              >
                Change Email
              </button>
            </div>
          </form>
        )}
        
        <div className="modal-footer">
          <p>Want to use password instead? <a href="#" onClick={() => onClose('login')}>Login with Password</a></p>
        </div>
      </div>
    </div>
  );
};

export default OtpLoginModal;
