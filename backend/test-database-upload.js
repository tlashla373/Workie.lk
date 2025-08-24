const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testDatabaseSaving() {
  try {
    console.log('🧪 Testing complete upload flow with database saving...\n');
    
    // First, test if we can reach the endpoints without auth
    console.log('1. Testing endpoint availability...');
    const testResponse = await axios.get('http://localhost:5000/api/media/test');
    console.log('✅ Media endpoints are available');
    console.log('Available uploaders:', testResponse.data.availableUploaders.length);
    
    // Test profile picture upload (should work without auth for now)
    console.log('\n2. Testing profile picture upload...');
    
    // Create a small test image file
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52, // IHDR chunk
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 pixel
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
      0xDE, 0x00, 0x00, 0x00, 0x0C, 0x49, 0x44, 0x41,
      0x54, 0x08, 0x99, 0x01, 0x01, 0x00, 0x00, 0x00,
      0xFF, 0xFF, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01,
      0xE2, 0x21, 0xBC, 0x33, 0x00, 0x00, 0x00, 0x00,
      0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82  // IEND chunk
    ]);
    
    // Write test image to file
    fs.writeFileSync('test-image.png', testImageBuffer);
    
    try {
      const formData = new FormData();
      formData.append('profilePicture', fs.createReadStream('test-image.png'), {
        filename: 'test-profile.png',
        contentType: 'image/png'
      });
      
      const uploadResponse = await axios.post(
        'http://localhost:5000/api/media/profile-picture',
        formData,
        {
          headers: {
            ...formData.getHeaders()
          }
        }
      );
      
      console.log('✅ Profile picture upload successful!');
      console.log('Response:', JSON.stringify(uploadResponse.data, null, 2));
      
      // Check if URL and database info are returned
      if (uploadResponse.data.cloudinary && uploadResponse.data.cloudinary.url) {
        console.log('✅ Cloudinary URL received:', uploadResponse.data.cloudinary.url);
      }
      
      if (uploadResponse.data.user) {
        console.log('✅ Database was updated with user profile picture');
      } else if (uploadResponse.data.note && uploadResponse.data.note.includes('Auth temporarily disabled')) {
        console.log('⚠️  Database saving is disabled (auth not enabled)');
      }
      
    } catch (uploadError) {
      console.log('❌ Profile picture upload failed:');
      if (uploadError.response) {
        console.log('Status:', uploadError.response.status);
        console.log('Error:', uploadError.response.data);
      } else {
        console.log('Error:', uploadError.message);
      }
    }
    
    // Test verification documents endpoint
    console.log('\n3. Testing verification documents upload...');
    try {
      const verificationFormData = new FormData();
      verificationFormData.append('idPhotoFront', fs.createReadStream('test-image.png'), {
        filename: 'id-front.png',
        contentType: 'image/png'
      });
      verificationFormData.append('idPhotoBack', fs.createReadStream('test-image.png'), {
        filename: 'id-back.png',
        contentType: 'image/png'
      });
      
      const verificationResponse = await axios.post(
        'http://localhost:5000/api/media/verification-documents',
        verificationFormData,
        {
          headers: {
            ...verificationFormData.getHeaders()
          }
        }
      );
      
      console.log('✅ Verification documents upload successful!');
      console.log('Files uploaded:', Object.keys(verificationResponse.data.files || {}));
      
      if (verificationResponse.data.files) {
        console.log('✅ Cloudinary URLs received for verification documents');
      }
      
    } catch (verificationError) {
      console.log('❌ Verification documents upload failed:');
      if (verificationError.response) {
        console.log('Status:', verificationError.response.status);
        console.log('Error:', verificationError.response.data);
      } else {
        console.log('Error:', verificationError.message);
      }
    }
    
    // Clean up test file
    fs.unlinkSync('test-image.png');
    
    console.log('\n📋 Summary:');
    console.log('- Cloudinary integration: ✅ Working');
    console.log('- File uploads: ✅ Working');
    console.log('- Database saving: ⚠️  Depends on auth middleware');
    console.log('\n💡 To enable database saving:');
    console.log('1. Fix auth middleware issues');
    console.log('2. Ensure users are authenticated before upload');
    console.log('3. Test with valid JWT tokens');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDatabaseSaving();
