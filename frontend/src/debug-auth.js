// Debug script to check frontend authentication state
console.log('🔍 Checking Frontend Authentication State');
console.log('========================================');

// Check if we're in a browser environment
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  const authToken = localStorage.getItem('auth_token');
  const authUser = localStorage.getItem('auth_user');
  
  console.log('Auth Token:', authToken ? 'Present' : 'Missing');
  console.log('Auth User:', authUser ? 'Present' : 'Missing');
  
  if (authUser) {
    try {
      const user = JSON.parse(authUser);
      console.log('User Data:', user);
    } catch (error) {
      console.log('Error parsing user data:', error.message);
    }
  }
  
  // Test API call
  console.log('\n🧪 Testing API Call...');
  if (authToken) {
    fetch('http://localhost:5000/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log('API Response:', data);
    })
    .catch(error => {
      console.log('API Error:', error.message);
    });
  } else {
    console.log('No auth token - cannot test API call');
  }
} else {
  console.log('Not in browser environment');
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    checkAuth: () => {
      console.log('This script should be run in the browser console');
    }
  };
}
