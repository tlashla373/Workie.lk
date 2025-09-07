const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const Profile = require('../models/Profile');
const { auth } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    if (file.fieldname === 'profilePhoto') {
      uploadPath += 'profile-pictures/';
    } else if (file.fieldname === 'idPhotoFront' || file.fieldname === 'idPhotoBack') {
      uploadPath += 'worker-verification/';
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { firstName, lastName, email, password, userType, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user (without userType - will be set during role selection)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      userType: userType || undefined, // Only set if provided, otherwise leave null
      phone
    });

    // Create empty profile for the user
    await Profile.create({ user: user._id });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Validate password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const profile = await Profile.findOne({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        user,
        profile
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

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful'
  });
});

// @route   POST /api/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // In a real application, you would send an email here
    // For now, we'll just return the token (remove this in production)
    res.status(200).json({
      success: true,
      message: 'Password reset email sent',
      resetToken // Remove this in production
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.put('/reset-password/:token', async (req, res) => {
  try {
    const { password } = req.body;

    // Hash the token and find user
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // Generate new token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
      data: {
        token
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

// @route   PUT /api/auth/change-password
// @desc    Change password for logged in user
// @access  Private
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/auth/worker-verification
// @desc    Submit worker verification data (without file uploads for now)
// @access  Private
router.post('/worker-verification', auth, async (req, res) => {
  try {
    console.log('Worker verification endpoint hit');
    console.log('User from auth middleware:', req.user);
    console.log('Request body:', req.body);

    const {
      categories, skills, experience, bio, age, country, streetAddress,
      city, postalCode, location, address, companyName, phone
    } = req.body;

    // Parse categories if it's a string
    let parsedCategories;
    try {
      parsedCategories = typeof categories === 'string' ? JSON.parse(categories) : categories;
    } catch (error) {
      console.log('Error parsing categories:', error);
      parsedCategories = [];
    }

    // Map frontend categories to backend enum values
    const categoryMapping = {
      'Plumber': 'plumbing',
      'Electrician': 'electrical',
      'Carpenter': 'carpentry',
      'Mason': 'repair-services',
      'Painter': 'painting',
      'Welder': 'repair-services',
      'HVAC Technician': 'repair-services',
      'Roofer': 'repair-services',
      'Landscaper': 'gardening',
      'Cleaner': 'cleaning',
      'Mechanic': 'repair-services',
      'Driver': 'delivery'
    };

    const mappedJobTypes = parsedCategories.map(category => 
      categoryMapping[category] || 'other'
    );

    console.log('Original categories:', parsedCategories);
    console.log('Mapped job types:', mappedJobTypes);
    console.log('Skills from request:', skills);
    console.log('Experience from request:', experience);

    // Update user information
    const updateUserData = {
      phone,
      userType: 'worker',
      isVerified: true, // Mark as verified since they completed the process
      address: {
        street: streetAddress,
        city,
        zipCode: postalCode,
        country
      }
    };

    console.log('Updating user with data:', updateUserData);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateUserData,
      { new: true, runValidators: true }
    );

    if (!user) {
      console.log('User not found with ID:', req.user._id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('User updated successfully:', user._id);

    // Update or create profile
    const skillsArray = [];
    
    // Add selected categories as primary skills
    if (parsedCategories && parsedCategories.length > 0) {
      parsedCategories.forEach(category => {
        skillsArray.push({
          name: category,
          level: 'intermediate',
          yearsOfExperience: 1
        });
      });
    }
    
    // Add additional skills if provided
    if (skills && skills.trim()) {
      // Split skills by comma and create skill objects
      const additionalSkills = skills.split(',').map(skill => ({
        name: skill.trim(),
        level: 'beginner'
      })).filter(skill => skill.name); // Remove empty skills
      
      skillsArray.push(...additionalSkills);
    }

    const experienceArray = [];
    if (experience && experience.trim()) {
      experienceArray.push({
        title: 'General Experience',
        description: experience,
        isCurrent: true
      });
    }

    const profileData = {
      bio,
      skills: skillsArray,
      experience: experienceArray,
      preferences: {
        jobTypes: mappedJobTypes,
        workLocationPreference: 'any'
      },
      isVerified: true
    };

    console.log('Creating/updating profile with data:', profileData);
    console.log('Skills array being saved:', skillsArray);
    console.log('Experience array being saved:', experienceArray);

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      profileData,
      { new: true, upsert: true, runValidators: true }
    );

    console.log('Profile updated successfully:', profile._id);

    res.status(200).json({
      success: true,
      message: 'Worker verification data submitted successfully',
      data: {
        user,
        profile
      }
    });
  } catch (error) {
    console.error('Worker verification error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Server error during verification submission',
      error: error.message
    });
  }
});

// @route   POST /api/auth/worker-verification
// @desc    Submit worker verification data
// @access  Private
router.post('/worker-verification', auth, async (req, res) => {
  try {
    console.log('Worker verification request received:', req.body);
    console.log('User ID from auth middleware:', req.user?.id);
    
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
      phone
    } = req.body;

    // Validate required fields
    if (!categories || !bio || !age || !country || !streetAddress || !city || !postalCode || !location || !address || !phone) {
      const missingFields = [];
      if (!categories) missingFields.push('categories');
      if (!bio) missingFields.push('bio');
      if (!age) missingFields.push('age');
      if (!country) missingFields.push('country');
      if (!streetAddress) missingFields.push('streetAddress');
      if (!city) missingFields.push('city');
      if (!postalCode) missingFields.push('postalCode');
      if (!location) missingFields.push('location');
      if (!address) missingFields.push('address');
      if (!phone) missingFields.push('phone');
      
      console.log('Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Find and update user profile
    let profile = await Profile.findOne({ user: req.user.id });
    
    if (!profile) {
      // Create new profile if doesn't exist
      console.log('Creating new profile for user:', req.user.id);
      profile = new Profile({ user: req.user.id });
    } else {
      console.log('Updating existing profile for user:', req.user.id);
    }

    // Parse categories if it's a string
    let parsedCategories = categories;
    if (typeof categories === 'string') {
      try {
        parsedCategories = JSON.parse(categories);
      } catch (error) {
        console.log('Error parsing categories:', error.message);
        return res.status(400).json({
          success: false,
          message: 'Invalid categories format - must be a valid JSON array'
        });
      }
    }
    
    // Validate categories array
    if (!Array.isArray(parsedCategories) || parsedCategories.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Categories must be a non-empty array'
      });
    }

    // Update profile with worker verification data
    profile.workerCategories = parsedCategories;
    
    // Handle skills - convert string to proper format if needed
    if (skills && skills.trim()) {
      const skillsArray = skills.split(',').map(skill => ({
        name: skill.trim(),
        level: 'beginner',
        yearsOfExperience: 0
      }));
      profile.skills = skillsArray;
    }
    
    // Handle experience - convert string to proper format if needed
    if (experience && experience.trim()) {
      const experienceEntry = {
        title: 'General Experience',
        description: experience,
        isCurrent: true,
        startDate: new Date()
      };
      profile.experience = [experienceEntry];
    }
    
    profile.bio = bio;
    profile.age = parseInt(age);
    profile.country = country;
    profile.streetAddress = streetAddress;
    profile.city = city;
    profile.postalCode = postalCode;
    profile.workLocation = location;
    profile.preferredWorkAreas = address;
    profile.currentCompany = companyName;
    profile.phone = phone;
    profile.isWorkerVerificationSubmitted = true;
    profile.workerVerificationStatus = 'pending';
    profile.workerVerificationSubmittedAt = new Date();

    console.log('Saving profile with data:', profile.toObject());
    await profile.save();
    console.log('Profile saved successfully');

    // Update user to mark as worker if not already
    console.log('Finding user by ID:', req.user.id);
    const user = await User.findById(req.user.id);
    
    if (!user) {
      console.error('User not found with ID:', req.user.id);
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    console.log('Current user type:', user.userType);
    if (user.userType !== 'worker') {
      console.log('Updating user type from', user.userType, 'to worker');
      user.userType = 'worker';
      
      try {
        await user.save();
        console.log('User type updated successfully to:', user.userType);
        
        // Verify the update
        const updatedUser = await User.findById(req.user.id);
        console.log('Verified user type in database:', updatedUser.userType);
      } catch (userSaveError) {
        console.error('Error saving user type:', userSaveError);
        // Don't fail the whole request if user type update fails
        console.log('Continuing despite user type update failure...');
      }
    } else {
      console.log('User type already set to worker');
    }

    console.log('Worker verification completed successfully');
    res.status(200).json({
      success: true,
      message: 'Worker verification data submitted successfully',
      data: {
        profile: {
          id: profile._id,
          workerCategories: profile.workerCategories,
          bio: profile.bio,
          age: profile.age,
          country: profile.country,
          city: profile.city,
          workLocation: profile.workLocation,
          isWorkerVerificationSubmitted: profile.isWorkerVerificationSubmitted,
          workerVerificationStatus: profile.workerVerificationStatus,
          workerVerificationSubmittedAt: profile.workerVerificationSubmittedAt
        }
      }
    });

  } catch (error) {
    console.error('Worker verification error:', error);
    console.error('Error stack:', error.stack);
    
    // Check for specific MongoDB validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    // Check for duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Profile already exists for this user'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during worker verification submission',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/auth/update-role
// @desc    Update user role (for role selection)
// @access  Private
router.put('/update-role', auth, async (req, res) => {
  try {
    const { userType } = req.body;

    // Validate userType
    if (!userType || !['worker', 'client'].includes(userType)) {
      return res.status(400).json({
        success: false,
        message: 'Valid userType is required (worker or client)'
      });
    }

    // Find the user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Allow updating userType if it's currently null/undefined or if user is updating to same type
    if (user.userType && user.userType !== userType) {
      return res.status(400).json({
        success: false,
        message: 'User role has already been set and cannot be changed'
      });
    }

    // Update user role
    user.userType = userType;
    await user.save();

    // Create a profile if it doesn't exist
    let profile = await Profile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new Profile({
        user: req.user.id,
        bio: '',
        skills: [],
        experience: [],
        portfolio: []
      });
      await profile.save();
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: {
        user: {
          ...user.toJSON(),
          userType: user.userType
        },
        profile
      }
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Test endpoint to verify routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes are working!' });
});

// Debug endpoint to test authentication
router.get('/debug', auth, (req, res) => {
  res.json({ 
    message: 'Authentication working!',
    user: {
      id: req.user._id,
      email: req.user.email,
      userType: req.user.userType,
      isActive: req.user.isActive
    }
  });
});

module.exports = router;
