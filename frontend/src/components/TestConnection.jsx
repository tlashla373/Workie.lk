import React, { useState } from 'react';
import apiService from '../services/apiService';

const TestConnection = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      // Test basic connection
      const response = await apiService.get('/auth/test', { includeAuth: false });
      setResult(`✅ Backend Connection Success: ${JSON.stringify(response)}`);
    } catch (error) {
      setResult(`❌ Backend Connection Failed: ${error.message}`);
      console.error('Connection test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testRegistration = async () => {
    setLoading(true);
    setResult('Testing registration...');
    
    try {
      const testData = {
        firstName: 'Test',
        lastName: 'User',
        email: `test${Date.now()}@example.com`, // Unique email
        password: 'TestPass123',
        userType: 'worker'
      };
      
      const response = await apiService.post('/auth/register', testData, { includeAuth: false });
      setResult(`✅ Registration Success: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setResult(`❌ Registration Failed: ${error.message}`);
      console.error('Registration test error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '20px', 
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxWidth: '400px',
      zIndex: 9999
    }}>
      <h3>Backend Connection Test</h3>
      <button 
        onClick={testBackendConnection} 
        disabled={loading}
        style={{ 
          marginRight: '10px', 
          padding: '8px 16px', 
          background: '#007bff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        Test Connection
      </button>
      <button 
        onClick={testRegistration} 
        disabled={loading}
        style={{ 
          padding: '8px 16px', 
          background: '#28a745', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        Test Registration
      </button>
      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        background: '#f8f9fa', 
        borderRadius: '4px',
        fontSize: '12px',
        whiteSpace: 'pre-wrap',
        maxHeight: '200px',
        overflow: 'auto'
      }}>
        {result || 'Click a button to test...'}
      </div>
    </div>
  );
};

export default TestConnection;
