import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Medal,
  Award,
  Star,
  Target,
  TrendingUp,
  Calendar,
  Users,
  Filter,
  Search,
  Crown,
  Zap,
  Fire,
  BarChart3,
  RefreshCw,
  Download,
  Eye,
  Activity,
  PieChart,
  LineChart,
  Percent,
  Clock,
  BookOpen,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

interface LeaderboardEntry {
  id: string;
  userId: string;
  user: {
    fullName: string;
    uid: string;
    email: string;
    batchType: string;
    avatar?: string;
  };
  rank: number;
  score: number;
  totalTests: number;
  averageScore: number;
  monthlyAverage: number;
  streak: number;
  badge: 'CHAMPION' | 'EXCELLENT' | 'GOOD' | 'IMPROVING' | 'BEGINNER';
  improvement: number;
  weakSubjects: string[];
  strongSubjects: string[];
  timeSpent: number; // in hours
  consistency: number; // percentage
  lastActive: string;
}

interface PerformanceMetrics {
  totalStudents: number;
  averagePerformance: number;
  topPerformerImprovement: number;
  monthlyTestsCompleted: number;
  avgTimePerTest: number;
  subjectWisePerformance: {
    [key: string]: {
      averageScore: number;
      totalTests: number;
      improvement: number;
    };
  };
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedBy: number;
  category: string;
}

const EnhancedLeaderboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'analytics' | 'achievements'>('leaderboard');
  const [viewMode, setViewMode] = useState<'monthly' | 'overall' | 'subject'>('monthly');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [timeRange, setTimeRange] = useState('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample comprehensive data - in real app, this would come from backend
  const [leaderboardData] = useState<LeaderboardEntry[]>([
    {
      id: '1',
      userId: 'user1',
      user: {
        fullName: 'Alice Johnson',
        uid: '2023001',
        email: 'alice@example.com',
        batchType: 'NEET_12',
        avatar: ''
      },
      rank: 1,
      score: 2850,
      totalTests: 45,
      averageScore: 92.5,
      monthlyAverage: 94.2,
      streak: 15,
      badge: 'CHAMPION',
      improvement: 12.5,
      weakSubjects: ['Organic Chemistry'],
      strongSubjects: ['Physics', 'Inorganic Chemistry'],
      timeSpent: 120,
      consistency: 95,
      lastActive: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      userId: 'user2',
      user: {
        fullName: 'Bob Smith',
        uid: '2023002',
        email: 'bob@example.com',
        batchType: 'PCM_12',
        avatar: ''
      },
      rank: 2,
      score: 2720,
      totalTests: 42,
      averageScore: 89.8,
      monthlyAverage: 91.0,
      streak: 12,
      badge: 'EXCELLENT',
      improvement: 8.3,
      weakSubjects: ['Mathematics'],
      strongSubjects: ['Physics', 'Chemistry'],
      timeSpent: 105,
      consistency: 88,
      lastActive: '2024-01-15T09:15:00Z'
    },
    {
      id: '3',
      userId: 'user3',
      user: {
        fullName: 'Carol Davis',
        uid: '2023003',
        email: 'carol@example.com',
        batchType: 'NEET_12',
        avatar: ''
      },
      rank: 3,
      score: 2650,
      totalTests: 40,
      averageScore: 87.2,
      monthlyAverage: 88.5,
      streak: 8,
      badge: 'EXCELLENT',
      improvement: 15.2,
      weakSubjects: ['Physics'],
      strongSubjects: ['Biology', 'Chemistry'],
      timeSpent: 98,
      consistency: 85,
      lastActive: '2024-01-15T08:45:00Z'
    },
    {
      id: '4',
      userId: 'user4',
      user: {
        fullName: 'David Wilson',
        uid: '2023004',
        email: 'david@example.com',
        batchType: 'PCM_11',
        avatar: ''
      },
      rank: 4,
      score: 2480,
      totalTests: 38,
      averageScore: 84.1,
      monthlyAverage: 86.3,
      streak: 6,
      badge: 'GOOD',
      improvement: 5.7,
      weakSubjects: ['Chemistry', 'Mathematics'],
      strongSubjects: ['Physics'],
      timeSpent: 85,
      consistency: 78,
      lastActive: '2024-01-15T07:20:00Z'
    },
    {
      id: '5',
      userId: 'user5',
      user: {
        fullName: 'Eva Martinez',
        uid: '2023005',
        email: 'eva@example.com',
        batchType: 'NEET_11',
        avatar: ''
      },
      rank: 5,
      score: 2350,
      totalTests: 35,
      averageScore: 81.5,
      monthlyAverage: 83.8,
      streak: 4,
      badge: 'GOOD',
      improvement: 18.9,
      weakSubjects: ['Physics', 'Chemistry'],
      strongSubjects: ['Biology'],
      timeSpent: 75,
      consistency: 82,
      lastActive: '2024-01-15T06:10:00Z'
    }
  ]);

  const [performanceMetrics] = useState<PerformanceMetrics>({
    totalStudents: 125,
    averagePerformance: 76.4,
    topPerformerImprovement: 12.5,
    monthlyTestsCompleted: 1847,
    avgTimePerTest: 28.5,
    subjectWisePerformance: {
      'Physics': { averageScore: 78.2, totalTests: 520, improvement: 8.4 },
      'Chemistry': { averageScore: 74.8, totalTests: 485, improvement: 6.2 },
      'Biology': { averageScore: 80.1, totalTests: 445, improvement: 9.8 },
      'Mathematics': { averageScore: 72.5, totalTests: 397, improvement: 5.1 }
    }
  });

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Perfect Score',
      description: 'Scored 100% in any test',
      icon: '🎯',
      rarity: 'rare',
      earnedBy: 8,
      category: 'Performance'
    },
    {
      id: '2',
      title: 'Consistency King',
      description: 'Maintained 90%+ accuracy for 10 consecutive tests',
      icon: '👑',
      rarity: 'epic',
      earnedBy: 3,
      category: 'Consistency'
    },
    {
      id: '3',
      title: 'Speed Demon',
      description: 'Complete test in under 20 minutes with 85%+ score',
      icon: '⚡',
      rarity: 'legendary',
      earnedBy: 1,
      category: 'Speed'
    },
    {
      id: '4',
      title: 'Subject Master',
      description: 'Average 95%+ in any subject over 15 tests',
      icon: '🏆',
      rarity: 'epic',
      earnedBy: 5,
      category: 'Mastery'
    }
  ]);

  // Animated background particles
  const ParticleBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-yellow-400 rounded-full opacity-20"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
          }}
          animate={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
          }}
          transition={{
            duration: Math.random() * 35 + 25,
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
      className={`relative bg-black/40 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-6 
                  hover:border-yellow-400/60 transition-all duration-300 ${className}`}
      whileHover={{ 
        scale: 1.01,
        boxShadow: '0 0 30px rgba(234, 179, 8, 0.2)'
      }}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2: return <Medal className="w-6 h-6 text-gray-400" />;
      case 3: return <Award className="w-6 h-6 text-orange-400" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-gray-400 font-bold">#{rank}</span>;
    }
  };

  const getBadgeInfo = (badge: string) => {
    switch (badge) {
      case 'CHAMPION': return { color: 'from-yellow-500 to-orange-500', icon: '👑', label: 'Champion' };
      case 'EXCELLENT': return { color: 'from-green-500 to-emerald-500', icon: '⭐', label: 'Excellent' };
      case 'GOOD': return { color: 'from-blue-500 to-cyan-500', icon: '👍', label: 'Good' };
      case 'IMPROVING': return { color: 'from-purple-500 to-pink-500', icon: '📈', label: 'Improving' };
      default: return { color: 'from-gray-500 to-gray-600', icon: '🔰', label: 'Beginner' };
    }
  };

  const getAchievementRarity = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-purple-500 to-pink-500';
      case 'epic': return 'from-blue-500 to-purple-500';
      case 'rare': return 'from-green-500 to-blue-500';
      default: return 'from-gray-500 to-green-500';
    }
  };

  const filteredData = leaderboardData.filter(entry =>
    (entry.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     entry.user.uid.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (selectedBatch === 'all' || entry.user.batchType === selectedBatch)
  );

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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent flex items-center">
                <Trophy className="w-10 h-10 mr-4 text-yellow-400" />
                Performance Leaderboard 🏆
              </h1>
              <p className="text-gray-400 mt-2">
                Track rankings, analyze performance, and celebrate achievements
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4"
            >
              <motion.button
                onClick={() => setLoading(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl font-semibold"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-semibold text-sm"
              >
                <Download size={16} />
                <span>Export Report</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Performance Overview Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 mb-8"
          >
            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs lg:text-sm">Total Students</p>
                  <p className="text-xl lg:text-2xl font-bold text-yellow-400">{performanceMetrics.totalStudents}</p>
                </div>
                <div className="p-2 lg:p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                  <Users size={16} />
                </div>
              </div>
            </GlowCard>

            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs lg:text-sm">Avg Performance</p>
                  <p className="text-xl lg:text-2xl font-bold text-green-400">{performanceMetrics.averagePerformance}%</p>
                </div>
                <div className="p-2 lg:p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
                  <TrendingUp size={16} />
                </div>
              </div>
            </GlowCard>

            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs lg:text-sm">Tests This Month</p>
                  <p className="text-xl lg:text-2xl font-bold text-blue-400">{performanceMetrics.monthlyTestsCompleted}</p>
                </div>
                <div className="p-2 lg:p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <BarChart3 size={16} />
                </div>
              </div>
            </GlowCard>

            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs lg:text-sm">Avg Time/Test</p>
                  <p className="text-xl lg:text-2xl font-bold text-cyan-400">{performanceMetrics.avgTimePerTest}m</p>
                </div>
                <div className="p-2 lg:p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                  <Clock size={16} />
                </div>
              </div>
            </GlowCard>

            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs lg:text-sm">Top Improvement</p>
                  <p className="text-xl lg:text-2xl font-bold text-purple-400">+{performanceMetrics.topPerformerImprovement}%</p>
                </div>
                <div className="p-2 lg:p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <TrendingUp size={16} />
                </div>
              </div>
            </GlowCard>

            <GlowCard className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs lg:text-sm">Active Now</p>
                  <p className="text-xl lg:text-2xl font-bold text-orange-400">47</p>
                </div>
                <div className="p-2 lg:p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                  <Activity size={16} />
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
              { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'achievements', label: 'Achievements', icon: Star }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-2 px-4 lg:px-8 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon size={18} />
                <span className="text-sm lg:text-base">{tab.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Filters for Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
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
                        placeholder="Search students..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none"
                      />
                    </div>
                    
                    <select
                      value={selectedBatch}
                      onChange={(e) => setSelectedBatch(e.target.value)}
                      className="px-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                    >
                      <option value="all">All Batches</option>
                      <option value="NEET_12">NEET 12</option>
                      <option value="NEET_11">NEET 11</option>
                      <option value="PCM_12">PCM 12</option>
                      <option value="PCM_11">PCM 11</option>
                    </select>

                    <select
                      value={viewMode}
                      onChange={(e) => setViewMode(e.target.value as any)}
                      className="px-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white focus:border-yellow-500 focus:outline-none"
                    >
                      <option value="monthly">Monthly Rankings</option>
                      <option value="overall">Overall Rankings</option>
                      <option value="subject">Subject-wise</option>
                    </select>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          )}

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Top 3 Podium */}
                {filteredData.length >= 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                  >
                    <GlowCard>
                      <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                        🏆 Hall of Fame - Top Performers
                      </h3>
                      
                      <div className="flex items-end justify-center space-x-4 lg:space-x-8">
                        {/* Second Place */}
                        <motion.div
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="text-center"
                        >
                          <div className="bg-gradient-to-t from-gray-600 to-gray-500 rounded-t-2xl p-4 lg:p-6 h-24 lg:h-32 flex flex-col justify-end relative">
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center border-4 border-white">
                                <Medal className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                              </div>
                            </div>
                            <span className="text-2xl lg:text-4xl font-bold text-white mt-4">2</span>
                          </div>
                          <div className="mt-4">
                            <p className="font-bold text-white text-sm lg:text-base">{filteredData[1]?.user.fullName}</p>
                            <p className="text-xs lg:text-sm text-gray-400">{filteredData[1]?.monthlyAverage}% avg</p>
                            <p className="text-xs text-gray-500">{filteredData[1]?.user.batchType?.replace('_', ' ')}</p>
                          </div>
                        </motion.div>

                        {/* First Place */}
                        <motion.div
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-center"
                        >
                          <div className="bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-2xl p-4 lg:p-6 h-32 lg:h-40 flex flex-col justify-end relative">
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                              <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center border-4 border-white animate-pulse">
                                <Crown className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                              </div>
                            </div>
                            <span className="text-3xl lg:text-5xl font-bold text-white mt-4">1</span>
                          </div>
                          <div className="mt-4">
                            <p className="font-bold text-white text-base lg:text-lg">{filteredData[0]?.user.fullName}</p>
                            <p className="text-sm text-yellow-400 font-semibold">{filteredData[0]?.monthlyAverage}% avg</p>
                            <p className="text-xs text-yellow-400">{filteredData[0]?.user.batchType?.replace('_', ' ')}</p>
                            <div className="flex items-center justify-center mt-2">
                              <Fire className="w-4 h-4 text-orange-400 mr-1" />
                              <span className="text-xs text-orange-400">{filteredData[0]?.streak} day streak</span>
                            </div>
                          </div>
                        </motion.div>

                        {/* Third Place */}
                        <motion.div
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-center"
                        >
                          <div className="bg-gradient-to-t from-orange-600 to-orange-500 rounded-t-2xl p-4 lg:p-6 h-20 lg:h-28 flex flex-col justify-end relative">
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                              <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center border-4 border-white">
                                <Award className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                              </div>
                            </div>
                            <span className="text-xl lg:text-3xl font-bold text-white mt-4">3</span>
                          </div>
                          <div className="mt-4">
                            <p className="font-bold text-white text-sm lg:text-base">{filteredData[2]?.user.fullName}</p>
                            <p className="text-xs lg:text-sm text-gray-400">{filteredData[2]?.monthlyAverage}% avg</p>
                            <p className="text-xs text-orange-400">{filteredData[2]?.user.batchType?.replace('_', ' ')}</p>
                          </div>
                        </motion.div>
                      </div>
                    </GlowCard>
                  </motion.div>
                )}

                {/* Complete Rankings Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <GlowCard>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-yellow-400 flex items-center">
                        <BarChart3 className="w-6 h-6 mr-2" />
                        Complete Rankings
                      </h3>
                      <div className="text-sm text-gray-400">
                        {filteredData.length} students
                      </div>
                    </div>

                    <div className="space-y-3">
                      {filteredData.map((entry, index) => {
                        const badgeInfo = getBadgeInfo(entry.badge);
                        return (
                          <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.05 * index }}
                            className={`p-4 lg:p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                              entry.rank <= 3 
                                ? 'border-yellow-500/30 bg-yellow-500/10 hover:border-yellow-400/50'
                                : 'border-gray-600 bg-black/30 hover:border-yellow-500/30'
                            }`}
                          >
                            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
                              <div className="flex items-center space-x-4 flex-1">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500">
                                  {getRankIcon(entry.rank)}
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3">
                                    <h4 className="font-bold text-white text-lg">{entry.user.fullName}</h4>
                                    <span className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${badgeInfo.color} text-white flex items-center space-x-1`}>
                                      <span>{badgeInfo.icon}</span>
                                      <span>{badgeInfo.label}</span>
                                    </span>
                                  </div>
                                  <p className="text-gray-400 text-sm">{entry.user.uid} • {entry.user.batchType.replace('_', ' ')}</p>
                                  <div className="flex flex-wrap items-center gap-4 mt-2">
                                    <div className="flex items-center text-gray-300 text-sm">
                                      <TrendingUp size={14} className="mr-1" />
                                      <span>{entry.averageScore}% avg</span>
                                    </div>
                                    <div className="flex items-center text-gray-300 text-sm">
                                      <Fire size={14} className="mr-1" />
                                      <span>{entry.streak} streak</span>
                                    </div>
                                    <div className="flex items-center text-gray-300 text-sm">
                                      <BookOpen size={14} className="mr-1" />
                                      <span>{entry.totalTests} tests</span>
                                    </div>
                                    <div className="flex items-center text-gray-300 text-sm">
                                      <Clock size={14} className="mr-1" />
                                      <span>{entry.timeSpent}h spent</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-2 lg:space-y-0 lg:space-x-6">
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-yellow-400">{entry.score}</p>
                                  <p className="text-sm text-gray-400">Total Score</p>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <div className={`px-3 py-1 rounded-full text-sm ${
                                    entry.improvement > 0 
                                      ? 'bg-green-500/20 text-green-400' 
                                      : entry.improvement < 0
                                      ? 'bg-red-500/20 text-red-400'
                                      : 'bg-gray-500/20 text-gray-400'
                                  }`}>
                                    {entry.improvement > 0 ? '+' : ''}{entry.improvement}%
                                  </div>
                                  
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    className="p-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30"
                                  >
                                    <Eye size={16} />
                                  </motion.button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </GlowCard>
                </motion.div>
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                {/* Subject-wise Performance */}
                <GlowCard>
                  <h3 className="text-xl font-bold text-yellow-400 mb-6 flex items-center">
                    <PieChart className="w-6 h-6 mr-2" />
                    Subject-wise Performance
                  </h3>
                  
                  <div className="space-y-4">
                    {Object.entries(performanceMetrics.subjectWisePerformance).map(([subject, data], index) => (
                      <motion.div
                        key={subject}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-4 bg-black/30 rounded-xl"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-white">{subject}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-yellow-400 font-bold">{data.averageScore}%</span>
                            <span className={`text-sm px-2 py-1 rounded-full ${
                              data.improvement > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {data.improvement > 0 ? '+' : ''}{data.improvement}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${data.averageScore}%` }}
                            transition={{ delay: 0.5 + 0.1 * index, duration: 1 }}
                            className="h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                          />
                        </div>
                        
                        <p className="text-gray-400 text-sm">{data.totalTests} tests completed</p>
                      </motion.div>
                    ))}
                  </div>
                </GlowCard>

                {/* Performance Trends */}
                <GlowCard>
                  <h3 className="text-xl font-bold text-yellow-400 mb-6 flex items-center">
                    <LineChart className="w-6 h-6 mr-2" />
                    Performance Trends
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">↗ 8.4%</div>
                      <p className="text-gray-400">Overall Improvement This Month</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-black/30 rounded-xl text-center">
                        <div className="text-2xl font-bold text-blue-400 mb-1">76.4%</div>
                        <p className="text-gray-400 text-sm">Average Score</p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-xl text-center">
                        <div className="text-2xl font-bold text-purple-400 mb-1">28.5m</div>
                        <p className="text-gray-400 text-sm">Avg Test Time</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {[
                        { label: 'Students improving weekly', value: '85%', color: 'green' },
                        { label: 'Consistency rate', value: '72%', color: 'blue' },
                        { label: 'Active participation', value: '91%', color: 'yellow' },
                        { label: 'Goal achievement', value: '68%', color: 'purple' }
                      ].map((metric, index) => (
                        <div key={metric.label} className="flex items-center justify-between">
                          <span className="text-gray-300">{metric.label}</span>
                          <span className={`font-bold text-${metric.color}-400`}>{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlowCard>
              </motion.div>
            )}

            {activeTab === 'achievements' && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlowCard>
                  <h3 className="text-xl font-bold text-yellow-400 mb-6 flex items-center">
                    <Star className="w-6 h-6 mr-2" />
                    Achievement System
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 bg-gradient-to-br ${getAchievementRarity(achievement.rarity)} bg-opacity-10 border-opacity-30 hover:bg-opacity-20`}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-3">{achievement.icon}</div>
                          <h4 className="font-bold text-white text-lg mb-2">{achievement.title}</h4>
                          <p className="text-gray-300 text-sm mb-4">{achievement.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${getAchievementRarity(achievement.rarity)} text-white`}>
                              {achievement.rarity.toUpperCase()}
                            </span>
                            <div className="flex items-center text-gray-400 text-sm">
                              <Users size={12} className="mr-1" />
                              <span>{achievement.earnedBy}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 text-xs text-gray-500">
                            {achievement.category}
                          </div>
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

export default EnhancedLeaderboard;