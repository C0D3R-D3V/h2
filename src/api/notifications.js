
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get user notifications
router.get('/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const query = `
      SELECT id, title, message, is_read, created_at 
      FROM notifications 
      WHERE user_id = $1 OR user_id IS NULL
      ORDER BY created_at DESC
      LIMIT 20
    `;
    const result = await pool.query(query, [user_id]);
    
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

// Mark notification as read
router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    const query = `
      UPDATE notifications 
      SET is_read = TRUE 
      WHERE id = $1 AND (user_id = $2 OR user_id IS NULL)
      RETURNING id, title, is_read
    `;
    const result = await pool.query(query, [id, user_id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification'
    });
  }
});

// Mark all notifications as read
router.patch('/user/:user_id/read-all', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const query = `
      UPDATE notifications 
      SET is_read = TRUE 
      WHERE (user_id = $1 OR user_id IS NULL) AND is_read = FALSE
      RETURNING id
    `;
    const result = await pool.query(query, [user_id]);
    
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      data: {
        count: result.rows.length
      }
    });
  } catch (error) {
    console.error('Error updating notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notifications'
    });
  }
});

// Create a notification (for admins)
router.post('/', async (req, res) => {
  try {
    const { title, message, user_id } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }
    
    const query = `
      INSERT INTO notifications (title, message, user_id)
      VALUES ($1, $2, $3)
      RETURNING id, title, message, created_at
    `;
    const result = await pool.query(query, [title, message, user_id || null]);
    
    res.status(201).json({
      success: true,
      message: 'Notification created successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notification'
    });
  }
});

module.exports = router;
