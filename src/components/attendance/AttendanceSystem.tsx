import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  UserCheck,
  UserX,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Save,
  RotateCcw,
  TrendingUp,
  BarChart3,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  className: string;
  avatar?: string;
  attendancePercentage: number;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string;
  classId: string;
  subject: string;
  status: 'present' | 'absent' | 'late';
  markedBy: string;
  markedAt: string;
  notes?: string;
}

interface ClassSession {
  id: string;
  subject: string;
  className: string;
  date: string;
  startTime: string;
  endTime: string;
  teacher: string;
  totalStudents: number;
  presentCount: number;
  status: 'scheduled' | 'active' | 'completed';
}

const AttendanceSystem: React.FC = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('mark');
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [markingMode, setMarkingMode] = useState(false);

  const [students] = useState<Student[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      rollNumber: '2023001',
      className: 'Class 12-A',
      attendancePercentage: 95
    },
    {
      id: '2',
      name: 'Bob Smith',
      rollNumber: '2023002',
      className: 'Class 12-A',
      attendancePercentage: 88
    },
    {
      id: '3',
      name: 'Carol Davis',
      rollNumber: '2023003',
      className: 'Class 12-A',
      attendancePercentage: 92
    },
    {
      id: '4',
      name: 'David Wilson',
      rollNumber: '2023004',
      className: 'Class 12-A',
      attendancePercentage: 85
    },
    {
      id: '5',
      name: 'Eva Martinez',
      rollNumber: '2023005',
      className: 'Class 12-A',
      attendancePercentage: 97
    }
  ]);

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    {
      id: '1',
      studentId: '1',
      date: '2024-01-15',
      classId: 'class-12a',
      subject: 'Physics',
      status: 'present',
      markedBy: 'Dr. Sarah Johnson',
      markedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      studentId: '2',
      date: '2024-01-15',
      classId: 'class-12a',
      subject: 'Physics',
      status: 'absent',
      markedBy: 'Dr. Sarah Johnson',
      markedAt: '2024-01-15T10:00:00Z'
    }
  ]);

  const [classSessions] = useState<ClassSession[]>([
    {
      id: '1',
      subject: 'Physics',
      className: 'Class 12-A',
      date: '2024-01-15',
      startTime: '10:00 AM',
      endTime: '11:00 AM',
      teacher: 'Dr. Sarah Johnson',
      totalStudents: 25,
      presentCount: 23,
      status: 'active'
    },
    {
      id: '2',
      subject: 'Mathematics',
      className: 'Class 11-B',
      date: '2024-01-15',
      startTime: '2:00 PM',
      endTime: '3:00 PM',
      teacher: 'Prof. Michael Chen',
      totalStudents: 28,
      presentCount: 26,
      status: 'scheduled'
    }
  ]);

  const [currentAttendance, setCurrentAttendance] = useState<{ [key: string]: 'present' | 'absent' | 'late' }>({});

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Initialize current attendance state
  useEffect(() => {
    const initialAttendance: { [key: string]: 'present' | 'absent' | 'late' } = {};
    students.forEach(student => {
      const todayRecord = attendanceRecords.find(
        record => record.studentId === student.id && 
        record.date === currentDate.toISOString().split('T')[0]
      );
      initialAttendance[student.id] = todayRecord?.status || 'present';
    });
    setCurrentAttendance(initialAttendance);
  }, [students, attendanceRecords, currentDate]);

  // Animated background
  const ParticleBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-green-400 rounded-full opacity-20"
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
      className={`relative bg-black/40 backdrop-blur-xl border border-green-500/30 rounded-2xl p-6 
                  hover:border-green-400/60 transition-all duration-300 ${className}`}
      whileHover={{ 
        scale: 1.01,
        boxShadow: '0 0 30px rgba(34, 197, 94, 0.2)'
      }}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );

  const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setCurrentAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const saveAttendance = async () => {
    // Simulate saving attendance to backend
    console.log('Saving attendance:', currentAttendance);
    setMarkingMode(false);
    // Show success notification
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.includes(searchTerm)
  );

  const getAttendanceStats = () => {
    const totalStudents = students.length;
    const presentCount = Object.values(currentAttendance).filter(status => status === 'present').length;
    const absentCount = Object.values(currentAttendance).filter(status => status === 'absent').length;
    const lateCount = Object.values(currentAttendance).filter(status => status === 'late').length;
    
    return {
      totalStudents,
      presentCount,
      absentCount,
      lateCount,
      attendancePercentage: totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0
    };
  };

  const stats = getAttendanceStats();

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
          <div className="flex justify-between items-center mb-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                Attendance System 📊
              </h1>
              <p className="text-gray-400 mt-2">
                {currentDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} • {currentDate.toLocaleTimeString()}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center space-x-4"
            >
              {markingMode && (
                <motion.button
                  onClick={saveAttendance}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl font-semibold"
                >
                  <Save size={18} />
                  <span>Save Attendance</span>
                </motion.button>
              )}
              
              <motion.button
                onClick={() => setMarkingMode(!markingMode)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold ${
                  markingMode 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500'
                }`}
              >
                {markingMode ? <XCircle size={18} /> : <Edit size={18} />}
                <span>{markingMode ? 'Cancel' : 'Mark Attendance'}</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Quick Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
          >
            <GlowCard>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Students</p>
                  <p className="text-2xl font-bold text-green-400">{stats.totalStudents}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl">
                  <Users size={20} />
                </div>
              </div>
            </GlowCard>

            <GlowCard>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Present</p>
                  <p className="text-2xl font-bold text-green-400">{stats.presentCount}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <CheckCircle size={20} />
                </div>
              </div>
            </GlowCard>

            <GlowCard>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Absent</p>
                  <p className="text-2xl font-bold text-red-400">{stats.absentCount}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl">
                  <XCircle size={20} />
                </div>
              </div>
            </GlowCard>

            <GlowCard>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Late</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats.lateCount}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                  <AlertCircle size={20} />
                </div>
              </div>
            </GlowCard>

            <GlowCard>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Attendance %</p>
                  <p className="text-2xl font-bold text-cyan-400">{stats.attendancePercentage}%</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl">
                  <TrendingUp size={20} />
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
              { id: 'mark', label: 'Mark Attendance', icon: UserCheck },
              { id: 'history', label: 'History', icon: Calendar },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'sessions', label: 'Class Sessions', icon: Clock }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
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
            {activeTab === 'mark' && (
              <motion.div
                key="mark"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlowCard>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-green-400">Today's Attendance</h3>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search students..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 bg-black/50 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30"
                      >
                        <Download size={16} />
                      </motion.button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {filteredStudents.map((student, index) => (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className={`p-4 rounded-xl border transition-all duration-300 ${
                          currentAttendance[student.id] === 'present' 
                            ? 'border-green-500/30 bg-green-500/10' :
                          currentAttendance[student.id] === 'absent'
                            ? 'border-red-500/30 bg-red-500/10' :
                          currentAttendance[student.id] === 'late'
                            ? 'border-yellow-500/30 bg-yellow-500/10'
                            : 'border-gray-600 bg-black/30'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">{student.name}</h4>
                              <p className="text-gray-400 text-sm">Roll: {student.rollNumber} • {student.className}</p>
                              <p className="text-gray-500 text-xs">Overall: {student.attendancePercentage}% attendance</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-3">
                            {markingMode ? (
                              <div className="flex space-x-2">
                                {[
                                  { status: 'present', color: 'green', icon: CheckCircle },
                                  { status: 'late', color: 'yellow', icon: AlertCircle },
                                  { status: 'absent', color: 'red', icon: XCircle }
                                ].map((option) => (
                                  <motion.button
                                    key={option.status}
                                    onClick={() => markAttendance(student.id, option.status as any)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`p-2 rounded-lg border transition-all duration-200 ${
                                      currentAttendance[student.id] === option.status
                                        ? `bg-${option.color}-500/30 border-${option.color}-500/50 text-${option.color}-400`
                                        : `bg-${option.color}-500/10 border-${option.color}-500/20 text-${option.color}-500 hover:bg-${option.color}-500/20`
                                    }`}
                                  >
                                    <option.icon size={18} />
                                  </motion.button>
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                                  currentAttendance[student.id] === 'present' 
                                    ? 'bg-green-500/20 text-green-400' :
                                  currentAttendance[student.id] === 'absent'
                                    ? 'bg-red-500/20 text-red-400' :
                                  currentAttendance[student.id] === 'late'
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-gray-500/20 text-gray-400'
                                }`}>
                                  {currentAttendance[student.id]?.charAt(0).toUpperCase() + 
                                   currentAttendance[student.id]?.slice(1) || 'Not Marked'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {markingMode && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl"
                    >
                      <div className="flex items-center space-x-2 text-blue-400">
                        <Bell size={16} />
                        <span className="text-sm font-medium">Attendance Marking Mode Active</span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        Click on the status buttons to mark attendance for each student. Don't forget to save when done.
                      </p>
                    </motion.div>
                  )}
                </GlowCard>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlowCard>
                  <h3 className="text-xl font-bold text-green-400 mb-6">Attendance History</h3>
                  
                  <div className="space-y-4">
                    {attendanceRecords.map((record, index) => {
                      const student = students.find(s => s.id === record.studentId);
                      return (
                        <motion.div
                          key={record.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * index }}
                          className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-gray-700 hover:border-green-500/30"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {student?.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">{student?.name}</h4>
                              <p className="text-gray-400 text-sm">{record.subject} • {record.date}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <span className={`px-3 py-1 text-sm rounded-full ${
                              record.status === 'present' ? 'bg-green-500/20 text-green-400' :
                              record.status === 'absent' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30"
                            >
                              <Eye size={14} />
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <GlowCard>
                    <h3 className="text-xl font-bold text-green-400 mb-6">Student Performance</h3>
                    
                    <div className="space-y-4">
                      {students.map((student, index) => (
                        <motion.div
                          key={student.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.05 * index }}
                          className="p-4 bg-black/30 rounded-xl"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">{student.name}</h4>
                            <span className={`text-lg font-bold ${
                              student.attendancePercentage >= 95 ? 'text-green-400' :
                              student.attendancePercentage >= 85 ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {student.attendancePercentage}%
                            </span>
                          </div>
                          
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${student.attendancePercentage}%` }}
                              transition={{ delay: 0.5 + 0.05 * index, duration: 1 }}
                              className={`h-2 rounded-full ${
                                student.attendancePercentage >= 95 ? 'bg-green-400' :
                                student.attendancePercentage >= 85 ? 'bg-yellow-400' :
                                'bg-red-400'
                              }`}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </GlowCard>

                  <GlowCard>
                    <h3 className="text-xl font-bold text-green-400 mb-6">Weekly Trends</h3>
                    
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-400 mb-2">92.5%</div>
                        <p className="text-gray-400">Average Weekly Attendance</p>
                      </div>
                      
                      <div className="space-y-4">
                        {[
                          { day: 'Monday', percentage: 95 },
                          { day: 'Tuesday', percentage: 88 },
                          { day: 'Wednesday', percentage: 92 },
                          { day: 'Thursday', percentage: 96 },
                          { day: 'Friday', percentage: 91 }
                        ].map((day, index) => (
                          <div key={day.day} className="flex items-center justify-between">
                            <span className="text-white font-medium w-20">{day.day}</span>
                            <div className="flex-1 mx-4">
                              <div className="w-full bg-gray-700 rounded-full h-2">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${day.percentage}%` }}
                                  transition={{ delay: 1 + 0.1 * index, duration: 0.8 }}
                                  className="h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"
                                />
                              </div>
                            </div>
                            <span className="text-green-400 font-bold w-12 text-right">{day.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </GlowCard>
                </div>
              </motion.div>
            )}

            {activeTab === 'sessions' && (
              <motion.div
                key="sessions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlowCard>
                  <h3 className="text-xl font-bold text-green-400 mb-6">Class Sessions</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {classSessions.map((session, index) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="p-6 bg-black/40 border border-gray-700 rounded-xl hover:border-green-500/50"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-white text-lg">{session.subject}</h4>
                            <p className="text-gray-300">{session.className}</p>
                            <p className="text-gray-400 text-sm">{session.teacher}</p>
                          </div>
                          <span className={`px-3 py-1 text-sm rounded-full ${
                            session.status === 'active' ? 'bg-green-500/20 text-green-400' :
                            session.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {session.status.toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Time:</span>
                            <span className="text-white">{session.startTime} - {session.endTime}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Attendance:</span>
                            <span className="text-green-400 font-semibold">
                              {session.presentCount}/{session.totalStudents} 
                              ({Math.round((session.presentCount / session.totalStudents) * 100)}%)
                            </span>
                          </div>
                          
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(session.presentCount / session.totalStudents) * 100}%` }}
                              transition={{ delay: 0.5 + 0.1 * index, duration: 1 }}
                              className="h-2 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full"
                            />
                          </div>
                        </div>

                        <div className="flex space-x-2 mt-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="flex-1 py-2 bg-green-500/20 border border-green-500/30 rounded-lg hover:bg-green-500/30 text-sm"
                          >
                            View Details
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            className="flex-1 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 text-sm"
                          >
                            Take Attendance
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

export default AttendanceSystem;