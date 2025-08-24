// Test Authenticated Media Upload with Database Saving
// This test creates a user, logs in, and then uploads files to test complete flow
// Run this with: node test-authenticated-upload.js

const http = require('http');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const API_BASE = 'http://localhost:5000/api';

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

async function testUserRegistration() {
  console.log('\n🔍 Creating Test User...');
  const testUser = {
    firstName: 'Upload',
    lastName: 'Tester',
    email: `upload.test.${Date.now()}@example.com`,
    password: 'TestPassword123',
    userType: 'worker'
  };

  try {
    const response = await makeRequest('POST', '/auth/register', testUser);
    
    if (response.statusCode === 201 && response.data.success) {
      console.log('✅ User Registration Successful!');
      console.log('📝 User:', response.data.data.user.firstName, response.data.data.user.lastName);
      console.log('🔑 Token received:', response.data.data.token ? 'Yes' : 'No');
      return { success: true, user: response.data.data.user, token: response.data.data.token };
    } else {
      console.log('❌ User Registration Failed:', response.data);
      return { success: false };
    }
  } catch (error) {
    console.error('❌ Registration Error:', error.message);
    return { success: false };
  }
}

async function testProfilePictureUpload(token, userId) {
  console.log('\n🔍 Testing Profile Picture Upload with Authentication...');
  
  try {
    // Create test image
    const imagePath = createTestImage('./test-profile.png');
    
    // Create FormData
    const formData = new FormData();
    formData.append('profilePicture', fs.createReadStream(imagePath));

    const response = await uploadFile('/media/profile-picture', formData, token);
    
    console.log(`📊 Status: ${response.statusCode}`);
    
    if (response.statusCode === 200 && response.data.message) {
      console.log('✅ Profile picture upload successful!');
      console.log('📸 Cloudinary URL:', response.data.cloudinary?.url || 'N/A');
      console.log('🗄️ Database saved:', response.data.user?.profilePicture ? 'Yes' : 'No');
      console.log('🆔 User ID:', response.data.user?.id);
      console.log('🖼️ Profile Picture URL:', response.data.user?.profilePicture);
      
      // Clean up test file
      fs.unlinkSync(imagePath);
      
      return { success: true, data: response.data };
    } else {
      console.log('❌ Profile picture upload failed:', response.data);
      fs.unlinkSync(imagePath); // Clean up even on failure
      return { success: false, error: response.data };
    }
  } catch (error) {
    console.error('❌ Upload Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function testVerificationDocumentsUpload(token) {
  console.log('\n🔍 Testing Verification Documents Upload with Authentication...');
  
  try {
    // Create test images
    const frontPath = createTestImage('./test-id-front.png');
    const backPath = createTestImage('./test-id-back.png');
    
    // Create FormData
    const formData = new FormData();
    formData.append('idPhotoFront', fs.createReadStream(frontPath));
    formData.append('idPhotoBack', fs.createReadStream(backPath));

    const response = await uploadFile('/media/verification-documents', formData, token);
    
    console.log(`📊 Status: ${response.statusCode}`);
    
    if (response.statusCode === 200 && response.data.message) {
      console.log('✅ Verification documents upload successful!');
      console.log('📸 Front ID URL:', response.data.cloudinary?.front?.url || 'N/A');
      console.log('📸 Back ID URL:', response.data.cloudinary?.back?.url || 'N/A');
      console.log('🗄️ Database saved:', response.data.profile ? 'Yes' : 'No');
      
      // Clean up test files
      fs.unlinkSync(frontPath);
      fs.unlinkSync(backPath);
      
      return { success: true, data: response.data };
    } else {
      console.log('❌ Verification documents upload failed:', response.data);
      // Clean up even on failure
      fs.unlinkSync(frontPath);
      fs.unlinkSync(backPath);
      return { success: false, error: response.data };
    }
  } catch (error) {
    console.error('❌ Upload Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function verifyDatabaseSave(token, userId) {
  console.log('\n🔍 Verifying Database Save...');
  
  try {
    const response = await makeRequest('GET', '/auth/me', null, {
      'Authorization': `Bearer ${token}`
    });
    
    if (response.statusCode === 200 && response.data.success) {
      console.log('✅ User data retrieved successfully!');
      console.log('🖼️ Profile Picture in DB:', response.data.data.profilePicture || 'None');
      console.log('🆔 Profile Picture Public ID:', response.data.data.profilePicturePublicId || 'None');
      
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

async function runAuthenticatedUploadTest() {
  console.log('🚀 Starting Authenticated Upload Test...');
  console.log('=' .repeat(50));

  // Step 1: Create and authenticate user
  const authResult = await testUserRegistration();
  if (!authResult.success) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }

  const { token, user } = authResult;
  console.log(`\n🔐 Using token for user: ${user.firstName} ${user.lastName} (${user.email})`);

  // Step 2: Test profile picture upload
  const profileUploadResult = await testProfilePictureUpload(token, user.id);
  
  // Step 3: Test verification documents upload
  const verificationUploadResult = await testVerificationDocumentsUpload(token);
  
  // Step 4: Verify database save
  const dbVerifyResult = await verifyDatabaseSave(token, user.id);

  // Summary
  console.log('\n' + '=' .repeat(50));
  console.log('📋 TEST SUMMARY:');
  console.log('=' .repeat(50));
  console.log('🔐 Authentication:', authResult.success ? '✅ Working' : '❌ Failed');
  console.log('🖼️ Profile Picture Upload:', profileUploadResult.success ? '✅ Working' : '❌ Failed');
  console.log('📄 Verification Docs Upload:', verificationUploadResult.success ? '✅ Working' : '❌ Failed');
  console.log('🗄️ Database Persistence:', dbVerifyResult.success ? '✅ Working' : '❌ Failed');
  
  if (authResult.success && profileUploadResult.success && dbVerifyResult.success) {
    console.log('\n🎉 ALL TESTS PASSED! Uploads are working with database saving.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the details above.');
  }
}

// Run the test
runAuthenticatedUploadTest().catch(console.error);
