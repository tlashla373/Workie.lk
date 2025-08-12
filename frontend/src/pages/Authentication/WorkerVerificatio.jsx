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
  const [clientData, setClientData] = useState({
    location: '',
    address: '',
    companyName: '',
    profilePhoto: null,
    idPhotoFront: null,
    idPhotoBack: null,
    emailVerified: false,
    phoneVerified: false,
    email: '',
    phone: '',
  });

  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);

  const steps = [
    { id: 1, title: 'Basic Information', icon: FileText },
    { id: 2, title: 'Profile Photo', icon: Camera },
    { id: 3, title: 'ID Verification', icon: CreditCard },
    { id: 4, title: 'Contact Verification', icon: Shield },
    { id: 5, title: 'Complete Setup', icon: CheckCircle }
  ];

  const profileImagePreview = useMemo(() => {
    if (clientData.profilePhoto) {
      return URL.createObjectURL(clientData.profilePhoto);
    }
    return null;
  }, [clientData.profilePhoto]);

  const idFrontImagePreview = useMemo(() => {
    if (clientData.idPhotoFront) {
      return URL.createObjectURL(clientData.idPhotoFront);
    }
    return null;
  }, [clientData.idPhotoFront]);

  const idBackImagePreview = useMemo(() => {
    if (clientData.idPhotoBack) {
      return URL.createObjectURL(clientData.idPhotoBack);
    }
    return null;
  }, [clientData.idPhotoBack]);

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
    setClientData(prev => ({ ...prev, emailVerified: true }));
    setIsVerifyingEmail(false);
  };

  const handleVerifyPhone = async () => {
    setIsVerifyingPhone(true);
    await new Promise(res => setTimeout(res, 1500));
    setClientData(prev => ({ ...prev, phoneVerified: true }));
    setIsVerifyingPhone(false);
  };

  const handleComplete = () => {
    if (isAllStepsComplete()) {
      navigate('/clientprofile');
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 1:
        return clientData.location.trim() !== '' && clientData.address.trim() !== '';
      case 2:
        return clientData.profilePhoto !== null;
      case 3:
        return clientData.idPhotoFront !== null && clientData.idPhotoBack !== null;
      case 4:
        return clientData.email.trim() !== '' && 
               clientData.phone.trim() !== '' && 
               clientData.emailVerified && 
               clientData.phoneVerified;
      case 5:
        return isStepValid(1) && isStepValid(2) && isStepValid(3) && isStepValid(4);
      default:
        return false;
    }
  };

  const isAllStepsComplete = () => {
    return isStepValid(1) && isStepValid(2) && isStepValid(3) && isStepValid(4);
  };

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const canProceedToNext = () => {
    return isStepValid(currentStep);
  };

  const handleNext = () => {
    if (canProceedToNext() && currentStep < 5) {
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
        <div className="flex items-center justify-between mb-4 relative">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const IconComponent = step.icon;
            
            return (
              <div key={step.id} className="flex flex-col items-center flex-1 relative">
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
                <span className={`text-xs text-center px-1 ${
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
                    width: `calc(100vw / ${steps.length} - 2.5rem)`,
                    transform: 'translateX(1.25rem)'
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
            <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Current Location *</label>
                  <input
                    type="text"
                    placeholder="Enter your current location"
                    value={clientData.location}
                    onChange={(e) => setClientData({ ...clientData, location: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Work Address *</label>
                  <input
                    type="text"
                    placeholder="Enter your work address"
                    value={clientData.address}
                    onChange={(e) => setClientData({ ...clientData, address: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-500" />
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <input
                    type="text"
                    placeholder="Enter company name (optional)"
                    value={clientData.companyName}
                    onChange={(e) => setClientData({ ...clientData, companyName: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
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
                      setClientData({ ...clientData, profilePhoto: file });
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

      case 3:
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
                        setClientData({ ...clientData, idPhotoFront: file });
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
                        setClientData({ ...clientData, idPhotoBack: file });
                      }
                    }}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Contact Verification</h2>
            <div className="space-y-6">
              <div className={`p-4 rounded-lg border ${
                clientData.emailVerified 
                  ? 'border-green-300 bg-green-50' 
                  : isDarkMode 
                  ? 'border-gray-600 bg-gray-800' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <Mail className="w-5 h-5 text-blue-500" />
                  <label className="block text-sm font-medium">Email Verification *</label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={clientData.email}
                    onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                    className={`flex-1 border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}
                    disabled={clientData.emailVerified}
                  />
                  <button
                    onClick={handleVerifyEmail}
                    disabled={isVerifyingEmail || clientData.emailVerified || !clientData.email.trim()}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      clientData.emailVerified
                        ? 'bg-green-500 text-white'
                        : clientData.email.trim() && !isVerifyingEmail
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {clientData.emailVerified ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : isVerifyingEmail ? (
                      'Verifying...'
                    ) : (
                      'Verify'
                    )}
                  </button>
                </div>
                {clientData.emailVerified && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Email verified successfully
                  </p>
                )}
              </div>

              <div className={`p-4 rounded-lg border ${
                clientData.phoneVerified 
                  ? 'border-green-300 bg-green-50' 
                  : isDarkMode 
                  ? 'border-gray-600 bg-gray-800' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="w-5 h-5 text-blue-500" />
                  <label className="block text-sm font-medium">Phone Verification *</label>
                </div>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={clientData.phone}
                    onChange={(e) => setClientData({ ...clientData, phone: e.target.value })}
                    className={`flex-1 border rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}
                    disabled={clientData.phoneVerified}
                  />
                  <button
                    onClick={handleVerifyPhone}
                    disabled={isVerifyingPhone || clientData.phoneVerified || !clientData.phone.trim()}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      clientData.phoneVerified
                        ? 'bg-green-500 text-white'
                        : clientData.phone.trim() && !isVerifyingPhone
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {clientData.phoneVerified ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : isVerifyingPhone ? (
                      'Verifying...'
                    ) : (
                      'Verify'
                    )}
                  </button>
                </div>
                {clientData.phoneVerified && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Phone verified successfully
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
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
                    <span>Basic Information</span>
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
                    <span>Email Verification</span>
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
            onClick={currentStep === 5 ? handleComplete : handleNext}
            disabled={!canProceedToNext()}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${
              canProceedToNext()
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-400 text-white cursor-not-allowed'
            }`}
          >
            {currentStep === 5 ? 'Complete Setup' : 'Next'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerVerification;