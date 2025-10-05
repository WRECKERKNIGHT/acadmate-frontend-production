import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  Clock,
  Users,
  FileText,
  Plus,
  Edit3,
  Trash2,
  Eye,
  CheckCircle,
  AlertCircle,
  Send,
  X,
  Save,
  Upload,
  Download,
  Filter,
  Search,
  Bell,
  GraduationCap,
  BookOpen,
  Target,
  Award
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-hot-toast'

interface OfflineTest {
  id: string
  title: string
  subject: string
  batchType: string
  scheduledDate: string
  scheduledTime: string
  duration: number
  totalMarks: number
  venue: string
  instructions: string
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  createdBy: {
    fullName: string
    uid: string
  }
  studentsCount: number
  submissions: {
    id: string
    student: {
      fullName: string
      uid: string
    }
    marksObtained: number | null
    status: 'PENDING' | 'SUBMITTED' | 'GRADED'
    submittedAt: string | null
  }[]
  createdAt: string
}

const OfflineTestManager: React.FC = () => {
  const { user } = useAuth()
  const [tests, setTests] = useState<OfflineTest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'grading'>('upcoming')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showMarkingModal, setShowMarkingModal] = useState(false)
  const [selectedTest, setSelectedTest] = useState<OfflineTest | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    subject: '',
    batchType: '',
    status: ''
  })

  useEffect(() => {
    loadTests()
  }, [filters, activeTab])

  const loadTests = async () => {
    try {
      setLoading(true)
      const response = await testAPI.getOfflineTests({
        ...filters,
        status: getStatusFilter(activeTab)
      })
      setTests(response.data.tests || [])
    } catch (error) {
      console.error('Error loading offline tests:', error)
      toast.error('Failed to load tests')
    } finally {
      setLoading(false)
    }
  }

  const getStatusFilter = (tab: string) => {
    switch (tab) {
      case 'upcoming': return 'SCHEDULED,IN_PROGRESS'
      case 'completed': return 'COMPLETED'
      case 'grading': return 'COMPLETED'
      default: return ''
    }
  }

  const handleCreateTest = async (testData: any) => {
    try {
      await testAPI.createOfflineTest(testData)
      toast.success('Offline test scheduled successfully!')
      setShowCreateModal(false)
      loadTests()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to schedule test')
    }
  }

  const handleUpdateTest = async (testId: string, data: any) => {
    try {
      await testAPI.updateOfflineTest(testId, data)
      toast.success('Test updated successfully!')
      loadTests()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update test')
    }
  }

  const handleDeleteTest = async (testId: string) => {
    try {
      await testAPI.deleteOfflineTest(testId)
      toast.success('Test deleted successfully!')
      loadTests()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete test')
    }
  }

  const handleStartTest = async (testId: string) => {
    try {
      await testAPI.startOfflineTest(testId)
      toast.success('Test started!')
      loadTests()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to start test')
    }
  }

  const handleCompleteTest = async (testId: string) => {
    try {
      await testAPI.completeOfflineTest(testId)
      toast.success('Test marked as completed!')
      loadTests()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to complete test')
    }
  }

  const handleGradeSubmissions = async (testId: string, grades: any[]) => {
    try {
      await testAPI.gradeOfflineTestSubmissions(testId, { grades })
      toast.success('Grades submitted successfully!')
      setShowMarkingModal(false)
      setSelectedTest(null)
      loadTests()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit grades')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'text-blue-400 bg-blue-500/20 border-blue-500/30'
      case 'IN_PROGRESS': return 'text-orange-400 bg-orange-500/20 border-orange-500/30'
      case 'COMPLETED': return 'text-green-400 bg-green-500/20 border-green-500/30'
      case 'CANCELLED': return 'text-red-400 bg-red-500/20 border-red-500/30'
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30'
    }
  }

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'upcoming': return tests.filter(t => ['SCHEDULED', 'IN_PROGRESS'].includes(t.status)).length
      case 'completed': return tests.filter(t => t.status === 'COMPLETED').length
      case 'grading': return tests.filter(t => t.status === 'COMPLETED' && t.submissions.some(s => s.status !== 'GRADED')).length
      default: return 0
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-purple-400" />
            Offline Test Manager
          </h1>
          <p className="text-slate-400 mt-2">Schedule, conduct, and grade offline tests</p>
        </div>
        
        <motion.button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary px-6 py-3 rounded-full flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          <span>Schedule Test</span>
        </motion.button>
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
              { id: 'upcoming', name: 'Upcoming Tests', icon: Clock },
              { id: 'completed', name: 'Completed Tests', icon: CheckCircle },
              { id: 'grading', name: 'Needs Grading', icon: Award }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.name}</span>
                <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                  {getTabCount(tab.id)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tests..."
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
          
          <select
            className="input"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </motion.div>

      {/* Tests List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {tests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card p-6 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{test.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(test.status)}`}>
                          {test.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-400">
                        <div className="flex items-center space-x-2">
                          <BookOpen className="w-4 h-4" />
                          <span>{test.subject}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{test.batchType.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(test.scheduledDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{test.scheduledTime}</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-300 mt-2">
                        <div>
                          <span className="text-slate-500">Duration: </span>
                          <span className="font-semibold">{test.duration} min</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Total Marks: </span>
                          <span className="font-semibold">{test.totalMarks}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Students: </span>
                          <span className="font-semibold">{test.studentsCount}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Venue: </span>
                          <span className="font-semibold">{test.venue}</span>
                        </div>
                      </div>

                      {/* Progress Bar for Grading */}
                      {test.status === 'COMPLETED' && (
                        <div className="mt-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-slate-400">Grading Progress</span>
                            <span className="text-slate-300">
                              {test.submissions.filter(s => s.status === 'GRADED').length} / {test.submissions.length}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-700 rounded-full">
                            <div 
                              className="h-2 bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${(test.submissions.filter(s => s.status === 'GRADED').length / test.submissions.length) * 100}%` 
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* Action Buttons based on status */}
                    {test.status === 'SCHEDULED' && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleStartTest(test.id)}
                          className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                          title="Start Test"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </motion.button>
                      </>
                    )}
                    
                    {test.status === 'IN_PROGRESS' && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleCompleteTest(test.id)}
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                        title="Complete Test"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </motion.button>
                    )}
                    
                    {test.status === 'COMPLETED' && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          setSelectedTest(test)
                          setShowMarkingModal(true)
                        }}
                        className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-lg transition-colors"
                        title="Grade Papers"
                      >
                        <Award className="w-5 h-5" />
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
                    
                    {test.status === 'SCHEDULED' && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                          title="Edit Test"
                        >
                          <Edit3 className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${test.title}"?`)) {
                              handleDeleteTest(test.id)
                            }
                          }}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete Test"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {tests.length === 0 && (
              <div className="card p-12 text-center">
                <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Tests Found</h3>
                <p className="text-slate-400 mb-6">
                  {activeTab === 'upcoming' && 'No upcoming tests scheduled.'}
                  {activeTab === 'completed' && 'No completed tests available.'}
                  {activeTab === 'grading' && 'No tests awaiting grading.'}
                </p>
                <motion.button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary px-6 py-3 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Schedule Your First Test
                </motion.button>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Create Test Modal */}
      <CreateOfflineTestModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTest}
      />

      {/* Marking Modal */}
      <MarkingModal
        isOpen={showMarkingModal}
        test={selectedTest}
        onClose={() => {
          setShowMarkingModal(false)
          setSelectedTest(null)
        }}
        onSubmit={handleGradeSubmissions}
      />
    </div>
  )
}

