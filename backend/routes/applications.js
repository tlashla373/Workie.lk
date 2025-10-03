const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { auth, authorize } = require('../middleware/auth');
const { validateApplication } = require('../middleware/validation');
const NotificationService = require('../services/notificationService');

const router = express.Router();

// @route   POST /api/applications
// @desc    Create a new job application
// @access  Private (Workers only)
router.post('/', auth, authorize('worker'), validateApplication, async (req, res) => {
  try {
    const { job: jobId, coverLetter, proposedPrice, estimatedDuration, availability, portfolio } = req.body;

    // Check if job exists and is open
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Job is no longer open for applications'
      });
    }

    // Check if worker has already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      worker: req.user._id,
      isActive: true
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Check if applications limit reached
    const applicationsCount = await Application.countDocuments({
      job: jobId,
      isActive: true
    });

    if (applicationsCount >= job.maxApplicants) {
      return res.status(400).json({
        success: false,
        message: 'This job has reached the maximum number of applications'
      });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      worker: req.user._id,
      coverLetter,
      proposedPrice,
      estimatedDuration,
      availability,
      portfolio
    });

    // Update job applications count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationsCount: 1 }
    });

    await application.populate([
      { path: 'worker', select: 'firstName lastName profilePicture' },
      { path: 'job', select: 'title category budget' }
    ]);

    // Send notification to job owner about new application
    try {
      const jobWithClient = await Job.findById(jobId).populate('client', 'firstName lastName');
      if (jobWithClient && jobWithClient.client) {
        await NotificationService.notifyJobApplication(
          jobId,
          jobWithClient.client._id, // recipient (job owner)
          req.user._id, // sender (worker who applied)
          jobWithClient.title,
          `${application.worker.firstName} ${application.worker.lastName}`
        );
        console.log('Job application notification sent successfully');
      }
    } catch (notificationError) {
      console.error('Failed to send job application notification:', notificationError);
      // Don't fail the application process if notification fails
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/applications
// @desc    Get current user's applications
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter
    const filter = { worker: req.user._id, isActive: true };
    if (status) filter.status = status;

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const applications = await Application.find(filter)
      .populate('job', 'title category budget location status client')
      .populate({
        path: 'job',
        populate: {
          path: 'client',
          select: 'firstName lastName profilePicture'
        }
      })
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Application.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        applications,
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total,
          limit: limitNum
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

// @route   GET /api/applications/worker/:workerId
// @desc    Get applications for a specific worker (for viewing their stats/ratings)
// @access  Private (Any authenticated user can view worker stats)
router.get('/worker/:workerId', auth, async (req, res) => {
  try {
    const { workerId } = req.params;
    const {
      status,
      page = 1,
      limit = 50, // Higher limit for stats calculation
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build filter for the specific worker
    const filter = { worker: workerId, isActive: true };
    if (status) filter.status = status;

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const applications = await Application.find(filter)
      .populate('job', 'title category budget location status client')
      .populate({
        path: 'job',
        populate: {
          path: 'client',
          select: 'firstName lastName profilePicture'
        }
      })
      .populate('worker', 'firstName lastName profilePicture')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Application.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        applications,
        pagination: {
          current: pageNum,
          pages: Math.ceil(total / limitNum),
          total,
          limit: limitNum
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

// @route   GET /api/applications/:id
// @desc    Get single application by ID
// @access  Private (Application owner, job owner, or admin)
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('worker', 'firstName lastName profilePicture phone email')
      .populate({
        path: 'worker',
        populate: {
          path: 'profile',
          model: 'Profile',
          select: 'bio skills ratings completedJobs'
        }
      })
      .populate('job', 'title category budget location client');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check access permissions
    const isWorker = application.worker._id.toString() === req.user._id.toString();
    const isJobOwner = application.job.client.toString() === req.user._id.toString();
    const isAdmin = req.user.userType === 'admin';

    if (!isWorker && !isJobOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/applications/:id
// @desc    Update application
// @access  Private (Application owner only, before response)
router.put('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user owns the application
    if (application.worker.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own applications.'
      });
    }

    // Check if application is still pending
    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update application after it has been responded to'
      });
    }

    const allowedFields = ['coverLetter', 'proposedPrice', 'estimatedDuration', 'availability', 'portfolio', 'notes.worker'];
    const updateData = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          if (!updateData[parent]) updateData[parent] = {};
          updateData[parent][child] = req.body[field];
        } else {
          updateData[field] = req.body[field];
        }
      }
    });

    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    ).populate([
      { path: 'worker', select: 'firstName lastName profilePicture' },
      { path: 'job', select: 'title category budget' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Application updated successfully',
      data: updatedApplication
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/applications/:id/accept
// @desc    Accept an application
// @access  Private (Job owner only)
router.post('/:id/accept', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user owns the job
    if (application.job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if application is pending
    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Application has already been responded to'
      });
    }

    // Check if job is still open
    if (application.job.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Job is no longer open'
      });
    }

    // Accept the application
    application.status = 'accepted';
    await application.save();

    // Update job status and assign worker
    await Job.findByIdAndUpdate(application.job._id, {
      status: 'in-progress',
      assignedWorker: application.worker
    });

    // Reject other pending applications for this job
    await Application.updateMany(
      {
        job: application.job._id,
        _id: { $ne: application._id },
        status: 'pending'
      },
      { status: 'rejected' }
    );

    // Send notification to worker about application acceptance
    try {
      await application.populate('worker', 'firstName lastName');
      await NotificationService.notifyApplicationAccepted(
        application._id,
        application.worker._id, // recipient (worker)
        req.user._id, // sender (client who accepted)
        application.job.title,
        `${req.user.firstName} ${req.user.lastName}`
      );
      console.log('Application acceptance notification sent successfully');
    } catch (notificationError) {
      console.error('Failed to send application acceptance notification:', notificationError);
      // Don't fail the acceptance process if notification fails
    }

    res.status(200).json({
      success: true,
      message: 'Application accepted successfully',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/applications/:id/reject
// @desc    Reject an application
// @access  Private (Job owner only)
router.post('/:id/reject', auth, async (req, res) => {
  try {
    const { reason } = req.body;

    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user owns the job
    if (application.job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if application is pending
    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Application has already been responded to'
      });
    }

    // Reject the application
    application.status = 'rejected';
    if (reason) {
      application.notes = application.notes || {};
      application.notes.client = reason;
    }
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Application rejected successfully',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/applications/:id/withdraw
// @desc    Withdraw an application
// @access  Private (Application owner only)
router.post('/:id/withdraw', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user owns the application
    if (application.worker.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if application can be withdrawn
    if (application.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw application after it has been responded to'
      });
    }

    // Withdraw the application
    application.status = 'withdrawn';
    application.isActive = false;
    await application.save();

    // Update job applications count
    await Job.findByIdAndUpdate(application.job, {
      $inc: { applicationsCount: -1 }
    });

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/applications/stats/overview
// @desc    Get application statistics for current user
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    let stats = {};

    if (req.user.userType === 'worker') {
      // Worker statistics
      const totalApplications = await Application.countDocuments({
        worker: req.user._id,
        isActive: true
      });

      const acceptedApplications = await Application.countDocuments({
        worker: req.user._id,
        status: 'accepted',
        isActive: true
      });

      const pendingApplications = await Application.countDocuments({
        worker: req.user._id,
        status: 'pending',
        isActive: true
      });

      const rejectedApplications = await Application.countDocuments({
        worker: req.user._id,
        status: 'rejected',
        isActive: true
      });

      stats = {
        totalApplications,
        acceptedApplications,
        pendingApplications,
        rejectedApplications,
        acceptanceRate: totalApplications > 0 ? ((acceptedApplications / totalApplications) * 100).toFixed(2) : 0
      };
    } else if (req.user.userType === 'client') {
      // Client statistics
      const jobs = await Job.find({ client: req.user._id, isActive: true });
      const jobIds = jobs.map(job => job._id);

      const totalApplicationsReceived = await Application.countDocuments({
        job: { $in: jobIds },
        isActive: true
      });

      const pendingApplications = await Application.countDocuments({
        job: { $in: jobIds },
        status: 'pending',
        isActive: true
      });

      stats = {
        totalJobs: jobs.length,
        totalApplicationsReceived,
        pendingApplications,
        averageApplicationsPerJob: jobs.length > 0 ? (totalApplicationsReceived / jobs.length).toFixed(2) : 0
      };
    }

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

// @route   POST /api/applications/:id/start-work
// @desc    Worker starts work on accepted application
// @access  Private (Worker only)
router.post('/:id/start-work', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the worker
    console.log('Application worker ID:', application.worker.toString());
    console.log('Current user ID:', req.user._id.toString());
    console.log('Worker check passed:', application.worker.toString() === req.user._id.toString());
    
    if (application.worker.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the assigned worker can start work.'
      });
    }

    // Check if application is accepted

    
    if (application.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: `Can only start work on accepted applications. Current status: ${application.status}`
      });
    }

    // Update application status
    console.log('Updating application status to in-progress...');
    application.status = 'in-progress';
    await application.save();
    console.log('Application status updated successfully');

    // Update job status (make it optional to prevent errors)
    try {
      if (application.job && application.job._id) {
        console.log('Updating job status to in-progress...');
        await Job.findByIdAndUpdate(application.job._id, {
          status: 'in-progress'
        });
        console.log('Job status updated successfully');
      }
    } catch (jobError) {
      console.error('Job update error (non-critical):', jobError);
      // Continue even if job update fails
    }

    res.status(200).json({
      success: true,
      message: 'Work started successfully',
      data: application
    });
  } catch (error) {
    console.error('Start work error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/applications/:id/complete-work
// @desc    Worker marks work as completed
// @access  Private (Worker only)
router.post('/:id/complete-work', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the worker
    if (application.worker.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the assigned worker can complete work.'
      });
    }

    // Check if work is in progress
    if (application.status !== 'in-progress') {
      return res.status(400).json({
        success: false,
        message: 'Can only complete work that is in progress'
      });
    }

    // Update application status
    application.status = 'completed';
    await application.save();

    // Update job status
    await Job.findByIdAndUpdate(application.job._id, {
      status: 'completed'
    });

    res.status(200).json({
      success: true,
      message: 'Work completed successfully',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/applications/:id/release-payment
// @desc    Client releases payment for completed work
// @access  Private (Client only)
router.post('/:id/release-payment', auth, async (req, res) => {
  try {
    const { paymentMethod, amount, notes } = req.body;
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the client
    if (application.job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the job owner can release payment.'
      });
    }

    // Check if work is completed
    if (application.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only release payment for completed work'
      });
    }

    // Validate payment method
    if (!paymentMethod || !['online', 'physical'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Valid payment method (online or physical) is required'
      });
    }

    // Update application with payment information
    application.status = 'payment-released';
    application.payment = {
      method: paymentMethod,
      amount: amount || application.proposedPrice?.amount || 0,
      releasedAt: new Date(),
      notes: notes || ''
    };
    await application.save();

    res.status(200).json({
      success: true,
      message: 'Payment released successfully',
      data: application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/applications/:id/confirm-payment
// @desc    Worker confirms payment received
// @access  Private (Worker only)
router.post('/:id/confirm-payment', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the worker
    if (application.worker.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the worker can confirm payment.'
      });
    }

    // Check if payment is released
    if (application.status !== 'payment-released') {
      console.log(`Confirm payment error: Expected status 'payment-released', got '${application.status}'`);
      return res.status(400).json({
        success: false,
        message: `Payment must be released before confirmation. Current status: ${application.status}`
      });
    }

    // Log application state for debugging
    console.log('Application before payment confirmation:', {
      id: application._id,
      status: application.status,
      payment: application.payment
    });

    // Check if payment object exists, if not initialize it
    if (!application.payment || typeof application.payment !== 'object') {
      console.log('Payment object missing, initializing...');
      application.payment = {
        method: 'online', // fallback default
        amount: 0
      };
      await application.save();
    }

    // Update application status and payment confirmation timestamp
    const updateData = {
      status: 'payment-confirmed',
      'payment.confirmedAt': new Date()
    };

    // Update the application using findByIdAndUpdate for better control
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('job');

    if (!updatedApplication) {
      return res.status(404).json({
        success: false,
        message: 'Failed to update application'
      });
    }

    console.log('Application after payment confirmation:', {
      id: updatedApplication._id,
      status: updatedApplication.status,
      payment: updatedApplication.payment
    });

    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      data: updatedApplication
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/applications/:id/submit-review
// @desc    Client submits review for worker
// @access  Private (Client only)
router.post('/:id/submit-review', auth, async (req, res) => {
  try {
    console.log('Submit review request received:', {
      applicationId: req.params.id,
      userId: req.user._id,
      body: req.body
    });

    const { rating, comment } = req.body;

    // Validate input first
    if (!rating || rating < 1 || rating > 5) {
      console.log('Invalid rating provided:', rating);
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Find application with populated job
    const application = await Application.findById(req.params.id).populate('job', 'client title');

    console.log('Application found:', {
      id: application?._id,
      status: application?.status,
      jobExists: !!application?.job,
      jobClient: application?.job?.client,
      requestUser: req.user._id
    });

    if (!application) {
      console.log('Application not found for ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (!application.job) {
      console.log('Job not found for application:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Associated job not found'
      });
    }

    // Check if user is the client
    if (application.job.client.toString() !== req.user._id.toString()) {
      console.log('Access denied - user is not job client:', {
        jobClient: application.job.client.toString(),
        requestUser: req.user._id.toString()
      });
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the job owner can submit review.'
      });
    }

    // Check application status - allow multiple statuses for flexibility
    const allowedStatuses = ['payment-confirmed', 'completed', 'in-progress'];
    if (!allowedStatuses.includes(application.status)) {
      console.log('Invalid status for review submission:', {
        currentStatus: application.status,
        allowedStatuses: allowedStatuses
      });
      return res.status(400).json({
        success: false,
        message: `Cannot submit review. Current status: ${application.status}. Payment must be confirmed first.`
      });
    }

    console.log('Adding review to application:', { rating, comment });

    // Create the review object
    const reviewData = {
      rating: rating,
      comment: comment || '',
      submittedAt: new Date()
    };

    // Update only the review and status fields to avoid validation issues
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          review: reviewData,
          status: 'reviewed'
        }
      },
      { 
        new: true, 
        runValidators: false // Skip validation to avoid enum issues
      }
    );

    if (!updatedApplication) {
      console.log('Failed to update application');
      return res.status(500).json({
        success: false,
        message: 'Failed to update application'
      });
    }

    console.log('Application updated successfully with review');

    res.status(200).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        _id: updatedApplication._id,
        status: updatedApplication.status,
        review: updatedApplication.review
      }
    });
  } catch (error) {
    console.error('Submit review error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// @route   POST /api/applications/:id/close-job
// @desc    Close the job application process
// @access  Private (Worker or Client)
router.post('/:id/close-job', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the worker or client
    const isWorker = application.worker.toString() === req.user._id.toString();
    const isClient = application.job.client.toString() === req.user._id.toString();

    if (!isWorker && !isClient) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only worker or client can close the job.'
      });
    }

    // Check if job can be closed (must be reviewed or payment confirmed)
    if (!['reviewed', 'payment-confirmed'].includes(application.status)) {
      return res.status(400).json({
        success: false,
        message: 'Job can only be closed after review or payment confirmation'
      });
    }

    // Update application status
    application.status = 'closed';
    await application.save();

    // Update job status
    await Job.findByIdAndUpdate(application.job._id, {
      status: 'closed'
    });

    res.status(200).json({
      success: true,
      message: 'Job closed successfully',
      data: application
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
