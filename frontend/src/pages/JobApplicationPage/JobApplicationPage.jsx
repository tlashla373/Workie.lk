import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Upload, 
  CreditCard, 
  HandCoins,
  Check,
  AlertCircle,
  Calendar,
  DollarSign,
  Send
} from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthChecker from '../../components/ProtectionPage/AuthChecker';
import axios from 'axios';

const JobApplicationPage = ({ onBack }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const { user } = useAuth();
  
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('auth_token');
  
  // If not authenticated, show auth checker
  if (!isAuthenticated) {
    return <AuthChecker />;
  }
  
  // Get job data from location state
  const job = location.state?.job;
  const jobId = location.state?.jobId;

  console.log('JobApplicationPage - job data:', job);
  console.log('JobApplicationPage - jobId:', jobId);
  console.log('JobApplicationPage - location.state:', location.state);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    experience: '',
    expectedRate: '',
    startDate: '',
    paymentMethod: 'online'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Auto-fill form with user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.fullName || user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: user.email || '',
        phone: user.phone || user.phoneNumber || '',
        // Keep other fields empty for user to fill
      }));
      setLoading(false);
    }
  }, [user]);

  // Show loading state while user data is being fetched
  if (loading || !user) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const currentJob = job;

  // Handle case when job data is missing
  if (!currentJob && !jobId) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className={`text-center p-8 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Job Information Missing
          </h2>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
            Unable to load job details for this application.
          </p>
          <button
            onClick={() => navigate('/findjobs')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.coverLetter.trim()) newErrors.coverLetter = 'Cover letter is required';
    if (!formData.expectedRate.trim()) newErrors.expectedRate = 'Expected rate is required';
    if (!formData.startDate.trim()) newErrors.startDate = 'Start date is required';
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Get authentication token
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert('Please login to submit your application');
        navigate('/login');
        return;
      }

      // Determine job ID and validate
      const submissionJobId = currentJob?.id || jobId;
      
      console.log('Job ID being submitted:', submissionJobId);
      console.log('Job ID type:', typeof submissionJobId);
      console.log('Current job object:', currentJob);
      
      if (!submissionJobId) {
        alert('Job ID is missing. Please go back and select a job to apply for.');
        setIsSubmitting(false);
        return;
      }

      // Prepare application data (matching backend Application model fields)
      const applicationData = {
        job: submissionJobId,
        coverLetter: formData.coverLetter,
        proposedPrice: {
          amount: parseFloat(formData.expectedRate) || 0,
          currency: 'LKR'
        },
        estimatedDuration: '1-2 weeks', // Default for now
        availability: formData.startDate || 'Immediate',
        portfolio: [] // Empty for now, can be added later
      };
      
      console.log('Submitting application with data:', applicationData);

      // Submit application to backend API
      const response = await axios.post('/api/applications', applicationData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Application response:', response.data);

      if (response.data && response.data.success) {
        alert(`Application submitted successfully for ${currentJob?.title || 'the position'} at ${currentJob?.company || 'the company'}!`);
        // Navigate back to job details or jobs list
        navigate(-1);
      } else {
        throw new Error(response.data?.message || 'Failed to submit application');
      }
      
    } catch (error) {
      console.error('Error submitting application:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        localStorage.removeItem('auth_token');
        navigate('/login');
      } else if (error.response?.status === 400) {
        alert(error.response.data?.message || 'Invalid application data. Please check your information and try again.');
      } else if (error.response?.status === 404) {
        alert('Job not found. This job may no longer be available.');
      } else if (error.response?.status === 409) {
        alert('You have already applied for this job.');
      } else {
        alert(error.response?.data?.message || 'Failed to submit application. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Job Details</span>
        </button>
      </div>

      {/* Job Info Summary */}
      <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-700/30' : 'bg-white border border-gray-200'}`}>
        <h1 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Apply for {currentJob?.title || 'Job Position'}
        </h1>
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          at {currentJob?.company || 'Company'}
        </p>
        {currentJob && (
          <div className="flex flex-wrap gap-4 mt-4 text-sm">
            {currentJob.salary && (
              <div className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{currentJob.salary}</span>
              </div>
            )}
            {currentJob.type && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{currentJob.type}</span>
              </div>
            )}
          </div>
        )}
        {!currentJob && (
          <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800'}`}>
            <p className="text-sm">⚠️ Job details not available. You can still submit your application.</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-700/30' : 'bg-white border border-gray-200'}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Personal Information
            </h2>
            {user && (
              <div className="flex items-center space-x-2">
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800'
                }`}>
                  ✓ Auto-filled from your profile
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    fullName: user.fullName || user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
                    email: user.email || '',
                    phone: user.phone || user.phoneNumber || '',
                  }))}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Reset to Profile Data
                </button>
              </div>
            )}
          </div>
          
          <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Your profile information has been automatically filled below. You can edit any field as needed.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-600/50 border-gray-500 text-white placeholder-gray-400 focus:border-blue-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  } ${errors.fullName ? 'border-red-500' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <div className="flex items-center space-x-1 mt-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.fullName}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-600/50 border-gray-500 text-white placeholder-gray-400 focus:border-blue-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  } ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <div className="flex items-center space-x-1 mt-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-600/50 border-gray-500 text-white placeholder-gray-400 focus:border-blue-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  } ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <div className="flex items-center space-x-1 mt-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Available Start Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-600/50 border-gray-500 text-white focus:border-blue-400' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                  } ${errors.startDate ? 'border-red-500' : ''}`}
                />
                {errors.startDate && (
                  <div className="flex items-center space-x-1 mt-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.startDate}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-700/30' : 'bg-white border border-gray-200'}`}>
          <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Professional Information
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Expected Rate *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.expectedRate}
                  onChange={(e) => handleInputChange('expectedRate', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors duration-200 ${
                    isDarkMode 
                      ? 'bg-gray-600/50 border-gray-500 text-white placeholder-gray-400 focus:border-blue-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                  } ${errors.expectedRate ? 'border-red-500' : ''}`}
                  placeholder="e.g., $50/hour or $80,000/year"
                />
                {errors.expectedRate && (
                  <div className="flex items-center space-x-1 mt-2 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.expectedRate}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Years of Experience
              </label>
              <input
                type="text"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-600/50 border-gray-500 text-white placeholder-gray-400 focus:border-blue-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                }`}
                placeholder="e.g., 5 years"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Cover Letter *
              </label>
              <textarea
                value={formData.coverLetter}
                onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                rows={5}
                className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 resize-none ${
                  isDarkMode 
                    ? 'bg-gray-600/50 border-gray-500 text-white placeholder-gray-400 focus:border-blue-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
                } ${errors.coverLetter ? 'border-red-500' : ''}`}
                placeholder="Tell us why you're perfect for this role..."
              />
              {errors.coverLetter && (
                <div className="flex items-center space-x-1 mt-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.coverLetter}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-700/30' : 'bg-white border border-gray-200'}`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex-1 py-4 px-6 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                isSubmitting
                  ? isDarkMode
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-[1.02]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={onBack}
              className={`px-6 py-4 rounded-lg font-medium transition-all duration-200 border ${
                isDarkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Save as Draft
            </button>
          </div>
          
          <p className={`text-xs text-center mt-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            By submitting this application, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobApplicationPage;