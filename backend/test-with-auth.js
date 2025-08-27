const axios = require('axios');

async function testWithAuthToken() {
  const BASE_URL = 'http://localhost:5000/api';
  
  console.log('🔐 Testing Worker Verification with Authentication');
  console.log('=================================================');
  
  try {
    // First register a test user
    console.log('\n1. Registering test user...');
    const registerData = {
      firstName: 'Test',
      lastName: 'Worker',
      email: 'testworker@example.com',
      password: 'TestPass123',  // Changed to meet validation requirements
      phone: '+94771234567',
      userType: 'worker'
    };
    
    let authToken = null;
    
    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
      
      if (registerResponse.data.success) {
        authToken = registerResponse.data.data.token;
        console.log('✅ User registered successfully');
        console.log('   Token received:', authToken ? 'Yes' : 'No');
      }
    } catch (error) {
      if (error.response && error.response.data.message.includes('already exists')) {
        console.log('ℹ️  User already exists, trying to login...');
        
        // Try to login instead
        try {
          const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: registerData.email,
            password: registerData.password  // Use same password
          });
          
          if (loginResponse.data.success) {
            authToken = loginResponse.data.data.token;
            console.log('✅ User logged in successfully');
          }
        } catch (loginError) {
          console.log('❌ Login failed:', loginError.response?.data?.message || loginError.message);
          return;
        }
      } else {
        console.log('❌ Registration failed:', error.response?.data?.message || error.message);
        return;
      }
    }
    
    if (!authToken) {
      console.log('❌ Could not obtain auth token');
      return;
    }
    
    // Now test worker verification with valid token
    console.log('\n2. Testing worker verification with valid token...');
    
    const verificationData = {
      categories: JSON.stringify(['Plumber', 'Electrician']),
      skills: 'Professional plumbing, electrical work',
      experience: '5 years of experience in home repairs',
      bio: 'Experienced worker specializing in plumbing and electrical work',
      age: '30',
      country: 'Sri Lanka',
      streetAddress: '123 Main Street',
      city: 'Colombo',
      postalCode: '10100',
      location: 'Colombo Central',
      address: 'Colombo, Dehiwala, Mount Lavinia',
      companyName: 'Independent',
      phone: '+94771234567'
    };
    
    try {
      const verificationResponse = await axios.post(`${BASE_URL}/auth/worker-verification`, verificationData, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ Worker verification successful!');
      console.log('   Response:', verificationResponse.data);
      
    } catch (error) {
      console.log('❌ Worker verification failed:');
      console.log('   Status:', error.response?.status);
      console.log('   Message:', error.response?.data?.message || error.message);
      console.log('   Full error:', error.response?.data);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testWithAuthToken();
