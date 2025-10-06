
import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/globals.css';
import CoachingHomepage from './components/CoachingHomepage';
import PremiumHomepage from './components/PremiumHomepage';
import EnhancedLoginForm from './components/EnhancedLoginForm';
const StudentDashboard = React.lazy(() => import('./components/dashboard/StudentDashboard'));
const TeacherDashboard = React.lazy(() => import('./components/dashboard/TeacherDashboard'));
const AdminDashboard = React.lazy(() => import('./components/dashboard/AdminDashboard'));
const AttendanceSystem = React.lazy(() => import('./components/attendance/AttendanceSystem'));
const EnhancedLeaderboard = React.lazy(() => import('./components/leaderboard/EnhancedLeaderboard'));
const EnhancedOfflineTestManager = React.lazy(() => import('./components/tests/EnhancedOfflineTestManager'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cyan-400 text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function DashboardRouter() {
  const { user } = useAuth();
  
  if (!user) return null;
  
  switch (user.role) {
    case 'STUDENT':
    case 'student':
      return <StudentDashboard />;
    case 'TEACHER':
    case 'teacher':
      return <TeacherDashboard />;
    case 'HEAD_TEACHER':
    case 'head_teacher':
    case 'admin':
      return <AdminDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
}

function AppContent() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<CoachingHomepage />} />
          <Route path="/premium" element={<PremiumHomepage />} />
          <Route path="/login" element={<EnhancedLoginForm />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<div />}>
                  <DashboardRouter />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          {/* Fallback route: always show premium homepage if no match */}
          <Route path="*" element={<PremiumHomepage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AppContent />
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#0a0a0a',
            color: '#00ffff',
            border: '1px solid #00ffff',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
          }
        }}
      />
    </ErrorBoundary>
  );
}

export default App;
