import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import MainHomepage from './pages/MainHomepage'
import EnhancedLoginForm from './components/EnhancedLoginForm'
import StudentDashboard from './components/StudentDashboard'
import TeacherDashboard from './components/TeacherDashboard'
import HeadTeacherDashboard from './components/HeadTeacherDashboard'

function App() {
  const { user, loading } = useAuth()
  const [showLogin, setShowLogin] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-4">ACADMATE</h1>
          <p className="text-lg font-medium text-cyan-400 animate-pulse mb-6">Loading your premium experience...</p>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    if (showLogin) {
      return <EnhancedLoginForm onBackToHome={() => setShowLogin(false)} />
    }
    return <MainHomepage />
  }

  const getDashboard = () => {
    switch (user.role) {
      case 'STUDENT':
        return <StudentDashboard />
      case 'TEACHER':
        return <TeacherDashboard />
      case 'HEAD_TEACHER':
        return <HeadTeacherDashboard />
      default:
        return <StudentDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Routes>
        <Route path="/" element={getDashboard()} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}


export default App
