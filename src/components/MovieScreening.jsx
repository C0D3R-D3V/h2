
import React, { useState } from 'react';
import './EventPages.css';

const MovieScreening = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    movieChoice: 'movie1',
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
    alert('Movie screening registration submitted! Check your email for confirmation.');
  };

  return (
    <div className="event-page-container">
      <div className="event-page-header movie-header">
        <h1>Movie Screening Registration</h1>
      </div>
      <div className="event-page-content">
        <div className="event-section">
          <h2>Exclusive Movie Premieres</h2>
          <p className="event-highlight">All three days • 6:00 PM to 9:00 PM • Open Air Theater</p>
          
          <div className="event-image-container">
            <img src="https://via.placeholder.com/800x400" alt="Movie Screening" className="event-feature-image" />
          </div>
          
          <p className="event-description">
            Experience the magic of cinema under the stars! FestX brings you exclusive movie 
            screenings including premieres and classics, all in our state-of-the-art open air 
            theater with premium sound and visual setup.
          </p>
        </div>
        
        <div className="event-section">
          <h2>Movie Schedule</h2>
          <div className="movie-schedule">
            <div className="movie-day">
              <h3>Day 1 (Oct 15)</h3>
              <div className="movie-card">
                <img src="https://via.placeholder.com/120x180" alt="Movie 1" />
                <div className="movie-info">
                  <h4>The New Blockbuster</h4>
                  <p>Genre: Action/Adventure</p>
                  <p>Duration: 2h 15m</p>
                  <p>Starts: 6:30 PM</p>
                </div>
              </div>
            </div>
            
            <div className="movie-day">
              <h3>Day 2 (Oct 16)</h3>
              <div className="movie-card">
                <img src="https://via.placeholder.com/120x180" alt="Movie 2" />
                <div className="movie-info">
                  <h4>Award-Winning Drama</h4>
                  <p>Genre: Drama</p>
                  <p>Duration: 1h 55m</p>
                  <p>Starts: 6:30 PM</p>
                </div>
              </div>
            </div>
            
            <div className="movie-day">
              <h3>Day 3 (Oct 17)</h3>
              <div className="movie-card">
                <img src="https://via.placeholder.com/120x180" alt="Movie 3" />
                <div className="movie-info">
                  <h4>Comedy Special</h4>
                  <p>Genre: Comedy</p>
                  <p>Duration: 1h 45m</p>
                  <p>Starts: 6:30 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="event-section">
          <h2>Movie Screening Registration</h2>
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
              <label htmlFor="movieChoice">Movie Selection</label>
              <select 
                id="movieChoice" 
                name="movieChoice" 
                value={formData.movieChoice} 
                onChange={handleChange}
              >
                <option value="movie1">Day 1: The New Blockbuster</option>
                <option value="movie2">Day 2: Award-Winning Drama</option>
                <option value="movie3">Day 3: Comedy Special</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="seating">Seating Type</label>
              <select 
                id="seating" 
                name="seating" 
                value={formData.seating} 
                onChange={handleChange}
              >
                <option value="standard">Standard (₹199)</option>
                <option value="premium">Premium (₹349)</option>
                <option value="vip">VIP with Refreshments (₹499)</option>
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

export default MovieScreening;
