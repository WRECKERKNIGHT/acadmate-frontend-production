import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Calendar,
  Users,
  Activity,
  FileText,
  Clock,
  Search,
  Filter,
  TrendingUp,
  Award,
  Target,
  BarChart3,
  Eye,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  RefreshCw
} from 'lucide-react'
import { adminAPI } from '../../config/api'
import toast from 'react-hot-toast'

interface TeacherActivity {
  id: string
  teacherId: string
  teacher: {
    fullName: string
    uid: string
    subjects?: string
  }
  type: 'TEST_CREATED' | 'HOMEWORK_ASSIGNED' | 'DOUBT_RESOLVED' | 'ATTENDANCE_MARKED' | 'LOGIN'
  description: string
  metadata?: any
  timestamp: string
}

interface TeacherStats {
  teacherId: string
  teacher: {
    fullName: string
    uid: string
    subjects?: string
    batchType?: string
  }
  stats: {
    testsCreated: number
    homeworkAssigned: number
    doubtsResolved: number
    attendanceMarked: number
    loginCount: number
    lastActive: string
    weeklyActivity: number
    monthlyActivity: number
  }
  performance: {
    rating: number
    engagement: number
    consistency: number
  }
}

const TeacherActivities: React.FC = () => {
  const [activities, setActivities] = useState<TeacherActivity[]>([])
  const [teacherStats, setTeacherStats] = useState<TeacherStats[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'activities' | 'statistics'>('activities')
  const [selectedTeacher, setSelectedTeacher] = useState<string>('')
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    page: 1,
    limit: 20
  })

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 20
  })

  useEffect(() => {
    loadData()
  }, [filters, dateRange, selectedTeacher])

  const loadData = async () => {
    try {
      setLoading(true)
      
      if (activeTab === 'activities') {
        const response = await adminAPI.getTeacherActivities({
          ...filters,
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          teacherId: selectedTeacher
        })
        setActivities(response.data.activities)
        setPagination(response.data.pagination)
      } else {
        const response = await adminAPI.getTeacherStats({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        })
        setTeacherStats(response.data.stats)
      }
    } catch (error) {
      console.error('Error loading teacher data:', error)
      toast.error('Failed to load teacher data')
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'TEST_CREATED': return <FileText className="w-4 h-4" />
      case 'HOMEWORK_ASSIGNED': return <BookOpen className="w-4 h-4" />
      case 'DOUBT_RESOLVED': return <MessageSquare className="w-4 h-4" />
      case 'ATTENDANCE_MARKED': return <CheckCircle className="w-4 h-4" />
      case 'LOGIN': return <Activity className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'TEST_CREATED': return 'from-purple-500 to-purple-400'
      case 'HOMEWORK_ASSIGNED': return 'from-blue-500 to-blue-400'
      case 'DOUBT_RESOLVED': return 'from-green-500 to-green-400'
      case 'ATTENDANCE_MARKED': return 'from-orange-500 to-orange-400'
      case 'LOGIN': return 'from-gray-500 to-gray-400'
      default: return 'from-slate-500 to-slate-400'
    }
  }

  const getPerformanceColor = (rating: number) => {
    if (rating >= 90) return 'text-green-400'
    if (rating >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const exportData = async () => {
    try {
      const response = await adminAPI.exportTeacherData({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        format: 'csv'
      })
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `teacher-activities-${dateRange.startDate}-to-${dateRange.endDate}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
      
      toast.success('Data exported successfully!')
    } catch (error) {
      toast.error('Failed to export data')
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent flex items-center">
            <BookOpen className="w-8 h-8 mr-3 text-green-400" />
            Teacher Activities
          </h1>
          <p className="text-slate-400 mt-2">Monitor teacher performance and activities</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <motion.button
            onClick={() => loadData()}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className="w-5 h-5 text-white" />
          </motion.button>
          <motion.button
            onClick={exportData}
            className="btn-secondary px-6 py-3 rounded-full flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-5 h-5" />
            <span>Export</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Tab Switcher */}
          <div className="flex bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('activities')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'activities'
                  ? 'bg-green-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Activities
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'statistics'
                  ? 'bg-green-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Statistics
            </button>
          </div>

          {/* Date Range */}
          <div className="flex items-center space-x-2">
            <input
              type="date"
              className="input"
              value={dateRange.startDate}
              onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              className="input"
              value={dateRange.endDate}
              onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
            />
          </div>
        </div>

        {activeTab === 'activities' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search activities..."
                className="input pl-10"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              />
            </div>
            
            <select
              className="input"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
            >
              <option value="">All Activities</option>
              <option value="TEST_CREATED">Tests Created</option>
              <option value="HOMEWORK_ASSIGNED">Homework Assigned</option>
              <option value="DOUBT_RESOLVED">Doubts Resolved</option>
              <option value="ATTENDANCE_MARKED">Attendance Marked</option>
              <option value="LOGIN">Logins</option>
            </select>
            
            <select
              className="input"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
            >
              <option value="">All Teachers</option>
              {/* This would be populated from API */}
            </select>
          </div>
        )}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card overflow-hidden"
      >
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin"></div>
          </div>
        ) : activeTab === 'activities' ? (
          <ActivitiesTable activities={activities} pagination={pagination} filters={filters} setFilters={setFilters} />
        ) : (
          <StatisticsView teacherStats={teacherStats} />
        )}
      </motion.div>
    </div>
  )
}

// Activities Table Component
const ActivitiesTable: React.FC<{
  activities: TeacherActivity[]
  pagination: any
  filters: any
  setFilters: (filters: any) => void
}> = ({ activities, pagination, filters, setFilters }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'TEST_CREATED': return <FileText className="w-4 h-4 text-white" />
      case 'HOMEWORK_ASSIGNED': return <BookOpen className="w-4 h-4 text-white" />
      case 'DOUBT_RESOLVED': return <MessageSquare className="w-4 h-4 text-white" />
      case 'ATTENDANCE_MARKED': return <CheckCircle className="w-4 h-4 text-white" />
      case 'LOGIN': return <Activity className="w-4 h-4 text-white" />
      default: return <Clock className="w-4 h-4 text-white" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'TEST_CREATED': return 'from-purple-500 to-purple-400'
      case 'HOMEWORK_ASSIGNED': return 'from-blue-500 to-blue-400'
      case 'DOUBT_RESOLVED': return 'from-green-500 to-green-400'
      case 'ATTENDANCE_MARKED': return 'from-orange-500 to-orange-400'
      case 'LOGIN': return 'from-gray-500 to-gray-400'
      default: return 'from-slate-500 to-slate-400'
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-slate-300 font-semibold">Activity</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Teacher</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Type</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Description</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Time</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity, index) => (
              <motion.tr
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${getActivityColor(activity.type)} rounded-xl flex items-center justify-center`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{activity.type.replace('_', ' ')}</div>
                      <div className="text-xs text-slate-400">#{activity.id.slice(0, 8)}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <div className="font-semibold text-white">{activity.teacher.fullName}</div>
                    <div className="text-sm text-slate-400">{activity.teacher.uid}</div>
                    {activity.teacher.subjects && (
                      <div className="text-xs text-green-400">{JSON.parse(activity.teacher.subjects).join(', ')}</div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getActivityColor(activity.type)} text-white`}>
                    {activity.type.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-slate-300 max-w-xs truncate">
                  {activity.description}
                </td>
                <td className="p-4 text-slate-300">
                  {new Date(activity.timestamp).toLocaleString()}
                </td>
                <td className="p-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-white/10">
          <div className="text-slate-400 text-sm">
            Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.limit, pagination.totalCount)} of{' '}
            {pagination.totalCount} activities
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 bg-white/10 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded">
              {pagination.currentPage} / {pagination.totalPages}
            </span>
            <button
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 bg-white/10 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  )
}

// Statistics View Component
const StatisticsView: React.FC<{
  teacherStats: TeacherStats[]
}> = ({ teacherStats }) => {
  const getPerformanceColor = (rating: number) => {
    if (rating >= 90) return 'text-green-400'
    if (rating >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getPerformanceIcon = (rating: number) => {
    if (rating >= 90) return <Award className="w-4 h-4 text-green-400" />
    if (rating >= 70) return <Target className="w-4 h-4 text-yellow-400" />
    return <AlertCircle className="w-4 h-4 text-red-400" />
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-6 rounded-2xl border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-purple-400 text-sm font-semibold mb-2">Total Tests</h3>
              <p className="text-2xl font-bold text-white">
                {teacherStats.reduce((sum, teacher) => sum + teacher.stats.testsCreated, 0)}
              </p>
            </div>
            <FileText className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-6 rounded-2xl border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-400 text-sm font-semibold mb-2">Homework Assigned</h3>
              <p className="text-2xl font-bold text-white">
                {teacherStats.reduce((sum, teacher) => sum + teacher.stats.homeworkAssigned, 0)}
              </p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-6 rounded-2xl border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-green-400 text-sm font-semibold mb-2">Doubts Resolved</h3>
              <p className="text-2xl font-bold text-white">
                {teacherStats.reduce((sum, teacher) => sum + teacher.stats.doubtsResolved, 0)}
              </p>
            </div>
            <MessageSquare className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 p-6 rounded-2xl border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-orange-400 text-sm font-semibold mb-2">Avg Performance</h3>
              <p className="text-2xl font-bold text-white">
                {teacherStats.length ? 
                  Math.round(teacherStats.reduce((sum, teacher) => sum + teacher.performance.rating, 0) / teacherStats.length) 
                  : 0}%
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Teacher Performance Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-slate-300 font-semibold">Teacher</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Performance</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Tests</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Homework</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Doubts</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Activity</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {teacherStats.map((teacher, index) => (
              <motion.tr
                key={teacher.teacherId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{teacher.teacher.fullName}</div>
                      <div className="text-sm text-slate-400">{teacher.teacher.uid}</div>
                      {teacher.teacher.subjects && (
                        <div className="text-xs text-green-400">{JSON.parse(teacher.teacher.subjects).join(', ')}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    {getPerformanceIcon(teacher.performance.rating)}
                    <span className={`font-semibold ${getPerformanceColor(teacher.performance.rating)}`}>
                      {teacher.performance.rating}%
                    </span>
                  </div>
                  <div className="flex space-x-2 mt-1">
                    <div className="text-xs text-slate-400">
                      Engagement: <span className="text-blue-400">{teacher.performance.engagement}%</span>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-center">
                  <div className="text-xl font-bold text-purple-400">{teacher.stats.testsCreated}</div>
                  <div className="text-xs text-slate-400">created</div>
                </td>
                <td className="p-4 text-center">
                  <div className="text-xl font-bold text-blue-400">{teacher.stats.homeworkAssigned}</div>
                  <div className="text-xs text-slate-400">assigned</div>
                </td>
                <td className="p-4 text-center">
                  <div className="text-xl font-bold text-green-400">{teacher.stats.doubtsResolved}</div>
                  <div className="text-xs text-slate-400">resolved</div>
                </td>
                <td className="p-4 text-center">
                  <div className="text-sm text-white">Weekly: <span className="text-orange-400">{teacher.stats.weeklyActivity}</span></div>
                  <div className="text-sm text-white">Monthly: <span className="text-pink-400">{teacher.stats.monthlyActivity}</span></div>
                </td>
                <td className="p-4 text-slate-300">
                  {teacher.stats.lastActive ? new Date(teacher.stats.lastActive).toLocaleDateString() : 'Never'}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TeacherActivities