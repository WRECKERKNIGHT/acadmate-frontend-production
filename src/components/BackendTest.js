import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { apiClient, checkBackendConnection } from '../config/api';
const BackendTest = () => {
    const [connectionStatus, setConnectionStatus] = useState('checking');
    const [healthData, setHealthData] = useState(null);
    const [sampleQuestions, setSampleQuestions] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    useEffect(() => {
        testBackendConnection();
    }, []);
    const testBackendConnection = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('🔄 Testing backend connection...');
            // Test basic connection
            const isConnected = await checkBackendConnection();
            if (isConnected) {
                setConnectionStatus('connected');
                // Get health data
                const health = await apiClient.healthCheck();
                setHealthData(health);
                // Get sample questions (first 5)
                const questionsResponse = await apiClient.getSampleQuestions({ limit: 5 });
                if (questionsResponse.success && questionsResponse.data) {
                    setSampleQuestions(questionsResponse.data);
                }
                // Get subjects
                const subjectsResponse = await apiClient.getSubjects();
                if (subjectsResponse.success && subjectsResponse.subjects) {
                    setSubjects(subjectsResponse.subjects);
                }
                // Get statistics
                const statsResponse = await apiClient.getStats();
                if (statsResponse.success && statsResponse.stats) {
                    setStats(statsResponse.stats);
                }
                console.log('✅ Backend connection successful!');
            }
            else {
                setConnectionStatus('failed');
                setError('Failed to connect to backend');
            }
        }
        catch (err) {
            console.error('❌ Backend connection error:', err);
            setConnectionStatus('failed');
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
        finally {
            setLoading(false);
        }
    };
    const getStatusColor = () => {
        switch (connectionStatus) {
            case 'connected': return 'text-green-600 bg-green-100';
            case 'failed': return 'text-red-600 bg-red-100';
            case 'checking': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };
    const getStatusIcon = () => {
        switch (connectionStatus) {
            case 'connected': return '✅';
            case 'failed': return '❌';
            case 'checking': return '🔄';
            default: return '❓';
        }
    };
    return (_jsx("div", { className: "max-w-6xl mx-auto p-6 space-y-6", children: _jsxs("div", { className: "bg-white rounded-xl shadow-lg p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "\uD83D\uDE80 Backend Connection Test" }), _jsx("button", { onClick: testBackendConnection, disabled: loading, className: `px-4 py-2 rounded-lg font-medium ${loading
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'}`, children: loading ? '🔄 Testing...' : '🔄 Test Connection' })] }), _jsx("div", { className: `p-4 rounded-lg border-2 mb-6 ${getStatusColor()}`, children: _jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("span", { className: "text-2xl", children: getStatusIcon() }), _jsxs("div", { children: [_jsxs("h3", { className: "font-bold text-lg", children: ["Connection Status: ", connectionStatus.toUpperCase()] }), _jsxs("p", { className: "text-sm", children: [connectionStatus === 'connected' && 'Successfully connected to backend!', connectionStatus === 'failed' && `Failed to connect: ${error}`, connectionStatus === 'checking' && 'Checking backend connection...'] })] })] }) }), healthData && (_jsxs("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4 mb-6", children: [_jsx("h3", { className: "font-bold text-green-800 mb-2", children: "\uD83C\uDFE5 Backend Health Status" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm", children: [_jsxs("div", { children: [_jsx("strong", { children: "Status:" }), " ", healthData.status] }), _jsxs("div", { children: [_jsx("strong", { children: "Port:" }), " ", healthData.port] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("strong", { children: "Message:" }), " ", healthData.message] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("strong", { children: "Features:" }), _jsx("ul", { className: "list-disc list-inside mt-1", children: healthData.features?.map((feature, index) => (_jsx("li", { children: feature }, index))) })] })] })] })), stats && (_jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6", children: [_jsx("h3", { className: "font-bold text-blue-800 mb-3", children: "\uD83D\uDCCA Database Statistics" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: stats.totalQuestions }), _jsx("div", { className: "text-sm text-blue-800", children: "Total Questions" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: Object.keys(stats.bySubject || {}).length }), _jsx("div", { className: "text-sm text-green-800", children: "Subjects" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-purple-600", children: Object.keys(stats.byClass || {}).length }), _jsx("div", { className: "text-sm text-purple-800", children: "Classes" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-orange-600", children: Object.keys(stats.byDifficulty || {}).length }), _jsx("div", { className: "text-sm text-orange-800", children: "Difficulty Levels" })] })] }), _jsxs("div", { className: "mt-4", children: [_jsx("h4", { className: "font-semibold text-blue-800 mb-2", children: "Questions by Subject:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: Object.entries(stats.bySubject || {}).map(([subject, count]) => (_jsxs("span", { className: "px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm", children: [subject, ": ", count] }, subject))) })] })] })), subjects.length > 0 && (_jsxs("div", { className: "bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6", children: [_jsx("h3", { className: "font-bold text-purple-800 mb-3", children: "\uD83D\uDCDA Available Subjects" }), _jsx("div", { className: "flex flex-wrap gap-2", children: subjects.map((subject, index) => (_jsx("span", { className: "px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm", children: subject }, index))) })] })), sampleQuestions.length > 0 && (_jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-lg p-4", children: [_jsx("h3", { className: "font-bold text-gray-800 mb-3", children: "\uD83D\uDCDD Sample Questions (First 5)" }), _jsx("div", { className: "space-y-4", children: sampleQuestions.map((question, index) => (_jsxs("div", { className: "bg-white p-4 rounded-lg border", children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("h4", { className: "font-semibold text-gray-900", children: ["Q", index + 1, ". ", question.text] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("span", { className: "px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded", children: question.subject }), _jsxs("span", { className: "px-2 py-1 bg-green-100 text-green-800 text-xs rounded", children: ["Class ", question.class] }), _jsx("span", { className: `px-2 py-1 text-xs rounded ${question.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                                                            question.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'}`, children: question.difficulty }), _jsx("span", { className: "px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded", children: question.type })] })] }), question.type === 'MCQ' && question.options.length > 0 && (_jsx("div", { className: "mt-2", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2", children: question.options.map((option, optIndex) => (_jsxs("div", { className: `p-2 rounded text-sm ${question.correctAnswers.includes(option)
                                                    ? 'bg-green-100 text-green-800 font-semibold'
                                                    : 'bg-gray-100 text-gray-700'}`, children: [String.fromCharCode(65 + optIndex), ". ", option] }, optIndex))) }) })), question.explanation && (_jsxs("div", { className: "mt-2 p-2 bg-blue-50 text-blue-800 text-sm rounded", children: [_jsx("strong", { children: "Explanation:" }), " ", question.explanation] })), question.tags.length > 0 && (_jsx("div", { className: "mt-2", children: _jsx("div", { className: "flex flex-wrap gap-1", children: question.tags.map((tag, tagIndex) => (_jsxs("span", { className: "px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded", children: ["#", tag] }, tagIndex))) }) }))] }, question.id))) })] })), error && (_jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4", children: [_jsx("h3", { className: "font-bold text-red-800 mb-2", children: "\u274C Error" }), _jsx("p", { className: "text-red-700", children: error })] }))] }) }));
};
export default BackendTest;
