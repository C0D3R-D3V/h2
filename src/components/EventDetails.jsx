
import React from 'react';
import './EventPages.css';
import BackButton from './BackButton';

const EventDetails = () => {
  return (
    <div className="event-page-container">
      <BackButton />
      <div className="event-page-header">
        <h1>Event Details</h1>
      </div>
      <div className="event-page-content">
        <div className="event-section">
          <h2>FestX 2023 Overview</h2>
          <p>FestX 2023 is a 3-day extravaganza hosted by KOED Learning College featuring concerts, sports events, movie screenings, workshops, and much more.</p>
          
          <div className="event-detail-card">
            <div className="event-detail-icon">📅</div>
            <div className="event-detail-info">
              <h3>Dates</h3>
              <p>October 15-17, 2023</p>
            </div>
          </div>
          
          <div className="event-detail-card">
            <div className="event-detail-icon">📍</div>
            <div className="event-detail-info">
              <h3>Venue</h3>
              <p>KOED Learning College Campus, 123 College Road, Education City</p>
            </div>
          </div>
          
          <div className="event-detail-card">
            <div className="event-detail-icon">🎭</div>
            <div className="event-detail-info">
              <h3>Key Attractions</h3>
              <ul>
                <li>Celebrity Concert Night</li>
                <li>Sports Meet with Sachin Tendulkar</li>
                <li>Exclusive Movie Screenings</li>
                <li>Cricket Match Screenings</li>
                <li>Technical Workshops</li>
                <li>48-hour Hackathon</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="event-section">
          <h2>Daily Schedule Highlights</h2>
          
          <div className="event-schedule-card">
            <h3>Day 1 (October 15)</h3>
            <ul>
              <li><strong>10:00 AM</strong> - Opening Ceremony</li>
              <li><strong>2:00 PM</strong> - Sports Tournament Begins</li>
              <li><strong>6:00 PM</strong> - Movie Screening</li>
            </ul>
          </div>
          
          <div className="event-schedule-card">
            <h3>Day 2 (October 16)</h3>
            <ul>
              <li><strong>11:00 AM</strong> - Technical Workshops</li>
              <li><strong>3:00 PM</strong> - Cricket Screening with Sachin Tendulkar</li>
              <li><strong>8:00 PM</strong> - Celebrity Concert</li>
            </ul>
          </div>
          
          <div className="event-schedule-card">
            <h3>Day 3 (October 17)</h3>
            <ul>
              <li><strong>10:00 AM</strong> - Hackathon Finals</li>
              <li><strong>2:00 PM</strong> - Cultural Performances</li>
              <li><strong>7:00 PM</strong> - Closing Ceremony & Awards</li>
            </ul>
          </div>
        </div>
        
        <div className="event-section">
          <h2>Ticket Information</h2>
          <div className="ticket-info-container">
            <div className="ticket-info-card">
              <h3>Day Pass</h3>
              <p className="ticket-price">₹499</p>
              <p>Access to all events for one day</p>
            </div>
            
            <div className="ticket-info-card featured">
              <div className="featured-label">Best Value</div>
              <h3>Full Festival Pass</h3>
              <p className="ticket-price">₹1299</p>
              <p>Access to all events for all 3 days</p>
            </div>
            
            <div className="ticket-info-card">
              <h3>Concert Only</h3>
              <p className="ticket-price">₹799</p>
              <p>Access to concert night only</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
