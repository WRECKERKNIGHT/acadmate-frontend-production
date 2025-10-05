import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// API Configuration


// Fix for Vite env typing (declare globally)
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface User {
  id: string;
  email: string;
  name?: string;
  fullName?: string;
  role: 'STUDENT' | 'TEACHER' | 'HEAD_TEACHER' | 'student' | 'teacher' | 'admin' | 'head_teacher';
  classId?: string;
  batchType?: string;
  subjects?: string[];
  avatar?: string;
  isActive?: boolean;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (uid: string, password: string) => Promise<User>;
  logout: () => void;
  signup?: (userData: any) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          // Try to validate token with server
          try {
            const response = await apiClient.get('/auth/me');
            const freshUserData = response.data.user || response.data;
            setUser(freshUserData);
            localStorage.setItem('userData', JSON.stringify(freshUserData));
          } catch (error) {
            console.warn('Token validation failed, but using cached user data');
          }
        } catch (error) {
          console.error('Auth initialization failed:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (uid: string, password: string): Promise<User> => {
    try {
      // Try backend with UID
      const response = await apiClient.post('/auth/login', { uid, password });
      const { user: userData, token } = response.data;
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error: any) {
      console.error('Backend login failed, trying demo mode:', error);
      // Demo mode fallback for development/testing
      const demoUsers: { [key: string]: User } = {
        'STH000': {
          id: 'demo-student-1',
          email: 'student@acadmate.com',
          name: 'Demo Student',
          fullName: 'Demo Student User',
          role: 'student'
        },
        'TRE000': {
          id: 'demo-teacher-1',
          email: 'teacher@acadmate.com',
          name: 'Demo Teacher',
          fullName: 'Demo Teacher User',
          role: 'teacher'
        },
        'HTR000': {
          id: 'demo-admin-1',
          email: 'admin@acadmate.com',
          name: 'Demo Admin',
          fullName: 'Demo Admin User',
          role: 'admin'
        }
      };
      const demoUser = demoUsers[uid.toUpperCase()];
      if (demoUser && password.includes('demo123')) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const demoToken = `demo-token-${demoUser.role}-${Date.now()}`;
        localStorage.setItem('authToken', demoToken);
        localStorage.setItem('userData', JSON.stringify(demoUser));
        setUser(demoUser);
        return demoUser;
      }
      const message = error.response?.data?.message || 
                     error.response?.data?.error || 
                     'Invalid UID or password';
      throw new Error(message);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    
    toast.success('🚪 Logged out successfully', {
      style: {
        background: '#0a0a0a',
        color: '#00ffff',
        border: '1px solid #00ffff',
      }
    });
  };

  const signup = async (userData: any): Promise<User> => {
    try {
      const response = await apiClient.post('/auth/signup', userData);
      const { user: newUser, token } = response.data;
      
      localStorage.setItem('authToken', token);
      localStorage.setItem('userData', JSON.stringify(newUser));
      setUser(newUser);
      
      return newUser;
    } catch (error: any) {
      const message = error.response?.data?.message || 
                     error.response?.data?.error || 
                     'Signup failed';
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
}
