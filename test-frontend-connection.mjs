import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

async function testFrontendConnection() {
  console.log('🔍 Testing frontend to backend connection...');
  
  try {
    // Test health endpoint
    console.log('\\n1. Testing health endpoint...');
    const healthResponse = await fetch(`http://localhost:5000/health`);
    const healthData = await healthResponse.json();
    console.log('Health check:', healthResponse.status, healthData);
    
    // Test login with exactly what frontend would send
    console.log('\\n2. Testing login with frontend parameters...');
    const loginData = {
      uid: 'TRE000',  // Make sure this matches exactly
      password: 'demo123'
    };
    
    console.log('Sending login request with:', loginData);
    
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
    
    const responseText = await loginResponse.text();
    console.log('Login response status:', loginResponse.status);
    console.log('Login response headers:', Object.fromEntries(loginResponse.headers.entries()));
    console.log('Login response body:', responseText);
    
    if (loginResponse.ok) {
      const parsedResponse = JSON.parse(responseText);
      console.log('✅ Login successful!');
      console.log('User data:', parsedResponse.user);
    } else {
      console.log('❌ Login failed');
      
      // Try to parse error response
      try {
        const errorData = JSON.parse(responseText);
        console.log('Error details:', errorData);
      } catch (e) {
        console.log('Raw error response:', responseText);
      }
    }
    
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    console.error('Full error:', error);
  }
}

testFrontendConnection();