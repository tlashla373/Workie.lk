const { body, validationResult } = require('express-validator');

// Helper function to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
const validateRegister = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('userType')
    .optional()
    .isIn(['worker', 'client'])
    .withMessage('User type must be either worker or client'),
  
  body('phone')
    .optional()
    .custom((value) => {
      if (!value) return true; // Allow empty/undefined
      // Remove spaces and validate phone formats
      const cleanPhone = value.replace(/\s+/g, '');
      // Allow: +94771234567 (12 digits), 0771234567 (10 digits), 771234567 (9 digits)
      const phoneRegex = /^(\+94[0-9]{9}|0[0-9]{9}|[0-9]{9})$/;
      if (!phoneRegex.test(cleanPhone)) {
        throw new Error('Please provide a valid phone number (e.g., +94771234567, 0771234567, or 771234567)');
      }
      return true;
    }),
  
  handleValidationErrors
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Job creation validation
const validateJob = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ min: 5, max: 100 })
    .withMessage('Job title must be between 5 and 100 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Job description must be between 20 and 2000 characters'),
  
  body('category')
    .notEmpty()
    .withMessage('Job category is required')
    .isIn([
      'cleaning', 'gardening', 'plumbing', 'electrical', 'carpentry',
      'painting', 'delivery', 'tutoring', 'pet-care', 'elderly-care',
      'cooking', 'photography', 'event-planning', 'repair-services',
      'moving', 'other'
    ])
    .withMessage('Invalid job category'),
  
  body('budget.amount')
    .isNumeric()
    .withMessage('Budget amount must be a number')
    .isFloat({ min: 0 })
    .withMessage('Budget amount must be positive'),
  
  body('budget.type')
    .optional()
    .isIn(['fixed', 'hourly', 'negotiable'])
    .withMessage('Budget type must be fixed, hourly, or negotiable'),
  
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('Job location address is required'),
  
  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  
  body('urgency')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Invalid urgency level'),
  
  handleValidationErrors
];

// Application validation
const validateApplication = [
  body('coverLetter')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Cover letter cannot exceed 1000 characters'),
  
  body('proposedPrice.amount')
    .optional()
    .isNumeric()
    .withMessage('Proposed price must be a number')
    .isFloat({ min: 0 })
    .withMessage('Proposed price must be positive'),
  
  body('estimatedDuration')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Estimated duration cannot exceed 100 characters'),
  
  handleValidationErrors
];

// Review validation
const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters'),
  
  body('categories.communication')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Communication rating must be between 1 and 5'),
  
  body('categories.quality')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Quality rating must be between 1 and 5'),
  
  body('categories.timeliness')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Timeliness rating must be between 1 and 5'),
  
  body('categories.professionalism')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Professionalism rating must be between 1 and 5'),
  
  handleValidationErrors
];

// Profile validation
const validateProfile = [
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  
  body('skills.*.name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Skill name is required'),
  
  body('skills.*.level')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Invalid skill level'),
  
  body('availability.hoursPerWeek')
    .optional()
    .isInt({ min: 0, max: 168 })
    .withMessage('Hours per week must be between 0 and 168'),
  
  handleValidationErrors
];

// Worker verification validation
const validateWorkerVerification = [
  body('categories')
    .notEmpty()
    .withMessage('At least one category is required')
    .custom((value) => {
      const categories = Array.isArray(value) ? value : value.split(',').map(cat => cat.trim());
      if (categories.length === 0) {
        throw new Error('At least one category is required');
      }
      if (categories.length > 2) {
        throw new Error('Maximum 2 categories allowed');
      }
      const validCategories = [
        'Plumber', 'Electrician', 'Carpenter', 'Mason', 'Painter', 'Welder',
        'HVAC Technician', 'Roofer', 'Landscaper', 'Cleaner', 'Mechanic', 'Driver'
      ];
      const invalidCategories = categories.filter(cat => !validCategories.includes(cat));
      if (invalidCategories.length > 0) {
        throw new Error(`Invalid categories: ${invalidCategories.join(', ')}`);
      }
      return true;
    }),

  body('skills')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Skills description cannot exceed 500 characters'),

  body('experience')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Experience description cannot exceed 1000 characters'),

  body('bio')
    .notEmpty()
    .withMessage('Bio is required')
    .trim()
    .isLength({ min: 50, max: 500 })
    .withMessage('Bio must be between 50 and 500 characters'),

  body('age')
    .notEmpty()
    .withMessage('Age is required')
    .isInt({ min: 18, max: 65 })
    .withMessage('Age must be between 18 and 65'),

  body('country')
    .notEmpty()
    .withMessage('Country is required')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Country must be between 2 and 100 characters'),

  body('streetAddress')
    .notEmpty()
    .withMessage('Street address is required')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Street address must be between 5 and 200 characters'),

  body('city')
    .notEmpty()
    .withMessage('City is required')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('City must be between 2 and 100 characters'),

  body('postalCode')
    .notEmpty()
    .withMessage('Postal code is required')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('Postal code must be between 3 and 20 characters'),

  body('location')
    .notEmpty()
    .withMessage('Location is required')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Location must be between 5 and 200 characters'),

  body('address')
    .notEmpty()
    .withMessage('Address is required')
    .trim()
    .isLength({ min: 10, max: 300 })
    .withMessage('Address must be between 10 and 300 characters'),

  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),

  body('companyName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),

  body('emailVerified')
    .optional()
    .isBoolean()
    .withMessage('Email verified must be a boolean'),

  body('phoneVerified')
    .optional()
    .isBoolean()
    .withMessage('Phone verified must be a boolean'),

  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateJob,
  validateApplication,
  validateReview,
  validateProfile,
  validateWorkerVerification,
  handleValidationErrors
};
