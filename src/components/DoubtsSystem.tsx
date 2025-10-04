import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Calendar,
  Upload,
  X,
  Send,
  Tag,
  Eye,
  MessageCircle,
  FileText,
  Image as ImageIcon,
  Download
} from 'lucide-react'
import { doubtsAPI, fileAPI, apiUtils } from '../config/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

interface Doubt {
  id: string
  title: string
  description: string
  subject: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  studentId: string
  studentName: string
  assignedTeacherId?: string
  assignedTeacherName?: string
  attachments?: string[]
  answer?: string
  answerAttachments?: string[]
  createdAt: string
  resolvedAt?: string
  comments?: Array<{
    id: string
    text: string
    authorId: string
    authorName: string
    createdAt: string
  }>
}

const DoubtsSystem: React.FC = () => {
  const { user } = useAuth()
  const [doubts, setDoubts] = useState<Doubt[]>([])
  const [selectedDoubt, setSelectedDoubt] = useState<Doubt | null>(null)
  const [showSubmitForm, setShowSubmitForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    subject: '',
    priority: '',
    search: ''
  })

  // Form states
  const [submitForm, setSubmitForm] = useState({
    title: '',
    description: '',
    subject: '',
    attachments: [] as File[]
  })
  const [answerForm, setAnswerForm] = useState({
    answer: '',
    attachments: [] as File[]
  })

  const isTeacher = user?.role === 'TEACHER' || user?.role === 'HEAD_TEACHER'

  // Load doubts
  useEffect(() => {
    loadDoubts()
  }, [filters])

  const loadDoubts = async () => {
    try {
      setLoading(true)
      const response = isTeacher 
        ? await doubtsAPI.getAllDoubts(filters)
        : await doubtsAPI.getMyDoubts(filters)
      setDoubts(response.data?.doubts || [])
    } catch (error) {
      toast.error('Failed to load doubts')
      console.error('Error loading doubts:', error)
    } finally {
      setLoading(false)
    }
  }

  // Submit new doubt
  const handleSubmitDoubt = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!submitForm.title || !submitForm.description || !submitForm.subject) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      const formData = new FormData()
      formData.append('title', submitForm.title)
      formData.append('description', submitForm.description)
      formData.append('subject', submitForm.subject)
      
      submitForm.attachments.forEach((file, index) => {
        formData.append(`attachments[${index}]`, file)
      })

      await doubtsAPI.submitDoubt({
        title: submitForm.title,
        description: submitForm.description,
        subject: submitForm.subject,
        attachments: submitForm.attachments
      })

      toast.success('Doubt submitted successfully!')
      setSubmitForm({ title: '', description: '', subject: '', attachments: [] })
      setShowSubmitForm(false)
      loadDoubts()
    } catch (error) {
      toast.error(apiUtils.handleApiError(error))
    }
  }

  // Answer doubt (teacher only)
  const handleAnswerDoubt = async (doubtId: string) => {
    if (!answerForm.answer) {
      toast.error('Please provide an answer')
      return
    }

    try {
      await doubtsAPI.answerDoubt(doubtId, {
        answer: answerForm.answer,
        attachments: answerForm.attachments
      })

      toast.success('Answer submitted successfully!')
      setAnswerForm({ answer: '', attachments: [] })
      loadDoubts()
      
      // Update selected doubt if it's the one being answered
      if (selectedDoubt?.id === doubtId) {
        const updatedDoubt = { ...selectedDoubt, answer: answerForm.answer }
        setSelectedDoubt(updatedDoubt)
      }
    } catch (error) {
      toast.error(apiUtils.handleApiError(error))
    }
  }

  // Update doubt status
  const updateDoubtStatus = async (doubtId: string, status: Doubt['status']) => {
    try {
      await doubtsAPI.updateDoubtStatus(doubtId, status)
      toast.success('Status updated successfully!')
      loadDoubts()
    } catch (error) {
      toast.error(apiUtils.handleApiError(error))
    }
  }

  // Set doubt priority
  const setDoubtPriority = async (doubtId: string, priority: Doubt['priority']) => {
    try {
      await doubtsAPI.setPriority(doubtId, priority)
      toast.success('Priority updated successfully!')
      loadDoubts()
    } catch (error) {
      toast.error(apiUtils.handleApiError(error))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800'
      case 'RESOLVED': return 'bg-green-100 text-green-800'
      case 'CLOSED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-blue-100 text-blue-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'URGENT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredDoubts = doubts.filter(doubt => {
    if (filters.search && !doubt.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !doubt.description.toLowerCase().includes(filters.search.toLowerCase())) return false
    if (filters.status && doubt.status !== filters.status) return false
    if (filters.subject && doubt.subject !== filters.subject) return false
    if (filters.priority && doubt.priority !== filters.priority) return false
    return true
  })

  return (
    <div className="flex h-full bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {isTeacher ? 'Student Doubts' : 'My Doubts'}
                </h1>
                <p className="text-gray-600">
                  {isTeacher ? 'Help students by answering their questions' : 'Ask questions and get help from teachers'}
                </p>
              </div>
            </div>
            
            {!isTeacher && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSubmitForm(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Ask Question
              </motion.button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search doubts..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Status</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>

            <select
              value={filters.subject}
              onChange={(e) => setFilters({...filters, subject: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="English">English</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters({...filters, priority: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        {/* Doubts List */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredDoubts.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No doubts found</h3>
              <p className="text-gray-600">
                {!isTeacher ? "You haven't asked any questions yet." : "No student doubts to display."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredDoubts.map((doubt) => (
                <motion.div
                  key={doubt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedDoubt(doubt)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{doubt.title}</h3>
                        <p className="text-gray-600 line-clamp-2">{doubt.description}</p>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doubt.status)}`}>
                          {doubt.status.replace('_', ' ')}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(doubt.priority)}`}>
                          {doubt.priority}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {doubt.studentName}
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          {doubt.subject}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {apiUtils.formatDate(doubt.createdAt)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {doubt.attachments && doubt.attachments.length > 0 && (
                          <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {doubt.attachments.length}
                          </div>
                        )}
                        {doubt.answer && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="w-4 h-4" />
                            Answered
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Submit Doubt Modal */}
      <AnimatePresence>
        {showSubmitForm && (
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto"
            >
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Ask a Question</h2>
                  <button
                    onClick={() => setShowSubmitForm(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmitDoubt} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={submitForm.title}
                    onChange={(e) => setSubmitForm({...submitForm, title: e.target.value})}
                    placeholder="Brief title for your question"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <select
                    value={submitForm.subject}
                    onChange={(e) => setSubmitForm({...submitForm, subject: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">Select subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={submitForm.description}
                    onChange={(e) => setSubmitForm({...submitForm, description: e.target.value})}
                    placeholder="Describe your question in detail..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                      onChange={(e) => setSubmitForm({...submitForm, attachments: Array.from(e.target.files || [])})}
                      className="hidden"
                      id="doubt-attachments"
                    />
                    <label htmlFor="doubt-attachments" className="cursor-pointer">
                      <div className="text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Click to upload files</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF, DOC up to 10MB each</p>
                      </div>
                    </label>
                    
                    {submitForm.attachments.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {submitForm.attachments.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText className="w-4 h-4" />
                            {file.name}
                            <button
                              type="button"
                              onClick={() => setSubmitForm({
                                ...submitForm, 
                                attachments: submitForm.attachments.filter((_, i) => i !== index)
                              })}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowSubmitForm(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                  >
                    Submit Question
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Doubt Detail Modal */}
      <AnimatePresence>
        {selectedDoubt && (
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
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{selectedDoubt.title}</h2>
                  <button
                    onClick={() => setSelectedDoubt(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Question Details */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedDoubt.status)}`}>
                      {selectedDoubt.status.replace('_', ' ')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedDoubt.priority)}`}>
                      {selectedDoubt.priority}
                    </span>
                    <span className="text-sm text-gray-500">
                      {selectedDoubt.subject} • {apiUtils.formatDate(selectedDoubt.createdAt)}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-gray-800 whitespace-pre-wrap">{selectedDoubt.description}</p>
                  </div>

                  {/* Attachments */}
                  {selectedDoubt.attachments && selectedDoubt.attachments.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Attachments</h4>
                      <div className="space-y-2">
                        {selectedDoubt.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span>Attachment {index + 1}</span>
                            <button className="text-indigo-600 hover:text-indigo-700">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Teacher Controls */}
                {isTeacher && (
                  <div className="border-t pt-6">
                    <div className="flex gap-2 mb-4">
                      <select
                        value={selectedDoubt.status}
                        onChange={(e) => updateDoubtStatus(selectedDoubt.id, e.target.value as Doubt['status'])}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="OPEN">Open</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                      
                      <select
                        value={selectedDoubt.priority}
                        onChange={(e) => setDoubtPriority(selectedDoubt.id, e.target.value as Doubt['priority'])}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="LOW">Low Priority</option>
                        <option value="MEDIUM">Medium Priority</option>
                        <option value="HIGH">High Priority</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Answer Section */}
                {selectedDoubt.answer ? (
                  <div className="border-t pt-6">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Teacher's Answer
                    </h4>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-gray-800 whitespace-pre-wrap">{selectedDoubt.answer}</p>
                    </div>
                  </div>
                ) : isTeacher && (
                  <div className="border-t pt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Provide Answer</h4>
                    <textarea
                      value={answerForm.answer}
                      onChange={(e) => setAnswerForm({...answerForm, answer: e.target.value})}
                      placeholder="Type your answer here..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                    />
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleAnswerDoubt(selectedDoubt.id)}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Submit Answer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DoubtsSystem