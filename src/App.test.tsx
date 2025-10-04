import React from 'react';
import BackendTest from './components/BackendTest';

function AppTest() {
  return (
    <div style={{ 
      fontFamily: 'Inter, system-ui, sans-serif', 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-purple-600">
        <div className="container mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">
              🎓 Educational Test Platform
            </h1>
            <p className="text-xl text-white/90 mb-2">
              Frontend ↔ Backend Connection Test
            </p>
            <p className="text-white/80">
              Testing connection to backend server at http://localhost:5000
            </p>
          </div>
          
          <BackendTest />
          
          <div className="text-center mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-4">🚀 Connection Status</h2>
              <p className="text-white/90">
                If you see a ✅ "Connected" status above, your backend is working perfectly!
              </p>
              <p className="text-white/80 mt-2">
                This confirms that your 39 sample questions are loaded and ready for the frontend.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppTest;