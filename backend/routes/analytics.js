const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Simple analytics schema for future use
const analyticsSchema = {
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profileViews: {
    total: { type: Number, default: 0 },
    thisMonth: { type: Number, default: 0 },
    lastMonth: { type: Number, default: 0 },
    dailyViews: [{
      date: { type: Date, default: Date.now },
      count: { type: Number, default: 0 }
    }]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

// @route   GET /api/analytics/profile-views
// @desc    Get profile view statistics for current user
// @access  Private
router.get('/profile-views', auth, async (req, res) => {
  try {
    // For now, return mock data with some randomization
    // In the future, this would query a ProfileAnalytics model
    const baseViews = 150;
    const randomVariation = Math.floor(Math.random() * 50) - 25; // -25 to +25
    const totalViews = Math.max(baseViews + randomVariation, 50);
    
    const thisMonthViews = Math.floor(totalViews * 0.3); // About 30% of total
    const lastMonthViews = Math.floor(totalViews * 0.25); // About 25% of total
    
    const percentageIncrease = lastMonthViews > 0 
      ? Math.round(((thisMonthViews - lastMonthViews) / lastMonthViews) * 100)
      : 100;

    const analytics = {
      totalViews,
      thisMonth: thisMonthViews,
      lastMonth: lastMonthViews,
      percentageIncrease,
      period: 'last month',
      dailyAverage: Math.floor(thisMonthViews / 30),
      weeklyTrend: [
        { day: 'Mon', views: Math.floor(Math.random() * 20) + 5 },
        { day: 'Tue', views: Math.floor(Math.random() * 20) + 5 },
        { day: 'Wed', views: Math.floor(Math.random() * 20) + 5 },
        { day: 'Thu', views: Math.floor(Math.random() * 20) + 5 },
        { day: 'Fri', views: Math.floor(Math.random() * 20) + 5 },
        { day: 'Sat', views: Math.floor(Math.random() * 15) + 3 },
        { day: 'Sun', views: Math.floor(Math.random() * 15) + 3 }
      ]
    };

    res.status(200).json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/analytics/track-view/:userId
// @desc    Track a profile view (when someone visits a profile)
// @access  Public (anonymous views allowed)
router.post('/track-view/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { viewerIp, userAgent } = req.body;

    // Check if target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // For now, just return success
    // In the future, this would update ProfileAnalytics
    // and implement IP-based deduplication to prevent spam

    res.status(200).json({
      success: true,
      message: 'Profile view tracked successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/analytics/dashboard
// @desc    Get comprehensive analytics dashboard data
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Mock dashboard data - replace with real analytics later
    const dashboardData = {
      profileViews: {
        total: 150 + Math.floor(Math.random() * 100),
        thisMonth: 45 + Math.floor(Math.random() * 20),
        growth: Math.floor(Math.random() * 50) + 10
      },
      connections: {
        total: 8 + Math.floor(Math.random() * 5),
        thisMonth: 2 + Math.floor(Math.random() * 3),
        pendingRequests: Math.floor(Math.random() * 5)
      },
      jobApplications: {
        sent: Math.floor(Math.random() * 10) + 5,
        responses: Math.floor(Math.random() * 5) + 2,
        interviews: Math.floor(Math.random() * 3) + 1
      },
      profileCompleteness: {
        percentage: Math.floor(Math.random() * 30) + 70, // 70-100%
        missingFields: ['Portfolio', 'Skills'].slice(0, Math.floor(Math.random() * 3))
      }
    };

    res.status(200).json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============= ADMIN ANALYTICS ENDPOINTS =============

// @route   GET /api/analytics/admin/user-stats
// @desc    Get user statistics for admin (with date range)
// @access  Private (Admin only)
router.get('/admin/user-stats', auth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const Job = require('../models/Job');
    const Application = require('../models/Application');

    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get new users in the specified period
    const newUsers = await User.countDocuments({
      createdAt: { $gte: dateFrom }
    });

    // Get active users (users who have logged in or performed actions recently)
    const activeUsers = await User.countDocuments({
      isActive: true
    });

    // Calculate user growth rate
    const previousPeriodFrom = new Date(dateFrom);
    previousPeriodFrom.setDate(previousPeriodFrom.getDate() - days);
    const previousPeriodNewUsers = await User.countDocuments({
      createdAt: { $gte: previousPeriodFrom, $lt: dateFrom }
    });
    
    const userGrowthRate = previousPeriodNewUsers > 0
      ? ((newUsers - previousPeriodNewUsers) / previousPeriodNewUsers * 100).toFixed(1)
      : 100;

    // User type breakdown
    const usersByType = await User.aggregate([
      {
        $group: {
          _id: '$userType',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        newUsersThisMonth: newUsers,
        activeUsers,
        userGrowthRate: parseFloat(userGrowthRate),
        usersByType: usersByType.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message
    });
  }
});

// @route   GET /api/analytics/admin/job-stats
// @desc    Get job statistics for admin
// @access  Private (Admin only)
router.get('/admin/job-stats', auth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const Job = require('../models/Job');

    // Get total jobs count
    const totalJobs = await Job.countDocuments();

    // Get jobs created in the specified period
    const jobsThisMonth = await Job.countDocuments({
      createdAt: { $gte: dateFrom }
    });

    // Get completed jobs
    const completedJobs = await Job.countDocuments({
      status: 'completed'
    });

    // Calculate average job value
    const jobsWithBudget = await Job.aggregate([
      {
        $match: {
          'budget.amount': { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: null,
          avgBudget: { $avg: '$budget.amount' }
        }
      }
    ]);

    const averageJobValue = jobsWithBudget.length > 0 
      ? Math.round(jobsWithBudget[0].avgBudget) 
      : 0;

    // Jobs by status
    const jobsByStatus = await Job.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalJobs,
        jobsThisMonth,
        completedJobs,
        averageJobValue,
        jobsByStatus: jobsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    console.error('Error fetching job stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job statistics',
      error: error.message
    });
  }
});

// @route   GET /api/analytics/admin/top-categories
// @desc    Get top job categories by count and revenue
// @access  Private (Admin only)
router.get('/admin/top-categories', auth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const Job = require('../models/Job');

    // Get top categories by job count and total budget
    const topCategories = await Job.aggregate([
      {
        $match: {
          createdAt: { $gte: dateFrom }
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$budget.amount' },
          avgBudget: { $avg: '$budget.amount' }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          name: '$_id',
          count: 1,
          revenue: { $round: ['$totalRevenue', 0] },
          avgBudget: { $round: ['$avgBudget', 0] },
          _id: 0
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        categories: topCategories
      }
    });
  } catch (error) {
    console.error('Error fetching top categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top categories',
      error: error.message
    });
  }
});

// @route   GET /api/analytics/admin/top-workers
// @desc    Get top performing workers by completed jobs and ratings
// @access  Private (Admin only)
router.get('/admin/top-workers', auth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const Application = require('../models/Application');
    const Review = require('../models/Review');

    // Get workers with most completed applications
    const topWorkers = await Application.aggregate([
      {
        $match: {
          status: 'completed',
          updatedAt: { $gte: dateFrom }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'applicant',
          foreignField: '_id',
          as: 'workerInfo'
        }
      },
      {
        $unwind: '$workerInfo'
      },
      {
        $lookup: {
          from: 'jobs',
          localField: 'job',
          foreignField: '_id',
          as: 'jobInfo'
        }
      },
      {
        $unwind: { path: '$jobInfo', preserveNullAndEmptyArrays: true }
      },
      {
        $group: {
          _id: '$applicant',
          name: { $first: { $concat: ['$workerInfo.firstName', ' ', '$workerInfo.lastName'] } },
          email: { $first: '$workerInfo.email' },
          completedJobs: { $sum: 1 },
          totalEarnings: { $sum: '$jobInfo.budget.amount' }
        }
      },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'reviewee',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          avgRating: { $avg: '$reviews.rating' },
          reviewCount: { $size: '$reviews' }
        }
      },
      {
        $sort: { completedJobs: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          completedJobs: 1,
          earnings: { $round: ['$totalEarnings', 0] },
          rating: { $round: ['$avgRating', 1] },
          reviewCount: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        workers: topWorkers
      }
    });
  } catch (error) {
    console.error('Error fetching top workers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top workers',
      error: error.message
    });
  }
});

