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

const EventsViewer: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<SpecialEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SpecialEvent | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'my-events' | 'all'>('upcoming');
  const [rsvpLoading, setRsvpLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
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

  const handleRSVP = async (eventId: string, status: 'ATTENDING' | 'NOT_ATTENDING' | 'MAYBE') => {
    try {
      setRsvpLoading(eventId);
      await axios.post(`/api/events/${eventId}/rsvp`, { status });
      toast.success(`RSVP updated to: ${status.replace('_', ' ')}`);
      fetchEvents(); // Refresh to show updated status
    } catch (error: any) {
      console.error('Error updating RSVP:', error);
      toast.error(error.response?.data?.message || 'Failed to update RSVP');
    } finally {
      setRsvpLoading(null);
    }
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

  const getRSVPColor = (status: string) => {
    switch (status) {
      case 'ATTENDING': return { bg: '#dcfce7', color: '#166534' };
      case 'NOT_ATTENDING': return { bg: '#fecaca', color: '#991b1b' };
      case 'MAYBE': return { bg: '#fef3c7', color: '#92400e' };
      default: return { bg: '#f1f5f9', color: '#475569' };
    }
  };

  const getUserRSVPStatus = (event: SpecialEvent): string | null => {
    const participant = event.participants.find(p => p.user.uid === user?.uid);
    return participant?.status || null;
  };

  const canRSVP = (event: SpecialEvent): boolean => {
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

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Special Events</h1>
        <p className="text-gray-600">
          {user?.role === 'STUDENT' 
            ? 'View and respond to events for your batch' 
            : 'View events for your assigned batches'
          }
        </p>
      </div>

      {/* Event Tabs */}
      <div className="mb-6">
        <div className="flex space-x-4 border-b border-gray-200">
          {[
            { key: 'upcoming', label: 'Upcoming Events', icon: '📅' },
            { key: 'my-events', label: 'My RSVPs', icon: '✅' },
            { key: 'all', label: 'All Events', icon: '📋' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors hover-scale ${
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
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="loading">Loading events...</div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-6xl mb-4">📅</div>
            <p>No events found for the selected filter.</p>
          </div>
        ) : (
          filteredEvents.map(event => {
            const userRSVP = getUserRSVPStatus(event);
            const canUserRSVP = canRSVP(event);
            const rsvpColors = getRSVPColor(userRSVP || 'INVITED');
            const eventPassed = new Date(event.scheduledAt) < new Date();

            return (
              <div
                key={event.id}
                className="card card-animated hover-lift p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
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
                      {userRSVP && (
                        <span 
                          className="badge"
                          style={{ 
                            backgroundColor: rsvpColors.bg,
                            color: rsvpColors.color
                          }}
                        >
                          {userRSVP.replace('_', ' ')}
                        </span>
                      )}
                      {eventPassed && (
                        <span className="badge badge-secondary">
                          PAST
                        </span>
                      )}
                    </div>
                    
                    {event.description && (
                      <p className="text-gray-600 mb-3">{event.description}</p>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">📅</span>
                        <div>
                          <div className="font-medium">{new Date(event.scheduledAt).toLocaleDateString()}</div>
                          <div>{new Date(event.scheduledAt).toLocaleTimeString()}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">⏱️</span>
                        <div>
                          <div className="font-medium">{event.duration} minutes</div>
                          {event.location && <div>{event.location}</div>}
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <span className="mr-2">👥</span>
                        <div>
                          <div className="font-medium">
                            {event.participants.filter(p => p.status === 'ATTENDING').length} attending
                          </div>
                          <div>
                            {event.participants.length} total
                            {event.maxParticipants && ` / ${event.maxParticipants} max`}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {event.batches.length > 0 && (
                      <div className="mb-3">
                        <span className="text-sm text-gray-600 mr-2">Target Batches:</span>
                        <div className="inline-flex flex-wrap gap-1">
                          {event.batches.map(batch => (
                            <span key={batch.id} className="badge badge-secondary text-xs">
                              {batch.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="btn btn-sm btn-secondary hover-scale"
                    >
                      View Details
                    </button>
                    
                    {canUserRSVP && (
                      <div className="flex flex-col space-y-1">
                        <div className="text-xs text-gray-600 text-center mb-1">RSVP:</div>
                        <div className="flex space-x-1">
                          {(['ATTENDING', 'MAYBE', 'NOT_ATTENDING'] as const).map(status => (
                            <button
                              key={status}
                              onClick={() => handleRSVP(event.id, status)}
                              disabled={rsvpLoading === event.id}
                              className={`btn btn-sm transition-all ${
                                userRSVP === status
                                  ? status === 'ATTENDING' ? 'btn-success' :
                                    status === 'MAYBE' ? 'bg-yellow-500 text-white' : 'btn-danger'
                                  : 'btn-secondary'
                              } ${rsvpLoading === event.id ? 'opacity-50' : 'hover-scale'}`}
                              style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                            >
                              {status === 'ATTENDING' ? '✅' :
                               status === 'MAYBE' ? '❓' : '❌'}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {!canUserRSVP && eventPassed && userRSVP && (
                      <div className="text-xs text-gray-500 text-center">
                        Your response: <br />
                        <span 
                          className="badge badge-sm"
                          style={{ 
                            backgroundColor: rsvpColors.bg,
                            color: rsvpColors.color
                          }}
                        >
                          {userRSVP.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

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
                <div className="flex gap-2 flex-wrap">
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
                  {selectedEvent.isRecurring && (
                    <span className="badge badge-info">
                      Recurring: {selectedEvent.recurringPattern}
                    </span>
                  )}
                </div>
                
                {selectedEvent.description && (
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-gray-600">{selectedEvent.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-1">📅 Date & Time</h4>
                    <p className="text-gray-600">
                      {new Date(selectedEvent.scheduledAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-600">
                      {new Date(selectedEvent.scheduledAt).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-1">⏱️ Duration</h4>
                    <p className="text-gray-600">{selectedEvent.duration} minutes</p>
                    {selectedEvent.location && (
                      <>
                        <h4 className="font-semibold mb-1 mt-2">📍 Location</h4>
                        <p className="text-gray-600">{selectedEvent.location}</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">🎯 Target Batches</h4>
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
                  <h4 className="font-semibold mb-2">
                    👥 Participants ({selectedEvent.participants.length})
                    {selectedEvent.maxParticipants && ` / ${selectedEvent.maxParticipants} max`}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedEvent.participants.filter(p => p.status === 'ATTENDING').length}
                      </div>
                      <div className="text-sm text-green-600">Attending</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded">
                      <div className="text-2xl font-bold text-yellow-600">
                        {selectedEvent.participants.filter(p => p.status === 'MAYBE').length}
                      </div>
                      <div className="text-sm text-yellow-600">Maybe</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded">
                      <div className="text-2xl font-bold text-red-600">
                        {selectedEvent.participants.filter(p => p.status === 'NOT_ATTENDING').length}
                      </div>
                      <div className="text-sm text-red-600">Not Attending</div>
                    </div>
                  </div>
                  
                  {user?.role === 'TEACHER' && (
                    <div className="max-h-48 overflow-y-auto">
                      {selectedEvent.participants.length > 0 ? (
                        <div className="space-y-2">
                          {selectedEvent.participants
                            .sort((a, b) => a.user.fullName.localeCompare(b.user.fullName))
                            .map(participant => (
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
                                {participant.status.replace('_', ' ')}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No participants yet</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button onClick={() => setSelectedEvent(null)} className="btn btn-secondary">
                Close
              </button>
              {canRSVP(selectedEvent) && (
                <div className="flex space-x-2">
                  <span className="text-sm text-gray-600 self-center">Quick RSVP:</span>
                  {(['ATTENDING', 'MAYBE', 'NOT_ATTENDING'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => handleRSVP(selectedEvent.id, status)}
                      disabled={rsvpLoading === selectedEvent.id}
                      className={`btn btn-sm ${
                        getUserRSVPStatus(selectedEvent) === status
                          ? status === 'ATTENDING' ? 'btn-success' :
                            status === 'MAYBE' ? 'bg-yellow-500 text-white' : 'btn-danger'
                          : 'btn-secondary'
                      }`}
                    >
                      {status === 'ATTENDING' ? '✅ Attending' :
                       status === 'MAYBE' ? '❓ Maybe' : '❌ Not Attending'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsViewer;