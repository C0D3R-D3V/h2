
import React from 'react';
import { createRoot } from 'react-dom/client';
import AppRoutes from './routes';
import './App.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<AppRoutes />);
