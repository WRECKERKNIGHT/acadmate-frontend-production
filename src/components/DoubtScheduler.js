import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Button, Input, Badge, Modal, Loading, icons } from './ui';
import api from '../config/api';
import toast from 'react-hot-toast';
const DoubtScheduler = () => {
    const [doubts, setDoubts] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoubt, setSelectedDoubt] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
    // Scheduling state
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [duration, setDuration] = useState(30);
    const [notes, setNotes] = useState('');
    const [scheduling, setScheduling] = useState(false);
    // Create doubt state
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [newDoubt, setNewDoubt] = useState({
        subject: '',
        description: '',
        priority: 'MEDIUM',
        imageUrl: ''
    });
    useEffect(() => {
        loadData();
    }, []);
    const loadData = async () => {
        try {
            setLoading(true);
            const [doubtsRes, teachersRes] = await Promise.all([
                api.doubts.getAll(),
                api.profile.getAllTeachers()
            ]);
            setDoubts(doubtsRes.data || []);
            setTeachers(teachersRes.data || []);
        }
        catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load data');
        }
        finally {
            setLoading(false);
        }
    };
    const createDoubt = async () => {
        if (!newDoubt.subject || !newDoubt.description) {
            toast.error('Please fill in all required fields');
            return;
        }
        try {
            setScheduling(true);
            await api.doubts.create(newDoubt);
            toast.success('Doubt submitted successfully');
            setCreateModalOpen(false);
            setNewDoubt({
                subject: '',
                description: '',
                priority: 'MEDIUM',
                imageUrl: ''
            });
            loadData();
        }
        catch (error) {
            toast.error(error.response?.data?.error || 'Failed to create doubt');
        }
        finally {
            setScheduling(false);
        }
    };
    const scheduleAppointment = async () => {
        if (!selectedDoubt || !selectedTeacher || !selectedDate || !selectedTime) {
            toast.error('Please fill in all scheduling details');
            return;
        }
        try {
            setScheduling(true);
            const scheduledAt = new Date(`${selectedDate}T${selectedTime}`);
            await api.doubts.scheduleAppointment(selectedDoubt.id, {
                teacherId: selectedTeacher.id,
                scheduledAt: scheduledAt.toISOString(),
                duration,
                notes
            });
            toast.success('Appointment scheduled successfully');
            setScheduleModalOpen(false);
            resetSchedulingState();
            loadData();
        }
        catch (error) {
            toast.error(error.response?.data?.error || 'Failed to schedule appointment');
        }
        finally {
            setScheduling(false);
        }
    };
    const resetSchedulingState = () => {
        setSelectedTeacher(null);
        setSelectedDate('');
        setSelectedTime('');
        setDuration(30);
        setNotes('');
    };
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 9; hour <= 17; hour++) {
            for (let minute = 0; minute < 60; minute += 30) {
                const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                slots.push({
                    time,
                    available: Math.random() > 0.3, // Mock availability
                    teacher: selectedTeacher || undefined
                });
            }
        }
        return slots;
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'HIGH': return 'error';
            case 'MEDIUM': return 'warning';
            case 'LOW': return 'success';
            default: return 'primary';
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'RESOLVED': return 'success';
            case 'IN_PROGRESS': return 'warning';
            case 'PENDING': return 'info';
            default: return 'primary';
        }
    };
    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleString();
    };
    if (loading)
        return _jsx(Loading, { className: "h-64" });
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-slate-100", children: "Doubt Management" }), _jsx("p", { className: "text-slate-400 mt-1", children: "Submit doubts and schedule appointments with teachers" })] }), _jsx(Button, { icon: "plus", onClick: () => setCreateModalOpen(true), children: "Submit New Doubt" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [_jsx(Card, { className: "p-6", gradient: true, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-slate-400 text-sm", children: "Total Doubts" }), _jsx("p", { className: "text-2xl font-bold text-slate-100", children: doubts.length })] }), _jsx(icons.message, { className: "w-8 h-8 text-blue-400" })] }) }), _jsx(Card, { className: "p-6", gradient: true, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-slate-400 text-sm", children: "Pending" }), _jsx("p", { className: "text-2xl font-bold text-slate-100", children: doubts.filter(d => d.status === 'PENDING').length })] }), _jsx(icons.clock, { className: "w-8 h-8 text-yellow-400" })] }) }), _jsx(Card, { className: "p-6", gradient: true, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-slate-400 text-sm", children: "Scheduled" }), _jsx("p", { className: "text-2xl font-bold text-slate-100", children: doubts.filter(d => d.appointment).length })] }), _jsx(icons.calendar, { className: "w-8 h-8 text-green-400" })] }) }), _jsx(Card, { className: "p-6", gradient: true, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-slate-400 text-sm", children: "Resolved" }), _jsx("p", { className: "text-2xl font-bold text-slate-100", children: doubts.filter(d => d.status === 'RESOLVED').length })] }), _jsx(icons.success, { className: "w-8 h-8 text-emerald-400" })] }) })] }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: _jsx(AnimatePresence, { children: doubts.map((doubt) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, layout: true, children: _jsxs(Card, { className: "p-6", hover: true, onClick: () => {
                                setSelectedDoubt(doubt);
                                setModalOpen(true);
                            }, children: [_jsx("div", { className: "flex items-start justify-between mb-4", children: _jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("h3", { className: "font-semibold text-slate-100", children: doubt.subject }), _jsx(Badge, { variant: getPriorityColor(doubt.priority), children: doubt.priority }), _jsx(Badge, { variant: getStatusColor(doubt.status), children: doubt.status })] }), _jsx("p", { className: "text-slate-400 text-sm line-clamp-2", children: doubt.description })] }) }), doubt.appointment ? (_jsx("div", { className: "mt-4 p-3 bg-slate-700/30 rounded-lg", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("p", { className: "text-sm font-medium text-slate-200", children: ["Scheduled with ", doubt.appointment.teacher.fullName] }), _jsxs("p", { className: "text-xs text-slate-400", children: [formatDateTime(doubt.appointment.scheduledAt), " \u2022 ", doubt.appointment.duration, "min"] })] }), _jsx(Badge, { variant: "success", children: doubt.appointment.status })] }) })) : (_jsx("div", { className: "mt-4 flex justify-end", children: _jsx(Button, { size: "sm", variant: "primary", icon: "calendar", onClick: (e) => {
                                            e.stopPropagation();
                                            setSelectedDoubt(doubt);
                                            setScheduleModalOpen(true);
                                        }, children: "Schedule" }) })), _jsxs("div", { className: "mt-3 text-xs text-slate-500", children: ["Created ", new Date(doubt.createdAt).toLocaleDateString()] })] }) }, doubt.id))) }) }), doubts.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx(icons.message, { className: "w-16 h-16 text-slate-600 mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-medium text-slate-300 mb-2", children: "No doubts yet" }), _jsx("p", { className: "text-slate-500 mb-6", children: "Submit your first doubt to get started" }), _jsx(Button, { icon: "plus", onClick: () => setCreateModalOpen(true), children: "Submit New Doubt" })] })), _jsx(Modal, { isOpen: createModalOpen, onClose: () => setCreateModalOpen(false), title: "Submit New Doubt", size: "lg", children: _jsxs("div", { className: "space-y-6", children: [_jsx(Input, { label: "Subject", placeholder: "Enter the subject", value: newDoubt.subject, onChange: (e) => setNewDoubt(prev => ({ ...prev, subject: e.target.value })), icon: "book" }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-300 mb-2", children: "Description" }), _jsx("textarea", { placeholder: "Describe your doubt in detail...", value: newDoubt.description, onChange: (e) => setNewDoubt(prev => ({ ...prev, description: e.target.value })), rows: 4, className: "w-full rounded-lg border border-slate-600 bg-slate-800/50 px-4 py-2.5 text-slate-200 \r\n                placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 \r\n                focus:outline-none transition-colors resize-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-300 mb-2", children: "Priority" }), _jsx("div", { className: "flex gap-3", children: ['LOW', 'MEDIUM', 'HIGH'].map(priority => (_jsx("button", { type: "button", onClick: () => setNewDoubt(prev => ({ ...prev, priority })), className: `px-4 py-2 rounded-lg border font-medium text-sm transition-colors ${newDoubt.priority === priority
                                            ? 'bg-blue-600 border-blue-600 text-white'
                                            : 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600'}`, children: priority }, priority))) })] }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx(Button, { variant: "secondary", onClick: () => setCreateModalOpen(false), children: "Cancel" }), _jsx(Button, { variant: "primary", loading: scheduling, onClick: createDoubt, children: "Submit Doubt" })] })] }) }), _jsx(Modal, { isOpen: scheduleModalOpen, onClose: () => {
                    setScheduleModalOpen(false);
                    resetSchedulingState();
                }, title: "Schedule Appointment", size: "xl", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-300 mb-3", children: "Select Teacher" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: teachers.filter(t => t.isActive).map(teacher => (_jsxs("button", { onClick: () => setSelectedTeacher(teacher), className: `p-4 rounded-lg border text-left transition-colors ${selectedTeacher?.id === teacher.id
                                            ? 'bg-blue-600/20 border-blue-600 text-blue-400'
                                            : 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'}`, children: [_jsx("div", { className: "font-medium", children: teacher.fullName }), _jsx("div", { className: "text-sm opacity-75", children: teacher.uid }), _jsx("div", { className: "flex flex-wrap gap-1 mt-2", children: teacher.subjects.slice(0, 3).map(subject => (_jsx("span", { className: "text-xs px-2 py-1 bg-slate-700 rounded", children: subject }, subject))) })] }, teacher.id))) })] }), selectedTeacher && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsx("div", { children: _jsx(Input, { label: "Date", type: "date", value: selectedDate, onChange: (e) => setSelectedDate(e.target.value), min: new Date().toISOString().split('T')[0] }) }), selectedDate && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-300 mb-2", children: "Time Slots" }), _jsx("div", { className: "grid grid-cols-3 gap-2 max-h-48 overflow-y-auto", children: generateTimeSlots().map(slot => (_jsx("button", { onClick: () => slot.available && setSelectedTime(slot.time), disabled: !slot.available, className: `p-2 text-xs rounded border transition-colors ${selectedTime === slot.time
                                                    ? 'bg-blue-600 border-blue-600 text-white'
                                                    : slot.available
                                                        ? 'bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700'
                                                        : 'bg-slate-900 border-slate-700 text-slate-500 cursor-not-allowed'}`, children: slot.time }, slot.time))) })] }))] })), selectedTime && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-300 mb-2", children: "Duration (minutes)" }), _jsxs("select", { value: duration, onChange: (e) => setDuration(Number(e.target.value)), className: "w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200", children: [_jsx("option", { value: 15, children: "15 minutes" }), _jsx("option", { value: 30, children: "30 minutes" }), _jsx("option", { value: 45, children: "45 minutes" }), _jsx("option", { value: 60, children: "1 hour" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-300 mb-2", children: "Additional Notes" }), _jsx("textarea", { placeholder: "Any specific requirements...", value: notes, onChange: (e) => setNotes(e.target.value), rows: 3, className: "w-full rounded-lg border border-slate-600 bg-slate-800/50 px-3 py-2 text-slate-200 \r\n                    placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 \r\n                    focus:outline-none transition-colors resize-none text-sm" })] })] })), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx(Button, { variant: "secondary", onClick: () => {
                                        setScheduleModalOpen(false);
                                        resetSchedulingState();
                                    }, children: "Cancel" }), _jsx(Button, { variant: "primary", loading: scheduling, onClick: scheduleAppointment, disabled: !selectedTeacher || !selectedDate || !selectedTime, children: "Schedule Appointment" })] })] }) }), _jsx(Modal, { isOpen: modalOpen, onClose: () => setModalOpen(false), title: "Doubt Details", size: "lg", children: selectedDoubt && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-3", children: [_jsx("h3", { className: "text-xl font-semibold text-slate-100", children: selectedDoubt.subject }), _jsx(Badge, { variant: getPriorityColor(selectedDoubt.priority), children: selectedDoubt.priority }), _jsx(Badge, { variant: getStatusColor(selectedDoubt.status), children: selectedDoubt.status })] }), _jsx("p", { className: "text-slate-300", children: selectedDoubt.description })] }), selectedDoubt.imageUrl && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-slate-300 mb-2", children: "Attachment" }), _jsx("img", { src: selectedDoubt.imageUrl, alt: "Doubt attachment", className: "max-w-full h-auto rounded-lg border border-slate-600" })] })), selectedDoubt.appointment && (_jsxs("div", { className: "p-4 bg-slate-800/50 rounded-lg", children: [_jsx("h4", { className: "font-medium text-slate-200 mb-2", children: "Scheduled Appointment" }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("p", { className: "text-slate-300", children: ["Teacher: ", selectedDoubt.appointment.teacher.fullName] }), _jsxs("p", { className: "text-slate-300", children: ["Date & Time: ", formatDateTime(selectedDoubt.appointment.scheduledAt)] }), _jsxs("p", { className: "text-slate-300", children: ["Duration: ", selectedDoubt.appointment.duration, " minutes"] }), _jsxs("p", { className: "text-slate-300", children: ["Status: ", _jsx(Badge, { variant: "success", children: selectedDoubt.appointment.status })] })] })] })), _jsxs("div", { className: "text-sm text-slate-500", children: ["Submitted on ", new Date(selectedDoubt.createdAt).toLocaleDateString()] })] })) })] }));
};
export default DoubtScheduler;
