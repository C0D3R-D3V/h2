
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Simple key-value store for chatbot FAQ responses
const faqResponses = {
  "when": "FestX will be held on October 15-17, 2023 at KOED Learning College.",
  "where": "FestX is located at KOED Learning College, 123 College Road, Education City.",
  "tickets": "You can purchase tickets from our website. We offer day passes, concert tickets, and all-event passes.",
  "cost": "Day passes cost ₹499, concert tickets are ₹799, and the full festival pass is ₹1299.",
  "perform": "Our main performer is a famous singer (to be announced soon) and we'll have several other artists throughout the three days.",
  "sachin": "Cricket legend Sachin Tendulkar will be our chief guest for the sports events on day 2.",
  "food": "Food options include various stalls offering diverse cuisines, vegetarian and non-vegetarian options.",
  "parking": "Parking is available on campus. Please follow the signs for designated parking areas.",
  "accommodation": "We offer accommodation options nearby. Check the 'Stay Options' dropdown on our website.",
  "registration": "You can register for specific events through our website. Click on the 'Register Now' button for the event you're interested in.",
  "contact": "For queries, contact us at info@koedlearning.edu or call +91 98765 43210.",
  "timings": "The festival runs from 9AM to 10PM on all three days. Specific event timings are available in the schedule section.",
  "covid": "We follow all COVID-19 protocols. Masks are recommended, and hand sanitization stations are available throughout the venue.",
  "help": "I can help you with information about event schedule, tickets, venue, food options, and more. Just ask me what you want to know!"
};

// Process chatbot query
router.post('/query', async (req, res) => {
  try {
    const { query, user_id } = req.body;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Query is required'
      });
    }
    
    // Save query to database
    if (user_id) {
      const saveQuery = `
        INSERT INTO chatbot_queries (user_id, query_text)
        VALUES ($1, $2)
      `;
      await pool.query(saveQuery, [user_id, query]);
    }
    
    // Process the query (simple keyword matching for now)
    const lowerQuery = query.toLowerCase();
    let response = "I'm sorry, I don't have information about that yet. Please contact us at info@koedlearning.edu for more details.";
    
    // Check for keywords in the query
    if (lowerQuery.includes('when') || lowerQuery.includes('date')) {
      response = faqResponses.when;
    } else if (lowerQuery.includes('where') || lowerQuery.includes('venue') || lowerQuery.includes('location')) {
      response = faqResponses.where;
    } else if (lowerQuery.includes('ticket') || lowerQuery.includes('buy') || lowerQuery.includes('purchase')) {
      response = faqResponses.tickets;
    } else if (lowerQuery.includes('cost') || lowerQuery.includes('price') || lowerQuery.includes('how much')) {
      response = faqResponses.cost;
    } else if (lowerQuery.includes('perform') || lowerQuery.includes('artist') || lowerQuery.includes('singer')) {
      response = faqResponses.perform;
    } else if (lowerQuery.includes('sachin') || lowerQuery.includes('tendulkar') || lowerQuery.includes('cricket')) {
      response = faqResponses.sachin;
    } else if (lowerQuery.includes('food') || lowerQuery.includes('eat') || lowerQuery.includes('restaurant')) {
      response = faqResponses.food;
    } else if (lowerQuery.includes('park') || lowerQuery.includes('car') || lowerQuery.includes('vehicle')) {
      response = faqResponses.parking;
    } else if (lowerQuery.includes('stay') || lowerQuery.includes('hotel') || lowerQuery.includes('accommodation')) {
      response = faqResponses.accommodation;
    } else if (lowerQuery.includes('register') || lowerQuery.includes('sign up') || lowerQuery.includes('join')) {
      response = faqResponses.registration;
    } else if (lowerQuery.includes('contact') || lowerQuery.includes('call') || lowerQuery.includes('email')) {
      response = faqResponses.contact;
    } else if (lowerQuery.includes('time') || lowerQuery.includes('schedule') || lowerQuery.includes('when')) {
      response = faqResponses.timings;
    } else if (lowerQuery.includes('covid') || lowerQuery.includes('mask') || lowerQuery.includes('safety')) {
      response = faqResponses.covid;
    } else if (lowerQuery.includes('help') || lowerQuery.includes('assist') || lowerQuery.includes('support')) {
      response = faqResponses.help;
    }
    
    // Save response to database
    if (user_id) {
      const saveResponse = `
        UPDATE chatbot_queries 
        SET response_text = $1, responded_at = CURRENT_TIMESTAMP
        WHERE user_id = $2 AND query_text = $3 AND response_text IS NULL
        ORDER BY created_at DESC
        LIMIT 1
      `;
      await pool.query(saveResponse, [response, user_id, query]);
    }
    
    res.status(200).json({
      success: true,
      data: {
        query,
        response,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Error processing chatbot query:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process query'
    });
  }
});

// Get chat history for a user
router.get('/history/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const query = `
      SELECT id, query_text, response_text, created_at, responded_at
      FROM chatbot_queries
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 20
    `;
    const result = await pool.query(query, [user_id]);
    
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat history'
    });
  }
});

module.exports = router;
