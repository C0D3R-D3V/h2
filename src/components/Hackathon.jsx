
import React, { useState } from 'react';
import './EventPages.css';

const Hackathon = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    teamName: '',
    teamSize: 1,
    projectIdea: '',
    techStack: ''
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
    alert('Hackathon registration submitted! Check your email for confirmation.');
  };

  return (
    <div className="event-page-container">
      <div className="event-page-header hackathon-header">
        <h1>Hackathon Registration</h1>
      </div>
      <div className="event-page-content">
        <div className="event-section">
          <h2>48-Hour Coding Challenge</h2>
          <p className="event-highlight">Starts: Day 1, 5:00 PM • Ends: Day 3, 5:00 PM • Tech Hub</p>
          
          <div className="event-image-container">
            <img src="https://via.placeholder.com/800x400" alt="Hackathon" className="event-feature-image" />
          </div>
          
          <p className="event-description">
            Put your coding skills to the test in our 48-hour hackathon! Build innovative solutions to
            real-world problems, collaborate with fellow developers, and compete for exciting prizes.
            This year's theme: "Technology for Social Good" focuses on creating solutions that can positively
            impact society.
          </p>
        </div>
        
        <div className="event-section">
          <h2>Hackathon Details</h2>
          <div className="hackathon-details">
            <div className="hackathon-detail-item">
              <div className="hackathon-detail-icon">🏆</div>
              <div className="hackathon-detail-content">
                <h3>Prizes</h3>
                <ul>
                  <li>1st Place: ₹50,000 + Internship Opportunities</li>
                  <li>2nd Place: ₹30,000 + Tech Gadgets</li>
                  <li>3rd Place: ₹15,000</li>
                  <li>Best UI/UX: ₹10,000</li>
                  <li>Most Innovative Idea: ₹10,000</li>
                </ul>
              </div>
            </div>
            
            <div className="hackathon-detail-item">
              <div className="hackathon-detail-icon">📋</div>
              <div className="hackathon-detail-content">
                <h3>Rules</h3>
                <ul>
                  <li>Teams of 1-4 members</li>
                  <li>All code must be written during the hackathon</li>
                  <li>Open source libraries and APIs are allowed</li>
                  <li>Final presentations are limited to 5 minutes</li>
                </ul>
              </div>
            </div>
            
            <div className="hackathon-detail-item">
              <div className="hackathon-detail-icon">🧰</div>
              <div className="hackathon-detail-content">
                <h3>Resources Provided</h3>
                <ul>
                  <li>24/7 workspace with high-speed internet</li>
                  <li>Power outlets and basic hardware</li>
                  <li>Meals and refreshments</li>
                  <li>Mentorship from industry professionals</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="event-section">
          <h2>Hackathon Registration</h2>
          <form className="event-registration-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Team Leader Name</label>
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
              <label htmlFor="teamName">Team Name</label>
              <input 
                type="text" 
                id="teamName" 
                name="teamName" 
                value={formData.teamName} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="teamSize">Team Size</label>
              <select 
                id="teamSize" 
                name="teamSize" 
                value={formData.teamSize} 
                onChange={handleChange}
              >
                <option value="1">1 (Solo)</option>
                <option value="2">2 Members</option>
                <option value="3">3 Members</option>
                <option value="4">4 Members</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="projectIdea">Brief Project Idea</label>
              <textarea 
                id="projectIdea" 
                name="projectIdea" 
                value={formData.projectIdea} 
                onChange={handleChange} 
                rows="4"
                placeholder="Describe your project idea in 2-3 sentences (can be changed later)"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="techStack">Preferred Tech Stack</label>
              <input 
                type="text" 
                id="techStack" 
                name="techStack" 
                value={formData.techStack} 
                onChange={handleChange} 
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </div>
            
            <button type="submit" className="submit-button">Register Team</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Hackathon;
