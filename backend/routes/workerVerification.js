const express = require('express');
const s3Service = require('../services/s3Service');
const { auth } = require('../middleware/auth');
const { uploadFields } = require('../middleware/uploadMiddleware');
const { validateWorkerVerification } = require('../middleware/validation');
const User = require('../models/User');
const Profile = require('../models/Profile');

const router = express.Router();

// @route   POST /api/worker-verification/submit
// @desc    Submit worker verification with documents
// @access  Private
router.post('/submit', auth, uploadFields, validateWorkerVerification, async (req, res) => {
  try {
    // Validate that required files are uploaded
    const requiredFiles = ['profilePhoto', 'idPhotoFront', 'idPhotoBack'];
    const missingFiles = [];

    requiredFiles.forEach(field => {
      if (!req.files || !req.files[field] || req.files[field].length === 0) {
        missingFiles.push(field);
      }
    });

    if (missingFiles.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Missing required files',
        missingFiles: missingFiles
      });
    }
    const {
      categories,
      skills,
      experience,
      bio,
      age,
      country,
      streetAddress,
      city,
      postalCode,
      location,
      address,
      companyName,
      phone,
      emailVerified = false,
      phoneVerified = false
    } = req.body;

    // Process uploaded files and get S3 URLs
    const uploadedFiles = {};
    
    if (req.files) {
      // Profile Photo
      if (req.files.profilePhoto && req.files.profilePhoto[0]) {
        uploadedFiles.profilePhoto = {
          url: req.files.profilePhoto[0].location,
          filename: req.files.profilePhoto[0].originalname,
          size: req.files.profilePhoto[0].size,
          uploadDate: new Date()
        };
      }

      // ID Photo Front
      if (req.files.idPhotoFront && req.files.idPhotoFront[0]) {
        uploadedFiles.idPhotoFront = {
          url: req.files.idPhotoFront[0].location,
          filename: req.files.idPhotoFront[0].originalname,
          size: req.files.idPhotoFront[0].size,
          uploadDate: new Date()
        };
      }

      // ID Photo Back
      if (req.files.idPhotoBack && req.files.idPhotoBack[0]) {
        uploadedFiles.idPhotoBack = {
          url: req.files.idPhotoBack[0].location,
          filename: req.files.idPhotoBack[0].originalname,
          size: req.files.idPhotoBack[0].size,
          uploadDate: new Date()
        };
      }

      // Certificates
      if (req.files.certificates) {
        uploadedFiles.certificates = req.files.certificates.map(file => ({
          url: file.location,
          filename: file.originalname,
          size: file.size,
          uploadDate: new Date()
        }));
      }

      // Portfolio Images
      if (req.files.portfolioImages) {
        uploadedFiles.portfolioImages = req.files.portfolioImages.map(file => ({
          url: file.location,
          filename: file.originalname,
          size: file.size,
          uploadDate: new Date()
        }));
      }

      // Verification Documents
      if (req.files.verificationDocuments) {
        uploadedFiles.verificationDocuments = req.files.verificationDocuments.map(file => ({
          url: file.location,
          filename: file.originalname,
          size: file.size,
          uploadDate: new Date()
        }));
      }
    }

    // Create verification data object
    const verificationData = {
      userId: req.user.id,
      personalInfo: {
        age,
        country,
        streetAddress,
        city,
        postalCode,
        location,
        address,
        phone
      },
      professionalInfo: {
        categories: Array.isArray(categories) ? categories : categories ? categories.split(',').map(cat => cat.trim()) : [],
        skills,
        experience,
        bio,
        companyName
      },
      documents: uploadedFiles,
      verification: {
        emailVerified,
        phoneVerified,
        status: 'pending',
        submissionDate: new Date(),
        lastUpdated: new Date()
      }
    };

    // Update user profile with verification data
    const profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { 
        $set: { 
          workerVerification: verificationData,
          isVerificationSubmitted: true,
          // Update profile picture if uploaded
          ...(uploadedFiles.profilePhoto && { profilePicture: uploadedFiles.profilePhoto.url }),
          // Update basic profile info
          bio: bio || '',
          skills: Array.isArray(categories) ? categories : categories ? categories.split(',').map(cat => cat.trim()) : [],
          location: location || address || '',
          phone: phone || ''
        }
      },
      { new: true, upsert: true }
    );

    // Also update user table with phone if provided
    if (phone) {
      await User.findByIdAndUpdate(req.user.id, { phone });
    }

    res.status(200).json({
      success: true,
      message: 'Worker verification submitted successfully',
      data: {
        verificationData: profile.workerVerification,
        profilePicture: uploadedFiles.profilePhoto?.url,
        documents: uploadedFiles
      }
    });

  } catch (error) {
    console.error('Worker verification submission error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during verification submission',
      error: error.message 
    });
  }
});

