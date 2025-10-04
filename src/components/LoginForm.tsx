import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { Button, Input, icons } from './ui'
import toast from 'react-hot-toast'

const LoginForm: React.FC = () => {
  const [uid, setUid] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uid || !password) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      await login(uid, password)
      toast.success('Login successful!')
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const GraduationIcon = icons.graduation

  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-gradient-neon opacity-10 animate-gradient-x"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-neon-pink/15 rounded-full blur-2xl animate-float-gentle"></div>
      </div>
      
      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-neon rounded-2xl mb-6 shadow-neon-blue relative overflow-hidden"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="absolute inset-0 bg-gradient-neon animate-spin-slow opacity-30"></div>
            <GraduationIcon className="w-10 h-10 text-white relative z-10" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-gradient mb-2 animate-neon-pulse">ACADMATE</h1>
          <p className="text-neon-blue text-lg font-medium">Educational Test Platform</p>
          <p className="text-slate-400 text-sm mt-2">🔒 For Coaching Personnel Only</p>
        </div>

        {/* Login Card */}
        <motion.div
          className="premium-card bg-glass-dark backdrop-blur-3xl border border-glass-light rounded-3xl p-8 shadow-glass relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="absolute inset-0 bg-gradient-neon opacity-5 animate-gradient-y"></div>
          <div className="relative z-10">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-2">Welcome Back</h2>
            <p className="text-slate-400">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Input
                type="text"
                placeholder="Enter your UID (e.g., STH123, TRE456)"
                value={uid}
                onChange={(e) => setUid(e.target.value.toUpperCase())}
                icon="user"
                label="User ID"
                className="mb-4"
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon="lock"
                label="Password"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full btn-premium bg-gradient-neon hover:shadow-neon-blue py-3 text-base font-semibold transform transition-all duration-300 hover:scale-105"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  <span className="text-neon-blue animate-pulse">Authenticating...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center">
                  <icons.user className="w-4 h-4 mr-2" />
                  Sign In
                </span>
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 glass-card bg-glass-dark/30 border-gradient relative">
            <div className="absolute inset-0 bg-gradient-neon opacity-10 rounded-xl"></div>
            <div className="relative z-10">
              <h3 className="text-sm font-medium text-neon-blue mb-3 flex items-center">
                <icons.info className="w-4 h-4 mr-2 animate-pulse" />
                Demo Credentials
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-neon-green rounded-full mr-2 animate-pulse"></span>
                    Student:
                  </span>
                  <code className="glass-button bg-dark-800/50 px-3 py-1 rounded-lg text-neon-green font-mono">STH000 / demo123</code>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-neon-blue rounded-full mr-2 animate-pulse"></span>
                    Teacher:
                  </span>
                  <code className="glass-button bg-dark-800/50 px-3 py-1 rounded-lg text-neon-blue font-mono">TRE000 / demo123</code>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-neon-purple rounded-full mr-2 animate-pulse"></span>
                    Head Teacher:
                  </span>
                  <code className="glass-button bg-dark-800/50 px-3 py-1 rounded-lg text-neon-purple font-mono">HTR000 / demo123</code>
                </div>
              </div>
            </div>
            </div>
          </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-400 text-sm relative">
          <div className="flex items-center justify-center mb-2">
            <div className="h-px bg-gradient-neon w-16 opacity-50"></div>
            <span className="px-4 text-neon-blue">✨</span>
            <div className="h-px bg-gradient-neon w-16 opacity-50"></div>
          </div>
          <p className="text-gradient font-medium">© 2024 ACADMATE. All rights reserved.</p>
          <p className="mt-1 text-slate-400">🛡️ Secure authentication for educational excellence</p>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginForm