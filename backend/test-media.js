const axios = require('axios');

async function testMediaRoutes() {
  try {
    console.log('Testing media routes...');
    
    // Test the basic test endpoint
    const response = await axios.get('http://localhost:5000/api/media/test');
    console.log('✅ Media test endpoint:', response.data);
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health endpoint:', healthResponse.data);
    
  } catch (error) {
    console.error('❌ Error testing routes:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testMediaRoutes();
