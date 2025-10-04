import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Search,
  Download,
  Upload,
  Plus,
  Edit3,
  Save,
  BarChart3,
  TrendingUp,
  AlertCircle,
  UserCheck,
  UserX,
  BookOpen,
  MapPin,
  Bell,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { attendanceAPI } from '../../config/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

interface AttendanceRecord {
  id: string
  studentId: string
  student: {
    fullName: string
    uid: string
    batchType: string
  }
  classId: string
  class: {
    subject: string
    topic: string
    venue: string
  }
  date: string
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
  markedAt: string
  markedBy: {
    fullName: string
    uid: string
  }
  remarks?: string
}

interface ClassSession {
  id: string
  subject: string
  topic: string
  batchType: string
  date: string
  startTime: string
  endTime: string
  venue: string
  teacher: {
    fullName: string
    uid: string
  }
  totalStudents: number
  presentCount: number
  absentCount: number
  lateCount: number
  attendanceMarked: boolean
  students: {
    id: string
    fullName: string
    uid: string
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED' | null
  }[]
}

interface AttendanceStats {
  totalClasses: number
  presentCount: number
  absentCount: number
  lateCount: number
  attendanceRate: number
  monthlyRate: number
  weeklyTrend: {
    date: string
    rate: number
  }[]
}

