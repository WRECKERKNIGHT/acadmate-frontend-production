import React from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Card, Button, Badge, icons } from './ui'

interface HeroSectionProps {
  onQuickAction?: (action: string) => void
}

const HeroSections: React.FC<HeroSectionProps> = ({ onQuickAction }) => {
  const { user } = useAuth()
  
  if (!user) return null

  const getTimeGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  const StudentHero = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-cyan-600/20 p-8 border border-blue-500/20 backdrop-blur-sm"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-blue-400 font-medium mb-2">{getTimeGreeting()}</p>
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome back, <span className="text-gradient bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{user.fullName.split(' ')[0]}</span>!
            </h1>
            <p className="text-slate-300 text-lg mb-6">
              Ready to learn something new today? Your educational journey continues with new tests, doubts to resolve, and achievements to unlock.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button icon="book" onClick={() => onQuickAction?.('tests')}>
                Take a Test
              </Button>
              <Button variant="secondary" icon="message" onClick={() => onQuickAction?.('doubts')}>
                Ask a Doubt
              </Button>
              <Button variant="secondary" icon="chart" onClick={() => onQuickAction?.('progress')}>
                View Progress
              </Button>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="relative"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                <icons.graduation className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Your Batch</h3>
                <Badge variant="primary">{user.batchType?.replace('_', ' ')}</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Student ID:</span>
                <span className="text-slate-200 font-mono">{user.uid}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Status:</span>
                <Badge variant="success">Active</Badge>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )

  const TeacherHero = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600/20 via-teal-600/10 to-green-600/20 p-8 border border-emerald-500/20 backdrop-blur-sm"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-teal-500/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-emerald-400 font-medium mb-2">{getTimeGreeting()}</p>
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome, <span className="text-gradient bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Prof. {user.fullName.split(' ')[0]}</span>!
            </h1>
            <p className="text-slate-300 text-lg mb-6">
              Empower your students today. Create engaging tests, resolve doubts, and track student progress to make learning more effective.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button icon="plus" onClick={() => onQuickAction?.('create-test')}>
                Create Test
              </Button>
              <Button variant="secondary" icon="users" onClick={() => onQuickAction?.('students')}>
                Manage Students
              </Button>
              <Button variant="secondary" icon="message" onClick={() => onQuickAction?.('doubts')}>
                Review Doubts
              </Button>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="relative"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-4">
                <icons.book className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Teaching Profile</h3>
                <Badge variant="success">Active Educator</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Teacher ID:</span>
                <span className="text-slate-200 font-mono">{user.uid}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Subjects:</span>
                <div className="flex flex-wrap gap-1">
                  {user.subjects?.slice(0, 2).map(subject => (
                    <Badge key={subject} variant="primary" size="sm">{subject}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )

  const HeadTeacherHero = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-600/20 via-orange-600/10 to-red-600/20 p-8 border border-amber-500/20 backdrop-blur-sm"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-amber-400 font-medium mb-2">{getTimeGreeting()}</p>
            <h1 className="text-4xl font-bold text-white mb-4">
              Welcome, <span className="text-gradient bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Director {user.fullName.split(' ')[0]}</span>!
            </h1>
            <p className="text-slate-300 text-lg mb-6">
              Lead your institution to excellence. Monitor performance, manage faculty, and drive strategic decisions for educational success.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button icon="chart" onClick={() => onQuickAction?.('analytics')}>
                View Analytics
              </Button>
              <Button variant="secondary" icon="users" onClick={() => onQuickAction?.('teachers')}>
                Manage Faculty
              </Button>
              <Button variant="secondary" icon="settings" onClick={() => onQuickAction?.('settings')}>
                System Settings
              </Button>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="relative"
        >
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mr-4">
                <icons.award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Administrative Control</h3>
                <Badge variant="warning">Head Teacher</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Admin ID:</span>
                <span className="text-slate-200 font-mono">{user.uid}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Access Level:</span>
                <Badge variant="error">Full Access</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Institution:</span>
                <span className="text-slate-200">Acadmate Coaching</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )

  // Quick stats component
  const QuickStats = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
    >
      {user.role === 'STUDENT' && (
        <>
          <Card className="p-4 text-center" gradient>
            <icons.book className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-100">12</div>
            <div className="text-sm text-slate-400">Tests Available</div>
          </Card>
          <Card className="p-4 text-center" gradient>
            <icons.clock className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-100">3</div>
            <div className="text-sm text-slate-400">Pending Doubts</div>
          </Card>
          <Card className="p-4 text-center" gradient>
            <icons.award className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-100">85%</div>
            <div className="text-sm text-slate-400">Average Score</div>
          </Card>
          <Card className="p-4 text-center" gradient>
            <icons.calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-100">2</div>
            <div className="text-sm text-slate-400">Upcoming Tests</div>
          </Card>
        </>
      )}
      
      {user.role === 'TEACHER' && (
        <>
          <Card className="p-4 text-center" gradient>
            <icons.users className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-100">45</div>
            <div className="text-sm text-slate-400">Students</div>
          </Card>
          <Card className="p-4 text-center" gradient>
            <icons.book className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-100">8</div>
            <div className="text-sm text-slate-400">Active Tests</div>
          </Card>
          <Card className="p-4 text-center" gradient>
            <icons.message className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-100">12</div>
            <div className="text-sm text-slate-400">Doubts to Review</div>
          </Card>
          <Card className="p-4 text-center" gradient>
            <icons.chart className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-100">92%</div>
            <div className="text-sm text-slate-400">Class Average</div>
          </Card>
        </>
      )}
      
      {user.role === 'HEAD_TEACHER' && (
        <>
          <Card className="p-4 text-center" gradient>
            <icons.users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-100">250</div>
            <div className="text-sm text-slate-400">Total Students</div>
          </Card>
          <Card className="p-4 text-center" gradient>
            <icons.graduation className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-100">18</div>
            <div className="text-sm text-slate-400">Faculty Members</div>
          </Card>
          <Card className="p-4 text-center" gradient>
            <icons.chart className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-100">89%</div>
            <div className="text-sm text-slate-400">Overall Performance</div>
          </Card>
          <Card className="p-4 text-center" gradient>
            <icons.calendar className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-slate-100">24</div>
            <div className="text-sm text-slate-400">Active Classes</div>
          </Card>
        </>
      )}
    </motion.div>
  )

  return (
    <div className="space-y-8">
      {user.role === 'STUDENT' && <StudentHero />}
      {user.role === 'TEACHER' && <TeacherHero />}
      {user.role === 'HEAD_TEACHER' && <HeadTeacherHero />}
      <QuickStats />
    </div>
  )
}

export default HeroSections