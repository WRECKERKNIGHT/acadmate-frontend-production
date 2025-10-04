import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, MessageSquare, BarChart3, User, LogOut, Bell, Trophy, Clock, TrendingUp, Target, Award, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { testsAPI, analyticsAPI } from '../config/api';
import DoubtsSystem from './DoubtsSystem';
import AcadmateProfile from './AcadmateProfile';
const StudentDashboard = () => {
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
                analyticsAPI.getStudentReport(user?.id || ''),
                testsAPI.getTests({ class: user?.classId })
            ]);
            setStats(dashboardResponse.data || {
                testsAttempted: 0,
                averageScore: 0,
                totalPoints: 0,
                classRank: 0,
                doubtsSubmitted: 0,
                doubtsResolved: 0,
                streakDays: 0,
                achievements: []
            });
            setTests(testsResponse.data?.tests || []);
        }
        catch (error) {
            console.error('Error loading dashboard data:', error);
            // Set default values on error
            setStats({
                testsAttempted: 0,
                averageScore: 0,
                totalPoints: 0,
                classRank: 0,
                doubtsSubmitted: 0,
                doubtsResolved: 0,
                streakDays: 0,
                achievements: []
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
            case 'tests':
                return _jsx(TestsSection, { tests: tests, onRefresh: loadDashboardData });
            case 'doubts':
                return _jsx(DoubtsSystem, {});
            case 'progress':
                return _jsx(ProgressSection, { stats: stats });
            case 'achievements':
                return _jsx(AchievementsSection, { stats: stats });
            default:
                return _jsx(StudentOverview, { stats: stats, tests: tests });
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(motion.header, { initial: { y: -20, opacity: 0 }, animate: { y: 0, opacity: 1 }, className: "bg-white border-b border-gray-200 shadow-sm", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex items-center justify-between h-16", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-xl", children: _jsx(BookOpen, { className: "w-6 h-6" }) }), _jsxs("div", { children: [_jsx("h1", { className: "text-xl font-bold text-gray-900", children: "Acadmate" }), _jsx("p", { className: "text-sm text-gray-600", children: "Student Portal" })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("button", { className: "relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors", children: [_jsx(Bell, { className: "w-5 h-5" }), notifications.length > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center", children: notifications.length }))] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "text-right hidden sm:block", children: [_jsx("p", { className: "text-sm font-medium text-gray-900", children: user?.name }), _jsx("p", { className: "text-xs text-gray-500", children: user?.role })] }), _jsx("button", { onClick: () => setShowProfile(true), className: "flex items-center gap-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx("div", { className: "w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center", children: _jsx(User, { className: "w-4 h-4" }) }) }), _jsx("button", { onClick: logout, className: "p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors", children: _jsx(LogOut, { className: "w-5 h-5" }) })] })] })] }) }) }), _jsx(motion.nav, { initial: { y: -10, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.1 }, className: "bg-white border-b border-gray-200", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsx("div", { className: "flex space-x-8 overflow-x-auto scrollbar-hide", children: [
                            { key: 'overview', label: 'Overview', icon: BarChart3 },
                            { key: 'tests', label: 'Tests', icon: BookOpen },
                            { key: 'doubts', label: 'Ask Doubts', icon: MessageSquare },
                            { key: 'progress', label: 'Progress', icon: TrendingUp },
                            { key: 'achievements', label: 'Achievements', icon: Trophy }
                        ].map(tab => {
                            const Icon = tab.icon;
                            return (_jsxs(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => setActiveTab(tab.key), className: `flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.key
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`, children: [_jsx(Icon, { className: "w-4 h-4" }), tab.label] }, tab.key));
                        }) }) }) }), _jsx("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 }, children: renderContent() }, activeTab) }), _jsx(AnimatePresence, { children: showProfile && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, className: "bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto", children: [_jsxs("div", { className: "p-6 border-b flex items-center justify-between", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Profile Settings" }), _jsx("button", { onClick: () => setShowProfile(false), className: "p-2 hover:bg-gray-100 rounded-lg", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsx(AcadmateProfile, { onClose: () => setShowProfile(false) })] }) })) })] }));
};
// Modern Student Overview Component
const StudentOverview = ({ stats, tests }) => {
    if (!stats)
        return null;
    const upcomingTests = tests.filter(t => t.isPublished && !t.attempted).slice(0, 5);
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: "Student Overview" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8", children: [_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "bg-white rounded-xl shadow-sm border p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Tests Attempted" }), _jsx("p", { className: "text-3xl font-bold text-gray-900", children: stats.testsAttempted }), _jsx("p", { className: "text-sm text-blue-600", children: "Keep practicing" })] }), _jsx("div", { className: "bg-blue-100 p-3 rounded-full", children: _jsx(BookOpen, { className: "w-6 h-6 text-blue-600" }) })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "bg-white rounded-xl shadow-sm border p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Average Score" }), _jsxs("p", { className: "text-3xl font-bold text-gray-900", children: [stats.averageScore, "%"] }), _jsx("p", { className: "text-sm text-green-600", children: "Great progress" })] }), _jsx("div", { className: "bg-green-100 p-3 rounded-full", children: _jsx(Target, { className: "w-6 h-6 text-green-600" }) })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "bg-white rounded-xl shadow-sm border p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Class Rank" }), _jsxs("p", { className: "text-3xl font-bold text-gray-900", children: ["#", stats.classRank || 'N/A'] }), _jsx("p", { className: "text-sm text-purple-600", children: "In your class" })] }), _jsx("div", { className: "bg-purple-100 p-3 rounded-full", children: _jsx(Trophy, { className: "w-6 h-6 text-purple-600" }) })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, className: "bg-white rounded-xl shadow-sm border p-6", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-600", children: "Streak" }), _jsx("p", { className: "text-3xl font-bold text-gray-900", children: stats.streakDays }), _jsx("p", { className: "text-sm text-orange-600", children: "Days active" })] }), _jsx("div", { className: "bg-orange-100 p-3 rounded-full", children: _jsx(Clock, { className: "w-6 h-6 text-orange-600" }) })] }) })] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border", children: [_jsx("div", { className: "p-6 border-b", children: _jsx("h3", { className: "text-lg font-semibold text-gray-900", children: "Upcoming Tests" }) }), _jsx("div", { className: "p-6", children: upcomingTests.length > 0 ? (_jsx("div", { className: "space-y-4", children: upcomingTests.map((test) => (_jsxs("div", { className: "flex items-center justify-between py-3 border-b last:border-0", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900", children: test.title }), _jsxs("p", { className: "text-sm text-gray-600", children: [test.subject, " \u2022 ", test.duration, " min"] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("span", { className: "text-sm font-medium text-indigo-600", children: [test.totalMarks, " marks"] }), _jsx("button", { className: "bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm font-medium", children: "Start Test" })] })] }, test.id))) })) : (_jsxs("div", { className: "text-center py-8", children: [_jsx(BookOpen, { className: "w-12 h-12 text-gray-400 mx-auto mb-3" }), _jsx("h4", { className: "text-lg font-medium text-gray-900 mb-1", children: "No tests available" }), _jsx("p", { className: "text-gray-600", children: "Check back later for new tests" })] })) })] })] }));
};
// Tests Section Component
const TestsSection = ({ tests, onRefresh }) => {
    const [filter, setFilter] = useState('all');
    const filteredTests = tests.filter(test => {
        if (filter === 'attempted')
            return test.attempted;
        if (filter === 'pending')
            return !test.attempted && test.isPublished;
        return true;
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "My Tests" }), _jsxs("select", { value: filter, onChange: (e) => setFilter(e.target.value), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500", children: [_jsx("option", { value: "all", children: "All Tests" }), _jsx("option", { value: "pending", children: "Pending" }), _jsx("option", { value: "attempted", children: "Attempted" })] })] }), filteredTests.length > 0 ? (_jsx("div", { className: "grid gap-4", children: filteredTests.map((test) => (_jsx("div", { className: "bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-shadow", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: test.title }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-600", children: [_jsx("span", { children: test.subject }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: [test.duration, " minutes"] }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: [test.totalMarks, " marks"] })] }), test.attempted && test.score !== undefined && (_jsx("div", { className: "mt-2", children: _jsxs("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800", children: ["Score: ", test.score, "%"] }) }))] }), _jsx("div", { className: "flex items-center gap-3", children: test.attempted ? (_jsx("span", { className: "text-green-600 font-medium", children: "Completed" })) : (_jsx("button", { className: "bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium", children: "Start Test" })) })] }) }, test.id))) })) : (_jsxs("div", { className: "bg-white rounded-xl shadow-sm border p-12 text-center", children: [_jsx(BookOpen, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-medium text-gray-900 mb-2", children: "No tests found" }), _jsx("p", { className: "text-gray-600", children: "Tests assigned by your teachers will appear here" })] }))] }));
};
// Progress Section Component
const ProgressSection = ({ stats }) => {
    if (!stats)
        return null;
    return (_jsxs("div", { className: "space-y-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "My Progress" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-white rounded-xl shadow-sm border p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-6", children: "Performance Overview" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Tests Attempted" }), _jsx("span", { className: "text-2xl font-bold text-blue-600", children: stats.testsAttempted })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Average Score" }), _jsxs("span", { className: "text-2xl font-bold text-green-600", children: [stats.averageScore, "%"] })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Total Points" }), _jsx("span", { className: "text-2xl font-bold text-purple-600", children: stats.totalPoints })] })] })] }), _jsxs("div", { className: "bg-white rounded-xl shadow-sm border p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-6", children: "Doubt Resolution" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Doubts Asked" }), _jsx("span", { className: "text-2xl font-bold text-orange-600", children: stats.doubtsSubmitted })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-600", children: "Doubts Resolved" }), _jsx("span", { className: "text-2xl font-bold text-green-600", children: stats.doubtsResolved })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-green-600 h-2 rounded-full", style: { width: `${stats.doubtsSubmitted > 0 ? (stats.doubtsResolved / stats.doubtsSubmitted) * 100 : 0}%` } }) })] })] })] })] }));
};
// Achievements Section Component
const AchievementsSection = ({ stats }) => {
    if (!stats)
        return null;
    return (_jsxs("div", { className: "space-y-8", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Achievements & Badges" }), stats.achievements.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: stats.achievements.map((achievement, index) => (_jsxs("div", { className: "bg-white rounded-xl shadow-sm border p-6 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Award, { className: "w-8 h-8 text-white" }) }), _jsx("h3", { className: "font-semibold text-gray-900 mb-2", children: achievement }), _jsx("p", { className: "text-sm text-gray-600", children: "Congratulations on this achievement!" })] }, index))) })) : (_jsxs("div", { className: "bg-white rounded-xl shadow-sm border p-12 text-center", children: [_jsx(Trophy, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-medium text-gray-900 mb-2", children: "No achievements yet" }), _jsx("p", { className: "text-gray-600", children: "Keep studying and taking tests to earn your first badge!" })] }))] }));
};
export default StudentDashboard;
