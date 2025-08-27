const mongoose = require('mongoose');
const User = require('./models/User');
const Profile = require('./models/Profile');
require('dotenv').config();

async function testClientVerification() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Test user credentials (assuming this user exists)
    const testEmail = 'test@example.com';
    
    // Find the test user
    let user = await User.findOne({ email: testEmail });
    
    if (!user) {
      console.log('❌ Test user not found, creating one...');
      // Create test user for this test
      user = new User({
        firstName: 'Test',
        lastName: 'Client',
        email: testEmail,
        password: 'password123',
        phone: '+94712345678'
      });
      await user.save();
      console.log('✅ Created test user:', user._id);
    }

    console.log('\n=== BEFORE ROLE UPDATE ===');
    console.log('User ID:', user._id);
    console.log('Current userType:', user.userType);
    console.log('Current userType type:', typeof user.userType);

    // Update userType to 'client'
    console.log('\n=== UPDATING ROLE TO CLIENT ===');
    user.userType = 'client';
    await user.save();
    console.log('✅ Updated userType to client');

    // Immediately fetch the user again to see if it persisted
    const refetchedUser = await User.findById(user._id);
    console.log('\n=== AFTER SAVE (IMMEDIATE REFETCH) ===');
    console.log('Refetched userType:', refetchedUser.userType);
    console.log('Refetched userType type:', typeof refetchedUser.userType);

    // Test the user.save() with explicit field setting
    console.log('\n=== TESTING EXPLICIT FIELD UPDATE ===');
    const updateResult = await User.findByIdAndUpdate(
      user._id,
      { userType: 'client' },
      { new: true, runValidators: true }
    );
    console.log('Update result userType:', updateResult.userType);

    // Test direct database query
    console.log('\n=== DIRECT DATABASE QUERY ===');
    const directQuery = await User.findOne({ _id: user._id }, { userType: 1, email: 1 });
    console.log('Direct query result:', directQuery);

    // Test JSON serialization (what the API returns)
    console.log('\n=== JSON SERIALIZATION TEST ===');
    const jsonUser = refetchedUser.toJSON();
    console.log('JSON userType:', jsonUser.userType);
    console.log('JSON userType type:', typeof jsonUser.userType);

    // Check if there's any middleware interfering
    console.log('\n=== SCHEMA VALIDATION TEST ===');
    const testUser = new User({
      firstName: 'Schema',
      lastName: 'Test',
      email: 'schema@test.com',
      password: 'password123',
      userType: 'client'
    });
    
    const savedTestUser = await testUser.save();
    console.log('New user with userType:', savedTestUser.userType);

    // Cleanup
    await User.deleteOne({ email: 'schema@test.com' });

  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ MongoDB connection closed');
  }
}

// Run the test
testClientVerification();
