
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get user dashboard data
router.get('/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const userData = {};
    
    // Get user's event registrations
    const eventsQuery = `
      SELECT e.id, e.title, e.start_date, e.location, er.created_at as registered_on
      FROM event_registrations er
      JOIN events e ON er.event_id = e.id
      WHERE er.user_id = $1
      ORDER BY e.start_date ASC
    `;
    const eventsResult = await pool.query(eventsQuery, [user_id]);
    userData.events = eventsResult.rows;
    
    // Get user's tickets
    const ticketsQuery = `
      SELECT t.id, t.ticket_type, t.price, t.purchase_date, t.is_used,
        e.title as event_title, e.start_date
      FROM tickets t
      LEFT JOIN events e ON t.event_id = e.id
      WHERE t.user_id = $1
      ORDER BY t.purchase_date DESC
    `;
    const ticketsResult = await pool.query(ticketsQuery, [user_id]);
    userData.tickets = ticketsResult.rows;
    
    // Get user's quiz results
    const quizzesQuery = `
      SELECT qs.id, q.title, qs.score, qs.total_questions, qs.percentage,
        qs.created_at as completed_on
      FROM quiz_submissions qs
      JOIN quizzes q ON qs.quiz_id = q.id
      WHERE qs.user_id = $1
      ORDER BY qs.created_at DESC
    `;
    const quizzesResult = await pool.query(quizzesQuery, [user_id]);
    userData.quizzes = quizzesResult.rows;
    
    // Get unread notification count
    const notificationsQuery = `
      SELECT COUNT(*) as unread_count
      FROM notifications
      WHERE (user_id = $1 OR user_id IS NULL) AND is_read = FALSE
    `;
    const notificationsResult = await pool.query(notificationsQuery, [user_id]);
    userData.unread_notifications = parseInt(notificationsResult.rows[0].unread_count);
    
    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data'
    });
  }
});

module.exports = router;
