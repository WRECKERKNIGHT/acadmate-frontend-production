import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  FileText,
  Calendar,
  Clock,
  Award,
  Target,
  Activity,
  Zap,
  Database,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  RefreshCw,
  Download,
  Filter,
  Eye
} from 'lucide-react'
import { adminAPI } from '../../config/api'
import toast from 'react-hot-toast'

interface SystemStats {
  users: {
    total: number
    students: number
    teachers: number
    headTeachers: number
    activeToday: number
    newThisWeek: number
    growthRate: number
  }
  content: {
    tests: number
    homework: number
    doubts: number
    submissions: number
    attendance: number
  }
  performance: {
    avgResponseTime: number
    uptime: number
    errorRate: number
    throughput: number
  }
  system: {
    diskUsage: number
    memoryUsage: number
    cpuUsage: number
    networkLatency: number
  }
}

interface ActivityTrend {
  date: string
  users: number
  tests: number
  submissions: number
  homework: number
}

interface BatchWiseStats {
  batchType: string
  studentsCount: number
  testsCount: number
  homeworkCount: number
  averageScore: number
  attendanceRate: number
}

const SystemStatistics: React.FC = () => {
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null)
  const [activityTrends, setActivityTrends] = useState<ActivityTrend[]>([])
  const [batchStats, setBatchStats] = useState<BatchWiseStats[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'batches' | 'system'>('overview')
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    loadData()
  }, [dateRange])

  const loadData = async () => {
    try {
      setLoading(true)
      
      const [statsResponse, trendsResponse, batchesResponse] = await Promise.all([
        adminAPI.getSystemStatistics(dateRange),
        adminAPI.getActivityTrends(dateRange),
        adminAPI.getBatchWiseStatistics(dateRange)
      ])
      
      setSystemStats(statsResponse.data)
      setActivityTrends(trendsResponse.data.trends)
      setBatchStats(batchesResponse.data.batches)
    } catch (error) {
      console.error('Error loading system statistics:', error)
      toast.error('Failed to load system statistics')
    } finally {
      setLoading(false)
    }
  }

  const exportReport = async () => {
    try {
      const response = await adminAPI.exportSystemReport({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        format: 'pdf'
      })
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `system-report-${dateRange.startDate}-to-${dateRange.endDate}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
      
      toast.success('Report exported successfully!')
    } catch (error) {
      toast.error('Failed to export report')
    }
  }

  const getStatusColor = (value: number, type: 'performance' | 'usage') => {
    if (type === 'performance') {
      if (value >= 95) return 'text-green-400'
      if (value >= 80) return 'text-yellow-400'
      return 'text-red-400'
    } else {
      if (value <= 70) return 'text-green-400'
      if (value <= 85) return 'text-yellow-400'
      return 'text-red-400'
    }
  }

  const getGrowthColor = (rate: number) => {
    return rate > 0 ? 'text-green-400' : rate < 0 ? 'text-red-400' : 'text-slate-400'
  }

  if (loading || !systemStats) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-8 h-8 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
      </div>
    )
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-blue-400" />
            System Statistics
          </h1>
          <p className="text-slate-400 mt-2">Comprehensive platform analytics and performance metrics</p>
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
            onClick={exportReport}
            className="btn-primary px-6 py-3 rounded-full flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-5 h-5" />
            <span>Export Report</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Date Range Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <div className="flex flex-wrap items-center gap-4">
          {/* Tab Switcher */}
          <div className="flex bg-white/5 rounded-xl p-1">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'trends', name: 'Trends' },
              { id: 'batches', name: 'Batches' },
              { id: 'system', name: 'System' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Date Range */}
          <div className="flex items-center space-x-2 ml-auto">
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
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-8"
      >
        {activeTab === 'overview' && <OverviewStats stats={systemStats} />}
        {activeTab === 'trends' && <TrendsView trends={activityTrends} />}
        {activeTab === 'batches' && <BatchesView batches={batchStats} />}
        {activeTab === 'system' && <SystemView stats={systemStats} />}
      </motion.div>
    </div>
  )
}

// Overview Stats Component
const OverviewStats: React.FC<{ stats: SystemStats }> = ({ stats }) => {
  return (
    <div className="space-y-8">
      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-6 rounded-2xl border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-400 text-sm font-semibold mb-2">Total Users</h3>
              <p className="text-3xl font-bold text-white">{stats.users.total}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400 text-sm">+{stats.users.growthRate}%</span>
              </div>
            </div>
            <Users className="w-12 h-12 text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-6 rounded-2xl border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-green-400 text-sm font-semibold mb-2">Active Today</h3>
              <p className="text-3xl font-bold text-white">{stats.users.activeToday}</p>
              <div className="text-sm text-slate-400 mt-2">
                {Math.round((stats.users.activeToday / stats.users.total) * 100)}% of total
              </div>
            </div>
            <Activity className="w-12 h-12 text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-6 rounded-2xl border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-purple-400 text-sm font-semibold mb-2">Tests Created</h3>
              <p className="text-3xl font-bold text-white">{stats.content.tests}</p>
              <div className="text-sm text-slate-400 mt-2">
                {stats.content.submissions} submissions
              </div>
            </div>
            <FileText className="w-12 h-12 text-purple-400" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 p-6 rounded-2xl border border-orange-500/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-orange-400 text-sm font-semibold mb-2">Homework</h3>
              <p className="text-3xl font-bold text-white">{stats.content.homework}</p>
              <div className="text-sm text-slate-400 mt-2">
                {stats.content.doubts} doubts resolved
              </div>
            </div>
            <BookOpen className="w-12 h-12 text-orange-400" />
          </div>
        </div>
      </div>

      {/* User Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            User Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Students</span>
              <div className="flex items-center">
                <span className="text-blue-400 font-semibold mr-2">{stats.users.students}</span>
                <div className="w-20 h-2 bg-blue-500/20 rounded-full">
                  <div 
                    className="h-2 bg-blue-500 rounded-full" 
                    style={{ width: `${(stats.users.students / stats.users.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Teachers</span>
              <div className="flex items-center">
                <span className="text-green-400 font-semibold mr-2">{stats.users.teachers}</span>
                <div className="w-20 h-2 bg-green-500/20 rounded-full">
                  <div 
                    className="h-2 bg-green-500 rounded-full" 
                    style={{ width: `${(stats.users.teachers / stats.users.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Head Teachers</span>
              <div className="flex items-center">
                <span className="text-purple-400 font-semibold mr-2">{stats.users.headTeachers}</span>
                <div className="w-20 h-2 bg-purple-500/20 rounded-full">
                  <div 
                    className="h-2 bg-purple-500 rounded-full" 
                    style={{ width: `${(stats.users.headTeachers / stats.users.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Performance Metrics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Uptime</span>
              <span className="text-green-400 font-semibold">{stats.performance.uptime}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Response Time</span>
              <span className="text-blue-400 font-semibold">{stats.performance.avgResponseTime}ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Error Rate</span>
              <span className="text-yellow-400 font-semibold">{stats.performance.errorRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Throughput</span>
              <span className="text-purple-400 font-semibold">{stats.performance.throughput}/s</span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">New Users This Week</span>
              <span className="text-green-400 font-semibold">+{stats.users.newThisWeek}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Attendance Marked</span>
              <span className="text-orange-400 font-semibold">{stats.content.attendance}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Total Submissions</span>
              <span className="text-blue-400 font-semibold">{stats.content.submissions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Growth Rate</span>
              <span className="text-green-400 font-semibold">+{stats.users.growthRate}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Trends View Component
const TrendsView: React.FC<{ trends: ActivityTrend[] }> = ({ trends }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Trend */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-400" />
            User Activity Trend
          </h3>
          <div className="h-64 flex items-end justify-between space-x-1">
            {trends.map((trend, index) => {
              const maxUsers = Math.max(...trends.map(t => t.users))
              const height = (trend.users / maxUsers) * 100
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-400 hover:to-blue-300"
                    style={{ height: `${height}%` }}
                  />
                  <div className="text-xs text-slate-400 mt-2 rotate-45">
                    {new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Test Activity Trend */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-purple-400" />
            Test Activity Trend
          </h3>
          <div className="h-64 flex items-end justify-between space-x-1">
            {trends.map((trend, index) => {
              const maxTests = Math.max(...trends.map(t => t.tests))
              const height = maxTests > 0 ? (trend.tests / maxTests) * 100 : 0
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t-lg transition-all duration-300 hover:from-purple-400 hover:to-purple-300"
                    style={{ height: `${height}%` }}
                  />
                  <div className="text-xs text-slate-400 mt-2 rotate-45">
                    {new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Detailed Trends Table */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Detailed Activity Trends
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-slate-300 font-semibold">Date</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Users</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Tests</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Submissions</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Homework</th>
              </tr>
            </thead>
            <tbody>
              {trends.map((trend, index) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4 text-white font-medium">
                    {new Date(trend.date).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-blue-400 font-semibold">{trend.users}</td>
                  <td className="p-4 text-purple-400 font-semibold">{trend.tests}</td>
                  <td className="p-4 text-green-400 font-semibold">{trend.submissions}</td>
                  <td className="p-4 text-orange-400 font-semibold">{trend.homework}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Batches View Component
const BatchesView: React.FC<{ batches: BatchWiseStats[] }> = ({ batches }) => {
  return (
    <div className="card overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Batch-wise Performance
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-slate-300 font-semibold">Batch</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Students</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Tests</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Homework</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Avg Score</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Attendance</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-cyan-400 text-white">
                    {batch.batchType.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-blue-400 font-semibold">{batch.studentsCount}</td>
                <td className="p-4 text-purple-400 font-semibold">{batch.testsCount}</td>
                <td className="p-4 text-green-400 font-semibold">{batch.homeworkCount}</td>
                <td className="p-4">
                  <span className={`font-semibold ${batch.averageScore >= 80 ? 'text-green-400' : batch.averageScore >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {batch.averageScore}%
                  </span>
                </td>
                <td className="p-4">
                  <span className={`font-semibold ${batch.attendanceRate >= 90 ? 'text-green-400' : batch.attendanceRate >= 75 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {batch.attendanceRate}%
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// System View Component
const SystemView: React.FC<{ stats: SystemStats }> = ({ stats }) => {
  const getStatusColor = (value: number, type: 'performance' | 'usage') => {
    if (type === 'performance') {
      if (value >= 95) return 'text-green-400'
      if (value >= 80) return 'text-yellow-400'
      return 'text-red-400'
    } else {
      if (value <= 70) return 'text-green-400'
      if (value <= 85) return 'text-yellow-400'
      return 'text-red-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 text-sm font-semibold">CPU Usage</h3>
            <Cpu className="w-8 h-8 text-blue-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{stats.system.cpuUsage}%</div>
          <div className="w-full h-2 bg-gray-700 rounded-full">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${stats.system.cpuUsage <= 70 ? 'from-green-500 to-green-400' : stats.system.cpuUsage <= 85 ? 'from-yellow-500 to-yellow-400' : 'from-red-500 to-red-400'}`}
              style={{ width: `${stats.system.cpuUsage}%` }}
            />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 text-sm font-semibold">Memory Usage</h3>
            <Database className="w-8 h-8 text-purple-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{stats.system.memoryUsage}%</div>
          <div className="w-full h-2 bg-gray-700 rounded-full">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${stats.system.memoryUsage <= 70 ? 'from-purple-500 to-purple-400' : stats.system.memoryUsage <= 85 ? 'from-yellow-500 to-yellow-400' : 'from-red-500 to-red-400'}`}
              style={{ width: `${stats.system.memoryUsage}%` }}
            />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 text-sm font-semibold">Disk Usage</h3>
            <HardDrive className="w-8 h-8 text-green-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{stats.system.diskUsage}%</div>
          <div className="w-full h-2 bg-gray-700 rounded-full">
            <div 
              className={`h-2 rounded-full bg-gradient-to-r ${stats.system.diskUsage <= 70 ? 'from-green-500 to-green-400' : stats.system.diskUsage <= 85 ? 'from-yellow-500 to-yellow-400' : 'from-red-500 to-red-400'}`}
              style={{ width: `${stats.system.diskUsage}%` }}
            />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 text-sm font-semibold">Network Latency</h3>
            <Wifi className="w-8 h-8 text-orange-400" />
          </div>
          <div className="text-3xl font-bold text-white mb-2">{stats.system.networkLatency}ms</div>
          <div className={`text-sm ${getStatusColor(stats.system.networkLatency < 100 ? 95 : 50, 'performance')}`}>
            {stats.system.networkLatency < 100 ? 'Excellent' : 'Needs Attention'}
          </div>
        </div>
      </div>

      {/* Performance Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <Server className="w-5 h-5 mr-2" />
            System Performance
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Uptime</span>
                <span className={`font-semibold ${getStatusColor(stats.performance.uptime, 'performance')}`}>
                  {stats.performance.uptime}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full">
                <div 
                  className="h-2 bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                  style={{ width: `${stats.performance.uptime}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Response Time</span>
                <span className="text-blue-400 font-semibold">{stats.performance.avgResponseTime}ms</span>
              </div>
              <div className="text-sm text-slate-500">Average response time for API requests</div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Error Rate</span>
                <span className={`font-semibold ${getStatusColor(100 - stats.performance.errorRate, 'performance')}`}>
                  {stats.performance.errorRate}%
                </span>
              </div>
              <div className="text-sm text-slate-500">Percentage of failed requests</div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            System Health Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-white">Database</span>
              </div>
              <span className="text-green-400 text-sm font-semibold">Healthy</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-white">API Server</span>
              </div>
              <span className="text-green-400 text-sm font-semibold">Running</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span className="text-white">File Storage</span>
              </div>
              <span className="text-yellow-400 text-sm font-semibold">Warning</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-white">Network</span>
              </div>
              <span className="text-green-400 text-sm font-semibold">Stable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemStatistics