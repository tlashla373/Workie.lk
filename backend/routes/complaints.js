const express = require('express');
const Complaint = require('../models/Complaint');
const Post = require('../models/Post');
const User = require('../models/User');
const Job = require('../models/Job');
const Review = require('../models/Review');
const { auth } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/asyncHandler');

const router = express.Router();

// @route   POST /api/complaints
// @desc    Create a new complaint/report
// @access  Private
router.post('/', auth, asyncHandler(async (req, res) => {
    console.log('Complaint submission request body:', req.body);
    console.log('User making request:', req.user?.id);

    const {
        contentType,
        contentId,
        reportedUserId,
        reason,
        customReason,
        description,
        evidence
    } = req.body;

    // Validate required fields
    if (!contentType || !contentId || !reason) {
        console.log('Validation failed - missing basic fields:', { contentType, contentId, reason });
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: contentType, contentId, and reason are required',
            received: { contentType, contentId, reportedUserId, reason }
        });
    }

    // If reportedUserId is missing or is 'lookup_from_post', try to get it from the content
    let finalReportedUserId = reportedUserId;

    if (!reportedUserId || reportedUserId === 'lookup_from_post') {
        console.log('Attempting to lookup reportedUserId from content...');

        try {
            if (contentType === 'post') {
                const Post = require('../models/Post');
                const post = await Post.findById(contentId);
                if (post && post.userId) {
                    finalReportedUserId = post.userId.toString();
                    console.log('Found reportedUserId from post lookup:', finalReportedUserId);
                }
            } else if (contentType === 'job') {
                const Job = require('../models/Job');
                const job = await Job.findById(contentId);
                if (job && job.userId) {
                    finalReportedUserId = job.userId.toString();
                    console.log('Found reportedUserId from job lookup:', finalReportedUserId);
                }
            }
        } catch (lookupError) {
            console.error('Error looking up reportedUserId:', lookupError);
        }
    }

    if (!finalReportedUserId) {
        console.log('Final validation failed - no reportedUserId found:', { contentType, contentId, reportedUserId, finalReportedUserId });
        return res.status(400).json({
            success: false,
            message: 'Cannot determine the reported user. Please try again.',
            received: { contentType, contentId, reportedUserId }
        });
    }

    // Validate content type and get the appropriate model
    let contentModel;
    switch (contentType) {
        case 'post':
            contentModel = 'Post';
            break;
        case 'user':
            contentModel = 'User';
            break;
        case 'job':
            contentModel = 'Job';
            break;
        case 'review':
            contentModel = 'Review';
            break;
        case 'message':
            contentModel = 'Message';
            break;
        default:
            return res.status(400).json({
                success: false,
                message: 'Invalid content type'
            });
    }

    // Check if the content exists
    let contentExists = false;
    try {
        switch (contentType) {
            case 'post':
                contentExists = await Post.findById(contentId);
                break;
            case 'user':
                contentExists = await User.findById(contentId);
                break;
            case 'job':
                contentExists = await Job.findById(contentId);
                break;
            case 'review':
                contentExists = await Review.findById(contentId);
                break;
            // Add more cases as needed
        }

        if (!contentExists) {
            return res.status(404).json({
                success: false,
                message: 'Reported content not found'
            });
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: 'Invalid content ID'
        });
    }

    // Check if user already reported this content
    const existingComplaint = await Complaint.findOne({
        reporter: req.user.id,
        'reportedContent.contentType': contentType,
        'reportedContent.contentId': contentId,
        status: { $in: ['pending', 'under-review'] }
    });

    if (existingComplaint) {
        return res.status(400).json({
            success: false,
            message: 'You have already reported this content'
        });
    }

    // Get reporter info
    const reporterInfo = {
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        deviceInfo: req.get('X-Device-Info') || 'Unknown'
    };

    // Create the complaint
    const complaint = new Complaint({
        reporter: req.user.id,
        reportedContent: {
            contentType,
            contentId,
            contentModel
        },
        reportedUser: finalReportedUserId,
        reason,
        customReason: reason === 'other' ? customReason : undefined,
        description,
        evidence: evidence || [],
        reporterInfo
    });

    await complaint.save();

    // Populate the complaint for response
    await complaint.populate([
        {
            path: 'reporter',
            select: 'firstName lastName email profilePicture'
        },
        {
            path: 'reportedUser',
            select: 'firstName lastName email profilePicture'
        }
    ]);

    res.status(201).json({
        success: true,
        message: 'Report submitted successfully',
        data: {
            complaint
        }
    });
}));

// @route   GET /api/complaints
// @desc    Get user's complaints
// @access  Private
router.get('/', auth, asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { reporter: req.user.id };

    // Add status filter if provided
    if (req.query.status && req.query.status !== 'all') {
        filter.status = req.query.status;
    }

    const complaints = await Complaint.find(filter)
        .populate('reportedUser', 'firstName lastName email profilePicture')
        .populate('reportedContentDetails')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

    const total = await Complaint.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
        success: true,
        data: {
            complaints,
            pagination: {
                current: page,
                pages: totalPages,
                total
            }
        }
    });
}));

// @route   GET /api/complaints/:id
// @desc    Get complaint details
// @access  Private
router.get('/:id', auth, asyncHandler(async (req, res) => {
    const complaint = await Complaint.findById(req.params.id)
        .populate('reporter', 'firstName lastName email profilePicture')
        .populate('reportedUser', 'firstName lastName email profilePicture')
        .populate('reportedContentDetails')
        .populate('assignedTo', 'firstName lastName email')
        .populate('resolution.resolvedBy', 'firstName lastName email');

    if (!complaint) {
        return res.status(404).json({
            success: false,
            message: 'Complaint not found'
        });
    }

    // Check if user has permission to view this complaint
    if (complaint.reporter.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied'
        });
    }

    res.json({
        success: true,
        data: {
            complaint
        }
    });
}));

// @route   PUT /api/complaints/:id
// @desc    Update complaint (add evidence or notes)
// @access  Private
router.put('/:id', auth, asyncHandler(async (req, res) => {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
        return res.status(404).json({
            success: false,
            message: 'Complaint not found'
        });
    }

    // Check if user has permission to update this complaint
    if (complaint.reporter.toString() !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: 'Access denied'
        });
    }

    // Only allow updates if complaint is still pending or under review
    if (!['pending', 'under-review'].includes(complaint.status)) {
        return res.status(400).json({
            success: false,
            message: 'Cannot update resolved or dismissed complaints'
        });
    }

    const { description, evidence } = req.body;

    if (description !== undefined) {
        complaint.description = description;
    }

    if (evidence && Array.isArray(evidence)) {
        complaint.evidence.push(...evidence);
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
        }
    ]);

    res.json({
        success: true,
        message: 'Complaint updated successfully',
        data: {
            complaint
        }
    });
}));

// @route   DELETE /api/complaints/:id  
// @desc    Withdraw/cancel a complaint
// @access  Private
router.delete('/:id', auth, asyncHandler(async (req, res) => {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
        return res.status(404).json({
            success: false,
            message: 'Complaint not found'
        });
    }

    // Check if user has permission to delete this complaint
    if (complaint.reporter.toString() !== req.user.id) {
        return res.status(403).json({
            success: false,
            message: 'Access denied'
        });
    }

    // Only allow deletion if complaint is still pending
    if (complaint.status !== 'pending') {
        return res.status(400).json({
            success: false,
            message: 'Cannot withdraw complaint that is already under review or resolved'
        });
    }

    await complaint.deleteOne();

    res.json({
        success: true,
        message: 'Complaint withdrawn successfully'
    });
}));

module.exports = router;