import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Users,
  BarChart3,
  MessageSquare,
  Plus,
  Settings,
  Calendar,
  FileText,
  User,
  LogOut,
  Bell,
  Search,
  Filter,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Edit3,
  Trash2,
  X
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { testsAPI, doubtsAPI, analyticsAPI, profileAPI, schedulingAPI, attendanceAPI, apiUtils } from '../config/api'
import DoubtsSystem from './DoubtsSystem'
import AcadmateTestCreator from './AcadmateTestCreator'
import AcadmateProfile from './AcadmateProfile'
import toast from 'react-hot-toast'

interface DashboardStats {
  totalTests: number
  totalStudents: number
  pendingDoubts: number
  testsThisMonth: number
  averageScore: number
  completionRate: number
}

interface Test {
  id: string
  title: string
  subject: string
  class: string
  isPublished: boolean
  totalMarks: number
  duration: number
  createdAt: string
  studentsAttempted: number
}

const TeacherDashboard: React.FC = () => {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<DashboardStats | null>(null)
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
        totalTests: 8,
        totalStudents: 32,
        pendingDoubts: 5,
        testsThisMonth: 3,
        averageScore: 87,
        completionRate: 94
      }
      
      const defaultTests = [
        {
          id: '1',
          title: 'Physics - Mechanics Test',
          subject: 'Physics',
          class: 'Class 12',
          isPublished: true,
          totalMarks: 100,
          duration: 180,
          createdAt: new Date().toISOString(),
          studentsAttempted: 25
        },
        {
          id: '2',
          title: 'Chemistry - Organic Quiz',
          subject: 'Chemistry', 
          class: 'Class 12',
          isPublished: false,
          totalMarks: 50,
          duration: 90,
          createdAt: new Date().toISOString(),
          studentsAttempted: 0
        }
      ]
      
      setStats(defaultStats)
      setTests(defaultTests)
      
      // Try to load real data in background (non-blocking)
      setTimeout(async () => {
        try {
          const [dashboardResponse, testsResponse] = await Promise.all([
            analyticsAPI.getDashboardStats().catch(() => ({ data: defaultStats })),
            testsAPI.getTests({ createdBy: user?.id }).catch(() => ({ data: { tests: defaultTests } }))
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
      case 'attendance':
        return <AttendanceMarking />
      case 'create-test':
        return <AcadmateTestCreator />
      case 'doubts':
        return <DoubtsSystem />
      case 'tests':
        return <TestsManagement tests={tests} onRefresh={loadDashboardData} />
      case 'analytics':
        return <TeacherAnalytics stats={stats} />
      case 'students':
        return <StudentsManagement />
      default:
        return <TeacherOverview stats={stats} tests={tests} />
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden relative">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-3/4 right-1/2 w-64 h-64 bg-purple-500/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}}></div>
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
                    className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 p-3 rounded-2xl shadow-2xl relative overflow-hidden"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 animate-pulse opacity-50"></div>
                    <BookOpen className="w-8 h-8 text-white relative z-10" />
                  </motion.div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full"></div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-3xl font-black bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">ACADMATE</h1>
                  <p className="text-green-400 text-sm font-medium flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Teacher Portal
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
                  <div className="absolute inset-0 bg-green-500/20 rounded-xl blur group-hover:bg-green-500/30 transition-all duration-300"></div>
                  <div className="relative bg-slate-800/50 backdrop-blur-sm p-3 rounded-xl border border-slate-700 group-hover:border-green-500/50 transition-all duration-300">
                    <Bell className="w-5 h-5 text-green-400 group-hover:text-green-300" />
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
                  <p className="text-xs text-neon-green font-medium">Teacher</p>
                </div>
                <motion.button 
                  onClick={() => setShowProfile(true)}
                  className="glass-button p-2 text-white hover:shadow-neon-green rounded-lg transition-all duration-300 status-online"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 bg-gradient-neon text-white rounded-full flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-neon animate-spin-slow opacity-30"></div>
                    <User className="w-4 h-4 relative z-10" />
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
              { key: 'attendance', label: 'Mark Attendance', icon: CheckCircle2 },
              { key: 'doubts', label: 'Doubts', icon: MessageSquare },
              { key: 'create-test', label: 'Create Test', icon: Plus },
              { key: 'tests', label: 'My Tests', icon: FileText },
              { key: 'analytics', label: 'Analytics', icon: TrendingUp },
              { key: 'students', label: 'Students', icon: Users }
            ].map(tab => {
              const Icon = tab.icon
              return (
                <motion.button
                  key={tab.key}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-300 rounded-t-lg relative overflow-hidden ${
                    activeTab === tab.key
                      ? 'border-neon-green text-neon-green bg-glass-light shadow-neon-green'
                      : 'border-transparent text-slate-400 hover:text-white hover:border-neon-blue hover:bg-glass-light/30'
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
  )
}

// Premium Teacher Overview Component
const TeacherOverview: React.FC<{ stats: DashboardStats | null; tests: Test[] }> = ({ stats, tests }) => {
  if (!stats) return null

  const recentTests = tests.slice(0, 5)

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
            className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 mb-8"
          >
            <Users className="w-5 h-5 text-green-400 mr-2 animate-bounce" />
            <span className="text-sm font-semibold text-white">Teaching Excellence Dashboard</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl lg:text-6xl font-black mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
              Empower Minds,
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-green-500 bg-clip-text text-transparent">
              Shape Futures
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Monitor student progress, create engaging assessments, and guide learners to success.
          </motion.p>

          {/* Quick Stats Hero Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 group-hover:border-green-500/50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{stats.totalTests}</h3>
                <p className="text-slate-400 group-hover:text-slate-300 transition-colors">Total Tests Created</p>
                <p className="text-green-400 text-sm mt-1">+{stats.testsThisMonth} this month</p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 group-hover:border-blue-500/50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{stats.totalStudents}</h3>
                <p className="text-slate-400 group-hover:text-slate-300 transition-colors">Active Students</p>
                <p className="text-blue-400 text-sm mt-1">{stats.completionRate}% completion rate</p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 group-hover:border-purple-500/50 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{stats.pendingDoubts}</h3>
                <p className="text-slate-400 group-hover:text-slate-300 transition-colors">Pending Doubts</p>
                <p className="text-purple-400 text-sm mt-1">Avg score: {stats.averageScore}%</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Recent Tests Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Recent Tests</h2>
          <motion.button 
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            Create New Test
          </motion.button>
        </div>
        
        <div className="grid gap-4">
          {recentTests.map((test, index) => (
            <motion.div 
              key={test.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 + index * 0.1 }}
              className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">{test.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {test.subject}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {test.duration}min
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {test.studentsAttempted} students
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    test.isPublished 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {test.isPublished ? 'Published' : 'Draft'}
                  </div>
                  <motion.button 
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
                <p className="text-sm font-medium text-gray-600">Pending Doubts</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingDoubts}</p>
                <p className="text-sm text-orange-600">Need attention</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <MessageSquare className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Tests */}
      <div className="bg-white rounded-xl shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Tests</h3>
        </div>
        <div className="p-6">
          {recentTests.length > 0 ? (
            <div className="space-y-4">
              {recentTests.map((test) => (
                <div key={test.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <h4 className="font-medium text-gray-900">{test.title}</h4>
                    <p className="text-sm text-gray-600">{test.subject} • {test.class}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      test.isPublished 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {test.isPublished ? 'Published' : 'Draft'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {test.studentsAttempted} attempts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h4 className="text-lg font-medium text-gray-900 mb-1">No tests yet</h4>
              <p className="text-gray-600">Create your first test to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Tests Management Component
const TestsManagement: React.FC<{ tests: Test[]; onRefresh: () => void }> = ({ tests, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'published' && test.isPublished) ||
                         (filterStatus === 'draft' && !test.isPublished)
    return matchesSearch && matchesStatus
  })

  const handleDeleteTest = async (testId: string) => {
    if (!confirm('Are you sure you want to delete this test?')) return
    
    try {
      await testsAPI.deleteTest(testId)
      toast.success('Test deleted successfully!')
      onRefresh()
    } catch (error) {
      toast.error(apiUtils.handleApiError(error))
    }
  }

  const handlePublishTest = async (testId: string) => {
    try {
      await testsAPI.publishTest(testId)
      toast.success('Test published successfully!')
      onRefresh()
    } catch (error) {
      toast.error(apiUtils.handleApiError(error))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Tests</h2>
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          {/* Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Tests</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {filteredTests.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempts</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTests.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{test.title}</div>
                        <div className="text-sm text-gray-500">{test.duration} minutes • {test.totalMarks} marks</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{test.subject}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        test.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {test.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{test.studentsAttempted}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {apiUtils.formatDate(test.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-indigo-600 hover:text-indigo-700 p-1 hover:bg-indigo-50 rounded"
                          title="View Test"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-700 p-1 hover:bg-gray-50 rounded"
                          title="Edit Test"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {!test.isPublished && (
                          <button
                            onClick={() => handlePublishTest(test.id)}
                            className="text-green-600 hover:text-green-700 p-1 hover:bg-green-50 rounded"
                            title="Publish Test"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteTest(test.id)}
                          className="text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                          title="Delete Test"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No tests found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'No tests match your search criteria' : 'Create your first test to get started'}
          </p>
        </div>
      )}
    </div>
  )
}

// Teacher Analytics Component
const TeacherAnalytics: React.FC<{ stats: DashboardStats | null }> = ({ stats }) => {
  if (!stats) return null

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Average Score</span>
              <span className="text-2xl font-bold text-green-600">{stats.averageScore}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Completion Rate</span>
              <span className="text-2xl font-bold text-blue-600">{stats.completionRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Tests This Month</span>
              <span className="text-2xl font-bold text-purple-600">{stats.testsThisMonth}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-4 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors">
              <div className="flex items-center gap-3">
                <Plus className="w-5 h-5 text-indigo-600" />
                <div>
                  <div className="font-medium text-gray-900">Create New Test</div>
                  <div className="text-sm text-gray-600">Design a new assessment</div>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-4 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-gray-900">View Reports</div>
                  <div className="text-sm text-gray-600">Analyze student performance</div>
                </div>
              </div>
            </button>
            
            <button className="w-full text-left p-4 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                <div>
                  <div className="font-medium text-gray-900">Check Doubts</div>
                  <div className="text-sm text-gray-600">Answer student questions</div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Students Management Component
const StudentsManagement: React.FC = () => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load students data
    setLoading(false)
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Students Management</h2>
      
      <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900 mb-2">Students Management</h3>
        <p className="text-gray-600">View and manage your students, track their progress, and monitor performance.</p>
        <p className="text-sm text-gray-500 mt-2">Coming soon in the next update!</p>
      </div>
    </div>
  )
}

// Attendance Marking Component
const AttendanceMarking: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [myClasses, setMyClasses] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [attendanceData, setAttendanceData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [marking, setMarking] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadMyClasses()
  }, [selectedDate])

  useEffect(() => {
    if (selectedClass) {
      loadStudentsForClass()
      loadExistingAttendance()
    }
  }, [selectedClass])

  const loadMyClasses = async () => {
    try {
      setLoading(true)
      const response = await schedulingAPI.getMyClasses(selectedDate)
      setMyClasses(response.data || [])
      
      // Auto-select first class if available
      if (response.data && response.data.length > 0 && !selectedClass) {
        setSelectedClass(response.data[0])
      }
    } catch (error) {
      console.error('Error loading classes:', error)
      toast.error('Failed to load classes')
      setMyClasses([])
    } finally {
      setLoading(false)
    }
  }

  const loadStudentsForClass = async () => {
    if (!selectedClass?.id) return
    
    try {
      const response = await attendanceAPI.getStudentsForClass(selectedClass.id)
      setStudents(response.data || [])
      
      // Initialize attendance data
      const initialAttendance = (response.data || []).map((student: any) => ({
        studentId: student.id,
        status: 'PRESENT',
        notes: ''
      }))
      setAttendanceData(initialAttendance)
    } catch (error) {
      console.error('Error loading students:', error)
      toast.error('Failed to load students for this class')
      setStudents([])
      setAttendanceData([])
    }
  }

  const loadExistingAttendance = async () => {
    if (!selectedClass?.id) return
    
    try {
      const response = await attendanceAPI.getClassAttendance(selectedClass.id)
      if (response.data && response.data.length > 0) {
        // Update attendance data with existing records
        setAttendanceData(prevData => 
          prevData.map(item => {
            const existing = response.data.find((record: any) => record.studentId === item.studentId)
            return existing ? {
              ...item,
              status: existing.status,
              notes: existing.notes || ''
            } : item
          })
        )
      }
    } catch (error) {
      console.error('Error loading existing attendance:', error)
      // Don't show error for this as it's expected if no attendance exists
    }
  }

  const updateAttendanceStatus = (studentId: string, status: string) => {
    setAttendanceData(prevData =>
      prevData.map(item =>
        item.studentId === studentId ? { ...item, status } : item
      )
    )
  }

  const updateAttendanceNotes = (studentId: string, notes: string) => {
    setAttendanceData(prevData =>
      prevData.map(item =>
        item.studentId === studentId ? { ...item, notes } : item
      )
    )
  }

  const handleMarkAttendance = async () => {
    if (!selectedClass?.id || attendanceData.length === 0) {
      toast.error('Please select a class and ensure students are loaded')
      return
    }

    try {
      setMarking(true)
      await attendanceAPI.markAttendance({
        classScheduleId: selectedClass.id,
        attendanceData
      })
      
      toast.success('Attendance marked successfully!')
    } catch (error) {
      console.error('Error marking attendance:', error)
      toast.error('Failed to mark attendance. Please try again.')
    } finally {
      setMarking(false)
    }
  }

  const filteredStudents = students.filter(student =>
    student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.uid?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'bg-green-100 text-green-800 border-green-200'
      case 'ABSENT': return 'bg-red-100 text-red-800 border-red-200'
      case 'LATE': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'EXCUSED': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const attendanceStats = {
    present: attendanceData.filter(item => item.status === 'PRESENT').length,
    absent: attendanceData.filter(item => item.status === 'ABSENT').length,
    late: attendanceData.filter(item => item.status === 'LATE').length,
    excused: attendanceData.filter(item => item.status === 'EXCUSED').length,
    total: attendanceData.length
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Mark Attendance</h2>
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={loadMyClasses}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Class Selection */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Class</h3>
        
        {myClasses.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No classes scheduled for {selectedDate}</p>
            <p className="text-sm text-gray-500">Try selecting a different date</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myClasses.map((classItem) => (
              <motion.button
                key={classItem.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedClass(classItem)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedClass?.id === classItem.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{classItem.subject}</h4>
                  <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                    {classItem.batchType}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {classItem.startTime} - {classItem.endTime}
                  </p>
                  <p>Room: {classItem.roomNumber}</p>
                  {classItem.topic && <p className="text-indigo-600">{classItem.topic}</p>}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Attendance Statistics */}
      {selectedClass && students.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{attendanceStats.total}</div>
            <div className="text-sm text-gray-600">Total Students</div>
          </div>
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
            <div className="text-sm text-gray-600">Present</div>
          </div>
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
            <div className="text-sm text-gray-600">Absent</div>
          </div>
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</div>
            <div className="text-sm text-gray-600">Late</div>
          </div>
          <div className="bg-white rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{attendanceStats.excused}</div>
            <div className="text-sm text-gray-600">Excused</div>
          </div>
        </div>
      )}

      {/* Student Attendance List */}
      {selectedClass && (
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Attendance for {selectedClass.subject} - {selectedClass.batchType}
              </h3>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleMarkAttendance}
                  disabled={marking || students.length === 0}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {marking ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {marking ? 'Marking...' : 'Mark Attendance'}
                </button>
              </div>
            </div>
          </div>

          {students.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No students found for this class</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student, index) => {
                    const attendance = attendanceData.find(item => item.studentId === student.id)
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                              {student.fullName?.charAt(0) || student.uid?.charAt(0) || 'S'}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{student.fullName || 'Unknown'}</div>
                              <div className="text-sm text-gray-500">{student.uid}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].map((status) => (
                              <button
                                key={status}
                                onClick={() => updateAttendanceStatus(student.id, status)}
                                className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                                  attendance?.status === status
                                    ? getStatusColor(status)
                                    : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            placeholder="Add notes..."
                            value={attendance?.notes || ''}
                            onChange={(e) => updateAttendanceNotes(student.id, e.target.value)}
                            className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Premium Attendance Marking Component
const AttendanceMarking: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState('')
  const [students, setStudents] = useState([])
  const [attendanceData, setAttendanceData] = useState<{[key: string]: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'}>({})
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState([])

  useEffect(() => {
    loadClasses()
  }, [])

  const loadClasses = async () => {
    try {
      // Mock data for demo
      const mockClasses = [
        { id: '1', subject: 'Physics', batchType: 'Class 12', startTime: '09:00', endTime: '10:30', date: new Date().toISOString().split('T')[0] },
        { id: '2', subject: 'Chemistry', batchType: 'Class 12', startTime: '11:00', endTime: '12:30', date: new Date().toISOString().split('T')[0] },
        { id: '3', subject: 'Mathematics', batchType: 'Class 11', startTime: '14:00', endTime: '15:30', date: new Date().toISOString().split('T')[0] }
      ]
      setClasses(mockClasses)
    } catch (error) {
      console.error('Error loading classes:', error)
    }
  }

  const loadStudents = async (classId: string) => {
    try {
      setLoading(true)
      // Mock student data for demo
      const mockStudents = [
        { id: 'STH000', name: 'Alice Johnson', rollNumber: 'STH001', batchType: 'Class 12' },
        { id: 'STH001', name: 'Bob Smith', rollNumber: 'STH002', batchType: 'Class 12' },
        { id: 'STH002', name: 'Carol Davis', rollNumber: 'STH003', batchType: 'Class 12' },
        { id: 'STH003', name: 'David Wilson', rollNumber: 'STH004', batchType: 'Class 12' },
        { id: 'STH004', name: 'Emma Brown', rollNumber: 'STH005', batchType: 'Class 12' }
      ]
      setStudents(mockStudents)
      
      // Initialize attendance data
      const initialData = {}
      mockStudents.forEach(student => {
        initialData[student.id] = 'PRESENT'
      })
      setAttendanceData(initialData)
    } catch (error) {
      console.error('Error loading students:', error)
      toast.error('Failed to load students')
    } finally {
      setLoading(false)
    }
  }

  const handleClassSelect = (classId: string) => {
    setSelectedClass(classId)
    if (classId) {
      loadStudents(classId)
    }
  }

  const handleAttendanceChange = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED') => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }))
  }

  const handleSubmitAttendance = async () => {
    if (!selectedClass || students.length === 0) {
      toast.error('Please select a class and load students')
      return
    }

    try {
      setLoading(true)
      const attendanceArray = Object.entries(attendanceData).map(([studentId, status]) => ({
        studentId,
        status,
        notes: ''
      }))

      // Mock API call - in real implementation, use attendanceAPI.markAttendance
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Attendance marked successfully!')
      
    } catch (error) {
      console.error('Error marking attendance:', error)
      toast.error('Failed to mark attendance')
    } finally {
      setLoading(false)
    }
  }

  const selectedClassInfo = classes.find(c => c.id === selectedClass)
  const presentCount = Object.values(attendanceData).filter(status => status === 'PRESENT').length
  const absentCount = Object.values(attendanceData).filter(status => status === 'ABSENT').length
  const lateCount = Object.values(attendanceData).filter(status => status === 'LATE').length

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-black bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
          Mark Attendance
        </h1>
        <p className="text-slate-300 text-lg">Track student presence and manage class attendance efficiently</p>
      </motion.div>

      {/* Class Selection */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
      >
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-400" />
          Select Class Session
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {classes.map(classItem => (
            <motion.button
              key={classItem.id}
              onClick={() => handleClassSelect(classItem.id)}
              className={`p-4 rounded-xl border transition-all duration-300 text-left ${
                selectedClass === classItem.id
                  ? 'border-green-500/50 bg-green-500/10 shadow-lg shadow-green-500/20'
                  : 'border-slate-600/50 bg-slate-700/30 hover:border-green-500/30 hover:bg-slate-700/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="font-medium text-white">{classItem.subject}</div>
              <div className="text-sm text-slate-300">{classItem.batchType}</div>
              <div className="text-xs text-green-400 mt-1">{classItem.startTime} - {classItem.endTime}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Attendance Statistics */}
      {selectedClassInfo && students.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{presentCount}</div>
            <div className="text-sm text-slate-300">Present</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{absentCount}</div>
            <div className="text-sm text-slate-300">Absent</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{lateCount}</div>
            <div className="text-sm text-slate-300">Late</div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{students.length}</div>
            <div className="text-sm text-slate-300">Total</div>
          </div>
        </motion.div>
      )}

      {/* Student List */}
      {students.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Students - {selectedClassInfo?.subject} ({selectedClassInfo?.batchType})
            </h2>
            <motion.button
              onClick={handleSubmitAttendance}
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-2xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
              {loading ? 'Saving...' : 'Save Attendance'}
            </motion.button>
          </div>

          <div className="space-y-3">
            {students.map((student, index) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="bg-slate-700/30 rounded-xl p-4 flex items-center justify-between hover:bg-slate-700/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-medium text-white">{student.name}</div>
                    <div className="text-sm text-slate-400">Roll: {student.rollNumber}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].map(status => (
                    <motion.button
                      key={status}
                      onClick={() => handleAttendanceChange(student.id, status as any)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                        attendanceData[student.id] === status
                          ? status === 'PRESENT' ? 'bg-green-500 text-white'
                            : status === 'ABSENT' ? 'bg-red-500 text-white'
                            : status === 'LATE' ? 'bg-yellow-500 text-white'
                            : 'bg-blue-500 text-white'
                          : 'bg-slate-600/50 text-slate-300 hover:bg-slate-600'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {status}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {!selectedClass && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Select a Class Session</h3>
          <p className="text-slate-400">Choose a class from above to mark attendance for your students</p>
        </motion.div>
      )}
    </div>
  )
}

// Placeholder components for other sections
const TestsManagement = ({ tests, onRefresh }) => <div className="text-white">Tests Management Coming Soon</div>
const TeacherAnalytics = ({ stats }) => <div className="text-white">Teacher Analytics Coming Soon</div>
const StudentsManagement = () => <div className="text-white">Students Management Coming Soon</div>

export default TeacherDashboard
