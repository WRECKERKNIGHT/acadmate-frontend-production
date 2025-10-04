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
  X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { analyticsAPI, academicAPI, profileAPI } from '../config/api'
import AcadmateProfile from './AcadmateProfile'
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
      case 'teachers':
        return <TeacherManagement />
      case 'students':
        return <StudentManagement />
      case 'analytics':
        return <AdminAnalytics stats={stats} />
      case 'settings':
        return <SystemSettings />
      default:
        return <AdminOverview stats={stats} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-2 rounded-xl">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Acadmate Admin</h1>
                <p className="text-sm text-gray-600">Head Teacher Dashboard</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <button 
                  onClick={() => setShowProfile(true)}
                  className="flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                </button>
                
                <button 
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Navigation Tabs */}
      <motion.nav 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'teachers', label: 'Teachers', icon: UserCheck },
              { key: 'students', label: 'Students', icon: Users },
              { key: 'analytics', label: 'Analytics', icon: TrendingUp },
              { key: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => {
              const Icon = tab.icon
              return (
                <motion.button
                  key={tab.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.key
                      ? 'border-red-500 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
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

// Admin Overview Component
const AdminOverview: React.FC<{ stats: AdminStats | null }> = ({ stats }) => {
  if (!stats) return null

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Teachers</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTeachers}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tests</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTests}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">System Health</p>
              <p className="text-lg font-bold text-green-600">{stats.systemHealth}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 text-left rounded-lg border hover:bg-gray-50">
            <Plus className="w-6 h-6 text-indigo-600 mb-2" />
            <h4 className="font-medium">Add New Teacher</h4>
            <p className="text-sm text-gray-600">Invite teachers to the platform</p>
          </button>
          <button className="p-4 text-left rounded-lg border hover:bg-gray-50">
            <BarChart3 className="w-6 h-6 text-green-600 mb-2" />
            <h4 className="font-medium">View Reports</h4>
            <p className="text-sm text-gray-600">Check performance analytics</p>
          </button>
          <button className="p-4 text-left rounded-lg border hover:bg-gray-50">
            <Settings className="w-6 h-6 text-purple-600 mb-2" />
            <h4 className="font-medium">System Settings</h4>
            <p className="text-sm text-gray-600">Configure platform settings</p>
          </button>
        </div>
      </div>
    </div>
  )
}

// Placeholder components for admin features
const TeacherManagement: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Teacher Management</h2>
    <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
      <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-900 mb-2">Teacher Management</h3>
      <p className="text-gray-600">Manage teacher accounts, assign subjects and classes.</p>
    </div>
  </div>
)

const StudentManagement: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-900">Student Management</h2>
    <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-xl font-medium text-gray-900 mb-2">Student Management</h3>
      <p className="text-gray-600">View and manage student accounts and progress.</p>
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

export default HeadTeacherDashboard
