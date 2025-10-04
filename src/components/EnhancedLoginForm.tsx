import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, LogIn, BookOpen, Users, GraduationCap, AlertCircle, CheckCircle2, Sparkles, Stars, Zap, Shield, Lock, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

interface EnhancedLoginFormProps {
  onBackToHome?: () => void
}

const EnhancedLoginForm: React.FC<EnhancedLoginFormProps> = ({ onBackToHome }) => {
  const [uid, setUid] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
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

  const quickLogin = (userType: string, credentials: { uid: string; password: string }) => {
    setUid(credentials.uid)
    setPassword(credentials.password)
    toast.success(`Filled ${userType} credentials! Click Sign In to continue.`)
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Stunning Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-pink-500/20 rounded-full blur-2xl animate-float"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/50 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="relative w-full max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side - Branding */}
          <motion.div
            className="text-center lg:text-left space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            {/* Logo */}
            <motion.div
              className="flex items-center justify-center lg:justify-start gap-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="relative">
                <motion.div
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-full h-full bg-slate-950 rounded-3xl flex items-center justify-center">
                    <GraduationCap className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-3 h-3 text-slate-950" />
                </motion.div>
              </div>
              
              <div>
                <h1 className="heading-xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ACADMATE
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-blue-300 font-medium">Educational Excellence Platform</p>
                </div>
              </div>
            </motion.div>

            {/* Welcome Message */}
            <div className="space-y-4">
              <motion.h2
                className="heading-lg text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                Welcome to the Future of{' '}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Learning
                </span>
              </motion.h2>
              
              <motion.p
                className="text-xl text-slate-300 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Access your personalized dashboard, track progress, and excel in your educational journey with our advanced platform.
              </motion.p>
              
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Shield className="w-4 h-4 text-green-400" />
                  Secure Authentication
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Instant Access
                </div>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-6 pt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {[
                { number: "10K+", label: "Students", color: "from-blue-400 to-blue-600" },
                { number: "500+", label: "Teachers", color: "from-purple-400 to-purple-600" },
                { number: "99.9%", label: "Uptime", color: "from-green-400 to-green-600" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-2xl font-bold bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                    {stat.number}
                  </div>
                  <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="card-premium backdrop-blur-xl bg-slate-950/40 border-slate-700/50">
              {/* Form Header */}
              <div className="text-center mb-8">
                {onBackToHome && (
                  <button
                    onClick={onBackToHome}
                    className="absolute top-4 left-4 text-slate-400 hover:text-white transition-colors"
                  >
                    <span className="text-2xl">←</span>
                  </button>
                )}
                <h3 className="heading-md text-white mb-2">Sign In</h3>
                <p className="text-slate-400">Enter your credentials to access your dashboard</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* UID Input */}
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    User ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={uid}
                      onChange={(e) => setUid(e.target.value.toUpperCase())}
                      onFocus={() => setFocusedField('uid')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your UID (e.g., STH000)"
                      className="input-premium focus-ring pl-12"
                    />
                    <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                      focusedField === 'uid' ? 'text-blue-400' : 'text-slate-400'
                    }`} />
                  </div>
                </div>

                {/* Password Input */}
                <div className="relative">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your password"
                      className="input-premium focus-ring pl-12 pr-12"
                    />
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors ${
                      focusedField === 'password' ? 'text-blue-400' : 'text-slate-400'
                    }`} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Sign In Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="btn-premium w-full relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-3"
                      >
                        <div className="loading-premium" />
                        <span>Signing you in...</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-center gap-3"
                      >
                        <LogIn className="w-5 h-5" />
                        <span>Sign In</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-8 p-6 rounded-2xl bg-slate-800/30 border border-slate-700/30">
                <h4 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
                  <Stars className="w-4 h-4 text-yellow-400" />
                  Quick Access Demo Accounts
                </h4>
                
                <div className="grid gap-3">
                  {[
                    { type: 'Student', uid: 'SAARIC7', password: 'aaIC7', icon: GraduationCap, color: 'from-green-400 to-green-600' },
                    { type: 'Teacher', uid: 'TDRTCH', password: 'drTCH', icon: Users, color: 'from-blue-400 to-blue-600' },
                    { type: 'Head Teacher', uid: 'TMSTCH', password: 'mrTCH', icon: BookOpen, color: 'from-purple-400 to-purple-600' }
                  ].map((account, index) => (
                    <motion.button
                      key={account.uid}
                      onClick={() => quickLogin(account.type, { uid: account.uid, password: account.password })}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30 hover:border-slate-500/50 transition-all group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${account.color} flex items-center justify-center`}>
                          <account.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="text-sm font-medium text-white">{account.type}</div>
                          <div className="text-xs text-slate-400">{account.uid}</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors">
                        Click to fill
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-8 pt-6 border-t border-slate-700/30">
                <p className="text-xs text-slate-400">
                  🔒 Your data is protected with enterprise-grade security
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Footer */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent flex-1"></div>
            <div className="flex items-center gap-2 px-4">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-slate-400 text-sm">ACADMATE</span>
              <Sparkles className="w-4 h-4 text-purple-400" />
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent flex-1"></div>
          </div>
          <p className="text-slate-500 text-sm">© 2024 ACADMATE. Powering Educational Excellence Worldwide.</p>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default EnhancedLoginForm