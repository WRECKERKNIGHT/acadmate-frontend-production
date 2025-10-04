import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserCheck,
  BookOpen,
  TrendingUp,
  ArrowRight,
  Bell,
  BarChart3,
  Target,
  Award,
  MapPin
} from 'lucide-react'
import { attendanceAPI } from '../../config/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

interface DashboardAttendanceData {
  todayClasses: {
    total: number
    marked: number
    pending: number
  }
  recentAttendance: {
    id: string
    studentName: string
    subject: string
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
    date: string
    time: string
  }[]
  attendanceStats: {
    overallRate: number
    weeklyRate: number
    trend: 'up' | 'down' | 'stable'
    trendPercentage: number
  }
  upcomingClasses: {
    id: string
    subject: string
    time: string
    venue: string
    studentsCount: number
    batchType: string
  }[]
  lowAttendanceAlerts: {
    id: string
    studentName: string
    uid: string
    attendanceRate: number
    daysAbsent: number
  }[]
}

interface AttendanceDashboardProps {
  onNavigateToAttendance?: () => void
}

const AttendanceDashboard: React.FC<AttendanceDashboardProps> = ({ onNavigateToAttendance }) => {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardAttendanceData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAttendanceData()
  }, [])

  const loadAttendanceData = async () => {
    try {
      setLoading(true)

      // Load multiple data sources in parallel
      const [
        todayClassesResponse,
        attendanceHistoryResponse,
        attendanceStatsResponse,
        lowAttendanceResponse
      ] = await Promise.all([
        attendanceAPI.getTodayClasses({ date: new Date().toISOString().split('T')[0] }),
        attendanceAPI.getAttendanceHistory({ limit: 5, recent: true }),
        attendanceAPI.getAttendanceStats({ period: 'weekly' }),
        attendanceAPI.getLowAttendanceAlerts({ threshold: 75, limit: 3 })
      ])

      // Process the data
      const todayClasses = todayClassesResponse.data.classes || []
      const attendanceHistory = attendanceHistoryResponse.data.records || []
      const stats = attendanceStatsResponse.data.stats || {}
      const alerts = lowAttendanceResponse.data.alerts || []

      setData({
        todayClasses: {
          total: todayClasses.length,
          marked: todayClasses.filter((c: any) => c.attendanceMarked).length,
          pending: todayClasses.filter((c: any) => !c.attendanceMarked).length
        },
        recentAttendance: attendanceHistory.slice(0, 5).map((record: any) => ({
          id: record.id,
          studentName: record.student.fullName,
          subject: record.class.subject,
          status: record.status,
          date: record.date,
          time: record.markedAt
        })),
        attendanceStats: {
          overallRate: stats.attendanceRate || 0,
          weeklyRate: stats.weeklyRate || 0,
          trend: stats.trend || 'stable',
          trendPercentage: stats.trendPercentage || 0
        },
        upcomingClasses: todayClasses
          .filter((c: any) => !c.attendanceMarked)
          .slice(0, 3)
          .map((c: any) => ({
            id: c.id,
            subject: c.subject,
            time: `${c.startTime} - ${c.endTime}`,
            venue: c.venue,
            studentsCount: c.totalStudents,
            batchType: c.batchType
          })),
        lowAttendanceAlerts: alerts.slice(0, 3)
      })

    } catch (error) {
      console.error('Error loading attendance dashboard data:', error)
      toast.error('Failed to load attendance data')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'text-green-400 bg-green-500/20'
      case 'ABSENT': return 'text-red-400 bg-red-500/20'
      case 'LATE': return 'text-orange-400 bg-orange-500/20'
      case 'EXCUSED': return 'text-blue-400 bg-blue-500/20'
      default: return 'text-slate-400 bg-slate-500/20'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
      default: return <TrendingUp className="w-4 h-4 text-slate-400" />
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-6 animate-pulse">
            <div className="h-4 bg-slate-700 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-slate-700 rounded"></div>
              <div className="h-3 bg-slate-700 rounded w-4/5"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <UserCheck className="w-6 h-6 text-green-400" />
          <h2 className="text-xl font-bold text-white">Attendance Overview</h2>
        </div>
        <button
          onClick={onNavigateToAttendance}
          className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Classes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-6 rounded-2xl border border-blue-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-blue-400 text-sm font-semibold">Today's Classes</h3>
              <p className="text-2xl font-bold text-white">{data.todayClasses.total}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-400" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Marked</span>
              <span className="text-green-400 font-semibold">{data.todayClasses.marked}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Pending</span>
              <span className="text-orange-400 font-semibold">{data.todayClasses.pending}</span>
            </div>
          </div>

          {data.todayClasses.pending > 0 && (
            <div className="mt-3 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-orange-400">
                  {data.todayClasses.pending} classes pending attendance
                </span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Attendance Rate */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-6 rounded-2xl border border-green-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-green-400 text-sm font-semibold">Attendance Rate</h3>
              <p className="text-2xl font-bold text-white">{data.attendanceStats.overallRate}%</p>
            </div>
            <Target className="w-8 h-8 text-green-400" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">This Week</span>
            <div className="flex items-center space-x-2">
              {getTrendIcon(data.attendanceStats.trend)}
              <span className={`text-sm font-semibold ${
                data.attendanceStats.trend === 'up' ? 'text-green-400' :
                data.attendanceStats.trend === 'down' ? 'text-red-400' : 'text-slate-400'
              }`}>
                {data.attendanceStats.weeklyRate}%
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300"
              style={{ width: `${data.attendanceStats.overallRate}%` }}
            />
          </div>
        </motion.div>

        {/* Low Attendance Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-red-500/20 to-red-600/20 p-6 rounded-2xl border border-red-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-red-400 text-sm font-semibold">Alerts</h3>
              <p className="text-2xl font-bold text-white">{data.lowAttendanceAlerts.length}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>

          {data.lowAttendanceAlerts.length > 0 ? (
            <div className="space-y-2">
              <div className="text-xs text-red-400">Low attendance students:</div>
              {data.lowAttendanceAlerts.map((alert) => (
                <div key={alert.id} className="flex justify-between text-xs">
                  <span className="text-slate-300 truncate">{alert.studentName}</span>
                  <span className="text-red-400 font-semibold">{alert.attendanceRate}%</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400">No alerts today</div>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Attendance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Recent Activity
            </h3>
            <button
              onClick={onNavigateToAttendance}
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              View History
            </button>
          </div>

          {data.recentAttendance.length > 0 ? (
            <div className="space-y-3">
              {data.recentAttendance.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {record.studentName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{record.studentName}</p>
                      <p className="text-slate-400 text-xs">{record.subject}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                    <span className="text-slate-400 text-xs">
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-slate-500" />
              <p>No recent attendance records</p>
            </div>
          )}
        </motion.div>

        {/* Upcoming Classes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Upcoming Classes
            </h3>
            <button
              onClick={onNavigateToAttendance}
              className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
            >
              View Schedule
            </button>
          </div>

          {data.upcomingClasses.length > 0 ? (
            <div className="space-y-4">
              {data.upcomingClasses.map((classInfo, index) => (
                <motion.div
                  key={classInfo.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{classInfo.subject}</h4>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-slate-400">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{classInfo.time}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{classInfo.venue}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{classInfo.studentsCount}</span>
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">
                      {classInfo.batchType.replace('_', ' ')}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-500" />
              <p>No upcoming classes today</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      {user?.userType === 'TEACHER' || user?.userType === 'HEAD_TEACHER' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={onNavigateToAttendance}
              className="flex items-center space-x-3 p-4 bg-green-500/20 hover:bg-green-500/30 rounded-xl transition-colors group"
            >
              <UserCheck className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <p className="text-white font-semibold">Mark Attendance</p>
                <p className="text-green-400 text-sm">For today's classes</p>
              </div>
            </button>

            <button
              onClick={onNavigateToAttendance}
              className="flex items-center space-x-3 p-4 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl transition-colors group"
            >
              <BarChart3 className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <p className="text-white font-semibold">View Reports</p>
                <p className="text-blue-400 text-sm">Attendance analytics</p>
              </div>
            </button>

            <button
              onClick={onNavigateToAttendance}
              className="flex items-center space-x-3 p-4 bg-orange-500/20 hover:bg-orange-500/30 rounded-xl transition-colors group"
            >
              <Bell className="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <p className="text-white font-semibold">Send Alerts</p>
                <p className="text-orange-400 text-sm">Low attendance</p>
              </div>
            </button>
          </div>
        </motion.div>
      ) : null}
    </div>
  )
}

export default AttendanceDashboard