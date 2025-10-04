import React, { useState, useEffect } from 'react';
import { apiClient, checkBackendConnection, SampleQuestion, ApiResponse } from '../config/api';

const BackendTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');
  const [healthData, setHealthData] = useState<any>(null);
  const [sampleQuestions, setSampleQuestions] = useState<SampleQuestion[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
        const questionsResponse: ApiResponse<SampleQuestion[]> = await apiClient.getSampleQuestions({ limit: 5 });
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
      } else {
        setConnectionStatus('failed');
        setError('Failed to connect to backend');
      }
    } catch (err) {
      console.error('❌ Backend connection error:', err);
      setConnectionStatus('failed');
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
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

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">🚀 Backend Connection Test</h1>
          <button 
            onClick={testBackendConnection}
            disabled={loading}
            className={`px-4 py-2 rounded-lg font-medium ${
              loading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? '🔄 Testing...' : '🔄 Test Connection'}
          </button>
        </div>

        {/* Connection Status */}
        <div className={`p-4 rounded-lg border-2 mb-6 ${getStatusColor()}`}>
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getStatusIcon()}</span>
            <div>
              <h3 className="font-bold text-lg">
                Connection Status: {connectionStatus.toUpperCase()}
              </h3>
              <p className="text-sm">
                {connectionStatus === 'connected' && 'Successfully connected to backend!'}
                {connectionStatus === 'failed' && `Failed to connect: ${error}`}
                {connectionStatus === 'checking' && 'Checking backend connection...'}
              </p>
            </div>
          </div>
        </div>

        {/* Health Data */}
        {healthData && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-green-800 mb-2">🏥 Backend Health Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div><strong>Status:</strong> {healthData.status}</div>
              <div><strong>Port:</strong> {healthData.port}</div>
              <div className="md:col-span-2"><strong>Message:</strong> {healthData.message}</div>
              <div className="md:col-span-2">
                <strong>Features:</strong>
                <ul className="list-disc list-inside mt-1">
                  {healthData.features?.map((feature: string, index: number) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        {stats && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-blue-800 mb-3">📊 Database Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalQuestions}</div>
                <div className="text-sm text-blue-800">Total Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Object.keys(stats.bySubject || {}).length}</div>
                <div className="text-sm text-green-800">Subjects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{Object.keys(stats.byClass || {}).length}</div>
                <div className="text-sm text-purple-800">Classes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{Object.keys(stats.byDifficulty || {}).length}</div>
                <div className="text-sm text-orange-800">Difficulty Levels</div>
              </div>
            </div>
            
            {/* Subject breakdown */}
            <div className="mt-4">
              <h4 className="font-semibold text-blue-800 mb-2">Questions by Subject:</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.bySubject || {}).map(([subject, count]) => (
                  <span key={subject} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {subject}: {count as number}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Available Subjects */}
        {subjects.length > 0 && (
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-purple-800 mb-3">📚 Available Subjects</h3>
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject, index) => (
                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                  {subject}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Sample Questions */}
        {sampleQuestions.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-gray-800 mb-3">📝 Sample Questions (First 5)</h3>
            <div className="space-y-4">
              {sampleQuestions.map((question, index) => (
                <div key={question.id} className="bg-white p-4 rounded-lg border">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Q{index + 1}. {question.text}</h4>
                    <div className="flex space-x-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {question.subject}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        Class {question.class}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        question.difficulty === 'EASY' ? 'bg-green-100 text-green-800' :
                        question.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {question.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                        {question.type}
                      </span>
                    </div>
                  </div>
                  
                  {question.type === 'MCQ' && question.options.length > 0 && (
                    <div className="mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className={`p-2 rounded text-sm ${
                            question.correctAnswers.includes(option) 
                              ? 'bg-green-100 text-green-800 font-semibold' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {String.fromCharCode(65 + optIndex)}. {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {question.explanation && (
                    <div className="mt-2 p-2 bg-blue-50 text-blue-800 text-sm rounded">
                      <strong>Explanation:</strong> {question.explanation}
                    </div>
                  )}
                  
                  {question.tags.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {question.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-bold text-red-800 mb-2">❌ Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackendTest;