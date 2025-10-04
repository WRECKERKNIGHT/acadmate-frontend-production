import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
  Eye
} from 'lucide-react'
import { testAPI } from '../../config/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

interface LeaderboardEntry {
  id: string
  userId: string
  user: {
    fullName: string
    uid: string
    batchType: string
  }
  rank: number
  score: number
  totalTests: number
  averageScore: number
  monthlyAverage: number
  streak: number
  badge: string
  improvement: number
}

interface TestLeaderboard {
  testId: string
  testTitle: string
  rankings: LeaderboardEntry[]
}

const Leaderboard: React.FC = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'individual' | 'monthly' | 'overall'>('monthly')
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState<LeaderboardEntry[]>([])
  const [testLeaderboards, setTestLeaderboards] = useState<TestLeaderboard[]>([])
  const [overallLeaderboard, setOverallLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBatch, setSelectedBatch] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadLeaderboardData()
  }, [selectedBatch, selectedMonth])

  const loadLeaderboardData = async () => {
    try {
      setLoading(true)
      const [monthlyResponse, testResponse, overallResponse] = await Promise.all([
        testAPI.getMonthlyLeaderboard({ 
          batch: selectedBatch, 
          month: selectedMonth 
        }),
        testAPI.getTestLeaderboards({ 
          batch: selectedBatch, 
          limit: 5 
        }),
        testAPI.getOverallLeaderboard({ 
          batch: selectedBatch 
        })
      ])

      setMonthlyLeaderboard(monthlyResponse.data.rankings || [])
      setTestLeaderboards(testResponse.data.tests || [])
      setOverallLeaderboard(overallResponse.data.rankings || [])
    } catch (error) {
      console.error('Error loading leaderboard data:', error)
      toast.error('Failed to load leaderboard data')
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />
      case 2: return <Medal className="w-6 h-6 text-gray-400" />
      case 3: return <Award className="w-6 h-6 text-orange-400" />
      default: return <span className="w-6 h-6 flex items-center justify-center text-slate-400 font-bold">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-500 to-yellow-600'
      case 2: return 'from-gray-400 to-gray-500'
      case 3: return 'from-orange-500 to-orange-600'
      default: return 'from-slate-500 to-slate-600'
    }
  }

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'CHAMPION': return 'from-yellow-500 to-orange-500'
      case 'EXCELLENT': return 'from-green-500 to-emerald-500'
      case 'GOOD': return 'from-blue-500 to-cyan-500'
      case 'IMPROVING': return 'from-purple-500 to-pink-500'
      default: return 'from-slate-500 to-slate-600'
    }
  }

  const filteredData = (data: LeaderboardEntry[]) => {
    return data.filter(entry => 
      entry.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.user.uid.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent flex items-center">
            <Trophy className="w-8 h-8 mr-3 text-yellow-400" />
            Leaderboard
          </h1>
          <p className="text-slate-400 mt-2">Compete with your peers and track your progress</p>
        </div>
        
        <motion.button
          onClick={loadLeaderboardData}
          className="btn-secondary px-6 py-3 rounded-full flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <RefreshCw className="w-5 h-5" />
          <span>Refresh</span>
        </motion.button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* Tab Switcher */}
          <div className="flex bg-white/5 rounded-xl p-1">
            {[
              { id: 'monthly', name: 'Monthly Rankings', icon: Calendar },
              { id: 'individual', name: 'Test Rankings', icon: Target },
              { id: 'overall', name: 'Overall Rankings', icon: Trophy }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-yellow-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search students..."
              className="input pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select
            className="input"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            <option value="">All Batches</option>
            <option value="IN_CLASS_7">Class 7</option>
            <option value="IN_CLASS_8">Class 8</option>
            <option value="IN_CLASS_9">Class 9</option>
            <option value="IN_CLASS_10">Class 10</option>
            <option value="NEET_11">NEET 11</option>
            <option value="NEET_12">NEET 12</option>
            <option value="PCM_11">PCM 11</option>
            <option value="PCM_12">PCM 12</option>
          </select>

          {activeTab === 'monthly' && (
            <input
              type="month"
              className="input"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
          )}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {activeTab === 'monthly' && (
              <MonthlyLeaderboard 
                data={filteredData(monthlyLeaderboard)} 
                currentUser={user} 
              />
            )}
            {activeTab === 'individual' && (
              <TestLeaderboards 
                data={testLeaderboards} 
                searchQuery={searchQuery} 
                currentUser={user} 
              />
            )}
            {activeTab === 'overall' && (
              <OverallLeaderboard 
                data={filteredData(overallLeaderboard)} 
                currentUser={user} 
              />
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}

// Monthly Leaderboard Component
const MonthlyLeaderboard: React.FC<{ 
  data: LeaderboardEntry[]
  currentUser: any
}> = ({ data, currentUser }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />
      case 2: return <Medal className="w-6 h-6 text-gray-400" />
      case 3: return <Award className="w-6 h-6 text-orange-400" />
      default: return <span className="w-6 h-6 flex items-center justify-center text-slate-400 font-bold">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-500 to-yellow-600'
      case 2: return 'from-gray-400 to-gray-500'
      case 3: return 'from-orange-500 to-orange-600'
      default: return 'from-slate-500 to-slate-600'
    }
  }

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'CHAMPION': return 'from-yellow-500 to-orange-500'
      case 'EXCELLENT': return 'from-green-500 to-emerald-500'
      case 'GOOD': return 'from-blue-500 to-cyan-500'
      case 'IMPROVING': return 'from-purple-500 to-pink-500'
      default: return 'from-slate-500 to-slate-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Top 3 Podium */}
      {data.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8"
        >
          <h3 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            🏆 Top Performers This Month
          </h3>
          
          <div className="flex items-end justify-center space-x-8">
            {/* Second Place */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="bg-gradient-to-t from-gray-600 to-gray-500 rounded-t-2xl p-6 h-32 flex flex-col justify-end relative">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center border-4 border-white">
                    <Medal className="w-8 h-8 text-white" />
                  </div>
                </div>
                <span className="text-4xl font-bold text-white mt-4">2</span>
              </div>
              <div className="mt-4">
                <p className="font-bold text-white">{data[1].user.fullName}</p>
                <p className="text-sm text-slate-400">{data[1].monthlyAverage}% avg</p>
                <p className="text-xs text-gray-400">{data[1].user.batchType?.replace('_', ' ')}</p>
              </div>
            </motion.div>

            {/* First Place */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-2xl p-6 h-40 flex flex-col justify-end relative">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center border-4 border-white animate-pulse">
                    <Crown className="w-10 h-10 text-white" />
                  </div>
                </div>
                <span className="text-5xl font-bold text-white mt-4">1</span>
              </div>
              <div className="mt-4">
                <p className="font-bold text-white text-lg">{data[0].user.fullName}</p>
                <p className="text-sm text-yellow-400 font-semibold">{data[0].monthlyAverage}% avg</p>
                <p className="text-xs text-yellow-400">{data[0].user.batchType?.replace('_', ' ')}</p>
                <div className="flex items-center justify-center mt-2">
                  <Fire className="w-4 h-4 text-orange-400 mr-1" />
                  <span className="text-xs text-orange-400">{data[0].streak} day streak</span>
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
              <div className="bg-gradient-to-t from-orange-600 to-orange-500 rounded-t-2xl p-6 h-28 flex flex-col justify-end relative">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center border-4 border-white">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                </div>
                <span className="text-3xl font-bold text-white mt-4">3</span>
              </div>
              <div className="mt-4">
                <p className="font-bold text-white">{data[2].user.fullName}</p>
                <p className="text-sm text-slate-400">{data[2].monthlyAverage}% avg</p>
                <p className="text-xs text-orange-400">{data[2].user.batchType?.replace('_', ' ')}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Full Rankings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card overflow-hidden"
      >
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold text-white flex items-center">
            <BarChart3 className="w-6 h-6 mr-2" />
            Complete Monthly Rankings
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-slate-300 font-semibold">Rank</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Student</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Monthly Avg</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Tests Taken</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Streak</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Badge</th>
                <th className="text-left p-4 text-slate-300 font-semibold">Improvement</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry, index) => (
                <motion.tr
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                    entry.userId === currentUser?.id ? 'bg-blue-500/10 border-blue-500/20' : ''
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {getRankIcon(entry.rank)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${getRankColor(entry.rank)} rounded-full flex items-center justify-center`}>
                        <span className="text-white font-bold text-sm">
                          {entry.user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-white flex items-center">
                          {entry.user.fullName}
                          {entry.userId === currentUser?.id && (
                            <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full">You</span>
                          )}
                        </div>
                        <div className="text-sm text-slate-400">{entry.user.uid}</div>
                        <div className="text-xs text-slate-500">{entry.user.batchType?.replace('_', ' ')}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-xl font-bold text-white">{entry.monthlyAverage}%</div>
                  </td>
                  <td className="p-4">
                    <div className="text-lg font-semibold text-blue-400">{entry.totalTests}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-1">
                      <Fire className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-400 font-semibold">{entry.streak}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getBadgeColor(entry.badge)} text-white`}>
                      {entry.badge}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className={`flex items-center space-x-1 ${entry.improvement > 0 ? 'text-green-400' : entry.improvement < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                      {entry.improvement > 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : entry.improvement < 0 ? (
                        <TrendingUp className="w-4 h-4 rotate-180" />
                      ) : (
                        <div className="w-4 h-4" />
                      )}
                      <span className="font-semibold">
                        {entry.improvement > 0 ? '+' : ''}{entry.improvement}%
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

// Test Leaderboards Component
const TestLeaderboards: React.FC<{
  data: TestLeaderboard[]
  searchQuery: string
  currentUser: any
}> = ({ data, searchQuery, currentUser }) => {
  return (
    <div className="space-y-6">
      {data.map((testBoard, index) => (
        <motion.div
          key={testBoard.testId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Target className="w-6 h-6 mr-2 text-purple-400" />
              {testBoard.testTitle}
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-4 text-slate-300 font-semibold">Rank</th>
                  <th className="text-left p-4 text-slate-300 font-semibold">Student</th>
                  <th className="text-left p-4 text-slate-300 font-semibold">Score</th>
                  <th className="text-left p-4 text-slate-300 font-semibold">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {testBoard.rankings
                  .filter(entry => 
                    entry.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    entry.user.uid.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .slice(0, 10)
                  .map((entry, idx) => (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                        entry.userId === currentUser?.id ? 'bg-purple-500/10 border-purple-500/20' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center">
                          {entry.rank <= 3 ? (
                            <div className={`w-8 h-8 bg-gradient-to-br ${
                              entry.rank === 1 ? 'from-yellow-500 to-yellow-600' :
                              entry.rank === 2 ? 'from-gray-400 to-gray-500' :
                              'from-orange-500 to-orange-600'
                            } rounded-full flex items-center justify-center`}>
                              <span className="text-white font-bold text-sm">{entry.rank}</span>
                            </div>
                          ) : (
                            <span className="w-8 h-8 flex items-center justify-center text-slate-400 font-bold">
                              #{entry.rank}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-xs">
                              {entry.user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-white flex items-center">
                              {entry.user.fullName}
                              {entry.userId === currentUser?.id && (
                                <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-1 rounded-full">You</span>
                              )}
                            </div>
                            <div className="text-sm text-slate-400">{entry.user.uid}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-lg font-bold text-purple-400">{entry.score}</div>
                      </td>
                      <td className="p-4">
                        <div className={`text-lg font-bold ${
                          entry.averageScore >= 90 ? 'text-green-400' :
                          entry.averageScore >= 75 ? 'text-yellow-400' :
                          entry.averageScore >= 60 ? 'text-orange-400' : 'text-red-400'
                        }`}>
                          {entry.averageScore}%
                        </div>
                      </td>
                    </motion.tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Overall Leaderboard Component
const OverallLeaderboard: React.FC<{
  data: LeaderboardEntry[]
  currentUser: any
}> = ({ data, currentUser }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-400" />
      case 2: return <Medal className="w-6 h-6 text-gray-400" />
      case 3: return <Award className="w-6 h-6 text-orange-400" />
      default: return <span className="w-6 h-6 flex items-center justify-center text-slate-400 font-bold">#{rank}</span>
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card overflow-hidden"
    >
      <div className="p-6 border-b border-white/10">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Trophy className="w-6 h-6 mr-2 text-yellow-400" />
          Overall Platform Rankings
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-slate-300 font-semibold">Rank</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Student</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Overall Score</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Tests Taken</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Average</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Badge</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => (
              <motion.tr
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                  entry.userId === currentUser?.id ? 'bg-yellow-500/10 border-yellow-500/20' : ''
                }`}
              >
                <td className="p-4">{getRankIcon(entry.rank)}</td>
                <td className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${
                      entry.rank === 1 ? 'from-yellow-500 to-yellow-600' :
                      entry.rank === 2 ? 'from-gray-400 to-gray-500' :
                      entry.rank === 3 ? 'from-orange-500 to-orange-600' :
                      'from-slate-500 to-slate-600'
                    } rounded-full flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">
                        {entry.user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-white flex items-center">
                        {entry.user.fullName}
                        {entry.userId === currentUser?.id && (
                          <span className="ml-2 text-xs bg-yellow-500 text-white px-2 py-1 rounded-full">You</span>
                        )}
                      </div>
                      <div className="text-sm text-slate-400">{entry.user.uid}</div>
                      <div className="text-xs text-slate-500">{entry.user.batchType?.replace('_', ' ')}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-xl font-bold text-yellow-400">{entry.score}</div>
                </td>
                <td className="p-4">
                  <div className="text-lg font-semibold text-blue-400">{entry.totalTests}</div>
                </td>
                <td className="p-4">
                  <div className={`text-lg font-bold ${
                    entry.averageScore >= 90 ? 'text-green-400' :
                    entry.averageScore >= 75 ? 'text-yellow-400' :
                    entry.averageScore >= 60 ? 'text-orange-400' : 'text-red-400'
                  }`}>
                    {entry.averageScore}%
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${
                    entry.badge === 'CHAMPION' ? 'from-yellow-500 to-orange-500' :
                    entry.badge === 'EXCELLENT' ? 'from-green-500 to-emerald-500' :
                    entry.badge === 'GOOD' ? 'from-blue-500 to-cyan-500' :
                    entry.badge === 'IMPROVING' ? 'from-purple-500 to-pink-500' :
                    'from-slate-500 to-slate-600'
                  } text-white`}>
                    {entry.badge}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default Leaderboard