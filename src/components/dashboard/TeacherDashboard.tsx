import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Bell, 
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  Target,
  Award,
  Plus,
  Edit,
  Eye,
  BarChart3,
  MessageSquare,
  Video
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Student {
  id: string;
  name: string;
  grade: string;
  attendance: number;
  lastActivity: string;
  avatar?: string;
}

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  submissions: number;
  totalStudents: number;
  status: 'active' | 'closed' | 'graded';
}

interface ClassSession {
  id: string;
  subject: string;
  className: string;
  time: string;
  students: number;
  status: 'upcoming' | 'live' | 'completed';
  attendance?: number;
}

const TeacherDashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');

  const [students] = useState<Student[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      grade: 'A+',
      attendance: 95,
      lastActivity: '2 hours ago'
    },
    {
      id: '2',
      name: 'Bob Smith',
      grade: 'B+',
      attendance: 88,
      lastActivity: '1 day ago'
    },
    {
      id: '3',
      name: 'Carol Davis',
      grade: 'A',
      attendance: 92,
      lastActivity: '3 hours ago'
    }
  ]);

  const [assignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Physics Chapter 5 Problems',
      subject: 'Physics',
      dueDate: '2024-01-20',
      submissions: 18,
      totalStudents: 25,
      status: 'active'
    },
    {
      id: '2',
      title: 'Mathematics Calculus Test',
      subject: 'Mathematics',
      dueDate: '2024-01-15',
      submissions: 22,
      totalStudents: 25,
      status: 'graded'
    }
  ]);

  const [schedule] = useState<ClassSession[]>([
    {
      id: '1',
      subject: 'Physics',
      className: 'Class 12-A',
      time: '10:00 AM - 11:00 AM',
      students: 25,
      status: 'upcoming',
      attendance: 23
    },
    {
      id: '2',
      subject: 'Mathematics',
      className: 'Class 11-B',
      time: '2:00 PM - 3:00 PM',
      students: 28,
      status: 'live',
      attendance: 26
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Animated background particles
  const ParticleBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 25 + 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );

  // Glowing card component
  const GlowCard = ({ children, className = '', ...props }: any) => (
    <motion.div
      className={`relative bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 
                  hover:border-purple-400/60 transition-all duration-300 ${className}`}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 0 30px rgba(147, 51, 234, 0.3)'
      }}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ParticleBackground />
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 pt-8 pb-12"
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Welcome, {user?.name || 'Professor'} 👨‍🏫
              </h1>
              <p className="text-gray-400 mt-2">
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-4"
            >
              <div className="bg-black/50 backdrop-blur-xl border border-purple-500/30 rounded-xl px-4 py-2">
                <div className="text-purple-400 font-mono text-lg">
                  {currentTime.toLocaleTimeString()}
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl"
              >
                <Bell size={20} />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl font-semibold text-sm"
              >
                Start Class
              </motion.button>
            </motion.div>
          </div>

          {/* Quick Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            <GlowCard>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Students</p>
                  <p className="text-3xl font-bold text-purple-400">248</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Users size={24} />
                </div>
              </div>
            </GlowCard>

            <GlowCard>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Classes</p>
                  <p className="text-3xl font-bold text-cyan-400">12</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                  <BookOpen size={24} />
                </div>
              </div>
            </GlowCard>

            <GlowCard>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Assignments</p>
                  <p className="text-3xl font-bold text-yellow-400">18</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                  <FileText size={24} />
                </div>
              </div>
            </GlowCard>

            <GlowCard>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Avg Attendance</p>
                  <p className="text-3xl font-bold text-green-400">91%</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
                  <Target size={24} />
                </div>
              </div>
            </GlowCard>
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex space-x-1 bg-black/20 p-1 rounded-2xl mb-8 backdrop-blur-xl border border-gray-700"
          >
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'classes', label: 'Classes', icon: Calendar },
              { id: 'students', label: 'Students', icon: Users },
              { id: 'assignments', label: 'Assignments', icon: FileText }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
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
                {/* Today's Schedule */}
                <div className="lg:col-span-2">
                  <GlowCard>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-purple-400">Today's Classes</h3>
                      <Calendar className="text-gray-400" size={20} />
                    </div>

                    <div className="space-y-4">
                      {schedule.map((session, index) => (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className={`p-4 rounded-xl border-l-4 ${
                            session.status === 'live' 
                              ? 'border-l-green-400 bg-green-500/10' 
                              : session.status === 'upcoming'
                              ? 'border-l-purple-400 bg-purple-500/10'
                              : 'border-l-gray-400 bg-gray-500/10'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold text-white">{session.subject}</h4>
                              <p className="text-gray-400 text-sm">{session.className}</p>
                              <p className="text-gray-300 text-sm">{session.time}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-white text-sm">{session.students} students</p>
                              {session.attendance && (
                                <p className="text-green-400 text-sm">
                                  {session.attendance}/{session.students} present
                                </p>
                              )}
                              {session.status === 'live' && (
                                <motion.div
                                  animate={{ opacity: [1, 0.5, 1] }}
                                  transition={{ repeat: Infinity, duration: 1.5 }}
                                  className="flex items-center justify-end space-x-1 text-green-400 mt-1"
                                >
                                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                                  <span className="text-xs font-medium">LIVE</span>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mt-6 flex space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl"
                      >
                        <Video size={16} />
                        <span>Join Live Class</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-xl hover:bg-purple-500/30"
                      >
                        <Plus size={16} />
                        <span>Schedule Class</span>
                      </motion.button>
                    </div>
                  </GlowCard>
                </div>

                {/* Recent Activity */}
                <div className="space-y-6">
                  <GlowCard>
                    <h3 className="text-lg font-bold text-cyan-400 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {[
                        { action: 'Assignment submitted', student: 'Alice Johnson', time: '2 min ago', type: 'success' },
                        { action: 'Late submission', student: 'Bob Smith', time: '1 hour ago', type: 'warning' },
                        { action: 'Question asked', student: 'Carol Davis', time: '3 hours ago', type: 'info' }
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
                             <MessageSquare className="text-blue-400" size={16} />}
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm">{activity.action}</p>
                            <p className="text-gray-400 text-xs">{activity.student} • {activity.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </GlowCard>

                  {/* Quick Actions */}
                  <GlowCard>
                    <h3 className="text-lg font-bold text-purple-400 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      {[
                        { icon: Plus, label: 'Create Assignment', color: 'green' },
                        { icon: Users, label: 'Take Attendance', color: 'blue' },
                        { icon: BarChart3, label: 'View Analytics', color: 'purple' },
                        { icon: MessageSquare, label: 'Send Message', color: 'pink' }
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
                </div>
              </motion.div>
            )}

            {activeTab === 'classes' && (
              <motion.div
                key="classes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlowCard>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-purple-400">All Classes</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl"
                    >
                      <Plus size={16} />
                      <span>New Class</span>
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {schedule.map((session, index) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className="p-6 bg-black/40 border border-gray-700 rounded-xl hover:border-purple-500/50"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="font-bold text-white">{session.subject}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            session.status === 'live' ? 'bg-green-500/20 text-green-400' :
                            session.status === 'upcoming' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {session.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <p className="text-gray-300">{session.className}</p>
                          <p className="text-gray-400 text-sm">{session.time}</p>
                          <p className="text-gray-400 text-sm">{session.students} students enrolled</p>
                        </div>

                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="flex-1 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 text-sm"
                          >
                            <Eye size={14} className="inline mr-1" />
                            View
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            className="flex-1 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 text-sm"
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

            {activeTab === 'students' && (
              <motion.div
                key="students"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlowCard>
                  <h3 className="text-xl font-bold text-purple-400 mb-6">Student Performance</h3>
                  
                  <div className="space-y-4">
                    {students.map((student, index) => (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between p-4 bg-black/40 border border-gray-700 rounded-xl hover:border-purple-500/50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{student.name}</h4>
                            <p className="text-gray-400 text-sm">Last active: {student.lastActivity}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-6">
                          <div className="text-right">
                            <p className="text-white font-semibold">Grade: {student.grade}</p>
                            <p className="text-gray-400 text-sm">Attendance: {student.attendance}%</p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="p-2 bg-purple-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30"
                            >
                              <Eye size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="p-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30"
                            >
                              <MessageSquare size={16} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlowCard>
              </motion.div>
            )}

            {activeTab === 'assignments' && (
              <motion.div
                key="assignments"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlowCard>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-purple-400">Assignments</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl"
                    >
                      <Plus size={16} />
                      <span>Create Assignment</span>
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    {assignments.map((assignment, index) => (
                      <motion.div
                        key={assignment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-6 bg-black/40 border border-gray-700 rounded-xl hover:border-purple-500/50"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-white mb-1">{assignment.title}</h4>
                            <p className="text-gray-400">{assignment.subject}</p>
                          </div>
                          <span className={`px-3 py-1 text-sm rounded-full ${
                            assignment.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            assignment.status === 'graded' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {assignment.status.toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <Clock className="text-gray-400" size={16} />
                            <span className="text-gray-300 text-sm">
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Users className="text-gray-400" size={16} />
                            <span className="text-gray-300 text-sm">
                              {assignment.submissions}/{assignment.totalStudents} submitted
                            </span>
                          </div>
                          
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                              transition={{ delay: 0.5, duration: 1 }}
                              className="h-2 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full"
                            />
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 text-sm"
                          >
                            View Submissions
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 text-sm"
                          >
                            Grade Assignment
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlowCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default TeacherDashboard;