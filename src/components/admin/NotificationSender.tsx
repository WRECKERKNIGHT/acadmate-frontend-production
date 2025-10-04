import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Send,
  Users,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Trash2,
  Plus,
  Filter,
  Search,
  X
} from 'lucide-react'
import { academicAPI, profileAPI } from '../../config/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

interface Notification {
  id: string
  title: string
  message: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
  recipients: string[]
  recipientType: 'ALL' | 'STUDENTS' | 'TEACHERS' | 'BATCH' | 'INDIVIDUAL'
  batchType?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  scheduledFor?: string
  sentAt?: string
  readCount: number
  totalRecipients: number
  status: 'DRAFT' | 'SCHEDULED' | 'SENT'
}

const NotificationSender: React.FC = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    recipientType: ''
  })

  const [students, setStudents] = useState([])
  const [teachers, setTeachers] = useState([])

  useEffect(() => {
    loadNotifications()
    loadUsersData()
  }, [filters])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      // Mock data - replace with actual API call
      setNotifications([
        {
          id: '1',
          title: 'Class Schedule Update',
          message: 'Tomorrow\'s Physics class has been moved to Room 201.',
          type: 'INFO',
          recipients: ['all-students'],
          recipientType: 'STUDENTS',
          priority: 'MEDIUM',
          sentAt: new Date().toISOString(),
          readCount: 45,
          totalRecipients: 60,
          status: 'SENT'
        },
        {
          id: '2',
          title: 'Test Results Available',
          message: 'Your Chemistry test results are now available in your dashboard.',
          type: 'SUCCESS',
          recipients: ['neet-12'],
          recipientType: 'BATCH',
          batchType: 'NEET_12',
          priority: 'HIGH',
          sentAt: new Date().toISOString(),
          readCount: 28,
          totalRecipients: 30,
          status: 'SENT'
        }
      ])
    } catch (error) {
      console.error('Error loading notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const loadUsersData = async () => {
    try {
      const [studentsRes, teachersRes] = await Promise.all([
        academicAPI.getStudents(),
        academicAPI.getTeachers()
      ])
      setStudents(studentsRes.data.students || [])
      setTeachers(teachersRes.data.teachers || [])
    } catch (error) {
      console.error('Error loading users data:', error)
    }
  }

  const handleSendNotification = async (notificationData: Partial<Notification>) => {
    try {
      // Replace with actual API call
      toast.success('Notification sent successfully!')
      setShowCreateModal(false)
      setEditingNotification(null)
      loadNotifications()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to send notification')
    }
  }

  const handleDeleteNotification = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        // Replace with actual API call
        toast.success('Notification deleted successfully!')
        loadNotifications()
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to delete notification')
      }
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SUCCESS': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'WARNING': return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
      case 'ERROR': return 'text-red-400 bg-red-500/20 border-red-500/30'
      default: return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle className="w-4 h-4" />
      case 'WARNING': return <AlertCircle className="w-4 h-4" />
      case 'ERROR': return <AlertCircle className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'text-red-400'
      case 'MEDIUM': return 'text-orange-400'
      default: return 'text-blue-400'
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center">
            <Bell className="w-8 h-8 mr-3 text-blue-400" />
            Send Notifications
          </h1>
          <p className="text-slate-400 mt-2">Send announcements and updates to students and teachers</p>
        </div>

        <motion.button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary px-6 py-3 rounded-xl flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          <span>Create Notification</span>
        </motion.button>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-6 rounded-2xl border border-blue-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-400 text-sm font-semibold mb-2">Total Sent</h3>
              <p className="text-3xl font-bold text-white">
                {notifications.filter(n => n.status === 'SENT').length}
              </p>
            </div>
            <Send className="w-12 h-12 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-6 rounded-2xl border border-green-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-green-400 text-sm font-semibold mb-2">Read Rate</h3>
              <p className="text-3xl font-bold text-white">
                {notifications.length > 0 
                  ? Math.round((notifications.reduce((sum, n) => sum + n.readCount, 0) / 
                    notifications.reduce((sum, n) => sum + n.totalRecipients, 0)) * 100)
                  : 0}%
              </p>
            </div>
            <Eye className="w-12 h-12 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-6 rounded-2xl border border-purple-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-purple-400 text-sm font-semibold mb-2">Students</h3>
              <p className="text-3xl font-bold text-white">{students.length}</p>
            </div>
            <Users className="w-12 h-12 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 p-6 rounded-2xl border border-orange-500/30"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-orange-400 text-sm font-semibold mb-2">Teachers</h3>
              <p className="text-3xl font-bold text-white">{teachers.length}</p>
            </div>
            <BookOpen className="w-12 h-12 text-orange-400" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="card p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search notifications..."
              className="input pl-10"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          
          <select
            className="input"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="INFO">Info</option>
            <option value="SUCCESS">Success</option>
            <option value="WARNING">Warning</option>
            <option value="ERROR">Error</option>
          </select>
          
          <select
            className="input"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="SENT">Sent</option>
          </select>

          <select
            className="input"
            value={filters.recipientType}
            onChange={(e) => setFilters({ ...filters, recipientType: e.target.value })}
          >
            <option value="">All Recipients</option>
            <option value="ALL">Everyone</option>
            <option value="STUDENTS">Students</option>
            <option value="TEACHERS">Teachers</option>
            <option value="BATCH">Specific Batch</option>
          </select>
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-4"
      >
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="card p-12 text-center">
            <Bell className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Notifications Sent</h3>
            <p className="text-slate-400 mb-6">Create your first notification</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary px-6 py-3 rounded-xl"
            >
              Create Notification
            </button>
          </div>
        ) : (
          notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card p-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                      <span className="ml-1">{notification.type}</span>
                    </span>
                    
                    <span className={`text-xs font-semibold ${getPriorityColor(notification.priority)}`}>
                      {notification.priority} PRIORITY
                    </span>

                    <span className="text-xs text-slate-400">
                      {notification.recipientType === 'BATCH' ? notification.batchType?.replace('_', ' ') : notification.recipientType}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{notification.title}</h3>
                  <p className="text-slate-300 mb-4">{notification.message}</p>

                  <div className="flex items-center space-x-6 text-sm text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{notification.totalRecipients} recipients</span>
                    </span>
                    
                    <span className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{notification.readCount} read</span>
                    </span>

                    {notification.sentAt && (
                      <span className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>Sent {new Date(notification.sentAt).toLocaleDateString()}</span>
                      </span>
                    )}
                  </div>

                  {/* Read Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Read Progress</span>
                      <span>{Math.round((notification.readCount / notification.totalRecipients) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
                        style={{ width: `${(notification.readCount / notification.totalRecipients) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEditingNotification(notification)}
                    className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                    title="Edit Notification"
                  >
                    <Eye className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Delete Notification"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Create/Edit Modal */}
      <NotificationModal
        isOpen={showCreateModal || !!editingNotification}
        notificationData={editingNotification}
        students={students}
        teachers={teachers}
        onClose={() => {
          setShowCreateModal(false)
          setEditingNotification(null)
        }}
        onSubmit={handleSendNotification}
      />
    </div>
  )
}

