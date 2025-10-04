import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, Button, Input, Badge, Modal, Loading, icons } from './ui'
import api from '../config/api'
import toast from 'react-hot-toast'

interface Teacher {
  id: string
  fullName: string
  uid: string
  subjects: string[]
  isActive: boolean
}

interface Doubt {
  id: string
  subject: string
  description: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED'
  imageUrl?: string
  createdAt: string
  appointment?: {
    id: string
    scheduledAt: string
    duration: number
    status: string
    teacher: {
      fullName: string
      uid: string
    }
  }
}

interface TimeSlot {
  time: string
  available: boolean
  teacher?: Teacher
}

const DoubtScheduler: React.FC = () => {
  const [doubts, setDoubts] = useState<Doubt[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDoubt, setSelectedDoubt] = useState<Doubt | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  
  // Scheduling state
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [duration, setDuration] = useState(30)
  const [notes, setNotes] = useState('')
  const [scheduling, setScheduling] = useState(false)

  // Create doubt state
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [newDoubt, setNewDoubt] = useState({
    subject: '',
    description: '',
    priority: 'MEDIUM' as const,
    imageUrl: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [doubtsRes, teachersRes] = await Promise.all([
        api.doubts.getAll(),
        api.profile.getAllTeachers()
      ])
      
      setDoubts(doubtsRes.data || [])
      setTeachers(teachersRes.data || [])
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const createDoubt = async () => {
    if (!newDoubt.subject || !newDoubt.description) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setScheduling(true)
      await api.doubts.create(newDoubt)
      toast.success('Doubt submitted successfully')
      setCreateModalOpen(false)
      setNewDoubt({
        subject: '',
        description: '',
        priority: 'MEDIUM',
        imageUrl: ''
      })
      loadData()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create doubt')
    } finally {
      setScheduling(false)
    }
  }

  const scheduleAppointment = async () => {
    if (!selectedDoubt || !selectedTeacher || !selectedDate || !selectedTime) {
      toast.error('Please fill in all scheduling details')
      return
    }

    try {
      setScheduling(true)
      const scheduledAt = new Date(`${selectedDate}T${selectedTime}`)
      
      await api.doubts.scheduleAppointment(selectedDoubt.id, {
        teacherId: selectedTeacher.id,
        scheduledAt: scheduledAt.toISOString(),
        duration,
        notes
      })
      
      toast.success('Appointment scheduled successfully')
      setScheduleModalOpen(false)
      resetSchedulingState()
      loadData()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to schedule appointment')
    } finally {
      setScheduling(false)
    }
  }

  const resetSchedulingState = () => {
    setSelectedTeacher(null)
    setSelectedDate('')
    setSelectedTime('')
    setDuration(30)
    setNotes('')
  }

  const generateTimeSlots = (): TimeSlot[] => {
    const slots = []
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push({
          time,
          available: Math.random() > 0.3, // Mock availability
          teacher: selectedTeacher || undefined
        })
      }
    }
    return slots
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'error'
      case 'MEDIUM': return 'warning'
      case 'LOW': return 'success'
      default: return 'primary'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESOLVED': return 'success'
      case 'IN_PROGRESS': return 'warning'
      case 'PENDING': return 'info'
      default: return 'primary'
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (loading) return <Loading className="h-64" />

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Doubt Management</h1>
          <p className="text-slate-400 mt-1">Submit doubts and schedule appointments with teachers</p>
        </div>
        <Button icon="plus" onClick={() => setCreateModalOpen(true)}>
          Submit New Doubt
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6" gradient>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Doubts</p>
              <p className="text-2xl font-bold text-slate-100">{doubts.length}</p>
            </div>
            <icons.message className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        <Card className="p-6" gradient>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Pending</p>
              <p className="text-2xl font-bold text-slate-100">
                {doubts.filter(d => d.status === 'PENDING').length}
              </p>
            </div>
            <icons.clock className="w-8 h-8 text-yellow-400" />
          </div>
        </Card>

        <Card className="p-6" gradient>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Scheduled</p>
              <p className="text-2xl font-bold text-slate-100">
                {doubts.filter(d => d.appointment).length}
              </p>
            </div>
            <icons.calendar className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        <Card className="p-6" gradient>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Resolved</p>
              <p className="text-2xl font-bold text-slate-100">
                {doubts.filter(d => d.status === 'RESOLVED').length}
              </p>
            </div>
            <icons.success className="w-8 h-8 text-emerald-400" />
          </div>
        </Card>
      </div>

      {/* Doubts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {doubts.map((doubt) => (
            <motion.div
              key={doubt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              layout
            >
              <Card className="p-6" hover onClick={() => {
                setSelectedDoubt(doubt)
                setModalOpen(true)
              }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-slate-100">{doubt.subject}</h3>
                      <Badge variant={getPriorityColor(doubt.priority)}>{doubt.priority}</Badge>
                      <Badge variant={getStatusColor(doubt.status)}>{doubt.status}</Badge>
                    </div>
                    <p className="text-slate-400 text-sm line-clamp-2">{doubt.description}</p>
                  </div>
                </div>

                {doubt.appointment ? (
                  <div className="mt-4 p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-200">
                          Scheduled with {doubt.appointment.teacher.fullName}
                        </p>
                        <p className="text-xs text-slate-400">
                          {formatDateTime(doubt.appointment.scheduledAt)} • {doubt.appointment.duration}min
                        </p>
                      </div>
                      <Badge variant="success">{doubt.appointment.status}</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex justify-end">
                    <Button
                      size="sm"
                      variant="primary"
                      icon="calendar"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedDoubt(doubt)
                        setScheduleModalOpen(true)
                      }}
                    >
                      Schedule
                    </Button>
                  </div>
                )}

                <div className="mt-3 text-xs text-slate-500">
                  Created {new Date(doubt.createdAt).toLocaleDateString()}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {doubts.length === 0 && (
        <div className="text-center py-12">
          <icons.message className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-300 mb-2">No doubts yet</h3>
          <p className="text-slate-500 mb-6">Submit your first doubt to get started</p>
          <Button icon="plus" onClick={() => setCreateModalOpen(true)}>
            Submit New Doubt
          </Button>
        </div>
      )}

      {/* Create Doubt Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Submit New Doubt"
        size="lg"
      >
        <div className="space-y-6">
          <Input
            label="Subject"
            placeholder="Enter the subject"
            value={newDoubt.subject}
            onChange={(e) => setNewDoubt(prev => ({ ...prev, subject: e.target.value }))}
            icon="book"
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea
              placeholder="Describe your doubt in detail..."
              value={newDoubt.description}
              onChange={(e) => setNewDoubt(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2.5 text-slate-200 
                placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                focus:outline-none transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Priority</label>
            <div className="flex gap-3">
              {(['LOW', 'MEDIUM', 'HIGH'] as const).map(priority => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setNewDoubt(prev => ({ ...prev, priority }))}
                  className={`px-4 py-2 rounded-lg border font-medium text-sm transition-colors ${
                    newDoubt.priority === priority
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" loading={scheduling} onClick={createDoubt}>
              Submit Doubt
            </Button>
          </div>
        </div>
      </Modal>

      {/* Schedule Appointment Modal */}
      <Modal
        isOpen={scheduleModalOpen}
        onClose={() => {
          setScheduleModalOpen(false)
          resetSchedulingState()
        }}
        title="Schedule Appointment"
        size="xl"
      >
        <div className="space-y-6">
          {/* Teacher Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Select Teacher</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {teachers.filter(t => t.isActive).map(teacher => (
                <button
                  key={teacher.id}
                  onClick={() => setSelectedTeacher(teacher)}
                  className={`p-4 rounded-lg border text-left transition-colors ${
                    selectedTeacher?.id === teacher.id
                      ? 'bg-blue-600/20 border-blue-600 text-blue-400'
                      : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  <div className="font-medium">{teacher.fullName}</div>
                  <div className="text-sm opacity-75">{teacher.uid}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {teacher.subjects.slice(0, 3).map(subject => (
                      <span key={subject} className="text-xs px-2 py-1 bg-slate-700 rounded">
                        {subject}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time Selection */}
          {selectedTeacher && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              {selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Time Slots</label>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {generateTimeSlots().map(slot => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`p-2 text-xs rounded border transition-colors ${
                          selectedTime === slot.time
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : slot.available
                            ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                            : 'bg-slate-900 border-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Duration and Notes */}
          {selectedTime && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Duration (minutes)</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Additional Notes</label>
                <textarea
                  placeholder="Any specific requirements..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-600 bg-slate-800/50 px-3 py-2 text-slate-200 
                    placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
                    focus:outline-none transition-colors resize-none text-sm"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => {
              setScheduleModalOpen(false)
              resetSchedulingState()
            }}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              loading={scheduling} 
              onClick={scheduleAppointment}
              disabled={!selectedTeacher || !selectedDate || !selectedTime}
            >
              Schedule Appointment
            </Button>
          </div>
        </div>
      </Modal>

      {/* Doubt Details Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Doubt Details"
        size="lg"
      >
        {selectedDoubt && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-xl font-semibold text-slate-100">{selectedDoubt.subject}</h3>
                <Badge variant={getPriorityColor(selectedDoubt.priority)}>{selectedDoubt.priority}</Badge>
                <Badge variant={getStatusColor(selectedDoubt.status)}>{selectedDoubt.status}</Badge>
              </div>
              <p className="text-slate-300">{selectedDoubt.description}</p>
            </div>

            {selectedDoubt.imageUrl && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Attachment</label>
                <img
                  src={selectedDoubt.imageUrl}
                  alt="Doubt attachment"
                  className="max-w-full h-auto rounded-lg border border-slate-600"
                />
              </div>
            )}

            {selectedDoubt.appointment && (
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h4 className="font-medium text-slate-200 mb-2">Scheduled Appointment</h4>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-300">Teacher: {selectedDoubt.appointment.teacher.fullName}</p>
                  <p className="text-slate-300">Date & Time: {formatDateTime(selectedDoubt.appointment.scheduledAt)}</p>
                  <p className="text-slate-300">Duration: {selectedDoubt.appointment.duration} minutes</p>
                  <p className="text-slate-300">Status: <Badge variant="success">{selectedDoubt.appointment.status}</Badge></p>
                </div>
              </div>
            )}

            <div className="text-sm text-slate-500">
              Submitted on {new Date(selectedDoubt.createdAt).toLocaleDateString()}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default DoubtScheduler