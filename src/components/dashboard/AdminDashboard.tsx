import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  Bell, 
  Clock,
  Settings,
  Shield,
  BarChart3,
  UserPlus,
  FileText,
  Activity,
  Target,
  Award,
  Plus,
  Edit,
  Eye,
  Trash2,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Send,
  Download,
  Upload
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'HEAD_TEACHER';
  status: 'active' | 'inactive';
  lastActive: string;
  joinedAt: string;
}

interface ClassSchedule {
  id: string;
  subject: string;
  teacher: string;
  className: string;
  time: string;
  students: number;
  status: 'scheduled' | 'active' | 'completed';
}

interface SystemMetrics {
  totalStudents: number;
  totalTeachers: number;
  activeClasses: number;
  totalAssignments: number;
  averageAttendance: number;
  systemUptime: string;
}

const AdminDashboard: React.FC = () => {
  // Premium animated background effect
  useEffect(() => {
    document.body.classList.add('premium-dashboard-bg');
    return () => document.body.classList.remove('premium-dashboard-bg');
  }, []);
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [notification, setNotification] = useState('');

  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah@acadmate.com',
      role: 'TEACHER',
      status: 'active',
      lastActive: '2 hours ago',
      joinedAt: '2023-09-01'
    },
    {
      id: '2',
      name: 'Alice Smith',
      email: 'alice@acadmate.com',
      role: 'STUDENT',
      status: 'active',
      lastActive: '1 hour ago',
      joinedAt: '2023-09-15'
    },
    {
      id: '3',
      name: 'Prof. Michael Chen',
      email: 'michael@acadmate.com',
      role: 'TEACHER',
      status: 'inactive',
      lastActive: '2 days ago',
      joinedAt: '2023-08-20'
    }
  ]);

  const [schedule] = useState<ClassSchedule[]>([
    {
      id: '1',
      subject: 'Physics',
      teacher: 'Dr. Sarah Johnson',
      className: 'Class 12-A',
      time: '10:00 AM - 11:00 AM',
      students: 25,
      status: 'active'
    },
    {
      id: '2',
      subject: 'Mathematics',
      teacher: 'Prof. Michael Chen',
      className: 'Class 11-B',
      time: '2:00 PM - 3:00 PM',
      students: 28,
      status: 'scheduled'
    }
  ]);

  const [metrics] = useState<SystemMetrics>({
    totalStudents: 450,
    totalTeachers: 25,
    activeClasses: 12,
    totalAssignments: 89,
    averageAttendance: 92.5,
    systemUptime: '99.9%'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const sendNotification = () => {
    if (notification.trim()) {
      // Simulate sending notification
      console.log('Sending notification:', notification);
      setNotification('');
      // Show success message
    }
  };

  // Animated background particles with admin theme
  const ParticleBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-red-400 to-orange-400 rounded-full opacity-20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
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

  // Admin-themed glowing card
  const GlowCard = ({ children, className = '', urgent = false, ...props }: any) => (
    <motion.div
      className={`relative bg-black/40 backdrop-blur-xl border ${
        urgent ? 'border-red-500/30 hover:border-red-400/60' : 'border-orange-500/30 hover:border-orange-400/60'
      } rounded-2xl p-6 transition-all duration-300 ${className}`}
      whileHover={{ 
        scale: 1.02,
        boxShadow: urgent 
          ? '0 0 30px rgba(239, 68, 68, 0.3)' 
          : '0 0 30px rgba(251, 146, 60, 0.3)'
      }}
      {...props}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${
        urgent ? 'from-red-500/10 to-orange-500/10' : 'from-orange-500/10 to-yellow-500/10'
      } rounded-2xl`} />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* 3D/CGI Spline Hero */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-2 z-10 w-full max-w-3xl pointer-events-none">
        <iframe
          src="https://prod.spline.design/6Q2QwQv7nQw6QwQw/scene.splinecode"
          title="3D CGI Dashboard Hero"
          frameBorder="0"
          width="100%"
          height="260"
          style={{ borderRadius: '2rem', boxShadow: '0 0 80px #00fff7', background: 'transparent', filter: 'drop-shadow(0 0 40px #00fff7) blur(0.5px)' }}
          allowFullScreen
        />
      </div>
      {/* Animated Neon Gradient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none animate-gradient-x bg-gradient-to-br from-cyan-900/60 via-purple-900/60 to-black/80 opacity-80" />
      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none backdrop-blur-2xl" />
      <ParticleBackground />
      {/* All dashboard content above overlays */}
      <div className="relative z-20">
      
        {/* Hero Section and all dashboard content */}
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
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                  Admin Control Center 🛡️
                </h1>
                <p className="text-gray-400 mt-2">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} • {user?.name || 'Administrator'}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center space-x-4"
              >
                <div className="bg-black/50 backdrop-blur-xl border border-orange-500/30 rounded-xl px-4 py-2">
                  <div className="text-orange-400 font-mono text-lg">
                    {currentTime.toLocaleTimeString()}
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl"
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
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl font-semibold text-sm"
                >
                <Shield size={16} />
                <span>Emergency Mode</span>
              </motion.button>
            </motion.div>
          </div>

          {/* System Status Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-12"
          >
            <GlowCard>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Students</p>
                  <p className="text-3xl font-bold text-orange-400">{metrics.totalStudents}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                  <Users size={24} />
                </div>
              </div>
            </GlowCard>

            <GlowCard>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Teachers</p>
                  <p className="text-3xl font-bold text-cyan-400">{metrics.totalTeachers}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                  <BookOpen size={24} />
                </div>
              </div>
            </GlowCard>

            <GlowCard>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Classes</p>
                  <p className="text-3xl font-bold text-green-400">{metrics.activeClasses}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
                  <Activity size={24} />
                </div>
              </div>
            </GlowCard>

            <GlowCard>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Assignments</p>
                  <p className="text-3xl font-bold text-yellow-400">{metrics.totalAssignments}</p>
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
                  <p className="text-3xl font-bold text-purple-400">{metrics.averageAttendance}%</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Target size={24} />
                </div>
              </div>
            </GlowCard>

            <GlowCard>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">System Uptime</p>
                  <p className="text-3xl font-bold text-green-400">{metrics.systemUptime}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <CheckCircle size={24} />
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
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'classes', label: 'Class Scheduling', icon: Calendar },
              { id: 'notifications', label: 'Notifications', icon: Send },
              { id: 'analytics', label: 'Analytics', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={18} />
                <span className="text-sm">{tab.label}</span>
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
                {/* System Health */}
                <div className="lg:col-span-2">
                  <GlowCard>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-orange-400">System Health Monitor</h3>
                      <Activity className="text-gray-400" size={20} />
                    </div>

                    <div className="space-y-4">
                      {[
                        { metric: 'Server Load', value: '23%', status: 'good', color: 'green' },
                        { metric: 'Database Performance', value: '95%', status: 'excellent', color: 'green' },
                        { metric: 'Memory Usage', value: '67%', status: 'warning', color: 'yellow' },
                        { metric: 'Network Latency', value: '12ms', status: 'good', color: 'green' },
                        { metric: 'Active Connections', value: '1,247', status: 'good', color: 'green' }
                      ].map((item, index) => (
                        <motion.div
                          key={item.metric}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className={`p-4 rounded-xl border-l-4 ${
                            item.color === 'green' ? 'border-l-green-400 bg-green-500/10' :
                            item.color === 'yellow' ? 'border-l-yellow-400 bg-yellow-500/10' :
                            'border-l-red-400 bg-red-500/10'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-semibold text-white">{item.metric}</h4>
                              <p className="text-gray-400 text-sm">Status: {item.status}</p>
                            </div>
                            <div className={`text-2xl font-bold ${
                              item.color === 'green' ? 'text-green-400' :
                              item.color === 'yellow' ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {item.value}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </GlowCard>
                </div>

                {/* Quick Actions & Alerts */}
                <div className="space-y-6">
                  <GlowCard urgent>
                    <h3 className="text-lg font-bold text-red-400 mb-4">System Alerts</h3>
                    <div className="space-y-4">
                      {[
                        { alert: 'High memory usage detected', level: 'warning', time: '5 min ago' },
                        { alert: '3 failed login attempts', level: 'security', time: '1 hour ago' },
                        { alert: 'Database backup completed', level: 'info', time: '2 hours ago' }
                      ].map((alert, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-center space-x-3 p-3 rounded-lg bg-black/30"
                        >
                          <div className={`p-2 rounded-full ${
                            alert.level === 'warning' ? 'bg-yellow-500/20' :
                            alert.level === 'security' ? 'bg-red-500/20' : 'bg-blue-500/20'
                          }`}>
                            {alert.level === 'warning' ? <AlertTriangle className="text-yellow-400" size={16} /> :
                             alert.level === 'security' ? <Shield className="text-red-400" size={16} /> :
                             <CheckCircle className="text-blue-400" size={16} />}
                          </div>
                          <div className="flex-1">
                            <p className="text-white text-sm">{alert.alert}</p>
                            <p className="text-gray-400 text-xs">{alert.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </GlowCard>

                  {/* Admin Quick Actions */}
                  <GlowCard>
                    <h3 className="text-lg font-bold text-orange-400 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      {[
                        { icon: UserPlus, label: 'Add New User', color: 'green' },
                        { icon: Calendar, label: 'Schedule Class', color: 'blue' },
                        { icon: Send, label: 'Send Notification', color: 'purple' },
                        { icon: Download, label: 'Export Reports', color: 'orange' },
                        { icon: Settings, label: 'System Settings', color: 'gray' }
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

            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlowCard>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-orange-400">User Management</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl"
                    >
                      <UserPlus size={16} />
                      <span>Add User</span>
                    </motion.button>
                  </div>

                  <div className="space-y-4">
                    {users.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-center justify-between p-4 bg-black/40 border border-gray-700 rounded-xl hover:border-orange-500/50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                            user.role === 'TEACHER' ? 'bg-gradient-to-br from-purple-500 to-pink-500' :
                            user.role === 'STUDENT' ? 'bg-gradient-to-br from-cyan-500 to-blue-500' :
                            'bg-gradient-to-br from-orange-500 to-red-500'
                          }`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{user.name}</h4>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                user.role === 'TEACHER' ? 'bg-purple-500/20 text-purple-400' :
                                user.role === 'STUDENT' ? 'bg-cyan-500/20 text-cyan-400' :
                                'bg-orange-500/20 text-orange-400'
                              }`}>
                                {user.role}
                              </span>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                              }`}>
                                {user.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-gray-400 text-sm">Last active: {user.lastActive}</p>
                            <p className="text-gray-500 text-xs">Joined: {user.joinedAt}</p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="p-2 bg-orange-500/20 border border-orange-500/30 rounded-lg hover:bg-orange-500/30"
                            >
                              <Eye size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="p-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30"
                            >
                              <Edit size={16} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlowCard>
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
                    <h3 className="text-xl font-bold text-orange-400">Class Scheduling</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl"
                    >
                      <Plus size={16} />
                      <span>Schedule New Class</span>
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {schedule.map((session, index) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        className="p-6 bg-black/40 border border-gray-700 rounded-xl hover:border-orange-500/50"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-white text-lg">{session.subject}</h4>
                            <p className="text-gray-300">{session.className}</p>
                            <p className="text-gray-400 text-sm">{session.teacher}</p>
                          </div>
                          <span className={`px-3 py-1 text-sm rounded-full ${
                            session.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            session.status === 'scheduled' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {session.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-300 text-sm">
                            <Clock size={14} className="mr-2" />
                            {session.time}
                          </div>
                          <div className="flex items-center text-gray-300 text-sm">
                            <Users size={14} className="mr-2" />
                            {session.students} students enrolled
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="flex-1 py-2 bg-orange-500/20 border border-orange-500/30 rounded-lg hover:bg-orange-500/30 text-sm"
                          >
                            <Eye size={14} className="inline mr-1" />
                            View Details
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="flex-1 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 text-sm"
                          >
                            <Edit size={14} className="inline mr-1" />
                            Modify
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlowCard>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlowCard>
                  <h3 className="text-xl font-bold text-orange-400 mb-6">System-wide Notifications</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Send Notification */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Send New Notification</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-gray-300 text-sm mb-2">Message</label>
                          <textarea
                            value={notification}
                            onChange={(e) => setNotification(e.target.value)}
                            placeholder="Enter your notification message..."
                            className="w-full p-3 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none h-32"
                          />
                        </div>
                        
                        <div className="flex space-x-4">
                          <select className="flex-1 p-3 bg-black/50 border border-gray-600 rounded-lg text-white">
                            <option value="all">All Users</option>
                            <option value="students">Students Only</option>
                            <option value="teachers">Teachers Only</option>
                            <option value="admins">Admins Only</option>
                          </select>
                          
                          <select className="flex-1 p-3 bg-black/50 border border-gray-600 rounded-lg text-white">
                            <option value="info">Info</option>
                            <option value="warning">Warning</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>

                        <motion.button
                          onClick={sendNotification}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg font-semibold flex items-center justify-center space-x-2"
                        >
                          <Send size={18} />
                          <span>Send Notification</span>
                        </motion.button>
                      </div>
                    </div>

                    {/* Recent Notifications */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-4">Recent Notifications</h4>
                      <div className="space-y-3">
                        {[
                          { message: 'System maintenance scheduled for tomorrow', time: '1 hour ago', type: 'warning' },
                          { message: 'New semester registration open', time: '3 hours ago', type: 'info' },
                          { message: 'Security update completed', time: '1 day ago', type: 'info' },
                          { message: 'Emergency: Server migration tonight', time: '2 days ago', type: 'urgent' }
                        ].map((notif, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                            className="p-3 bg-black/30 rounded-lg border border-gray-700"
                          >
                            <div className="flex items-start space-x-3">
                              <div className={`p-1 rounded-full ${
                                notif.type === 'urgent' ? 'bg-red-500/20' :
                                notif.type === 'warning' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                              }`}>
                                {notif.type === 'urgent' ? <AlertTriangle className="text-red-400" size={14} /> :
                                 notif.type === 'warning' ? <AlertTriangle className="text-yellow-400" size={14} /> :
                                 <Bell className="text-blue-400" size={14} />}
                              </div>
                              <div className="flex-1">
                                <p className="text-white text-sm">{notif.message}</p>
                                <p className="text-gray-400 text-xs">{notif.time}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlowCard>
                  <h3 className="text-xl font-bold text-orange-400 mb-6">System Analytics</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-black/30 rounded-xl">
                      <h4 className="text-lg font-semibold text-white mb-4">User Activity</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Daily Active Users</span>
                          <span className="text-cyan-400 font-bold">1,247</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Weekly Growth</span>
                          <span className="text-green-400 font-bold">+12%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Retention Rate</span>
                          <span className="text-purple-400 font-bold">89%</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-black/30 rounded-xl">
                      <h4 className="text-lg font-semibold text-white mb-4">Performance Metrics</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Avg Response Time</span>
                          <span className="text-green-400 font-bold">145ms</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Error Rate</span>
                          <span className="text-red-400 font-bold">0.03%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Success Rate</span>
                          <span className="text-green-400 font-bold">99.97%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlowCard>
                  <h3 className="text-xl font-bold text-orange-400 mb-6">System Settings</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">Security Settings</h4>
                        <div className="space-y-4">
                          {[
                            { setting: 'Two-Factor Authentication', enabled: true },
                            { setting: 'Password Complexity', enabled: true },
                            { setting: 'Session Timeout (30 min)', enabled: true },
                            { setting: 'Login Attempt Limit', enabled: true }
                          ].map((item, index) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                              <span className="text-white">{item.setting}</span>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                className={`w-12 h-6 rounded-full ${
                                  item.enabled ? 'bg-green-500' : 'bg-gray-600'
                                } relative`}
                              >
                                <motion.div
                                  className="w-4 h-4 bg-white rounded-full absolute top-1"
                                  animate={{ x: item.enabled ? 26 : 2 }}
                                />
                              </motion.button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">System Configuration</h4>
                        <div className="space-y-4">
                          <div className="p-3 bg-black/30 rounded-lg">
                            <label className="block text-gray-300 text-sm mb-2">Max File Upload Size</label>
                            <select className="w-full p-2 bg-black/50 border border-gray-600 rounded text-white">
                              <option>10 MB</option>
                              <option>25 MB</option>
                              <option>50 MB</option>
                              <option>100 MB</option>
                            </select>
                          </div>
                          
                          <div className="p-3 bg-black/30 rounded-lg">
                            <label className="block text-gray-300 text-sm mb-2">Backup Frequency</label>
                            <select className="w-full p-2 bg-black/50 border border-gray-600 rounded text-white">
                              <option>Daily</option>
                              <option>Weekly</option>
                              <option>Monthly</option>
                            </select>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="w-full py-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg font-semibold"
                          >
                            Save Settings
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
          </div>
        </div>
  );
}

export default AdminDashboard;