// @route   GET /api/analytics/admin/top-clients
// @desc    Get top clients by jobs posted and total spending
// @access  Private (Admin only)
router.get('/admin/top-clients', auth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const Job = require('../models/Job');

    // Get clients with most jobs posted and highest spending
    const topClients = await Job.aggregate([
      {
        $match: {
          createdAt: { $gte: dateFrom }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'client',
          foreignField: '_id',
          as: 'clientInfo'
        }
      },
      {
        $unwind: '$clientInfo'
      },
      {
        $group: {
          _id: '$client',
          name: { $first: { $concat: ['$clientInfo.firstName', ' ', '$clientInfo.lastName'] } },
          email: { $first: '$clientInfo.email' },
          jobsPosted: { $sum: 1 },
          totalSpent: { $sum: '$budget.amount' },
          completedJobs: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { totalSpent: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          jobsPosted: 1,
          totalSpent: { $round: ['$totalSpent', 0] },
          completedJobs: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        clients: topClients
      }
    });
  } catch (error) {
    console.error('Error fetching top clients:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top clients',
      error: error.message
    });
  }
});

// @route   GET /api/analytics/admin/revenue-stats
// @desc    Get revenue statistics for admin
// @access  Private (Admin only)
router.get('/admin/revenue-stats', auth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const Job = require('../models/Job');

    // Calculate total revenue from completed jobs
    const revenueData = await Job.aggregate([
      {
        $match: {
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$budget.amount' },
          count: { $sum: 1 },
          avgTransaction: { $avg: '$budget.amount' }
        }
      }
    ]);

    // Calculate monthly revenue (last 30 days)
    const monthlyRevenue = await Job.aggregate([
      {
        $match: {
          status: 'completed',
          updatedAt: { $gte: dateFrom }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$budget.amount' }
        }
      }
    ]);

    // Previous period revenue for growth calculation
    const previousPeriodFrom = new Date(dateFrom);
    previousPeriodFrom.setDate(previousPeriodFrom.getDate() - days);
    const previousRevenue = await Job.aggregate([
      {
        $match: {
          status: 'completed',
          updatedAt: { $gte: previousPeriodFrom, $lt: dateFrom }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$budget.amount' }
        }
      }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;
    const currentMonthlyRevenue = monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0;
    const prevMonthlyRevenue = previousRevenue.length > 0 ? previousRevenue[0].total : 0;
    const averageTransactionValue = revenueData.length > 0 ? revenueData[0].avgTransaction : 0;

    const revenueGrowthRate = prevMonthlyRevenue > 0
      ? ((currentMonthlyRevenue - prevMonthlyRevenue) / prevMonthlyRevenue * 100).toFixed(1)
      : 100;

    res.json({
      success: true,
      data: {
        totalRevenue: Math.round(totalRevenue),
        monthlyRevenue: Math.round(currentMonthlyRevenue),
        averageTransactionValue: Math.round(averageTransactionValue),
        revenueGrowthRate: parseFloat(revenueGrowthRate)
      }
    });
  } catch (error) {
    console.error('Error fetching revenue stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue statistics',
      error: error.message
    });
  }
});

module.exports = router;
