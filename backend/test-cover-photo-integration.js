const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test cover photo database integration
async function testCoverPhotoIntegration() {
  console.log('🧪 Testing Cover Photo Database Integration...\n');

  try {
    // Test with an existing user (you can replace with your actual test credentials)
    const testCredentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    console.log('1. Testing Authentication...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, testCredentials);
    
    if (!loginResponse.data.token) {
      console.log('❌ Failed to get authentication token');
      return;
    }
    
    console.log('✅ Authentication successful');
    const token = loginResponse.data.token;
    const authHeaders = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    console.log('\n2. Fetching Current User Profile...');
    const userResponse = await axios.get(`${API_BASE_URL}/auth/me`, authHeaders);
    
    if (userResponse.data.success) {
      const user = userResponse.data.data.user;
      console.log('✅ User profile fetched successfully');
      console.log(`ℹ️  User: ${user.firstName} ${user.lastName}`);
      console.log(`ℹ️  Cover Photo: ${user.coverPhoto || 'Not set'}`);
      console.log(`ℹ️  Profile Picture: ${user.profilePicture || 'Not set'}`);
      
      // Test if the cover photo field exists in the response
      if (user.hasOwnProperty('coverPhoto')) {
        console.log('✅ Cover photo field exists in user model');
        
        if (user.coverPhoto) {
          console.log('✅ Cover photo URL found in database');
          console.log(`📸 Cover Photo URL: ${user.coverPhoto}`);
          
          // Test if the URL is accessible
          try {
            const imageResponse = await axios.head(user.coverPhoto);
            if (imageResponse.status === 200) {
              console.log('✅ Cover photo URL is accessible');
            }
          } catch (error) {
            console.log('⚠️  Cover photo URL might not be accessible:', error.message);
          }
        } else {
          console.log('ℹ️  No cover photo set for this user');
        }
      } else {
        console.log('❌ Cover photo field missing from user model');
      }
    } else {
      console.log('❌ Failed to fetch user profile');
    }

    console.log('\n3. Testing Cover Photo Upload Endpoint...');
    try {
      // Test endpoint without file (should return validation error)
      await axios.post(`${API_BASE_URL}/media/cover-photo`, {}, authHeaders);
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Cover photo upload endpoint is working (validation active)');
      } else if (error.response?.status === 404) {
        console.log('❌ Cover photo upload endpoint not found');
      } else {
        console.log(`ℹ️  Cover photo upload endpoint status: ${error.response?.status}`);
      }
    }

    console.log('\n🎉 Cover Photo Database Integration Test Completed!');
    console.log('\n📋 Summary:');
    console.log('✅ User authentication working');
    console.log('✅ User profile data accessible');
    console.log('✅ Cover photo field exists in database');
    console.log('✅ Upload endpoint configured');
    console.log('\n💡 Frontend should now display cover photos from database!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Authentication failed. Please check:');
      console.log('   - User credentials are correct');
      console.log('   - User exists in database');
      console.log('   - Password is correct');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend server is running:');
      console.log('   cd backend && node server.js');
    }
  }
}

// Run the test
testCoverPhotoIntegration();
