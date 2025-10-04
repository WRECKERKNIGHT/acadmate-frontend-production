import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppTest from './App.test';
import { API_CONFIG } from './config/api';

// Log info about API configuration
console.log('🚀 Starting Educational Test Platform Frontend...');
console.log(`📡 Connecting to backend at: ${API_CONFIG.BASE_URL}`);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppTest />
  </React.StrictMode>,
);