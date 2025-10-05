import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, Send, Users, User, Calendar, BookOpen, AlertTriangle, Info,
  CheckCircle, X, Plus, Edit, Trash2, Search, Filter, Eye, EyeOff,
  Clock, Target, Zap, MessageSquare, Settings, Volume2
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'urgent';
  recipients: 'all' | 'students' | 'teachers' | 'specific';
  recipientIds?: string[];
  scheduledFor?: string;
  status: 'draft' | 'scheduled' | 'sent';
  createdAt: string;
  readBy: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'HEAD_TEACHER';
  avatar?: string;
}

const NotificationSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('send');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  
  const [users] = useState<User[]>([
    { id: '1', name: 'Dr. Sarah Johnson', email: 'sarah@acadmate.com', role: 'TEACHER' },
    { id: '2', name: 'Alice Smith', email: 'alice@acadmate.com', role: 'STUDENT' },
    { id: '3', name: 'Bob Wilson', email: 'bob@acadmate.com', role: 'STUDENT' },
    { id: '4', name: 'Prof. Mike Chen', email: 'mike@acadmate.com', role: 'TEACHER' }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Class Schedule Update',
      message: 'Physics class has been rescheduled to 2:00 PM today.',
      type: 'info',
      recipients: 'students',
      status: 'sent',
      createdAt: '2024-01-15T10:30:00Z',
      readBy: ['2', '3'],
      priority: 'medium'
    },
    {
      id: '2',
      title: 'Exam Results Published',
      message: 'Mid-term examination results are now available on your dashboard.',
      type: 'success',
      recipients: 'all',
      status: 'sent',
      createdAt: '2024-01-15T09:15:00Z',
      readBy: ['1', '2'],
      priority: 'high'
    },
    {
      id: '3',
      title: 'Emergency: Campus Closure',
      message: 'Due to severe weather conditions, the campus will be closed today.',
      type: 'urgent',
      recipients: 'all',
      status: 'sent',
      createdAt: '2024-01-15T07:00:00Z',
      readBy: ['1', '2', '3', '4'],
      priority: 'urgent'
    }
  ]);

  const [newNotification, setNewNotification] = useState<Partial<Notification>>({
    title: '',
    message: '',
    type: 'info',
    recipients: 'all',
    priority: 'medium',
    scheduledFor: ''
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

  const createNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      toast.error('Please fill in title and message!', {
        style: { background: '#0a0a0a', color: '#ff4444', border: '1px solid #ff4444' }
      });
      return;
    }

    const notification: Notification = {
      id: Date.now().toString(),
      title: newNotification.title!,
      message: newNotification.message!,
      type: newNotification.type || 'info',
      recipients: newNotification.recipients || 'all',
      recipientIds: newNotification.recipientIds,
      scheduledFor: newNotification.scheduledFor,
      status: newNotification.scheduledFor ? 'scheduled' : 'sent',
      createdAt: new Date().toISOString(),
      readBy: [],
      priority: newNotification.priority || 'medium'
    };

    setNotifications(prev => [notification, ...prev]);
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      recipients: 'all',
      priority: 'medium',
      scheduledFor: ''
    });
    setShowCreateModal(false);
    
    toast.success('🎉 Notification created successfully!', {
      style: { background: '#0a0a0a', color: '#00ffff', border: '1px solid #00ffff' }
    });
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notification deleted successfully!', {
      style: { background: '#0a0a0a', color: '#00ffff', border: '1px solid #00ffff' }
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'success': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'info': return Info;
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'urgent': return Zap;
      default: return Info;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-gray-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'urgent': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || notification.type === filterType || notification.status === filterType;
    return matchesSearch && matchesFilter;
  });

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
                <Bell className="w-10 h-10 mr-4 text-cyan-400" />
                Notification Center 📢
              </h1>
              <p className="text-gray-400 mt-2">Advanced messaging and alert system</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex space-x-4">
              <motion.button
                onClick={() => setShowCreateModal(true)}
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl font-semibold"
              >
                <Plus size={18} />
                <span>New Notification</span>
              </motion.button>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Sent</p>
                  <p className="text-2xl font-bold text-cyan-400">{notifications.filter(n => n.status === 'sent').length}</p>
                </div>
                <Send className="text-cyan-400" size={24} />
              </div>
            </GlowCard>
            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Scheduled</p>
                  <p className="text-2xl font-bold text-yellow-400">{notifications.filter(n => n.status === 'scheduled').length}</p>
                </div>
                <Clock className="text-yellow-400" size={24} />
              </div>
            </GlowCard>
            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Urgent Alerts</p>
                  <p className="text-2xl font-bold text-red-400">{notifications.filter(n => n.type === 'urgent').length}</p>
                </div>
                <Zap className="text-red-400" size={24} />
              </div>
            </GlowCard>
            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-purple-400">{users.length}</p>
                </div>
                <Users className="text-purple-400" size={24} />
              </div>
            </GlowCard>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border border-gray-700 rounded-xl focus:border-cyan-500/50 focus:outline-none text-white"
                />
              </div>
            </div>
            <div className="flex space-x-2">
              {['all', 'info', 'success', 'warning', 'urgent', 'sent', 'scheduled'].map((filter) => (
                <motion.button
                  key={filter}
                  onClick={() => setFilterType(filter)}
                  whileHover={{ scale: 1.05 }}
                  className={`px-4 py-2 rounded-lg capitalize transition-all duration-300 ${
                    filterType === filter ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {filter}
                </motion.button>
              ))}
            </div>
          </div>

          <GlowCard>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-cyan-400">Notification History</h3>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Filter size={16} />
                <span>{filteredNotifications.length} notifications</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {filteredNotifications.map((notification, index) => {
                const TypeIcon = getTypeIcon(notification.type);
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start justify-between p-4 bg-black/40 border border-gray-700 rounded-xl hover:border-cyan-500/30 transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`p-3 rounded-full border ${getTypeColor(notification.type)}`}>
                        <TypeIcon size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-white text-lg">{notification.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full border ${getTypeColor(notification.type)}`}>
                            {notification.type}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full border ${
                            notification.status === 'sent' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            notification.status === 'scheduled' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                            'bg-gray-500/20 text-gray-400 border-gray-500/30'
                          }`}>
                            {notification.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{notification.message}</p>
                        <div className="flex items-center space-x-6 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Users size={12} className="mr-1" />
                            Recipients: {notification.recipients}
                          </span>
                          <span className="flex items-center">
                            <Clock size={12} className="mr-1" />
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                          <span className="flex items-center">
                            <Eye size={12} className="mr-1" />
                            Read by: {notification.readBy.length}
                          </span>
                          <span className={`flex items-center ${getPriorityColor(notification.priority)}`}>
                            <Target size={12} className="mr-1" />
                            {notification.priority} priority
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <motion.button
                        onClick={() => setSelectedNotification(notification)}
                        whileHover={{ scale: 1.1 }}
                        className="p-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </motion.button>
                      <motion.button
                        onClick={() => deleteNotification(notification.id)}
                        whileHover={{ scale: 1.1 }}
                        className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
              
              {filteredNotifications.length === 0 && (
                <div className="text-center py-12">
                  <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No notifications found matching your criteria.</p>
                </div>
              )}
            </div>
          </GlowCard>
        </div>
      </motion.div>

      {/* Create Notification Modal */}
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
              className="bg-black/90 border border-cyan-500/30 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-cyan-400">Create New Notification</h3>
                <motion.button
                  onClick={() => setShowCreateModal(false)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg"
                >
                  <X size={16} />
                </motion.button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Type *</label>
                    <select
                      value={newNotification.type || 'info'}
                      onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg focus:border-cyan-500/50 focus:outline-none text-white"
                    >
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Priority *</label>
                    <select
                      value={newNotification.priority || 'medium'}
                      onChange={(e) => setNewNotification(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg focus:border-cyan-500/50 focus:outline-none text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Title *</label>
                  <input
                    type="text"
                    value={newNotification.title || ''}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg focus:border-cyan-500/50 focus:outline-none text-white"
                    placeholder="Enter notification title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Message *</label>
                  <textarea
                    value={newNotification.message || ''}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg focus:border-cyan-500/50 focus:outline-none text-white h-32 resize-none"
                    placeholder="Enter your message..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Recipients *</label>
                    <select
                      value={newNotification.recipients || 'all'}
                      onChange={(e) => setNewNotification(prev => ({ ...prev, recipients: e.target.value as any }))}
                      className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg focus:border-cyan-500/50 focus:outline-none text-white"
                    >
                      <option value="all">All Users</option>
                      <option value="students">Students Only</option>
                      <option value="teachers">Teachers Only</option>
                      <option value="specific">Specific Users</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Schedule For (Optional)</label>
                    <input
                      type="datetime-local"
                      value={newNotification.scheduledFor || ''}
                      onChange={(e) => setNewNotification(prev => ({ ...prev, scheduledFor: e.target.value }))}
                      className="w-full p-3 bg-black/40 border border-gray-700 rounded-lg focus:border-cyan-500/50 focus:outline-none text-white"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    onClick={createNotification}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold flex items-center justify-center space-x-2"
                  >
                    <Send size={18} />
                    <span>{newNotification.scheduledFor ? 'Schedule' : 'Send Now'}</span>
                  </motion.button>
                  <motion.button
                    onClick={() => setShowCreateModal(false)}
                    whileHover={{ scale: 1.02 }}
                    className="px-8 py-3 bg-gray-600/20 border border-gray-600/30 rounded-xl font-semibold"
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
  );
};

export default NotificationSystem;