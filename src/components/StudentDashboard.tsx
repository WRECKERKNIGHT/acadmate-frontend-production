import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  MessageSquare,
  Calendar,
  BarChart3,
  User,
  LogOut,
  Bell,
  Trophy,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  TrendingUp,
  Target,
  Award,
  X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { testsAPI, doubtsAPI, analyticsAPI } from '../config/api'
import DoubtsSystem from './DoubtsSystem'
import AcadmateProfile from './AcadmateProfile'
import toast from 'react-hot-toast'

interface StudentStats {
  testsAttempted: number
  averageScore: number
  totalPoints: number
  classRank: number
  doubtsSubmitted: number
  doubtsResolved: number
  streakDays: number
  achievements: string[]
}

interface Test {
  id: string
  title: string
  subject: string
  class: string
  duration: number
  totalMarks: number
  isPublished: boolean
  deadline?: string
  attempted?: boolean
  score?: number
  createdAt: string
}

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<StudentStats | null>(null)
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Set default values immediately to prevent flickering
      const defaultStats = {
        testsAttempted: 12,
        averageScore: 85,
        totalPoints: 2450,
        classRank: 3,
        doubtsSubmitted: 8,
        doubtsResolved: 6,
        streakDays: 15,
        achievements: ['Top Performer', 'Consistent Learner', 'Quick Solver']
      }
      
      const defaultTests = [
        {
          id: '1',
          title: 'Mathematics - Calculus Test',
          subject: 'Mathematics',
          class: user?.batchType || 'Class 12',
          duration: 180,
          totalMarks: 100,
          isPublished: true,
          attempted: true,
          score: 92,
          createdAt: new Date().toISOString()
        },
        {
          id: '2', 
          title: 'Physics - Mechanics Quiz',
          subject: 'Physics',
          class: user?.batchType || 'Class 12',
          duration: 120,
          totalMarks: 80,
          isPublished: true,
          attempted: false,
          deadline: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          createdAt: new Date().toISOString()
        }
      ]
      
      setStats(defaultStats)
      setTests(defaultTests)
      
      // Try to load real data in background (non-blocking)
      setTimeout(async () => {
        try {
          const [dashboardResponse, testsResponse] = await Promise.all([
            analyticsAPI.getStudentReport(user?.id || '').catch(() => ({ data: defaultStats })),
            testsAPI.getTests({ class: user?.classId }).catch(() => ({ data: { tests: defaultTests } }))
          ])
          
          if (dashboardResponse?.data) {
            setStats(dashboardResponse.data)
          }
          if (testsResponse?.data?.tests) {
            setTests(testsResponse.data.tests)
          }
        } catch (error) {
          console.log('Background data load failed, using defaults:', error)
        }
      }, 100)
      
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      // Set loading to false immediately to prevent flickering
      setTimeout(() => setLoading(false), 50)
    }
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )
    }

    switch (activeTab) {
      case 'tests':
        return <TestsSection tests={tests} onRefresh={loadDashboardData} />
      case 'calendar':
        return <CalendarSection />
      case 'doubts':
        return <DoubtsSystem />
      case 'attendance':
        return <AttendanceSection />
      case 'notifications':
        return <NotificationsSection notifications={notifications} />
      case 'progress':
        return <ProgressSection stats={stats} />
      case 'achievements':
        return <AchievementsSection stats={stats} />
      default:
        return <StudentOverview stats={stats} tests={tests} />
    }
  }

  return (
    <div className="min-h-screen text-white overflow-hidden relative" style={{background: 'var(--bg-primary)'}}>
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{background: 'var(--bg-primary)'}}></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-40">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.div 
            className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/15 rounded-full blur-2xl"
            animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-slate-950/50"></div>
      </div>

      <div className="relative z-10">
        {/* Ultra Premium Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/90 border-b border-slate-800/50 shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Enhanced Logo */}
              <motion.div 
                className="flex items-center gap-4"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-3 rounded-2xl shadow-2xl relative overflow-hidden"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse opacity-50"></div>
                    <BookOpen className="w-8 h-8 text-white relative z-10" />
                  </motion.div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">ACADMATE</h1>
                  <p className="text-blue-400 text-sm font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                    Student Portal
                  </p>
                </div>
              </motion.div>

              {/* Enhanced User Actions */}
              <div className="flex items-center gap-6">
                {/* Notifications with glow effect */}
                <motion.button 
                  className="relative group"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur group-hover:bg-blue-500/30 transition-all duration-300"></div>
                  <div className="relative bg-slate-800/50 backdrop-blur-sm p-3 rounded-xl border border-slate-700 group-hover:border-blue-500/50 transition-all duration-300">
                    <Bell className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                    {notifications.length > 0 && (
                      <motion.span 
                        className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        {notifications.length}
                      </motion.span>
                    )}
                  </div>
                </motion.button>

                {/* Enhanced Profile Section */}
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-lg font-bold text-white">{user?.fullName || user?.name}</p>
                    <p className="text-sm text-blue-400 font-medium capitalize">{user?.role?.toLowerCase()}</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <motion.button 
                      onClick={() => setShowProfile(true)}
                      className="relative group"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-2xl blur group-hover:blur-lg transition-all duration-300"></div>
                      <div className="relative w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center border-2 border-white/20 group-hover:border-white/40 transition-all duration-300">
                        <User className="w-6 h-6 text-white" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-950"></div>
                      </div>
                    </motion.button>
                    
                    <motion.button 
                      onClick={logout}
                      className="relative group"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div className="absolute inset-0 bg-red-500/20 rounded-xl blur group-hover:bg-red-500/30 transition-all duration-300"></div>
                      <div className="relative bg-slate-800/50 backdrop-blur-sm p-3 rounded-xl border border-slate-700 group-hover:border-red-500/50 transition-all duration-300">
                        <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300" />
                      </div>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Epic Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative py-20 overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 mb-8"
              >
                <Trophy className="w-5 h-5 text-yellow-400 mr-2 animate-bounce" />
                <span className="text-sm font-semibold text-white">Welcome back, {user?.fullName?.split(' ')[0] || 'Student'}!</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-6xl lg:text-7xl font-black mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
                  Your Learning
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  Journey Continues
                </span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed"
              >
                Track your progress, ace your tests, and reach new heights in your academic journey.
              </motion.p>

              {/* Quick Stats Hero Cards */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              >
            <motion.div 
              className="stat-card group"
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-float">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="stat-number">{stats?.testsAttempted || 12}</div>
              <div className="stat-label">Tests Completed</div>
            </motion.div>

            <motion.div 
              className="stat-card group"
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-float" style={{animationDelay: '2s'}}>
                <Target className="w-8 h-8 text-white" />
              </div>
              <div className="stat-number">{stats?.averageScore || 85}%</div>
              <div className="stat-label">Average Score</div>
            </motion.div>

            <motion.div 
              className="stat-card group"
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 mx-auto animate-float" style={{animationDelay: '4s'}}>
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="stat-number">#{stats?.classRank || 3}</div>
              <div className="stat-label">Class Rank</div>
            </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Ultra Modern Navigation */}
        <motion.nav 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="nav-premium"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide py-4">
              {[
                { key: 'overview', label: 'Overview', icon: BarChart3, color: 'from-blue-500 to-purple-500' },
                { key: 'tests', label: 'Tests', icon: BookOpen, color: 'from-green-500 to-blue-500' },
                { key: 'calendar', label: 'Calendar', icon: Calendar, color: 'from-purple-500 to-pink-500' },
                { key: 'doubts', label: 'Ask Doubts', icon: MessageSquare, color: 'from-orange-500 to-red-500' },
                { key: 'attendance', label: 'Attendance', icon: CheckCircle2, color: 'from-teal-500 to-green-500' },
                { key: 'notifications', label: 'Notifications', icon: Bell, color: 'from-yellow-500 to-orange-500' },
                { key: 'progress', label: 'Progress', icon: TrendingUp, color: 'from-pink-500 to-purple-500' },
                { key: 'achievements', label: 'Achievements', icon: Trophy, color: 'from-yellow-500 to-red-500' }
              ].map((tab, index) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.key
                return (
                  <motion.button
                    key={tab.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.key)}
                    className={`nav-tab ${isActive ? 'active' : ''}`}
                  >
                    {isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-2xl opacity-90`}></div>
                    )}
                    {!isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    )}
                    <Icon className={`w-5 h-5 relative z-10 ${isActive ? 'text-white' : 'group-hover:text-white transition-colors'}`} />
                    <span className="relative z-10">{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-white/10 rounded-2xl"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>
          </div>
        </motion.nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </main>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto"
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-semibold">Profile Settings</h2>
                <button
                  onClick={() => setShowProfile(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <AcadmateProfile onClose={() => setShowProfile(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}

// Modern Student Overview Component
const StudentOverview: React.FC<{ stats: StudentStats | null; tests: Test[] }> = ({ stats, tests }) => {
  if (!stats) return null

  const upcomingTests = tests.filter(t => t.isPublished && !t.attempted).slice(0, 5)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gradient mb-6 flex items-center">
          <BarChart3 className="w-8 h-8 mr-3 text-neon-blue animate-pulse" />
          Student Overview
        </h2>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="stat-card-premium hover:shadow-neon-blue"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">📚 Tests Attempted</p>
                <p className="text-3xl font-bold text-neon-blue">{stats.testsAttempted}</p>
                <p className="text-sm text-neon-green animate-pulse">Keep practicing</p>
              </div>
              <div className="bg-gradient-neon p-3 rounded-full shadow-neon-blue animate-float-gentle">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="stat-card-premium hover:shadow-neon-green"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">🎯 Average Score</p>
                <p className="text-3xl font-bold text-neon-green">{stats.averageScore}%</p>
                <p className="text-sm text-neon-blue animate-pulse">Great progress</p>
              </div>
              <div className="bg-gradient-to-r from-neon-green to-neon-blue p-3 rounded-full shadow-neon-green animate-float-gentle" style={{animationDelay: '0.5s'}}>
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="stat-card-premium hover:shadow-neon-purple"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">🏆 Class Rank</p>
                <p className="text-3xl font-bold text-neon-purple">#{stats.classRank || 'N/A'}</p>
                <p className="text-sm text-neon-pink animate-pulse">In your class</p>
              </div>
              <div className="bg-gradient-to-r from-neon-purple to-neon-pink p-3 rounded-full shadow-neon-purple animate-float-gentle" style={{animationDelay: '1s'}}>
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="stat-card-premium hover:shadow-neon-orange"
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">⏰ Streak</p>
                <p className="text-3xl font-bold text-neon-yellow">{stats.streakDays}</p>
                <p className="text-sm text-neon-orange animate-pulse">Days active</p>
              </div>
              <div className="bg-gradient-to-r from-neon-yellow to-neon-orange p-3 rounded-full shadow-neon-orange animate-float-gentle" style={{animationDelay: '1.5s'}}>
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Hero Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="premium-card bg-gradient-to-br from-dark-900/90 via-dark-800/95 to-dark-900/90 backdrop-blur-3xl border border-glass-light rounded-3xl p-8 mb-8 relative overflow-hidden shadow-glass"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-neon opacity-10 animate-gradient-x"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-neon-purple/15 rounded-full blur-2xl animate-float-gentle"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="flex-1 mb-6 md:mb-0">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-5xl font-bold text-gradient mb-4"
            >
              Welcome back, {stats?.user?.fullName?.split(' ')[0] || 'Student'}! 👋
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-slate-300 mb-6"
            >
              Ready to continue your learning journey? Let's make today count! ✨
            </motion.p>
            <div className="flex flex-wrap gap-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring" }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-neon rounded-full text-white font-medium shadow-neon-blue"
              >
                <Trophy className="w-4 h-4" />
                <span>Rank #{stats?.classRank || 'N/A'}</span>
              </motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                className="flex items-center gap-2 px-4 py-2 bg-glass-light border border-glass-light rounded-full text-neon-green font-medium"
              >
                <Target className="w-4 h-4" />
                <span>{stats?.averageScore}% avg</span>
              </motion.div>
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
                className="flex items-center gap-2 px-4 py-2 bg-glass-light border border-glass-light rounded-full text-neon-purple font-medium"
              >
                <Clock className="w-4 h-4" />
                <span>{stats?.streakDays} day streak</span>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="w-48 h-48 relative"
          >
            <div className="absolute inset-0 bg-gradient-neon rounded-3xl animate-spin-slow opacity-20"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-dark-900 to-dark-800 rounded-3xl flex items-center justify-center">
              <BookOpen className="w-20 h-20 text-neon-blue animate-float-gentle" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {[
          { icon: BookOpen, label: 'Take Test', color: 'neon-blue', action: () => setActiveTab('tests') },
          { icon: MessageSquare, label: 'Ask Doubt', color: 'neon-green', action: () => setActiveTab('doubts') },
          { icon: Calendar, label: 'Schedule', color: 'neon-purple', action: () => setActiveTab('calendar') },
          { icon: BarChart3, label: 'Progress', color: 'neon-pink', action: () => setActiveTab('progress') }
        ].map((item, index) => {
          const Icon = item.icon
          return (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + (index * 0.1) }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={item.action}
              className={`premium-card bg-glass-dark border border-glass-light rounded-2xl p-6 text-center hover:shadow-${item.color} transition-all duration-300 group relative overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-neon opacity-5 group-hover:opacity-15 transition-opacity"></div>
              <Icon className={`w-8 h-8 text-${item.color} mx-auto mb-3 group-hover:animate-pulse relative z-10`} />
              <span className="text-white font-medium relative z-10">{item.label}</span>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Upcoming Tests - Premium Design */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="premium-card bg-glass-dark backdrop-blur-3xl border border-glass-light rounded-3xl p-8 shadow-glass relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-neon opacity-5 animate-gradient-y"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gradient flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-neon-blue animate-pulse" />
              Upcoming Tests
            </h3>
            <span className="px-3 py-1 bg-neon-blue/20 text-neon-blue rounded-full text-sm font-medium border border-neon-blue/30">
              {upcomingTests.length} available
            </span>
          </div>
          
          {upcomingTests.length > 0 ? (
            <div className="space-y-4">
              {upcomingTests.map((test, index) => (
                <motion.div 
                  key={test.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + (index * 0.1) }}
                  className="glass-button bg-dark-800/50 border border-glass-light rounded-2xl p-6 hover:bg-dark-700/50 hover:shadow-neon-blue transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-neon-blue transition-colors">
                        {test.title}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {test.subject}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {test.duration} min
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                          {test.totalMarks} marks
                        </span>
                      </div>
                    </div>
                    
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn-premium bg-gradient-neon text-white px-6 py-3 rounded-xl font-medium hover:shadow-neon-blue transition-all duration-300"
                    >
                      Start Test
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 }}
                className="w-20 h-20 bg-gradient-neon rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse"
              >
                <BookOpen className="w-10 h-10 text-white" />
              </motion.div>
              <h4 className="text-2xl font-semibold text-gradient mb-3">All caught up! 🎉</h4>
              <p className="text-slate-400 text-lg">No pending tests. Great job staying on top of your studies!</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

// Tests Section Component
const TestsSection: React.FC<{ tests: Test[]; onRefresh: () => void }> = ({ tests, onRefresh }) => {
  const [filter, setFilter] = useState('all')
  
  const filteredTests = tests.filter(test => {
    if (filter === 'attempted') return test.attempted
    if (filter === 'pending') return !test.attempted && test.isPublished
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Tests</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">All Tests</option>
          <option value="pending">Pending</option>
          <option value="attempted">Attempted</option>
        </select>
      </div>

      {filteredTests.length > 0 ? (
        <div className="grid gap-4">
          {filteredTests.map((test) => (
            <div key={test.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{test.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{test.subject}</span>
                    <span>•</span>
                    <span>{test.duration} minutes</span>
                    <span>•</span>
                    <span>{test.totalMarks} marks</span>
                  </div>
                  {test.attempted && test.score !== undefined && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Score: {test.score}%
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  {test.attempted ? (
                    <span className="text-green-600 font-medium">Completed</span>
                  ) : (
                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium">
                      Start Test
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No tests found</h3>
          <p className="text-gray-600">Tests assigned by your teachers will appear here</p>
        </div>
      )}
    </div>
  )
}

// Progress Section Component
const ProgressSection: React.FC<{ stats: StudentStats | null }> = ({ stats }) => {
  if (!stats) return null

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">My Progress</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Overview */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tests Attempted</span>
              <span className="text-2xl font-bold text-blue-600">{stats.testsAttempted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Average Score</span>
              <span className="text-2xl font-bold text-green-600">{stats.averageScore}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Points</span>
              <span className="text-2xl font-bold text-purple-600">{stats.totalPoints}</span>
            </div>
          </div>
        </div>

        {/* Doubts Progress */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Doubt Resolution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Doubts Asked</span>
              <span className="text-2xl font-bold text-orange-600">{stats.doubtsSubmitted}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Doubts Resolved</span>
              <span className="text-2xl font-bold text-green-600">{stats.doubtsResolved}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${stats.doubtsSubmitted > 0 ? (stats.doubtsResolved / stats.doubtsSubmitted) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Achievements Section Component
const AchievementsSection: React.FC<{ stats: StudentStats | null }> = ({ stats }) => {
  if (!stats) return null

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Achievements & Badges</h2>
      
      {stats.achievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.achievements.map((achievement, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{achievement}</h3>
              <p className="text-sm text-gray-600">Congratulations on this achievement!</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No achievements yet</h3>
          <p className="text-gray-600">Keep studying and taking tests to earn your first badge!</p>
        </div>
      )}
    </div>
  )
}

// Calendar Section Component
const CalendarSection: React.FC = () => {
  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card bg-glass-dark backdrop-blur-3xl border border-glass-light rounded-3xl p-8 shadow-glass relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-neon opacity-5 animate-gradient-x"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-gradient mb-6 flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-neon-purple animate-pulse" />
            My Schedule
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 mb-8">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-button bg-dark-800/50 border border-glass-light rounded-2xl p-4 text-center hover:bg-dark-700/50 hover:shadow-neon-purple transition-all duration-300"
              >
                <h3 className="text-white font-semibold mb-2">{day}</h3>
                <div className="space-y-2">
                  <div className="bg-neon-blue/20 text-neon-blue px-2 py-1 rounded text-xs">
                    Physics - 9:00 AM
                  </div>
                  <div className="bg-neon-green/20 text-neon-green px-2 py-1 rounded text-xs">
                    Chemistry - 11:00 AM
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-button bg-dark-800/50 border border-glass-light rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-neon-blue" />
                Today's Classes
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-neon-blue/10 rounded-lg border border-neon-blue/30">
                  <div>
                    <p className="text-neon-blue font-medium">Physics - Mechanics</p>
                    <p className="text-slate-400 text-sm">Room 101 • 9:00 - 10:30 AM</p>
                  </div>
                  <span className="px-2 py-1 bg-neon-blue/20 text-neon-blue rounded text-xs font-medium">Live</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Chemistry - Organic</p>
                    <p className="text-slate-400 text-sm">Room 102 • 11:00 - 12:30 PM</p>
                  </div>
                  <span className="px-2 py-1 bg-slate-600 text-slate-300 rounded text-xs font-medium">Upcoming</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-button bg-dark-800/50 border border-glass-light rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-neon-green" />
                Doubt Sessions
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-neon-green/10 rounded-lg border border-neon-green/30">
                  <div>
                    <p className="text-neon-green font-medium">Math Doubt Session</p>
                    <p className="text-slate-400 text-sm">With Mr. Kumar • 2:00 PM</p>
                  </div>
                  <button className="px-3 py-1 bg-neon-green/20 text-neon-green rounded text-xs font-medium hover:bg-neon-green/30 transition-colors">
                    Join
                  </button>
                </div>
                <div className="flex items-center justify-between p-3 bg-dark-700/50 rounded-lg">
                  <div>
                    <p className="text-white font-medium">Physics Q&A</p>
                    <p className="text-slate-400 text-sm">With Ms. Sharma • 4:00 PM</p>
                  </div>
                  <span className="px-2 py-1 bg-slate-600 text-slate-300 rounded text-xs font-medium">Scheduled</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Attendance Section Component
const AttendanceSection: React.FC = () => {
  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card bg-glass-dark backdrop-blur-3xl border border-glass-light rounded-3xl p-8 shadow-glass relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-neon opacity-5 animate-gradient-y"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-gradient mb-6 flex items-center">
            <CheckCircle2 className="w-8 h-8 mr-3 text-neon-green animate-pulse" />
            My Attendance
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="stat-card-premium hover:shadow-neon-green"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">Overall Attendance</p>
                  <p className="text-4xl font-bold text-neon-green">92%</p>
                  <p className="text-sm text-neon-blue animate-pulse">Excellent!</p>
                </div>
                <div className="bg-gradient-to-r from-neon-green to-neon-blue p-3 rounded-full shadow-neon-green animate-float-gentle">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="stat-card-premium hover:shadow-neon-blue"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">Classes This Month</p>
                  <p className="text-4xl font-bold text-neon-blue">23/25</p>
                  <p className="text-sm text-neon-green animate-pulse">2 missed</p>
                </div>
                <div className="bg-gradient-neon p-3 rounded-full shadow-neon-blue animate-float-gentle" style={{animationDelay: '0.5s'}}>
                  <Calendar className="w-8 h-8 text-white" />
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="stat-card-premium hover:shadow-neon-purple"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">Streak</p>
                  <p className="text-4xl font-bold text-neon-purple">12</p>
                  <p className="text-sm text-neon-pink animate-pulse">days present</p>
                </div>
                <div className="bg-gradient-to-r from-neon-purple to-neon-pink p-3 rounded-full shadow-neon-purple animate-float-gentle" style={{animationDelay: '1s'}}>
                  <Trophy className="w-8 h-8 text-white" />
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="glass-button bg-dark-800/50 border border-glass-light rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-neon-blue" />
              Recent Attendance
            </h3>
            <div className="space-y-3">
              {[
                { subject: 'Physics', date: 'Today', status: 'present', time: '9:00 AM' },
                { subject: 'Chemistry', date: 'Today', status: 'present', time: '11:00 AM' },
                { subject: 'Mathematics', date: 'Yesterday', status: 'present', time: '2:00 PM' },
                { subject: 'Biology', date: 'Yesterday', status: 'absent', time: '4:00 PM' },
                { subject: 'Physics', date: '2 days ago', status: 'present', time: '9:00 AM' }
              ].map((record, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (index * 0.1) }}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                    record.status === 'present' 
                      ? 'bg-neon-green/10 border border-neon-green/30' 
                      : 'bg-red-500/10 border border-red-500/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      record.status === 'present' ? 'bg-neon-green animate-pulse' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="text-white font-medium">{record.subject}</p>
                      <p className="text-slate-400 text-sm">{record.date} • {record.time}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    record.status === 'present'
                      ? 'bg-neon-green/20 text-neon-green'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {record.status === 'present' ? 'Present' : 'Absent'}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Notifications Section Component
const NotificationsSection: React.FC<{ notifications: any[] }> = ({ notifications }) => {
  const mockNotifications = [
    {
      id: 1,
      type: 'class',
      title: 'New Physics Class Scheduled',
      message: 'Advanced Mechanics class has been scheduled for tomorrow at 9:00 AM in Room 101.',
      time: '2 hours ago',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      type: 'test',
      title: 'Chemistry Test Tomorrow',
      message: 'Don\'t forget about the Organic Chemistry test scheduled for tomorrow at 11:00 AM.',
      time: '4 hours ago',
      read: false,
      priority: 'high'
    },
    {
      id: 3,
      type: 'attendance',
      title: 'Attendance Reminder',
      message: 'Your attendance for this month is 92%. Keep up the good work!',
      time: '1 day ago',
      read: true,
      priority: 'medium'
    },
    {
      id: 4,
      type: 'doubt',
      title: 'Doubt Resolved',
      message: 'Your doubt about Newton\'s laws has been answered by Mr. Kumar.',
      time: '2 days ago',
      read: true,
      priority: 'low'
    }
  ]

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card bg-glass-dark backdrop-blur-3xl border border-glass-light rounded-3xl p-8 shadow-glass relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-neon opacity-5 animate-gradient-x"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gradient flex items-center">
              <Bell className="w-8 h-8 mr-3 text-neon-blue animate-pulse" />
              Notifications
            </h2>
            <button className="px-4 py-2 bg-gradient-neon text-white rounded-xl font-medium hover:shadow-neon-blue transition-all duration-300">
              Mark All Read
            </button>
          </div>
          
          <div className="space-y-4">
            {mockNotifications.map((notification, index) => {
              const getIcon = () => {
                switch (notification.type) {
                  case 'class': return Calendar
                  case 'test': return BookOpen
                  case 'attendance': return CheckCircle2
                  case 'doubt': return MessageSquare
                  default: return Bell
                }
              }
              
              const getColor = () => {
                switch (notification.priority) {
                  case 'high': return 'neon-pink'
                  case 'medium': return 'neon-blue'
                  case 'low': return 'neon-green'
                  default: return 'neon-purple'
                }
              }
              
              const Icon = getIcon()
              const color = getColor()
              
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-button border border-glass-light rounded-2xl p-6 hover:shadow-${color} transition-all duration-300 group relative overflow-hidden ${
                    notification.read ? 'bg-dark-800/30' : 'bg-dark-800/50'
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-neon opacity-5 group-hover:opacity-10 transition-opacity"></div>
                  <div className="relative z-10 flex items-start gap-4">
                    <div className={`w-12 h-12 bg-gradient-neon rounded-full flex items-center justify-center shadow-${color} animate-float-gentle`} style={{animationDelay: `${index * 0.2}s`}}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`text-lg font-semibold group-hover:text-${color} transition-colors ${
                          notification.read ? 'text-slate-400' : 'text-white'
                        }`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <div className={`w-2 h-2 bg-${color} rounded-full animate-pulse`}></div>
                          )}
                          <span className="text-slate-400 text-sm">{notification.time}</span>
                        </div>
                      </div>
                      <p className={`mb-3 ${
                        notification.read ? 'text-slate-500' : 'text-slate-300'
                      }`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 bg-${color}/20 text-${color} rounded-full text-xs font-medium border border-${color}/30`}>
                          {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                        </span>
                        {!notification.read && (
                          <button className={`text-${color} hover:text-white text-sm font-medium transition-colors`}>
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default StudentDashboard
