import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  User, 
  Building, 
  Upload, 
  Camera, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Shield,
  Mail,
  Phone,
  FileText,
  Check,
  CreditCard
} from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const WorkerVerification = () => {
  // Mock navigation and dark mode for demo
  const navigate = (path) => {
    if (path === '/clientprofile') {
      window.location.href = '/clientprofile'; 
    } else {
      window.location.href = '/roleselection';
    }
  };
  const { isDarkMode } = useDarkMode();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [fileValidationErrors, setFileValidationErrors] = useState({});
  const [inputValidationErrors, setInputValidationErrors] = useState({});
  const [workerData, setWorkerData] = useState({
    // New fields for added steps
    categories: [],
    skills: '',
    experience: '',
    bio: '',
    age: '',
    country: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    // Existing fields
    location: '',
    address: '',
    companyName: '',
    profilePhoto: null,
    idPhotoFront: null,
    idPhotoBack: null,
    emailVerified: false,
    phoneVerified: false,
    phone: '',
  });

  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);

  // Available worker categories
  const workerCategories = [
    'Plumber', 'Electrician', 'Carpenter', 'Mason', 'Painter', 'Welder',
    'HVAC Technician', 'Roofer', 'Landscaper', 'Cleaner', 'Mechanic', 'Driver'
  ];

  // Input validation functions
  const validateInput = (field, value) => {
    let error = '';
    
    switch (field) {
      case 'bio':
        if (!value || value.trim().length < 50) {
          error = 'Bio must be at least 50 characters long';
        } else if (value.trim().length > 500) {
          error = 'Bio cannot exceed 500 characters';
        }
        break;
        
      case 'age':
        const ageNum = parseInt(value);
        if (!value || isNaN(ageNum)) {
          error = 'Age is required';
        } else if (ageNum < 18 || ageNum > 65) {
          error = 'Age must be between 18 and 65';
        }
        break;
        
      case 'country':
        if (!value || value.trim().length < 2) {
          error = 'Country is required';
        } else if (value.trim().length > 100) {
          error = 'Country name is too long';
        }
        break;
        
      case 'streetAddress':
        if (!value || value.trim().length < 5) {
          error = 'Street address must be at least 5 characters';
        } else if (value.trim().length > 200) {
          error = 'Street address is too long';
        }
        break;
        
      case 'city':
        if (!value || value.trim().length < 2) {
          error = 'City is required';
        } else if (value.trim().length > 100) {
          error = 'City name is too long';
        }
        break;
        
      case 'postalCode':
        if (!value || value.trim().length < 3) {
          error = 'Postal code must be at least 3 characters';
        } else if (value.trim().length > 20) {
          error = 'Postal code is too long';
        }
        break;
        
      case 'location':
        if (!value || value.trim().length < 5) {
          error = 'Location must be at least 5 characters';
        } else if (value.trim().length > 200) {
          error = 'Location is too long';
        }
        break;
        
      case 'address':
        if (!value || value.trim().length < 10) {
          error = 'Address must be at least 10 characters';
        } else if (value.trim().length > 300) {
          error = 'Address is too long';
        }
        break;
        
      case 'phone':
        const phoneRegex = /^[\+]?[1-9][\d]{7,14}$/;
        if (!value || !phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
          error = 'Please enter a valid phone number';
        }
        break;
        
      case 'skills':
        if (value && value.length > 500) {
          error = 'Skills description cannot exceed 500 characters';
        }
        break;
        
      case 'experience':
        if (value && value.length > 1000) {
          error = 'Experience description cannot exceed 1000 characters';
        }
        break;
        
      case 'companyName':
        if (value && value.length > 100) {
          error = 'Company name cannot exceed 100 characters';
        }
        break;
        
      default:
        break;
    }
    
    return error;
  };

  // Handle input change with validation
  const handleInputChange = (field, value) => {
    // Update the value
    setWorkerData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Validate the input
    const error = validateInput(field, value);
    setInputValidationErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const steps = [
    { id: 1, title: 'Category & Skills', icon: User },
    { id: 2, title: 'Bio', icon: FileText },
    { id: 3, title: 'Personal Details', icon: MapPin },
    { id: 4, title: 'Work Information', icon: Building },
    { id: 5, title: 'Profile Photo', icon: Camera },
    { id: 6, title: 'ID Verification', icon: CreditCard },
    { id: 7, title: 'Contact Verification', icon: Shield },
    { id: 8, title: 'Complete Setup', icon: CheckCircle }
  ];

  const profileImagePreview = useMemo(() => {
    if (workerData.profilePhoto) {
      return URL.createObjectURL(workerData.profilePhoto);
    }
    return null;
  }, [workerData.profilePhoto]);

  const idFrontImagePreview = useMemo(() => {
    if (workerData.idPhotoFront) {
      return URL.createObjectURL(workerData.idPhotoFront);
    }
    return null;
  }, [workerData.idPhotoFront]);

  const idBackImagePreview = useMemo(() => {
    if (workerData.idPhotoBack) {
      return URL.createObjectURL(workerData.idPhotoBack);
    }
    return null;
  }, [workerData.idPhotoBack]);

  // Cleanup image previews
  useEffect(() => {
    return () => {
      if (profileImagePreview) {
        URL.revokeObjectURL(profileImagePreview);
      }
      if (idFrontImagePreview) {
        URL.revokeObjectURL(idFrontImagePreview);
      }
      if (idBackImagePreview) {
        URL.revokeObjectURL(idBackImagePreview);
      }
    };
  }, [profileImagePreview, idFrontImagePreview, idBackImagePreview]);

  const handleVerifyEmail = async () => {
    setIsVerifyingEmail(true);
    await new Promise(res => setTimeout(res, 1500));
    setWorkerData(prev => ({ ...prev, emailVerified: true }));
    setIsVerifyingEmail(false);
  };

  const handleVerifyPhone = async () => {
    setIsVerifyingPhone(true);
    await new Promise(res => setTimeout(res, 1500));
    setWorkerData(prev => ({ ...prev, phoneVerified: true }));
    setIsVerifyingPhone(false);
  };

  const handleCategoryToggle = (category) => {
    setWorkerData(prev => {
      const currentCategories = prev.categories;
      if (currentCategories.includes(category)) {
        // Remove category if already selected
        return {
          ...prev,
          categories: currentCategories.filter(c => c !== category)
        };
      } else if (currentCategories.length < 2) {
        // Add category if less than 2 are selected
        return {
          ...prev,
          categories: [...currentCategories, category]
        };
      }
      // Do nothing if 2 categories are already selected
      return prev;
    });
  };

  const handleClearCategories = () => {
    setWorkerData(prev => ({
      ...prev,
      categories: []
    }));
  };

  const handleComplete = () => {
    if (isAllStepsComplete()) {
      navigate('/clientprofile');
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return workerData.categories.length >= 1 && workerData.categories.length <= 2;
      case 2:
        return workerData.bio.trim() !== '' && 
               workerData.bio.trim().length >= 50 && 
               workerData.bio.trim().length <= 500 &&
               !inputValidationErrors.bio;
      case 3:
        return workerData.age.trim() !== '' && 
               workerData.country.trim() !== '' && 
               workerData.streetAddress.trim() !== '' && 
               workerData.city.trim() !== '' && 
               workerData.postalCode.trim() !== '' &&
               !inputValidationErrors.age &&
               !inputValidationErrors.country &&
               !inputValidationErrors.streetAddress &&
               !inputValidationErrors.city &&
               !inputValidationErrors.postalCode;
      case 4:
        return workerData.location.trim() !== '' && 
               !inputValidationErrors.location;
      case 5:
        return workerData.profilePhoto !== null && !fileValidationErrors.profilePhoto;
      case 6:
        return workerData.idPhotoFront !== null && 
               workerData.idPhotoBack !== null &&
               !fileValidationErrors.idPhotoFront &&
               !fileValidationErrors.idPhotoBack;
      case 7:
        return workerData.phone.trim() !== '' && 
               workerData.phoneVerified &&
               !inputValidationErrors.phone;
      case 8:
        return isStepValid(1) && isStepValid(2) && isStepValid(3) && isStepValid(4) && 
               isStepValid(5) && isStepValid(6) && isStepValid(7);
      default:
        return false;
    }
  };

  const isAllStepsComplete = () => {
    return isStepValid(1) && isStepValid(2) && isStepValid(3) && isStepValid(4) && 
           isStepValid(5) && isStepValid(6) && isStepValid(7);
  };

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const canProceedToNext = () => {
    // Step 1 requires at least 1 category to be selected
    if (currentStep === 1) {
      return workerData.categories.length >= 1 && workerData.categories.length <= 2;
    }
    return isStepValid(currentStep);
  };

  const handleNext = () => {
    if (canProceedToNext() && currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderProgressBar = () => {
    const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
    
    return (
      <div className="mb-6 sm:mb-8">
        <div className="flex items-start justify-between mb-4 relative px-1 sm:px-2 overflow-x-auto">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const IconComponent = step.icon;
            
            return (
              <div key={step.id} className="flex flex-col items-center relative min-w-0 flex-1">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 sm:mb-2 transition-all duration-300 relative z-10 ${
                  status === 'completed' 
                    ? 'bg-green-500 text-white' 
                    : status === 'current'
                    ? 'bg-blue-500 text-white'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {status === 'completed' ? (
                    <Check className="w-3 h-3 sm:w-5 sm:h-5" />
                  ) : (
                    <IconComponent className="w-3 h-3 sm:w-5 sm:h-5" />
                  )}
                </div>
                <span className={`text-xs sm:text-xs text-center leading-tight max-w-12 sm:max-w-20 truncate hidden sm:block ${
                  status === 'current' 
                    ? 'text-blue-500 font-medium' 
                    : status === 'completed'
                    ? 'text-green-500 font-medium'
                    : isDarkMode 
                    ? 'text-gray-400' 
                    : 'text-gray-500'
                }`}>
                  {step.title}
                </span>

                {/* Connection line between steps */}
                {index < steps.length - 1 && (
                  <div className={`absolute top-5 left-1/2 h-0.5 transition-colors duration-300 ${
                    step.id < currentStep ? 'bg-green-500' : isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`} style={{ 
                    width: `calc(100% - 1.25rem)`,
                    transform: 'translateX(0.625rem)'
                  }} />
                )}
              </div>
            );
          })}
        </div>
        
        <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} relative overflow-hidden`}>
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Choose Your Categories & Skills</h2>
            
            {/* Worker Categories */}
            <div className="space-y-3 sm:space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <label className="block text-sm font-medium">
                    Select Your Work Categories * (Choose 1-2 categories)
                  </label>
                  {workerData.categories.length > 0 && (
                    <button
                      onClick={handleClearCategories}
                      className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                  {workerCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryToggle(category)}
                      className={`p-2 sm:p-3 rounded-lg border text-sm font-medium transition-all ${
                        workerData.categories.includes(category)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : workerData.categories.length >= 2
                          ? 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
                          : isDarkMode
                          ? 'border-gray-600 hover:border-blue-500 hover:bg-gray-800'
                          : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                      disabled={!workerData.categories.includes(category) && workerData.categories.length >= 2}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    Selected: {workerData.categories.length}/2 categories
                  </p>
                  {workerData.categories.length === 0 && (
                    <p className="text-xs text-red-500">
                      Please select at least one category
                    </p>
                  )}
                  {workerData.categories.length >= 1 && (
                    <p className="text-xs text-green-600">
                      ✓ {workerData.categories.length === 1 ? 'You can select one more' : 'Maximum reached'}
                    </p>
                  )}
                </div>
              </div>

              {/* Skills (Optional) */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Skills (Optional - you can skip this)
                </label>
                <textarea
                  placeholder="List your relevant skills (e.g., 5 years plumbing experience, certified electrician, etc.)"
                  value={workerData.skills}
                  onChange={(e) => setWorkerData({ ...workerData, skills: e.target.value })}
                  rows={3}
                  className={`w-full border rounded-lg px-3 py-2 text-sm sm:text-base bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                    isDarkMode ? 'border-gray-600' : 'border-gray-300'
                  }`}
                />
              </div>

              {/* Experience (Optional) */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Experience (Optional - you can skip this)
                </label>
                <textarea
                  placeholder="Describe your work experience and achievements"
                  value={workerData.experience}
                  onChange={(e) => setWorkerData({ ...workerData, experience: e.target.value })}
                  rows={3}
                  className={`w-full border rounded-lg px-3 py-2 text-sm sm:text-base bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                    isDarkMode ? 'border-gray-600' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Write Your Bio</h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  About Yourself * (minimum 50 characters)
                </label>
                <textarea
                  placeholder="Write a brief bio about yourself. Tell potential clients about your work style, reliability, and what makes you a great worker. This helps clients understand your background and approach to work."
                  value={workerData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={5}
                  className={`w-full border rounded-lg px-3 py-2 text-sm sm:text-base bg-transparent focus:outline-none focus:ring-2 transition-colors resize-none ${
                    inputValidationErrors.bio 
                      ? 'border-red-500 focus:ring-red-500'
                      : workerData.bio.length >= 50 && workerData.bio.length <= 500
                      ? 'border-green-500 focus:ring-green-500'
                      : isDarkMode 
                      ? 'border-gray-600 focus:ring-blue-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className={`text-xs ${
                    workerData.bio.length < 50 
                      ? 'text-orange-500' 
                      : workerData.bio.length <= 500 
                      ? 'text-green-600' 
                      : 'text-red-500'
                  }`}>
                    {workerData.bio.length}/500 characters
                    {workerData.bio.length < 50 && ` (${50 - workerData.bio.length} more needed)`}
                  </p>
                  {inputValidationErrors.bio && (
                    <p className="text-xs text-red-500">{inputValidationErrors.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Personal Details</h2>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Age * (18-65 years)</label>
                <input
                  type="number"
                  placeholder="Enter your age"
                  value={workerData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  min="18"
                  max="65"
                  className={`w-full border rounded-lg px-3 py-2 text-sm sm:text-base bg-transparent focus:outline-none focus:ring-2 transition-colors ${
                    inputValidationErrors.age 
                      ? 'border-red-500 focus:ring-red-500'
                      : workerData.age && !inputValidationErrors.age
                      ? 'border-green-500 focus:ring-green-500'
                      : isDarkMode 
                      ? 'border-gray-600 focus:ring-blue-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {inputValidationErrors.age && (
                  <p className="text-xs text-red-500 mt-1">{inputValidationErrors.age}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Country *</label>
                <input
                  type="text"
                  placeholder="Enter your country"
                  value={workerData.country}
                  onChange={(e) => setWorkerData({ ...workerData, country: e.target.value })}
                  className={`w-full border rounded-lg px-3 py-2 text-sm sm:text-base bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDarkMode ? 'border-gray-600' : 'border-gray-300'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Street Address *</label>
                <input
                  type="text"
                  placeholder="Enter your street address"
                  value={workerData.streetAddress}
                  onChange={(e) => setWorkerData({ ...workerData, streetAddress: e.target.value })}
                  className={`w-full border rounded-lg px-3 py-2 text-sm sm:text-base bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDarkMode ? 'border-gray-600' : 'border-gray-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input
                    type="text"
                    placeholder="Enter your city"
                    value={workerData.city}
                    onChange={(e) => setWorkerData({ ...workerData, city: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 text-sm sm:text-base bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Postal Code *</label>
                  <input
                    type="text"
                    placeholder="Enter postal code"
                    value={workerData.postalCode}
                    onChange={(e) => setWorkerData({ ...workerData, postalCode: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 text-sm sm:text-base bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Work Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Current Work Location *</label>
                  <input
                    type="text"
                    placeholder="Enter your current work location"
                    value={workerData.location}
                    onChange={(e) => setWorkerData({ ...workerData, location: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Current Company</label>
                  <input
                    type="text"
                    placeholder="Enter current company name (optional)"
                    value={workerData.companyName}
                    onChange={(e) => setWorkerData({ ...workerData, companyName: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Profile Photo</h2>
            <div className="flex flex-col items-center space-y-3 sm:space-y-4">
              {profileImagePreview ? (
                <div className="text-center">
                  <img
                    src={profileImagePreview}
                    alt="Profile preview"
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-full border-4 border-blue-500 mb-3 sm:mb-4"
                  />
                  <p className="text-sm text-green-600 flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Photo uploaded successfully
                  </p>
                </div>
              ) : (
                <div className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-dashed flex items-center justify-center ${
                  isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
                }`}>
                  <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
              )}
              
              <div className="w-full max-w-md">
                <label className="block text-sm font-medium mb-2">Upload Profile Photo *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setWorkerData({ ...workerData, profilePhoto: file });
                    }
                  }}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Please upload a clear photo of yourself for verification purposes.
                </p>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">ID Verification</h2>
            <p className="text-sm text-gray-600 mb-4 sm:mb-6">
              Please upload clear photos of both sides of your government-issued ID for verification.
            </p>
            
            {/* ID Front Photo */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-medium">ID Front Photo</h3>
              <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                {idFrontImagePreview ? (
                  <div className="text-center">
                    <img
                      src={idFrontImagePreview}
                      alt="ID Front preview"
                      className="w-48 h-32 sm:w-64 sm:h-40 object-cover rounded-lg border-2 border-blue-500 mb-3 sm:mb-4"
                    />
                    <p className="text-sm text-green-600 flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      ID Front uploaded successfully
                    </p>
                  </div>
                ) : (
                  <div className={`w-48 h-32 sm:w-64 sm:h-40 rounded-lg border-2 border-dashed flex items-center justify-center ${
                    isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
                  }`}>
                    <div className="text-center">
                      <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">ID Front</p>
                    </div>
                  </div>
                )}
                
                <div className="w-full max-w-md">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setWorkerData({ ...workerData, idPhotoFront: file });
                      }
                    }}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>

            {/* ID Back Photo */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-medium">ID Back Photo</h3>
              <div className="flex flex-col items-center space-y-3 sm:space-y-4">
                {idBackImagePreview ? (
                  <div className="text-center">
                    <img
                      src={idBackImagePreview}
                      alt="ID Back preview"
                      className="w-48 h-32 sm:w-64 sm:h-40 object-cover rounded-lg border-2 border-blue-500 mb-3 sm:mb-4"
                    />
                    <p className="text-sm text-green-600 flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      ID Back uploaded successfully
                    </p>
                  </div>
                ) : (
                  <div className={`w-48 h-32 sm:w-64 sm:h-40 rounded-lg border-2 border-dashed flex items-center justify-center ${
                    isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
                  }`}>
                    <div className="text-center">
                      <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">ID Back</p>
                    </div>
                  </div>
                )}
                
                <div className="w-full max-w-md">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setWorkerData({ ...workerData, idPhotoBack: file });
                      }
                    }}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Contact Verification</h2>
            <div className="space-y-4 sm:space-y-6">
              <div className={`p-3 sm:p-4 rounded-lg border ${
                workerData.phoneVerified 
                  ? 'border-green-300 bg-green-50' 
                  : isDarkMode 
                  ? 'border-gray-600 bg-gray-800' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                  <label className={`block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>Phone Verification *</label>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={workerData.phone}
                    onChange={(e) => setWorkerData({ ...workerData, phone: e.target.value })}
                    className={`flex-1 border rounded-lg px-3 py-2 text-sm sm:text-base bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300  text-gray-100'
                    }`}
                    disabled={workerData.phoneVerified}
                  />
                  <button
                    onClick={handleVerifyPhone}
                    disabled={isVerifyingPhone || workerData.phoneVerified || !workerData.phone.trim()}
                    className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                      workerData.phoneVerified
                        ? 'bg-green-500 text-white'
                        : workerData.phone.trim() && !isVerifyingPhone
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {workerData.phoneVerified ? (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : isVerifyingPhone ? (
                      'Verifying...'
                    ) : (
                      'Verify'
                    )}
                  </button>
                </div>
                {workerData.phoneVerified && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Phone verified successfully
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Complete Setup</h2>
            
            {/* Success Message */}
            {submitSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <p className="text-green-800 font-medium">
                    Verification submitted successfully! You will be redirected to your profile.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <div>
                    <p className="text-red-800 font-medium">Submission Failed</p>
                    <p className="text-red-700 text-sm mt-1">{submitError}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Ready to Submit!</h3>
                <p className="text-gray-600">
                  All your information has been verified successfully. Click the button below to submit your worker verification and create your profile.
                </p>
              </div>
              
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h4 className="font-medium mb-3">Verification Summary:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Categories & Skills</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Bio Information ({workerData.bio.length} chars)</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Personal Details</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Work Information</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Profile Photo</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>ID Verification</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Phone Verification</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Selected Categories:</strong> {workerData.categories.join(', ')}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Location:</strong> {workerData.location}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Phone:</strong> {workerData.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center justify-center sm:justify-start gap-2">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              Worker Verification
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Complete your verification to start working on our platform</p>
          </div>
        </div>

        {renderProgressBar()}

        <div className={`rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between space-y-3 sm:space-y-0">
          <button
            onClick={currentStep === 1 ? () => navigate(-1) : handlePrevious}
            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 border rounded-lg transition-colors text-sm sm:text-base ${
              isDarkMode 
                ? 'border-gray-600 hover:bg-gray-800' 
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            {currentStep === 1 ? 'Back' : 'Previous'}
          </button>

          <button
            onClick={currentStep === 8 ? handleComplete : handleNext}
            disabled={!canProceedToNext() || isSubmitting}
            className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              canProceedToNext() && !isSubmitting
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-400 text-white cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                {currentStep === 8 ? 'Submitting...' : 'Processing...'}
              </>
            ) : (
              <>
                {currentStep === 8 ? 'Complete Setup' : 'Next'}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerVerification;