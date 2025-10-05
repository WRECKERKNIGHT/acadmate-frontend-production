import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingStates from './components/LoadingStates';

// Lazy load components for better performance
const PremiumHomepage = React.lazy(() => import('./components/PremiumHomepage'));
const EnhancedLoginForm = React.lazy(() => import('./components/EnhancedLoginForm'));
const StudentDashboard = React.lazy(() => import('./components/StudentDashboard'));
const TeacherDashboard = React.lazy(() => import('./components/TeacherDashboard'));
const HeadTeacherDashboard = React.lazy(() => import('./components/HeadTeacherDashboard'));
const AttendancePage = React.lazy(() => import('./pages/Attendance'));
const Leaderboard = React.lazy(() => import('./components/leaderboard/Leaderboard'));
const OfflineTestManager = React.lazy(() => import('./components/tests/OfflineTestManager'));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingStates.FullScreen />;
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
      return <HeadTeacherDashboard />;
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
          {/* Homepage with premium coaching design */}
          <Route 
            path="/" 
            element={
              <Suspense fallback={<LoadingStates.FullScreen />}>
                <PremiumHomepage />
              </Suspense>
            } 
          />
          
          {/* Enhanced login with no errors */}
          <Route 
            path="/login" 
            element={
              <Suspense fallback={<LoadingStates.FullScreen />}>
                <EnhancedLoginForm />
              </Suspense>
            } 
          />
          
          {/* Protected dashboard routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingStates.FullScreen />}>
                  <DashboardRouter />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          
          {/* Attendance system */}
          <Route 
            path="/attendance" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingStates.FullScreen />}>
                  <AttendancePage />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          
          {/* Leaderboard */}
          <Route 
            path="/leaderboard" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingStates.FullScreen />}>
                  <Leaderboard />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          
          {/* Offline Tests */}
          <Route 
            path="/tests" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingStates.FullScreen />}>
                  <OfflineTestManager />
                </Suspense>
              </ProtectedRoute>
            } 
          />
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
