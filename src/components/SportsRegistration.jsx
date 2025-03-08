
import React, { useState } from 'react';
import './EventPages.css';

const SportsRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: 'cricket',
    teamSize: 'individual',
    teamName: ''
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
    alert('Sports event registration submitted! Check your email for confirmation.');
  };

  return (
    <div className="event-page-container">
      <div className="event-page-header sports-header">
        <h1>Sports Meet Registration</h1>
      </div>
      <div className="event-page-content">
        <div className="event-section">
          <h2>With Cricket Legend Sachin Tendulkar</h2>
          <p className="event-highlight">Sunday, October 16 • 3:00 PM • College Grounds</p>
          
          <div className="event-image-container">
            <img src="https://via.placeholder.com/800x400" alt="Sports Event" className="event-feature-image" />
          </div>
          
          <p className="event-description">
            Join us for an exciting sports meet featuring cricket legend Sachin Tendulkar as our chief guest!
            Participate in various sports events, get tips from professionals, and even get a chance to
            meet and greet Sachin Tendulkar in person.
          </p>
        </div>
        
        <div className="event-section">
          <h2>Sports Event Registration</h2>
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
              <label htmlFor="eventType">Sport Type</label>
              <select 
                id="eventType" 
                name="eventType" 
                value={formData.eventType} 
                onChange={handleChange}
              >
                <option value="cricket">Cricket</option>
                <option value="football">Football</option>
                <option value="basketball">Basketball</option>
                <option value="athletics">Athletics</option>
                <option value="badminton">Badminton</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="teamSize">Participation Type</label>
              <select 
                id="teamSize" 
                name="teamSize" 
                value={formData.teamSize} 
                onChange={handleChange}
              >
                <option value="individual">Individual</option>
                <option value="team">Team</option>
              </select>
            </div>
            
            {formData.teamSize === 'team' && (
              <div className="form-group">
                <label htmlFor="teamName">Team Name</label>
                <input 
                  type="text" 
                  id="teamName" 
                  name="teamName" 
                  value={formData.teamName} 
                  onChange={handleChange} 
                />
              </div>
            )}
            
            <button type="submit" className="submit-button">Register Now</button>
          </form>
        </div>
        
        <div className="event-section">
          <h2>Meet & Greet with Sachin Tendulkar</h2>
          <div className="meet-greet-details">
            <p>
              A limited number of participants will get a chance to meet cricket legend 
              Sachin Tendulkar in person! The selection will be based on a lucky draw among
              all registered participants.
            </p>
            <div className="meet-greet-time">
              <div className="meet-greet-icon">🏏</div>
              <div>
                <strong>When:</strong> October 16, 5:00 PM
              </div>
            </div>
            <div className="meet-greet-location">
              <div className="meet-greet-icon">📍</div>
              <div>
                <strong>Where:</strong> College Main Pavilion
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsRegistration;
