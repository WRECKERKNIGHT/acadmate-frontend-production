import React from 'react'
import { motion } from 'framer-motion'
import { 
  BookOpen, Users, Calendar, BarChart3, Settings, Bell, 
  Search, Filter, Plus, Edit, Trash2, Eye, Download,
  CheckCircle, XCircle, Clock, AlertTriangle, Info,
  User, Mail, Phone, MapPin, GraduationCap, Award,
  MessageSquare, Video, FileText, Upload, Star,
  ChevronRight, ChevronLeft, ChevronUp, ChevronDown,
  Menu, X, Home, LogOut, RefreshCw, Send, Save, Lock
} from 'lucide-react'

// Icon mapping for easy access
export const icons = {
  // Navigation
  home: Home,
  users: Users,
  calendar: Calendar,
  chart: BarChart3,
  settings: Settings,
  bell: Bell,
  menu: Menu,
  close: X,
  logout: LogOut,
  
  // Actions
  search: Search,
  filter: Filter,
  plus: Plus,
  edit: Edit,
  delete: Trash2,
  view: Eye,
  download: Download,
  upload: Upload,
  send: Send,
  save: Save,
  refresh: RefreshCw,
  
  // Status
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  clock: Clock,
  star: Star,
  
  // Educational
  book: BookOpen,
  graduation: GraduationCap,
  award: Award,
  
  // Communication
  message: MessageSquare,
  video: Video,
  file: FileText,
  
  // User
  user: User,
  mail: Mail,
  phone: Phone,
  location: MapPin,
  lock: Lock,
  
  // Arrows
  right: ChevronRight,
  left: ChevronLeft,
  up: ChevronUp,
  down: ChevronDown,
}

// Card Component
interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  gradient?: boolean
  onClick?: () => void
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false, 
  gradient = false, 
  onClick 
}) => {
  const baseClasses = `
    rounded-2xl border transition-all duration-300
    ${gradient 
      ? 'bg-gradient-to-br from-slate-800/50 via-slate-700/30 to-slate-600/20 border-slate-600/30' 
      : 'bg-slate-800/50 border-slate-700/50 backdrop-blur-sm'
    }
    ${hover ? 'hover:bg-slate-700/60 hover:border-slate-600/50 hover:shadow-xl hover:shadow-blue-500/10' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `
  
  return (
    <motion.div
      className={baseClasses}
      onClick={onClick}
      whileHover={hover ? { y: -2, scale: 1.02 } : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

// Button Component
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  icon?: keyof typeof icons
  iconPosition?: 'left' | 'right'
  onClick?: (e?: React.MouseEvent) => void
  disabled?: boolean
  className?: string
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  onClick,
  disabled = false,
  className = '',
  loading = false,
  type = 'button'
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900'
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-200 focus:ring-slate-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
    error: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  
  const IconComponent = icon ? icons[icon] : null
  
  return (
    <motion.button
      type={type}
      className={`
        ${baseClasses} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''} 
        ${className}
      `}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
    >
      {loading && <RefreshCw className="w-4 h-4 animate-spin mr-2" />}
      {icon && iconPosition === 'left' && !loading && IconComponent && (
        <IconComponent className="w-4 h-4 mr-2" />
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && IconComponent && (
        <IconComponent className="w-4 h-4 ml-2" />
      )}
    </motion.button>
  )
}

// Input Component
interface InputProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  icon?: keyof typeof icons
  className?: string
  label?: string
  error?: string
  min?: string
  max?: string
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  icon,
  className = '',
  label,
  error,
  min,
  max
}) => {
  const IconComponent = icon ? icons[icon] : null
  
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        {IconComponent && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IconComponent className="w-5 h-5 text-slate-400" />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          className={`
            w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2.5 text-slate-200 
            placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
            focus:outline-none transition-colors
            ${IconComponent ? 'pl-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          `}
        />
      </div>
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}

// Badge Component
interface BadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'sm',
  className = ''
}) => {
  const variants = {
    primary: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
    success: 'bg-green-600/20 text-green-400 border-green-600/30',
    warning: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
    error: 'bg-red-600/20 text-red-400 border-red-600/30',
    info: 'bg-cyan-600/20 text-cyan-400 border-cyan-600/30'
  }
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  }
  
  return (
    <span className={`
      inline-flex items-center rounded-full border font-medium
      ${variants[variant]} 
      ${sizes[size]} 
      ${className}
    `}>
      {children}
    </span>
  )
}

// Modal Component
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  if (!isOpen) return null
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }
  
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div 
        className="absolute inset-0 bg-slate-900/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        className={`
          relative bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl 
          ${sizes[size]} w-full max-h-[90vh] overflow-auto
        `}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
          <Button
            variant="secondary"
            size="sm"
            icon="close"
            onClick={onClose}
            className="p-2"
          >
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}

// Loading Component
export const Loading: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
  </div>
)

// Stats Card Component
interface StatsCardProps {
  title: string
  value: string | number
  icon: keyof typeof icons
  trend?: {
    value: number
    isPositive: boolean
  }
  gradient?: boolean
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  trend,
  gradient = false
}) => {
  const IconComponent = icons[icon]
  
  return (
    <Card className="p-6" gradient={gradient} hover>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-slate-100 mt-1">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend.isPositive ? 'text-green-400' : 'text-red-400'
            }`}>
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        <div className="p-3 rounded-full bg-blue-600/20">
          <IconComponent className="w-6 h-6 text-blue-400" />
        </div>
      </div>
    </Card>
  )
}