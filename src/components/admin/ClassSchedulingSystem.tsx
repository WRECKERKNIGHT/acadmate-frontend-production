import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Save,
  X,
  Search,
  Filter,
  Bell,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { academicAPI } from '../../config/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

interface ClassSchedule {
  id: string
  subject: string
  teacher: {
    id: string
    fullName: string
    uid: string
  }
  batchType: string
  date: string
  startTime: string
  endTime: string
  venue: string
  description?: string
  isRecurring: boolean
  recurringPattern?: string
  studentsEnrolled: number
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
}

const ClassSchedulingSystem: React.FC = () => {
  const { user } = useAuth()
  const [classes, setClasses] = useState<ClassSchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingClass, setEditingClass] = useState<ClassSchedule | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    subject: '',
    teacher: '',
    batchType: '',
    status: '',
    dateFrom: '',
    dateTo: ''
  })

  const [teachers, setTeachers] = useState([])
  const [subjects, setSubjects] = useState([])

  useEffect(() => {
    loadClasses()
    loadTeachersAndSubjects()
  }, [filters])

  const loadClasses = async () => {
    try {
      setLoading(true)
      const response = await academicAPI.getClasses()
      setClasses(response.data.classes || [])
    } catch (error) {
      console.error('Error loading classes:', error)
      toast.error('Failed to load classes')
    } finally {
      setLoading(false)
    }
  }

  const loadTeachersAndSubjects = async () => {
    try {
      const [teachersRes, subjectsRes] = await Promise.all([
        academicAPI.getTeachers(),
        academicAPI.getSubjects()
      ])
      setTeachers(teachersRes.data.teachers || [])
      setSubjects(subjectsRes.data.subjects || [])
    } catch (error) {
      console.error('Error loading teachers/subjects:', error)
    }
  }

  const handleCreateClass = async (classData: Partial<ClassSchedule>) => {
    try {
      await academicAPI.createClass(classData)
      toast.success('Class scheduled successfully!')
      setShowCreateModal(false)
      loadClasses()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to schedule class')
    }
  }

  const handleUpdateClass = async (id: string, classData: Partial<ClassSchedule>) => {
    try {
      await academicAPI.updateClass(id, classData)
      toast.success('Class updated successfully!')
      setEditingClass(null)
      loadClasses()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update class')
    }
  }

  const handleDeleteClass = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await academicAPI.deleteClass(id)
        toast.success('Class deleted successfully!')
        loadClasses()
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to delete class')
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'ACTIVE': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'COMPLETED': return 'text-gray-400 bg-gray-500/20 border-gray-500/30'
      case 'CANCELLED': return 'text-red-400 bg-red-500/20 border-red-500/30'
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return <Clock className="w-4 h-4" />
      case 'ACTIVE': return <CheckCircle className="w-4 h-4" />
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />
      case 'CANCELLED': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
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
            <Calendar className="w-8 h-8 mr-3 text-blue-400" />
            Class Scheduling
          </h1>
          <p className="text-slate-400 mt-2">Schedule and manage class sessions</p>
        </div>

        <motion.button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary px-6 py-3 rounded-xl flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          <span>Schedule Class</span>
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search classes..."
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
            {subjects.map((subject: any) => (
              <option key={subject.id} value={subject.name}>{subject.name}</option>
            ))}
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

          <select
            className="input"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </motion.div>

      {/* Classes List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
          </div>
        ) : classes.length === 0 ? (
          <div className="card p-12 text-center">
            <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Classes Scheduled</h3>
            <p className="text-slate-400 mb-6">Start by scheduling your first class</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary px-6 py-3 rounded-xl"
            >
              Schedule Class
            </button>
          </div>
        ) : (
          classes.map((classItem, index) => (
            <motion.div
              key={classItem.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card p-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{classItem.subject}</h3>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(classItem.status)}`}>
                        {getStatusIcon(classItem.status)}
                        <span className="ml-1">{classItem.status}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-400">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{classItem.teacher.fullName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{classItem.startTime} - {classItem.endTime}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{classItem.venue}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{classItem.batchType.replace('_', ' ')}</span>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-slate-300">
                      <strong>Date:</strong> {new Date(classItem.date).toLocaleDateString()} | 
                      <strong> Students:</strong> {classItem.studentsEnrolled}
                      {classItem.description && (
                        <>
                          <br />
                          <strong>Description:</strong> {classItem.description}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setEditingClass(classItem)}
                    className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                    title="Edit Class"
                  >
                    <Edit3 className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteClass(classItem.id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                    title="Delete Class"
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
      <ClassModal
        isOpen={showCreateModal || !!editingClass}
        classData={editingClass}
        teachers={teachers}
        subjects={subjects}
        onClose={() => {
          setShowCreateModal(false)
          setEditingClass(null)
        }}
        onSubmit={(data) => {
          if (editingClass) {
            handleUpdateClass(editingClass.id, data)
          } else {
            handleCreateClass(data)
          }
        }}
      />
    </div>
  )
}

// Class Modal Component
const ClassModal: React.FC<{
  isOpen: boolean
  classData: ClassSchedule | null
  teachers: any[]
  subjects: any[]
  onClose: () => void
  onSubmit: (data: Partial<ClassSchedule>) => void
}> = ({ isOpen, classData, teachers, subjects, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    subject: '',
    teacherId: '',
    batchType: '',
    date: '',
    startTime: '',
    endTime: '',
    venue: '',
    description: '',
    isRecurring: false,
    recurringPattern: ''
  })

  useEffect(() => {
    if (classData) {
      setFormData({
        subject: classData.subject,
        teacherId: classData.teacher.id,
        batchType: classData.batchType,
        date: classData.date,
        startTime: classData.startTime,
        endTime: classData.endTime,
        venue: classData.venue,
        description: classData.description || '',
        isRecurring: classData.isRecurring,
        recurringPattern: classData.recurringPattern || ''
      })
    } else {
      setFormData({
        subject: '',
        teacherId: '',
        batchType: '',
        date: '',
        startTime: '',
        endTime: '',
        venue: '',
        description: '',
        isRecurring: false,
        recurringPattern: ''
      })
    }
  }, [classData, isOpen])

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
              {classData ? 'Edit Class' : 'Schedule New Class'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Subject</label>
                <select
                  className="input"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                >
                  <option value="">Select Subject</option>
                  {subjects.map((subject: any) => (
                    <option key={subject.id} value={subject.name}>{subject.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Teacher</label>
                <select
                  className="input"
                  value={formData.teacherId}
                  onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                  required
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher: any) => (
                    <option key={teacher.id} value={teacher.id}>{teacher.fullName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Batch Type</label>
                <select
                  className="input"
                  value={formData.batchType}
                  onChange={(e) => setFormData({ ...formData, batchType: e.target.value })}
                  required
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

              <div>
                <label className="block text-sm font-medium text-white mb-2">Date</label>
                <input
                  type="date"
                  className="input"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Start Time</label>
                <input
                  type="time"
                  className="input"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">End Time</label>
                <input
                  type="time"
                  className="input"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Venue</label>
              <input
                type="text"
                className="input"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="Classroom, Lab, Online, etc."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Description (Optional)</label>
              <textarea
                className="input"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Additional notes about this class..."
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isRecurring"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
              />
              <label htmlFor="isRecurring" className="text-sm text-white">
                Recurring Class
              </label>
            </div>

            {formData.isRecurring && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">Recurring Pattern</label>
                <select
                  className="input"
                  value={formData.recurringPattern}
                  onChange={(e) => setFormData({ ...formData, recurringPattern: e.target.value })}
                >
                  <option value="">Select Pattern</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}

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
                <Save className="w-4 h-4" />
                <span>{classData ? 'Update' : 'Schedule'} Class</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ClassSchedulingSystem