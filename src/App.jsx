
import { useState } from 'react';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo-container">
          <img src="https://via.placeholder.com/80x80" alt="FestX Logo" className="logo" />
          <h1>FestX at KOED Learning</h1>
        </div>
        <div className="date-badge">October 15-17, 2023</div>
        <nav>
          <div className="dropdown">
            <button className="dropdown-btn" onClick={toggleDropdown}>
              Event Registration
              <span className={`arrow ${isDropdownOpen ? 'up' : 'down'}`}></span>
            </button>
            {isDropdownOpen && (
              <div className="dropdown-content">
                <a href="#event-details">Event Details</a>
                <a href="#register-concert">Register for Concert</a>
                <a href="#register-sports">Register for Sports Meet</a>
                <a href="#register-movie">Register for Movie Screening</a>
                <a href="#register-cricket">Register for Cricket Screening</a>
                <a href="#register-workshop">Register for Workshop</a>
                <a href="#register-hackathon">Register for Hackathon</a>
              </div>
            )}
          </div>
          <div className="auth-buttons">
            {isLoggedIn ? (
              <button onClick={() => setIsLoggedIn(false)}>Logout</button>
            ) : (
              <>
                <button onClick={() => setIsLoggedIn(true)}>Login</button>
                <button className="register-btn">Register</button>
              </>
            )}
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h2>Welcome to FestX 2023</h2>
          <p>A 3-day extravaganza of music, sports, entertainment, and more!</p>
          <button className="cta-button">Register Now</button>
        </div>
      </section>

      <section className="highlights">
        <div className="highlight-card">
          <img src="https://via.placeholder.com/300x200" alt="Concert" />
          <h3>Concert Night</h3>
          <p>Featuring Famous Singer live in concert</p>
        </div>
        <div className="highlight-card">
          <img src="https://via.placeholder.com/300x200" alt="Sports Meet" />
          <h3>Sports Meet</h3>
          <p>With cricket legend Sachin Tendulkar as chief guest</p>
        </div>
        <div className="highlight-card">
          <img src="https://via.placeholder.com/300x200" alt="Movie Screening" />
          <h3>Movie Screening</h3>
          <p>Exclusive premiere of blockbuster movies</p>
        </div>
        <div className="highlight-card">
          <img src="https://via.placeholder.com/300x200" alt="Cricket Screening" />
          <h3>Cricket Screening</h3>
          <p>Watch the match live with friends</p>
        </div>
      </section>

      <section className="schedule">
        <h2>Event Schedule</h2>
        <div className="day-tabs">
          <button className="day-tab active">Day 1</button>
          <button className="day-tab">Day 2</button>
          <button className="day-tab">Day 3</button>
        </div>
        <div className="schedule-content">
          <div className="schedule-item">
            <div className="time">10:00 AM - 12:00 PM</div>
            <div className="event-details">
              <h4>Opening Ceremony</h4>
              <p>Main Auditorium</p>
            </div>
          </div>
          <div className="schedule-item">
            <div className="time">2:00 PM - 4:00 PM</div>
            <div className="event-details">
              <h4>Sports Tournament Begins</h4>
              <p>College Grounds</p>
            </div>
          </div>
          <div className="schedule-item">
            <div className="time">6:00 PM - 9:00 PM</div>
            <div className="event-details">
              <h4>Movie Screening</h4>
              <p>Open Air Theater</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tickets">
        <h2>Ticket Information</h2>
        <div className="ticket-cards">
          <div className="ticket-card">
            <h3>Day Pass</h3>
            <div className="price">₹499</div>
            <ul>
              <li>Access to all events for one day</li>
              <li>Free refreshments</li>
            </ul>
            <button>Buy Now</button>
          </div>
          <div className="ticket-card featured">
            <div className="featured-label">Best Value</div>
            <h3>Full Festival Pass</h3>
            <div className="price">₹1299</div>
            <ul>
              <li>Access to all events for all 3 days</li>
              <li>VIP seating for concert</li>
              <li>Free merchandise</li>
              <li>Free refreshments</li>
            </ul>
            <button>Buy Now</button>
          </div>
          <div className="ticket-card">
            <h3>Concert Only</h3>
            <div className="price">₹799</div>
            <ul>
              <li>Access to concert night only</li>
              <li>Free refreshments</li>
            </ul>
            <button>Buy Now</button>
          </div>
        </div>
      </section>

      <section className="sponsors">
        <h2>Our Sponsors</h2>
        <div className="sponsor-logos">
          <img src="https://via.placeholder.com/150x80" alt="Red Bull" />
          <img src="https://via.placeholder.com/150x80" alt="Sponsor 2" />
          <img src="https://via.placeholder.com/150x80" alt="Sponsor 3" />
          <img src="https://via.placeholder.com/150x80" alt="Sponsor 4" />
          <img src="https://via.placeholder.com/150x80" alt="Sponsor 5" />
        </div>
      </section>

      <footer>
        <div className="footer-content">
          <div className="contact-info">
            <h3>Contact Us</h3>
            <p>KOED Learning College</p>
            <p>123 College Road, Education City</p>
            <p>Email: info@koedlearning.edu</p>
            <p>Phone: +91 98765 43210</p>
          </div>
          <div className="map-container">
            <h3>Find Us</h3>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9988795839354!2d77.5009!3d12.9719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU4JzE4LjkiTiA3N8KwMzAnMDMuMiJF!5e0!3m2!1sen!2sin!4v1625835563219!5m2!1sen!2sin" 
              width="100%" 
              height="200" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              title="College Location"
            ></iframe>
          </div>
          <div className="social-links">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="#facebook" className="social-icon">FB</a>
              <a href="#instagram" className="social-icon">IG</a>
              <a href="#twitter" className="social-icon">TW</a>
              <a href="#youtube" className="social-icon">YT</a>
            </div>
          </div>
        </div>
        <div className="copyright">
          © 2023 FestX at KOED Learning. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
