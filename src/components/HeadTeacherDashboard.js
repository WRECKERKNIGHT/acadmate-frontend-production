import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, BarChart3, Settings, UserCheck, TrendingUp, Shield, User, LogOut, Bell, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI } from '../config/api';
import AcadmateProfile from './AcadmateProfile';
const HeadTeacherDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showProfile, setShowProfile] = useState(false);
    const [notifications, setNotifications] = useState([]);
    useEffect(() => {
        loadAdminData();
    }, []);
    const loadAdminData = async () => {
        try {
            setLoading(true);
            const response = await analyticsAPI.getDashboardStats();
            setStats(response.data || {
                totalStudents: 0,
                totalTeachers: 0,
                totalTests: 0,
                totalDoubts: 0,
                activeClasses: 0,
                systemHealth: 'Good',
                monthlyGrowth: 0
            });
        }
        catch (error) {
            console.error('Error loading admin data:', error);
            setStats({
                totalStudents: 0,
                totalTeachers: 0,
                totalTests: 0,
                totalDoubts: 0,
                activeClasses: 0,
                systemHealth: 'Good',
                monthlyGrowth: 0
            });
        }
        finally {
            setLoading(false);
        }
    };
    const renderContent = () => {
        if (loading) {
            return (_jsx("div", { className: "flex justify-center items-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" }) }));
        }
        switch (activeTab) {
            case 'teachers':
                return _jsx(TeacherManagement, {});
            case 'students':
                return _jsx(StudentManagement, {});
            case 'analytics':
                return _jsx(AdminAnalytics, { stats: stats });
            case 'settings':
                return _jsx(SystemSettings, {});
            default:
                return _jsx(AdminOverview, { stats: stats });
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(motion.header, { initial: { y: -20, opacity: 0 }, animate: { y: 0, opacity: 1 }, className: "bg-white border-b border-gray-200 shadow-sm", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex items-center justify-between h-16", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "bg-gradient-to-r from-red-600 to-pink-600 text-white p-2 rounded-xl", children: _jsx(Shield, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-gray-900", children: "Acadmate Admin" }), _jsx("p", { className: "text-sm text-gray-600", children: "Head Teacher Dashboard" })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { className: "relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors", children: [_jsx(Bell, { className: "w-5 h-5" }), notifications.length > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center", children: notifications.length }))] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "text-right hidden sm:block", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: user?.name }), _jsx("p", { className: "text-xs text-gray-500", children: "Administrator" })] }), _jsx("button", { onClick: () => setShowProfile(true), className: "flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx("div", { className: "w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center", children: _jsx(User, { className: "w-4 h-4" }) }) }), _jsx("button", { onClick: logout, className: "p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(LogOut, { className: "w-5 h-5" }) })] })] })] }) }) }), _jsx(motion.nav, { initial: { y: -10, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.1 }, className: "bg-white border-b border-gray-200", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "flex space-x-8 overflow-x-auto scrollbar-hide", children: [
                            { key: 'overview', label: 'Overview', icon: BarChart3 },
                            { key: 'teachers', label: 'Teachers', icon: UserCheck },
                            { key: 'students', label: 'Students', icon: Users },
                            { key: 'analytics', label: 'Analytics', icon: TrendingUp },
                            { key: 'settings', label: 'Settings', icon: Settings }
                        ].map(tab => {
                            const Icon = tab.icon;
                            return (_jsxs(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => setActiveTab(tab.key), className: `flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.key
                                    ? 'border-red-500 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: [_jsx(Icon, { className: "w-4 h-4" }), tab.label] }, tab.key));
                        }) }) }) }), _jsx("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, children: renderContent() }, activeTab) }), _jsx(AnimatePresence, { children: showProfile && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, className: "bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto", children: [_jsxs("div", { className: "p-6 border-b flex items-center justify-between", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Admin Profile" }), _jsx("button", { onClick: () => setShowProfile(false), className: "p-2 hover:bg-gray-100 rounded-lg", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx(AcadmateProfile, { onClose: () => setShowProfile(false) })] }) })) })] }));
};
// Admin Overview Component
const AdminOverview = ({ stats }) => {
    if (!stats)
        return null;
    return (_jsxs("div", { className: "space-y-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Admin Dashboard" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsx("div", { className: "bg-white rounded-xl shadow-sm border p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Students" }), _jsx("p", { className: "text-3xl font-bold text-gray-900", children: stats.totalStudents })] }), _jsx("div", { className: "bg-blue-100 p-3 rounded-full", children: _jsx(Users, { className: "w-6 h-6 text-blue-600" }) })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Teachers" }), _jsx("p", { className: "text-3xl font-bold text-gray-900", children: stats.totalTeachers })] }), _jsx("div", { className: "bg-green-100 p-3 rounded-full", children: _jsx(UserCheck, { className: "w-6 h-6 text-green-600" }) })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Tests" }), _jsx("p", { className: "text-3xl font-bold text-gray-900", children: stats.totalTests })] }), _jsx("div", { className: "bg-purple-100 p-3 rounded-full", children: _jsx(BookOpen, { className: "w-6 h-6 text-purple-600" }) })] }) }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "System Health" }), _jsx("p", { className: "text-lg font-bold text-green-600", children: stats.systemHealth })] }), _jsx("div", { className: "bg-green-100 p-3 rounded-full", children: _jsx(Shield, { className: "w-6 h-6 text-green-600" }) })] }) })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Quick Actions" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("button", { className: "p-4 text-left rounded-lg border hover:bg-gray-50", children: [_jsx(Plus, { className: "w-6 h-6 text-indigo-600 mb-2" }), _jsx("h4", { className: "font-medium", children: "Add New Teacher" }), _jsx("p", { className: "text-sm text-gray-600", children: "Invite teachers to the platform" })] }), _jsxs("button", { className: "p-4 text-left rounded-lg border hover:bg-gray-50", children: [_jsx(BarChart3, { className: "w-6 h-6 text-green-600 mb-2" }), _jsx("h4", { className: "font-medium", children: "View Reports" }), _jsx("p", { className: "text-sm text-gray-600", children: "Check performance analytics" })] }), _jsxs("button", { className: "p-4 text-left rounded-lg border hover:bg-gray-50", children: [_jsx(Settings, { className: "w-6 h-6 text-purple-600 mb-2" }), _jsx("h4", { className: "font-medium", children: "System Settings" }), _jsx("p", { className: "text-sm text-gray-600", children: "Configure platform settings" })] })] })] })] }));
};
// Placeholder components for admin features
const TeacherManagement = () => (_jsxs("div", { className: "space-y-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Teacher Management" }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border p-12 text-center", children: [_jsx(UserCheck, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-medium text-gray-900 mb-2", children: "Teacher Management" }), _jsx("p", { className: "text-gray-600", children: "Manage teacher accounts, assign subjects and classes." })] })] }));
const StudentManagement = () => (_jsxs("div", { className: "space-y-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Student Management" }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border p-12 text-center", children: [_jsx(Users, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-medium text-gray-900 mb-2", children: "Student Management" }), _jsx("p", { className: "text-gray-600", children: "View and manage student accounts and progress." })] })] }));
const AdminAnalytics = ({ stats }) => (_jsxs("div", { className: "space-y-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "System Analytics" }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border p-12 text-center", children: [_jsx(TrendingUp, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-medium text-gray-900 mb-2", children: "Advanced Analytics" }), _jsx("p", { className: "text-gray-600", children: "Comprehensive reports and insights about platform usage." })] })] }));
const SystemSettings = () => (_jsxs("div", { className: "space-y-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "System Settings" }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border p-12 text-center", children: [_jsx(Settings, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-medium text-gray-900 mb-2", children: "Platform Configuration" }), _jsx("p", { className: "text-gray-600", children: "Configure system settings, security, and preferences." })] })] }));
export default HeadTeacherDashboard;
