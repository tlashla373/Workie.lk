const express = require('express');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const Profile = require('../models/Profile');
const Complaint = require('../models/Complaint');
const { auth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Middleware to require admin access for all admin routes
router.use(auth);
router.use(requireAdmin);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Admin only
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      totalWorkers,
      totalClients,
      totalJobs,
      activeJobs,
      completedJobs,
      totalApplications,
      pendingApplications,
      recentUsers,
      recentJobs,
      recentApplications
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ userType: 'worker' }),
      User.countDocuments({ userType: 'client' }),
      Job.countDocuments(),
      Job.countDocuments({ status: 'open' }),
      Job.countDocuments({ status: 'completed' }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      User.find().sort({ createdAt: -1 }).limit(5).select('firstName lastName userType createdAt'),
      Job.find().sort({ createdAt: -1 }).limit(5).populate('client', 'firstName lastName').select('title status createdAt'),
      Application.find().sort({ createdAt: -1 }).limit(5).select('status createdAt')
    ]);

    // Calculate monthly revenue (mock data for now)
    const monthlyRevenue = Math.floor(Math.random() * 10000) + 5000;

    res.json({
      success: true,
      data: {
        totalUsers,
        totalWorkers,
        totalClients,
        totalJobs,
        activeJobs,
        completedJobs,
        totalApplications,
        pendingApplications,
        monthlyRevenue,
        recentUsers,
        recentJobs,
        recentApplications
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with pagination and filtering
// @access  Admin only
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const userType = req.query.userType || '';

    // Build query
    let query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (userType && userType !== 'all') {
      query.userType = userType;
    }

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        users,
        totalPages,
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PATCH /api/admin/users/:id/activate
// @desc    Activate/deactivate user
// @access  Admin only
router.patch('/users/:id/activate', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { user }
    });
  } catch (error) {
    console.error('Admin user activate error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/admin/jobs
// @desc    Get all jobs with pagination and filtering
// @access  Admin only
router.get('/jobs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const status = req.query.status || '';

    // Build query
    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }
    if (status && status !== 'all') {
      query.status = status;
    }

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('client', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Job.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        jobs,
        totalPages,
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Admin jobs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/admin/applications
// @desc    Get all applications with pagination and filtering
// @access  Admin only
router.get('/applications', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status || '';

    // Build query
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const [applications, total] = await Promise.all([
      Application.find(query)
        .populate('worker', 'firstName lastName email')
        .populate('job', 'title budget location client')
        .populate('job.client', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Application.countDocuments(query)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: {
        applications,
        totalPages,
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Admin applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/admin/reviews
// @desc    Get all reviews with pagination and filtering (from both Review collection and Application.review)
// @access  Admin only
router.get('/reviews', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const rating = req.query.rating || '';

    // Build query for rating filter
    let ratingQuery = {};
    if (rating && rating !== 'all') {
      ratingQuery = { rating: parseInt(rating) };
    }

    // Fetch from Review collection
    const reviewsFromCollection = await Review.find(ratingQuery)
      .populate('reviewer', 'firstName lastName email profilePicture')
      .populate('reviewee', 'firstName lastName email profilePicture')
      .populate('job', 'title budget')
      .sort({ createdAt: -1 })
      .lean();

    // Fetch from Application.review (embedded reviews)
    let applicationQuery = { 'review.rating': { $exists: true, $ne: null } };
    if (rating && rating !== 'all') {
      applicationQuery['review.rating'] = parseInt(rating);
    }

    const applicationsWithReviews = await Application.find(applicationQuery)
      .populate('worker', 'firstName lastName email profilePicture')
      .populate({
        path: 'job',
        select: 'title budget client',
        populate: {
          path: 'client',
          select: 'firstName lastName email profilePicture'
        }
      })
      .sort({ 'review.submittedAt': -1 })
      .lean();

    // Transform application reviews to match Review format
    const reviewsFromApplications = applicationsWithReviews.map(app => {
      // Get client info from job
      return {
        _id: `app_${app._id}`,
        job: app.job,
        reviewer: app.job?.client || null, // Use client from job
        reviewee: app.worker,
        rating: app.review.rating,
        comment: app.review.comment || '',
        createdAt: app.review.submittedAt || app.updatedAt,
        reviewType: 'client-to-worker',
        isReported: false,
        source: 'application' // Add source identifier
      };
    });

    // Combine both sources
    const allReviews = [
      ...reviewsFromCollection.map(r => ({ ...r, source: 'review' })),
      ...reviewsFromApplications
    ];

    // Sort by date
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply pagination
    const total = allReviews.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedReviews = allReviews.slice(skip, skip + limit);

    res.json({
      success: true,
      data: {
        reviews: paginatedReviews,
        totalPages,
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Admin reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/admin/reviews/:id
// @desc    Get review details
// @access  Admin only
router.get('/reviews/:id', async (req, res) => {
  try {
    const reviewId = req.params.id;

    // Check if it's an application review
    if (reviewId.startsWith('app_')) {
      const applicationId = reviewId.replace('app_', '');
      const application = await Application.findById(applicationId)
        .populate('worker', 'firstName lastName email profilePicture')
        .populate({
          path: 'job',
          select: 'title budget category client',
          populate: {
            path: 'client',
            select: 'firstName lastName email profilePicture'
          }
        });

      if (!application || !application.review?.rating) {
        return res.status(404).json({
          success: false,
          message: 'Review not found'
        });
      }

      // Transform application review to match Review format
      const reviewData = {
        _id: `app_${application._id}`,
        job: application.job,
        reviewer: application.job?.client || null,
        reviewee: application.worker,
        rating: application.review.rating,
        comment: application.review.comment || '',
        createdAt: application.review.submittedAt || application.updatedAt,
        reviewType: 'client-to-worker',
        isReported: false,
        source: 'application'
      };

      return res.json({
        success: true,
        data: {
          review: reviewData
        }
      });
    }

    // Handle regular reviews
    const review = await Review.findById(req.params.id)
      .populate('reviewer', 'firstName lastName email profilePicture')
      .populate('reviewee', 'firstName lastName email profilePicture')
      .populate('job', 'title budget category');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: {
        review: { ...review.toObject(), source: 'review' }
      }
    });
  } catch (error) {
    console.error('Admin get review details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/admin/reviews/:id
// @desc    Delete a review (admin only)
// @access  Admin only
router.delete('/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Admin delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PATCH /api/admin/reviews/:id/report
// @desc    Toggle review reported status
// @access  Admin only
router.patch('/reviews/:id/report', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.isReported = !review.isReported;
    await review.save();

    res.json({
      success: true,
      message: `Review ${review.isReported ? 'reported' : 'unreported'} successfully`,
      data: {
        review
      }
    });
  } catch (error) {
    console.error('Admin report review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/admin/reports
// @desc    Get admin reports and analytics
// @access  Admin only
router.get('/reports/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let data = {};

    switch (type) {
      case 'user-stats':
        const totalUsers = await User.countDocuments();
        const newUsers = await User.countDocuments({ createdAt: { $gte: startDate } });
        const activeUsers = await User.countDocuments({ isActive: true });

        data = {
          totalUsers,
          newUsersThisMonth: newUsers,
          activeUsers,
          userGrowthRate: totalUsers > 0 ? Math.round((newUsers / totalUsers) * 100) : 0
        };
        break;

      case 'job-stats':
        const totalJobs = await Job.countDocuments();
        const recentJobs = await Job.countDocuments({ createdAt: { $gte: startDate } });
        const completedJobs = await Job.countDocuments({ status: 'completed' });

        data = {
          totalJobs,
          jobsThisMonth: recentJobs,
          completedJobs,
          averageJobValue: 450 // Mock data
        };
        break;

      case 'revenue-stats':
        // Mock revenue data - in real implementation, calculate from payments
        data = {
          totalRevenue: 45000,
          monthlyRevenue: 8500,
          averageTransactionValue: 520,
          revenueGrowthRate: 12.8
        };
        break;

      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid report type'
        });
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Admin reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/admin/notifications
// @desc    Create and send admin notification
// @access  Admin only
router.post('/notifications', async (req, res) => {
  try {
    const { title, message, type, targetAudience } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required'
      });
    }

    // Get target users based on audience
    let targetUsers = [];
    if (targetAudience === 'workers') {
      targetUsers = await User.find({ userType: 'worker' }).select('_id');
    } else if (targetAudience === 'clients') {
      targetUsers = await User.find({ userType: 'client' }).select('_id');
    } else {
      targetUsers = await User.find().select('_id');
    }

    // Create notifications for each target user
    const notifications = targetUsers.map(user => ({
      user: user._id,
      title,
      message,
      type: type || 'info',
      createdBy: req.user.id
    }));

    await Notification.insertMany(notifications);

    res.json({
      success: true,
      message: 'Notifications sent successfully',
      data: {
        recipientCount: targetUsers.length
      }
    });
  } catch (error) {
    console.error('Admin notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/admin/notifications
// @desc    Get admin sent notifications
// @access  Admin only
router.get('/notifications', async (req, res) => {
  try {
    // Mock data for admin notifications
    const notifications = [
      {
        _id: '1',
        title: 'Welcome to Workie.lk',
        message: 'Thank you for joining our platform.',
        type: 'info',
        createdAt: new Date(),
        recipients: 45,
        readCount: 32
      }
    ];

    res.json({
      success: true,
      data: { notifications }
    });
  } catch (error) {
    console.error('Admin get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============= WORKER VERIFICATION ENDPOINTS =============

// @route   GET /api/admin/workers/pending-verification
// @desc    Get all workers pending verification
// @access  Admin only
router.get('/workers/pending-verification', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Find workers with ID documents but not verified
    const query = {
      userType: 'worker',
      isVerified: false,
      'verificationDocuments.idPhotoFront': { $exists: true, $ne: '' },
      'verificationDocuments.idPhotoBack': { $exists: true, $ne: '' }
    };

    // Get all workers matching the query (without pagination first)
    const allWorkers = await User.find(query).select('-password');

    // Calculate average rating for each worker and filter by rating > 3
    const workersWithRatings = await Promise.all(
      allWorkers.map(async (worker) => {
        // Get worker's profile to fetch categories
        const profile = await Profile.findOne({ user: worker._id }).select('workerCategories');

        // Get ratings from Review collection (if any)
        const reviews = await Review.find({
          reviewee: worker._id,
          reviewType: 'client-to-worker'
        });

        // Get ratings from Application collection (embedded reviews)
        const applications = await Application.find({
          worker: worker._id,
          'review.rating': { $exists: true, $ne: null }
        });

        // Combine ratings from both sources
        const allRatings = [
          ...reviews.map(r => r.rating),
          ...applications.map(a => a.review.rating)
        ];

        const avgRating = allRatings.length > 0
          ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length
          : 0;
        const reviewCount = allRatings.length;

        return {
          ...worker.toObject(),
          avgRating: parseFloat(avgRating.toFixed(1)),
          reviewCount,
          profession: profile?.workerCategories?.join(', ') || 'No profession'
        };
      })
    );

    // Filter workers with average rating > 3 OR no reviews yet (new workers)
    const eligibleWorkers = workersWithRatings.filter(worker => {
      // If worker has reviews, rating must be > 3
      if (worker.reviewCount > 0) {
        return worker.avgRating > 3;
      }
      // If worker has no reviews yet, include them (give new workers a chance)
      return true;
    });

    // Sort by rating (highest first) and then by creation date
    eligibleWorkers.sort((a, b) => {
      if (b.avgRating !== a.avgRating) {
        return b.avgRating - a.avgRating;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Apply pagination to filtered results
    const total = eligibleWorkers.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const paginatedWorkers = eligibleWorkers.slice(skip, skip + limit);

    res.json({
      success: true,
      data: {
        workers: paginatedWorkers,
        totalPages,
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Admin pending verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/admin/workers/:id/verification-details
// @desc    Get worker verification details including ID photos and rating
// @access  Admin only
router.get('/workers/:id/verification-details', async (req, res) => {
  try {
    const worker = await User.findById(req.params.id).select('-password');

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    if (worker.userType !== 'worker') {
      return res.status(400).json({
        success: false,
        message: 'User is not a worker'
      });
    }

    // Get worker's profile to fetch categories
    const profile = await Profile.findOne({ user: worker._id }).select('workerCategories');

    // Get worker's reviews from Review collection
    const reviews = await Review.find({
      reviewee: worker._id,
      reviewType: 'client-to-worker'
    })
      .populate('reviewer', 'firstName lastName')
      .populate('job', 'title')
      .sort({ createdAt: -1 });

    // Get ratings from Application collection (embedded reviews)
    const applicationsWithReviews = await Application.find({
      worker: worker._id,
      'review.rating': { $exists: true, $ne: null }
    })
      .populate('job', 'title')
      .sort({ 'review.submittedAt': -1 });

    // Combine ratings from both sources
    const allRatings = [
      ...reviews.map(r => r.rating),
      ...applicationsWithReviews.map(a => a.review.rating)
    ];

    const avgRating = allRatings.length > 0
      ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length
      : 0;

    const reviewCount = allRatings.length;

    // Combine all reviews for display
    const combinedReviews = [
      ...reviews.map(r => ({
        rating: r.rating,
        comment: r.comment,
        reviewer: r.reviewer,
        job: r.job,
        createdAt: r.createdAt,
        source: 'review'
      })),
      ...applicationsWithReviews.map(a => ({
        rating: a.review.rating,
        comment: a.review.comment,
        job: a.job,
        createdAt: a.review.submittedAt || a.updatedAt,
        source: 'application'
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Get completed jobs count (using correct field name 'worker', not 'applicant')
    const completedJobs = await Application.countDocuments({
      worker: worker._id,
      status: { $in: ['completed', 'payment-released', 'payment-confirmed', 'reviewed', 'closed'] }
    });

    res.json({
      success: true,
      data: {
        worker: {
          ...worker.toObject(),
          profession: profile?.workerCategories?.join(', ') || 'No profession'
        },
        averageRating: parseFloat(avgRating.toFixed(1)),
        totalReviews: reviewCount,
        completedJobs,
        reviews: combinedReviews.slice(0, 10), // Latest 10 reviews
        verificationDocuments: {
          idPhotoFront: worker.verificationDocuments?.idPhotoFront,
          idPhotoBack: worker.verificationDocuments?.idPhotoBack
        }
      }
    });
  } catch (error) {
    console.error('Admin verification details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/admin/workers/:id/verify
// @desc    Verify a worker (approve verification)
// @access  Admin only
router.post('/workers/:id/verify', async (req, res) => {
  try {
    const { notes } = req.body;

    const worker = await User.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    if (worker.userType !== 'worker') {
      return res.status(400).json({
        success: false,
        message: 'User is not a worker'
      });
    }

    // Check if worker has uploaded ID documents
    if (!worker.verificationDocuments?.idPhotoFront || !worker.verificationDocuments?.idPhotoBack) {
      return res.status(400).json({
        success: false,
        message: 'Worker has not uploaded ID documents'
      });
    }

    // Get worker's average rating from BOTH Review collection and Application.review
    const reviews = await Review.find({
      reviewee: worker._id,
      reviewType: 'client-to-worker'
    });

    const applications = await Application.find({
      worker: worker._id,
      'review.rating': { $exists: true, $ne: null }
    });

    // Combine ratings from both sources
    const allRatings = [
      ...reviews.map(r => r.rating),
      ...applications.map(a => a.review.rating)
    ];

    const avgRating = allRatings.length > 0
      ? allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length
      : 0;
    const reviewCount = allRatings.length;

    // REQUIRE rating > 3.0 for verification (no exceptions)
    if (reviewCount === 0) {
      return res.status(400).json({
        success: false,
        message: 'Worker has no ratings yet. Cannot verify without customer reviews.',
        avgRating: 0,
        reviewCount: 0
      });
    }

    if (avgRating <= 3) {
      return res.status(400).json({
        success: false,
        message: `Insufficient rating for verification. Worker's rating (${avgRating.toFixed(1)}) must be greater than 3.0`,
        avgRating: avgRating.toFixed(1),
        reviewCount: reviewCount
      });
    }

    // Verify the worker
    worker.isVerified = true;
    await worker.save();

    // Create notification for the worker
    await Notification.create({
      recipient: worker._id,
      sender: req.user._id,
      title: '✅ Verification Approved!',
      message: `Congratulations! Your account has been verified. You can now display the verified badge on your profile.${notes ? ` Note: ${notes}` : ''}`,
      type: 'system_update'
    });

    res.json({
      success: true,
      message: 'Worker verified successfully',
      data: {
        worker: {
          _id: worker._id,
          firstName: worker.firstName,
          lastName: worker.lastName,
          email: worker.email,
          isVerified: worker.isVerified,
          avgRating: avgRating.toFixed(1),
          reviewCount: reviewCount
        }
      }
    });
  } catch (error) {
    console.error('Admin verify worker error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/admin/workers/:id/reject-verification
// @desc    Reject a worker's verification request
// @access  Admin only
router.post('/workers/:id/reject-verification', async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const worker = await User.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    if (worker.userType !== 'worker') {
      return res.status(400).json({
        success: false,
        message: 'User is not a worker'
      });
    }

    // Ensure worker remains unverified
    worker.isVerified = false;
    await worker.save();

    // Create notification for the worker
    await Notification.create({
      recipient: worker._id,
      sender: req.user._id,
      title: '❌ Verification Not Approved',
      message: `Your verification request has been reviewed. Reason: ${reason}. Please update your documents and resubmit.`,
      type: 'system_update'
    });

    res.json({
      success: true,
      message: 'Verification request rejected',
      data: {
        worker: {
          _id: worker._id,
          firstName: worker.firstName,
          lastName: worker.lastName,
          email: worker.email,
          isVerified: worker.isVerified
        }
      }
    });
  } catch (error) {
    console.error('Admin reject verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/admin/workers/:id/revoke-verification
// @desc    Revoke a worker's verification status
// @access  Admin only
router.post('/workers/:id/revoke-verification', async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Revocation reason is required'
      });
    }

    const worker = await User.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    if (worker.userType !== 'worker') {
      return res.status(400).json({
        success: false,
        message: 'User is not a worker'
      });
    }

    // Revoke verification
    worker.isVerified = false;
    await worker.save();

    // Create notification for the worker
    await Notification.create({
      recipient: worker._id,
      sender: req.user._id,
      title: '⚠️ Verification Revoked',
      message: `Your verification status has been revoked. Reason: ${reason}. Please contact support if you believe this is an error.`,
      type: 'system_update'
    });

    res.json({
      success: true,
      message: 'Worker verification revoked successfully',
      data: {
        worker: {
          _id: worker._id,
          firstName: worker.firstName,
          lastName: worker.lastName,
          email: worker.email,
          isVerified: worker.isVerified
        }
      }
    });
  } catch (error) {
    console.error('Admin revoke verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ==========================================
// COMPLAINT MANAGEMENT ROUTES
// ==========================================

// @route   GET /api/admin/complaints
// @desc    Get all complaints with filtering and pagination
// @access  Admin only
router.get('/complaints', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};

    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }

    if (req.query.priority && req.query.priority !== 'all') {
      filter.priority = req.query.priority;
    }

    if (req.query.reason && req.query.reason !== 'all') {
      filter.reason = req.query.reason;
    }

    if (req.query.contentType && req.query.contentType !== 'all') {
      filter['reportedContent.contentType'] = req.query.contentType;
    }

    // Search functionality
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      filter.$or = [
        { reason: searchRegex },
        { description: searchRegex },
        { customReason: searchRegex }
      ];
    }

    const complaints = await Complaint.find(filter)
      .populate('reporter', 'firstName lastName email profilePicture userType')
      .populate('reportedUser', 'firstName lastName email profilePicture userType')
      .populate('assignedTo', 'firstName lastName email')
      .populate('reportedContentDetails')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Complaint.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    // Get statistics
    const statistics = await Complaint.getStatistics();

    res.json({
      success: true,
      data: {
        complaints,
        pagination: {
          current: page,
          pages: totalPages,
          total
        },
        statistics
      }
    });
  } catch (error) {
    console.error('Admin get complaints error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/admin/complaints/:id
// @desc    Get complaint details
// @access  Admin only
router.get('/complaints/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('reporter', 'firstName lastName email profilePicture userType phone createdAt')
      .populate('reportedUser', 'firstName lastName email profilePicture userType phone createdAt')
      .populate('assignedTo', 'firstName lastName email profilePicture')
      .populate('reportedContentDetails')
      .populate('resolution.resolvedBy', 'firstName lastName email')
      .populate('adminNotes.admin', 'firstName lastName email');

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    res.json({
      success: true,
      data: {
        complaint
      }
    });
  } catch (error) {
    console.error('Admin get complaint details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/complaints/:id/status
// @desc    Update complaint status
// @access  Admin only
router.put('/complaints/:id/status', async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const validStatuses = ['pending', 'under-review', 'resolved', 'dismissed', 'escalated'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Update status
    complaint.status = status;

    if (status === 'under-review' && !complaint.assignedTo) {
      complaint.assignedTo = req.user.id;
    }

    if (['resolved', 'dismissed'].includes(status)) {
      complaint.reviewedAt = new Date();
      complaint.isResolved = true;
    }

    // Add admin note if provided
    if (adminNote && adminNote.trim()) {
      complaint.adminNotes.push({
        admin: req.user.id,
        note: adminNote.trim(),
        timestamp: new Date()
      });
    }

    await complaint.save();

    await complaint.populate([
      {
        path: 'reporter',
        select: 'firstName lastName email profilePicture'
      },
      {
        path: 'reportedUser',
        select: 'firstName lastName email profilePicture'
      },
      {
        path: 'assignedTo',
        select: 'firstName lastName email'
      }
    ]);

    res.json({
      success: true,
      message: 'Complaint status updated successfully',
      data: {
        complaint
      }
    });
  } catch (error) {
    console.error('Admin update complaint status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/complaints/:id/resolve
// @desc    Resolve complaint with action
// @access  Admin only
router.put('/complaints/:id/resolve', async (req, res) => {
  try {
    const { action, details } = req.body;

    const validActions = ['no-action', 'warning', 'content-removed', 'user-suspended', 'user-banned', 'other'];
    if (!validActions.includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid resolution action'
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Resolve the complaint
    await complaint.resolve(action, details, req.user.id);

    await complaint.populate([
      {
        path: 'reporter',
        select: 'firstName lastName email profilePicture'
      },
      {
        path: 'reportedUser',
        select: 'firstName lastName email profilePicture'
      },
      {
        path: 'resolution.resolvedBy',
        select: 'firstName lastName email'
      }
    ]);

    res.json({
      success: true,
      message: 'Complaint resolved successfully',
      data: {
        complaint
      }
    });
  } catch (error) {
    console.error('Admin resolve complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/admin/complaints/:id/assign
// @desc    Assign complaint to admin
// @access  Admin only
router.put('/complaints/:id/assign', async (req, res) => {
  try {
    const { adminId } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    // Verify the admin exists
    if (adminId) {
      const admin = await User.findById(adminId);
      if (!admin || admin.role !== 'admin') {
        return res.status(400).json({
          success: false,
          message: 'Invalid admin ID'
        });
      }
    }

    complaint.assignedTo = adminId || null;

    // Add note about assignment
    complaint.adminNotes.push({
      admin: req.user.id,
      note: adminId ? `Assigned to admin ${adminId}` : 'Assignment removed',
      timestamp: new Date()
    });

    await complaint.save();

    await complaint.populate('assignedTo', 'firstName lastName email profilePicture');

    res.json({
      success: true,
      message: adminId ? 'Complaint assigned successfully' : 'Assignment removed successfully',
      data: {
        complaint
      }
    });
  } catch (error) {
    console.error('Admin assign complaint error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/admin/complaints/:id/notes
// @desc    Add admin note to complaint
// @access  Admin only
router.post('/complaints/:id/notes', async (req, res) => {
  try {
    const { note } = req.body;

    if (!note || !note.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Note content is required'
      });
    }

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    complaint.adminNotes.push({
      admin: req.user.id,
      note: note.trim(),
      timestamp: new Date()
    });

    await complaint.save();

    await complaint.populate('adminNotes.admin', 'firstName lastName email profilePicture');

    res.json({
      success: true,
      message: 'Admin note added successfully',
      data: {
        complaint
      }
    });
  } catch (error) {
    console.error('Admin add note error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
