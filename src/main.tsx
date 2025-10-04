import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import './index.css'

// Performance monitoring
if (import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true') {
  // Monitor Web Vitals
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(console.log)
    getFID(console.log)
    getFCP(console.log)
    getLCP(console.log)
    getTTFB(console.log)
  })
}

const root = ReactDOM.createRoot(document.getElementById('root')!)

// Force pure black theme
document.documentElement.style.backgroundColor = '#000000'
document.body.style.backgroundColor = '#000000'
document.body.style.color = '#ffffff'
document.documentElement.classList.add('dark')
document.body.classList.add('dark')

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
            background: 'rgba(0, 0, 0, 0.95)',
            color: '#ffffff',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 212, 255, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(20px)',
            },
            success: {
              style: {
                background: 'rgba(0, 0, 0, 0.95)',
                border: '1px solid rgba(0, 255, 136, 0.3)',
                boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)',
              },
              iconTheme: {
                primary: '#29ff7a',
                secondary: '#0f172a',
              },
            },
            error: {
              style: {
                background: 'rgba(0, 0, 0, 0.95)',
                border: '1px solid rgba(255, 51, 102, 0.3)',
                boxShadow: '0 0 20px rgba(255, 51, 102, 0.3)',
              },
              iconTheme: {
                primary: '#ff29c3',
                secondary: '#0f172a',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
