import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import AppTest from './App.test';
import { API_CONFIG } from './config/api';
// Log info about API configuration
console.log('🚀 Starting Educational Test Platform Frontend...');
console.log(`📡 Connecting to backend at: ${API_CONFIG.BASE_URL}`);
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(AppTest, {}) }));
