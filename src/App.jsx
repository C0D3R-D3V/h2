
import { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [notifications, setNotifications] = useState([
    {id: 1, message: "New artist announcement coming soon!", isNew: true},
    {id: 2, message: "Early bird tickets now available!", isNew: true},
    {id: 3, message: "Workshop registration opens tomorrow", isNew: false}
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [newNotificationCount, setNewNotificationCount] = useState(2);
  
  const toggleDropdown = (dropdown) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdown);
    }
  };

  const markAllNotificationsAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({
      ...notif,
      isNew: false
    }));
    setNotifications(updatedNotifications);
    setNewNotificationCount(0);
  };

  // Simulate incoming notifications
  useEffect(() => {
    const interval = setInterval(() => {
      const randomId = Math.floor(Math.random() * 1000);
      const newNotification = {
        id: randomId,
        message: `${randomId % 2 === 0 ? "New event added!" : "Schedule update!"} Check it out!`,
        isNew: true
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
      setNewNotificationCount(prev => prev + 1);
    }, 45000); // New notification every 45 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <header>
        <div className="logo-container">
          <img src="https://via.placeholder.com/80x80" alt="FestX Logo" className="logo" />
          <h1>FestX at KOED Learning</h1>
          <span className="event-date">October 15-17, 2023</span>
        </div>
        
        <nav>
          <div className="nav-dropdowns">
            <div className="dropdown">
              <button className="dropdown-btn" onClick={() => toggleDropdown('events')}>
                Events
                <span className={`arrow ${activeDropdown === 'events' ? 'up' : 'down'}`}></span>
              </button>
              {activeDropdown === 'events' && (
                <div className="dropdown-content">
                  <a href="#event-details">Event Details</a>
                  <a href="#register-concert">Concert Night</a>
                  <a href="#register-sports">Sports Meet</a>
                  <a href="#register-movie">Movie Screening</a>
                  <a href="#register-cricket">Cricket Screening</a>
                  <a href="#register-workshop">Technical Workshops</a>
                  <a href="#register-hackathon">Hackathon</a>
                </div>
              )}
            </div>
            
            <div className="dropdown">
              <button className="dropdown-btn" onClick={() => toggleDropdown('artists')}>
                Artists
                <span className={`arrow ${activeDropdown === 'artists' ? 'up' : 'down'}`}></span>
              </button>
              {activeDropdown === 'artists' && (
                <div className="dropdown-content">
                  <a href="#featured-artist">Featured Singer</a>
                  <a href="#guest-performers">Guest Performers</a>
                  <a href="#artist-schedule">Performance Schedule</a>
                  <a href="#artist-gallery">Artist Gallery</a>
                </div>
              )}
            </div>
            
            <div className="dropdown">
              <button className="dropdown-btn" onClick={() => toggleDropdown('venue')}>
                Venue
                <span className={`arrow ${activeDropdown === 'venue' ? 'up' : 'down'}`}></span>
              </button>
              {activeDropdown === 'venue' && (
                <div className="dropdown-content">
                  <a href="#about-venue">About KOED Campus</a>
                  <a href="#venue-map">Venue Map</a>
                  <a href="#stay-options">Stay Options</a>
                  <a href="#directions">How to Reach</a>
                </div>
              )}
            </div>
            
            <div className="dropdown">
              <button className="dropdown-btn" onClick={() => toggleDropdown('food')}>
                Food
                <span className={`arrow ${activeDropdown === 'food' ? 'up' : 'down'}`}></span>
              </button>
              {activeDropdown === 'food' && (
                <div className="dropdown-content">
                  <a href="#food-stalls">Food Stalls</a>
                  <a href="#food-menu">Menu</a>
                  <a href="#pre-order">Pre-order Food</a>
                  <a href="https://food-delivery.example.com" target="_blank" rel="noopener noreferrer">Order Online</a>
                </div>
              )}
            </div>
            
            <div className="dropdown">
              <button className="dropdown-btn" onClick={() => toggleDropdown('merch')}>
                Merchandise
                <span className={`arrow ${activeDropdown === 'merch' ? 'up' : 'down'}`}></span>
              </button>
              {activeDropdown === 'merch' && (
                <div className="dropdown-content">
                  <a href="#official-merch">Official Merch</a>
                  <a href="#limited-editions">Limited Editions</a>
                  <a href="#artist-merch">Artist Merchandise</a>
                </div>
              )}
            </div>
          </div>
          
          <div className="user-actions">
            <div className="notification-bell" onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) markAllNotificationsAsRead();
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              {newNotificationCount > 0 && <span className="notification-badge">{newNotificationCount}</span>}
              
              {showNotifications && (
                <div className="notifications-dropdown">
                  <div className="notifications-header">
                    <h3>Notifications</h3>
                    <button onClick={markAllNotificationsAsRead}>Mark all as read</button>
                  </div>
                  <div className="notifications-list">
                    {notifications.length === 0 ? (
                      <p className="no-notifications">No notifications yet</p>
                    ) : (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`notification-item ${notification.isNew ? 'new' : ''}`}
                        >
                          {notification.message}
                        </div>
                      ))
                    )}
                  </div>
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
          </div>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h2>Welcome to FestX 2023</h2>
          <p>A 3-day extravaganza of music, sports, entertainment, and more!</p>
          <div className="cta-buttons">
            <button className="cta-button primary">Register Now</button>
            <button className="cta-button secondary">View Schedule</button>
          </div>
        </div>
      </section>

      <section className="highlights">
        <div className="section-header">
          <h2>Festival Highlights</h2>
          <p>Don't miss these amazing events</p>
        </div>
        <div className="highlight-cards">
          <div className="highlight-card">
            <img src="https://via.placeholder.com/300x200" alt="Concert" />
            <div className="card-content">
              <h3>Concert Night</h3>
              <p>Featuring Famous Singer live in concert</p>
              <button className="card-btn">Book Tickets</button>
            </div>
          </div>
          <div className="highlight-card">
            <img src="https://via.placeholder.com/300x200" alt="Sports Meet" />
            <div className="card-content">
              <h3>Sports Meet</h3>
              <p>With cricket legend Sachin Tendulkar as chief guest</p>
              <button className="card-btn">Register</button>
            </div>
          </div>
          <div className="highlight-card">
            <img src="https://via.placeholder.com/300x200" alt="Movie Screening" />
            <div className="card-content">
              <h3>Movie Screening</h3>
              <p>Exclusive premiere of blockbuster movies</p>
              <button className="card-btn">View Schedule</button>
            </div>
          </div>
          <div className="highlight-card">
            <img src="https://via.placeholder.com/300x200" alt="Hackathon" />
            <div className="card-content">
              <h3>Hackathon</h3>
              <p>48-hour coding challenge with amazing prizes</p>
              <button className="card-btn">Join Now</button>
            </div>
          </div>
        </div>
      </section>

      <section className="quiz-challenge">
        <div className="section-header flip">
          <h2>Interactive Challenges</h2>
          <p>Test your knowledge and win prizes</p>
        </div>
        <div className="quiz-container">
          <div className="quiz-info">
            <h3>Fest Trivia Quiz</h3>
            <p>Answer questions about previous editions of FestX and win exciting merchandise</p>
            <button className="quiz-btn">Start Quiz</button>
          </div>
          <div className="quiz-image">
            <img src="https://via.placeholder.com/400x300" alt="Quiz Challenge" />
          </div>
        </div>
      </section>

      <section className="schedule">
        <div className="section-header">
          <h2>Event Schedule</h2>
          <p>Plan your perfect FestX experience</p>
        </div>
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
        <div className="section-header flip">
          <h2>Ticket Information</h2>
          <p>Get your passes before they're sold out</p>
        </div>
        <div className="ticket-cards">
          <div className="ticket-card">
            <h3>Day Pass</h3>
            <div className="price">₹499</div>
            <ul>
              <li>Access to all events for one day</li>
              <li>Free refreshments</li>
            </ul>
            <div className="payment-options">
              <button className="buy-btn">Buy Now</button>
              <div className="payment-methods">
                <span>Pay with:</span>
                <div className="payment-icons">
                  <i className="payment-icon">💳</i>
                  <i className="payment-icon">🏦</i>
                  <i className="payment-icon">📱</i>
                </div>
              </div>
            </div>
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
            <div className="payment-options">
              <button className="buy-btn">Buy Now</button>
              <div className="payment-methods">
                <span>Pay with:</span>
                <div className="payment-icons">
                  <i className="payment-icon">💳</i>
                  <i className="payment-icon">🏦</i>
                  <i className="payment-icon">📱</i>
                </div>
              </div>
            </div>
          </div>
          <div className="ticket-card">
            <h3>Concert Only</h3>
            <div className="price">₹799</div>
            <ul>
              <li>Access to concert night only</li>
              <li>Free refreshments</li>
            </ul>
            <div className="payment-options">
              <button className="buy-btn">Buy Now</button>
              <div className="payment-methods">
                <span>Pay with:</span>
                <div className="payment-icons">
                  <i className="payment-icon">💳</i>
                  <i className="payment-icon">🏦</i>
                  <i className="payment-icon">📱</i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="user-dashboard">
        <div className="section-header">
          <h2>My Dashboard</h2>
          <p>Track your registrations and activity</p>
        </div>
        {isLoggedIn ? (
          <div className="dashboard-content">
            <div className="dashboard-card">
              <h3>My Events</h3>
              <p>You haven't registered for any events yet.</p>
              <button>Browse Events</button>
            </div>
            <div className="dashboard-card">
              <h3>My Tickets</h3>
              <p>No tickets purchased.</p>
              <button>Buy Tickets</button>
            </div>
            <div className="dashboard-card">
              <h3>My Quiz Scores</h3>
              <p>You haven't participated in any quizzes yet.</p>
              <button>Try a Quiz</button>
            </div>
          </div>
        ) : (
          <div className="login-prompt">
            <p>Please log in to view your dashboard</p>
            <button onClick={() => setIsLoggedIn(true)}>Login Now</button>
          </div>
        )}
      </section>

      <section className="sponsors">
        <div className="section-header flip">
          <h2>Our Sponsors</h2>
          <p>Thanks to our amazing partners</p>
        </div>
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
