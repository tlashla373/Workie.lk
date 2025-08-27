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
import apiService from '../../services/apiService';
import mediaService from '../../services/mediaService';
import FileUpload from '../../components/ui/FileUpload';

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
    profilePhotoUrl: '',
    idPhotoFront: null,
    idPhotoFrontUrl: '',
    idPhotoBack: null,
    idPhotoBackUrl: '',
    emailVerified: false,
    phoneVerified: false,
    phone: '',
  });

  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);

  // Function to submit worker verification data to backend
  const submitWorkerVerificationData = async () => {
    try {
      // Check if user is authenticated
      const token = apiService.getAuthToken();
      if (!token) {
        throw new Error('You must be logged in to submit verification data');
      }

      // Prepare data as JSON (no file uploads for now)
      const verificationData = {
        categories: JSON.stringify(workerData.categories),
        skills: workerData.skills,
        experience: workerData.experience,
        bio: workerData.bio,
        age: workerData.age,
        country: workerData.country,
        streetAddress: workerData.streetAddress,
        city: workerData.city,
        postalCode: workerData.postalCode,
        location: workerData.location,
        address: workerData.address,
        companyName: workerData.companyName,
        phone: workerData.phone
      };

      console.log('Submitting verification data:', verificationData);
      console.log('Auth token exists:', !!token);

      // Submit to backend using apiService
      const response = await apiService.post('/auth/worker-verification', verificationData);
      console.log('Response from backend:', response);
      
      if (response.success) {
        return response;
      } else {
        throw new Error(response.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Error submitting verification data:', error);
      
      // Provide more specific error messages
      if (error.message.includes('401') || error.message.includes('authentication')) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.message.includes('400') || error.message.includes('validation')) {
        throw new Error(error.message || 'Validation failed. Please check all required fields.');
      } else if (error.message.includes('Network') || error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        throw new Error(error.message || 'Server error during worker verification submission. Please try again.');
      }
    }
  };

  // Available worker categories
  const workerCategories = [
    'Plumber', 'Electrician', 'Carpenter', 'Mason', 'Painter', 'Welder',
    'HVAC Technician', 'Roofer', 'Landscaper', 'Cleaner', 'Mechanic', 'Driver'
  ];

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
        return {
          ...prev,
          categories: currentCategories.filter(c => c !== category)
        };
      } else if (currentCategories.length < 2) {
        return {
          ...prev,
          categories: [...currentCategories, category]
        };
      }
      return prev;
    });
  };

  const handleComplete = async () => {
    if (isAllStepsComplete()) {
      try {
        setIsSubmitting(true);
        
        // Validate data before submission
        if (workerData.categories.length === 0) {
          alert('Please select at least one work category.');
          return;
        }
        
        if (!workerData.bio.trim()) {
          alert('Please provide a bio describing yourself.');
          return;
        }
        
        if (!workerData.phone.trim() || !workerData.phoneVerified) {
          alert('Please verify your phone number.');
          return;
        }
        
        console.log('Starting worker verification submission...');
        const response = await submitWorkerVerificationData();
        
        if (response && response.success) {
          // Show success message
          alert('Worker verification submitted successfully! Your profile is now under review.');
          navigate('/clientprofile');
        } else {
          throw new Error(response?.message || 'Unknown error occurred');
        }
      } catch (error) {
        console.error('Error submitting verification data:', error);
        alert(`Failed to save verification data: ${error.message}. Please try again.`);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('Please complete all required steps before submitting.');
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return workerData.categories.length >= 1 && workerData.categories.length <= 2; // Must choose 1-2 categories
      case 2:
        return workerData.bio.trim() !== '';
      case 3:
        return workerData.age.trim() !== '' && 
               workerData.country.trim() !== '' && 
               workerData.streetAddress.trim() !== '' && 
               workerData.city.trim() !== '' && 
               workerData.postalCode.trim() !== '';
      case 4:
        return workerData.location.trim() !== '' && workerData.address.trim() !== '';
      case 5:
        return true; // Skip photo requirement for now
      case 6:
        return true; // Skip ID photo requirement for now
      case 7:
        return workerData.phone.trim() !== '' && 
               workerData.phoneVerified;
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
    // Step 1 can be skipped if categories are selected but skills/experience are empty
    if (currentStep === 1) {
      return workerData.categories.length === 2;
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
                <label className="block text-sm font-medium mb-2 sm:mb-3">
                  Select Your Work Categories * (Choose 1-2 categories)
                </label>
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
                <p className="text-xs text-gray-500 mt-2">
                  Selected: {workerData.categories.length}/2 categories
                </p>
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
                  About Yourself *
                </label>
                <textarea
                  placeholder="Write a brief bio about yourself. Tell potential clients about your work style, reliability, and what makes you a great worker."
                  value={workerData.bio}
                  onChange={(e) => setWorkerData({ ...workerData, bio: e.target.value })}
                  rows={5}
                  className={`w-full border rounded-lg px-3 py-2 text-sm sm:text-base bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                    isDarkMode ? 'border-gray-600' : 'border-gray-300'
                  }`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {workerData.bio.length}/500 characters
                </p>
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
                <label className="block text-sm font-medium mb-1">Age *</label>
                <input
                  type="number"
                  placeholder="Enter your age"
                  value={workerData.age}
                  onChange={(e) => setWorkerData({ ...workerData, age: e.target.value })}
                  min="18"
                  max="70"
                  className={`w-full border rounded-lg px-3 py-2 text-sm sm:text-base bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDarkMode ? 'border-gray-600' : 'border-gray-300'
                  }`}
                />
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
                <Building className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Preferred Work Areas *</label>
                  <input
                    type="text"
                    placeholder="Enter areas where you prefer to work"
                    value={workerData.address}
                    onChange={(e) => setWorkerData({ ...workerData, address: e.target.value })}
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
            <div className="max-w-md mx-auto">
              <FileUpload
                uploadType="profile"
                maxFiles={1}
                maxSizeInMB={5}
                acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                onFileUpload={(result, files) => {
                  console.log('Profile photo uploaded:', result);
                  setWorkerData(prev => ({
                    ...prev,
                    profilePhoto: files[0],
                    profilePhotoUrl: result?.url
                  }));
                }}
                onFileRemove={() => {
                  setWorkerData(prev => ({
                    ...prev,
                    profilePhoto: null,
                    profilePhotoUrl: null
                  }));
                }}
                uploadText="Upload your profile photo"
                showPreview={true}
              />
              
              <div className="text-center mt-4">
                <p className="text-xs text-gray-500">
                  This photo will be visible to potential clients. Choose a clear, professional image.
                </p>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">ID Verification</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Upload ID Photos</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Please upload clear photos of the front and back of your government-issued ID
                </p>
                
                {/* ID Front Photo */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">ID Front Photo</label>
                  <FileUpload
                    uploadType="verification"
                    maxFiles={1}
                    maxSizeInMB={10}
                    acceptedTypes={['image/jpeg', 'image/png']}
                    onFileUpload={(result, files) => {
                      console.log('ID front uploaded:', result);
                      setWorkerData(prev => ({
                        ...prev,
                        idPhotoFront: files[0],
                        idPhotoFrontUrl: result?.files?.idPhotoFront?.url
                      }));
                    }}
                    onFileRemove={() => {
                      setWorkerData(prev => ({
                        ...prev,
                        idPhotoFront: null,
                        idPhotoFrontUrl: null
                      }));
                    }}
                    uploadText="Upload front of ID"
                    showPreview={true}
                    className="mb-4"
                  />
                </div>

                {/* ID Back Photo */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">ID Back Photo</label>
                  <FileUpload
                    uploadType="verification"
                    maxFiles={1}
                    maxSizeInMB={10}
                    acceptedTypes={['image/jpeg', 'image/png']}
                    onFileUpload={(result, files) => {
                      console.log('ID back uploaded:', result);
                      setWorkerData(prev => ({
                        ...prev,
                        idPhotoBack: files[0],
                        idPhotoBackUrl: result?.files?.idPhotoBack?.url
                      }));
                    }}
                    onFileRemove={() => {
                      setWorkerData(prev => ({
                        ...prev,
                        idPhotoBack: null,
                        idPhotoBackUrl: null
                      }));
                    }}
                    uploadText="Upload back of ID"
                    showPreview={true}
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <CreditCard className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">ID Verification Tips</h4>
                    <ul className="text-xs text-blue-600 mt-1 space-y-1">
                      <li>• Ensure all text is clearly readable</li>
                      <li>• Take photos in good lighting</li>
                      <li>• Avoid glare and shadows</li>
                      <li>• Include all edges of the ID</li>
                    </ul>
                  </div>
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
                  <label className={`block ${isDarkMode ? 'text-gray-800' : 'text-gray-600'} text-sm font-medium`}>Phone Verification *</label>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={workerData.phone}
                    onChange={(e) => setWorkerData({ ...workerData, phone: e.target.value })}
                    className={`flex-1 border rounded-lg px-3 py-2 text-sm sm:text-base bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode ? 'border-gray-600 text-gray-800' : 'border-gray-300  text-gray-400'
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
            <div className="space-y-4">
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Verification Complete!</h3>
                <p className="text-gray-600">
                  All your information has been verified successfully. You can now complete your worker profile setup.
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
                    <span>Bio Information</span>
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
              'Submitting...'
            ) : currentStep === 8 ? (
              'Complete Setup'
            ) : (
              'Next'
            )}
            {!isSubmitting && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerVerification;
