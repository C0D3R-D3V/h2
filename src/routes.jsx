import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import Login from './components/Login';
import Register from './components/Register';

// Import event-specific pages
import EventDetails from './components/EventDetails';
import ConcertRegistration from './components/ConcertRegistration';
import SportsRegistration from './components/SportsRegistration';
import MovieScreening from './components/MovieScreening';
import CricketScreening from './components/CricketScreening';
import Workshop from './components/Workshop';
import Hackathon from './components/Hackathon';

// Protected Route component
const ProtectedRoute = ({ children, requireAuth }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (requireAuth && !isLoggedIn) {
    // Redirect to login if auth is required but user is not logged in
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          // Clear any existing auth data if user is not authenticated
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/event-details" element={<EventDetails />} />

        {/* Protected routes - require authentication */}
        <Route path="/register-concert" element={
          <ProtectedRoute requireAuth={true}>
            <ConcertRegistration />
          </ProtectedRoute>
        } />

        <Route path="/register-sports" element={
          <ProtectedRoute requireAuth={true}>
            <SportsRegistration />
          </ProtectedRoute>
        } />

        <Route path="/register-movie" element={
          <ProtectedRoute requireAuth={true}>
            <MovieScreening />
          </ProtectedRoute>
        } />

        <Route path="/register-cricket" element={
          <ProtectedRoute requireAuth={true}>
            <CricketScreening />
          </ProtectedRoute>
        } />

        <Route path="/register-workshop" element={
          <ProtectedRoute requireAuth={true}>
            <Workshop />
          </ProtectedRoute>
        } />

        <Route path="/register-hackathon" element={
          <ProtectedRoute requireAuth={true}>
            <Hackathon />
          </ProtectedRoute>
        } />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;