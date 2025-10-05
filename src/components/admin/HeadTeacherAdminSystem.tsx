import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Calendar, Settings, Bell, BarChart3, UserPlus, Plus, Edit, Trash2, Eye,
  Save, X, Search, Filter, Download, Upload, Send, Clock, Target, Award,
  BookOpen, CheckCircle, AlertCircle, TrendingUp, Activity, Shield, MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'HEAD_TEACHER';
  status: 'active' | 'inactive';
  joinedAt: string;
  lastActive: string;
}

interface ClassSchedule {
  id: string;
  subject: string;
  teacher: string;
  className: string;
  time: string;
  room: string;
  students: number;
  status: 'scheduled' | 'active' | 'completed';
}

const HeadTeacherAdminSystem: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  const [users] = useState<User[]>([
    { id: '1', name: 'Dr. Sarah Johnson', email: 'sarah@acadmate.com', role: 'TEACHER', status: 'active', joinedAt: '2023-09-01', lastActive: '2 hours ago' },
    { id: '2', name: 'Alice Smith', email: 'alice@acadmate.com', role: 'STUDENT', status: 'active', joinedAt: '2023-09-15', lastActive: '1 hour ago' }
  ]);

  const [schedule] = useState<ClassSchedule[]>([
    { id: '1', subject: 'Physics', teacher: 'Dr. Sarah Johnson', className: 'Class 12-A', time: '10:00 AM', room: 'Room 301', students: 25, status: 'active' }
  ]);

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

  const sendNotification = () => {
    toast.success('📢 Notification sent to all users!', {
      style: { background: '#0a0a0a', color: '#00ffff', border: '1px solid #00ffff' }
    });
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
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
                <Shield className="w-10 h-10 mr-4 text-cyan-400" />
                Admin Control Center 🛡️
              </h1>
              <p className="text-gray-400 mt-2">Complete administrative control with real-time management</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex space-x-4">
              <motion.button
                onClick={sendNotification}
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold"
              >
                <Send size={18} />
                <span>Send Notification</span>
              </motion.button>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-cyan-400">{users.length}</p>
                </div>
                <Users className="text-cyan-400" size={24} />
              </div>
            </GlowCard>
            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Classes</p>
                  <p className="text-2xl font-bold text-purple-400">{schedule.filter(s => s.status === 'active').length}</p>
                </div>
                <BookOpen className="text-purple-400" size={24} />
              </div>
            </GlowCard>
            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">System Health</p>
                  <p className="text-2xl font-bold text-green-400">100%</p>
                </div>
                <Activity className="text-green-400" size={24} />
              </div>
            </GlowCard>
            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Notifications</p>
                  <p className="text-2xl font-bold text-yellow-400">12</p>
                </div>
                <Bell className="text-yellow-400" size={24} />
              </div>
            </GlowCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="flex flex-wrap gap-2 bg-black/20 p-1 rounded-2xl mb-8 backdrop-blur-xl border border-gray-700">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'classes', label: 'Class Scheduling', icon: Calendar },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'settings', label: 'System Settings', icon: Settings }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </motion.div>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <GlowCard>
                  <h3 className="text-xl font-bold text-cyan-400 mb-6">System Activity</h3>
                  <div className="space-y-4">
                    {[
                      { action: 'New user registered', user: 'Alice Johnson', time: '5 min ago', type: 'success' },
                      { action: 'Class scheduled', user: 'Dr. Sarah Johnson', time: '15 min ago', type: 'info' },
                      { action: 'System backup completed', user: 'System', time: '1 hour ago', type: 'success' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-black/30">
                        <div className={`p-2 rounded-full ${activity.type === 'success' ? 'bg-green-500/20' : 'bg-blue-500/20'}`}>
                          {activity.type === 'success' ? <CheckCircle className="text-green-400" size={16} /> : <Bell className="text-blue-400" size={16} />}
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm">{activity.action}</p>
                          <p className="text-gray-400 text-xs">{activity.user} • {activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlowCard>

                <GlowCard>
                  <h3 className="text-xl font-bold text-purple-400 mb-6">Quick Actions</h3>
                  <div className="space-y-3">
                    {[
                      { icon: UserPlus, label: 'Add New User', color: 'green' },
                      { icon: Calendar, label: 'Schedule Class', color: 'blue' },
                      { icon: Send, label: 'Send Notification', color: 'purple' },
                      { icon: Settings, label: 'System Settings', color: 'orange' }
                    ].map((action, index) => (
                      <motion.button
                        key={action.label}
                        whileHover={{ scale: 1.05, x: 10 }}
                        className={`w-full flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-${action.color}-500/20 to-${action.color}-600/20 border border-${action.color}-500/30 hover:border-${action.color}-400/60 transition-all duration-300`}
                      >
                        <action.icon className={`text-${action.color}-400`} size={18} />
                        <span className="text-white text-sm">{action.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </GlowCard>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <GlowCard>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-cyan-400">User Management</h3>
                    <motion.button whileHover={{ scale: 1.05 }} className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl">
                      <UserPlus size={16} />
                      <span>Add User</span>
                    </motion.button>
                  </div>
                  <div className="space-y-4">
                    {users.map((user, index) => (
                      <div key={user.id} className="flex items-center justify-between p-4 bg-black/40 border border-gray-700 rounded-xl">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-white">{user.name}</h4>
                            <p className="text-gray-400 text-sm">{user.email}</p>
                            <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'TEACHER' ? 'bg-purple-500/20 text-purple-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                              {user.role}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <motion.button whileHover={{ scale: 1.1 }} className="p-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">
                            <Eye size={16} />
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.1 }} className="p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                            <Edit size={16} />
                          </motion.button>
                        </div>
                      </div>
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

export default HeadTeacherAdminSystem;