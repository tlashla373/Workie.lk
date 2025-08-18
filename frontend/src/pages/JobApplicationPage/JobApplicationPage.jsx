import React, { useState } from 'react';
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
import { useNavigate } from 'react-router-dom';

const JobApplicationPage = ({ job, onBack }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    experience: '',
    expectedRate: '',
    startDate: '',
    paymentMethod: 'online',
    resumeFile: null,
    portfolioFile: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({ ...prev, [field]: file }));
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
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Application submitted successfully!');
    }, 2000);
  };

  // Mock job data if not provided
  const mockJob = {
    title: 'Senior Full Stack Developer',
    company: 'TechCorp Inc.',
    salary: '$80,000 - $120,000',
    type: 'Full-time',
    location: 'Remote'
  };

  const currentJob = job || mockJob;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/findjobs')}
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
          Apply for {currentJob.title}
        </h1>
        <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          at {currentJob.company}
        </p>
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{currentJob.salary}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{currentJob.type}</span>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Personal Information */}
        <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-700/30' : 'bg-white border border-gray-200'}`}>
          <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Personal Information
          </h2>
          
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

        {/* File Uploads */}
        <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-700/30' : 'bg-white border border-gray-200'}`}>
          <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Documents
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Resume / CV
              </label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
                isDarkMode 
                  ? 'border-gray-600 hover:border-gray-500 bg-gray-600/20' 
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50'
              }`}>
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Click to upload or drag and drop
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  PDF, DOC, DOCX (Max 5MB)
                </p>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload('resumeFile', e.target.files[0])}
                />
              </div>
              {formData.resumeFile && (
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  ✓ {formData.resumeFile.name}
                </p>
              )}
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Portfolio (Optional)
              </label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${
                isDarkMode 
                  ? 'border-gray-600 hover:border-gray-500 bg-gray-600/20' 
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50'
              }`}>
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Click to upload or drag and drop
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  PDF, ZIP (Max 10MB)
                </p>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.zip"
                  onChange={(e) => handleFileUpload('portfolioFile', e.target.files[0])}
                />
              </div>
              {formData.portfolioFile && (
                <p className={`text-sm mt-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  ✓ {formData.portfolioFile.name}
                </p>
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