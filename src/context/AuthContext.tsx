import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import axios from 'axios'

// API Configuration with environment detection
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '')
    return baseUrl.includes('/api') ? baseUrl : `${baseUrl}/api`
  }
  
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api'
  }
  
  return 'https://your-backend-domain.railway.app/api'
}

const API_BASE_URL = getApiBaseUrl()

interface User {
  id: string
  uid: string
  name: string
  fullName: string
  email: string
  role: 'STUDENT' | 'TEACHER' | 'HEAD_TEACHER'
  classId?: string
  batchType?: string
  subjects?: string[]
  avatar?: string
  isActive: boolean
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (uid: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        try {
          // Set user immediately from localStorage to avoid flickering
          const parsedUser = JSON.parse(userData)
          setUser(parsedUser)
          setLoading(false)
          
          // Set authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          // Validate token with server in background
          setIsValidating(true)
          const response = await axios.get(`${API_BASE_URL}/auth/validate`)
          
          // Update user data if server returns fresh data
          if (response.data.user) {
            setUser(response.data.user)
            localStorage.setItem('user', JSON.stringify(response.data.user))
          }
          setIsValidating(false)
        } catch (error) {
          console.warn('Token validation failed:', error)
          // Only clear auth if token is definitely invalid
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          delete axios.defaults.headers.common['Authorization']
          setUser(null)
          setIsValidating(false)
        }
      } else {
        setLoading(false)
      }
    }
    
    validateToken()
  }, [])

  const login = async (uid: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { uid, password })
      const { token, user } = response.data
      
      // Store auth data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Set user state immediately
      setUser(user)
      setLoading(false)
    } catch (error: any) {
      console.error('Login failed:', error)
      throw new Error(error.response?.data?.error || 'Login failed')
    }
  }


  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}