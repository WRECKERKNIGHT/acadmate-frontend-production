import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Bell, 
  Clock,
  User,
  Activity,
  Target,
  Zap,
  Star,
  ChevronRight,
  Play,
  Pause,
  Volume2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
}

interface ClassSchedule {
  id: string;
  subject: string;
  teacher: string;
  time: string;
  room: string;
  status: 'upcoming' | 'live' | 'completed';
}

interface Achievement {
  id: string;
  title: string;
  icon: string;
  description: string;
  earned: boolean;
  progress: number;
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Premium animated background effect
  useEffect(() => {
    document.body.classList.add('premium-dashboard-bg');
    return () => document.body.classList.remove('premium-dashboard-bg');
  }, []);
  const [assignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Physics Chapter 5 Problems',
      subject: 'Physics',
      dueDate: '2024-01-20',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Mathematics Calculus Assignment',
      subject: 'Mathematics',
      dueDate: '2024-01-22',
      status: 'submitted',
      score: 85
    }
  ]);

  const [schedule] = useState<ClassSchedule[]>([
    {
      id: '1',
      subject: 'Physics',
      teacher: 'Dr. Sarah Johnson',
      time: '10:00 AM - 11:00 AM',
      room: 'Room 301',
      status: 'upcoming'
    },
    {
      id: '2',
      subject: 'Mathematics',
      teacher: 'Prof. Michael Chen',
      time: '2:00 PM - 3:00 PM',
      room: 'Room 205',
      status: 'live'
    }
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Perfect Attendance',
      icon: '🎯',
      description: 'Attended all classes this month',
      earned: true,
      progress: 100
    },
    {
      id: '2',
      title: 'Top Performer',
      icon: '⭐',
      description: 'Scored above 90% in 3 subjects',
      earned: false,
      progress: 75
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
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-30"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 20 + 10,
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
      className={`relative bg-black/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 
                  hover:border-cyan-400/60 transition-all duration-300 ${className}`}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)'
      }}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
// Main return block for StudentDashboard
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
      <div className="relative z-20">
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
                <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  Welcome back, {user?.name || 'Student'}! 👋
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
                <div className="bg-black/50 backdrop-blur-xl border border-cyan-500/30 rounded-xl px-4 py-2">
                  <div className="text-cyan-400 font-mono text-lg">
                    {currentTime.toLocaleTimeString()}
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl"
                >
                  <Bell size={20} />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                  />
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
                    <p className="text-gray-400 text-sm">Overall Grade</p>
                    <p className="text-3xl font-bold text-cyan-400">A+</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl">
                    <Award size={24} />
                  </div>
                </div>
              </GlowCard>

              <GlowCard>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Attendance</p>
                    <p className="text-3xl font-bold text-green-400">96%</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                    <Target size={24} />
                  </div>
                </div>
              </GlowCard>

              <GlowCard>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Assignments</p>
                    <p className="text-3xl font-bold text-yellow-400">5</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-yellow-500 to-red-500 rounded-xl">
                    <BookOpen size={24} />
                  </div>
                </div>
              </GlowCard>

              <GlowCard>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Rank</p>
                    <p className="text-3xl font-bold text-purple-400">#3</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                    <TrendingUp size={24} />
                  </div>
                </div>
              </GlowCard>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Today's Schedule */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="lg:col-span-2"
              >
                <GlowCard>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-cyan-400">Today's Schedule</h3>
                    <Calendar className="text-gray-400" size={20} />
                  </div>

                  <div className="space-y-4">
                    {schedule.map((class_, index) => (
                      <motion.div
                        key={class_.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className={`p-4 rounded-xl border-l-4 ${
                          class_.status === 'live' 
                            ? 'border-l-green-400 bg-green-500/10' 
                            : class_.status === 'upcoming'
                            ? 'border-l-cyan-400 bg-cyan-500/10'
                            : 'border-l-gray-400 bg-gray-500/10'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold text-white">{class_.subject}</h4>
                            <p className="text-gray-400 text-sm">{class_.teacher}</p>
                            <p className="text-gray-300 text-sm">{class_.time} • {class_.room}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlowCard>
              </motion.div>

              {/* Assignments Section */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-12 lg:mt-0"
              >
                <GlowCard>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-cyan-400">Recent Assignments</h3>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="text-purple-400 hover:text-purple-300 text-sm"
                    >
                      View All
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {assignments.map((assignment, index) => (
                      <motion.div
                        key={assignment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ y: -5 }}
                        className="p-4 bg-black/40 border border-gray-700 rounded-xl hover:border-cyan-500/50 transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-white">{assignment.title}</h4>
                            <p className="text-gray-400 text-sm">{assignment.subject}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            assignment.status === 'submitted' 
                              ? 'bg-green-500/20 text-green-400'
                              : assignment.status === 'graded'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-500 text-sm flex items-center">
                            <Clock size={12} className="mr-1" />
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </p>
                          {assignment.score && (
                            <p className="text-cyan-400 font-semibold">{assignment.score}%</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlowCard>
              </motion.div>
            </div> {/* End Main Content Grid */}
          </div> {/* End max-w-7xl */}
        </motion.div> {/* End Hero Section */}
      </div> {/* End relative z-20 */}
    </div>
  );
}

export default StudentDashboard;