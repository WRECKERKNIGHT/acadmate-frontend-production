import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, Search, CheckCircle, User, Calendar, Upload, X, Send, Tag, FileText, Download } from 'lucide-react';
import { doubtsAPI, apiUtils } from '../config/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
const DoubtsSystem = () => {
    const { user } = useAuth();
    const [doubts, setDoubts] = useState([]);
    const [selectedDoubt, setSelectedDoubt] = useState(null);
    const [showSubmitForm, setShowSubmitForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        subject: '',
        priority: '',
        search: ''
    });
    // Form states
    const [submitForm, setSubmitForm] = useState({
        title: '',
        description: '',
        subject: '',
        attachments: []
    });
    const [answerForm, setAnswerForm] = useState({
        answer: '',
        attachments: []
    });
    const isTeacher = user?.role === 'TEACHER' || user?.role === 'HEAD_TEACHER';
    // Load doubts
    useEffect(() => {
        loadDoubts();
    }, [filters]);
    const loadDoubts = async () => {
        try {
            setLoading(true);
            const response = isTeacher
                ? await doubtsAPI.getAllDoubts(filters)
                : await doubtsAPI.getMyDoubts(filters);
            setDoubts(response.data?.doubts || []);
        }
        catch (error) {
            toast.error('Failed to load doubts');
            console.error('Error loading doubts:', error);
        }
        finally {
            setLoading(false);
        }
    };
    // Submit new doubt
    const handleSubmitDoubt = async (e) => {
        e.preventDefault();
        if (!submitForm.title || !submitForm.description || !submitForm.subject) {
            toast.error('Please fill all required fields');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('title', submitForm.title);
            formData.append('description', submitForm.description);
            formData.append('subject', submitForm.subject);
            submitForm.attachments.forEach((file, index) => {
                formData.append(`attachments[${index}]`, file);
            });
            await doubtsAPI.submitDoubt({
                title: submitForm.title,
                description: submitForm.description,
                subject: submitForm.subject,
                attachments: submitForm.attachments
            });
            toast.success('Doubt submitted successfully!');
            setSubmitForm({ title: '', description: '', subject: '', attachments: [] });
            setShowSubmitForm(false);
            loadDoubts();
        }
        catch (error) {
            toast.error(apiUtils.handleApiError(error));
        }
    };
    // Answer doubt (teacher only)
    const handleAnswerDoubt = async (doubtId) => {
        if (!answerForm.answer) {
            toast.error('Please provide an answer');
            return;
        }
        try {
            await doubtsAPI.answerDoubt(doubtId, {
                answer: answerForm.answer,
                attachments: answerForm.attachments
            });
            toast.success('Answer submitted successfully!');
            setAnswerForm({ answer: '', attachments: [] });
            loadDoubts();
            // Update selected doubt if it's the one being answered
            if (selectedDoubt?.id === doubtId) {
                const updatedDoubt = { ...selectedDoubt, answer: answerForm.answer };
                setSelectedDoubt(updatedDoubt);
            }
        }
        catch (error) {
            toast.error(apiUtils.handleApiError(error));
        }
    };
    // Update doubt status
    const updateDoubtStatus = async (doubtId, status) => {
        try {
            await doubtsAPI.updateDoubtStatus(doubtId, status);
            toast.success('Status updated successfully!');
            loadDoubts();
        }
        catch (error) {
            toast.error(apiUtils.handleApiError(error));
        }
    };
    // Set doubt priority
    const setDoubtPriority = async (doubtId, priority) => {
        try {
            await doubtsAPI.setPriority(doubtId, priority);
            toast.success('Priority updated successfully!');
            loadDoubts();
        }
        catch (error) {
            toast.error(apiUtils.handleApiError(error));
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-blue-100 text-blue-800';
            case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800';
            case 'RESOLVED': return 'bg-green-100 text-green-800';
            case 'CLOSED': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'LOW': return 'bg-green-100 text-green-800';
            case 'MEDIUM': return 'bg-blue-100 text-blue-800';
            case 'HIGH': return 'bg-orange-100 text-orange-800';
            case 'URGENT': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    const filteredDoubts = doubts.filter(doubt => {
        if (filters.search && !doubt.title.toLowerCase().includes(filters.search.toLowerCase()) &&
            !doubt.description.toLowerCase().includes(filters.search.toLowerCase()))
            return false;
        if (filters.status && doubt.status !== filters.status)
            return false;
        if (filters.subject && doubt.subject !== filters.subject)
            return false;
        if (filters.priority && doubt.priority !== filters.priority)
            return false;
        return true;
    });
    return (_jsxs("div", { className: "flex h-full bg-gray-50", children: [_jsxs("div", { className: "flex-1 flex flex-col", children: [_jsxs("div", { className: "bg-white shadow-sm border-b p-6", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(MessageSquare, { className: "w-8 h-8 text-indigo-600" }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: isTeacher ? 'Student Doubts' : 'My Doubts' }), _jsx("p", { className: "text-gray-600", children: isTeacher ? 'Help students by answering their questions' : 'Ask questions and get help from teachers' })] })] }), !isTeacher && (_jsxs(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => setShowSubmitForm(true), className: "bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 shadow-lg hover:shadow-xl", children: [_jsx(Plus, { className: "w-5 h-5" }), "Ask Question"] }))] }), _jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsx("div", { className: "flex-1 min-w-64", children: _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search doubts...", value: filters.search, onChange: (e) => setFilters({ ...filters, search: e.target.value }), className: "pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" })] }) }), _jsxs("select", { value: filters.status, onChange: (e) => setFilters({ ...filters, status: e.target.value }), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500", children: [_jsx("option", { value: "", children: "All Status" }), _jsx("option", { value: "OPEN", children: "Open" }), _jsx("option", { value: "IN_PROGRESS", children: "In Progress" }), _jsx("option", { value: "RESOLVED", children: "Resolved" }), _jsx("option", { value: "CLOSED", children: "Closed" })] }), _jsxs("select", { value: filters.subject, onChange: (e) => setFilters({ ...filters, subject: e.target.value }), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500", children: [_jsx("option", { value: "", children: "All Subjects" }), _jsx("option", { value: "Mathematics", children: "Mathematics" }), _jsx("option", { value: "Physics", children: "Physics" }), _jsx("option", { value: "Chemistry", children: "Chemistry" }), _jsx("option", { value: "Biology", children: "Biology" }), _jsx("option", { value: "English", children: "English" })] }), _jsxs("select", { value: filters.priority, onChange: (e) => setFilters({ ...filters, priority: e.target.value }), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500", children: [_jsx("option", { value: "", children: "All Priority" }), _jsx("option", { value: "LOW", children: "Low" }), _jsx("option", { value: "MEDIUM", children: "Medium" }), _jsx("option", { value: "HIGH", children: "High" }), _jsx("option", { value: "URGENT", children: "Urgent" })] })] })] }), _jsx("div", { className: "flex-1 overflow-auto p-6", children: loading ? (_jsx("div", { className: "flex justify-center items-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" }) })) : filteredDoubts.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx(MessageSquare, { className: "w-16 h-16 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-medium text-gray-900 mb-2", children: "No doubts found" }), _jsx("p", { className: "text-gray-600", children: !isTeacher ? "You haven't asked any questions yet." : "No student doubts to display." })] })) : (_jsx("div", { className: "grid gap-4", children: filteredDoubts.map((doubt) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow cursor-pointer", onClick: () => setSelectedDoubt(doubt), children: _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: doubt.title }), _jsx("p", { className: "text-gray-600 line-clamp-2", children: doubt.description })] }), _jsxs("div", { className: "flex flex-col gap-2 ml-4", children: [_jsx("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doubt.status)}`, children: doubt.status.replace('_', ' ') }), _jsx("span", { className: `px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(doubt.priority)}`, children: doubt.priority })] })] }), _jsxs("div", { className: "flex items-center justify-between text-sm text-gray-500", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(User, { className: "w-4 h-4" }), doubt.studentName] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Tag, { className: "w-4 h-4" }), doubt.subject] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "w-4 h-4" }), apiUtils.formatDate(doubt.createdAt)] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [doubt.attachments && doubt.attachments.length > 0 && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(FileText, { className: "w-4 h-4" }), doubt.attachments.length] })), doubt.answer && (_jsxs("div", { className: "flex items-center gap-1 text-green-600", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), "Answered"] }))] })] })] }) }, doubt.id))) })) })] }), _jsx(AnimatePresence, { children: showSubmitForm && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, className: "bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto", children: [_jsx("div", { className: "p-6 border-b", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-xl font-semibold", children: "Ask a Question" }), _jsx("button", { onClick: () => setShowSubmitForm(false), className: "p-2 hover:bg-gray-100 rounded-lg", children: _jsx(X, { className: "w-5 h-5" }) })] }) }), _jsxs("form", { onSubmit: handleSubmitDoubt, className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Title *" }), _jsx("input", { type: "text", value: submitForm.title, onChange: (e) => setSubmitForm({ ...submitForm, title: e.target.value }), placeholder: "Brief title for your question", className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Subject *" }), _jsxs("select", { value: submitForm.subject, onChange: (e) => setSubmitForm({ ...submitForm, subject: e.target.value }), className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500", required: true, children: [_jsx("option", { value: "", children: "Select subject" }), _jsx("option", { value: "Mathematics", children: "Mathematics" }), _jsx("option", { value: "Physics", children: "Physics" }), _jsx("option", { value: "Chemistry", children: "Chemistry" }), _jsx("option", { value: "Biology", children: "Biology" }), _jsx("option", { value: "English", children: "English" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Description *" }), _jsx("textarea", { value: submitForm.description, onChange: (e) => setSubmitForm({ ...submitForm, description: e.target.value }), placeholder: "Describe your question in detail...", rows: 6, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Attachments" }), _jsxs("div", { className: "border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-400 transition-colors", children: [_jsx("input", { type: "file", multiple: true, accept: ".jpg,.jpeg,.png,.pdf,.doc,.docx", onChange: (e) => setSubmitForm({ ...submitForm, attachments: Array.from(e.target.files || []) }), className: "hidden", id: "doubt-attachments" }), _jsx("label", { htmlFor: "doubt-attachments", className: "cursor-pointer", children: _jsxs("div", { className: "text-center", children: [_jsx(Upload, { className: "w-8 h-8 text-gray-400 mx-auto mb-2" }), _jsx("p", { className: "text-sm text-gray-600", children: "Click to upload files" }), _jsx("p", { className: "text-xs text-gray-400 mt-1", children: "PNG, JPG, PDF, DOC up to 10MB each" })] }) }), submitForm.attachments.length > 0 && (_jsx("div", { className: "mt-4 space-y-2", children: submitForm.attachments.map((file, index) => (_jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [_jsx(FileText, { className: "w-4 h-4" }), file.name, _jsx("button", { type: "button", onClick: () => setSubmitForm({
                                                                        ...submitForm,
                                                                        attachments: submitForm.attachments.filter((_, i) => i !== index)
                                                                    }), className: "text-red-500 hover:text-red-700", children: _jsx(X, { className: "w-4 h-4" }) })] }, index))) }))] })] }), _jsxs("div", { className: "flex gap-4 pt-4", children: [_jsx("button", { type: "button", onClick: () => setShowSubmitForm(false), className: "flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium", children: "Cancel" }), _jsx("button", { type: "submit", className: "flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium", children: "Submit Question" })] })] })] }) })) }), _jsx(AnimatePresence, { children: selectedDoubt && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: _jsxs(motion.div, { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, className: "bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-auto", children: [_jsx("div", { className: "p-6 border-b", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-xl font-semibold", children: selectedDoubt.title }), _jsx("button", { onClick: () => setSelectedDoubt(null), className: "p-2 hover:bg-gray-100 rounded-lg", children: _jsx(X, { className: "w-5 h-5" }) })] }) }), _jsxs("div", { className: "p-6 space-y-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-4 mb-4", children: [_jsx("span", { className: `px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedDoubt.status)}`, children: selectedDoubt.status.replace('_', ' ') }), _jsx("span", { className: `px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedDoubt.priority)}`, children: selectedDoubt.priority }), _jsxs("span", { className: "text-sm text-gray-500", children: [selectedDoubt.subject, " \u2022 ", apiUtils.formatDate(selectedDoubt.createdAt)] })] }), _jsx("div", { className: "bg-gray-50 rounded-lg p-4 mb-4", children: _jsx("p", { className: "text-gray-800 whitespace-pre-wrap", children: selectedDoubt.description }) }), selectedDoubt.attachments && selectedDoubt.attachments.length > 0 && (_jsxs("div", { children: [_jsx("h4", { className: "font-medium text-gray-900 mb-2", children: "Attachments" }), _jsx("div", { className: "space-y-2", children: selectedDoubt.attachments.map((attachment, index) => (_jsxs("div", { className: "flex items-center gap-2 text-sm", children: [_jsx(FileText, { className: "w-4 h-4 text-gray-400" }), _jsxs("span", { children: ["Attachment ", index + 1] }), _jsx("button", { className: "text-indigo-600 hover:text-indigo-700", children: _jsx(Download, { className: "w-4 h-4" }) })] }, index))) })] }))] }), isTeacher && (_jsx("div", { className: "border-t pt-6", children: _jsxs("div", { className: "flex gap-2 mb-4", children: [_jsxs("select", { value: selectedDoubt.status, onChange: (e) => updateDoubtStatus(selectedDoubt.id, e.target.value), className: "px-3 py-2 border border-gray-300 rounded-lg text-sm", children: [_jsx("option", { value: "OPEN", children: "Open" }), _jsx("option", { value: "IN_PROGRESS", children: "In Progress" }), _jsx("option", { value: "RESOLVED", children: "Resolved" }), _jsx("option", { value: "CLOSED", children: "Closed" })] }), _jsxs("select", { value: selectedDoubt.priority, onChange: (e) => setDoubtPriority(selectedDoubt.id, e.target.value), className: "px-3 py-2 border border-gray-300 rounded-lg text-sm", children: [_jsx("option", { value: "LOW", children: "Low Priority" }), _jsx("option", { value: "MEDIUM", children: "Medium Priority" }), _jsx("option", { value: "HIGH", children: "High Priority" }), _jsx("option", { value: "URGENT", children: "Urgent" })] })] }) })), selectedDoubt.answer ? (_jsxs("div", { className: "border-t pt-6", children: [_jsxs("h4", { className: "font-medium text-gray-900 mb-3 flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-600" }), "Teacher's Answer"] }), _jsx("div", { className: "bg-green-50 rounded-lg p-4", children: _jsx("p", { className: "text-gray-800 whitespace-pre-wrap", children: selectedDoubt.answer }) })] })) : isTeacher && (_jsxs("div", { className: "border-t pt-6", children: [_jsx("h4", { className: "font-medium text-gray-900 mb-3", children: "Provide Answer" }), _jsx("textarea", { value: answerForm.answer, onChange: (e) => setAnswerForm({ ...answerForm, answer: e.target.value }), placeholder: "Type your answer here...", rows: 4, className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none" }), _jsx("div", { className: "flex gap-2 mt-4", children: _jsxs("button", { onClick: () => handleAnswerDoubt(selectedDoubt.id), className: "bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2", children: [_jsx(Send, { className: "w-4 h-4" }), "Submit Answer"] }) })] }))] })] }) })) })] }));
};
export default DoubtsSystem;
