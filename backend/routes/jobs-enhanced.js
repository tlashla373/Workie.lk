const express = require('express');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Review = require('../models/Review');
const { auth, authorize } = require('../middleware/auth');
const { validateJob } = require('../middleware/validation');

const router = express.Router();

// Enhanced job search with advanced filtering
router.get('/search', async (req, res) => {
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
      radius = 10
    } = req.query;

    const filter = { isActive: true };

    // Text search across multiple fields
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Location filter
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
    if (status) {
      filter.status = status;
    }

    // Execute query
    const jobs = await Job.find(filter)
      .populate('client', 'firstName lastName profilePicture')
      .populate('assignedWorker', 'firstName lastName profilePicture')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Job.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        jobs,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Advanced job search with geospatial filtering
router.get('/advanced-search', async (req, res) => {
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
      radius = 10
    } = req.query;

    const filter = { isActive: true };

    // Text search across multiple fields
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Location filter
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
    if (status) {
      filter.status = status;
    }

    // Execute query
    const jobs = await Job.find(filter)
      .populate('client', 'firstName lastName profilePicture')
      .populate('assignedWorker', 'firstName lastName profilePicture')
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Job.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        jobs,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
