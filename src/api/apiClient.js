
import axios from 'axios';

// Create axios instance
const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Authentication API
export const authAPI = {
  // Register new user
  register: (userData) => {
    return apiClient.post('/auth/register', userData);
  },
  
  // Login user
  login: (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },
  
  // Logout user
  logout: () => {
    return apiClient.post('/auth/logout');
  },
  
  // Get current user
  getCurrentUser: () => {
    return apiClient.get('/auth/user');
  }
};

// Events API
export const eventsAPI = {
  // Get all events
  getAllEvents: () => {
    return apiClient.get('/events');
  },
  
  // Get event by ID
  getEvent: (eventId) => {
    return apiClient.get(`/events/${eventId}`);
  },
  
  // Register for event
  registerForEvent: (eventId, userId) => {
    return apiClient.post(`/events/${eventId}/register`, { user_id: userId });
  },
  
  // Get event registrations
  getEventRegistrations: (eventId) => {
    return apiClient.get(`/events/${eventId}/registrations`);
  }
};

// Quizzes API
export const quizzesAPI = {
  // Get all quizzes
  getAllQuizzes: () => {
    return apiClient.get('/quizzes');
  },
  
  // Get quiz by ID
  getQuiz: (quizId) => {
    return apiClient.get(`/quizzes/${quizId}`);
  },
  
  // Submit quiz
  submitQuiz: (quizId, userId, answers) => {
    return apiClient.post(`/quizzes/${quizId}/submit`, {
      user_id: userId,
      answers
    });
  },
  
  // Get user quiz results
  getUserQuizResults: (userId) => {
    return apiClient.get(`/quizzes/user/${userId}/results`);
  }
};

// Notifications API
export const notificationsAPI = {
  // Get user notifications
  getUserNotifications: (userId) => {
    return apiClient.get(`/notifications/user/${userId}`);
  },
  
  // Mark notification as read
  markAsRead: (notificationId, userId) => {
    return apiClient.patch(`/notifications/${notificationId}/read`, {
      user_id: userId
    });
  },
  
  // Mark all notifications as read
  markAllAsRead: (userId) => {
    return apiClient.patch(`/notifications/user/${userId}/read-all`);
  }
};

// Dashboard API
export const dashboardAPI = {
  // Get user dashboard data
  getUserDashboard: (userId) => {
    return apiClient.get(`/dashboard/user/${userId}`);
  }
};

// Tickets API
export const ticketsAPI = {
  // Purchase ticket
  purchaseTicket: (ticketData) => {
    return apiClient.post('/tickets/purchase', ticketData);
  },
  
  // Get user tickets
  getUserTickets: (userId) => {
    return apiClient.get(`/tickets/user/${userId}`);
  },
  
  // Validate ticket
  validateTicket: (ticketCode) => {
    return apiClient.post(`/tickets/validate/${ticketCode}`);
  }
};

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth headers here if using token-based auth
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 (Unauthorized) responses
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // You can implement token refresh logic here if using token-based auth
      
      return apiClient(originalRequest);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
