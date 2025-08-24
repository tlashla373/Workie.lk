const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Connection/Friend model schema for future use
const connectionSchema = {
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'blocked'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};

// @route   GET /api/connections/my-connections
// @desc    Get current user's connections (friends)
// @access  Private
router.get('/my-connections', auth, async (req, res) => {
  try {
    // For now, return mock data until we implement full connection system
    // In the future, this would query a Connection/Friend model
    const mockConnections = [
      {
        _id: '507f1f77bcf86cd799439011',
        firstName: 'John',
        lastName: 'Doe',
        profilePicture: 'https://via.placeholder.com/150',
        userType: 'worker',
        status: 'accepted',
        connectionDate: new Date('2024-01-15')
      },
      {
        _id: '507f1f77bcf86cd799439012',
        firstName: 'Jane',
        lastName: 'Smith',
        profilePicture: 'https://via.placeholder.com/150',
        userType: 'client',
        status: 'accepted',
        connectionDate: new Date('2024-01-20')
      },
      {
        _id: '507f1f77bcf86cd799439013',
        firstName: 'Mike',
        lastName: 'Johnson',
        profilePicture: 'https://via.placeholder.com/150',
        userType: 'worker',
        status: 'accepted',
        connectionDate: new Date('2024-01-25')
      },
      {
        _id: '507f1f77bcf86cd799439014',
        firstName: 'Sarah',
        lastName: 'Wilson',
        profilePicture: 'https://via.placeholder.com/150',
        userType: 'client',
        status: 'accepted',
        connectionDate: new Date('2024-02-01')
      },
      {
        _id: '507f1f77bcf86cd799439015',
        firstName: 'David',
        lastName: 'Brown',
        profilePicture: 'https://via.placeholder.com/150',
        userType: 'worker',
        status: 'accepted',
        connectionDate: new Date('2024-02-05')
      },
      {
        _id: '507f1f77bcf86cd799439016',
        firstName: 'Emily',
        lastName: 'Davis',
        profilePicture: 'https://via.placeholder.com/150',
        userType: 'client',
        status: 'accepted',
        connectionDate: new Date('2024-02-10')
      },
      {
        _id: '507f1f77bcf86cd799439017',
        firstName: 'Chris',
        lastName: 'Miller',
        profilePicture: 'https://via.placeholder.com/150',
        userType: 'worker',
        status: 'accepted',
        connectionDate: new Date('2024-02-15')
      },
      {
        _id: '507f1f77bcf86cd799439018',
        firstName: 'Lisa',
        lastName: 'Anderson',
        profilePicture: 'https://via.placeholder.com/150',
        userType: 'client',
        status: 'accepted',
        connectionDate: new Date('2024-02-20')
      }
    ];

    res.status(200).json({
      success: true,
      data: {
        connections: mockConnections,
        totalCount: mockConnections.length
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

// @route   GET /api/connections/stats
// @desc    Get connection statistics for current user
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    // For now, return mock statistics
    const stats = {
      totalConnections: 8,
      pendingRequests: 2,
      sentRequests: 1,
      profileViews: 150,
      profileViewsThisMonth: 35,
      profileViewsIncrease: 25.5
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/connections/send-request
// @desc    Send connection request to another user
// @access  Private
router.post('/send-request', auth, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send connection request to yourself'
      });
    }

    // Check if target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // For now, just return success message
    // In the future, this would create a Connection document
    res.status(200).json({
      success: true,
      message: 'Connection request sent successfully',
      data: {
        recipient: {
          _id: targetUser._id,
          firstName: targetUser.firstName,
          lastName: targetUser.lastName,
          profilePicture: targetUser.profilePicture
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

// @route   PUT /api/connections/respond/:connectionId
// @desc    Respond to connection request (accept/reject)
// @access  Private
router.put('/respond/:connectionId', auth, async (req, res) => {
  try {
    const { action } = req.body; // 'accept' or 'reject'

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be accept or reject'
      });
    }

    // For now, just return success message
    // In the future, this would update the Connection document
    res.status(200).json({
      success: true,
      message: `Connection request ${action}ed successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/connections/:connectionId
// @desc    Remove/block connection
// @access  Private
router.delete('/:connectionId', auth, async (req, res) => {
  try {
    // For now, just return success message
    // In the future, this would delete or update the Connection document
    res.status(200).json({
      success: true,
      message: 'Connection removed successfully'
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
