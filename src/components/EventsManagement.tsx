import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface SpecialEvent {
  id: string;
  title: string;
  description?: string;
  type: 'PTM' | 'DOUBT_CLASS' | 'SPECIAL_CLASS' | 'WORKSHOP' | 'EXAM' | 'ANNOUNCEMENT';
  scheduledAt: string;
  duration: number;
  location?: string;
  status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  maxParticipants?: number;
  isRecurring: boolean;
  recurringPattern?: string;
  batches: Array<{
    id: string;
    type: string;
    name: string;
  }>;
  participants: Array<{
    id: string;
    status: 'INVITED' | 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE';
    respondedAt?: string;
    user: {
      uid: string;
      fullName: string;
      role: string;
      batchType: string;
    };
  }>;
}

interface Batch {
  id: string;
  type: string;
  name: string;
}

const EventsManagement: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<SpecialEvent[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<SpecialEvent | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<SpecialEvent | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'PTM' as SpecialEvent['type'],
    scheduledAt: '',
    duration: 60,
    location: '',
    maxParticipants: '',
    isRecurring: false,
    recurringPattern: '',
    batchIds: [] as string[],
    participantUids: [] as string[]
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
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to fetch events');
    } finally {
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
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      } else {
        await axios.post('/api/events', payload);
        toast.success('Event created successfully');
      }

      resetForm();
      fetchEvents();
    } catch (error: any) {
      console.error('Error saving event:', error);
      toast.error(error.response?.data?.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      await axios.delete(`/api/events/${eventId}`);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error: any) {
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

  const startEdit = (event: SpecialEvent) => {
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

  const getEventTypeLabel = (type: SpecialEvent['type']) => {
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

  const getEventTypeColor = (type: SpecialEvent['type']) => {
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

  const getStatusColor = (status: SpecialEvent['status']) => {
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
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Access denied. Only Head Teachers can manage events.</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Special Events Management</h1>
          <p className="text-gray-600">Create and manage PTMs, doubt classes, and special events</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary btn-animated hover-lift"
        >
          + Create Event
        </button>
      </div>

      {/* Event Type Tabs */}
      <div className="mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          {[
            { key: 'upcoming', label: 'Upcoming', icon: '📅' },
            { key: 'past', label: 'Past', icon: '📜' },
            { key: 'all', label: 'All Events', icon: '📋' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4 mb-8">
        {loading ? (
          <div className="text-center py-8">
            <div className="loading">Loading events...</div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No events found for the selected filter.
          </div>
        ) : (
          filteredEvents.map(event => (
            <div
              key={event.id}
              className="card card-animated hover-lift p-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    <span 
                      className="badge"
                      style={{ 
                        backgroundColor: `${getEventTypeColor(event.type)}20`,
                        color: getEventTypeColor(event.type)
                      }}
                    >
                      {getEventTypeLabel(event.type)}
                    </span>
                    <span 
                      className="badge"
                      style={{ 
                        backgroundColor: `${getStatusColor(event.status)}20`,
                        color: getStatusColor(event.status)
                      }}
                    >
                      {event.status}
                    </span>
                  </div>
                  
                  {event.description && (
                    <p className="text-gray-600 mb-3">{event.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <strong>Date:</strong> {new Date(event.scheduledAt).toLocaleDateString()}
                    </div>
                    <div>
                      <strong>Time:</strong> {new Date(event.scheduledAt).toLocaleTimeString()}
                    </div>
                    <div>
                      <strong>Duration:</strong> {event.duration} minutes
                    </div>
                    {event.location && (
                      <div>
                        <strong>Location:</strong> {event.location}
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3">
                    <div className="text-sm text-gray-600 mb-1">
                      <strong>Batches:</strong> {event.batches.map(b => b.name).join(', ') || 'All batches'}
                    </div>
                    <div className="text-sm text-gray-600">
                      <strong>Participants:</strong> {event.participants.length}
                      {event.maxParticipants && ` / ${event.maxParticipants} max`}
                      {' '}
                      ({event.participants.filter(p => p.status === 'ATTENDING').length} attending)
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="btn btn-sm btn-secondary hover-scale"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => startEdit(event)}
                    className="btn btn-sm btn-primary hover-scale"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="btn btn-sm btn-danger hover-scale"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="modal-overlay modal-backdrop">
          <div className="modal-content modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h2>
              <button onClick={resetForm} className="modal-close">×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Event Title *</label>
                  <input
                    type="text"
                    className="form-input focus-ring"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Event Type *</label>
                  <select
                    className="form-select focus-ring"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    required
                  >
                    <option value="PTM">Parent Teacher Meeting</option>
                    <option value="DOUBT_CLASS">Doubt Class</option>
                    <option value="SPECIAL_CLASS">Special Class</option>
                    <option value="WORKSHOP">Workshop</option>
                    <option value="EXAM">Exam</option>
                    <option value="ANNOUNCEMENT">Announcement</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Date & Time *</label>
                  <input
                    type="datetime-local"
                    className="form-input focus-ring"
                    value={formData.scheduledAt}
                    onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Duration (minutes)</label>
                  <input
                    type="number"
                    className="form-input focus-ring"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    min="15"
                    max="480"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input focus-ring"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Room/Online/TBD"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Max Participants</label>
                  <input
                    type="number"
                    className="form-input focus-ring"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                    placeholder="Leave empty for unlimited"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea focus-ring"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Event description, agenda, or additional details..."
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Target Batches</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded p-3">
                  {batches.map(batch => (
                    <label key={batch.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.batchIds.includes(batch.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ 
                              ...formData, 
                              batchIds: [...formData.batchIds, batch.id] 
                            });
                          } else {
                            setFormData({ 
                              ...formData, 
                              batchIds: formData.batchIds.filter(id => id !== batch.id) 
                            });
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{batch.name}</span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to include all batches
                </p>
              </div>
              
              <div className="form-group">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isRecurring}
                    onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="form-label">Recurring Event</span>
                </label>
                
                {formData.isRecurring && (
                  <select
                    className="form-select focus-ring mt-2"
                    value={formData.recurringPattern}
                    onChange={(e) => setFormData({ ...formData, recurringPattern: e.target.value })}
                  >
                    <option value="">Select pattern</option>
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                )}
              </div>
            </form>
            
            <div className="modal-footer">
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
              <button 
                type="submit" 
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-primary btn-animated"
              >
                {loading ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="modal-overlay modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedEvent.title}</h2>
              <button onClick={() => setSelectedEvent(null)} className="modal-close">×</button>
            </div>
            
            <div className="modal-body">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <span 
                    className="badge"
                    style={{ 
                      backgroundColor: `${getEventTypeColor(selectedEvent.type)}20`,
                      color: getEventTypeColor(selectedEvent.type)
                    }}
                  >
                    {getEventTypeLabel(selectedEvent.type)}
                  </span>
                  <span 
                    className="badge"
                    style={{ 
                      backgroundColor: `${getStatusColor(selectedEvent.status)}20`,
                      color: getStatusColor(selectedEvent.status)
                    }}
                  >
                    {selectedEvent.status}
                  </span>
                </div>
                
                {selectedEvent.description && (
                  <div>
                    <h4 className="font-semibold mb-1">Description</h4>
                    <p className="text-gray-600">{selectedEvent.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1">Date & Time</h4>
                    <p className="text-gray-600">
                      {new Date(selectedEvent.scheduledAt).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Duration</h4>
                    <p className="text-gray-600">{selectedEvent.duration} minutes</p>
                  </div>
                  {selectedEvent.location && (
                    <div>
                      <h4 className="font-semibold mb-1">Location</h4>
                      <p className="text-gray-600">{selectedEvent.location}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold mb-1">Capacity</h4>
                    <p className="text-gray-600">
                      {selectedEvent.participants.length}
                      {selectedEvent.maxParticipants && ` / ${selectedEvent.maxParticipants}`}
                      {' participants'}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Target Batches</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.batches.length > 0 ? (
                      selectedEvent.batches.map(batch => (
                        <span key={batch.id} className="badge badge-secondary">
                          {batch.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">All batches</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Participants ({selectedEvent.participants.length})</h4>
                  <div className="max-h-48 overflow-y-auto">
                    {selectedEvent.participants.length > 0 ? (
                      <div className="space-y-2">
                        {selectedEvent.participants.map(participant => (
                          <div key={participant.user.uid} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <span className="font-medium">{participant.user.fullName}</span>
                              <span className="text-sm text-gray-500 ml-2">
                                ({participant.user.uid} - {participant.user.batchType})
                              </span>
                            </div>
                            <span 
                              className="badge badge-sm"
                              style={{
                                backgroundColor: participant.status === 'ATTENDING' ? '#dcfce7' : 
                                                participant.status === 'NOT_ATTENDING' ? '#fecaca' :
                                                participant.status === 'MAYBE' ? '#fef3c7' : '#f1f5f9',
                                color: participant.status === 'ATTENDING' ? '#166534' : 
                                       participant.status === 'NOT_ATTENDING' ? '#991b1b' :
                                       participant.status === 'MAYBE' ? '#92400e' : '#475569'
                              }}
                            >
                              {participant.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No participants yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button onClick={() => setSelectedEvent(null)} className="btn btn-secondary">
                Close
              </button>
              <button 
                onClick={() => {
                  setSelectedEvent(null);
                  startEdit(selectedEvent);
                }}
                className="btn btn-primary"
              >
                Edit Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsManagement;