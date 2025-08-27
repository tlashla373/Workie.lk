const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testAuthMeEndpoint() {
  try {
    // Connect to MongoDB first to get user info
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Find our test user
    const testEmail = 'test@example.com';
    const user = await User.findOne({ email: testEmail });
    
    if (!user) {
      console.log('❌ Test user not found');
      return;
    }

    console.log('=== USER FROM DATABASE ===');
    console.log('Database userType:', user.userType);
    console.log('Database userType type:', typeof user.userType);

    // Close DB connection
    await mongoose.connection.close();

    // Now test the API endpoints
    const baseURL = 'http://localhost:5000/api';

    // First, login to get a token
    console.log('\n=== TESTING LOGIN ===');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: testEmail,
      password: 'password123'
    });

    console.log('Login response status:', loginResponse.status);
    console.log('Login response data:', JSON.stringify(loginResponse.data, null, 2));
    
    const token = loginResponse.data.data.token;
    console.log('✅ Login successful, got token:', token?.substring(0, 20) + '...');

    // Test /auth/me endpoint
    console.log('\n=== TESTING /auth/me ENDPOINT ===');
    const meResponse = await axios.get(`${baseURL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Auth/me response userType:', meResponse.data.data.user.userType);
    console.log('Auth/me response userType type:', typeof meResponse.data.data.user.userType);
    console.log('Full user object from /auth/me:');
    console.log(JSON.stringify(meResponse.data.data.user, null, 2));

    // Test role update endpoint
    console.log('\n=== TESTING ROLE UPDATE ENDPOINT ===');
    const roleUpdateResponse = await axios.put(`${baseURL}/auth/update-role`, {
      userType: 'client'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Role update response userType:', roleUpdateResponse.data.data.user.userType);
    console.log('Role update response userType type:', typeof roleUpdateResponse.data.data.user.userType);

    // Test /auth/me again after role update
    console.log('\n=== TESTING /auth/me AFTER ROLE UPDATE ===');
    const meResponseAfter = await axios.get(`${baseURL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Auth/me AFTER update userType:', meResponseAfter.data.data.user.userType);
    console.log('Auth/me AFTER update userType type:', typeof meResponseAfter.data.data.user.userType);

  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

// Run the test
testAuthMeEndpoint();
