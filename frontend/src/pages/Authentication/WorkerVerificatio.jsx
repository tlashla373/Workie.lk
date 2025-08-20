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

  const handleComplete = () => {
    if (isAllStepsComplete()) {
      navigate('/clientprofile');
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return workerData.categories.length === 2; // Must choose exactly 2 categories
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
        return workerData.profilePhoto !== null;
      case 6:
        return workerData.idPhotoFront !== null && workerData.idPhotoBack !== null;
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
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4 relative px-2">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const IconComponent = step.icon;
            
            return (
              <div key={step.id} className="flex flex-col items-center relative" style={{ width: `${100 / steps.length}%` }}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 relative z-10 ${
                  status === 'completed' 
                    ? 'bg-green-500 text-white' 
                    : status === 'current'
                    ? 'bg-blue-500 text-white'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {status === 'completed' ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <IconComponent className="w-5 h-5" />
                  )}
                </div>
                <span className={`text-xs text-center leading-tight max-w-20 ${
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
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Choose Your Categories & Skills</h2>
            
            {/* Worker Categories */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">
                  Select Your Work Categories * (Choose exactly 2)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {workerCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryToggle(category)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
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
                  className={`w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
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
                  className={`w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                    isDarkMode ? 'border-gray-600' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Write Your Bio</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  About Yourself *
                </label>
                <textarea
                  placeholder="Write a brief bio about yourself. Tell potential clients about your work style, reliability, and what makes you a great worker."
                  value={workerData.bio}
                  onChange={(e) => setWorkerData({ ...workerData, bio: e.target.value })}
                  rows={6}
                  className={`w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
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
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Personal Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Age *</label>
                <input
                  type="number"
                  placeholder="Enter your age"
                  value={workerData.age}
                  onChange={(e) => setWorkerData({ ...workerData, age: e.target.value })}
                  min="18"
                  max="70"
                  className={`w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
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
                  className={`w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
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
                  className={`w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDarkMode ? 'border-gray-600' : 'border-gray-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">City *</label>
                  <input
                    type="text"
                    placeholder="Enter your city"
                    value={workerData.city}
                    onChange={(e) => setWorkerData({ ...workerData, city: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
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
                    className={`w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
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
      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Profile Photo</h2>
            <div className="flex flex-col items-center space-y-4">
              {profileImagePreview ? (
                <div className="text-center">
                  <img
                    src={profileImagePreview}
                    alt="Profile preview"
                    className="w-32 h-32 object-cover rounded-full border-4 border-blue-500 mb-4"
                  />
                  <p className="text-sm text-green-600 flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Photo uploaded successfully
                  </p>
                </div>
              ) : (
                <div className={`w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center ${
                  isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
                }`}>
                  <Camera className="w-8 h-8 text-gray-400" />
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
      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">ID Verification</h2>
            <p className="text-sm text-gray-600 mb-6">
              Please upload clear photos of both sides of your government-issued ID for verification.
            </p>
            
            {/* ID Front Photo */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">ID Front Photo</h3>
              <div className="flex flex-col items-center space-y-4">
                {idFrontImagePreview ? (
                  <div className="text-center">
                    <img
                      src={idFrontImagePreview}
                      alt="ID Front preview"
                      className="w-64 h-40 object-cover rounded-lg border-2 border-blue-500 mb-4"
                    />
                    <p className="text-sm text-green-600 flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      ID Front uploaded successfully
                    </p>
                  </div>
                ) : (
                  <div className={`w-64 h-40 rounded-lg border-2 border-dashed flex items-center justify-center ${
                    isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
                  }`}>
                    <div className="text-center">
                      <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
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
            <div className="space-y-4">
              <h3 className="text-lg font-medium">ID Back Photo</h3>
              <div className="flex flex-col items-center space-y-4">
                {idBackImagePreview ? (
                  <div className="text-center">
                    <img
                      src={idBackImagePreview}
                      alt="ID Back preview"
                      className="w-64 h-40 object-cover rounded-lg border-2 border-blue-500 mb-4"
                    />
                    <p className="text-sm text-green-600 flex items-center justify-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      ID Back uploaded successfully
                    </p>
                  </div>
                ) : (
                  <div className={`w-64 h-40 rounded-lg border-2 border-dashed flex items-center justify-center ${
                    isDarkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-300 bg-gray-50'
                  }`}>
                    <div className="text-center">
                      <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
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
      case 7:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Verification</h2>
            <div className="space-y-6">
              <div className={`p-4 rounded-lg border ${
                workerData.phoneVerified 
                  ? 'border-green-300 bg-green-50' 
                  : isDarkMode 
                  ? 'border-gray-600 bg-gray-800' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="w-5 h-5 text-blue-500" />
                  <label className={`block ${isDarkMode ? 'text-gray-800' : 'text-gray-600'} text-sm font-medium`}>Phone Verification *</label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={workerData.phone}
                    onChange={(e) => setWorkerData({ ...workerData, phone: e.target.value })}
                    className={`flex-1 border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode ? 'border-gray-600 text-gray-800' : 'border-gray-300  text-gray-400'
                    }`}
                    disabled={workerData.phoneVerified}
                  />
                  <button
                    onClick={handleVerifyPhone}
                    disabled={isVerifyingPhone || workerData.phoneVerified || !workerData.phone.trim()}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      workerData.phoneVerified
                        ? 'bg-green-500 text-white'
                        : workerData.phone.trim() && !isVerifyingPhone
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {workerData.phoneVerified ? (
                      <CheckCircle className="w-5 h-5" />
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
    <div className={`min-h-screen px-4 py-8 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
              <Shield className="w-8 h-8 text-blue-500" />
              Worker Verification
            </h1>
            <p className="text-gray-600">Complete your verification to start working on our platform</p>
          </div>
        </div>

        {renderProgressBar()}

        <div className={`rounded-xl p-6 mb-8 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={currentStep === 1 ? () => navigate(-1) : handlePrevious}
            className={`flex items-center gap-2 px-6 py-2 border rounded-lg transition-colors ${
              isDarkMode 
                ? 'border-gray-600 hover:bg-gray-800' 
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            {currentStep === 1 ? 'Back' : 'Previous'}
          </button>

          <button
            onClick={currentStep === 8 ? handleComplete : handleNext}
            disabled={!canProceedToNext()}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
              canProceedToNext()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-400 text-white cursor-not-allowed'
            }`}
          >
            {currentStep === 8 ? 'Complete Setup' : 'Next'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerVerification;