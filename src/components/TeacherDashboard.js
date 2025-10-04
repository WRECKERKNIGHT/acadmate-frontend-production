import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Users, BarChart3, MessageSquare, Plus, FileText, User, LogOut, Bell, Search, TrendingUp, CheckCircle2, Eye, Edit3, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { testsAPI, analyticsAPI, apiUtils } from '../config/api';
import DoubtsSystem from './DoubtsSystem';
import AcadmateTestCreator from './AcadmateTestCreator';
import AcadmateProfile from './AcadmateProfile';
import toast from 'react-hot-toast';
const TeacherDashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [showProfile, setShowProfile] = useState(false);
    useEffect(() => {
        loadDashboardData();
    }, []);
    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [dashboardResponse, testsResponse] = await Promise.all([
                analyticsAPI.getDashboardStats(),
                testsAPI.getTests({ createdBy: user?.id })
            ]);
            setStats(dashboardResponse.data || {
                totalTests: 0,
                totalStudents: 0,
                pendingDoubts: 0,
                testsThisMonth: 0,
                averageScore: 0,
                completionRate: 0
            });
            setTests(testsResponse.data?.tests || []);
        }
        catch (error) {
            console.error('Error loading dashboard data:', error);
            // Set default values on error
            setStats({
                totalTests: 0,
                totalStudents: 0,
                pendingDoubts: 0,
                testsThisMonth: 0,
                averageScore: 0,
                completionRate: 0
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
            case 'create-test':
                return _jsx(AcadmateTestCreator, {});
            case 'doubts':
                return _jsx(DoubtsSystem, {});
            case 'tests':
                return _jsx(TestsManagement, { tests: tests, onRefresh: loadDashboardData });
            case 'analytics':
                return _jsx(TeacherAnalytics, { stats: stats });
            case 'students':
                return _jsx(StudentsManagement, {});
            default:
                return _jsx(TeacherOverview, { stats: stats, tests: tests });
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(motion.header, { initial: { y: -20, opacity: 0 }, animate: { y: 0, opacity: 1 }, className: "bg-white border-b border-gray-200 shadow-sm", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex items-center justify-between h-16", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-xl", children: _jsx(BookOpen, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-gray-900", children: "Acadmate" }), _jsx("p", { className: "text-sm text-gray-600", children: "Teacher Dashboard" })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { className: "relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors", children: [_jsx(Bell, { className: "w-5 h-5" }), notifications.length > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center", children: notifications.length }))] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "text-right hidden sm:block", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: user?.name }), _jsx("p", { className: "text-xs text-gray-500", children: user?.role })] }), _jsx("button", { onClick: () => setShowProfile(true), className: "flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx("div", { className: "w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center", children: _jsx(User, { className: "w-4 h-4" }) }) }), _jsx("button", { onClick: logout, className: "p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(LogOut, { className: "w-5 h-5" }) })] })] })] }) }) }), _jsx(motion.nav, { initial: { y: -10, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.1 }, className: "bg-white border-b border-gray-200", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "flex space-x-8 overflow-x-auto scrollbar-hide", children: [
                            { key: 'overview', label: 'Overview', icon: BarChart3 },
                            { key: 'doubts', label: 'Doubts', icon: MessageSquare },
                            { key: 'create-test', label: 'Create Test', icon: Plus },
                            { key: 'tests', label: 'My Tests', icon: FileText },
                            { key: 'analytics', label: 'Analytics', icon: TrendingUp },
                            { key: 'students', label: 'Students', icon: Users }
                        ].map(tab => {
                            const Icon = tab.icon;
                            return (_jsxs(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => setActiveTab(tab.key), className: `flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.key
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: [_jsx(Icon, { className: "w-4 h-4" }), tab.label] }, tab.key));
                        }) }) }) }), _jsx("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, children: renderContent() }, activeTab) }), _jsx(AnimatePresence, { children: showProfile && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, className: "bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto", children: [_jsxs("div", { className: "p-6 border-b flex items-center justify-between", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Profile Settings" }), _jsx("button", { onClick: () => setShowProfile(false), className: "p-2 hover:bg-gray-100 rounded-lg", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx(AcadmateProfile, { onClose: () => setShowProfile(false) })] }) })) })] }));
};
// Modern Teacher Overview Component
const TeacherOverview = ({ stats, tests }) => {
    if (!stats)
        return null;
    const recentTests = tests.slice(0, 5);
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Dashboard Overview" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8", children: [_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "bg-white rounded-xl shadow-sm border p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Total Tests" }), _jsx("p", { className: "text-3xl font-bold text-gray-900", children: stats.totalTests }), _jsxs("p", { className: "text-sm text-green-600", children: ["+", stats.testsThisMonth, " this month"] })] }), _jsx("div", { className: "bg-blue-100 p-3 rounded-full", children: _jsx(FileText, { className: "w-6 h-6 text-blue-600" }) })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "bg-white rounded-xl shadow-sm border p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Students" }), _jsx("p", { className: "text-3xl font-bold text-gray-900", children: stats.totalStudents }), _jsx("p", { className: "text-sm text-blue-600", children: "Active learners" })] }), _jsx("div", { className: "bg-green-100 p-3 rounded-full", children: _jsx(Users, { className: "w-6 h-6 text-green-600" }) })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "bg-white rounded-xl shadow-sm border p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Pending Doubts" }), _jsx("p", { className: "text-3xl font-bold text-gray-900", children: stats.pendingDoubts }), _jsx("p", { className: "text-sm text-orange-600", children: "Need attention" })] }), _jsx("div", { className: "bg-orange-100 p-3 rounded-full", children: _jsx(MessageSquare, { className: "w-6 h-6 text-orange-600" }) })] }) })] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border", children: [_jsx("div", { className: "p-6 border-b", children: _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Recent Tests" }) }), _jsx("div", { className: "p-6", children: recentTests.length > 0 ? (_jsx("div", { className: "space-y-4", children: recentTests.map((test) => (_jsxs("div", { className: "flex items-center justify-between py-3 border-b last:border-0", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900", children: test.title }), _jsxs("p", { className: "text-sm text-gray-600", children: [test.subject, " \u2022 ", test.class] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${test.isPublished
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'}`, children: test.isPublished ? 'Published' : 'Draft' }), _jsxs("span", { className: "text-sm text-gray-500", children: [test.studentsAttempted, " attempts"] })] })] }, test.id))) })) : (_jsxs("div", { className: "text-center py-8", children: [_jsx(FileText, { className: "w-12 h-12 text-gray-400 mx-auto mb-3" }), _jsx("h4", { className: "text-lg font-medium text-gray-900 mb-1", children: "No tests yet" }), _jsx("p", { className: "text-gray-600", children: "Create your first test to get started" })] })) })] })] }));
};
// Tests Management Component
const TestsManagement = ({ tests, onRefresh }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const filteredTests = tests.filter(test => {
        const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'published' && test.isPublished) ||
            (filterStatus === 'draft' && !test.isPublished);
        return matchesSearch && matchesStatus;
    });
    const handleDeleteTest = async (testId) => {
        if (!confirm('Are you sure you want to delete this test?'))
            return;
        try {
            await testsAPI.deleteTest(testId);
            toast.success('Test deleted successfully!');
            onRefresh();
        }
        catch (error) {
            toast.error(apiUtils.handleApiError(error));
        }
    };
    const handlePublishTest = async (testId) => {
        try {
            await testsAPI.publishTest(testId);
            toast.success('Test published successfully!');
            onRefresh();
        }
        catch (error) {
            toast.error(apiUtils.handleApiError(error));
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "My Tests" }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search tests...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" })] }), _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500", children: [_jsx("option", { value: "all", children: "All Tests" }), _jsx("option", { value: "published", children: "Published" }), _jsx("option", { value: "draft", children: "Draft" })] })] })] }), filteredTests.length > 0 ? (_jsx("div", { className: "bg-white rounded-xl shadow-sm border", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Test" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Subject" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Attempts" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Created" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredTests.map((test) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4", children: _jsxs("div", { children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: test.title }), _jsxs("div", { className: "text-sm text-gray-500", children: [test.duration, " minutes \u2022 ", test.totalMarks, " marks"] })] }) }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: test.subject }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${test.isPublished
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'}`, children: test.isPublished ? 'Published' : 'Draft' }) }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-900", children: test.studentsAttempted }), _jsx("td", { className: "px-6 py-4 text-sm text-gray-500", children: apiUtils.formatDate(test.createdAt) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { className: "text-indigo-600 hover:text-indigo-700 p-1 hover:bg-indigo-50 rounded", title: "View Test", children: _jsx(Eye, { className: "w-4 h-4" }) }), _jsx("button", { className: "text-gray-600 hover:text-gray-700 p-1 hover:bg-gray-50 rounded", title: "Edit Test", children: _jsx(Edit3, { className: "w-4 h-4" }) }), !test.isPublished && (_jsx("button", { onClick: () => handlePublishTest(test.id), className: "text-green-600 hover:text-green-700 p-1 hover:bg-green-50 rounded", title: "Publish Test", children: _jsx(CheckCircle2, { className: "w-4 h-4" }) })), _jsx("button", { onClick: () => handleDeleteTest(test.id), className: "text-red-600 hover:text-red-700 p-1 hover:bg-red-50 rounded", title: "Delete Test", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }) })] }, test.id))) })] }) }) })) : (_jsxs("div", { className: "bg-white rounded-xl shadow-sm border p-12 text-center", children: [_jsx(FileText, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-medium text-gray-900 mb-2", children: "No tests found" }), _jsx("p", { className: "text-gray-600 mb-6", children: searchTerm ? 'No tests match your search criteria' : 'Create your first test to get started' })] }))] }));
};
// Teacher Analytics Component
const TeacherAnalytics = ({ stats }) => {
    if (!stats)
        return null;
    return (_jsxs("div", { className: "space-y-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Analytics & Reports" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-white rounded-xl shadow-sm border p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Performance Overview" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Average Score" }), _jsxs("span", { className: "text-2xl font-bold text-green-600", children: [stats.averageScore, "%"] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Completion Rate" }), _jsxs("span", { className: "text-2xl font-bold text-blue-600", children: [stats.completionRate, "%"] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Tests This Month" }), _jsx("span", { className: "text-2xl font-bold text-purple-600", children: stats.testsThisMonth })] })] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Quick Actions" }), _jsxs("div", { className: "space-y-3", children: [_jsx("button", { className: "w-full text-left p-4 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Plus, { className: "w-5 h-5 text-indigo-600" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: "Create New Test" }), _jsx("div", { className: "text-sm text-gray-600", children: "Design a new assessment" })] })] }) }), _jsx("button", { className: "w-full text-left p-4 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(BarChart3, { className: "w-5 h-5 text-green-600" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: "View Reports" }), _jsx("div", { className: "text-sm text-gray-600", children: "Analyze student performance" })] })] }) }), _jsx("button", { className: "w-full text-left p-4 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(MessageSquare, { className: "w-5 h-5 text-orange-600" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: "Check Doubts" }), _jsx("div", { className: "text-sm text-gray-600", children: "Answer student questions" })] })] }) })] })] })] })] }));
};
// Students Management Component
const StudentsManagement = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Load students data
        setLoading(false);
    }, []);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Students Management" }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border p-12 text-center", children: [_jsx(Users, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-medium text-gray-900 mb-2", children: "Students Management" }), _jsx("p", { className: "text-gray-600", children: "View and manage your students, track their progress, and monitor performance." }), _jsx("p", { className: "text-sm text-gray-500 mt-2", children: "Coming soon in the next update!" })] })] }));
};
export default TeacherDashboard;
