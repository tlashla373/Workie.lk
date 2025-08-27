const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function testClientVerificationFlow() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    const baseURL = 'http://localhost:5000/api';
    const testEmail = 'client-test@example.com';

    // Step 1: Create a new test user (simulating signup)
    console.log('\n=== STEP 1: CREATING TEST USER ===');
    try {
      await User.deleteOne({ email: testEmail }); // Clean up existing user
    } catch (e) {
      // User might not exist, that's fine
    }

    const testUser = new User({
      firstName: 'Test',
      lastName: 'Client',
      email: testEmail,
      password: 'password123',
      phone: '+94712345678'
    });
    await testUser.save();
    console.log('✅ Created test user:', testUser._id);
    console.log('Initial userType:', testUser.userType);

    // Step 2: Login
    console.log('\n=== STEP 2: LOGIN ===');
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: testEmail,
      password: 'password123'
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Login successful');
    console.log('User data from login:', loginResponse.data.data.user.userType);

    // Step 3: Simulate role selection - update to client
    console.log('\n=== STEP 3: ROLE SELECTION (UPDATE TO CLIENT) ===');
    const roleUpdateResponse = await axios.put(`${baseURL}/auth/update-role`, {
      userType: 'client'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Role update response:', {
      success: roleUpdateResponse.data.success,
      userType: roleUpdateResponse.data.data.user.userType,
      message: roleUpdateResponse.data.message
    });

    // Step 4: Check /auth/me immediately after role update
    console.log('\n=== STEP 4: CHECK /auth/me AFTER ROLE UPDATE ===');
    const meAfterRoleUpdate = await axios.get(`${baseURL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Auth/me after role update:', {
      userType: meAfterRoleUpdate.data.data.user.userType
    });

    // Step 5: Simulate client setup completion (this is what happens when user completes setup)
    console.log('\n=== STEP 5: CLIENT SETUP COMPLETION ===');
    // In the real flow, ClientSetup doesn't update role, it just navigates to profile
    // So we'll simulate just calling /auth/me again like the profile page would do

    // Step 6: Final verification - what would the profile page see?
    console.log('\n=== STEP 6: FINAL PROFILE PAGE CHECK ===');
    const finalMeCheck = await axios.get(`${baseURL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Final /auth/me check:', {
      userType: finalMeCheck.data.data.user.userType
    });

    // Step 7: Direct database check
    console.log('\n=== STEP 7: DIRECT DATABASE CHECK ===');
    const userFromDB = await User.findById(testUser._id);
    console.log('User from database:', {
      userType: userFromDB.userType,
      email: userFromDB.email
    });

    // Step 8: Test with a new token (simulate page refresh)
    console.log('\n=== STEP 8: LOGIN AGAIN (SIMULATE PAGE REFRESH) ===');
    const newLoginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: testEmail,
      password: 'password123'
    });
    
    const newToken = newLoginResponse.data.data.token;
    console.log('New login userType:', newLoginResponse.data.data.user.userType);

    const meWithNewToken = await axios.get(`${baseURL}/auth/me`, {
      headers: { Authorization: `Bearer ${newToken}` }
    });
    console.log('Auth/me with new token:', meWithNewToken.data.data.user.userType);

    // Cleanup
    await User.deleteOne({ email: testEmail });
    console.log('\n✅ Test completed and cleaned up');

  } catch (error) {
    if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
    } else {
      console.error('❌ Error:', error.message);
    }
  } finally {
    await mongoose.connection.close();
  }
}

// Run the test
testClientVerificationFlow();
