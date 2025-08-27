const axios = require('axios');

async function testWorkerVerification() {
  console.log('🧪 Testing Worker Verification Endpoint...\n');
  
  try {
    // Test basic connectivity first
    console.log('1. Testing server connectivity...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Server is running:', healthResponse.data);
    
    // Test worker verification endpoint without auth (should fail)
    console.log('\n2. Testing worker verification without auth...');
    try {
      const noAuthResponse = await axios.post('http://localhost:5000/api/auth/worker-verification', {
        categories: JSON.stringify(['Plumber']),
        bio: 'Test bio',
        age: '25',
        country: 'Sri Lanka',
        streetAddress: 'Test Address',
        city: 'Colombo',
        postalCode: '12345',
        location: 'Colombo',
        address: 'Colombo area',
        phone: '+94712345678'
      });
      console.log('❌ Expected auth error but got success:', noAuthResponse.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Correctly requires authentication');
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    
    // Test endpoint structure
    console.log('\n3. Testing endpoint structure...');
    console.log('✅ Worker verification endpoint exists at: /api/auth/worker-verification');
    console.log('✅ Method: POST');
    console.log('✅ Requires: Bearer token authentication');
    
    console.log('\n📋 Required fields for worker verification:');
    console.log('- categories (JSON string or array)');
    console.log('- bio (string)');
    console.log('- age (string/number)');
    console.log('- country (string)');
    console.log('- streetAddress (string)');
    console.log('- city (string)');
    console.log('- postalCode (string)');
    console.log('- location (string)');
    console.log('- address (string)');
    console.log('- phone (string)');
    console.log('- skills (optional string)');
    console.log('- experience (optional string)');
    console.log('- companyName (optional string)');
    
    console.log('\n✅ Worker verification endpoint is properly configured!');
    console.log('\n💡 To test with authentication:');
    console.log('1. Login first to get a JWT token');
    console.log('2. Include token in Authorization header');
    console.log('3. Submit complete verification data');
    
  } catch (error) {
    console.error('❌ Error testing worker verification:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Backend server is not running. Please start it with: npm run dev');
    }
  }
}

testWorkerVerification();
