import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
const EventsManagement = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming');
    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'PTM',
        scheduledAt: '',
        duration: 60,
        location: '',
        maxParticipants: '',
        isRecurring: false,
        recurringPattern: '',
        batchIds: [],
        participantUids: []
    });
    useEffect(() => {
        fetchEvents();
        fetchBatches();
    }, []);
    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/events');
            setEvents(response.data);
        }
        catch (error) {
            console.error('Error fetching events:', error);
            toast.error('Failed to fetch events');
        }
        finally {
            setLoading(false);
        }
    };
    const fetchBatches = async () => {
        try {
            // This would be an API endpoint to get all batches
            const batches = [
                { id: '1', type: 'CLASS_7', name: 'Class 7 In-Class' },
                { id: '2', type: 'CLASS_8', name: 'Class 8 In-Class' },
                { id: '3', type: 'CLASS_9', name: 'Class 9 In-Class' },
                { id: '4', type: 'CLASS_10', name: 'Class 10 In-Class' },
                { id: '5', type: 'NEET_11', name: 'NEET Class 11' },
                { id: '6', type: 'NEET_12', name: 'NEET Class 12' },
                { id: '7', type: 'PCM_11', name: 'PCM Class 11' },
                { id: '8', type: 'PCM_12', name: 'PCM Class 12' }
            ];
            setBatches(batches);
        }
        catch (error) {
            console.error('Error fetching batches:', error);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
                scheduledAt: new Date(formData.scheduledAt).toISOString()
            };
            if (editingEvent) {
                await axios.put(`/api/events/${editingEvent.id}`, payload);
                toast.success('Event updated successfully');
            }
            else {
                await axios.post('/api/events', payload);
                toast.success('Event created successfully');
            }
            resetForm();
            fetchEvents();
        }
        catch (error) {
            console.error('Error saving event:', error);
            toast.error(error.response?.data?.message || 'Failed to save event');
        }
        finally {
            setLoading(false);
        }
    };
    const handleDelete = async (eventId) => {
        if (!confirm('Are you sure you want to delete this event?'))
            return;
        try {
            await axios.delete(`/api/events/${eventId}`);
            toast.success('Event deleted successfully');
            fetchEvents();
        }
        catch (error) {
            console.error('Error deleting event:', error);
            toast.error(error.response?.data?.message || 'Failed to delete event');
        }
    };
    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            type: 'PTM',
            scheduledAt: '',
            duration: 60,
            location: '',
            maxParticipants: '',
            isRecurring: false,
            recurringPattern: '',
            batchIds: [],
            participantUids: []
        });
        setShowCreateForm(false);
        setEditingEvent(null);
    };
    const startEdit = (event) => {
        setFormData({
            title: event.title,
            description: event.description || '',
            type: event.type,
            scheduledAt: new Date(event.scheduledAt).toISOString().slice(0, 16),
            duration: event.duration,
            location: event.location || '',
            maxParticipants: event.maxParticipants?.toString() || '',
            isRecurring: event.isRecurring,
            recurringPattern: event.recurringPattern || '',
            batchIds: event.batches.map(b => b.id),
            participantUids: event.participants.map(p => p.user.uid)
        });
        setEditingEvent(event);
        setShowCreateForm(true);
    };
    const getEventTypeLabel = (type) => {
        switch (type) {
            case 'PTM': return 'Parent Teacher Meeting';
            case 'DOUBT_CLASS': return 'Doubt Class';
            case 'SPECIAL_CLASS': return 'Special Class';
            case 'WORKSHOP': return 'Workshop';
            case 'EXAM': return 'Exam';
            case 'ANNOUNCEMENT': return 'Announcement';
            default: return type;
        }
    };
    const getEventTypeColor = (type) => {
        switch (type) {
            case 'PTM': return '#3b82f6';
            case 'DOUBT_CLASS': return '#f59e0b';
            case 'SPECIAL_CLASS': return '#10b981';
            case 'WORKSHOP': return '#8b5cf6';
            case 'EXAM': return '#ef4444';
            case 'ANNOUNCEMENT': return '#64748b';
            default: return '#64748b';
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'SCHEDULED': return '#3b82f6';
            case 'ONGOING': return '#f59e0b';
            case 'COMPLETED': return '#10b981';
            case 'CANCELLED': return '#ef4444';
            default: return '#64748b';
        }
    };
    const filteredEvents = events.filter(event => {
        const now = new Date();
        const eventDate = new Date(event.scheduledAt);
        switch (activeTab) {
            case 'upcoming':
                return eventDate >= now && event.status !== 'CANCELLED';
            case 'past':
                return eventDate < now || event.status === 'COMPLETED';
            case 'all':
            default:
                return true;
        }
    });
    if (user?.role !== 'HEAD_TEACHER') {
        return (_jsx("div", { className: "p-6 text-center", children: _jsx("p", { className: "text-red-500", children: "Access denied. Only Head Teachers can manage events." }) }));
    }
    return (_jsxs("div", { className: "fade-in", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Special Events Management" }), _jsx("p", { className: "text-gray-600", children: "Create and manage PTMs, doubt classes, and special events" })] }), _jsx("button", { onClick: () => setShowCreateForm(true), className: "btn btn-primary btn-animated hover-lift", children: "+ Create Event" })] }), _jsx("div", { className: "mb-6", children: _jsx("div", { className: "flex space-x-4 border-b border-gray-200", children: [
                        { key: 'upcoming', label: 'Upcoming', icon: '📅' },
                        { key: 'past', label: 'Past', icon: '📜' },
                        { key: 'all', label: 'All Events', icon: '📋' }
                    ].map(tab => (_jsxs("button", { onClick: () => setActiveTab(tab.key), className: `px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === tab.key
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'}`, children: [_jsx("span", { className: "mr-2", children: tab.icon }), tab.label] }, tab.key))) }) }), _jsx("div", { className: "space-y-4 mb-8", children: loading ? (_jsx("div", { className: "text-center py-8", children: _jsx("div", { className: "loading", children: "Loading events..." }) })) : filteredEvents.length === 0 ? (_jsx("div", { className: "text-center py-8 text-gray-500", children: "No events found for the selected filter." })) : (filteredEvents.map(event => (_jsx("div", { className: "card card-animated hover-lift p-6", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: event.title }), _jsx("span", { className: "badge", style: {
                                                    backgroundColor: `${getEventTypeColor(event.type)}20`,
                                                    color: getEventTypeColor(event.type)
                                                }, children: getEventTypeLabel(event.type) }), _jsx("span", { className: "badge", style: {
                                                    backgroundColor: `${getStatusColor(event.status)}20`,
                                                    color: getStatusColor(event.status)
                                                }, children: event.status })] }), event.description && (_jsx("p", { className: "text-gray-600 mb-3", children: event.description })), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600", children: [_jsxs("div", { children: [_jsx("strong", { children: "Date:" }), " ", new Date(event.scheduledAt).toLocaleDateString()] }), _jsxs("div", { children: [_jsx("strong", { children: "Time:" }), " ", new Date(event.scheduledAt).toLocaleTimeString()] }), _jsxs("div", { children: [_jsx("strong", { children: "Duration:" }), " ", event.duration, " minutes"] }), event.location && (_jsxs("div", { children: [_jsx("strong", { children: "Location:" }), " ", event.location] }))] }), _jsxs("div", { className: "mt-3", children: [_jsxs("div", { className: "text-sm text-gray-600 mb-1", children: [_jsx("strong", { children: "Batches:" }), " ", event.batches.map(b => b.name).join(', ') || 'All batches'] }), _jsxs("div", { className: "text-sm text-gray-600", children: [_jsx("strong", { children: "Participants:" }), " ", event.participants.length, event.maxParticipants && ` / ${event.maxParticipants} max`, ' ', "(", event.participants.filter(p => p.status === 'ATTENDING').length, " attending)"] })] })] }), _jsxs("div", { className: "flex space-x-2 ml-4", children: [_jsx("button", { onClick: () => setSelectedEvent(event), className: "btn btn-sm btn-secondary hover-scale", children: "View Details" }), _jsx("button", { onClick: () => startEdit(event), className: "btn btn-sm btn-primary hover-scale", children: "Edit" }), _jsx("button", { onClick: () => handleDelete(event.id), className: "btn btn-sm btn-danger hover-scale", children: "Delete" })] })] }) }, event.id)))) }), showCreateForm && (_jsx("div", { className: "modal-overlay modal-backdrop", children: _jsxs("div", { className: "modal-content modal-content", children: [_jsxs("div", { className: "modal-header", children: [_jsx("h2", { className: "modal-title", children: editingEvent ? 'Edit Event' : 'Create New Event' }), _jsx("button", { onClick: resetForm, className: "modal-close", children: "\u00D7" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "modal-body", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Event Title *" }), _jsx("input", { type: "text", className: "form-input focus-ring", value: formData.title, onChange: (e) => setFormData({ ...formData, title: e.target.value }), required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Event Type *" }), _jsxs("select", { className: "form-select focus-ring", value: formData.type, onChange: (e) => setFormData({ ...formData, type: e.target.value }), required: true, children: [_jsx("option", { value: "PTM", children: "Parent Teacher Meeting" }), _jsx("option", { value: "DOUBT_CLASS", children: "Doubt Class" }), _jsx("option", { value: "SPECIAL_CLASS", children: "Special Class" }), _jsx("option", { value: "WORKSHOP", children: "Workshop" }), _jsx("option", { value: "EXAM", children: "Exam" }), _jsx("option", { value: "ANNOUNCEMENT", children: "Announcement" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Date & Time *" }), _jsx("input", { type: "datetime-local", className: "form-input focus-ring", value: formData.scheduledAt, onChange: (e) => setFormData({ ...formData, scheduledAt: e.target.value }), required: true })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Duration (minutes)" }), _jsx("input", { type: "number", className: "form-input focus-ring", value: formData.duration, onChange: (e) => setFormData({ ...formData, duration: parseInt(e.target.value) }), min: "15", max: "480" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Location" }), _jsx("input", { type: "text", className: "form-input focus-ring", value: formData.location, onChange: (e) => setFormData({ ...formData, location: e.target.value }), placeholder: "Room/Online/TBD" })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Max Participants" }), _jsx("input", { type: "number", className: "form-input focus-ring", value: formData.maxParticipants, onChange: (e) => setFormData({ ...formData, maxParticipants: e.target.value }), placeholder: "Leave empty for unlimited" })] })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Description" }), _jsx("textarea", { className: "form-textarea focus-ring", value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }), rows: 3, placeholder: "Event description, agenda, or additional details..." })] }), _jsxs("div", { className: "form-group", children: [_jsx("label", { className: "form-label", children: "Target Batches" }), _jsx("div", { className: "grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded p-3", children: batches.map(batch => (_jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: formData.batchIds.includes(batch.id), onChange: (e) => {
                                                            if (e.target.checked) {
                                                                setFormData({
                                                                    ...formData,
                                                                    batchIds: [...formData.batchIds, batch.id]
                                                                });
                                                            }
                                                            else {
                                                                setFormData({
                                                                    ...formData,
                                                                    batchIds: formData.batchIds.filter(id => id !== batch.id)
                                                                });
                                                            }
                                                        }, className: "mr-2" }), _jsx("span", { className: "text-sm", children: batch.name })] }, batch.id))) }), _jsx("p", { className: "text-xs text-gray-500 mt-1", children: "Leave empty to include all batches" })] }), _jsxs("div", { className: "form-group", children: [_jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: formData.isRecurring, onChange: (e) => setFormData({ ...formData, isRecurring: e.target.checked }), className: "mr-2" }), _jsx("span", { className: "form-label", children: "Recurring Event" })] }), formData.isRecurring && (_jsxs("select", { className: "form-select focus-ring mt-2", value: formData.recurringPattern, onChange: (e) => setFormData({ ...formData, recurringPattern: e.target.value }), children: [_jsx("option", { value: "", children: "Select pattern" }), _jsx("option", { value: "DAILY", children: "Daily" }), _jsx("option", { value: "WEEKLY", children: "Weekly" }), _jsx("option", { value: "MONTHLY", children: "Monthly" })] }))] })] }), _jsxs("div", { className: "modal-footer", children: [_jsx("button", { type: "button", onClick: resetForm, className: "btn btn-secondary", children: "Cancel" }), _jsx("button", { type: "submit", onClick: handleSubmit, disabled: loading, className: "btn btn-primary btn-animated", children: loading ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event' })] })] }) })), selectedEvent && (_jsx("div", { className: "modal-overlay modal-backdrop", children: _jsxs("div", { className: "modal-content", style: { maxWidth: '700px' }, children: [_jsxs("div", { className: "modal-header", children: [_jsx("h2", { className: "modal-title", children: selectedEvent.title }), _jsx("button", { onClick: () => setSelectedEvent(null), className: "modal-close", children: "\u00D7" })] }), _jsx("div", { className: "modal-body", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("span", { className: "badge", style: {
                                                    backgroundColor: `${getEventTypeColor(selectedEvent.type)}20`,
                                                    color: getEventTypeColor(selectedEvent.type)
                                                }, children: getEventTypeLabel(selectedEvent.type) }), _jsx("span", { className: "badge", style: {
                                                    backgroundColor: `${getStatusColor(selectedEvent.status)}20`,
                                                    color: getStatusColor(selectedEvent.status)
                                                }, children: selectedEvent.status })] }), selectedEvent.description && (_jsxs("div", { children: [_jsx("h4", { className: "font-semibold mb-1", children: "Description" }), _jsx("p", { className: "text-gray-600", children: selectedEvent.description })] })), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold mb-1", children: "Date & Time" }), _jsx("p", { className: "text-gray-600", children: new Date(selectedEvent.scheduledAt).toLocaleString() })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold mb-1", children: "Duration" }), _jsxs("p", { className: "text-gray-600", children: [selectedEvent.duration, " minutes"] })] }), selectedEvent.location && (_jsxs("div", { children: [_jsx("h4", { className: "font-semibold mb-1", children: "Location" }), _jsx("p", { className: "text-gray-600", children: selectedEvent.location })] })), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold mb-1", children: "Capacity" }), _jsxs("p", { className: "text-gray-600", children: [selectedEvent.participants.length, selectedEvent.maxParticipants && ` / ${selectedEvent.maxParticipants}`, ' participants'] })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold mb-2", children: "Target Batches" }), _jsx("div", { className: "flex flex-wrap gap-2", children: selectedEvent.batches.length > 0 ? (selectedEvent.batches.map(batch => (_jsx("span", { className: "badge badge-secondary", children: batch.name }, batch.id)))) : (_jsx("span", { className: "text-gray-500", children: "All batches" })) })] }), _jsxs("div", { children: [_jsxs("h4", { className: "font-semibold mb-2", children: ["Participants (", selectedEvent.participants.length, ")"] }), _jsx("div", { className: "max-h-48 overflow-y-auto", children: selectedEvent.participants.length > 0 ? (_jsx("div", { className: "space-y-2", children: selectedEvent.participants.map(participant => (_jsxs("div", { className: "flex justify-between items-center p-2 bg-gray-50 rounded", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: participant.user.fullName }), _jsxs("span", { className: "text-sm text-gray-500 ml-2", children: ["(", participant.user.uid, " - ", participant.user.batchType, ")"] })] }), _jsx("span", { className: "badge badge-sm", style: {
                                                                    backgroundColor: participant.status === 'ATTENDING' ? '#dcfce7' :
                                                                        participant.status === 'NOT_ATTENDING' ? '#fecaca' :
                                                                            participant.status === 'MAYBE' ? '#fef3c7' : '#f1f5f9',
                                                                    color: participant.status === 'ATTENDING' ? '#166534' :
                                                                        participant.status === 'NOT_ATTENDING' ? '#991b1b' :
                                                                            participant.status === 'MAYBE' ? '#92400e' : '#475569'
                                                                }, children: participant.status })] }, participant.user.uid))) })) : (_jsx("p", { className: "text-gray-500", children: "No participants yet" })) })] })] }) }), _jsxs("div", { className: "modal-footer", children: [_jsx("button", { onClick: () => setSelectedEvent(null), className: "btn btn-secondary", children: "Close" }), _jsx("button", { onClick: () => {
                                        setSelectedEvent(null);
                                        startEdit(selectedEvent);
                                    }, className: "btn btn-primary", children: "Edit Event" })] })] }) }))] }));
};
export default EventsManagement;
