import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  BookOpen,
  BarChart3,
  Settings,
  UserCheck,
  Calendar,
  TrendingUp,
  Shield,
  User,
  LogOut,
  Bell,
  Plus,
  Eye,
  Edit3,
  X,
  Activity,
  Database
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { analyticsAPI, academicAPI, profileAPI } from '../config/api'
import AcadmateProfile from './AcadmateProfile'
import UserManagement from './admin/UserManagement'
import TeacherActivities from './admin/TeacherActivities'
import SystemStatistics from './admin/SystemStatistics'
import ClassSchedulingSystem from './admin/ClassSchedulingSystem'
import NotificationSender from './admin/NotificationSender'
import AttendanceManager from './attendance/AttendanceManager'
import toast from 'react-hot-toast'

interface AdminStats {
  totalStudents: number
  totalTeachers: number
  totalTests: number
  totalDoubts: number
  activeClasses: number
  systemHealth: string
  monthlyGrowth: number
}

const HeadTeacherDashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showProfile, setShowProfile] = useState(false)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      setLoading(true)
      const response = await analyticsAPI.getDashboardStats()
      setStats(response.data || {
        totalStudents: 0,
        totalTeachers: 0,
        totalTests: 0,
        totalDoubts: 0,
        activeClasses: 0,
        systemHealth: 'Good',
        monthlyGrowth: 0
      })
    } catch (error) {
      console.error('Error loading admin data:', error)
      setStats({
        totalStudents: 0,
        totalTeachers: 0,
        totalTests: 0,
        totalDoubts: 0,
        activeClasses: 0,
        systemHealth: 'Good',
        monthlyGrowth: 0
      })
    } finally {
      setLoading(false)
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
      case 'scheduling':
        return <ClassSchedulingSystem />
      case 'attendance':
        return <AttendanceManager />
      case 'teachers':
        return <AdminTeacherManagement />
      case 'students':
        return <AdminStudentManagement />
      case 'notifications':
        return <NotificationSender />
      case 'analytics':
        return <AdminAnalytics stats={stats} />
      case 'settings':
        return <SystemSettings />
      case 'usermanagement':
        return <UserManagement />
      case 'teacheractivity':
        return <TeacherActivities />
      case 'systemstats':
        return <SystemStatistics />
      default:
        return <AdminOverview stats={stats} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dark text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-neon opacity-5 animate-gradient-x"></div>
      <div className="relative z-10">
      {/* Premium Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="nav-glass backdrop-blur-3xl border-b border-glass-light shadow-glass"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <motion.div 
                className="bg-gradient-neon text-white p-2 rounded-xl shadow-neon-purple relative overflow-hidden"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 bg-gradient-neon animate-pulse opacity-20"></div>
                <Shield className="w-6 h-6 relative z-10" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-gradient animate-neon-pulse">ACADMATE</h1>
                <p className="text-sm text-neon-purple font-medium">👑 Head Teacher Portal</p>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <motion.button 
                className="relative glass-button p-2 text-slate-300 hover:text-neon-purple hover:shadow-neon-purple rounded-lg transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <motion.span 
                    className="absolute -top-1 -right-1 bg-neon-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {notifications.length}
                  </motion.span>
                )}
              </motion.button>

              {/* Profile Menu */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white">{user?.fullName || user?.name}</p>
                  <p className="text-xs text-neon-purple font-medium">Administrator</p>
                </div>
                <motion.button 
                  onClick={() => setShowProfile(true)}
                  className="glass-button p-2 text-white hover:shadow-neon-purple rounded-lg transition-all duration-300 status-online"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 bg-gradient-neon text-white rounded-full flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-neon animate-spin-slow opacity-30"></div>
                    <Shield className="w-4 h-4 relative z-10" />
                  </div>
                </motion.button>
                
                <motion.button 
                  onClick={logout}
                  className="glass-button p-2 text-slate-300 hover:text-neon-pink hover:shadow-neon-pink rounded-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Premium Navigation Tabs */}
      <motion.nav 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="nav-glass backdrop-blur-3xl border-b border-glass-light"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'scheduling', label: 'Schedule Classes', icon: Calendar },
              { key: 'attendance', label: 'Attendance', icon: UserCheck },
              { key: 'teachers', label: 'Teachers', icon: Users },
              { key: 'students', label: 'Students', icon: BookOpen },
              { key: 'notifications', label: 'Send Notice', icon: Bell },
              { key: 'usermanagement', label: 'User Management', icon: Shield },
              { key: 'teacheractivity', label: 'Teacher Activity', icon: Activity },
              { key: 'systemstats', label: 'System Stats', icon: Database },
              { key: 'analytics', label: 'Analytics', icon: TrendingUp },
              { key: 'settings', label: 'Settings', icon: Settings }
            ]
              const Icon = tab.icon
              return (
                <motion.button
                  key={tab.key}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300 rounded-t-lg relative overflow-hidden ${
                    activeTab === tab.key
                      ? 'border-neon-purple text-neon-purple bg-glass-light shadow-neon-purple'
                      : 'border-transparent text-slate-400 hover:text-white hover:border-neon-pink hover:bg-glass-light/30'
                  }`}
                >
                  {activeTab === tab.key && (
                    <div className="absolute inset-0 bg-gradient-neon opacity-10 animate-pulse"></div>
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{tab.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
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
                <h2 className="text-xl font-semibold">Admin Profile</h2>
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
  )
}

// Premium Admin Overview Component
const AdminOverview: React.FC<{ stats: AdminStats | null }> = ({ stats }) => {
  if (!stats) return null

  return (
    <div className="space-y-8">
      {/* Epic Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative py-16 overflow-hidden"
      >
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 mb-8"
          >
            <Shield className="w-5 h-5 text-purple-400 mr-2 animate-bounce" />
            <span className="text-sm font-semibold text-white">Administrative Command Center</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl lg:text-6xl font-black mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Leading Excellence,
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              Driving Innovation
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Oversee operations, inspire growth, and shape the future of education with comprehensive administrative tools.
          </motion.p>
        </div>
      </motion.section>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-hover p-8"
          whileHover={{ y: -8, scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-2">👥 Total Students</p>
              <p className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {stats.totalStudents || 0}
              </p>
              <p className="text-sm text-green-400 animate-pulse mt-2">Active Learners</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center animate-float">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-hover p-8"
          whileHover={{ y: -8, scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-2">👨‍🏫 Faculty Members</p>
              <p className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                {stats.totalTeachers || 0}
              </p>
              <p className="text-sm text-blue-400 animate-pulse mt-2">Expert Educators</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-400 rounded-2xl flex items-center justify-center animate-float" style={{animationDelay: '1s'}}>
              <UserCheck className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-hover p-8"
          whileHover={{ y: -8, scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-2">📚 Total Tests</p>
              <p className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {stats.totalTests || 0}
              </p>
              <p className="text-sm text-purple-400 animate-pulse mt-2">Assessments Created</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-400 rounded-2xl flex items-center justify-center animate-float" style={{animationDelay: '2s'}}>
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card-hover p-8"
          whileHover={{ y: -8, scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-medium text-slate-400 mb-2">🛡️ System Health</p>
              <p className="text-2xl font-black bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                {stats.systemHealth || 'Excellent'}
              </p>
              <p className="text-sm text-green-400 animate-pulse mt-2">All Systems Online</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-400 rounded-2xl flex items-center justify-center animate-float" style={{animationDelay: '3s'}}>
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="card p-8"
      >
        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-8 flex items-center">
          <Settings className="w-8 h-8 mr-3 text-purple-400" />
          Quick Administrative Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.button 
            className="card-hover p-6 text-left group"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-white mb-2">Add New Teacher</h4>
            <p className="text-sm text-slate-400">Invite educators to join the platform</p>
          </motion.button>
          
          <motion.button 
            className="card-hover p-6 text-left group"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-white mb-2">Analytics Reports</h4>
            <p className="text-sm text-slate-400">Review comprehensive performance data</p>
          </motion.button>
          
          <motion.button 
            className="card-hover p-6 text-left group"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-bold text-white mb-2">System Configuration</h4>
            <p className="text-sm text-slate-400">Manage platform settings and preferences</p>
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

// Premium admin feature components
const TeacherManagement: React.FC = () => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent flex items-center">
      <UserCheck className="w-8 h-8 mr-3 text-green-400" />
      Teacher Management
    </h2>
    <div className="card p-12 text-center">
      <UserCheck className="w-20 h-20 text-green-400 mx-auto mb-6 animate-bounce" />
      <h3 className="text-2xl font-bold text-white mb-4">Teacher Management System</h3>
      <p className="text-slate-300 text-lg">Manage teacher accounts, assign subjects and classes with advanced administrative tools.</p>
    </div>
  </div>
)

const StudentManagement: React.FC = () => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center">
      <Users className="w-8 h-8 mr-3 text-blue-400" />
      Student Management
    </h2>
    <div className="card p-12 text-center">
      <Users className="w-20 h-20 text-blue-400 mx-auto mb-6 animate-bounce" />
      <h3 className="text-2xl font-bold text-white mb-4">Student Management Portal</h3>
      <p className="text-slate-300 text-lg">View and manage student accounts, track progress, and monitor academic performance.</p>
    </div>
  </div>
)

const AdminAnalytics: React.FC<{ stats: AdminStats | null }> = ({ stats }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">System Analytics</h2>
    <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
      <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-900 mb-2">Advanced Analytics</h3>
      <p className="text-gray-600">Comprehensive reports and insights about platform usage.</p>
    </div>
  </div>
)

const SystemSettings: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
    <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
      <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-900 mb-2">Platform Configuration</h3>
      <p className="text-gray-600">Configure system settings, security, and preferences.</p>
    </div>
  </div>
)

// Class Scheduling System Component
const ClassSchedulingSystem: React.FC = () => {
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduledClasses, setScheduledClasses] = useState([
    {
      id: 1,
      subject: 'Physics',
      teacher: 'Mr. Kumar',
      batch: 'NEET 12th',
      room: 'Room 101',
      time: '9:00 AM - 10:30 AM',
      date: '2024-01-15',
      students: 25
    },
    {
      id: 2,
      subject: 'Chemistry',
      teacher: 'Ms. Sharma',
      batch: 'PCM 11th',
      room: 'Room 102',
      time: '11:00 AM - 12:30 PM',
      date: '2024-01-15',
      students: 30
    }
  ])

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
              <Calendar className="w-8 h-8 mr-3 text-neon-purple animate-pulse" />
              Class Scheduling System
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowScheduleModal(true)}
              className="btn-premium bg-gradient-neon text-white px-6 py-3 rounded-xl font-medium hover:shadow-neon-purple transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Schedule New Class
            </motion.button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="stat-card-premium hover:shadow-neon-blue"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">Today's Classes</p>
                  <p className="text-3xl font-bold text-neon-blue">6</p>
                </div>
                <Calendar className="w-8 h-8 text-neon-blue animate-float-gentle" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="stat-card-premium hover:shadow-neon-green"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">Total Teachers</p>
                  <p className="text-3xl font-bold text-neon-green">12</p>
                </div>
                <UserCheck className="w-8 h-8 text-neon-green animate-float-gentle" style={{animationDelay: '0.5s'}} />
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
                  <p className="text-sm font-medium text-slate-300">Active Batches</p>
                  <p className="text-3xl font-bold text-neon-purple">8</p>
                </div>
                <Users className="w-8 h-8 text-neon-purple animate-float-gentle" style={{animationDelay: '1s'}} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="stat-card-premium hover:shadow-neon-pink"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">Total Students</p>
                  <p className="text-3xl font-bold text-neon-pink">245</p>
                </div>
                <BookOpen className="w-8 h-8 text-neon-pink animate-float-gentle" style={{animationDelay: '1.5s'}} />
              </div>
            </motion.div>
          </div>

          {/* Scheduled Classes List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-neon-blue" />
              Today's Schedule
            </h3>
            {scheduledClasses.map((classItem, index) => (
              <motion.div
                key={classItem.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
                className="glass-button bg-dark-800/50 border border-glass-light rounded-2xl p-6 hover:bg-dark-700/50 hover:shadow-neon-blue transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-neon rounded-2xl flex items-center justify-center shadow-neon-blue animate-float-gentle" style={{animationDelay: `${index * 0.3}s`}}>
                      <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white group-hover:text-neon-blue transition-colors">
                        {classItem.subject}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-4 h-4" />
                          {classItem.teacher}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {classItem.batch}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {classItem.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield className="w-4 h-4" />
                          {classItem.room}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-neon-green">{classItem.students}</p>
                      <p className="text-xs text-slate-400">Students</p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="glass-button p-2 text-neon-blue hover:bg-neon-blue/20 rounded-lg transition-all duration-300"
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="glass-button p-2 text-neon-green hover:bg-neon-green/20 rounded-lg transition-all duration-300"
                      >
                        <Edit3 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Schedule Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowScheduleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="premium-card bg-glass-dark backdrop-blur-3xl border border-glass-light rounded-3xl p-8 w-full max-w-2xl shadow-glass"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gradient">Schedule New Class</h3>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowScheduleModal(false)}
                    className="glass-button p-2 text-slate-400 hover:text-white rounded-lg transition-all duration-300"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                    <select className="w-full bg-dark-800/50 border border-glass-light rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-neon-blue focus:border-transparent">
                      <option>Physics</option>
                      <option>Chemistry</option>
                      <option>Mathematics</option>
                      <option>Biology</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Teacher</label>
                    <select className="w-full bg-dark-800/50 border border-glass-light rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-neon-blue focus:border-transparent">
                      <option>Mr. Kumar</option>
                      <option>Ms. Sharma</option>
                      <option>Dr. Patel</option>
                      <option>Ms. Singh</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Batch</label>
                    <select className="w-full bg-dark-800/50 border border-glass-light rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-neon-blue focus:border-transparent">
                      <option>NEET 12th</option>
                      <option>NEET 11th</option>
                      <option>PCM 12th</option>
                      <option>PCM 11th</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Room</label>
                    <select className="w-full bg-dark-800/50 border border-glass-light rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-neon-blue focus:border-transparent">
                      <option>Room 101</option>
                      <option>Room 102</option>
                      <option>Room 103</option>
                      <option>Lab 1</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                    <input 
                      type="date" 
                      className="w-full bg-dark-800/50 border border-glass-light rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-neon-blue focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Time</label>
                    <input 
                      type="time" 
                      className="w-full bg-dark-800/50 border border-glass-light rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-neon-blue focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowScheduleModal(false)}
                    className="px-6 py-3 text-slate-400 hover:text-white font-medium transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-premium bg-gradient-neon text-white px-8 py-3 rounded-xl font-medium hover:shadow-neon-blue transition-all duration-300"
                  >
                    Schedule Class
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Attendance Management Component
const AttendanceManagement: React.FC = () => {
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
            <UserCheck className="w-8 h-8 mr-3 text-neon-green animate-pulse" />
            Attendance Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="stat-card-premium hover:shadow-neon-green">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">Today's Attendance</p>
                  <p className="text-4xl font-bold text-neon-green">89%</p>
                  <p className="text-sm text-neon-blue animate-pulse">218/245 Present</p>
                </div>
                <UserCheck className="w-10 h-10 text-neon-green animate-float-gentle" />
              </div>
            </div>
            
            <div className="stat-card-premium hover:shadow-neon-blue">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">Classes Today</p>
                  <p className="text-4xl font-bold text-neon-blue">8</p>
                  <p className="text-sm text-neon-green animate-pulse">All subjects</p>
                </div>
                <Calendar className="w-10 h-10 text-neon-blue animate-float-gentle" style={{animationDelay: '0.5s'}} />
              </div>
            </div>
            
            <div className="stat-card-premium hover:shadow-neon-purple">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-300">Monthly Avg</p>
                  <p className="text-4xl font-bold text-neon-purple">92%</p>
                  <p className="text-sm text-neon-pink animate-pulse">Excellent</p>
                </div>
                <BarChart3 className="w-10 h-10 text-neon-purple animate-float-gentle" style={{animationDelay: '1s'}} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// Notification Sender Component
const NotificationSender: React.FC = () => {
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
            <Bell className="w-8 h-8 mr-3 text-neon-blue animate-pulse" />
            Send Notification
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                <input 
                  type="text" 
                  placeholder="Enter notification title..."
                  className="w-full bg-dark-800/50 border border-glass-light rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-neon-blue focus:border-transparent placeholder:text-slate-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                <textarea 
                  rows={6}
                  placeholder="Enter your message here..."
                  className="w-full bg-dark-800/50 border border-glass-light rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-neon-blue focus:border-transparent placeholder:text-slate-500 resize-none"
                ></textarea>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-premium bg-gradient-neon text-white py-4 rounded-xl font-medium hover:shadow-neon-blue transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Bell className="w-5 h-5" />
                Send Notification
              </motion.button>
            </div>
            
            <div className="glass-button bg-dark-800/50 border border-glass-light rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Bell className="w-5 h-5 mr-2 text-neon-green" />
                Recent Notifications
              </h3>
              <div className="text-center py-8">
                <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Recent notifications will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
};

// Placeholder Admin Components
const AdminTeacherManagement: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="card p-8 text-center">
        <Users className="w-16 h-16 text-blue-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Teacher Management</h3>
        <p className="text-slate-400">Manage teacher accounts, permissions, and assignments</p>
        <p className="text-sm text-slate-500 mt-4">This feature is available in the User Management tab above.</p>
      </div>
    </div>
  )
}

const AdminStudentManagement: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="card p-8 text-center">
        <BookOpen className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Student Management</h3>
        <p className="text-slate-400">Manage student accounts, enrollments, and batch assignments</p>
        <p className="text-sm text-slate-500 mt-4">This feature is available in the User Management tab above.</p>
      </div>
    </div>
  )
}

const AdminAnalytics: React.FC<{ stats: AdminStats | null }> = ({ stats }) => {
  return (
    <div className="space-y-8">
      <div className="card p-8 text-center">
        <BarChart3 className="w-16 h-16 text-purple-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Advanced Analytics</h3>
        <p className="text-slate-400">Detailed performance metrics and insights</p>
        <p className="text-sm text-slate-500 mt-4">Advanced analytics features coming soon.</p>
      </div>
    </div>
  )
}

const SystemSettings: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="card p-8 text-center">
        <Settings className="w-16 h-16 text-orange-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">System Settings</h3>
        <p className="text-slate-400">Configure system preferences and security settings</p>
        <p className="text-sm text-slate-500 mt-4">System configuration features coming soon.</p>
      </div>
    </div>
  )
}

export default HeadTeacherDashboard
