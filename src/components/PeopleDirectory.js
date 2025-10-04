import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Card, Button, Input, Badge, Loading, Modal, icons } from './ui';
import api from '../config/api';
const PeopleDirectory = () => {
    const [teachers, setTeachers] = useState([]);
    const [students, setStudents] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('teachers');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        subject: '',
        batch: '',
        status: 'all'
    });
    useEffect(() => {
        loadPeopleData();
    }, []);
    const loadPeopleData = async () => {
        try {
            setLoading(true);
            const [teachersRes, studentsRes, batchesRes] = await Promise.all([
                api.profile.getAllTeachers(),
                api.profile.getAllStudents(),
                api.classes.getAll()
            ]);
            setTeachers(teachersRes.data || []);
            setStudents(studentsRes.data || []);
            setBatches(batchesRes.data || []);
        }
        catch (error) {
            console.error('Error loading people data:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const filteredTeachers = teachers.filter(teacher => {
        const matchesSearch = teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = !filters.subject || teacher.subjects.includes(filters.subject);
        const matchesBatch = !filters.batch || teacher.batches.includes(filters.batch);
        const matchesStatus = filters.status === 'all' ||
            (filters.status === 'active' && teacher.isActive) ||
            (filters.status === 'inactive' && !teacher.isActive);
        return matchesSearch && matchesSubject && matchesBatch && matchesStatus;
    });
    const filteredStudents = students.filter(student => {
        const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBatch = !filters.batch || student.batchType === filters.batch;
        const matchesStatus = filters.status === 'all' ||
            (filters.status === 'active' && student.isActive) ||
            (filters.status === 'inactive' && !student.isActive);
        return matchesSearch && matchesBatch && matchesStatus;
    });
    const TeacherCard = ({ teacher }) => {
        const UserIcon = icons.user;
        const MailIcon = icons.mail;
        const BookIcon = icons.book;
        const GraduationIcon = icons.graduation;
        return (_jsx(Card, { className: "p-6", hover: true, onClick: () => {
                setSelectedPerson(teacher);
                setModalOpen(true);
            }, children: _jsxs("div", { className: "flex items-start space-x-4", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center", children: teacher.profileImage ? (_jsx("img", { src: teacher.profileImage, alt: teacher.fullName, className: "w-16 h-16 rounded-full object-cover" })) : (_jsx(UserIcon, { className: "w-8 h-8 text-white" })) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold text-slate-100 truncate", children: teacher.fullName }), _jsx(Badge, { variant: teacher.isActive ? 'success' : 'error', children: teacher.isActive ? 'Active' : 'Inactive' })] }), _jsxs("div", { className: "flex items-center space-x-1 mt-1", children: [_jsx(MailIcon, { className: "w-4 h-4 text-slate-400" }), _jsx("p", { className: "text-sm text-slate-300 truncate", children: teacher.email })] }), _jsxs("div", { className: "flex items-center space-x-1 mt-2", children: [_jsx(BookIcon, { className: "w-4 h-4 text-slate-400" }), _jsxs("div", { className: "flex flex-wrap gap-1", children: [teacher.subjects.slice(0, 3).map(subject => (_jsx(Badge, { variant: "primary", size: "sm", children: subject }, subject))), teacher.subjects.length > 3 && (_jsxs(Badge, { variant: "info", size: "sm", children: ["+", teacher.subjects.length - 3] }))] })] }), teacher.batches.length > 0 && (_jsxs("div", { className: "flex items-center space-x-1 mt-2", children: [_jsx(GraduationIcon, { className: "w-4 h-4 text-slate-400" }), _jsxs("div", { className: "flex flex-wrap gap-1", children: [teacher.batches.slice(0, 2).map(batch => (_jsx(Badge, { variant: "warning", size: "sm", children: batch }, batch))), teacher.batches.length > 2 && (_jsxs(Badge, { variant: "info", size: "sm", children: ["+", teacher.batches.length - 2] }))] })] }))] })] }) }));
    };
    const StudentCard = ({ student }) => {
        const UserIcon = icons.user;
        const MailIcon = icons.mail;
        const GraduationIcon = icons.graduation;
        return (_jsx(Card, { className: "p-6", hover: true, onClick: () => {
                setSelectedPerson(student);
                setModalOpen(true);
            }, children: _jsxs("div", { className: "flex items-start space-x-4", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center", children: student.profileImage ? (_jsx("img", { src: student.profileImage, alt: student.fullName, className: "w-16 h-16 rounded-full object-cover" })) : (_jsx(UserIcon, { className: "w-8 h-8 text-white" })) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-lg font-semibold text-slate-100 truncate", children: student.fullName }), _jsx(Badge, { variant: student.isActive ? 'success' : 'error', children: student.isActive ? 'Active' : 'Inactive' })] }), _jsxs("div", { className: "flex items-center space-x-1 mt-1", children: [_jsx(MailIcon, { className: "w-4 h-4 text-slate-400" }), _jsx("p", { className: "text-sm text-slate-300 truncate", children: student.email })] }), _jsxs("div", { className: "flex items-center space-x-1 mt-2", children: [_jsx(GraduationIcon, { className: "w-4 h-4 text-slate-400" }), _jsx(Badge, { variant: "warning", size: "sm", children: student.batchType })] }), student.rollNumber && (_jsxs("p", { className: "text-sm text-slate-400 mt-1", children: ["Roll No: ", student.rollNumber] }))] })] }) }));
    };
    const BatchCard = ({ batch }) => {
        const UsersIcon = icons.users;
        const BookIcon = icons.book;
        return (_jsx(Card, { className: "p-6", gradient: true, children: _jsx("div", { className: "flex items-start justify-between", children: _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-slate-100", children: batch.name }), _jsx("p", { className: "text-slate-300 text-sm mt-1", children: batch.type }), _jsxs("div", { className: "flex items-center space-x-4 mt-4", children: [_jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(UsersIcon, { className: "w-4 h-4 text-slate-400" }), _jsxs("span", { className: "text-sm text-slate-300", children: [batch.students.length, " Students"] })] }), _jsxs("div", { className: "flex items-center space-x-1", children: [_jsx(BookIcon, { className: "w-4 h-4 text-slate-400" }), _jsxs("span", { className: "text-sm text-slate-300", children: [batch.subjects.length, " Subjects"] })] })] }), _jsxs("div", { className: "mt-3", children: [_jsx("p", { className: "text-xs text-slate-400 mb-1", children: "Subjects:" }), _jsx("div", { className: "flex flex-wrap gap-1", children: batch.subjects.map(subject => (_jsx(Badge, { variant: "primary", size: "sm", children: subject }, subject))) })] })] }) }) }));
    };
    const PersonModal = () => {
        if (!selectedPerson)
            return null;
        const isTeacher = 'subjects' in selectedPerson;
        const person = selectedPerson;
        const UserIcon = icons.user;
        const MailIcon = icons.mail;
        const PhoneIcon = icons.phone;
        const LocationIcon = icons.location;
        return (_jsx(Modal, { isOpen: modalOpen, onClose: () => setModalOpen(false), title: `${isTeacher ? 'Teacher' : 'Student'} Details`, size: "lg", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("div", { className: "w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center", children: person.profileImage ? (_jsx("img", { src: person.profileImage, alt: person.fullName, className: "w-20 h-20 rounded-full object-cover" })) : (_jsx(UserIcon, { className: "w-10 h-10 text-white" })) }), _jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-bold text-slate-100", children: person.fullName }), _jsx(Badge, { variant: person.isActive ? 'success' : 'error', className: "mt-1", children: person.isActive ? 'Active' : 'Inactive' })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-slate-200 mb-3", children: "Contact Information" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(MailIcon, { className: "w-4 h-4 text-slate-400" }), _jsx("span", { className: "text-slate-300", children: person.email })] }), person.phone && (_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(PhoneIcon, { className: "w-4 h-4 text-slate-400" }), _jsx("span", { className: "text-slate-300", children: person.phone })] }))] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-slate-200 mb-3", children: isTeacher ? 'Teaching Details' : 'Academic Details' }), isTeacher ? (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-slate-400", children: "Subjects:" }), _jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: person.subjects.map(subject => (_jsx(Badge, { variant: "primary", children: subject }, subject))) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-slate-400", children: "Batches:" }), _jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: person.batches.map(batch => (_jsx(Badge, { variant: "warning", children: batch }, batch))) })] })] })) : (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-slate-400", children: "Batch:" }), _jsx(Badge, { variant: "warning", children: person.batchType })] }), person.rollNumber && (_jsxs("div", { children: [_jsx("p", { className: "text-sm text-slate-400", children: "Roll Number:" }), _jsx("p", { className: "text-slate-300", children: person.rollNumber })] }))] }))] })] })] }) }));
    };
    if (loading)
        return _jsx(Loading, { className: "h-64" });
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-3xl font-bold text-slate-100", children: "People Directory" }), _jsx(Button, { icon: "refresh", onClick: loadPeopleData, children: "Refresh" })] }), _jsx("div", { className: "flex space-x-1 bg-slate-800/50 rounded-lg p-1", children: ['teachers', 'students', 'batches'].map(tab => (_jsx("button", { onClick: () => setActiveTab(tab), className: `flex-1 px-4 py-2 rounded-md font-medium text-sm transition-all ${activeTab === tab
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'}`, children: tab.charAt(0).toUpperCase() + tab.slice(1) }, tab))) }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsx("div", { className: "flex-1", children: _jsx(Input, { placeholder: `Search ${activeTab}...`, value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), icon: "search" }) }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("select", { value: filters.batch, onChange: (e) => setFilters(prev => ({ ...prev, batch: e.target.value })), className: "px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200", children: [_jsx("option", { value: "", children: "All Batches" }), batches.map(batch => (_jsx("option", { value: batch.type, children: batch.type }, batch.id)))] }), _jsxs("select", { value: filters.status, onChange: (e) => setFilters(prev => ({ ...prev, status: e.target.value })), className: "px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200", children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "active", children: "Active" }), _jsx("option", { value: "inactive", children: "Inactive" })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [activeTab === 'teachers' && (_jsx(_Fragment, { children: filteredTeachers.length > 0 ? (filteredTeachers.map(teacher => (_jsx(TeacherCard, { teacher: teacher }, teacher.id)))) : (_jsxs("div", { className: "col-span-full text-center py-12", children: [_jsx("div", { className: "w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center", children: _jsx(icons.users, { className: "w-8 h-8 text-slate-400" }) }), _jsx("p", { className: "text-slate-400", children: "No teachers found" })] })) })), activeTab === 'students' && (_jsx(_Fragment, { children: filteredStudents.length > 0 ? (filteredStudents.map(student => (_jsx(StudentCard, { student: student }, student.id)))) : (_jsxs("div", { className: "col-span-full text-center py-12", children: [_jsx("div", { className: "w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center", children: _jsx(icons.graduation, { className: "w-8 h-8 text-slate-400" }) }), _jsx("p", { className: "text-slate-400", children: "No students found" })] })) })), activeTab === 'batches' && (_jsx(_Fragment, { children: batches.length > 0 ? (batches.map(batch => (_jsx(BatchCard, { batch: batch }, batch.id)))) : (_jsxs("div", { className: "col-span-full text-center py-12", children: [_jsx("div", { className: "w-16 h-16 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center", children: _jsx(icons.book, { className: "w-8 h-8 text-slate-400" }) }), _jsx("p", { className: "text-slate-400", children: "No batches found" })] })) }))] }), _jsx(PersonModal, {})] }));
};
export default PeopleDirectory;
