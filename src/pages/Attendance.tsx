import React, { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { UserCheck, Loader } from 'lucide-react'

// Lazy load the attendance manager for better performance
const AttendanceManager = lazy(() => import('../components/attendance/AttendanceManager'))

const AttendancePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <UserCheck className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Attendance Management
              </h1>
              <p className="text-slate-400 mt-1">
                Comprehensive attendance tracking and management system
              </p>
            </div>
          </div>
          
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-slate-400">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-green-400">Attendance</span>
          </nav>
        </motion.div>

        {/* Main Content */}
        <Suspense 
          fallback={
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-green-400/30 border-t-green-400 rounded-full animate-spin"></div>
                <Loader className="w-6 h-6 text-green-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="text-slate-400 mt-4">Loading Attendance System...</p>
            </div>
          }
        >
          <AttendanceManager />
        </Suspense>
      </div>
    </div>
  )
}

export default AttendancePage