
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT * FROM events 
      ORDER BY start_date ASC
    `;
    const result = await pool.query(query);
    
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events'
    });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT * FROM events 
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event'
    });
  }
});

// Register for an event
router.post('/:id/register', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    // Start transaction
    await client.query('BEGIN');
    
    // Check if event exists
    const eventQuery = 'SELECT * FROM events WHERE id = $1';
    const eventResult = await client.query(eventQuery, [id]);
    
    if (eventResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    // Check if registration exists
    const checkQuery = `
      SELECT * FROM event_registrations 
      WHERE event_id = $1 AND user_id = $2
    `;
    const checkResult = await client.query(checkQuery, [id, user_id]);
    
    if (checkResult.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({
        success: false,
        message: 'User already registered for this event'
      });
    }
    
    // Create registration
    const insertQuery = `
      INSERT INTO event_registrations (event_id, user_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    const insertResult = await client.query(insertQuery, [id, user_id]);
    
    // Commit transaction
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      message: 'Successfully registered for event',
      data: insertResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error registering for event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register for event'
    });
  } finally {
    client.release();
  }
});

// Get registered users for an event
router.get('/:id/registrations', async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT u.id, u.name, u.email, er.created_at as registration_date
      FROM event_registrations er
      JOIN users u ON er.user_id = u.id
      WHERE er.event_id = $1
      ORDER BY er.created_at DESC
    `;
    const result = await pool.query(query, [id]);
    
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event registrations'
    });
  }
});

module.exports = router;
