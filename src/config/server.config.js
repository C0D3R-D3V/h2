
/**
 * Server configuration for FestX application
 */

module.exports = {
  port: process.env.PORT || 3001,
  environment: process.env.NODE_ENV || 'development',
  corsOptions: {
    origin: process.env.FRONTEND_URL || true,
    credentials: true
  },
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict'
  }
};
module.exports = {
  port: process.env.PORT || 3000,
  corsOptions: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://festx.repl.co'] 
      : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: 200
  }
};
