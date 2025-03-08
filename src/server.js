const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const serverConfig = require('./config/server.config');

// Import API routes
const authRoutes = require('./api/auth');
const eventsRoutes = require('./api/events');
const quizzesRoutes = require('./api/quizzes');
const notificationsRoutes = require('./api/notifications');
const dashboardRoutes = require('./api/dashboard');
const ticketsRoutes = require('./api/tickets');
const chatbotRoutes = require('./api/chatbot');
const chatbotRoutes = require('./api/chatbot'); // Added chatbot routes

// Import middleware
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = serverConfig.port;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connected successfully');
  }
});

// Middleware
app.use(cors(serverConfig.corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/quizzes', quizzesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/chatbot', chatbotRoutes); // Added chatbot routes


// Protected route example
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'This is a protected route',
    user: req.user
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to FestX API',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./api/auth');
const initDatabase = require('./db/init');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
initDatabase().catch(err => {
  console.error('Failed to initialize database:', err);
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : '*',
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from public directory
app.use(express.static('public'));

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
