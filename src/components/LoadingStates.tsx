import React from 'react'
import { motion } from 'framer-motion'
import { Loader, Atom, BookOpen, Users, Calendar } from 'lucide-react'

// Full Page Loading Spinner
export const FullPageLoader: React.FC<{ message?: string }> = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated ACADMATE Logo */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="relative w-20 h-20 mx-auto mb-4">
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
              }}
            />
            <div className="absolute inset-2 rounded-full bg-slate-900 flex items-center justify-center">
              <Atom className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            ACADMATE
          </motion.h2>
        </motion.div>

        {/* Loading Message */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-slate-400 text-lg mb-4"
        >
          {message}
        </motion.p>

        {/* Progress Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center space-x-1"
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-2 h-2 bg-blue-400 rounded-full"
              animate={{
                y: [0, -8, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  )
}

// Inline Loading Spinner
export const InlineLoader: React.FC<{ size?: 'sm' | 'md' | 'lg'; message?: string }> = ({ 
  size = 'md', 
  message 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex items-center justify-center space-x-3 py-4">
      <motion.div
        className={`border-4 border-blue-400/30 border-t-blue-400 rounded-full ${sizeClasses[size]}`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      {message && (
        <span className="text-slate-400 text-sm">{message}</span>
      )}
    </div>
  )
}

// Card Skeleton Loader
export const CardSkeleton: React.FC = () => {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-slate-700 rounded-xl"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-700 rounded w-3/4"></div>
          <div className="h-3 bg-slate-700 rounded w-1/2"></div>
          <div className="space-y-1">
            <div className="h-2 bg-slate-700 rounded"></div>
            <div className="h-2 bg-slate-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Table Skeleton Loader
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 4 
}) => {
  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/10 animate-pulse">
        <div className="flex space-x-4">
          {Array.from({ length: columns }).map((_, index) => (
            <div key={index} className="flex-1 h-4 bg-slate-700 rounded"></div>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4 animate-pulse">
            <div className="flex space-x-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div key={colIndex} className="flex-1">
                  {colIndex === 0 ? (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-slate-700 rounded-full"></div>
                      <div className="space-y-1 flex-1">
                        <div className="h-3 bg-slate-700 rounded w-3/4"></div>
                        <div className="h-2 bg-slate-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-3 bg-slate-700 rounded"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Dashboard Stats Skeleton
export const StatsSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 p-6 rounded-2xl border border-white/10 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-3 flex-1">
              <div className="h-3 bg-slate-600 rounded w-1/2"></div>
              <div className="h-8 bg-slate-600 rounded w-3/4"></div>
              <div className="h-2 bg-slate-600 rounded w-1/3"></div>
            </div>
            <div className="w-12 h-12 bg-slate-600 rounded-2xl"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

// List Skeleton Loader
export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="card p-4 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              <div className="h-3 bg-slate-700 rounded w-1/2"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-700 rounded w-16"></div>
              <div className="h-2 bg-slate-700 rounded w-12"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Form Skeleton Loader
export const FormSkeleton: React.FC = () => {
  return (
    <div className="card p-6 animate-pulse">
      <div className="space-y-6">
        <div className="h-6 bg-slate-700 rounded w-1/3"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-3 bg-slate-700 rounded w-1/4"></div>
              <div className="h-10 bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="h-3 bg-slate-700 rounded w-1/4"></div>
          <div className="h-24 bg-slate-700 rounded"></div>
        </div>

        <div className="flex justify-end space-x-4">
          <div className="h-10 bg-slate-700 rounded w-20"></div>
          <div className="h-10 bg-slate-700 rounded w-24"></div>
        </div>
      </div>
    </div>
  )
}

// Chart Skeleton Loader
export const ChartSkeleton: React.FC = () => {
  return (
    <div className="card p-6 animate-pulse">
      <div className="space-y-4">
        <div className="h-5 bg-slate-700 rounded w-1/3"></div>
        
        <div className="h-64 bg-slate-700/50 rounded-xl flex items-end justify-between p-4 space-x-2">
          {Array.from({ length: 7 }).map((_, index) => {
            const height = Math.random() * 80 + 20
            return (
              <div
                key={index}
                className="bg-slate-600 rounded-t flex-1"
                style={{ height: `${height}%` }}
              />
            )
          })}
        </div>

        <div className="flex justify-center space-x-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
              <div className="h-3 bg-slate-700 rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Loading States for specific components
export const DashboardLoader: React.FC = () => {
  return (
    <div className="space-y-8 p-6">
      {/* Hero Section Skeleton */}
      <div className="text-center animate-pulse">
        <div className="h-12 bg-slate-700 rounded mx-auto w-1/2 mb-4"></div>
        <div className="h-4 bg-slate-700 rounded mx-auto w-1/3"></div>
      </div>

      {/* Stats Skeleton */}
      <StatsSkeleton />

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}

export const TestLoader: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="animate-pulse">
        <div className="h-8 bg-slate-700 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
      </div>

      <ListSkeleton items={3} />
    </div>
  )
}

export const AttendanceLoader: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <StatsSkeleton count={3} />
      <TableSkeleton rows={6} columns={6} />
    </div>
  )
}

// Loading wrapper component
export const LoadingWrapper: React.FC<{
  loading: boolean
  children: React.ReactNode
  skeleton?: React.ComponentType
  message?: string
}> = ({ loading, children, skeleton: SkeletonComponent, message }) => {
  if (loading) {
    return SkeletonComponent ? (
      <SkeletonComponent />
    ) : (
      <InlineLoader message={message} />
    )
  }

  return <>{children}</>
}

export default {
  FullPageLoader,
  InlineLoader,
  CardSkeleton,
  TableSkeleton,
  StatsSkeleton,
  ListSkeleton,
  FormSkeleton,
  ChartSkeleton,
  DashboardLoader,
  TestLoader,
  AttendanceLoader,
  LoadingWrapper
}