// Create Offline Test Modal Component
const CreateOfflineTestModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    batchType: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: 60,
    totalMarks: 100,
    venue: '',
    instructions: ''
  })

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
            <h2 className="text-xl font-bold text-white">Schedule Offline Test</h2>
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
                <label className="label">Test Title *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g., Physics Unit Test 1"
                />
              </div>
              
              <div>
                <label className="label">Subject *</label>
                <select
                  className="input"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                >
                  <option value="">Select Subject</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>
              
              <div>
                <label className="label">Batch *</label>
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
                <label className="label">Venue *</label>
                <input
                  type="text"
                  className="input"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  required
                  placeholder="e.g., Room 101"
                />
              </div>
              
              <div>
                <label className="label">Date *</label>
                <input
                  type="date"
                  className="input"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="label">Time *</label>
                <input
                  type="time"
                  className="input"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="label">Duration (minutes) *</label>
                <input
                  type="number"
                  className="input"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  required
                  min="15"
                  max="180"
                />
              </div>
              
              <div>
                <label className="label">Total Marks *</label>
                <input
                  type="number"
                  className="input"
                  value={formData.totalMarks}
                  onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
                  required
                  min="10"
                  max="500"
                />
              </div>
            </div>
            
            <div>
              <label className="label">Instructions</label>
              <textarea
                className="input resize-none h-24"
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="Special instructions for students..."
              />
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
                <Calendar className="w-4 h-4" />
                <span>Schedule Test</span>
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Marking Modal Component
const MarkingModal: React.FC<{
  isOpen: boolean
  test: OfflineTest | null
  onClose: () => void
  onSubmit: (testId: string, grades: any[]) => void
}> = ({ isOpen, test, onClose, onSubmit }) => {
  const [grades, setGrades] = useState<{[key: string]: number}>({})
  const [bulkMarks, setBulkMarks] = useState('')

  useEffect(() => {
    if (test) {
      const initialGrades: {[key: string]: number} = {}
      test.submissions.forEach(submission => {
        if (submission.marksObtained !== null) {
          initialGrades[submission.id] = submission.marksObtained
        }
      })
      setGrades(initialGrades)
    }
  }, [test])

  const handleSubmit = () => {
    if (!test) return
    
    const gradesList = Object.entries(grades).map(([submissionId, marks]) => ({
      submissionId,
      marksObtained: marks
    }))
    
    onSubmit(test.id, gradesList)
  }

  const handleBulkEntry = () => {
    if (!test || !bulkMarks) return
    
    const marksArray = bulkMarks.split(',').map(m => parseFloat(m.trim())).filter(m => !isNaN(m))
    const newGrades = { ...grades }
    
    test.submissions.slice(0, marksArray.length).forEach((submission, index) => {
      if (marksArray[index] !== undefined) {
        newGrades[submission.id] = marksArray[index]
      }
    })
    
    setGrades(newGrades)
    setBulkMarks('')
  }

  if (!isOpen || !test) return null

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
              <h2 className="text-xl font-bold text-white">Grade Test Papers</h2>
              <p className="text-slate-400">{test.title} - Total Marks: {test.totalMarks}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Bulk Entry */}
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Bulk Entry</h3>
              <div className="flex space-x-3">
                <input
                  type="text"
                  className="input flex-1"
                  value={bulkMarks}
                  onChange={(e) => setBulkMarks(e.target.value)}
                  placeholder="Enter marks separated by commas (e.g., 85,92,78,90...)"
                />
                <button
                  onClick={handleBulkEntry}
                  className="btn-secondary px-4 py-2 rounded-lg"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Individual Entry */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Individual Marks Entry</h3>
              
              <div className="grid gap-4">
                {test.submissions.map((submission, index) => (
                  <div
                    key={submission.id}
                    className="bg-white/5 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{submission.student.fullName}</p>
                        <p className="text-sm text-slate-400">{submission.student.uid}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400">Marks:</span>
                        <input
                          type="number"
                          className="w-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                          value={grades[submission.id] || ''}
                          onChange={(e) => setGrades({
                            ...grades,
                            [submission.id]: parseFloat(e.target.value) || 0
                          })}
                          min="0"
                          max={test.totalMarks}
                          step="0.5"
                        />
                        <span className="text-slate-400">/ {test.totalMarks}</span>
                      </div>
                      
                      {grades[submission.id] && (
                        <div className="text-sm">
                          <span className={`font-semibold ${
                            ((grades[submission.id] / test.totalMarks) * 100) >= 80 ? 'text-green-400' :
                            ((grades[submission.id] / test.totalMarks) * 100) >= 60 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {Math.round((grades[submission.id] / test.totalMarks) * 100)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white/5 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Grading Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Total Students</p>
                  <p className="text-xl font-bold text-white">{test.submissions.length}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Graded</p>
                  <p className="text-xl font-bold text-green-400">{Object.keys(grades).length}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Pending</p>
                  <p className="text-xl font-bold text-orange-400">{test.submissions.length - Object.keys(grades).length}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Average</p>
                  <p className="text-xl font-bold text-blue-400">
                    {Object.keys(grades).length > 0 ? 
                      Math.round(Object.values(grades).reduce((sum, mark) => sum + mark, 0) / Object.keys(grades).length) 
                      : 0
                    }
                  </p>
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
              disabled={Object.keys(grades).length === 0}
            >
              <Save className="w-4 h-4" />
              <span>Save Grades ({Object.keys(grades).length}/{test.submissions.length})</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default OfflineTestManager