const AttendanceManager: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'today' | 'history' | 'statistics' | 'schedule'>('today')
  const [todayClasses, setTodayClasses] = useState<ClassSession[]>([])
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([])
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null)
  const [showMarkingModal, setShowMarkingModal] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const [filters, setFilters] = useState({
    search: '',
    subject: '',
    batchType: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  })

  useEffect(() => {
    loadAttendanceData()
  }, [activeTab, currentDate, filters])

  const loadAttendanceData = async () => {
    try {
      setLoading(true)
      
      switch (activeTab) {
        case 'today':
          await loadTodayClasses()
          break
        case 'history':
          await loadAttendanceHistory()
          break
        case 'statistics':
          await loadAttendanceStats()
          break
        case 'schedule':
          await loadScheduledClasses()
          break
      }
    } catch (error) {
      console.error('Error loading attendance data:', error)
      toast.error('Failed to load attendance data')
    } finally {
      setLoading(false)
    }
  }

  const loadTodayClasses = async () => {
    const response = await attendanceAPI.getTodayClasses({
      date: currentDate.toISOString().split('T')[0]
    })
    setTodayClasses(response.data.classes || [])
  }

  const loadAttendanceHistory = async () => {
    const response = await attendanceAPI.getAttendanceHistory({
      ...filters,
      startDate: filters.dateFrom || undefined,
      endDate: filters.dateTo || undefined
    })
    setAttendanceHistory(response.data.records || [])
  }

  const loadAttendanceStats = async () => {
    const response = await attendanceAPI.getAttendanceStats({
      startDate: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0],
      endDate: currentDate.toISOString().split('T')[0]
    })
    setAttendanceStats(response.data.stats)
  }

  const loadScheduledClasses = async () => {
    const response = await attendanceAPI.getScheduledClasses({
      date: currentDate.toISOString().split('T')[0],
      ...filters
    })
    setTodayClasses(response.data.classes || [])
  }

  const handleMarkAttendance = async (classId: string, attendanceData: any[]) => {
    try {
      await attendanceAPI.markAttendance(classId, { attendance: attendanceData })
      toast.success('Attendance marked successfully!')
      setShowMarkingModal(false)
      setSelectedClass(null)
      loadTodayClasses()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to mark attendance')
    }
  }

  const handleBulkMarkAttendance = async (classId: string, status: string) => {
    try {
      await attendanceAPI.bulkMarkAttendance(classId, { status })
      toast.success(`All students marked as ${status.toLowerCase()}!`)
      loadTodayClasses()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to mark attendance')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'ABSENT': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'LATE': return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
      case 'EXCUSED': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'ABSENT': return <XCircle className="w-4 h-4 text-red-400" />
      case 'LATE': return <Clock className="w-4 h-4 text-orange-400" />
      case 'EXCUSED': return <AlertCircle className="w-4 h-4 text-blue-400" />
      default: return <Users className="w-4 h-4 text-slate-400" />
    }
  }

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    setCurrentDate(newDate)
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent flex items-center">
            <UserCheck className="w-8 h-8 mr-3 text-green-400" />
            Attendance Management
          </h1>
          <p className="text-slate-400 mt-2">Track and manage student attendance across all classes</p>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/5 rounded-xl p-2">
            <motion.button
              onClick={() => navigateDate('prev')}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>
            
            <div className="text-center px-4">
              <div className="text-sm font-semibold text-white">
                {currentDate.toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
              <div className="text-xs text-slate-400">
                {currentDate.getFullYear()}
              </div>
            </div>
            
            <motion.button
              onClick={() => navigateDate('next')}
              className="p-2 text-slate-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
          
          <motion.button
            onClick={() => setCurrentDate(new Date())}
            className="btn-secondary px-4 py-2 rounded-lg text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Today
          </motion.button>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Tab Switcher */}
          <div className="flex bg-white/5 rounded-xl p-1">
            {[
              { id: 'today', name: "Today's Classes", icon: Calendar },
              { id: 'history', name: 'History', icon: BarChart3 },
              { id: 'statistics', name: 'Statistics', icon: TrendingUp },
              { id: 'schedule', name: 'Schedule', icon: Clock }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-green-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filters for History and Schedule tabs */}
        {(activeTab === 'history' || activeTab === 'schedule') && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search students..."
                className="input pl-10"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
            
            <select
              className="input"
              value={filters.subject}
              onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            >
              <option value="">All Subjects</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Biology">Biology</option>
            </select>
            
            <select
              className="input"
              value={filters.batchType}
              onChange={(e) => setFilters({ ...filters, batchType: e.target.value })}
            >
              <option value="">All Batches</option>
              <option value="NEET_11">NEET 11</option>
              <option value="NEET_12">NEET 12</option>
              <option value="PCM_11">PCM 11</option>
              <option value="PCM_12">PCM 12</option>
              <option value="IN_CLASS_9">Class 9</option>
              <option value="IN_CLASS_10">Class 10</option>
            </select>
            
            {activeTab === 'history' && (
              <>
                <input
                  type="date"
                  className="input"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  placeholder="From Date"
                />
                
                <input
                  type="date"
                  className="input"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  placeholder="To Date"
                />
              </>
            )}
          </div>
        )}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {activeTab === 'today' && (
              <TodayClassesView 
                classes={todayClasses}
                onMarkAttendance={(classData) => {
                  setSelectedClass(classData)
                  setShowMarkingModal(true)
                }}
                onBulkMark={handleBulkMarkAttendance}
              />
            )}
            {activeTab === 'history' && (
              <AttendanceHistoryView records={attendanceHistory} />
            )}
            {activeTab === 'statistics' && (
              <AttendanceStatisticsView stats={attendanceStats} />
            )}
            {activeTab === 'schedule' && (
              <ScheduleView classes={todayClasses} currentDate={currentDate} />
            )}
          </>
        )}
      </motion.div>

      {/* Attendance Marking Modal */}
      <AttendanceMarkingModal
        isOpen={showMarkingModal}
        classData={selectedClass}
        onClose={() => {
          setShowMarkingModal(false)
          setSelectedClass(null)
        }}
        onSubmit={handleMarkAttendance}
      />
    </div>
  )
}

