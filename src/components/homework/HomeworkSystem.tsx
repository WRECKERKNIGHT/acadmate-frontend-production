import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Users,
  FileText,
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Send,
  Bell,
  Star,
  TrendingUp,
  Filter,
  Search,
  Save
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

interface Homework {
  id: string;
  title: string;
  description: string;
  subject: string;
  dueDate: string;
  createdDate: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  totalMarks: number;
  attachments?: string[];
  status: 'draft' | 'published' | 'closed';
  priority: 'low' | 'medium' | 'high';
}

interface Submission {
  id: string;
  homeworkId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  files: string[];
  textContent: string;
  status: 'submitted' | 'graded' | 'late';
  marks?: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
}

interface HomeworkStats {
  totalHomeworks: number;
  pendingSubmissions: number;
  gradedSubmissions: number;
  averageScore: number;
  overdueCount: number;
}

const HomeworkSystem: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedHomework, setSelectedHomework] = useState<Homework | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Sample data - in real app, this would come from backend
  const [homeworks] = useState<Homework[]>([
    {
      id: '1',
      title: 'Physics Chapter 5: Thermodynamics',
      description: 'Solve problems 1-15 from textbook page 124. Show complete working and explanations.',
      subject: 'Physics',
      dueDate: '2024-01-25T23:59:00Z',
      createdDate: '2024-01-18T10:00:00Z',
      teacherId: 'teacher1',
      teacherName: 'Dr. Sarah Johnson',
      classId: 'class-12a',
      className: 'Class 12-A',
      totalMarks: 50,
      attachments: ['thermodynamics_problems.pdf'],
      status: 'published',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Mathematics: Calculus Integration',
      description: 'Complete worksheet on integration techniques. Practice problems and theory questions.',
      subject: 'Mathematics',
      dueDate: '2024-01-28T23:59:00Z',
      createdDate: '2024-01-20T14:00:00Z',
      teacherId: 'teacher2',
      teacherName: 'Prof. Michael Chen',
      classId: 'class-12a',
      className: 'Class 12-A',
      totalMarks: 30,
      status: 'published',
      priority: 'medium'
    }
  ]);

  const [submissions] = useState<Submission[]>([
    {
      id: '1',
      homeworkId: '1',
      studentId: 'student1',
      studentName: 'Alice Johnson',
      submittedAt: '2024-01-24T18:30:00Z',
      files: ['alice_physics_hw.pdf'],
      textContent: 'Completed all problems with detailed solutions.',
      status: 'submitted',
    },
    {
      id: '2',
      homeworkId: '1',
      studentId: 'student2',
      studentName: 'Bob Smith',
      submittedAt: '2024-01-25T09:15:00Z',
      files: ['bob_physics_solutions.pdf'],
      textContent: 'Solved most problems, had difficulty with problem 12.',
      status: 'graded',
      marks: 42,
      feedback: 'Good work overall! Review the concept of entropy for problem 12.',
      gradedBy: 'Dr. Sarah Johnson',
      gradedAt: '2024-01-25T15:20:00Z'
    }
  ]);

  const [newHomework, setNewHomework] = useState({
    title: '',
    description: '',
    subject: '',
    dueDate: '',
    totalMarks: 0,
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  // Animated background particles
  const ParticleBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-20"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
          }}
          animate={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
          }}
          transition={{
            duration: Math.random() * 30 + 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );

  // Glowing card component
  const GlowCard = ({ children, className = '', urgent = false, ...props }: any) => (
    <motion.div
      className={`relative bg-black/40 backdrop-blur-xl border ${
        urgent ? 'border-red-500/30 hover:border-red-400/60' : 'border-blue-500/30 hover:border-blue-400/60'
      } rounded-2xl p-6 transition-all duration-300 ${className}`}
      whileHover={{ 
        scale: 1.01,
        boxShadow: urgent 
          ? '0 0 30px rgba(239, 68, 68, 0.2)' 
          : '0 0 30px rgba(59, 130, 246, 0.2)'
      }}
      {...props}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${
        urgent ? 'from-red-500/10 to-orange-500/10' : 'from-blue-500/10 to-purple-500/10'
      } rounded-2xl`} />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );

  const getHomeworkStats = (): HomeworkStats => {
    const totalHomeworks = homeworks.length;
    const pendingSubmissions = submissions.filter(s => s.status === 'submitted').length;
    const gradedSubmissions = submissions.filter(s => s.status === 'graded').length;
    const averageScore = gradedSubmissions > 0 
      ? submissions.filter(s => s.marks).reduce((sum, s) => sum + (s.marks || 0), 0) / gradedSubmissions
      : 0;
    const overdueCount = homeworks.filter(h => 
      new Date(h.dueDate) < new Date() && h.status === 'published'
    ).length;

    return {
      totalHomeworks,
      pendingSubmissions,
      gradedSubmissions,
      averageScore: Math.round(averageScore),
      overdueCount
    };
  };

  const stats = getHomeworkStats();

  const createHomework = async () => {
    if (!newHomework.title || !newHomework.description || !newHomework.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Simulate API call
    console.log('Creating homework:', newHomework);
    
    toast.success('🎯 Homework created successfully!', {
      style: {
        background: '#0a0a0a',
        color: '#00ffff',
        border: '1px solid #00ffff',
      }
    });

    setShowCreateForm(false);
    setNewHomework({
      title: '',
      description: '',
      subject: '',
      dueDate: '',
      totalMarks: 0,
      priority: 'medium'
    });
  };

  const filteredHomeworks = homeworks.filter(homework => {
    const matchesSearch = homework.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         homework.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || homework.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date();

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ParticleBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 pt-8 pb-12"
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 space-y-4 lg:space-y-0">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Homework Management System 📚
              </h1>
              <p className="text-gray-400 mt-2">
                Complete homework lifecycle with scheduling, submission, and grading
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4"
            >
              <motion.button
                onClick={() => setShowCreateForm(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl font-semibold"
              >
                <Plus size={18} />
                <span>Create Homework</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl font-semibold text-sm"
              >
                <Bell size={16} />
                <span>Send Notifications</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 mb-8"
          >
            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs lg:text-sm">Total Homework</p>
                  <p className="text-xl lg:text-2xl font-bold text-blue-400">{stats.totalHomeworks}</p>
                </div>
                <div className="p-2 lg:p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <BookOpen size={16} />
                </div>
              </div>
            </GlowCard>

            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs lg:text-sm">Pending Review</p>
                  <p className="text-xl lg:text-2xl font-bold text-yellow-400">{stats.pendingSubmissions}</p>
                </div>
                <div className="p-2 lg:p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                  <Clock size={16} />
                </div>
              </div>
            </GlowCard>

            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs lg:text-sm">Graded</p>
                  <p className="text-xl lg:text-2xl font-bold text-green-400">{stats.gradedSubmissions}</p>
                </div>
                <div className="p-2 lg:p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
                  <CheckCircle size={16} />
                </div>
              </div>
            </GlowCard>

            <GlowCard className="p-4" urgent={stats.overdueCount > 0}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs lg:text-sm">Overdue</p>
                  <p className="text-xl lg:text-2xl font-bold text-red-400">{stats.overdueCount}</p>
                </div>
                <div className="p-2 lg:p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
                  <AlertCircle size={16} />
                </div>
              </div>
            </GlowCard>

            <GlowCard className="p-4 col-span-2 md:col-span-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs lg:text-sm">Avg Score</p>
                  <p className="text-xl lg:text-2xl font-bold text-cyan-400">{stats.averageScore}%</p>
                </div>
                <div className="p-2 lg:p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                  <TrendingUp size={16} />
                </div>
              </div>
            </GlowCard>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-2 bg-black/20 p-1 rounded-2xl mb-8 backdrop-blur-xl border border-gray-700"
          >
            {[
              { id: 'overview', label: 'Overview', icon: BookOpen },
              { id: 'homework', label: 'All Homework', icon: FileText },
              { id: 'submissions', label: 'Submissions', icon: Upload },
              { id: 'grading', label: 'Grading', icon: Star },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-2 px-3 lg:px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={18} />
                <span className="text-sm lg:text-base">{tab.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Recent Homework */}
                <div className="lg:col-span-2">
                  <GlowCard>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-blue-400">Recent Homework</h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="text-purple-400 hover:text-purple-300 text-sm"
                      >
                        View All
                      </motion.button>
                    </div>

                    <div className="space-y-4">
                      {homeworks.slice(0, 3).map((homework, index) => (
                        <motion.div
                          key={homework.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                            isOverdue(homework.dueDate)
                              ? 'border-red-500/30 bg-red-500/10 hover:border-red-400/50'
                              : 'border-gray-600 bg-black/30 hover:border-blue-500/50'
                          }`}
                          onClick={() => setSelectedHomework(homework)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">{homework.title}</h4>
                              <p className="text-gray-400 text-sm">{homework.subject} • {homework.className}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                homework.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                homework.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-green-500/20 text-green-400'
                              }`}>
                                {homework.priority}
                              </span>
                              {isOverdue(homework.dueDate) && (
                                <AlertCircle className="text-red-400" size={16} />
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">
                              Due: {new Date(homework.dueDate).toLocaleDateString()}
                            </span>
                            <span className="text-blue-400 font-semibold">
                              {homework.totalMarks} marks
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </GlowCard>
                </div>

                {/* Quick Actions & Recent Activity */}
                <div className="space-y-6">
                  <GlowCard>
                    <h3 className="text-lg font-bold text-purple-400 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      {[
                        { icon: Plus, label: 'Create Homework', color: 'blue' },
                        { icon: Eye, label: 'Review Submissions', color: 'green' },
                        { icon: Star, label: 'Grade Homework', color: 'yellow' },
                        { icon: Send, label: 'Send Reminder', color: 'purple' },
                        { icon: Download, label: 'Export Reports', color: 'cyan' }
                      ].map((action, index) => (
                        <motion.button
                          key={action.label}
                          whileHover={{ scale: 1.05, x: 10 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1 + 0.1 * index }}
                          className={`w-full flex items-center space-x-3 p-3 rounded-lg 
                                    bg-gradient-to-r from-${action.color}-500/20 to-${action.color}-600/20 
                                    border border-${action.color}-500/30 hover:border-${action.color}-400/60
                                    transition-all duration-300`}
                        >
                          <action.icon className={`text-${action.color}-400`} size={18} />
                          <span className="text-white text-sm">{action.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </GlowCard>

                  <GlowCard>
                    <h3 className="text-lg font-bold text-cyan-400 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {[
                        { action: 'New submission received', student: 'Alice Johnson', time: '2 min ago', type: 'success' },
                        { action: 'Homework graded', student: 'Bob Smith', time: '1 hour ago', type: 'info' },
                        { action: 'Late submission', student: 'Carol Davis', time: '3 hours ago', type: 'warning' }
                      ].map((activity, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-center space-x-3 p-3 rounded-lg bg-black/30"
                        >
                          <div className={`p-2 rounded-full ${
                            activity.type === 'success' ? 'bg-green-500/20' :
                            activity.type === 'warning' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                          }`}>
                            {activity.type === 'success' ? <CheckCircle className="text-green-400" size={16} /> :
                             activity.type === 'warning' ? <AlertCircle className="text-yellow-400" size={16} /> :
                             <FileText className="text-blue-400" size={16} />}
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm">{activity.action}</p>
                            <p className="text-gray-400 text-xs">{activity.student} • {activity.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </GlowCard>
                </div>
              </motion.div>
            )}

            {activeTab === 'homework' && (
              <motion.div
                key="homework"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlowCard>
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
                    <h3 className="text-xl font-bold text-blue-400">All Homework Assignments</h3>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search homework..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                        />
                      </div>
                      
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white"
                      >
                        <option value="all">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredHomeworks.map((homework, index) => (
                      <motion.div
                        key={homework.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * index }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${
                          isOverdue(homework.dueDate)
                            ? 'border-red-500/30 bg-red-500/10 hover:border-red-400/50'
                            : 'border-gray-700 bg-black/30 hover:border-blue-500/50'
                        }`}
                        onClick={() => setSelectedHomework(homework)}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-white text-lg">{homework.title}</h4>
                            <p className="text-gray-300">{homework.subject}</p>
                            <p className="text-gray-400 text-sm">{homework.teacherName}</p>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`px-3 py-1 text-sm rounded-full ${
                              homework.status === 'published' ? 'bg-green-500/20 text-green-400' :
                              homework.status === 'draft' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>
                              {homework.status.toUpperCase()}
                            </span>
                            
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              homework.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                              homework.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>
                              {homework.priority}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{homework.description}</p>
                        
                        <div className="flex items-center justify-between text-sm mb-4">
                          <div className="flex items-center text-gray-400">
                            <Clock size={14} className="mr-1" />
                            Due: {new Date(homework.dueDate).toLocaleDateString()}
                          </div>
                          <div className="text-blue-400 font-semibold">
                            {homework.totalMarks} marks
                          </div>
                        </div>
                        
                        {homework.attachments && homework.attachments.length > 0 && (
                          <div className="flex items-center text-gray-400 text-sm mb-4">
                            <FileText size={14} className="mr-1" />
                            {homework.attachments.length} attachment(s)
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="flex-1 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 text-sm"
                          >
                            <Eye size={14} className="inline mr-1" />
                            View Details
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="flex-1 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 text-sm"
                          >
                            <Edit size={14} className="inline mr-1" />
                            Edit
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlowCard>
              </motion.div>
            )}

            {activeTab === 'submissions' && (
              <motion.div
                key="submissions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlowCard>
                  <h3 className="text-xl font-bold text-blue-400 mb-6">Student Submissions</h3>
                  
                  <div className="space-y-4">
                    {submissions.map((submission, index) => {
                      const homework = homeworks.find(h => h.id === submission.homeworkId);
                      return (
                        <motion.div
                          key={submission.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * index }}
                          className="p-4 bg-black/30 rounded-xl border border-gray-700 hover:border-blue-500/30"
                        >
                          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                {submission.studentName.charAt(0)}
                              </div>
                              <div>
                                <h4 className="font-semibold text-white">{submission.studentName}</h4>
                                <p className="text-gray-400 text-sm">{homework?.title}</p>
                                <p className="text-gray-500 text-xs">
                                  Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                              {submission.status === 'graded' ? (
                                <div className="text-right">
                                  <p className="text-green-400 font-semibold">
                                    {submission.marks}/{homework?.totalMarks}
                                  </p>
                                  <p className="text-gray-400 text-xs">Graded</p>
                                </div>
                              ) : (
                                <span className="px-3 py-1 text-sm rounded-full bg-yellow-500/20 text-yellow-400">
                                  Pending Review
                                </span>
                              )}
                              
                              <div className="flex space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30"
                                >
                                  <Eye size={14} />
                                </motion.button>
                                {submission.files.length > 0 && (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    className="p-2 bg-green-500/20 border border-green-500/30 rounded-lg hover:bg-green-500/30"
                                  >
                                    <Download size={14} />
                                  </motion.button>
                                )}
                                {submission.status !== 'graded' && (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30"
                                  >
                                    <Star size={14} />
                                  </motion.button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </GlowCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Create Homework Modal */}
          <AnimatePresence>
            {showCreateForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowCreateForm(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-black/90 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-blue-400">Create New Homework</h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowCreateForm(false)}
                      className="p-2 text-gray-400 hover:text-white"
                    >
                      <XCircle size={24} />
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Title *</label>
                      <input
                        type="text"
                        value={newHomework.title}
                        onChange={(e) => setNewHomework({ ...newHomework, title: e.target.value })}
                        placeholder="Enter homework title..."
                        className="w-full p-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Subject *</label>
                      <select
                        value={newHomework.subject}
                        onChange={(e) => setNewHomework({ ...newHomework, subject: e.target.value })}
                        className="w-full p-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                      >
                        <option value="">Select Subject</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="English">English</option>
                        <option value="History">History</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Description *</label>
                      <textarea
                        value={newHomework.description}
                        onChange={(e) => setNewHomework({ ...newHomework, description: e.target.value })}
                        placeholder="Enter detailed description and instructions..."
                        rows={4}
                        className="w-full p-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Due Date *</label>
                        <input
                          type="datetime-local"
                          value={newHomework.dueDate}
                          onChange={(e) => setNewHomework({ ...newHomework, dueDate: e.target.value })}
                          className="w-full p-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Total Marks</label>
                        <input
                          type="number"
                          value={newHomework.totalMarks || ''}
                          onChange={(e) => setNewHomework({ ...newHomework, totalMarks: parseInt(e.target.value) || 0 })}
                          placeholder="100"
                          min="0"
                          className="w-full p-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Priority</label>
                      <select
                        value={newHomework.priority}
                        onChange={(e) => setNewHomework({ ...newHomework, priority: e.target.value as any })}
                        className="w-full p-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>

                    <div className="flex space-x-4 pt-4">
                      <motion.button
                        onClick={createHomework}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-semibold"
                      >
                        <Save size={18} />
                        <span>Create Homework</span>
                      </motion.button>
                      
                      <motion.button
                        onClick={() => setShowCreateForm(false)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gray-600/20 border border-gray-600 rounded-lg hover:bg-gray-600/30"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default HomeworkSystem;