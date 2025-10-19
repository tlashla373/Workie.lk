// Quick MongoDB Connection Test
// Run this locally to verify your MongoDB URI works
// Usage: node test-mongo-connection.js

const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB Connection...\n');

if (!process.env.MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI is not set in .env file');
  console.log('\n💡 Create a .env file with:');
  console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database\n');
  process.exit(1);
}

console.log('📡 Connecting to MongoDB...');
console.log(`🔗 URI: ${process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')}\n`);

const connectionOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

mongoose.connect(process.env.MONGODB_URI, connectionOptions)
  .then(() => {
    console.log('✅ SUCCESS! MongoDB connected successfully!\n');
    console.log('📊 Connection Details:');
    console.log(`   - Database: ${mongoose.connection.db.databaseName}`);
    console.log(`   - Host: ${mongoose.connection.host}`);
    console.log(`   - Ready State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected'}\n`);
    console.log('🎉 Your MongoDB URI is working correctly!');
    console.log('✨ You can use this in Railway environment variables.\n');
    
    mongoose.connection.close();
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ FAILED! MongoDB connection error:\n');
    console.error(`   Error: ${err.message}\n`);
    
    if (err.message.includes('authentication failed')) {
      console.log('💡 Fix: Check your username and password in the MongoDB URI');
    } else if (err.message.includes('ENOTFOUND')) {
      console.log('💡 Fix: Check your cluster URL is correct');
    } else if (err.message.includes('bad auth')) {
      console.log('💡 Fix: Verify database user credentials in MongoDB Atlas');
    } else if (err.message.includes('ETIMEDOUT')) {
      console.log('💡 Fix: Check Network Access in MongoDB Atlas');
      console.log('       Allow IP: 0.0.0.0/0 (Allow from Anywhere)');
    }
    
    console.log('\n📋 Troubleshooting Steps:');
    console.log('   1. Go to MongoDB Atlas → Network Access');
    console.log('   2. Add IP Address → Allow Access from Anywhere (0.0.0.0/0)');
    console.log('   3. Go to Database Access → Verify user exists');
    console.log('   4. Check user has "Read and write to any database" privileges');
    console.log('   5. Verify connection string format:\n');
    console.log('      mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>\n');
    
    process.exit(1);
  });

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ Connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('📡 Disconnected from MongoDB');
});

// Handle process termination
process.on('SIGINT', () => {
  mongoose.connection.close();
  console.log('\n👋 Connection closed');
  process.exit(0);
});
