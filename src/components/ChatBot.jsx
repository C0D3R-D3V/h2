
import { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

const ChatBot = ({ isLoggedIn, userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm FestBot, your FestX assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history for logged-in users
  useEffect(() => {
    if (isLoggedIn && userId && isOpen) {
      fetchChatHistory();
    }
  }, [isLoggedIn, userId, isOpen]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`/api/chatbot/history/${userId}`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        // Convert the history to our message format (newest first in API response)
        const historyMessages = [];
        
        // Add welcome message first
        historyMessages.push({
          id: 'welcome',
          text: "Hello! I'm FestBot, your FestX assistant. How can I help you today?",
          sender: 'bot'
        });
        
        // Add chat history (from oldest to newest)
        data.data.reverse().forEach(item => {
          historyMessages.push({
            id: `user-${item.id}`,
            text: item.query_text,
            sender: 'user',
            timestamp: new Date(item.created_at).toLocaleTimeString()
          });
          
          if (item.response_text) {
            historyMessages.push({
              id: `bot-${item.id}`,
              text: item.response_text,
              sender: 'bot',
              timestamp: item.responded_at ? new Date(item.responded_at).toLocaleTimeString() : null
            });
          }
        });
        
        setMessages(historyMessages);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Show bot is typing
    setIsBotTyping(true);
    
    try {
      // Send query to backend
      const response = await fetch('/api/chatbot/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: inputText,
          user_id: isLoggedIn ? userId : null
        })
      });
      
      const data = await response.json();
      
      // Add bot response after a small delay for natural feeling
      setTimeout(() => {
        if (data.success) {
          const botMessage = {
            id: Date.now() + 1,
            text: data.data.response,
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString()
          };
          setMessages(prev => [...prev, botMessage]);
        } else {
          const errorMessage = {
            id: Date.now() + 1,
            text: "I'm sorry, I'm having trouble understanding. Please try again or contact our support team.",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString()
          };
          setMessages(prev => [...prev, errorMessage]);
        }
        setIsBotTyping(false);
      }, 1000);
    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Add error message
      setTimeout(() => {
        const errorMessage = {
          id: Date.now() + 1,
          text: "I'm sorry, I couldn't connect to my knowledge base. Please check your internet connection and try again.",
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsBotTyping(false);
      }, 1000);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chatbot toggle button */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <circle cx="15.5" cy="8.5" r="1.5"></circle>
              <path d="M7 13h10a4 4 0 0 1-4 4 4 4 0 0 1-4-4z"></path>
            </svg>
            <span className="chatbot-label">FestBot</span>
          </>
        )}
      </button>
      
      {/* Chatbot dialog */}
      {isOpen && (
        <div className="chatbot-dialog">
          <div className="chatbot-header">
            <div className="chatbot-avatar">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <circle cx="15.5" cy="8.5" r="1.5"></circle>
                <path d="M7 13h10a4 4 0 0 1-4 4 4 4 0 0 1-4-4z"></path>
              </svg>
            </div>
            <div className="chatbot-title">
              <h3>FestBot</h3>
              <p>FestX Virtual Assistant</p>
            </div>
            <button 
              className="chatbot-close" 
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`message ${message.sender === 'bot' ? 'bot' : 'user'}`}
              >
                {message.sender === 'bot' && (
                  <div className="message-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <circle cx="15.5" cy="8.5" r="1.5"></circle>
                      <path d="M7 13h10a4 4 0 0 1-4 4 4 4 0 0 1-4-4z"></path>
                    </svg>
                  </div>
                )}
                <div className="message-content">
                  <div className="message-text">{message.text}</div>
                  {message.timestamp && <div className="message-timestamp">{message.timestamp}</div>}
                </div>
              </div>
            ))}
            
            {isBotTyping && (
              <div className="message bot">
                <div className="message-avatar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <circle cx="15.5" cy="8.5" r="1.5"></circle>
                    <path d="M7 13h10a4 4 0 0 1-4 4 4 4 0 0 1-4-4z"></path>
                  </svg>
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          <form className="chatbot-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              placeholder="Type your message here..."
              disabled={isBotTyping}
            />
            <button 
              type="submit" 
              disabled={!inputText.trim() || isBotTyping}
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
