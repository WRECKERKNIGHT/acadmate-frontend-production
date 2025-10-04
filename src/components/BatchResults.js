import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
const BatchResults = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [activeView, setActiveView] = useState('overview');
    const [selectedBatch, setSelectedBatch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    // Data states
    const [batchOverview, setBatchOverview] = useState(null);
    const [detailedResults, setDetailedResults] = useState(null);
    const [studentPerformance, setStudentPerformance] = useState(null);
    const [subjectAnalysis, setSubjectAnalysis] = useState(null);
    const [comparativeAnalysis, setComparativeAnalysis] = useState(null);
    useEffect(() => {
        if (activeView === 'overview') {
            fetchBatchOverview();
        }
        else if (activeView === 'comparative' && user?.role === 'HEAD_TEACHER') {
            fetchComparativeAnalysis();
        }
    }, [activeView, user?.role]);
    useEffect(() => {
        if (selectedBatch && activeView === 'detailed') {
            fetchDetailedResults(selectedBatch);
        }
        else if (selectedBatch && activeView === 'subjects') {
            fetchSubjectAnalysis(selectedBatch);
        }
    }, [selectedBatch, activeView]);
    useEffect(() => {
        if (selectedStudent && activeView === 'student') {
            fetchStudentPerformance(selectedStudent);
        }
    }, [selectedStudent, activeView]);
    const fetchBatchOverview = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/results/batch-overview');
            setBatchOverview(response.data);
        }
        catch (error) {
            console.error('Error fetching batch overview:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch batch overview');
        }
        finally {
            setLoading(false);
        }
    };
    const fetchDetailedResults = async (batchId) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/results/batch/${batchId}/detailed`);
            setDetailedResults(response.data);
        }
        catch (error) {
            console.error('Error fetching detailed results:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch detailed results');
        }
        finally {
            setLoading(false);
        }
    };
    const fetchStudentPerformance = async (studentUid) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/results/student/${studentUid}/performance`);
            setStudentPerformance(response.data);
        }
        catch (error) {
            console.error('Error fetching student performance:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch student performance');
        }
        finally {
            setLoading(false);
        }
    };
    const fetchSubjectAnalysis = async (batchId) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/results/batch/${batchId}/subject-analysis`);
            setSubjectAnalysis(response.data);
        }
        catch (error) {
            console.error('Error fetching subject analysis:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch subject analysis');
        }
        finally {
            setLoading(false);
        }
    };
    const fetchComparativeAnalysis = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/results/comparative-analysis');
            setComparativeAnalysis(response.data);
        }
        catch (error) {
            console.error('Error fetching comparative analysis:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch comparative analysis');
        }
        finally {
            setLoading(false);
        }
    };
    const getScoreColor = (score) => {
        if (score >= 80)
            return '#10b981'; // Green
        if (score >= 60)
            return '#3b82f6'; // Blue
        if (score >= 40)
            return '#f59e0b'; // Orange
        return '#ef4444'; // Red
    };
    const getPerformanceIcon = (score) => {
        if (score >= 80)
            return '🏆';
        if (score >= 60)
            return '⭐';
        if (score >= 40)
            return '👍';
        return '📈';
    };
    const renderOverview = () => {
        if (!batchOverview)
            return _jsx("div", { className: "loading", children: "Loading overview..." });
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Batch Results Overview" }), _jsx("div", { className: "bg-white p-6 rounded-xl shadow-sm border mb-6", children: _jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: batchOverview.teacher.fullName }), _jsxs("p", { className: "text-gray-600", children: ["Subjects: ", batchOverview.teacher.subjects?.join(', ') || 'All'] })] }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: batchOverview.totalTests }), _jsx("div", { className: "text-sm text-gray-600", children: "Total Tests Created" })] })] }) })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: batchOverview.batchStats.map((batch, index) => (_jsxs("div", { className: "stagger-item card-animated hover-lift bg-white p-6 rounded-xl shadow-sm border cursor-pointer", style: { animationDelay: `${index * 0.1}s` }, onClick: () => {
                            setSelectedBatch(batch.batch.id);
                            setActiveView('detailed');
                        }, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: batch.batch.name }), _jsxs("p", { className: "text-gray-600 text-sm", children: [batch.studentsCount, " students"] })] }), _jsx("div", { className: "text-2xl", children: getPerformanceIcon(batch.averageScore) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Average Score" }), _jsxs("span", { className: "font-bold text-lg", style: { color: getScoreColor(batch.averageScore) }, children: [batch.averageScore.toFixed(1), "%"] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Pass Rate" }), _jsxs("span", { className: "font-semibold", style: { color: getScoreColor(batch.passRate) }, children: [batch.passRate.toFixed(1), "%"] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Tests Conducted" }), _jsx("span", { className: "font-semibold text-gray-900", children: batch.totalTests })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Total Submissions" }), _jsx("span", { className: "font-semibold text-gray-900", children: batch.totalSubmissions })] })] }), _jsxs("div", { className: "mt-4", children: [_jsxs("div", { className: "flex justify-between text-xs text-gray-600 mb-1", children: [_jsx("span", { children: "Performance" }), _jsxs("span", { children: [batch.averageScore.toFixed(1), "%"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "h-2 rounded-full transition-all duration-500", style: {
                                                width: `${Math.min(batch.averageScore, 100)}%`,
                                                background: `linear-gradient(90deg, ${getScoreColor(batch.averageScore)}, ${getScoreColor(batch.averageScore)}88)`
                                            } }) })] })] }, batch.batch.id))) })] }));
    };
    const renderDetailedResults = () => {
        if (!detailedResults)
            return _jsx("div", { className: "loading", children: "Loading detailed results..." });
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("button", { onClick: () => setActiveView('overview'), className: "text-blue-600 hover:text-blue-800 text-sm mb-2", children: "\u2190 Back to Overview" }), _jsxs("h2", { className: "text-2xl font-bold text-gray-900", children: [detailedResults.batch.name, " - Detailed Results"] })] }), _jsx("div", { className: "flex space-x-2", children: _jsx("button", { onClick: () => setActiveView('subjects'), className: "btn btn-secondary btn-sm", children: "Subject Analysis" }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", children: [_jsxs("div", { className: "bg-white p-4 rounded-lg shadow-sm border text-center", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: detailedResults.summary.totalStudents }), _jsx("div", { className: "text-sm text-gray-600", children: "Total Students" })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow-sm border text-center", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: detailedResults.summary.totalTests }), _jsx("div", { className: "text-sm text-gray-600", children: "Tests Conducted" })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow-sm border text-center", children: [_jsxs("div", { className: "text-2xl font-bold", style: { color: getScoreColor(detailedResults.summary.averageBatchScore) }, children: [detailedResults.summary.averageBatchScore, "%"] }), _jsx("div", { className: "text-sm text-gray-600", children: "Batch Average" })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow-sm border text-center", children: [_jsxs("div", { className: "text-2xl font-bold", style: { color: getScoreColor(detailedResults.summary.studentsPassingRate) }, children: [detailedResults.summary.studentsPassingRate, "%"] }), _jsx("div", { className: "text-sm text-gray-600", children: "Pass Rate" })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Student Performance Ranking" }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200", children: [_jsx("th", { className: "text-left py-3 px-4", children: "Rank" }), _jsx("th", { className: "text-left py-3 px-4", children: "Student" }), _jsx("th", { className: "text-center py-3 px-4", children: "Tests Attempted" }), _jsx("th", { className: "text-center py-3 px-4", children: "Average Score" }), _jsx("th", { className: "text-center py-3 px-4", children: "Best Score" }), _jsx("th", { className: "text-center py-3 px-4", children: "Actions" })] }) }), _jsx("tbody", { children: detailedResults.studentPerformance.slice(0, 20).map((student, index) => (_jsxs("tr", { className: "border-b border-gray-100 hover:bg-gray-50", children: [_jsx("td", { className: "py-3 px-4", children: _jsxs("div", { className: "flex items-center", children: [_jsxs("span", { className: "font-semibold mr-2", children: ["#", index + 1] }), index < 3 && (_jsx("span", { className: "text-lg", children: index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉' }))] }) }), _jsx("td", { className: "py-3 px-4", children: _jsxs("div", { children: [_jsx("div", { className: "font-medium text-gray-900", children: student.student.fullName }), _jsx("div", { className: "text-sm text-gray-600", children: student.student.uid })] }) }), _jsx("td", { className: "py-3 px-4 text-center", children: student.testsAttempted }), _jsx("td", { className: "py-3 px-4 text-center", children: _jsxs("span", { className: "font-semibold", style: { color: getScoreColor(student.averageScore) }, children: [student.averageScore, "%"] }) }), _jsx("td", { className: "py-3 px-4 text-center", children: _jsxs("span", { className: "font-semibold", style: { color: getScoreColor(student.bestScore) }, children: [student.bestScore, "%"] }) }), _jsx("td", { className: "py-3 px-4 text-center", children: _jsx("button", { onClick: () => {
                                                            setSelectedStudent(student.student.uid);
                                                            setActiveView('student');
                                                        }, className: "btn btn-sm btn-secondary", children: "View Details" }) })] }, student.student.uid))) })] }) })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Recent Tests" }), _jsx("div", { className: "space-y-4", children: detailedResults.tests.slice(0, 10).map((test) => (_jsx("div", { className: "border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-1", children: test.title }), _jsxs("p", { className: "text-sm text-gray-600 mb-2", children: ["Created by: ", test.author.fullName, " | Total Marks: ", test.totalMarks] }), _jsxs("div", { className: "flex items-center space-x-4 text-sm", children: [_jsxs("span", { className: "text-gray-600", children: [test.submissionsCount, " submissions"] }), _jsxs("span", { className: "font-semibold", style: { color: getScoreColor(test.averageScore) }, children: ["Avg: ", test.averageScore, "%"] }), _jsxs("span", { className: "font-semibold", style: { color: getScoreColor(test.topScore) }, children: ["Top: ", test.topScore, "%"] })] })] }), _jsx("div", { className: "text-sm text-gray-500", children: new Date(test.createdAt).toLocaleDateString() })] }) }, test.id))) })] })] }));
    };
    const renderStudentPerformance = () => {
        if (!studentPerformance)
            return _jsx("div", { className: "loading", children: "Loading student performance..." });
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("button", { onClick: () => setActiveView('detailed'), className: "text-blue-600 hover:text-blue-800 text-sm mb-2", children: "\u2190 Back to Batch Results" }), _jsx("div", { className: "bg-white p-6 rounded-xl shadow-sm border", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: studentPerformance.student.fullName }), _jsxs("p", { className: "text-gray-600", children: [studentPerformance.student.uid, " | ", studentPerformance.student.batchType] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-3xl font-bold", style: { color: getScoreColor(studentPerformance.summary.averageScore) }, children: [studentPerformance.summary.averageScore, "%"] }), _jsx("div", { className: "text-sm text-gray-600", children: "Overall Average" })] })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-4", children: [_jsxs("div", { className: "bg-white p-4 rounded-lg shadow-sm border text-center", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: studentPerformance.summary.testsAttempted }), _jsx("div", { className: "text-sm text-gray-600", children: "Tests Attempted" })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow-sm border text-center", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: studentPerformance.summary.passedTests }), _jsx("div", { className: "text-sm text-gray-600", children: "Tests Passed" })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow-sm border text-center", children: [_jsxs("div", { className: "text-2xl font-bold", style: { color: getScoreColor(studentPerformance.summary.bestScore) }, children: [studentPerformance.summary.bestScore, "%"] }), _jsx("div", { className: "text-sm text-gray-600", children: "Best Score" })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow-sm border text-center", children: [_jsx("div", { className: "text-2xl font-bold text-purple-600", children: studentPerformance.summary.totalMarksObtained }), _jsx("div", { className: "text-sm text-gray-600", children: "Total Marks" })] }), _jsxs("div", { className: "bg-white p-4 rounded-lg shadow-sm border text-center", children: [_jsxs("div", { className: "text-2xl font-bold text-orange-600", children: [Math.round((studentPerformance.summary.totalMarksObtained / studentPerformance.summary.totalPossibleMarks) * 100) || 0, "%"] }), _jsx("div", { className: "text-sm text-gray-600", children: "Overall %" })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Performance Trend" }), _jsx("div", { className: "space-y-2", children: studentPerformance.performanceTrend.map((trend, index) => (_jsxs("div", { className: "flex items-center justify-between p-2 bg-gray-50 rounded", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("span", { className: "text-sm text-gray-600", children: ["Test #", trend.testNumber, ": "] }), _jsx("span", { className: "text-sm font-medium", children: trend.testTitle })] }), _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("span", { className: "font-semibold", style: { color: getScoreColor(trend.percentage) }, children: [trend.percentage, "%"] }), _jsx("span", { className: "text-xs text-gray-500", children: new Date(trend.date).toLocaleDateString() })] })] }, index))) })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Recent Test Results" }), _jsx("div", { className: "space-y-3", children: studentPerformance.recentTests.map((test, index) => (_jsx("div", { className: "border border-gray-200 rounded-lg p-4", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900", children: test.test.title }), _jsxs("p", { className: "text-sm text-gray-600", children: ["Score: ", test.score, "/", test.totalMarks, " (", test.percentage, "%)"] }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Time taken: ", test.timeTaken, " minutes"] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-lg font-bold", style: { color: getScoreColor(test.percentage) }, children: [test.percentage, "%"] }), _jsx("div", { className: "text-xs text-gray-500", children: test.submittedAt ? new Date(test.submittedAt).toLocaleDateString() : 'In Progress' })] })] }) }, index))) })] })] }));
    };
    const renderSubjectAnalysis = () => {
        if (!subjectAnalysis)
            return _jsx("div", { className: "loading", children: "Loading subject analysis..." });
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("button", { onClick: () => setActiveView('detailed'), className: "text-blue-600 hover:text-blue-800 text-sm mb-2", children: "\u2190 Back to Batch Results" }), _jsxs("h2", { className: "text-2xl font-bold text-gray-900", children: ["Subject-wise Analysis - ", subjectAnalysis.batch.name] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: subjectAnalysis.subjectAnalysis.map((subject, index) => (_jsxs("div", { className: "stagger-item card-animated hover-lift bg-white p-6 rounded-xl shadow-sm border", style: { animationDelay: `${index * 0.1}s` }, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: subject.subject }), _jsx("div", { className: "text-2xl", children: getPerformanceIcon(subject.averageScore) })] }), _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Average Score" }), _jsxs("span", { className: "font-bold text-lg", style: { color: getScoreColor(subject.averageScore) }, children: [subject.averageScore, "%"] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Top Score" }), _jsxs("span", { className: "font-semibold", style: { color: getScoreColor(subject.topScore) }, children: [subject.topScore, "%"] })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Tests Conducted" }), _jsx("span", { className: "font-semibold text-gray-900", children: subject.testsCount })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Students Participated" }), _jsx("span", { className: "font-semibold text-gray-900", children: subject.studentsCount })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-600", children: "Total Submissions" }), _jsx("span", { className: "font-semibold text-gray-900", children: subject.totalSubmissions })] })] }), _jsxs("div", { className: "mt-4", children: [_jsxs("div", { className: "flex justify-between text-xs text-gray-600 mb-1", children: [_jsx("span", { children: "Performance" }), _jsxs("span", { children: [subject.averageScore, "%"] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "h-2 rounded-full transition-all duration-500", style: {
                                                width: `${Math.min(subject.averageScore, 100)}%`,
                                                background: `linear-gradient(90deg, ${getScoreColor(subject.averageScore)}, ${getScoreColor(subject.averageScore)}88)`
                                            } }) })] })] }, subject.subject))) }), subjectAnalysis.summary && (_jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Analysis Summary" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: subjectAnalysis.summary.totalSubjects }), _jsx("div", { className: "text-sm text-gray-600", children: "Subjects Analyzed" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold", style: { color: getScoreColor(subjectAnalysis.summary.overallAverageScore) }, children: [subjectAnalysis.summary.overallAverageScore, "%"] }), _jsx("div", { className: "text-sm text-gray-600", children: "Overall Average" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-lg font-semibold text-green-600", children: subjectAnalysis.summary.bestPerformingSubject?.subject || 'N/A' }), _jsx("div", { className: "text-sm text-gray-600", children: "Best Performing Subject" })] })] })] }))] }));
    };
    const renderComparativeAnalysis = () => {
        if (user?.role !== 'HEAD_TEACHER') {
            return (_jsx("div", { className: "text-center py-8", children: _jsx("p", { className: "text-red-500", children: "Access denied. Only Head Teachers can view comparative analysis." }) }));
        }
        if (!comparativeAnalysis)
            return _jsx("div", { className: "loading", children: "Loading comparative analysis..." });
        return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Comparative Batch Analysis" }), _jsx("p", { className: "text-gray-600", children: "Compare performance across all batches" })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Overall Summary" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-blue-600", children: comparativeAnalysis.overallSummary.totalBatches }), _jsx("div", { className: "text-sm text-gray-600", children: "Total Batches" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: comparativeAnalysis.overallSummary.totalStudents }), _jsx("div", { className: "text-sm text-gray-600", children: "Total Students" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold text-purple-600", children: comparativeAnalysis.overallSummary.totalTests }), _jsx("div", { className: "text-sm text-gray-600", children: "Total Tests" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-2xl font-bold", style: { color: getScoreColor(comparativeAnalysis.overallSummary.overallAverageScore) }, children: [comparativeAnalysis.overallSummary.overallAverageScore, "%"] }), _jsx("div", { className: "text-sm text-gray-600", children: "Overall Average" })] })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-sm border", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Batch Performance Ranking" }), _jsx("div", { className: "space-y-4", children: comparativeAnalysis.batchComparison.map((batch, index) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsxs("span", { className: "font-bold text-lg mr-2", children: ["#", index + 1] }), index < 3 && (_jsx("span", { className: "text-xl", children: index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉' }))] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-gray-900", children: batch.batch.name }), _jsxs("p", { className: "text-sm text-gray-600", children: [batch.studentsCount, " students | ", batch.teachers.length, " teachers"] })] })] }), _jsxs("div", { className: "flex items-center space-x-6", children: [_jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-lg font-bold", style: { color: getScoreColor(batch.averageScore) }, children: [batch.averageScore, "%"] }), _jsx("div", { className: "text-xs text-gray-600", children: "Average" })] }), _jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "text-lg font-bold", style: { color: getScoreColor(batch.passRate) }, children: [batch.passRate, "%"] }), _jsx("div", { className: "text-xs text-gray-600", children: "Pass Rate" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-lg font-bold text-blue-600", children: batch.testsCount }), _jsx("div", { className: "text-xs text-gray-600", children: "Tests" })] }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-lg font-bold text-purple-600", children: batch.totalSubmissions }), _jsx("div", { className: "text-xs text-gray-600", children: "Submissions" })] })] })] }), batch.topStudent && (_jsx("div", { className: "mt-3 pt-3 border-t border-gray-100", children: _jsxs("div", { className: "text-sm text-gray-600", children: ["\uD83C\uDFC6 Top Performer: ", _jsx("span", { className: "font-semibold", children: batch.topStudent.fullName }), batch.topStudent.submissions.length > 0 && (_jsxs("span", { className: "ml-2", children: ["(", Math.round(batch.topStudent.submissions.reduce((sum, sub) => sum + sub.percentage, 0) / batch.topStudent.submissions.length), "% avg)"] }))] }) }))] }, batch.batch.id))) })] })] }));
    };
    if (loading && !batchOverview && !detailedResults && !studentPerformance && !subjectAnalysis && !comparativeAnalysis) {
        return (_jsx("div", { className: "flex justify-center items-center h-64", children: _jsx("div", { className: "loading", children: "Loading batch results..." }) }));
    }
    return (_jsxs("div", { className: "fade-in", children: [_jsx("div", { className: "mb-6", children: _jsx("div", { className: "flex space-x-4 border-b border-gray-200", children: [
                        { key: 'overview', label: 'Batch Overview', icon: '📊' },
                        ...(user?.role === 'HEAD_TEACHER' ? [{ key: 'comparative', label: 'Comparative Analysis', icon: '📈' }] : [])
                    ].map(tab => (_jsxs("button", { onClick: () => setActiveView(tab.key), className: `px-4 py-2 font-medium text-sm border-b-2 transition-colors hover-scale ${activeView === tab.key
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'}`, children: [_jsx("span", { className: "mr-2", children: tab.icon }), tab.label] }, tab.key))) }) }), activeView === 'overview' && renderOverview(), activeView === 'detailed' && renderDetailedResults(), activeView === 'student' && renderStudentPerformance(), activeView === 'subjects' && renderSubjectAnalysis(), activeView === 'comparative' && renderComparativeAnalysis()] }));
};
export default BatchResults;
