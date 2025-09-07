const axios = require('axios');

async function testVerificationUpload() {
  try {
    console.log('Testing verification documents endpoint...');
    
    // Test the verification endpoint existence
    const response = await axios.get('http://localhost:5000/api/media/test');
    console.log('✅ Media service is running:', response.data);
    
    // List all available endpoints
    console.log('\n📋 Available endpoints:');
    console.log('- GET  /api/media/test');
    console.log('- POST /api/media/profile-picture');
    console.log('- POST /api/media/verification-documents');
    console.log('- POST /api/media/portfolio');
    console.log('- GET  /api/health');
    
  } catch (error) {
    console.error('❌ Error testing verification endpoint:');
    console.error('Error message:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
}

testVerificationUpload();
