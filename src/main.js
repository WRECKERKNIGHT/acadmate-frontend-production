import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';
import './styles/animations.css';
import './styles/responsive.css';
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(BrowserRouter, { children: _jsxs(AuthProvider, { children: [_jsx(App, {}), _jsx(Toaster, { position: "top-right", toastOptions: {
                        duration: 4000,
                        style: {
                            background: 'white',
                            color: '#374151',
                            boxShadow: '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.05)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                        },
                        success: {
                            iconTheme: {
                                primary: '#10b981',
                                secondary: 'white',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: 'white',
                            },
                        },
                    } })] }) }) }));
