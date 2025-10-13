require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Profile = require('./models/Profile');

async function checkWorkerCategories() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Find all workers with ID documents
        const workers = await User.find({
            userType: 'worker',
            'verificationDocuments.idPhotoFront': { $exists: true, $ne: '' },
            'verificationDocuments.idPhotoBack': { $exists: true, $ne: '' }
        }).select('firstName lastName email');

        console.log(`📊 Workers with ID documents: ${workers.length}\n`);

        console.log('🔍 WORKER CATEGORIES CHECK:\n');
        console.log('='.repeat(80));

        for (const worker of workers) {
            // Get worker's profile
            const profile = await Profile.findOne({ user: worker._id }).select('workerCategories');

            console.log(`\n👤 ${worker.firstName} ${worker.lastName}`);
            console.log(`   Email: ${worker.email}`);

            if (profile && profile.workerCategories && profile.workerCategories.length > 0) {
                console.log(`   ✅ Categories: ${profile.workerCategories.join(', ')}`);
                console.log(`   Profession display: "${profile.workerCategories.join(', ')}"`);
            } else {
                console.log(`   ❌ No categories found`);
                console.log(`   Profession display: "No profession"`);
            }
        }

        console.log('\n' + '='.repeat(80));
        console.log('\n📊 SUMMARY:\n');

        let workersWithCategories = 0;
        let workersWithoutCategories = 0;

        for (const worker of workers) {
            const profile = await Profile.findOne({ user: worker._id }).select('workerCategories');
            if (profile && profile.workerCategories && profile.workerCategories.length > 0) {
                workersWithCategories++;
            } else {
                workersWithoutCategories++;
            }
        }

        console.log(`Total workers: ${workers.length}`);
        console.log(`✅ Workers with categories: ${workersWithCategories}`);
        console.log(`❌ Workers without categories: ${workersWithoutCategories}`);

        if (workersWithoutCategories > 0) {
            console.log('\n⚠️  Workers without categories need to complete their profile setup');
        }

        console.log('\n💡 FIX APPLIED:');
        console.log('Backend now fetches worker categories from Profile collection');
        console.log('Categories will display instead of "No profession"');

        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

checkWorkerCategories();
