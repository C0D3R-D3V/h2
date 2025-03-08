
import { useState, useRef, useEffect } from 'react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm RoboFest, your FestX assistant. How can I help you today?", isBot: true }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const chatbotRef = useRef(null);

  const faqAnswers = {
    "event": "FestX will be held from October 15-17, 2023, at KOED Learning College campus.",
    "tickets": "Tickets are available in three categories: Day Pass (₹499), Full Festival Pass (₹1299), and Concert Only (₹799). You can purchase them directly from our website.",
    "schedule": "The event has activities spread across 3 days. Day 1 includes Opening Ceremony, Sports Tournament, and Movie Screening. Check the schedule section for detailed timings.",
    "performers": "Our main performer is a Famous Singer (to be announced soon!). We'll also have various artists performing throughout the 3-day event.",
    "location": "FestX is being held at KOED Learning College, 123 College Road, Education City. Check the map at the bottom of the page for directions.",
    "food": "Various food stalls will be available at the venue. You can also pre-order food through our website.",
    "accommodation": "We have partnered with nearby hotels for stay options. Check the 'Stay Options' dropdown for more details.",
    "registration": "You can register for specific events through our website. Click on the 'Register Now' button or navigate through the Events dropdown.",
    "contact": "For any queries, contact us at info@koedlearning.edu or call +91 98765 43210.",
    "merchandise": "Official FestX merchandise will be available for purchase at the venue and through our website."
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = { id: Date.now(), text: inputValue, isBot: false };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      let response = "I'm not sure about that. Can you try asking something about event details, tickets, schedule, performers, location, food, accommodation, registration, contact information, or merchandise?";
      
      const userQuery = inputValue.toLowerCase();
      
      // Check for keywords in the user query
      for (const [keyword, answer] of Object.entries(faqAnswers)) {
        if (userQuery.includes(keyword)) {
          response = answer;
          break;
        }
      }

      const botMessage = { id: Date.now() + 1, text: response, isBot: true };
      setMessages(prevMessages => [...prevMessages, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="chatbot-container" ref={chatbotRef}>
      {!isOpen ? (
        <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
          <div className="robot-icon">🤖</div>
          <span>Chat with RoboFest</span>
        </button>
      ) : (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <div className="robot-avatar">🤖</div>
              <div>
                <h3>RoboFest Assistant</h3>
                <span className="status-online">Online</span>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
          </div>
          <div className="chatbot-messages">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`message ${message.isBot ? 'bot' : 'user'}`}
              >
                {message.isBot && <div className="bot-avatar">🤖</div>}
                <div className="message-bubble">{message.text}</div>
              </div>
            ))}
            {isTyping && (
              <div className="message bot">
                <div className="bot-avatar">🤖</div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me anything about FestX..."
            />
            <button type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
