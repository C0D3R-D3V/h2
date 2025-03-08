
import React, { useState } from 'react';
import './EventPages.css';

const ConcertRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ticketType: 'standard',
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
    alert('Concert registration submitted! Check your email for confirmation.');
  };

  return (
    <div className="event-page-container">
      <div className="event-page-header concert-header">
        <h1>Concert Night Registration</h1>
      </div>
      <div className="event-page-content">
        <div className="event-section">
          <h2>Featuring Famous Singer</h2>
          <p className="event-highlight">Saturday, October 16 • 8:00 PM • Main Stage</p>
          
          <div className="event-image-container">
            <img src="https://via.placeholder.com/800x400" alt="Concert Stage" className="event-feature-image" />
          </div>
          
          <p className="event-description">
            Get ready for an unforgettable night as our headline artist takes the stage! 
            This exclusive concert is the highlight of FestX 2023, featuring spectacular performances,
            stunning visuals, and an electrifying atmosphere.
          </p>
        </div>
        
        <div className="event-section">
          <h2>Concert Registration</h2>
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
              <label htmlFor="ticketType">Ticket Type</label>
              <select 
                id="ticketType" 
                name="ticketType" 
                value={formData.ticketType} 
                onChange={handleChange}
              >
                <option value="standard">Standard (₹799)</option>
                <option value="vip">VIP (₹1499)</option>
                <option value="backstage">Backstage Pass (₹2999)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="quantity">Number of Tickets</label>
              <input 
                type="number" 
                id="quantity" 
                name="quantity" 
                min="1" 
                max="5" 
                value={formData.quantity} 
                onChange={handleChange} 
              />
            </div>
            
            <button type="submit" className="submit-button">Register Now</button>
          </form>
        </div>
        
        <div className="event-section">
          <h2>Concert Details</h2>
          <div className="concert-features">
            <div className="feature-card">
              <div className="feature-icon">🎵</div>
              <h3>Live Performance</h3>
              <p>2.5 hour live concert with all-new setlist</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Special Effects</h3>
              <p>State-of-the-art light show and pyrotechnics</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎤</div>
              <h3>Opening Acts</h3>
              <p>Featuring two up-and-coming local bands</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConcertRegistration;
