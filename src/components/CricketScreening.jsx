
import React, { useState } from 'react';
import './EventPages.css';

const CricketScreening = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    screening: 'day2',
    seating: 'standard',
    quantity: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would send data to the server
    alert('Cricket screening registration submitted! Check your email for confirmation.');
  };

  return (
    <div className="event-page-container">
      <div className="event-page-header cricket-header">
        <h1>Cricket Screening Registration</h1>
      </div>
      <div className="event-page-content">
        <div className="event-section">
          <h2>Live Cricket Match Screening with Sachin Tendulkar</h2>
          <p className="event-highlight">Sunday, October 16 • 3:00 PM • College Auditorium</p>
          
          <div className="event-image-container">
            <img src="https://via.placeholder.com/800x400" alt="Cricket Screening" className="event-feature-image" />
          </div>
          
          <p className="event-description">
            Experience the thrill of cricket like never before! Join us for a special screening of an
            exciting cricket match with live commentary from cricket legend Sachin Tendulkar himself.
            This exclusive event will give you insights into the game from one of the greatest players
            of all time.
          </p>
        </div>
        
        <div className="event-section">
          <h2>Event Details</h2>
          <div className="cricket-event-details">
            <div className="cricket-detail-item">
              <div className="cricket-detail-icon">🏏</div>
              <div className="cricket-detail-content">
                <h3>Match</h3>
                <p>International T20 - India vs. Australia</p>
              </div>
            </div>
            
            <div className="cricket-detail-item">
              <div className="cricket-detail-icon">👤</div>
              <div className="cricket-detail-content">
                <h3>Special Guest</h3>
                <p>Sachin Tendulkar (Live Commentary)</p>
              </div>
            </div>
            
            <div className="cricket-detail-item">
              <div className="cricket-detail-icon">📺</div>
              <div className="cricket-detail-content">
                <h3>Screening</h3>
                <p>Giant 4K LED Screen with Surround Sound</p>
              </div>
            </div>
            
            <div className="cricket-detail-item">
              <div className="cricket-detail-icon">🍿</div>
              <div className="cricket-detail-content">
                <h3>Refreshments</h3>
                <p>Available for purchase (Premium & VIP tickets include complimentary refreshments)</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="event-section">
          <h2>Cricket Screening Registration</h2>
          <form className="event-registration-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
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
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="seating">Seating Type</label>
              <select 
                id="seating" 
                name="seating" 
                value={formData.seating} 
                onChange={handleChange}
              >
                <option value="standard">Standard (₹249)</option>
                <option value="premium">Premium with Refreshments (₹499)</option>
                <option value="vip">VIP (Front Rows + Meet & Greet) (₹999)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="quantity">Number of Seats</label>
              <input 
                type="number" 
                id="quantity" 
                name="quantity" 
                min="1" 
                max="10" 
                value={formData.quantity} 
                onChange={handleChange} 
              />
            </div>
            
            <button type="submit" className="submit-button">Register Now</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CricketScreening;
