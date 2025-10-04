// Comprehensive API Configuration for Acadmate Platform
// Full-featured educational platform with tests, doubts, profiles, and analytics
import axios from 'axios';
const API_BASE_URL = 'http://localhost:5000';
// Create axios instance with base configuration
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('acadmate_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
// Handle auth errors
api.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('acadmate_token');
        localStorage.removeItem('acadmate_user');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
// Auth API
export const authAPI = {
    login: (credentials) => api.post('/api/auth/login', credentials),
    register: (userData) => api.post('/api/auth/register', userData),
    logout: () => api.post('/api/auth/logout'),
    refreshToken: () => api.post('/api/auth/refresh'),
    forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.post('/api/auth/reset-password', { token, password }),
    verifyEmail: (token) => api.post('/api/auth/verify-email', { token }),
};
// Profile API
export const profileAPI = {
    getProfile: () => api.get('/api/profile'),
    updateProfile: (data) => api.put('/api/profile', data),
    uploadAvatar: (formData) => api.post('/api/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    changePassword: (data) => api.post('/api/profile/change-password', data),
    getActivity: () => api.get('/api/profile/activity'),
    getNotifications: () => api.get('/api/profile/notifications'),
    markNotificationRead: (id) => api.patch(`/api/profile/notifications/${id}/read`),
    updateSettings: (settings) => api.put('/api/profile/settings', settings),
};
// Tests API
export const testsAPI = {
    getTests: (filters) => api.get('/api/tests', { params: filters }),
    getTest: (id) => api.get(`/api/tests/${id}`),
    createTest: (testData) => api.post('/api/tests', testData),
    updateTest: (id, testData) => api.put(`/api/tests/${id}`, testData),
    deleteTest: (id) => api.delete(`/api/tests/${id}`),
    publishTest: (id) => api.patch(`/api/tests/${id}/publish`),
    duplicateTest: (id) => api.post(`/api/tests/${id}/duplicate`),
    // Test taking
    startTest: (id) => api.post(`/api/tests/${id}/start`),
    submitTest: (id, answers) => api.post(`/api/tests/${id}/submit`, { answers }),
    getTestResults: (id) => api.get(`/api/tests/${id}/results`),
    getTestAttempts: (id) => api.get(`/api/tests/${id}/attempts`),
    // Analytics
    getTestAnalytics: (id) => api.get(`/api/tests/${id}/analytics`),
    getBatchAnalytics: (classId) => api.get(`/api/analytics/batch/${classId}`),
};
// Questions API
export const questionsAPI = {
    createQuestion: (questionData) => api.post('/api/questions', questionData),
    getQuestions: (filters) => api.get('/api/questions', { params: filters }),
    getQuestion: (id) => api.get(`/api/questions/${id}`),
    updateQuestion: (id, data) => api.put(`/api/questions/${id}`, data),
    deleteQuestion: (id) => api.delete(`/api/questions/${id}`),
    bulkImport: (formData) => api.post('/api/questions/bulk-import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getSampleQuestions: () => api.get('/api/sample-questions'),
    getSamples: () => api.get('/api/sample-questions'), // Legacy compatibility
};
// Doubts/Q&A API - Core feature of Acadmate
export const doubtsAPI = {
    // Student operations
    submitDoubt: (doubtData) => {
        const formData = new FormData();
        formData.append('title', doubtData.title);
        formData.append('description', doubtData.description);
        formData.append('subject', doubtData.subject);
        doubtData.attachments?.forEach((file, index) => {
            formData.append(`attachments[${index}]`, file);
        });
        return api.post('/api/doubts', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    getMyDoubts: (filters) => api.get('/api/doubts/my', { params: filters }),
    getDoubt: (id) => api.get(`/api/doubts/${id}`),
    // Teacher operations
    getAllDoubts: (filters) => api.get('/api/doubts', { params: filters }),
    answerDoubt: (id, answerData) => {
        const formData = new FormData();
        formData.append('answer', answerData.answer);
        answerData.attachments?.forEach((file, index) => {
            formData.append(`attachments[${index}]`, file);
        });
        return api.post(`/api/doubts/${id}/answer`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    updateDoubtStatus: (id, status) => api.patch(`/api/doubts/${id}/status`, { status }),
    assignDoubt: (id, teacherId) => api.patch(`/api/doubts/${id}/assign`, { teacherId }),
    setPriority: (id, priority) => api.patch(`/api/doubts/${id}/priority`, { priority }),
    addComment: (id, comment) => api.post(`/api/doubts/${id}/comments`, { comment }),
    getDoubtStats: () => api.get('/api/doubts/stats'),
};
// Classes & Subjects API
export const academicAPI = {
    getClasses: () => api.get('/api/classes'),
    getClass: (id) => api.get(`/api/classes/${id}`),
    createClass: (classData) => api.post('/api/classes', classData),
    updateClass: (id, data) => api.put(`/api/classes/${id}`, data),
    deleteClass: (id) => api.delete(`/api/classes/${id}`),
    getSubjects: () => api.get('/api/subjects'),
    getSubject: (id) => api.get(`/api/subjects/${id}`),
    createSubject: (subjectData) => api.post('/api/subjects', subjectData),
    updateSubject: (id, data) => api.put(`/api/subjects/${id}`, data),
    deleteSubject: (id) => api.delete(`/api/subjects/${id}`),
    getStudents: (classId) => api.get('/api/students', { params: { classId } }),
    getTeachers: () => api.get('/api/teachers'),
    assignTeacherToClass: (teacherId, classId) => api.post('/api/assignments/teacher-class', { teacherId, classId }),
    assignSubjectToTeacher: (teacherId, subjectId) => api.post('/api/assignments/teacher-subject', { teacherId, subjectId }),
};
// Analytics & Reports API
export const analyticsAPI = {
    getDashboardStats: () => api.get('/api/analytics/dashboard'),
    getPerformanceReport: (filters) => api.get('/api/analytics/performance', { params: filters }),
    getTestReport: (testId) => api.get(`/api/analytics/test/${testId}`),
    getStudentReport: (studentId) => api.get(`/api/analytics/student/${studentId}`),
    getClassReport: (classId) => api.get(`/api/analytics/class/${classId}`),
    getSubjectReport: (subjectId) => api.get(`/api/analytics/subject/${subjectId}`),
    exportReport: (type, filters) => api.get(`/api/analytics/export/${type}`, {
        params: filters,
        responseType: 'blob'
    }),
};
// File Upload API
export const fileAPI = {
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return api.post('/api/upload/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    uploadDocument: (file) => {
        const formData = new FormData();
        formData.append('document', file);
        return api.post('/api/upload/document', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    deleteFile: (fileId) => api.delete(`/api/upload/${fileId}`),
};
// System/Health API
export const systemAPI = {
    health: () => api.get('/api/health'),
    getServerStats: () => api.get('/api/system/stats'),
    checkDatabase: () => api.get('/api/system/database'),
};
// Test API (for leaderboard integration and offline tests)
export const testAPI = {
    // Leaderboard endpoints
    getMonthlyLeaderboard: (params) => api.get('/api/leaderboard/monthly', { params }),
    getTestLeaderboards: (params) => api.get('/api/leaderboard/tests', { params }),
    getOverallLeaderboard: (params) => api.get('/api/leaderboard/overall', { params }),
    getUserLeaderboardStats: (userId, params) => api.get(`/api/leaderboard/user/${userId}/stats`, { params }),
    
    // Offline test endpoints
    getOfflineTests: (params) => api.get('/api/tests/offline', { params }),
    createOfflineTest: (data) => api.post('/api/tests/offline', data),
    updateOfflineTest: (id, data) => api.put(`/api/tests/offline/${id}`, data),
    deleteOfflineTest: (id) => api.delete(`/api/tests/offline/${id}`),
    startOfflineTest: (id) => api.patch(`/api/tests/offline/${id}/start`),
    completeOfflineTest: (id) => api.patch(`/api/tests/offline/${id}/complete`),
    gradeOfflineTestSubmissions: (id, data) => api.post(`/api/tests/offline/${id}/grade`, data),
    getOfflineTestDetails: (id) => api.get(`/api/tests/offline/${id}`),
    sendTestNotifications: (id) => api.post(`/api/tests/offline/${id}/notify`),
};

// Admin API
export const adminAPI = {
    // User Management
    getAllUsers: (params) => api.get('/api/admin/users', { params }),
    createUser: (data) => api.post('/api/admin/users', data),
    updateUser: (id, data) => api.put(`/api/admin/users/${id}`, data),
    deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
    bulkUserOperations: (operation, userIds, data = {}) => api.post('/api/admin/users/bulk', { operation, userIds, ...data }),
    
    // Teacher Activities
    getTeacherActivities: (params) => api.get('/api/admin/teacher-activities', { params }),
    getTeacherStats: (params) => api.get('/api/admin/teacher-stats', { params }),
    exportTeacherData: (params) => api.get('/api/admin/export/teacher-data', { params, responseType: 'blob' }),
    
    // System Statistics
    getSystemStatistics: (params) => api.get('/api/admin/system-stats', { params }),
    getActivityTrends: (params) => api.get('/api/admin/activity-trends', { params }),
    getBatchWiseStatistics: (params) => api.get('/api/admin/batch-stats', { params }),
    exportSystemReport: (params) => api.get('/api/admin/export/system-report', { params, responseType: 'blob' }),
};

// Attendance Management API
export const attendanceAPI = {
    // Get today's classes for attendance marking
    getTodayClasses: (params) => api.get('/api/attendance/today-classes', { params }),
    
    // Get scheduled classes for any date
    getScheduledClasses: (params) => api.get('/api/attendance/scheduled-classes', { params }),
    
    // Mark attendance for a class
    markAttendance: (classId, data) => api.post(`/api/attendance/classes/${classId}/mark`, data),
    
    // Bulk mark attendance (all present/absent)
    bulkMarkAttendance: (classId, data) => api.post(`/api/attendance/classes/${classId}/bulk-mark`, data),
    
    // Get attendance history with filters
    getAttendanceHistory: (params) => api.get('/api/attendance/history', { params }),
    
    // Get attendance statistics
    getAttendanceStats: (params) => api.get('/api/attendance/stats', { params }),
    
    // Get individual student attendance
    getStudentAttendance: (studentId, params) => api.get(`/api/attendance/student/${studentId}`, { params }),
    
    // Get class-wise attendance report
    getClassAttendanceReport: (classId, params) => api.get(`/api/attendance/class/${classId}/report`, { params }),
    
    // Export attendance data
    exportAttendance: (params) => api.get('/api/attendance/export', { 
        params, 
        responseType: 'blob' 
    }),
    
    // Update attendance record
    updateAttendance: (recordId, data) => api.put(`/api/attendance/records/${recordId}`, data),
    
    // Delete attendance record
    deleteAttendance: (recordId) => api.delete(`/api/attendance/records/${recordId}`),
    
    // Get attendance summary for dashboard
    getAttendanceSummary: (params) => api.get('/api/attendance/summary', { params }),
    
    // Send attendance notifications
    sendAttendanceNotifications: (classId, data) => api.post(`/api/attendance/classes/${classId}/notify`, data),
    
    // Get low attendance alerts
    getLowAttendanceAlerts: (params) => api.get('/api/attendance/alerts', { params })
};

// Homework API
export const homeworkAPI = {
    // Teacher operations
    createHomework: (data) => api.post('/api/homework', data),
    getHomework: (params) => api.get('/api/homework', { params }),
    getHomeworkById: (id) => api.get(`/api/homework/${id}`),
    updateHomework: (id, data) => api.put(`/api/homework/${id}`, data),
    deleteHomework: (id) => api.delete(`/api/homework/${id}`),
    getHomeworkSubmissions: (id, params) => api.get(`/api/homework/${id}/submissions`, { params }),
    gradeHomework: (homeworkId, submissionId, data) => api.put(`/api/homework/${homeworkId}/submissions/${submissionId}/grade`, data),
    
    // Student operations
    getStudentHomework: (params) => api.get('/api/homework/student', { params }),
    submitHomework: (id, data) => {
        const formData = new FormData();
        formData.append('submissionText', data.submissionText || '');
        formData.append('reason', data.reason || '');
        data.images?.forEach((file, index) => {
            formData.append(`images`, file);
        });
        data.documents?.forEach((file, index) => {
            formData.append(`documents`, file);
        });
        return api.post(`/api/homework/${id}/submit`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
};

// Legacy compatibility for existing components
export const healthAPI = {
    check: () => api.get('/health'),
};
export const subjectsAPI = {
    getAll: () => api.get('/api/subjects'),
};
export const statsAPI = {
    getAll: () => api.get('/api/stats'),
};
// Legacy API client for backward compatibility
export class ApiClient {
    constructor(baseURL = API_BASE_URL) {
        this.baseURL = baseURL;
    }
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const defaultOptions = {
            headers: { 'Content-Type': 'application/json' },
            ...options,
        };
        try {
            console.log(`🔗 API Request: ${options.method || 'GET'} ${url}`);
            const response = await fetch(url, defaultOptions);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(`✅ API Success: ${endpoint}`, data);
            return data;
        }
        catch (error) {
            console.error(`❌ API Error: ${endpoint}`, error);
            throw error;
        }
    }
    async healthCheck() {
        return this.request('/health');
    }
    async getSampleQuestions(params) {
        const queryParams = new URLSearchParams();
        if (params?.limit)
            queryParams.append('limit', params.limit.toString());
        if (params?.subject)
            queryParams.append('subject', params.subject);
        if (params?.class)
            queryParams.append('class', params.class);
        if (params?.difficulty)
            queryParams.append('difficulty', params.difficulty);
        const query = queryParams.toString();
        const endpoint = query ? `/api/sample-questions?${query}` : '/api/sample-questions';
        return this.request(endpoint);
    }
    async getSubjects() {
        return this.request('/api/subjects');
    }
    async getClasses() {
        return this.request('/api/classes');
    }
    async getStats() {
        return this.request('/api/stats');
    }
}
export const apiClient = new ApiClient();
// Utility functions
export const apiUtils = {
    getImageUrl: (path) => `${API_BASE_URL}/uploads/images/${path}`,
    getDocumentUrl: (path) => `${API_BASE_URL}/uploads/documents/${path}`,
    handleApiError: (error) => {
        if (error.response?.data?.message) {
            return error.response.data.message;
        }
        if (error.message) {
            return error.message;
        }
        return 'An unexpected error occurred';
    },
    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
};
export default api;
console.log('🚀 Acadmate API Client initialized');
console.log(`📡 Backend URL: ${API_BASE_URL}`);
