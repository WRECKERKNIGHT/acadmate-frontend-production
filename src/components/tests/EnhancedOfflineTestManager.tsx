import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Award,
  MapPin,
  Settings,
  Play,
  Pause,
  Square,
  BarChart3,
  TrendingUp,
  Star,
  Clipboard,
  PenTool,
  Timer,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

interface OfflineTest {
  id: string;
  title: string;
  subject: string;
  batchType: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // in minutes
  totalMarks: number;
  venue: string;
  instructions: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdBy: {
    fullName: string;
    uid: string;
  };
  studentsCount: number;
  submissions: TestSubmission[];
  createdAt: string;
  syllabus?: string[];
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  questionPaper?: string;
  answerKey?: string;
  isPublished: boolean;
}

interface TestSubmission {
  id: string;
  student: {
    fullName: string;
    uid: string;
    rollNumber: string;
    batchType: string;
  };
  marksObtained: number | null;
  status: 'PENDING' | 'PRESENT' | 'ABSENT' | 'GRADED';
  submittedAt: string | null;
  gradedAt: string | null;
  gradedBy?: string;
  feedback?: string;
  subjectWiseMarks?: {
    [subject: string]: {
      obtained: number;
      total: number;
    };
  };
}

interface TestStats {
  totalTests: number;
  scheduledTests: number;
  completedTests: number;
  averageScore: number;
  pendingGrading: number;
  totalParticipants: number;
}

