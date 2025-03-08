
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Purchase a ticket
router.post('/purchase', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { user_id, ticket_type, event_id, price, quantity } = req.body;
    
    if (!user_id || !ticket_type || !price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Start transaction
    await client.query('BEGIN');
    
    const tickets = [];
    
    // Create tickets
    for (let i = 0; i < (quantity || 1); i++) {
      const ticketCode = uuidv4().substring(0, 8).toUpperCase();
      
      const query = `
        INSERT INTO tickets (
          user_id, ticket_type, event_id, price, ticket_code
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING id, ticket_code, purchase_date
      `;
      const result = await client.query(query, [
        user_id, ticket_type, event_id, price, ticketCode
      ]);
      
      tickets.push(result.rows[0]);
    }
    
    // If this is an event ticket, register the user for the event
    if (event_id) {
      const checkRegistration = `
        SELECT * FROM event_registrations 
        WHERE user_id = $1 AND event_id = $2
      `;
      const registrationResult = await client.query(checkRegistration, [user_id, event_id]);
      
      if (registrationResult.rows.length === 0) {
        const registerQuery = `
          INSERT INTO event_registrations (user_id, event_id)
          VALUES ($1, $2)
        `;
        await client.query(registerQuery, [user_id, event_id]);
      }
    }
    
    // Commit transaction
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      message: 'Ticket purchase successful',
      data: {
        tickets
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error purchasing ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to purchase ticket'
    });
  } finally {
    client.release();
  }
});

// Get user's tickets
router.get('/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const query = `
      SELECT t.id, t.ticket_type, t.price, t.purchase_date, t.is_used,
        t.ticket_code, e.title as event_title, e.start_date, e.location
      FROM tickets t
      LEFT JOIN events e ON t.event_id = e.id
      WHERE t.user_id = $1
      ORDER BY t.purchase_date DESC
    `;
    const result = await pool.query(query, [user_id]);
    
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tickets'
    });
  }
});

// Validate a ticket
router.post('/validate/:ticket_code', async (req, res) => {
  try {
    const { ticket_code } = req.params;
    
    // Get ticket details
    const query = `
      SELECT t.id, t.ticket_type, t.is_used, t.user_id,
        u.name as user_name, e.title as event_title
      FROM tickets t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN events e ON t.event_id = e.id
      WHERE t.ticket_code = $1
    `;
    const result = await pool.query(query, [ticket_code]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Invalid ticket code'
      });
    }
    
    const ticket = result.rows[0];
    
    if (ticket.is_used) {
      return res.status(400).json({
        success: false,
        message: 'Ticket has already been used',
        data: {
          ticket_id: ticket.id,
          ticket_type: ticket.ticket_type,
          user_name: ticket.user_name,
          event_title: ticket.event_title
        }
      });
    }
    
    // Mark ticket as used
    const updateQuery = `
      UPDATE tickets 
      SET is_used = TRUE, used_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING used_at
    `;
    const updateResult = await pool.query(updateQuery, [ticket.id]);
    
    res.status(200).json({
      success: true,
      message: 'Ticket validated successfully',
      data: {
        ticket_id: ticket.id,
        ticket_type: ticket.ticket_type,
        user_name: ticket.user_name,
        event_title: ticket.event_title,
        used_at: updateResult.rows[0].used_at
      }
    });
  } catch (error) {
    console.error('Error validating ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate ticket'
    });
  }
});

module.exports = router;
