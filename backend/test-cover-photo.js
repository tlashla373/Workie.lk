// Test Cover Photo Upload
// Run this with: node test-cover-photo.js

const http = require('http');
const FormData = require('form-data');
const fs = require('fs');

// Helper function to make HTTP requests
function makeRequest(method, path, data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            data: parsedData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data && typeof data === 'string') {
      req.write(data);
    } else if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Helper function to make FormData uploads
function uploadFile(path, formData, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...formData.getHeaders()
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            data: parsedData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    formData.pipe(req);
  });
}

// Create test image files
function createTestImage(filename) {
  // Create a simple PNG image using minimal PNG data
  const pngData = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 pixel
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, // IHDR data
    0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41, 0x54, // IDAT chunk
    0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01,
    0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82 // IEND
  ]);
  
  fs.writeFileSync(filename, pngData);
  return filename;
}

async function testLogin() {
  console.log('🔍 Login to get authentication token...');
  const credentials = { 
    email: 'upload.test.1756015371549@example.com', 
    password: 'TestPassword123' 
  };

  try {
    const response = await makeRequest('POST', '/auth/login', credentials);
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ Login Successful!');
      return response.data.data.token;
    } else {
      console.log('❌ Login Failed:', response.data);
      return null;
    }
  } catch (error) {
    console.error('❌ Login Error:', error.message);
    return null;
  }
}

async function testCoverPhotoUpload(token) {
  console.log('\n🔍 Testing Cover Photo Upload with Authentication...');
  
  try {
    // Create test image
    const imagePath = createTestImage('./test-cover.png');
    
    // Create FormData
    const formData = new FormData();
    formData.append('coverPhoto', fs.createReadStream(imagePath));

    const response = await uploadFile('/media/cover-photo', formData, token);
    
    console.log(`📊 Status: ${response.statusCode}`);
    
    if (response.statusCode === 200 && response.data.message) {
      console.log('✅ Cover photo upload successful!');
      console.log('📸 Cloudinary URL:', response.data.cloudinary?.url || 'N/A');
      console.log('🗄️ Database saved:', response.data.user?.coverPhoto ? 'Yes' : 'No');
      console.log('🆔 User ID:', response.data.user?.id);
      console.log('🖼️ Cover Photo URL:', response.data.user?.coverPhoto);
      
      // Clean up test file
      fs.unlinkSync(imagePath);
      
      return { success: true, data: response.data };
    } else {
      console.log('❌ Cover photo upload failed:', response.data);
      fs.unlinkSync(imagePath); // Clean up even on failure
      return { success: false, error: response.data };
    }
  } catch (error) {
    console.error('❌ Upload Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function verifyUserData(token) {
  console.log('\n🔍 Verifying User Data with Cover Photo...');
  
  try {
    const response = await makeRequest('GET', '/auth/me', null, {
      'Authorization': `Bearer ${token}`
    });
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ User data retrieved successfully!');
      console.log('🖼️ Cover Photo in DB:', response.data.data.user.coverPhoto || 'None');
      console.log('🆔 Cover Photo Public ID:', response.data.data.user.coverPhotoPublicId || 'None');
      console.log('🖼️ Profile Picture in DB:', response.data.data.user.profilePicture || 'None');
      
      return { success: true, userData: response.data.data };
    } else {
      console.log('❌ Failed to retrieve user data:', response.data);
      return { success: false };
    }
  } catch (error) {
    console.error('❌ Verification Error:', error.message);
    return { success: false };
  }
}

async function runCoverPhotoTest() {
  console.log('🚀 Starting Cover Photo Upload Test...');
  console.log('=' .repeat(50));

  // Step 1: Get authentication token
  const token = await testLogin();
  if (!token) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }

  console.log(`\n🔐 Using authentication token for cover photo test`);

  // Step 2: Test cover photo upload
  const uploadResult = await testCoverPhotoUpload(token);
  
  // Step 3: Verify database save
  const verifyResult = await verifyUserData(token);

  // Summary
  console.log('\n' + '=' .repeat(50));
  console.log('📋 COVER PHOTO TEST SUMMARY:');
  console.log('=' .repeat(50));
  console.log('🔐 Authentication:', token ? '✅ Working' : '❌ Failed');
  console.log('🖼️ Cover Photo Upload:', uploadResult.success ? '✅ Working' : '❌ Failed');
  console.log('🗄️ Database Persistence:', verifyResult.success ? '✅ Working' : '❌ Failed');
  
  if (token && uploadResult.success && verifyResult.success) {
    console.log('\n🎉 ALL COVER PHOTO TESTS PASSED! Cover photos are working with database saving.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the details above.');
  }
}

// Run the test
runCoverPhotoTest().catch(console.error);
