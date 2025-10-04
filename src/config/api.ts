// Comprehensive API Configuration for Acadmate Platform
// Full-featured educational platform with tests, doubts, profiles, and analytics

import axios from 'axios'

// API Configuration with environment detection
const getApiBaseUrl = () => {
  // Check for production environment variable first
  if (import.meta.env.VITE_API_URL) {
    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '') // Remove trailing slash
    return baseUrl.includes('/api') ? baseUrl : `${baseUrl}/api`
  }
  
  // Development fallback
  if (import.meta.env.DEV) {
    return 'http://localhost:5000/api'
  }
  
  // Production fallback - will be replaced during build
  return 'https://your-backend-domain.railway.app/api'
}

const API_BASE_URL = getApiBaseUrl()

// Log the API URL in development
if (import.meta.env.DEV) {
  console.log('🔗 API Base URL:', API_BASE_URL)
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('acadmate_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('acadmate_token')
      localStorage.removeItem('acadmate_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/api/auth/login', credentials),
  register: (userData: { 
    name: string; 
    email: string; 
    password: string; 
    role: 'STUDENT' | 'TEACHER' | 'HEAD_TEACHER';
    classId?: string;
    subjectId?: string;
  }) => api.post('/api/auth/register', userData),
  logout: () => api.post('/api/auth/logout'),
  refreshToken: () => api.post('/api/auth/refresh'),
  forgotPassword: (email: string) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => 
    api.post('/api/auth/reset-password', { token, password }),
  verifyEmail: (token: string) => api.post('/api/auth/verify-email', { token }),
}

// Profile API
export const profileAPI = {
  getProfile: () => api.get('/api/profile'),
  updateProfile: (data: any) => api.put('/api/profile', data),
  uploadAvatar: (formData: FormData) => 
    api.post('/api/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post('/api/profile/change-password', data),
  getActivity: () => api.get('/api/profile/activity'),
  getNotifications: () => api.get('/api/profile/notifications'),
  markNotificationRead: (id: string) => api.patch(`/api/profile/notifications/${id}/read`),
  updateSettings: (settings: any) => api.put('/api/profile/settings', settings),
}

// Tests API
export const testsAPI = {
  getTests: (filters?: any) => api.get('/api/tests', { params: filters }),
  getTest: (id: string) => api.get(`/api/tests/${id}`),
  createTest: (testData: any) => api.post('/api/tests', testData),
  updateTest: (id: string, testData: any) => api.put(`/api/tests/${id}`, testData),
  deleteTest: (id: string) => api.delete(`/api/tests/${id}`),
  publishTest: (id: string) => api.patch(`/api/tests/${id}/publish`),
  duplicateTest: (id: string) => api.post(`/api/tests/${id}/duplicate`),
  
  // Test taking
  startTest: (id: string) => api.post(`/api/tests/${id}/start`),
  submitTest: (id: string, answers: any) => api.post(`/api/tests/${id}/submit`, { answers }),
  getTestResults: (id: string) => api.get(`/api/tests/${id}/results`),
  getTestAttempts: (id: string) => api.get(`/api/tests/${id}/attempts`),
  
  // Analytics
  getTestAnalytics: (id: string) => api.get(`/api/tests/${id}/analytics`),
  getBatchAnalytics: (classId: string) => api.get(`/api/analytics/batch/${classId}`),
}

// Questions API
export const questionsAPI = {
  createQuestion: (questionData: any) => api.post('/api/questions', questionData),
  getQuestions: (filters?: any) => api.get('/api/questions', { params: filters }),
  getQuestion: (id: string) => api.get(`/api/questions/${id}`),
  updateQuestion: (id: string, data: any) => api.put(`/api/questions/${id}`, data),
  deleteQuestion: (id: string) => api.delete(`/api/questions/${id}`),
  bulkImport: (formData: FormData) => 
    api.post('/api/questions/bulk-import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getSampleQuestions: () => api.get('/api/sample-questions'),
  getSamples: () => api.get('/api/sample-questions'), // Legacy compatibility
}

// Doubts/Q&A API - Core feature of Acadmate
export const doubtsAPI = {
  // Student operations
  submitDoubt: (doubtData: { 
    title: string; 
    description: string; 
    subject: string; 
    attachments?: File[] 
  }) => {
    const formData = new FormData()
    formData.append('title', doubtData.title)
    formData.append('description', doubtData.description)
    formData.append('subject', doubtData.subject)
    doubtData.attachments?.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file)
    })
    return api.post('/api/doubts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  getMyDoubts: (filters?: { status?: string; subject?: string; page?: number }) => 
    api.get('/api/doubts/my', { params: filters }),
  
  getDoubt: (id: string) => api.get(`/api/doubts/${id}`),
  
  // Teacher operations
  getAllDoubts: (filters?: { 
    status?: string; 
    subject?: string; 
    priority?: string;
    classId?: string;
    page?: number;
  }) => api.get('/api/doubts', { params: filters }),
  
  answerDoubt: (id: string, answerData: { 
    answer: string; 
    attachments?: File[] 
  }) => {
    const formData = new FormData()
    formData.append('answer', answerData.answer)
    answerData.attachments?.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file)
    })
    return api.post(`/api/doubts/${id}/answer`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  updateDoubtStatus: (id: string, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED') =>
    api.patch(`/api/doubts/${id}/status`, { status }),
  
  assignDoubt: (id: string, teacherId: string) =>
    api.patch(`/api/doubts/${id}/assign`, { teacherId }),
  
  setPriority: (id: string, priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT') =>
    api.patch(`/api/doubts/${id}/priority`, { priority }),
  
  addComment: (id: string, comment: string) =>
    api.post(`/api/doubts/${id}/comments`, { comment }),
  
  getDoubtStats: () => api.get('/api/doubts/stats'),
}

// Classes & Subjects API
export const academicAPI = {
  getClasses: () => api.get('/api/classes'),
  getClass: (id: string) => api.get(`/api/classes/${id}`),
  createClass: (classData: any) => api.post('/api/classes', classData),
  updateClass: (id: string, data: any) => api.put(`/api/classes/${id}`, data),
  deleteClass: (id: string) => api.delete(`/api/classes/${id}`),
  
  getSubjects: () => api.get('/api/subjects'),
  getSubject: (id: string) => api.get(`/api/subjects/${id}`),
  createSubject: (subjectData: any) => api.post('/api/subjects', subjectData),
  updateSubject: (id: string, data: any) => api.put(`/api/subjects/${id}`, data),
  deleteSubject: (id: string) => api.delete(`/api/subjects/${id}`),
  
  getStudents: (classId?: string) => api.get('/api/students', { params: { classId } }),
  getTeachers: () => api.get('/api/teachers'),
  
  assignTeacherToClass: (teacherId: string, classId: string) =>
    api.post('/api/assignments/teacher-class', { teacherId, classId }),
  
  assignSubjectToTeacher: (teacherId: string, subjectId: string) =>
    api.post('/api/assignments/teacher-subject', { teacherId, subjectId }),
}

// Analytics & Reports API
export const analyticsAPI = {
  getDashboardStats: () => api.get('/api/analytics/dashboard'),
  getPerformanceReport: (filters?: any) => 
    api.get('/api/analytics/performance', { params: filters }),
  getTestReport: (testId: string) => api.get(`/api/analytics/test/${testId}`),
  getStudentReport: (studentId: string) => api.get(`/api/analytics/student/${studentId}`),
  getClassReport: (classId: string) => api.get(`/api/analytics/class/${classId}`),
  getSubjectReport: (subjectId: string) => api.get(`/api/analytics/subject/${subjectId}`),
  
  exportReport: (type: string, filters?: any) =>
    api.get(`/api/analytics/export/${type}`, { 
      params: filters,
      responseType: 'blob'
    }),
}

// Scheduling API
export const schedulingAPI = {
  // Get scheduled classes
  getClasses: (filters?: { date?: string; batchType?: string; teacherId?: string }) =>
    api.get('/api/scheduling', { params: filters }),
    
  // Get user's classes based on role
  getMyClasses: (date?: string) =>
    api.get('/api/scheduling/my-classes', { params: { date } }),
    
  // Create new class schedule (HEAD_TEACHER only)
  scheduleClass: (classData: {
    subject: string;
    teacherId: string;
    batchType: string;
    roomNumber: string;
    date: string;
    startTime: string;
    endTime: string;
    topic?: string;
    description?: string;
  }) => api.post('/api/scheduling', classData),
  
  // Update class schedule
  updateClass: (id: string, data: any) =>
    api.put(`/api/scheduling/${id}`, data),
    
  // Delete class schedule
  deleteClass: (id: string) =>
    api.delete(`/api/scheduling/${id}`),
}

// Attendance API
export const attendanceAPI = {
  // Mark attendance for a class (TEACHER or HEAD_TEACHER)
  markAttendance: (data: {
    classScheduleId: string;
    attendanceData: Array<{
      studentId: string;
      status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
      notes?: string;
    }>;
  }) => api.post('/api/attendance/mark', data),
  
  // Get attendance for a specific class
  getClassAttendance: (classScheduleId: string) =>
    api.get(`/api/attendance/class/${classScheduleId}`),
    
  // Get attendance history for a student
  getStudentAttendance: (studentId: string, filters?: {
    startDate?: string;
    endDate?: string;
    subject?: string;
  }) => api.get(`/api/attendance/student/${studentId}`, { params: filters }),
  
  // Get attendance summary for a batch (HEAD_TEACHER only)
  getBatchAttendance: (batchType: string, filters?: {
    startDate?: string;
    endDate?: string;
  }) => api.get(`/api/attendance/batch/${batchType}`, { params: filters }),
  
  // Get students for marking attendance
  getStudentsForClass: (classScheduleId: string) =>
    api.get(`/api/attendance/students/${classScheduleId}`),
}

// Enhanced Notifications API
export const notificationsAPI = {
  // Send notification (HEAD_TEACHER only)
  sendNotification: (data: {
    title: string;
    message: string;
    type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
    recipients: {
      type: 'all' | 'students' | 'teachers' | 'batch';
      batchType?: string;
    };
    actionUrl?: string;
  }) => api.post('/api/notifications/send', data),
  
  // Get user's notifications
  getMyNotifications: (params?: {
    page?: number;
    limit?: number;
    unreadOnly?: boolean;
  }) => api.get('/api/notifications/my-notifications', { params }),
  
  // Legacy route for backward compatibility
  getNotifications: (filters?: { isRead?: boolean }) =>
    api.get('/api/notifications', { params: filters }),
    
  // Get unread count
  getUnreadCount: () => api.get('/api/notifications/unread-count'),
  
  // Mark notification as read
  markAsRead: (id: string) =>
    api.patch(`/api/notifications/${id}/read`),
    
  // Mark all notifications as read
  markAllAsRead: () =>
    api.patch('/api/notifications/mark-all-read'),
    
  // Delete notification
  deleteNotification: (id: string) =>
    api.delete(`/api/notifications/${id}`),
    
  // Get notification statistics (HEAD_TEACHER only)
  getStats: (filters?: { startDate?: string; endDate?: string }) =>
    api.get('/api/notifications/stats', { params: filters }),
    
  // Get all notifications (HEAD_TEACHER only)
  getAllNotifications: (params?: {
    page?: number;
    limit?: number;
    type?: string;
    userId?: string;
  }) => api.get('/api/notifications/all', { params }),
  
  // Get available recipients (HEAD_TEACHER only)
  getRecipients: () => api.get('/api/notifications/recipients'),
}

// Homework API - Complete homework management system
export const homeworkAPI = {
  // Teacher operations
  createHomework: (homeworkData: {
    title: string;
    description: string;
    instructions?: string;
    subject: string;
    batchType: string;
    dueDate: string;
    totalMarks?: number;
    homeworkFile?: File;
  }) => {
    const formData = new FormData()
    formData.append('title', homeworkData.title)
    formData.append('description', homeworkData.description)
    formData.append('instructions', homeworkData.instructions || '')
    formData.append('subject', homeworkData.subject)
    formData.append('batchType', homeworkData.batchType)
    formData.append('dueDate', homeworkData.dueDate)
    formData.append('totalMarks', (homeworkData.totalMarks || 10).toString())
    if (homeworkData.homeworkFile) {
      formData.append('homeworkFile', homeworkData.homeworkFile)
    }
    return api.post('/homework', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  getHomeworkAssignments: (filters?: {
    batchType?: string;
    status?: string;
    teacherId?: string;
  }) => api.get('/homework', { params: filters }),

  getHomeworkById: (id: string) => api.get(`/homework/${id}`),

  gradeSubmission: (submissionId: string, gradeData: {
    marksObtained: number;
    teacherRemarks?: string;
    grade?: string;
  }) => api.put(`/homework/submissions/${submissionId}/grade`, gradeData),

  getHomeworkStatistics: (filters?: {
    batchType?: string;
    teacherId?: string;
  }) => api.get('/homework/statistics', { params: filters }),

  // Student operations
  submitHomework: (homeworkId: string, submissionData: {
    submissionType: 'TEXT' | 'IMAGE' | 'DOCUMENT' | 'UNABLE_TO_COMPLETE';
    textContent?: string;
    unableReason?: string;
    submissionFile?: File;
  }) => {
    const formData = new FormData()
    formData.append('submissionType', submissionData.submissionType)
    if (submissionData.textContent) {
      formData.append('textContent', submissionData.textContent)
    }
    if (submissionData.unableReason) {
      formData.append('unableReason', submissionData.unableReason)
    }
    if (submissionData.submissionFile) {
      formData.append('submissionFile', submissionData.submissionFile)
    }
    return api.post(`/homework/${homeworkId}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },

  getMySubmissions: (filters?: {
    status?: string;
    subject?: string;
  }) => api.get('/homework/my-submissions', { params: filters }),
}

// Admin API - Head Teacher administration features
export const adminAPI = {
  // User Management
  getAllUsers: (filters?: {
    role?: string;
    batchType?: string;
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) => api.get('/admin/users', { params: filters }),

  getUserDetails: (userId: string) => api.get(`/admin/users/${userId}`),

  createUser: (userData: {
    uid: string;
    fullName: string;
    role: 'STUDENT' | 'TEACHER' | 'HEAD_TEACHER';
    batchType?: string;
    subjects?: string[];
    roomNumber?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    password: string;
  }) => api.post('/admin/users', userData),

  updateUser: (userId: string, userData: {
    fullName?: string;
    role?: 'STUDENT' | 'TEACHER' | 'HEAD_TEACHER';
    batchType?: string;
    subjects?: string[];
    roomNumber?: string;
    phone?: string;
    address?: string;
    dateOfBirth?: string;
    isActive?: boolean;
  }) => api.put(`/admin/users/${userId}`, userData),

  deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),

  bulkUserOperations: (operation: 'activate' | 'deactivate' | 'changeBatch', userIds: string[], data?: any) =>
    api.post('/admin/users/bulk', { operation, userIds, data }),

  // Teacher Management
  getTeacherActivities: () => api.get('/admin/teachers/activities'),

  changeTeacherBatch: (teacherId: string, batchData: {
    batchType: string;
    subjects?: string[];
  }) => api.put(`/admin/teachers/${teacherId}/batch`, batchData),

  // Statistics
  getAdminStatistics: () => api.get('/admin/statistics'),
}

// File Upload API
export const fileAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    return api.post('/api/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  uploadDocument: (file: File) => {
    const formData = new FormData()
    formData.append('document', file)
    return api.post('/api/upload/document', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  deleteFile: (fileId: string) => api.delete(`/api/upload/${fileId}`),
}

// System/Health API
export const systemAPI = {
  health: () => api.get('/api/health'),
  getServerStats: () => api.get('/api/system/stats'),
  checkDatabase: () => api.get('/api/system/database'),
}

// Legacy compatibility for existing components
export const healthAPI = {
  check: () => api.get('/health'),
}

export const subjectsAPI = {
  getAll: () => api.get('/api/subjects'),
}

export const statsAPI = {
  getAll: () => api.get('/api/stats'),
}

// Legacy API client for backward compatibility
export class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const defaultOptions: RequestInit = {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    }

    try {
      console.log(`🔗 API Request: ${options.method || 'GET'} ${url}`)
      const response = await fetch(url, defaultOptions)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log(`✅ API Success: ${endpoint}`, data)
      return data
    } catch (error) {
      console.error(`❌ API Error: ${endpoint}`, error)
      throw error
    }
  }

  async healthCheck() {
    return this.request('/health')
  }

  async getSampleQuestions(params?: any) {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.subject) queryParams.append('subject', params.subject)
    if (params?.class) queryParams.append('class', params.class)
    if (params?.difficulty) queryParams.append('difficulty', params.difficulty)
    
    const query = queryParams.toString()
    const endpoint = query ? `/api/sample-questions?${query}` : '/api/sample-questions'
    return this.request(endpoint)
  }

  async getSubjects() {
    return this.request('/api/subjects')
  }

  async getClasses() {
    return this.request('/api/classes')
  }

  async getStats() {
    return this.request('/api/stats')
  }
}

export const apiClient = new ApiClient()

// Utility functions
export const apiUtils = {
  getImageUrl: (path: string) => `${API_BASE_URL}/uploads/images/${path}`,
  getDocumentUrl: (path: string) => `${API_BASE_URL}/uploads/documents/${path}`,
  
  handleApiError: (error: any) => {
    if (error.response?.data?.message) {
      return error.response.data.message
    }
    if (error.message) {
      return error.message
    }
    return 'An unexpected error occurred'
  },
  
  formatDate: (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

// TypeScript interfaces for the platform
export interface User {
  id: string
  name: string
  email: string
  role: 'STUDENT' | 'TEACHER' | 'HEAD_TEACHER'
  classId?: string
  subjectId?: string
  avatar?: string
  isActive: boolean
  createdAt: string
}

export interface Test {
  id: string
  title: string
  description: string
  subject: string
  class: string
  duration: number
  totalMarks: number
  questions: Question[]
  isPublished: boolean
  createdBy: string
  createdAt: string
}

export interface Question {
  id: string
  type: 'MCQ' | 'FILL_BLANK' | 'MATCH_FOLLOWING' | 'MULTIPLE_CORRECT' | 'DESCRIPTIVE' | 'SHORT_ANSWER' | 'INTEGER'
  text: string
  options?: string[]
  correctAnswers: string[]
  explanation?: string
  marks: number
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  image?: string
}

export interface Doubt {
  id: string
  title: string
  description: string
  subject: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  studentId: string
  studentName: string
  assignedTeacherId?: string
  assignedTeacherName?: string
  attachments?: string[]
  answer?: string
  answerAttachments?: string[]
  createdAt: string
  resolvedAt?: string
}

export interface SampleQuestion {
  id: string
  subject: string
  class: string
  type: 'MCQ' | 'SHORT_ANSWER' | 'INTEGER'
  text: string
  options: string[]
  correctAnswers: string[]
  explanation: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  tags: string[]
  createdAt: string
}

export interface ApiResponse<T> {
  success: boolean
  count?: number
  total?: number
  data?: T
  error?: string
  message?: string
}

export default api

console.log('🚀 Acadmate API Client initialized')
console.log(`📡 Backend URL: ${API_BASE_URL}`)
