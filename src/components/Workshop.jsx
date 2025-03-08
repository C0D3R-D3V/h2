
import React, { useState } from 'react';
import './EventPages.css';

const Workshop = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    workshop: 'web',
    experience: 'beginner'
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
    alert('Workshop registration submitted! Check your email for confirmation.');
  };

  return (
    <div className="event-page-container">
      <div className="event-page-header workshop-header">
        <h1>Technical Workshop Registration</h1>
      </div>
      <div className="event-page-content">
        <div className="event-section">
          <h2>Skill-Building Technical Workshops</h2>
          <p className="event-highlight">All three days • Various Timings • Tech Center</p>
          
          <div className="event-image-container">
            <img src="https://via.placeholder.com/800x400" alt="Technical Workshop" className="event-feature-image" />
          </div>
          
          <p className="event-description">
            Enhance your technical skills with our specialized workshops led by industry experts.
            From web development to AI, data science to cybersecurity, we have workshops for every
            interest and skill level. All workshops include hands-on practice, resources, and 
            certificates of completion.
          </p>
        </div>
        
        <div className="event-section">
          <h2>Available Workshops</h2>
          <div className="workshop-cards">
            <div className="workshop-card">
              <div className="workshop-icon">💻</div>
              <h3>Web Development Bootcamp</h3>
              <p><strong>Day 1 • 11:00 AM - 2:00 PM</strong></p>
              <p>Learn modern frontend frameworks and responsive design techniques.</p>
              <div className="workshop-tag">Beginner-Friendly</div>
            </div>
            
            <div className="workshop-card">
              <div className="workshop-icon">🤖</div>
              <h3>AI & Machine Learning</h3>
              <p><strong>Day 2 • 10:00 AM - 1:00 PM</strong></p>
              <p>Dive into practical ML applications with Python and popular frameworks.</p>
              <div className="workshop-tag">Intermediate</div>
            </div>
            
            <div className="workshop-card">
              <div className="workshop-icon">🔐</div>
              <h3>Cybersecurity Essentials</h3>
              <p><strong>Day 2 • 3:00 PM - 6:00 PM</strong></p>
              <p>Learn to identify vulnerabilities and protect systems from cyber threats.</p>
              <div className="workshop-tag">All Levels</div>
            </div>
            
            <div className="workshop-card">
              <div className="workshop-icon">📊</div>
              <h3>Data Science & Analytics</h3>
              <p><strong>Day 3 • 10:00 AM - 1:00 PM</strong></p>
              <p>Master data analysis techniques with real-world datasets.</p>
              <div className="workshop-tag">Intermediate</div>
            </div>
          </div>
        </div>
        
        <div className="event-section">
          <h2>Workshop Registration</h2>
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
              <label htmlFor="workshop">Select Workshop</label>
              <select 
                id="workshop" 
                name="workshop" 
                value={formData.workshop} 
                onChange={handleChange}
              >
                <option value="web">Web Development Bootcamp (Day 1)</option>
                <option value="ai">AI & Machine Learning (Day 2)</option>
                <option value="security">Cybersecurity Essentials (Day 2)</option>
                <option value="data">Data Science & Analytics (Day 3)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="experience">Experience Level</label>
              <select 
                id="experience" 
                name="experience" 
                value={formData.experience} 
                onChange={handleChange}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <button type="submit" className="submit-button">Register Now</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Workshop;
