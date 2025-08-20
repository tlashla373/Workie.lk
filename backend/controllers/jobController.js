const Job = require('../models/Job');
const Application = require('../models/Application');
const Review = require('../models/Review');
const User = require('../models/User');

class JobController {
  // Advanced job search with multiple filters
  async searchJobs(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        category,
        city,
        minBudget,
        maxBudget,
        status = 'open',
        urgency,
        experienceLevel,
        isRemote,
        skills,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        datePosted,
        coordinates,
        radius = 10, // km
        excludeAssigned = false
      } = req.query;

      // Build complex filter
      const filter = { isActive: true };
      
      // Text search across multiple fields
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { skills: { $in: [new RegExp(search, 'i')] } },
          { requirements: { $in: [new RegExp(search, 'i')] } }
        ];
      }

      // Category filter
      if (category && category !== 'all') {
        filter.category = category;
      }

      // Location filters
      if (city) {
        filter['location.city'] = { $regex: city, $options: 'i' };
      }

      // Budget range
      if (minBudget || maxBudget) {
        filter['budget.amount'] = {};
        if (minBudget) filter['budget.amount'].$gte = parseFloat(minBudget);
        if (maxBudget) filter['budget.amount'].$lte = parseFloat(maxBudget);
      }

      // Status filter
      if (status && status !== 'all') {
        filter.status = status;
      }

      // Additional filters
      if (urgency) filter.urgency = urgency;
      if (experienceLevel) filter.experienceLevel = experienceLevel;
      if (isRemote !== undefined) filter.isRemote = isRemote === 'true';
      if (skills) {
        const skillArray = skills.split(',').map(skill => skill.trim());
        filter.skills = { $in: skillArray };
      }

      // Exclude assigned jobs
      if (excludeAssigned === 'true') {
        filter.assignedWorker = { $exists: false };
      }

      // Date filter
      if (datePosted) {
        const date = new Date();
        switch (datePosted) {
          case 'today':
            date.setDate(date.getDate() - 1);
            break;
          case 'week':
            date.setDate(date.getDate() - 7);
            break;
          case 'month':
            date.setMonth(date.getMonth() - 1);
            break;
          case '3months':
            date.setMonth(date.getMonth() - 3);
            break;
        }
        filter.createdAt = { $gte: date };
      }

      // Geospatial search
      if (coordinates && radius) {
        const [lng, lat] = coordinates.split(',').map(coord => parseFloat(coord));
        filter['location.coordinates'] = {
          $geoWithin: {
            $centerSphere: [[lng, lat], radius / 6378.1] // Convert km to radians
          }
        };
      }

      // Pagination
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);
      const skip = (pageNum - 1) * limitNum;

      // Sort options
      const sortOptions = {};
      const validSortFields = ['createdAt', 'updatedAt', 'budget.amount', 'applicationsCount', 'deadline'];
      if (validSortFields.includes(sortBy)) {
        sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
      } else {
        sortOptions.createdAt = -1;
      }

      // Execute query with population
      const jobs = await Job.find(filter)
        .populate('client', 'firstName lastName profilePicture ratings')
        .populate('assignedWorker', 'firstName lastName profilePicture ratings')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum);

      // Get total count
      const total = await Job.countDocuments(filter);

      // Get additional stats
      const stats = await this.getJobStats(filter);

      res.status(200).json({
        success: true,
        data: {
          jobs,
          pagination: {
            current: pageNum,
            pages: Math.ceil(total / limitNum),
            total,
            limit: limitNum
          },
          stats
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // Get job statistics
  async getJobStats(filter = {}) {
    try {
      const stats = await Job.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            totalJobs: { $sum: 1 },
            avgBudget: { $avg: '$budget.amount' },
            minBudget: { $min: '$budget.amount' },
            maxBudget: { $max: '$budget.amount' },
            statusCounts: {
              $push: '$status'
            },
            categoryCounts: {
              $push: '$category'
            }
          }
        },
        {
          $project: {
            _id: 0,
            totalJobs: 1,
            avgBudget: { $round: ['$avgBudget', 2] },
            minBudget: 1,
            maxBudget: 1,
            statusDistribution: {
              open: { $size: { $filter: { input: '$statusCounts', cond: { $eq: ['$$this', 'open'] } } } },
              inProgress: { $size: { $filter: { input: '$statusCounts', cond: { $eq: ['$$this', 'in-progress'] } } } },
              completed: { $size: { $filter: { input: '$statusCounts', cond: { $eq: ['$$this', 'completed'] } } } }
            },
            topCategories: {
              $slice: [
                {
                  $map: {
                    input: { $setUnion: ['$categoryCounts'] },
                    as: 'category',
                    in: {
                      category: '$$category',
                      count: {
                        $size: {
                          $filter: {
                            input: '$categoryCounts',
                            cond: { $eq: ['$$this', '$$category'] }
                          }
                        }
                      }
                    }
                  }
                },
                5
              ]
            }
          }
        }
      ]);

      return stats.length > 0 ? stats[0] : {
        totalJobs: 0,
        avgBudget: 0,
        minBudget: 0,
        maxBudget: 0,
        statusDistribution: {},
        topCategories: []
      };
    } catch (error) {
      throw error;
    }
  }

  // Get job recommendations for workers
  async getJobRecommendations(req, res) {
    try {
      const { skills, location, budgetRange } = req.query;
      
      // Get worker's profile data
      const worker = await User.findById(req.user._id).populate('profile');
      
      if (!worker || worker.userType !== 'worker') {
        return res.status(400).json({
          success: false,
          message: 'Only workers can get job recommendations'
        });
      }

      // Build recommendation query
      const filter = {
        status: 'open',
        isActive: true,
        assignedWorker: { $exists: false }
      };

      // Skill-based matching
      if (worker.profile && worker.profile.skills && worker.profile.skills.length > 0) {
        filter.skills = { $in: worker.profile.skills };
      }

      // Location-based matching
      if (location) {
        filter['location.city'] = { $regex: location, $options: 'i' };
      }

      // Budget-based matching
      if (budgetRange) {
        const [min, max] = budgetRange.split('-').map(b => parseFloat(b));
        filter['budget.amount'] = { $gte: min, $lte: max };
      }

      // Get recommendations with scoring
      const recommendations = await Job.find(filter)
        .populate('client', 'firstName lastName profilePicture ratings')
        .sort({ createdAt: -1, 'budget.amount': -1 })
        .limit(10);

      // Calculate match score
      const scoredRecommendations = recommendations.map(job => {
        let score = 0;
        
        // Skill match score
        if (worker.profile && worker.profile.skills) {
          const skillMatches = job.skills.filter(skill => 
            worker.profile.skills.includes(skill)
          ).length;
          score += skillMatches * 10;
        }

        // Budget match score
        if (worker.profile && worker.profile.ratings) {
          const avgRating = worker.profile.ratings.average || 0;
          const budgetRatio = job.budget.amount / (avgRating * 1000);
          score += Math.max(0, 20 - budgetRatio * 10);
        }

        return {
          ...job.toObject(),
          matchScore: Math.min(score, 100)
        };
      });

      res.status(200).json({
        success: true,
        data: scoredRecommendations
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // Get job analytics for dashboard
  async getJobAnalytics(req, res) {
    try {
      const { timeframe = '30days' } = req.query;
      
      let dateFilter = {};
      const date = new Date();
      
      switch (timeframe) {
        case '7days':
          date.setDate(date.getDate() - 7);
          break;
        case '30days':
          date.setDate(date.getDate() - 30);
          break;
        case '90days':
          date.setDate(date.getDate() - 90);
          break;
        case 'year':
          date.setFullYear(date.getFullYear() - 1);
          break;
      }
      
      dateFilter.createdAt = { $gte: date };

      const analytics = await Job.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            jobsPosted: { $sum: 1 },
            jobsCompleted: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            totalBudget: { $sum: '$budget.amount' },
            avgBudget: { $avg: '$budget.amount' }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]);

      // Get category analytics
      const categoryAnalytics = await Job.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            avgBudget: { $avg: '$budget.amount' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      res.status(200).json({
        success: true,
        data: {
          timeline: analytics,
          categories: categoryAnalytics
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }

  // Bulk job operations
  async bulkUpdateJobStatus(req, res) {
    try {
      const { jobIds, status } = req.body;

      if (!Array.isArray(jobIds) || jobIds.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Job IDs array is required'
        });
      }

      const validStatuses = ['open', 'in-progress', 'completed', 'cancelled', 'paused'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status'
        });
      }

      const result = await Job.updateMany(
        { _id: { $in: jobIds }, client: req.user._id },
        { status }
      );

      res.status(200).json({
        success: true,
        message: `${result.modifiedCount} jobs updated successfully`,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  }
}

module.exports = new JobController();