// Notification Modal Component
const NotificationModal: React.FC<{
  isOpen: boolean
  notificationData: Notification | null
  students: any[]
  teachers: any[]
  onClose: () => void
  onSubmit: (data: Partial<Notification>) => void
}> = ({ isOpen, notificationData, students, teachers, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'INFO' as const,
    recipientType: 'ALL' as const,
    batchType: '',
    priority: 'MEDIUM' as const,
    scheduledFor: '',
    recipients: [] as string[]
  })

  useEffect(() => {
    if (notificationData) {
      setFormData({
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type,
        recipientType: notificationData.recipientType,
        batchType: notificationData.batchType || '',
        priority: notificationData.priority,
        scheduledFor: notificationData.scheduledFor || '',
        recipients: notificationData.recipients
      })
    } else {
      setFormData({
        title: '',
        message: '',
        type: 'INFO',
        recipientType: 'ALL',
        batchType: '',
        priority: 'MEDIUM',
        scheduledFor: '',
        recipients: []
      })
    }
  }, [notificationData, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  if (!isOpen) return null

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
          className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-bold text-white">
              {notificationData ? 'Edit Notification' : 'Create New Notification'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Title</label>
              <input
                type="text"
                className="input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Notification title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Message</label>
              <textarea
                className="input"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Notification message..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Type</label>
                <select
                  className="input"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="INFO">Info</option>
                  <option value="SUCCESS">Success</option>
                  <option value="WARNING">Warning</option>
                  <option value="ERROR">Error</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Priority</label>
                <select
                  className="input"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Send To</label>
                <select
                  className="input"
                  value={formData.recipientType}
                  onChange={(e) => setFormData({ ...formData, recipientType: e.target.value as any })}
                >
                  <option value="ALL">Everyone</option>
                  <option value="STUDENTS">All Students</option>
                  <option value="TEACHERS">All Teachers</option>
                  <option value="BATCH">Specific Batch</option>
                </select>
              </div>
            </div>

            {formData.recipientType === 'BATCH' && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">Select Batch</label>
                <select
                  className="input"
                  value={formData.batchType}
                  onChange={(e) => setFormData({ ...formData, batchType: e.target.value })}
                >
                  <option value="">Select Batch</option>
                  <option value="NEET_11">NEET 11</option>
                  <option value="NEET_12">NEET 12</option>
                  <option value="PCM_11">PCM 11</option>
                  <option value="PCM_12">PCM 12</option>
                  <option value="IN_CLASS_9">Class 9</option>
                  <option value="IN_CLASS_10">Class 10</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white mb-2">Schedule For (Optional)</label>
              <input
                type="datetime-local"
                className="input"
                value={formData.scheduledFor}
                onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
              />
              <p className="text-xs text-slate-400 mt-1">Leave empty to send immediately</p>
            </div>

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary px-6 py-2 rounded-lg flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>{formData.scheduledFor ? 'Schedule' : 'Send'} Notification</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default NotificationSender