// Today's Classes View Component
const TodayClassesView: React.FC<{
  classes: ClassSession[]
  onMarkAttendance: (classData: ClassSession) => void
  onBulkMark: (classId: string, status: string) => void
}> = ({ classes, onMarkAttendance, onBulkMark }) => {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Classes',
            value: classes.length,
            icon: BookOpen,
            color: 'from-blue-500 to-blue-600'
          },
          {
            title: 'Attendance Marked',
            value: classes.filter(c => c.attendanceMarked).length,
            icon: CheckCircle,
            color: 'from-green-500 to-green-600'
          },
          {
            title: 'Pending',
            value: classes.filter(c => !c.attendanceMarked).length,
            icon: Clock,
            color: 'from-orange-500 to-orange-600'
          },
          {
            title: 'Total Students',
            value: classes.reduce((sum, c) => sum + c.totalStudents, 0),
            icon: Users,
            color: 'from-purple-500 to-purple-600'
          }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-gradient-to-br ${stat.color} p-6 rounded-2xl border border-white/10`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white/80 text-sm font-semibold mb-2">{stat.title}</h3>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
              <stat.icon className="w-12 h-12 text-white/60" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Classes List */}
      <div className="space-y-4">
        {classes.map((classData, index) => (
          <motion.div
            key={classData.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card p-6 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-white">{classData.subject}</h3>
                    {classData.attendanceMarked ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium border text-green-400 bg-green-500/20 border-green-500/30">
                        Marked
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium border text-orange-400 bg-orange-500/20 border-orange-500/30">
                        Pending
                      </span>
                    )}
                  </div>
                  
                  <p className="text-slate-300 mb-3">{classData.topic}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-400">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{classData.batchType.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{classData.startTime} - {classData.endTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{classData.venue}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UserCheck className="w-4 h-4" />
                      <span>{classData.teacher.fullName}</span>
                    </div>
                  </div>

                  {/* Attendance Summary */}
                  {classData.attendanceMarked && (
                    <div className="mt-4 p-4 bg-white/5 rounded-xl">
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-green-400">{classData.presentCount}</p>
                          <p className="text-xs text-slate-400">Present</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-red-400">{classData.absentCount}</p>
                          <p className="text-xs text-slate-400">Absent</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-orange-400">{classData.lateCount}</p>
                          <p className="text-xs text-slate-400">Late</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-400">
                            {Math.round((classData.presentCount / classData.totalStudents) * 100)}%
                          </p>
                          <p className="text-xs text-slate-400">Rate</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!classData.attendanceMarked ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onMarkAttendance(classData)}
                      className="btn-primary px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Mark Attendance</span>
                    </motion.button>
                    
                    <div className="flex space-x-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onBulkMark(classData.id, 'PRESENT')}
                        className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                        title="Mark All Present"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onBulkMark(classData.id, 'ABSENT')}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Mark All Absent"
                      >
                        <XCircle className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onMarkAttendance(classData)}
                    className="btn-secondary px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit</span>
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
        
        {classes.length === 0 && (
          <div className="card p-12 text-center">
            <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Classes Scheduled</h3>
            <p className="text-slate-400">No classes are scheduled for today.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Attendance History View Component
const AttendanceHistoryView: React.FC<{
  records: AttendanceRecord[]
}> = ({ records }) => {
  return (
    <div className="card overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h3 className="text-xl font-bold text-white flex items-center">
          <BarChart3 className="w-6 h-6 mr-2" />
          Attendance History
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-slate-300 font-semibold">Student</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Class</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Date</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Status</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Marked By</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <motion.tr
                key={record.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">
                        {record.student.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-white">{record.student.fullName}</div>
                      <div className="text-sm text-slate-400">{record.student.uid}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <div className="font-semibold text-white">{record.class.subject}</div>
                    <div className="text-sm text-slate-400">{record.class.topic}</div>
                  </div>
                </td>
                <td className="p-4 text-slate-300">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.status)}`}>
                    {getStatusIcon(record.status)}
                    <span className="ml-1">{record.status}</span>
                  </span>
                </td>
                <td className="p-4 text-slate-300">
                  {record.markedBy.fullName}
                </td>
                <td className="p-4 text-slate-400 text-sm">
                  {record.remarks || '—'}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {records.length === 0 && (
        <div className="p-12 text-center">
          <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Records Found</h3>
          <p className="text-slate-400">No attendance records match your filters.</p>
        </div>
      )}
    </div>
  )
}

// Attendance Statistics View Component
const AttendanceStatisticsView: React.FC<{
  stats: AttendanceStats | null
}> = ({ stats }) => {
  if (!stats) {
    return (
      <div className="card p-12 text-center">
        <TrendingUp className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Loading Statistics...</h3>
        <p className="text-slate-400">Please wait while we calculate attendance statistics.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-6 rounded-2xl border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-green-400 text-sm font-semibold mb-2">Overall Rate</h3>
              <p className="text-3xl font-bold text-white">{stats.attendanceRate}%</p>
            </div>
            <TrendingUp className="w-12 h-12 text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-6 rounded-2xl border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-400 text-sm font-semibold mb-2">Monthly Rate</h3>
              <p className="text-3xl font-bold text-white">{stats.monthlyRate}%</p>
            </div>
            <Calendar className="w-12 h-12 text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-6 rounded-2xl border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-purple-400 text-sm font-semibold mb-2">Present</h3>
              <p className="text-3xl font-bold text-white">{stats.presentCount}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-purple-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 p-6 rounded-2xl border border-red-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-red-400 text-sm font-semibold mb-2">Absent</h3>
              <p className="text-3xl font-bold text-white">{stats.absentCount}</p>
            </div>
            <XCircle className="w-12 h-12 text-red-400" />
          </div>
        </div>
      </div>

      {/* Weekly Trend Chart */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2" />
          Weekly Attendance Trend
        </h3>
        
        <div className="h-64 flex items-end justify-between space-x-2">
          {stats.weeklyTrend.map((trend, index) => {
            const maxRate = Math.max(...stats.weeklyTrend.map(t => t.rate))
            const height = (trend.rate / maxRate) * 100
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full rounded-t-lg transition-all duration-300 ${
                    trend.rate >= 90 ? 'bg-gradient-to-t from-green-500 to-green-400' :
                    trend.rate >= 75 ? 'bg-gradient-to-t from-yellow-500 to-yellow-400' :
                    'bg-gradient-to-t from-red-500 to-red-400'
                  }`}
                  style={{ height: `${height}%` }}
                />
                <div className="text-xs text-slate-400 mt-2">
                  {new Date(trend.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-xs font-semibold text-white">
                  {trend.rate}%
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Schedule View Component
const ScheduleView: React.FC<{
  classes: ClassSession[]
  currentDate: Date
}> = ({ classes, currentDate }) => {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Clock className="w-6 h-6 mr-2" />
          Schedule for {currentDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h3>
        
        <div className="space-y-4">
          {classes.map((classData, index) => (
            <motion.div
              key={classData.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
            >
              <div className="text-center">
                <div className="text-lg font-bold text-white">{classData.startTime}</div>
                <div className="text-xs text-slate-400">{classData.endTime}</div>
              </div>
              
              <div className="w-1 h-12 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
              
              <div className="flex-1">
                <h4 className="font-semibold text-white">{classData.subject}</h4>
                <p className="text-sm text-slate-300">{classData.topic}</p>
                <div className="flex items-center space-x-4 mt-1 text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{classData.batchType.replace('_', ' ')}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{classData.venue}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <UserCheck className="w-3 h-3" />
                    <span>{classData.teacher.fullName}</span>
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-semibold text-white">{classData.totalStudents} students</div>
                {classData.attendanceMarked && (
                  <div className="text-xs text-green-400">✓ Marked</div>
                )}
              </div>
            </motion.div>
          ))}
          
          {classes.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-white mb-2">No Classes Scheduled</h4>
              <p className="text-slate-400">No classes are scheduled for this date.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Attendance Marking Modal Component
const AttendanceMarkingModal: React.FC<{
  isOpen: boolean
  classData: ClassSession | null
  onClose: () => void
  onSubmit: (classId: string, attendanceData: any[]) => void
}> = ({ isOpen, classData, onClose, onSubmit }) => {
  const [attendance, setAttendance] = useState<{[key: string]: string}>({})
  const [remarks, setRemarks] = useState<{[key: string]: string}>({})

  useEffect(() => {
    if (classData) {
      const initialAttendance: {[key: string]: string} = {}
      const initialRemarks: {[key: string]: string} = {}
      
      classData.students.forEach(student => {
        initialAttendance[student.id] = student.status || 'PRESENT'
        initialRemarks[student.id] = ''
      })
      
      setAttendance(initialAttendance)
      setRemarks(initialRemarks)
    }
  }, [classData])

  const handleSubmit = () => {
    if (!classData) return
    
    const attendanceData = classData.students.map(student => ({
      studentId: student.id,
      status: attendance[student.id],
      remarks: remarks[student.id] || undefined
    }))
    
    onSubmit(classData.id, attendanceData)
  }

  if (!isOpen || !classData) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'ABSENT': return 'text-red-400 bg-red-500/20 border-red-500/30'
      case 'LATE': return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
      case 'EXCUSED': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30'
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="card w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <div>
              <h2 className="text-xl font-bold text-white">Mark Attendance</h2>
              <p className="text-slate-400">
                {classData.subject} - {classData.topic} ({classData.students.length} students)
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Quick Actions */}
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  const newAttendance = { ...attendance }
                  classData.students.forEach(student => {
                    newAttendance[student.id] = 'PRESENT'
                  })
                  setAttendance(newAttendance)
                }}
                className="btn-secondary px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark All Present</span>
              </button>
              
              <button
                onClick={() => {
                  const newAttendance = { ...attendance }
                  classData.students.forEach(student => {
                    newAttendance[student.id] = 'ABSENT'
                  })
                  setAttendance(newAttendance)
                }}
                className="btn-secondary px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <XCircle className="w-4 h-4" />
                <span>Mark All Absent</span>
              </button>
            </div>

            {/* Student List */}
            <div className="space-y-3">
              {classData.students.map((student, index) => (
                <div
                  key={student.id}
                  className="bg-white/5 rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-white">{student.fullName}</p>
                      <p className="text-sm text-slate-400">{student.uid}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    {/* Status Buttons */}
                    <div className="flex space-x-2">
                      {['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'].map(status => (
                        <button
                          key={status}
                          onClick={() => setAttendance({
                            ...attendance,
                            [student.id]: status
                          })}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                            attendance[student.id] === status
                              ? getStatusColor(status)
                              : 'text-slate-400 bg-slate-700/50 hover:bg-slate-600/50'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                    
                    {/* Remarks */}
                    <input
                      type="text"
                      placeholder="Remarks..."
                      className="w-32 px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                      value={remarks[student.id] || ''}
                      onChange={(e) => setRemarks({
                        ...remarks,
                        [student.id]: e.target.value
                      })}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Summary</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {Object.values(attendance).filter(s => s === 'PRESENT').length}
                  </div>
                  <div className="text-xs text-slate-400">Present</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">
                    {Object.values(attendance).filter(s => s === 'ABSENT').length}
                  </div>
                  <div className="text-xs text-slate-400">Absent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">
                    {Object.values(attendance).filter(s => s === 'LATE').length}
                  </div>
                  <div className="text-xs text-slate-400">Late</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {Object.values(attendance).filter(s => s === 'EXCUSED').length}
                  </div>
                  <div className="text-xs text-slate-400">Excused</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 p-6 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="btn-primary px-6 py-2 rounded-lg flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Attendance</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'PRESENT': return 'text-green-400 bg-green-500/20 border-green-500/30'
    case 'ABSENT': return 'text-red-400 bg-red-500/20 border-red-500/30'
    case 'LATE': return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
    case 'EXCUSED': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
    default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'PRESENT': return <CheckCircle className="w-4 h-4" />
    case 'ABSENT': return <XCircle className="w-4 h-4" />
    case 'LATE': return <Clock className="w-4 h-4" />
    case 'EXCUSED': return <AlertCircle className="w-4 h-4" />
    default: return <Users className="w-4 h-4" />
  }
}

export default AttendanceManager