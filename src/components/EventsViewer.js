import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
const EventsViewer = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [rsvpLoading, setRsvpLoading] = useState(null);
    useEffect(() => {
        fetchEvents();
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
    const handleRSVP = async (eventId, status) => {
        try {
            setRsvpLoading(eventId);
            await axios.post(`/api/events/${eventId}/rsvp`, { status });
            toast.success(`RSVP updated to: ${status.replace('_', ' ')}`);
            fetchEvents(); // Refresh to show updated status
        }
        catch (error) {
            console.error('Error updating RSVP:', error);
            toast.error(error.response?.data?.message || 'Failed to update RSVP');
        }
        finally {
            setRsvpLoading(null);
        }
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
    const getRSVPColor = (status) => {
        switch (status) {
            case 'ATTENDING': return { bg: '#dcfce7', color: '#166534' };
            case 'NOT_ATTENDING': return { bg: '#fecaca', color: '#991b1b' };
            case 'MAYBE': return { bg: '#fef3c7', color: '#92400e' };
            default: return { bg: '#f1f5f9', color: '#475569' };
        }
    };
    const getUserRSVPStatus = (event) => {
        const participant = event.participants.find(p => p.user.uid === user?.uid);
        return participant?.status || null;
    };
    const canRSVP = (event) => {
        const eventDate = new Date(event.scheduledAt);
        const now = new Date();
        const isUpcoming = eventDate > now;
        const isNotCancelled = event.status !== 'CANCELLED';
        const isInvited = event.participants.some(p => p.user.uid === user?.uid) ||
            event.batches.some(b => b.type === user?.batchType) ||
            event.batches.length === 0; // All batches invited
        return isUpcoming && isNotCancelled && isInvited;
    };
    const filteredEvents = events.filter(event => {
        const now = new Date();
        const eventDate = new Date(event.scheduledAt);
        const userRSVP = getUserRSVPStatus(event);
        switch (activeTab) {
            case 'upcoming':
                return eventDate >= now && event.status !== 'CANCELLED';
            case 'my-events':
                return userRSVP !== null;
            case 'all':
            default:
                return true;
        }
    });
    return (_jsxs("div", { className: "fade-in", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Special Events" }), _jsx("p", { className: "text-gray-600", children: user?.role === 'STUDENT'
                            ? 'View and respond to events for your batch'
                            : 'View events for your assigned batches' })] }), _jsx("div", { className: "mb-6", children: _jsx("div", { className: "flex space-x-4 border-b border-gray-200", children: [
                        { key: 'upcoming', label: 'Upcoming Events', icon: '📅' },
                        { key: 'my-events', label: 'My RSVPs', icon: '✅' },
                        { key: 'all', label: 'All Events', icon: '📋' }
                    ].map(tab => (_jsxs("button", { onClick: () => setActiveTab(tab.key), className: `px-4 py-2 font-medium text-sm border-b-2 transition-colors hover-scale ${activeTab === tab.key
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'}`, children: [_jsx("span", { className: "mr-2", children: tab.icon }), tab.label] }, tab.key))) }) }), _jsx("div", { className: "space-y-4", children: loading ? (_jsx("div", { className: "text-center py-8", children: _jsx("div", { className: "loading", children: "Loading events..." }) })) : filteredEvents.length === 0 ? (_jsxs("div", { className: "text-center py-8 text-gray-500", children: [_jsx("div", { className: "text-6xl mb-4", children: "\uD83D\uDCC5" }), _jsx("p", { children: "No events found for the selected filter." })] })) : (filteredEvents.map(event => {
                    const userRSVP = getUserRSVPStatus(event);
                    const canUserRSVP = canRSVP(event);
                    const rsvpColors = getRSVPColor(userRSVP || 'INVITED');
                    const eventPassed = new Date(event.scheduledAt) < new Date();
                    return (_jsx("div", { className: "card card-animated hover-lift p-6", children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: event.title }), _jsx("span", { className: "badge", style: {
                                                        backgroundColor: `${getEventTypeColor(event.type)}20`,
                                                        color: getEventTypeColor(event.type)
                                                    }, children: getEventTypeLabel(event.type) }), _jsx("span", { className: "badge", style: {
                                                        backgroundColor: `${getStatusColor(event.status)}20`,
                                                        color: getStatusColor(event.status)
                                                    }, children: event.status }), userRSVP && (_jsx("span", { className: "badge", style: {
                                                        backgroundColor: rsvpColors.bg,
                                                        color: rsvpColors.color
                                                    }, children: userRSVP.replace('_', ' ') })), eventPassed && (_jsx("span", { className: "badge badge-secondary", children: "PAST" }))] }), event.description && (_jsx("p", { className: "text-gray-600 mb-3", children: event.description })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4", children: [_jsxs("div", { className: "flex items-center text-gray-600", children: [_jsx("span", { className: "mr-2", children: "\uD83D\uDCC5" }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: new Date(event.scheduledAt).toLocaleDateString() }), _jsx("div", { children: new Date(event.scheduledAt).toLocaleTimeString() })] })] }), _jsxs("div", { className: "flex items-center text-gray-600", children: [_jsx("span", { className: "mr-2", children: "\u23F1\uFE0F" }), _jsxs("div", { children: [_jsxs("div", { className: "font-medium", children: [event.duration, " minutes"] }), event.location && _jsx("div", { children: event.location })] })] }), _jsxs("div", { className: "flex items-center text-gray-600", children: [_jsx("span", { className: "mr-2", children: "\uD83D\uDC65" }), _jsxs("div", { children: [_jsxs("div", { className: "font-medium", children: [event.participants.filter(p => p.status === 'ATTENDING').length, " attending"] }), _jsxs("div", { children: [event.participants.length, " total", event.maxParticipants && ` / ${event.maxParticipants} max`] })] })] })] }), event.batches.length > 0 && (_jsxs("div", { className: "mb-3", children: [_jsx("span", { className: "text-sm text-gray-600 mr-2", children: "Target Batches:" }), _jsx("div", { className: "inline-flex flex-wrap gap-1", children: event.batches.map(batch => (_jsx("span", { className: "badge badge-secondary text-xs", children: batch.name }, batch.id))) })] }))] }), _jsxs("div", { className: "flex flex-col items-end space-y-2 ml-4", children: [_jsx("button", { onClick: () => setSelectedEvent(event), className: "btn btn-sm btn-secondary hover-scale", children: "View Details" }), canUserRSVP && (_jsxs("div", { className: "flex flex-col space-y-1", children: [_jsx("div", { className: "text-xs text-gray-600 text-center mb-1", children: "RSVP:" }), _jsx("div", { className: "flex space-x-1", children: ['ATTENDING', 'MAYBE', 'NOT_ATTENDING'].map(status => (_jsx("button", { onClick: () => handleRSVP(event.id, status), disabled: rsvpLoading === event.id, className: `btn btn-sm transition-all ${userRSVP === status
                                                            ? status === 'ATTENDING' ? 'btn-success' :
                                                                status === 'MAYBE' ? 'bg-yellow-500 text-white' : 'btn-danger'
                                                            : 'btn-secondary'} ${rsvpLoading === event.id ? 'opacity-50' : 'hover-scale'}`, style: { fontSize: '0.7rem', padding: '0.25rem 0.5rem' }, children: status === 'ATTENDING' ? '✅' :
                                                            status === 'MAYBE' ? '❓' : '❌' }, status))) })] })), !canUserRSVP && eventPassed && userRSVP && (_jsxs("div", { className: "text-xs text-gray-500 text-center", children: ["Your response: ", _jsx("br", {}), _jsx("span", { className: "badge badge-sm", style: {
                                                        backgroundColor: rsvpColors.bg,
                                                        color: rsvpColors.color
                                                    }, children: userRSVP.replace('_', ' ') })] }))] })] }) }, event.id));
                })) }), selectedEvent && (_jsx("div", { className: "modal-overlay modal-backdrop", children: _jsxs("div", { className: "modal-content", style: { maxWidth: '700px' }, children: [_jsxs("div", { className: "modal-header", children: [_jsx("h2", { className: "modal-title", children: selectedEvent.title }), _jsx("button", { onClick: () => setSelectedEvent(null), className: "modal-close", children: "\u00D7" })] }), _jsx("div", { className: "modal-body", children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2 flex-wrap", children: [_jsx("span", { className: "badge", style: {
                                                    backgroundColor: `${getEventTypeColor(selectedEvent.type)}20`,
                                                    color: getEventTypeColor(selectedEvent.type)
                                                }, children: getEventTypeLabel(selectedEvent.type) }), _jsx("span", { className: "badge", style: {
                                                    backgroundColor: `${getStatusColor(selectedEvent.status)}20`,
                                                    color: getStatusColor(selectedEvent.status)
                                                }, children: selectedEvent.status }), selectedEvent.isRecurring && (_jsxs("span", { className: "badge badge-info", children: ["Recurring: ", selectedEvent.recurringPattern] }))] }), selectedEvent.description && (_jsxs("div", { children: [_jsx("h4", { className: "font-semibold mb-2", children: "Description" }), _jsx("p", { className: "text-gray-600", children: selectedEvent.description })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold mb-1", children: "\uD83D\uDCC5 Date & Time" }), _jsx("p", { className: "text-gray-600", children: new Date(selectedEvent.scheduledAt).toLocaleDateString('en-US', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        }) }), _jsx("p", { className: "text-gray-600", children: new Date(selectedEvent.scheduledAt).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold mb-1", children: "\u23F1\uFE0F Duration" }), _jsxs("p", { className: "text-gray-600", children: [selectedEvent.duration, " minutes"] }), selectedEvent.location && (_jsxs(_Fragment, { children: [_jsx("h4", { className: "font-semibold mb-1 mt-2", children: "\uD83D\uDCCD Location" }), _jsx("p", { className: "text-gray-600", children: selectedEvent.location })] }))] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold mb-2", children: "\uD83C\uDFAF Target Batches" }), _jsx("div", { className: "flex flex-wrap gap-2", children: selectedEvent.batches.length > 0 ? (selectedEvent.batches.map(batch => (_jsx("span", { className: "badge badge-secondary", children: batch.name }, batch.id)))) : (_jsx("span", { className: "text-gray-500", children: "All batches" })) })] }), _jsxs("div", { children: [_jsxs("h4", { className: "font-semibold mb-2", children: ["\uD83D\uDC65 Participants (", selectedEvent.participants.length, ")", selectedEvent.maxParticipants && ` / ${selectedEvent.maxParticipants} max`] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-4", children: [_jsxs("div", { className: "text-center p-3 bg-green-50 rounded", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: selectedEvent.participants.filter(p => p.status === 'ATTENDING').length }), _jsx("div", { className: "text-sm text-green-600", children: "Attending" })] }), _jsxs("div", { className: "text-center p-3 bg-yellow-50 rounded", children: [_jsx("div", { className: "text-2xl font-bold text-yellow-600", children: selectedEvent.participants.filter(p => p.status === 'MAYBE').length }), _jsx("div", { className: "text-sm text-yellow-600", children: "Maybe" })] }), _jsxs("div", { className: "text-center p-3 bg-red-50 rounded", children: [_jsx("div", { className: "text-2xl font-bold text-red-600", children: selectedEvent.participants.filter(p => p.status === 'NOT_ATTENDING').length }), _jsx("div", { className: "text-sm text-red-600", children: "Not Attending" })] })] }), user?.role === 'TEACHER' && (_jsx("div", { className: "max-h-48 overflow-y-auto", children: selectedEvent.participants.length > 0 ? (_jsx("div", { className: "space-y-2", children: selectedEvent.participants
                                                        .sort((a, b) => a.user.fullName.localeCompare(b.user.fullName))
                                                        .map(participant => (_jsxs("div", { className: "flex justify-between items-center p-2 bg-gray-50 rounded", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: participant.user.fullName }), _jsxs("span", { className: "text-sm text-gray-500 ml-2", children: ["(", participant.user.uid, " - ", participant.user.batchType, ")"] })] }), _jsx("span", { className: "badge badge-sm", style: {
                                                                    backgroundColor: participant.status === 'ATTENDING' ? '#dcfce7' :
                                                                        participant.status === 'NOT_ATTENDING' ? '#fecaca' :
                                                                            participant.status === 'MAYBE' ? '#fef3c7' : '#f1f5f9',
                                                                    color: participant.status === 'ATTENDING' ? '#166534' :
                                                                        participant.status === 'NOT_ATTENDING' ? '#991b1b' :
                                                                            participant.status === 'MAYBE' ? '#92400e' : '#475569'
                                                                }, children: participant.status.replace('_', ' ') })] }, participant.user.uid))) })) : (_jsx("p", { className: "text-gray-500", children: "No participants yet" })) }))] })] }) }), _jsxs("div", { className: "modal-footer", children: [_jsx("button", { onClick: () => setSelectedEvent(null), className: "btn btn-secondary", children: "Close" }), canRSVP(selectedEvent) && (_jsxs("div", { className: "flex space-x-2", children: [_jsx("span", { className: "text-sm text-gray-600 self-center", children: "Quick RSVP:" }), ['ATTENDING', 'MAYBE', 'NOT_ATTENDING'].map(status => (_jsx("button", { onClick: () => handleRSVP(selectedEvent.id, status), disabled: rsvpLoading === selectedEvent.id, className: `btn btn-sm ${getUserRSVPStatus(selectedEvent) === status
                                                ? status === 'ATTENDING' ? 'btn-success' :
                                                    status === 'MAYBE' ? 'bg-yellow-500 text-white' : 'btn-danger'
                                                : 'btn-secondary'}`, children: status === 'ATTENDING' ? '✅ Attending' :
                                                status === 'MAYBE' ? '❓ Maybe' : '❌ Not Attending' }, status)))] }))] })] }) }))] }));
};
export default EventsViewer;