// @route   GET /api/worker-verification/status
// @desc    Get worker verification status
// @access  Private
router.get('/status', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    
    if (!profile || !profile.workerVerification) {
      return res.status(200).json({
        success: true,
        data: {
          verificationStatus: 'not_submitted',
          message: 'No verification data found'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        verificationStatus: profile.workerVerification.verification.status,
        verificationData: profile.workerVerification,
        submissionDate: profile.workerVerification.verification.submissionDate,
        lastUpdated: profile.workerVerification.verification.lastUpdated
      }
    });

  } catch (error) {
    console.error('Get verification status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching verification status',
      error: error.message 
    });
  }
});

// @route   PUT /api/worker-verification/update-status
// @desc    Update worker verification status (Admin only)
// @access  Private (Admin)
router.put('/update-status', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (!user || user.userType !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required.' 
      });
    }

    const { userId, status, adminNotes } = req.body;

    if (!['pending', 'approved', 'rejected', 'under_review'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification status'
      });
    }

    const profile = await Profile.findOneAndUpdate(
      { user: userId },
      { 
        $set: { 
          'workerVerification.verification.status': status,
          'workerVerification.verification.adminNotes': adminNotes,
          'workerVerification.verification.reviewDate': new Date(),
          'workerVerification.verification.reviewedBy': req.user.id,
          'workerVerification.verification.lastUpdated': new Date()
        }
      },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Worker verification profile not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Verification status updated successfully',
      data: {
        verificationData: profile.workerVerification
      }
    });

  } catch (error) {
    console.error('Update verification status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error updating verification status',
      error: error.message 
    });
  }
});

// @route   DELETE /api/worker-verification/delete-document
// @desc    Delete verification document from S3 and database
// @access  Private
router.delete('/delete-document', auth, async (req, res) => {
  try {
    const { documentUrl, documentType } = req.body;
    
    if (!documentUrl) {
      return res.status(400).json({ 
        success: false,
        message: 'Document URL is required' 
      });
    }

    // Extract key from S3 URL
    const url = new URL(documentUrl);
    const key = url.pathname.substring(1); // Remove leading slash

    // Delete from S3
    await s3Service.deleteFile(key);

    // Remove from user profile based on document type
    const updateQuery = {};
    if (documentType === 'profilePhoto') {
      updateQuery['workerVerification.documents.profilePhoto'] = null;
    } else if (documentType === 'idPhotoFront') {
      updateQuery['workerVerification.documents.idPhotoFront'] = null;
    } else if (documentType === 'idPhotoBack') {
      updateQuery['workerVerification.documents.idPhotoBack'] = null;
    } else {
      // For arrays like certificates, portfolioImages, etc.
      updateQuery[`workerVerification.documents.${documentType}`] = { url: documentUrl };
    }

    await Profile.findOneAndUpdate(
      { user: req.user.id },
      documentType.includes('certificates') || documentType.includes('portfolio') || documentType.includes('verification') 
        ? { $pull: updateQuery }
        : { $unset: updateQuery }
    );

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Document deletion error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during document deletion',
      error: error.message 
    });
  }
});

// @route   GET /api/worker-verification/all
// @desc    Get all worker verifications (Admin only)
// @access  Private (Admin)
router.get('/all', auth, async (req, res) => {
  try {
    // Check if user is admin
    const user = await User.findById(req.user.id);
    if (!user || user.userType !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin privileges required.' 
      });
    }

    const profiles = await Profile.find({ 
      workerVerification: { $exists: true },
      isVerificationSubmitted: true 
    })
    .populate('user', 'firstName lastName email')
    .sort({ 'workerVerification.verification.submissionDate': -1 });

    const verifications = profiles.map(profile => ({
      id: profile._id,
      user: profile.user,
      verificationData: profile.workerVerification,
      submissionDate: profile.workerVerification.verification.submissionDate,
      status: profile.workerVerification.verification.status
    }));

    res.status(200).json({
      success: true,
      data: {
        verifications,
        total: verifications.length
      }
    });

  } catch (error) {
    console.error('Get all verifications error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error fetching verifications',
      error: error.message 
    });
  }
});

module.exports = router;
