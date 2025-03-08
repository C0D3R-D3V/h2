import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import EventDetails from './components/EventDetails';
import ConcertRegistration from './components/ConcertRegistration';
import SportsRegistration from './components/SportsRegistration';
import MovieScreening from './components/MovieScreening';
import CricketScreening from './components/CricketScreening';
import Workshop from './components/Workshop';
import Hackathon from './components/Hackathon';
import Login from './components/Login';
import Register from './components/Register';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/event-details" element={<EventDetails />} />
        <Route path="/register-concert" element={<ConcertRegistration />} />
        <Route path="/register-sports" element={<SportsRegistration />} />
        <Route path="/register-movie" element={<MovieScreening />} />
        <Route path="/register-cricket" element={<CricketScreening />} />
        <Route path="/register-workshop" element={<Workshop />} />
        <Route path="/register-hackathon" element={<Hackathon />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;