const EnhancedOfflineTestManager: React.FC = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState<OfflineTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'upcoming' | 'completed' | 'grading'>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMarkingModal, setShowMarkingModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState<OfflineTest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterBatch, setFilterBatch] = useState('all');

  // Sample comprehensive data - in real app, this would come from backend
  const [sampleTests] = useState<OfflineTest[]>([
    {
      id: '1',
      title: 'Physics Monthly Test - Unit 5',
      subject: 'Physics',
      batchType: 'NEET_12',
      scheduledDate: '2024-01-20',
      scheduledTime: '10:00',
      duration: 180,
      totalMarks: 100,
      venue: 'Hall A, Ground Floor',
      instructions: 'Bring calculator, pen, pencil. No mobile phones allowed.',
      status: 'SCHEDULED',
      createdBy: {
        fullName: 'Dr. Sarah Johnson',
        uid: 'TEACHER001'
      },
      studentsCount: 45,
      submissions: [],
      createdAt: '2024-01-15T10:00:00Z',
      syllabus: ['Thermodynamics', 'Kinetic Theory', 'Wave Optics'],
      difficulty: 'HARD',
      isPublished: true
    },
    {
      id: '2',
      title: 'Chemistry Organic Chemistry Test',
      subject: 'Chemistry',
      batchType: 'NEET_12',
      scheduledDate: '2024-01-15',
      scheduledTime: '14:00',
      duration: 120,
      totalMarks: 80,
      venue: 'Lab 2, First Floor',
      instructions: 'Periodic table will be provided. No electronic devices.',
      status: 'COMPLETED',
      createdBy: {
        fullName: 'Prof. Michael Chen',
        uid: 'TEACHER002'
      },
      studentsCount: 40,
      submissions: [
        {
          id: '1',
          student: {
            fullName: 'Alice Johnson',
            uid: 'STU001',
            rollNumber: '2023001',
            batchType: 'NEET_12'
          },
          marksObtained: 72,
          status: 'GRADED',
          submittedAt: '2024-01-15T16:00:00Z',
          gradedAt: '2024-01-16T10:00:00Z',
          gradedBy: 'Prof. Michael Chen',
          feedback: 'Good understanding of mechanisms. Work on nomenclature.',
          subjectWiseMarks: {
            'Organic Chemistry': { obtained: 72, total: 80 }
          }
        },
        {
          id: '2',
          student: {
            fullName: 'Bob Smith',
            uid: 'STU002',
            rollNumber: '2023002',
            batchType: 'NEET_12'
          },
          marksObtained: null,
          status: 'PRESENT',
          submittedAt: '2024-01-15T16:00:00Z',
          gradedAt: null
        }
      ],
      createdAt: '2024-01-12T09:00:00Z',
      syllabus: ['Alcohols', 'Phenols', 'Ethers', 'Carbonyl Compounds'],
      difficulty: 'MEDIUM',
      questionPaper: 'organic_chemistry_jan_2024.pdf',
      answerKey: 'organic_chemistry_answer_key.pdf',
      isPublished: true
    }
  ]);

  const [newTest, setNewTest] = useState({
    title: '',
    subject: '',
    batchType: '',
    scheduledDate: '',
    scheduledTime: '',
    duration: 120,
    totalMarks: 100,
    venue: '',
    instructions: '',
    syllabus: '',
    difficulty: 'MEDIUM' as 'EASY' | 'MEDIUM' | 'HARD'
  });

  useEffect(() => {
    // Initialize with sample data
    setTests(sampleTests);
  }, [sampleTests]);

  // Animated background particles
  const ParticleBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-20"
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
        urgent ? 'border-red-500/30 hover:border-red-400/60' : 'border-purple-500/30 hover:border-purple-400/60'
      } rounded-2xl p-6 transition-all duration-300 ${className}`}
      whileHover={{ 
        scale: 1.01,
        boxShadow: urgent 
          ? '0 0 30px rgba(239, 68, 68, 0.2)' 
          : '0 0 30px rgba(147, 51, 234, 0.2)'
      }}
      {...props}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${
        urgent ? 'from-red-500/10 to-orange-500/10' : 'from-purple-500/10 to-blue-500/10'
      } rounded-2xl`} />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );

  const getTestStats = (): TestStats => {
    return {
      totalTests: tests.length,
      scheduledTests: tests.filter(t => t.status === 'SCHEDULED').length,
      completedTests: tests.filter(t => t.status === 'COMPLETED').length,
      averageScore: tests.length > 0 ? 
        tests.filter(t => t.status === 'COMPLETED')
             .reduce((acc, test) => {
               const gradedSubmissions = test.submissions.filter(s => s.status === 'GRADED');
               const testAvg = gradedSubmissions.length > 0 ? 
                 gradedSubmissions.reduce((sum, s) => sum + (s.marksObtained || 0), 0) / gradedSubmissions.length : 0;
               return acc + testAvg;
             }, 0) / Math.max(tests.filter(t => t.status === 'COMPLETED').length, 1) : 0,
      pendingGrading: tests.reduce((acc, test) => acc + test.submissions.filter(s => s.status === 'PRESENT').length, 0),
      totalParticipants: tests.reduce((acc, test) => acc + test.studentsCount, 0)
    };
  };

  const stats = getTestStats();

  const createTest = async () => {
    if (!newTest.title || !newTest.subject || !newTest.scheduledDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Simulate API call
    const testData = {
      ...newTest,
      id: Date.now().toString(),
      status: 'SCHEDULED' as const,
      createdBy: {
        fullName: user?.name || 'Unknown Teacher',
        uid: user?.id || 'TEACHER001'
      },
      studentsCount: 0,
      submissions: [],
      createdAt: new Date().toISOString(),
      syllabus: newTest.syllabus.split(',').map(s => s.trim()).filter(Boolean),
      isPublished: false
    };

    setTests(prev => [...prev, testData]);
    
    toast.success('📋 Offline test scheduled successfully!', {
      style: {
        background: '#0a0a0a',
        color: '#a855f7',
        border: '1px solid #a855f7',
      }
    });

    setShowCreateModal(false);
    setNewTest({
      title: '',
      subject: '',
      batchType: '',
      scheduledDate: '',
      scheduledTime: '',
      duration: 120,
      totalMarks: 100,
      venue: '',
      instructions: '',
      syllabus: '',
      difficulty: 'MEDIUM'
    });
  };

  const updateTestStatus = (testId: string, newStatus: OfflineTest['status']) => {
    setTests(prev => prev.map(test => 
      test.id === testId ? { ...test, status: newStatus } : test
    ));
    
    const statusMessages = {
      'IN_PROGRESS': 'Test started successfully!',
      'COMPLETED': 'Test completed successfully!',
      'CANCELLED': 'Test cancelled successfully!'
    };
    
    toast.success(statusMessages[newStatus] || 'Test status updated!');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return <Calendar className="w-4 h-4" />;
      case 'IN_PROGRESS': return <Play className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED': return <X className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'IN_PROGRESS': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'COMPLETED': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'CANCELLED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-500/20 text-green-400';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400';
      case 'HARD': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         test.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'all' || test.subject === filterSubject;
    const matchesBatch = filterBatch === 'all' || test.batchType === filterBatch;
    
    if (activeTab === 'upcoming') return matchesSearch && matchesSubject && matchesBatch && test.status === 'SCHEDULED';
    if (activeTab === 'completed') return matchesSearch && matchesSubject && matchesBatch && test.status === 'COMPLETED';
    if (activeTab === 'grading') return matchesSearch && matchesSubject && matchesBatch && 
      test.status === 'COMPLETED' && test.submissions.some(s => s.status === 'PRESENT');
    
    return matchesSearch && matchesSubject && matchesBatch;
  });

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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent flex items-center">
                <Calendar className="w-10 h-10 mr-4 text-purple-400" />
                Offline Test Manager 📋
              </h1>
              <p className="text-gray-400 mt-2">
                Schedule, conduct, and grade offline tests with comprehensive marking system
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4"
            >
              <motion.button
                onClick={() => setShowCreateModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-semibold"
              >
                <Plus size={18} />
                <span>Schedule Test</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl font-semibold text-sm"
              >
                <Upload size={16} />
                <span>Bulk Upload</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 mb-8"
          >
            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs lg:text-sm">Total Tests</p>
                  <p className="text-xl lg:text-2xl font-bold text-purple-400">{stats.totalTests}</p>
                </div>
                <div className="p-2 lg:p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
                  <FileText size={16} />
                </div>
              </div>
            </GlowCard>

            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs lg:text-sm">Scheduled</p>
                  <p className="text-xl lg:text-2xl font-bold text-blue-400">{stats.scheduledTests}</p>
                </div>
                <div className="p-2 lg:p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                  <Calendar size={16} />
                </div>
              </div>
            </GlowCard>

            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs lg:text-sm">Completed</p>
                  <p className="text-xl lg:text-2xl font-bold text-green-400">{stats.completedTests}</p>
                </div>
                <div className="p-2 lg:p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
                  <CheckCircle size={16} />
                </div>
              </div>
            </GlowCard>

            <GlowCard className="p-4" urgent={stats.pendingGrading > 0}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs lg:text-sm">Pending Grading</p>
                  <p className="text-xl lg:text-2xl font-bold text-yellow-400">{stats.pendingGrading}</p>
                </div>
                <div className="p-2 lg:p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                  <PenTool size={16} />
                </div>
              </div>
            </GlowCard>

            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs lg:text-sm">Avg Score</p>
                  <p className="text-xl lg:text-2xl font-bold text-cyan-400">{Math.round(stats.averageScore)}%</p>
                </div>
                <div className="p-2 lg:p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                  <TrendingUp size={16} />
                </div>
              </div>
            </GlowCard>

            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs lg:text-sm">Participants</p>
                  <p className="text-xl lg:text-2xl font-bold text-pink-400">{stats.totalParticipants}</p>
                </div>
                <div className="p-2 lg:p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl">
                  <Users size={16} />
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
              { id: 'overview', label: 'Overview', icon: BarChart3, count: null },
              { id: 'upcoming', label: 'Upcoming', icon: Calendar, count: stats.scheduledTests },
              { id: 'completed', label: 'Completed', icon: CheckCircle, count: stats.completedTests },
              { id: 'grading', label: 'Grading', icon: PenTool, count: stats.pendingGrading }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-2 px-4 lg:px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={18} />
                <span className="text-sm lg:text-base">{tab.label}</span>
                {tab.count !== null && tab.count > 0 && (
                  <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                    {tab.count}
                  </span>
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Filters */}
          {activeTab !== 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-8"
            >
              <GlowCard>
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search tests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    
                    <select
                      value={filterSubject}
                      onChange={(e) => setFilterSubject(e.target.value)}
                      className="px-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="all">All Subjects</option>
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology</option>
                      <option value="Mathematics">Mathematics</option>
                    </select>

                    <select
                      value={filterBatch}
                      onChange={(e) => setFilterBatch(e.target.value)}
                      className="px-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                    >
                      <option value="all">All Batches</option>
                      <option value="NEET_12">NEET 12</option>
                      <option value="NEET_11">NEET 11</option>
                      <option value="PCM_12">PCM 12</option>
                      <option value="PCM_11">PCM 11</option>
                    </select>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          )}

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
                {/* Recent Tests */}
                <div className="lg:col-span-2">
                  <GlowCard>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-purple-400">Recent Tests</h3>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        View All
                      </motion.button>
                    </div>

                    <div className="space-y-4">
                      {tests.slice(0, 3).map((test, index) => (
                        <motion.div
                          key={test.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="p-4 rounded-xl border border-gray-600 bg-black/30 hover:border-purple-500/50 transition-all duration-300 cursor-pointer"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">{test.title}</h4>
                              <p className="text-gray-400 text-sm">{test.subject} • {test.batchType.replace('_', ' ')}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(test.status)}`}>
                                {getStatusIcon(test.status)}
                                <span className="ml-1">{test.status}</span>
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(test.difficulty)}`}>
                                {test.difficulty}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                              <span className="text-gray-400 flex items-center">
                                <Clock size={12} className="mr-1" />
                                {test.duration} min
                              </span>
                              <span className="text-gray-400 flex items-center">
                                <Target size={12} className="mr-1" />
                                {test.totalMarks} marks
                              </span>
                              <span className="text-gray-400 flex items-center">
                                <MapPin size={12} className="mr-1" />
                                {test.venue}
                              </span>
                            </div>
                            <span className="text-purple-400 font-semibold">
                              {new Date(test.scheduledDate).toLocaleDateString()}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </GlowCard>
                </div>

                {/* Quick Actions & Stats */}
                <div className="space-y-6">
                  <GlowCard>
                    <h3 className="text-lg font-bold text-blue-400 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      {[
                        { icon: Plus, label: 'Schedule New Test', color: 'purple' },
                        { icon: PenTool, label: 'Grade Submissions', color: 'yellow' },
                        { icon: Download, label: 'Export Reports', color: 'green' },
                        { icon: Bell, label: 'Send Notifications', color: 'blue' }
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
                    <h3 className="text-lg font-bold text-cyan-400 mb-4">Performance Overview</h3>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400 mb-2">{Math.round(stats.averageScore)}%</div>
                        <p className="text-gray-400">Average Test Score</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-black/30 rounded-xl text-center">
                          <div className="text-lg font-bold text-blue-400 mb-1">{stats.scheduledTests}</div>
                          <p className="text-gray-400 text-xs">Upcoming</p>
                        </div>
                        <div className="p-3 bg-black/30 rounded-xl text-center">
                          <div className="text-lg font-bold text-yellow-400 mb-1">{stats.pendingGrading}</div>
                          <p className="text-gray-400 text-xs">To Grade</p>
                        </div>
                      </div>
                    </div>
                  </GlowCard>
                </div>
              </motion.div>
            )}

            {(activeTab === 'upcoming' || activeTab === 'completed' || activeTab === 'grading') && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlowCard>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-purple-400 capitalize">{activeTab} Tests</h3>
                    <div className="text-sm text-gray-400">
                      {filteredTests.length} tests
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredTests.map((test, index) => (
                      <motion.div
                        key={test.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * index }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="p-6 rounded-xl border border-gray-700 bg-black/30 hover:border-purple-500/50 transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-white text-lg">{test.title}</h4>
                            <p className="text-gray-300">{test.subject}</p>
                            <p className="text-gray-400 text-sm">{test.createdBy.fullName}</p>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(test.status)}`}>
                              {getStatusIcon(test.status)}
                              <span className="ml-1">{test.status}</span>
                            </span>
                            
                            <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(test.difficulty)}`}>
                              {test.difficulty}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-300">
                              <Calendar size={14} className="mr-1" />
                              {new Date(test.scheduledDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-gray-300">
                              <Clock size={14} className="mr-1" />
                              {test.scheduledTime} ({test.duration}m)
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-300">
                              <MapPin size={14} className="mr-1" />
                              {test.venue}
                            </div>
                            <div className="flex items-center text-gray-300">
                              <Target size={14} className="mr-1" />
                              {test.totalMarks} marks
                            </div>
                          </div>

                          {test.submissions.length > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center text-gray-300">
                                <Users size={14} className="mr-1" />
                                {test.submissions.filter(s => s.status === 'GRADED').length}/{test.submissions.length} graded
                              </div>
                              {test.submissions.filter(s => s.status === 'GRADED').length > 0 && (
                                <div className="text-green-400">
                                  Avg: {Math.round(
                                    test.submissions
                                      .filter(s => s.status === 'GRADED')
                                      .reduce((sum, s) => sum + (s.marksObtained || 0), 0) /
                                    test.submissions.filter(s => s.status === 'GRADED').length
                                  )}%
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="flex-1 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 text-sm"
                          >
                            <Eye size={14} className="inline mr-1" />
                            View Details
                          </motion.button>
                          
                          {activeTab === 'upcoming' && test.status === 'SCHEDULED' && (
                            <motion.button
                              onClick={() => updateTestStatus(test.id, 'IN_PROGRESS')}
                              whileHover={{ scale: 1.05 }}
                              className="flex-1 py-2 bg-green-500/20 border border-green-500/30 rounded-lg hover:bg-green-500/30 text-sm"
                            >
                              <Play size={14} className="inline mr-1" />
                              Start Test
                            </motion.button>
                          )}
                          
                          {activeTab === 'grading' && (
                            <motion.button
                              onClick={() => {
                                setSelectedTest(test);
                                setShowMarkingModal(true);
                              }}
                              whileHover={{ scale: 1.05 }}
                              className="flex-1 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 text-sm"
                            >
                              <PenTool size={14} className="inline mr-1" />
                              Grade
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlowCard>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Create Test Modal */}
          <AnimatePresence>
            {showCreateModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setShowCreateModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-purple-400">Schedule New Offline Test</h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowCreateModal(false)}
                      className="p-2 text-gray-400 hover:text-white"
                    >
                      <X size={24} />
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Test Title *</label>
                        <input
                          type="text"
                          value={newTest.title}
                          onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                          placeholder="e.g., Physics Monthly Test - Unit 5"
                          className="w-full p-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Subject *</label>
                        <select
                          value={newTest.subject}
                          onChange={(e) => setNewTest({ ...newTest, subject: e.target.value })}
                          className="w-full p-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                        >
                          <option value="">Select Subject</option>
                          <option value="Physics">Physics</option>
                          <option value="Chemistry">Chemistry</option>
                          <option value="Biology">Biology</option>
                          <option value="Mathematics">Mathematics</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Batch Type *</label>
                        <select
                          value={newTest.batchType}
                          onChange={(e) => setNewTest({ ...newTest, batchType: e.target.value })}
                          className="w-full p-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                        >
                          <option value="">Select Batch</option>
                          <option value="NEET_12">NEET 12</option>
                          <option value="NEET_11">NEET 11</option>
                          <option value="PCM_12">PCM 12</option>
                          <option value="PCM_11">PCM 11</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 text-sm font-semibold mb-2">Date *</label>
                          <input
                            type="date"
                            value={newTest.scheduledDate}
                            onChange={(e) => setNewTest({ ...newTest, scheduledDate: e.target.value })}
                            className="w-full p-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-300 text-sm font-semibold mb-2">Time *</label>
                          <input
                            type="time"
                            value={newTest.scheduledTime}
                            onChange={(e) => setNewTest({ ...newTest, scheduledTime: e.target.value })}
                            className="w-full p-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 text-sm font-semibold mb-2">Duration (minutes)</label>
                          <input
                            type="number"
                            value={newTest.duration}
                            onChange={(e) => setNewTest({ ...newTest, duration: parseInt(e.target.value) || 120 })}
                            className="w-full p-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-300 text-sm font-semibold mb-2">Total Marks</label>
                          <input
                            type="number"
                            value={newTest.totalMarks}
                            onChange={(e) => setNewTest({ ...newTest, totalMarks: parseInt(e.target.value) || 100 })}
                            className="w-full p-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Venue</label>
                        <input
                          type="text"
                          value={newTest.venue}
                          onChange={(e) => setNewTest({ ...newTest, venue: e.target.value })}
                          placeholder="e.g., Hall A, Ground Floor"
                          className="w-full p-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Difficulty</label>
                        <select
                          value={newTest.difficulty}
                          onChange={(e) => setNewTest({ ...newTest, difficulty: e.target.value as any })}
                          className="w-full p-3 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                        >
                          <option value="EASY">Easy</option>
                          <option value="MEDIUM">Medium</option>
                          <option value="HARD">Hard</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Syllabus Topics</label>
                        <input
                          type="text"
                          value={newTest.syllabus}
                          onChange={(e) => setNewTest({ ...newTest, syllabus: e.target.value })}
                          placeholder="e.g., Thermodynamics, Kinetic Theory (comma separated)"
                          className="w-full p-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Instructions</label>
                    <textarea
                      value={newTest.instructions}
                      onChange={(e) => setNewTest({ ...newTest, instructions: e.target.value })}
                      placeholder="Enter test instructions for students..."
                      rows={3}
                      className="w-full p-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="flex space-x-4 mt-6">
                    <motion.button
                      onClick={createTest}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-semibold"
                    >
                      <Save size={18} />
                      <span>Schedule Test</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={() => setShowCreateModal(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-3 bg-gray-600/20 border border-gray-600 rounded-lg hover:bg-gray-600/30"
                    >
                      Cancel
                    </motion.button>
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

export default EnhancedOfflineTestManager;