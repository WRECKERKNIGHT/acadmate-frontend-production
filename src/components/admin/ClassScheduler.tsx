import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Users, MapPin, BookOpen, Plus, Edit, Trash2, Check,
  X, AlertCircle, CheckCircle, User, Timer, Target, Settings
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ScheduleItem {
  id: string;
  subject: string;
  teacher: string;
  teacherId: string;
  className: string;
  time: string;
  date: string;
  room: string;
  duration: number;
  maxStudents: number;
  enrolledStudents: number;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  description?: string;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  availability: string[];
}

const ClassScheduler: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ScheduleItem | null>(null);
  const [view, setView] = useState<'week' | 'day' | 'month'>('week');
  
  const [teachers] = useState<Teacher[]>([
    { id: '1', name: 'Dr. Sarah Johnson', email: 'sarah@acadmate.com', subjects: ['Physics', 'Mathematics'], availability: ['09:00-12:00', '14:00-17:00'] },
    { id: '2', name: 'Prof. Mike Chen', email: 'mike@acadmate.com', subjects: ['Chemistry', 'Biology'], availability: ['10:00-13:00', '15:00-18:00'] },
    { id: '3', name: 'Ms. Emily Davis', email: 'emily@acadmate.com', subjects: ['English', 'Literature'], availability: ['08:00-11:00', '13:00-16:00'] }
  ]);

  const [schedule, setSchedule] = useState<ScheduleItem[]>([
    { id: '1', subject: 'Physics', teacher: 'Dr. Sarah Johnson', teacherId: '1', className: 'Class 12-A', time: '10:00', date: '2024-01-15', room: 'Room 301', duration: 60, maxStudents: 30, enrolledStudents: 25, status: 'scheduled' },
    { id: '2', subject: 'Mathematics', teacher: 'Dr. Sarah Johnson', teacherId: '1', className: 'Class 11-B', time: '14:00', date: '2024-01-15', room: 'Room 205', duration: 90, maxStudents: 25, enrolledStudents: 23, status: 'active' },
    { id: '3', subject: 'Chemistry', teacher: 'Prof. Mike Chen', teacherId: '2', className: 'Class 12-B', time: '11:00', date: '2024-01-15', room: 'Lab 1', duration: 120, maxStudents: 20, enrolledStudents: 18, status: 'completed' }
  ]);

  const [newClass, setNewClass] = useState<Partial<ScheduleItem>>({
    subject: '',
    teacherId: '',
    className: '',
    time: '',
    date: '',
    room: '',
    duration: 60,
    maxStudents: 30,
    description: ''
  });

  const GlowCard = ({ children, className = '', ...props }: any) => (
    <motion.div
      className={`relative bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-400/60 transition-all duration-300 ${className}`}
      whileHover={{ scale: 1.01, boxShadow: '0 0 30px rgba(0, 255, 255, 0.2)' }}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );

  const createClass = () => {
    if (!newClass.subject || !newClass.teacherId || !newClass.className || !newClass.time || !newClass.date || !newClass.room) {
      toast.error('Please fill in all required fields!', {
        style: { background: '#0a0a0a', color: '#ff4444', border: '1px solid #ff4444' }
      });
      return;
    }

    const teacher = teachers.find(t => t.id === newClass.teacherId);
    if (!teacher) return;

    const classItem: ScheduleItem = {
      id: Date.now().toString(),
      subject: newClass.subject!,
      teacher: teacher.name,
      teacherId: newClass.teacherId!,
      className: newClass.className!,
      time: newClass.time!,
      date: newClass.date!,
      room: newClass.room!,
      duration: newClass.duration || 60,
      maxStudents: newClass.maxStudents || 30,
      enrolledStudents: 0,
      status: 'scheduled',
      description: newClass.description
    };

    setSchedule(prev => [...prev, classItem]);
    setNewClass({
      subject: '',
      teacherId: '',
      className: '',
      time: '',
      date: '',
      room: '',
      duration: 60,
      maxStudents: 30,
      description: ''
    });
    setShowCreateModal(false);
    
    toast.success('🎉 Class scheduled successfully!', {
      style: { background: '#0a0a0a', color: '#00ffff', border: '1px solid #00ffff' }
    });
  };

  const deleteClass = (id: string) => {
    setSchedule(prev => prev.filter(item => item.id !== id));
    toast.success('Class deleted successfully!', {
      style: { background: '#0a0a0a', color: '#00ffff', border: '1px solid #00ffff' }
    });
  };

  const updateClassStatus = (id: string, status: ScheduleItem['status']) => {
    setSchedule(prev => prev.map(item => 
      item.id === id ? { ...item, status } : item
    ));
    toast.success(`Class marked as ${status}!`, {
      style: { background: '#0a0a0a', color: '#00ffff', border: '1px solid #00ffff' }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-20"
            initial={{ x: Math.random() * 1200, y: Math.random() * 800 }}
            animate={{ x: Math.random() * 1200, y: Math.random() * 800 }}
            transition={{ duration: Math.random() * 20 + 15, repeat: Infinity, repeatType: "reverse" }}
          />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent flex items-center">
                <Calendar className="w-10 h-10 mr-4 text-cyan-400" />
                Class Scheduler 📅
              </h1>
              <p className="text-gray-400 mt-2">Intelligent class scheduling with real-time management</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex space-x-4">
              <motion.button
                onClick={() => setShowCreateModal(true)}
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl font-semibold"
              >
                <Plus size={18} />
                <span>Schedule Class</span>
              </motion.button>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Today's Classes</p>
                  <p className="text-2xl font-bold text-cyan-400">{schedule.filter(s => s.date === new Date().toISOString().split('T')[0]).length}</p>
                </div>
                <Calendar className="text-cyan-400" size={24} />
              </div>
            </GlowCard>
            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Classes</p>
                  <p className="text-2xl font-bold text-green-400">{schedule.filter(s => s.status === 'active').length}</p>
                </div>
                <CheckCircle className="text-green-400" size={24} />
              </div>
            </GlowCard>
            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Teachers</p>
                  <p className="text-2xl font-bold text-purple-400">{teachers.length}</p>
                </div>
                <User className="text-purple-400" size={24} />
              </div>
            </GlowCard>
            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Students</p>
                  <p className="text-2xl font-bold text-yellow-400">{schedule.reduce((sum, s) => sum + s.enrolledStudents, 0)}</p>
                </div>
                <Users className="text-yellow-400" size={24} />
              </div>
            </GlowCard>
          </motion.div>

          <GlowCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-cyan-400">Class Schedule</h3>
              <div className="flex space-x-2">
                {['day', 'week', 'month'].map((viewType) => (
                  <motion.button
                    key={viewType}
                    onClick={() => setView(viewType as any)}
                    whileHover={{ scale: 1.05 }}
                    className={`px-4 py-2 rounded-lg capitalize transition-all duration-300 ${
                      view === viewType ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {viewType}
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              {schedule.map((classItem, index) => (
                <motion.div
                  key={classItem.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-black/40 border border-gray-700 rounded-xl hover:border-cyan-500/30 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-12 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full" />
                    <div>
                      <h4 className="font-semibold text-white text-lg">{classItem.subject}</h4>
                      <p className="text-gray-400 text-sm">{classItem.teacher} • {classItem.className}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="flex items-center text-xs text-gray-400">
                          <Clock size={12} className="mr-1" />
                          {classItem.time} ({classItem.duration}min)
                        </span>
                        <span className="flex items-center text-xs text-gray-400">
                          <MapPin size={12} className="mr-1" />
                          {classItem.room}
                        </span>
                        <span className="flex items-center text-xs text-gray-400">
                          <Users size={12} className="mr-1" />
                          {classItem.enrolledStudents}/{classItem.maxStudents}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(classItem.status)}`}>
                      {classItem.status}
                    </span>
                    
                    <div className="flex space-x-1">
                      {classItem.status === 'scheduled' && (
                        <motion.button
                          onClick={() => updateClassStatus(classItem.id, 'active')}
                          whileHover={{ scale: 1.1 }}
                          className="p-2 bg-green-500/20 border border-green-500/30 rounded-lg"
                          title="Start Class"
                        >
                          <CheckCircle size={16} />
                        </motion.button>
                      )}
                      {classItem.status === 'active' && (
                        <motion.button
                          onClick={() => updateClassStatus(classItem.id, 'completed')}
                          whileHover={{ scale: 1.1 }}
                          className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg"
                          title="Complete Class"
                        >
                          <Check size={16} />
                        </motion.button>
                      )}
                      <motion.button
                        onClick={() => setEditingClass(classItem)}
                        whileHover={{ scale: 1.1 }}
                        className="p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg"
                        title="Edit Class"
                      >
                        <Edit size={16} />
                      </motion.button>
                      <motion.button
                        onClick={() => deleteClass(classItem.id)}
                        whileHover={{ scale: 1.1 }}
                        className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg"
                        title="Delete Class"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlowCard>
        </div>
      </motion.div>

      {/* Create Class Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black/90 border border-cyan-500/30 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-cyan-400">Schedule New Class</h3>
                <motion.button
                  onClick={() => setShowCreateModal(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg"
                >
                  <X size={16} />
                </motion.button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Subject *</label>
                  <input
                    type="text"
                    value={newClass.subject || ''}
                    onChange={(e) => setNewClass(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg focus:border-cyan-500/50 focus:outline-none text-white"
                    placeholder="Enter subject name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Teacher *</label>
                  <select
                    value={newClass.teacherId || ''}
                    onChange={(e) => setNewClass(prev => ({ ...prev, teacherId: e.target.value }))}
                    className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg focus:border-cyan-500/50 focus:outline-none text-white"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map(teacher => (
                      <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Class Name *</label>
                    <input
                      type="text"
                      value={newClass.className || ''}
                      onChange={(e) => setNewClass(prev => ({ ...prev, className: e.target.value }))}
                      className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg focus:border-cyan-500/50 focus:outline-none text-white"
                      placeholder="Class 12-A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Room *</label>
                    <input
                      type="text"
                      value={newClass.room || ''}
                      onChange={(e) => setNewClass(prev => ({ ...prev, room: e.target.value }))}
                      className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg focus:border-cyan-500/50 focus:outline-none text-white"
                      placeholder="Room 301"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Date *</label>
                    <input
                      type="date"
                      value={newClass.date || ''}
                      onChange={(e) => setNewClass(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg focus:border-cyan-500/50 focus:outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Time *</label>
                    <input
                      type="time"
                      value={newClass.time || ''}
                      onChange={(e) => setNewClass(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg focus:border-cyan-500/50 focus:outline-none text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Duration (min)</label>
                    <input
                      type="number"
                      value={newClass.duration || ''}
                      onChange={(e) => setNewClass(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg focus:border-cyan-500/50 focus:outline-none text-white"
                      placeholder="60"
                      min="30"
                      max="180"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Max Students</label>
                    <input
                      type="number"
                      value={newClass.maxStudents || ''}
                      onChange={(e) => setNewClass(prev => ({ ...prev, maxStudents: parseInt(e.target.value) }))}
                      className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg focus:border-cyan-500/50 focus:outline-none text-white"
                      placeholder="30"
                      min="1"
                      max="50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                  <textarea
                    value={newClass.description || ''}
                    onChange={(e) => setNewClass(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg focus:border-cyan-500/50 focus:outline-none text-white h-24 resize-none"
                    placeholder="Optional class description..."
                  />
                </div>

                <motion.button
                  onClick={createClass}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold flex items-center justify-center space-x-2"
                >
                  <Plus size={18} />
                  <span>Schedule Class</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassScheduler;