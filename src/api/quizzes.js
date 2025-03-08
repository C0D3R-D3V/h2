
const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get all quizzes
router.get('/', async (req, res) => {
  try {
    const query = `
      SELECT id, title, description, created_at, is_active 
      FROM quizzes 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quizzes'
    });
  }
});

// Get quiz by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get quiz data
    const quizQuery = `
      SELECT * FROM quizzes 
      WHERE id = $1
    `;
    const quizResult = await pool.query(quizQuery, [id]);
    
    if (quizResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    // Get quiz questions
    const questionsQuery = `
      SELECT id, question_text, options 
      FROM quiz_questions 
      WHERE quiz_id = $1 
      ORDER BY id ASC
    `;
    const questionsResult = await pool.query(questionsQuery, [id]);
    
    const quizData = {
      ...quizResult.rows[0],
      questions: questionsResult.rows
    };
    
    res.status(200).json({
      success: true,
      data: quizData
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz'
    });
  }
});

// Submit quiz answers
router.post('/:id/submit', async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id } = req.params;
    const { user_id, answers } = req.body;
    
    if (!user_id || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: 'User ID and answers array are required'
      });
    }
    
    // Start transaction
    await client.query('BEGIN');
    
    // Check if quiz exists
    const quizQuery = 'SELECT * FROM quizzes WHERE id = $1';
    const quizResult = await client.query(quizQuery, [id]);
    
    if (quizResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }
    
    // Calculate score
    let score = 0;
    let totalQuestions = 0;
    
    for (const answer of answers) {
      const { question_id, selected_option } = answer;
      
      // Get correct answer for question
      const correctAnswerQuery = `
        SELECT correct_option FROM quiz_questions 
        WHERE id = $1 AND quiz_id = $2
      `;
      const correctAnswerResult = await client.query(correctAnswerQuery, [
        question_id, id
      ]);
      
      if (correctAnswerResult.rows.length > 0) {
        totalQuestions++;
        const correctOption = correctAnswerResult.rows[0].correct_option;
        
        if (selected_option === correctOption) {
          score++;
        }
        
        // Save user's answer
        const saveAnswerQuery = `
          INSERT INTO quiz_answers (
            quiz_id, question_id, user_id, selected_option, is_correct
          ) VALUES ($1, $2, $3, $4, $5)
        `;
        await client.query(saveAnswerQuery, [
          id, 
          question_id, 
          user_id, 
          selected_option, 
          selected_option === correctOption
        ]);
      }
    }
    
    // Save quiz submission
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
    
    const saveSubmissionQuery = `
      INSERT INTO quiz_submissions (
        quiz_id, user_id, score, total_questions, percentage
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING id, created_at
    `;
    const submissionResult = await client.query(saveSubmissionQuery, [
      id, user_id, score, totalQuestions, percentage
    ]);
    
    // Commit transaction
    await client.query('COMMIT');
    
    res.status(201).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        submission_id: submissionResult.rows[0].id,
        submission_date: submissionResult.rows[0].created_at,
        score,
        total_questions: totalQuestions,
        percentage
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error submitting quiz:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz'
    });
  } finally {
    client.release();
  }
});

// Get user's quiz results
router.get('/user/:user_id/results', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const query = `
      SELECT qs.id, q.title, qs.score, qs.total_questions, qs.percentage, qs.created_at
      FROM quiz_submissions qs
      JOIN quizzes q ON qs.quiz_id = q.id
      WHERE qs.user_id = $1
      ORDER BY qs.created_at DESC
    `;
    const result = await pool.query(query, [user_id]);
    
    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching user quiz results:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz results'
    });
  }
});

module.exports = router;
