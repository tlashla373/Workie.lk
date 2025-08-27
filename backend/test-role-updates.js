const axios = require('axios');

async function testRoleUpdates() {
  const BASE_URL = 'http://localhost:5000/api';
  
  console.log('🧪 Testing User Role Updates');
  console.log('============================');
  
  try {
    // Register a test user without userType
    console.log('\n1. Registering test user without userType...');
    const registerData = {
      firstName: 'Test',
      lastName: 'Client',
      email: 'testclient@example.com',
      password: 'TestPass123',
      phone: '+94771234567'
      // Note: no userType specified
    };
    
    let authToken = null;
    
    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, registerData);
      
      if (registerResponse.data.success) {
        authToken = registerResponse.data.data.token;
        console.log('✅ User registered successfully without userType');
        console.log('   Initial userType:', registerResponse.data.data.user.userType || 'null');
      }
    } catch (error) {
      if (error.response && error.response.data.message.includes('already exists')) {
        console.log('ℹ️  User already exists, trying to login...');
        
        try {
          const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
            email: registerData.email,
            password: registerData.password
          });
          
          if (loginResponse.data.success) {
            authToken = loginResponse.data.data.token;
            console.log('✅ User logged in successfully');
            console.log('   Current userType:', loginResponse.data.data.user.userType || 'null');
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
    
    // Test updating role to client
    console.log('\n2. Testing role update to client...');
    try {
      const clientRoleResponse = await axios.put(`${BASE_URL}/auth/update-role`, 
        { userType: 'client' },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('✅ Role updated to client successfully!');
      console.log('   Response:', clientRoleResponse.data);
      
      // Verify the role was actually saved
      const userCheckResponse = await axios.get(`${BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('✅ User role verification:');
      console.log('   Current userType in database:', userCheckResponse.data.data.userType);
      
    } catch (error) {
      console.log('❌ Client role update failed:');
      console.log('   Status:', error.response?.status);
      console.log('   Message:', error.response?.data?.message || error.message);
      console.log('   Full error:', error.response?.data);
    }
    
    // Test trying to change from client to worker (should fail)
    console.log('\n3. Testing role change from client to worker (should fail)...');
    try {
      const workerRoleResponse = await axios.put(`${BASE_URL}/auth/update-role`, 
        { userType: 'worker' },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('❌ Role change succeeded when it should have failed:', workerRoleResponse.data);
      
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already been set')) {
        console.log('✅ Role change correctly prevented:');
        console.log('   Message:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error during role change:');
        console.log('   Status:', error.response?.status);
        console.log('   Message:', error.response?.data?.message || error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRoleUpdates();
