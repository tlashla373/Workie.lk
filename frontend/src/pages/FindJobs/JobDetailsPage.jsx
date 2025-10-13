import React, { useState, useEffect } from 'react';
import { 
  MapPin, DollarSign, Clock, Building, ArrowLeft, User, Calendar, 
  Phone, Mail, Star, MessageCircle, Briefcase, Users, CheckCircle, 
  AlertCircle, ExternalLink 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { buildWhatsAppUrl } from '../../utils/whatsapp';
import apiService from '../../services/apiService';

/**
 * Enhanced Job Details Page Component
 * Displays comprehensive job information with proper contact details
 */
const JobDetailsPage = ({ job: initialJob, onBack, isDarkMode }) => {
  const navigate = useNavigate();
  
  // State management
  const [jobData, setJobData] = useState(initialJob);
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch complete job data on mount
  useEffect(() => {
    fetchJobDetails();
  }, [initialJob?._id]);

  /**
   * Fetch complete job details with populated client information
   */
  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const jobId = initialJob?._id || initialJob?.id;
      if (!jobId) {
        setLoading(false);
        return;
      }

      // Fetch job data from API - backend already populates client with contact info
      const response = await apiService.get(`/jobs/${jobId}`);
      
      console.log('Job API Response:', response);
      console.log('Job Images:', response?.data?.images);

      if (response?.success && response?.data) {
        const job = response.data;
        console.log('Job data being set:', job);
        console.log('Images array:', job.images);
        setJobData(job);
        
        // Extract client information from populated data
        if (job.client && typeof job.client === 'object') {
          setClientData({
            _id: job.client._id,
            firstName: job.client.firstName,
            lastName: job.client.lastName,
            email: job.client.email,
            phone: job.client.phone,
            profilePicture: job.client.profilePicture,
            fullName: `${job.client.firstName || ''} ${job.client.lastName || ''}`.trim()
          });
          console.log('Client data extracted:', job.client);
        }
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('Failed to load job details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle WhatsApp contact
   */
  const handleWhatsAppContact = () => {
    if (!clientData?.phone) {
      alert('Phone number not available for this client.');
      return;
    }

    const message = `Hi ${clientData.firstName || 'there'}! I'm interested in your job posting: "${jobData?.title}" on Workie.lk. I'd like to discuss this opportunity.`;
    
    const whatsappUrl = buildWhatsAppUrl({
      phoneNumber: clientData.phone,
      text: message
    });

    if (whatsappUrl) {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    } else {
      alert('Unable to open WhatsApp. Please check the phone number.');
    }
  };

  /**
   * Handle email contact
   */
  const handleEmailContact = () => {
    if (!clientData?.email) {
      alert('Email address not available for this client.');
      return;
    }

    const subject = encodeURIComponent(`Inquiry about: ${jobData?.title}`);
    const body = encodeURIComponent(
      `Hi ${clientData.firstName || 'there'},\n\nI'm interested in your job posting "${jobData?.title}" on Workie.lk.\n\nI would like to discuss this opportunity with you.\n\nBest regards`
    );
    
    window.location.href = `mailto:${clientData.email}?subject=${subject}&body=${body}`;
  };

  /**
   * Format currency amount
   */
  const formatBudget = () => {
    if (!jobData?.budget) return 'Negotiable';
    
    const { amount, currency = 'LKR', type } = jobData.budget;
    return `${currency} ${amount?.toLocaleString()}${type ? ` (${type})` : ''}`;
  };

  /**
   * Format date
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Loading job details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{error}</p>
          <button
            onClick={() => onBack?.() || navigate(-1)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => {
          if (onBack) {
            onBack();
          } else {
            navigate('/find-jobs');
          }
        }}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
          isDarkMode 
            ? 'text-gray-300 hover:bg-gray-700' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Jobs</span>
      </button>

      {/* Job Header Section */}
      <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Job Icon/Image */}
          <div className="w-24 h-24 flex-shrink-0">
            {(jobData?.images?.[0]?.url || initialJob?.logo) ? (
              <img 
                src={jobData?.images?.[0]?.url || initialJob?.logo} 
                alt={jobData?.title || initialJob?.title}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  console.error('Image failed to load:', e.target.src);
                }}
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <Building className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Job Title and Info */}
          <div className="flex-1">
            <h1 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {jobData?.title || 'Untitled Job'}
            </h1>
            
            {/* Category Badge */}
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium capitalize">
                {jobData?.category || 'General'}
              </span>
              
              {/* Status Badge */}
              {jobData?.status && (
                <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                  jobData.status === 'open' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                    : jobData.status === 'in-progress'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                }`}>
                  {jobData.status}
                </span>
              )}
            </div>

            {/* Job Quick Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Location */}
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Location</div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {jobData?.location?.city || jobData?.location || 'Not specified'}
                  </div>
                </div>
              </div>

              {/* Budget */}
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                <div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Budget</div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {formatBudget()}
                  </div>
                </div>
              </div>

              {/* Posted Date */}
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                <div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Posted</div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {jobData?.createdAt 
                      ? new Date(jobData.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : 'Recently'
                    }
                  </div>
                </div>
              </div>

              {/* Applications */}
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                <div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Applications</div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                    {jobData?.applicationsCount || 0} / {jobData?.maxApplicants || 50}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills Tags */}
            {jobData?.skills && jobData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {jobData.skills.map((skill, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-md text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={() => navigate('/job-application-page', { state: { job: jobData, jobId: jobData._id } })}
              className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Apply for this Job
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Job Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description */}
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Job Description
            </h2>
            <p className={`leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {jobData?.description || 'No description provided for this job.'}
            </p>

            {/* Duration Info */}
            {jobData?.duration && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-blue-300' : 'text-blue-900'}`}>
                  Duration Details
                </h3>
                <div className={`space-y-1 text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                  {jobData.duration.estimated && (
                    <p>• Estimated: {jobData.duration.estimated}</p>
                  )}
                  {jobData.duration.startDate && (
                    <p>• Start: {formatDate(jobData.duration.startDate)}</p>
                  )}
                  {jobData.duration.endDate && (
                    <p>• End: {formatDate(jobData.duration.endDate)}</p>
                  )}
                  {jobData.duration.isFlexible && (
                    <p className="text-green-600 dark:text-green-400">• Flexible timing available</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Requirements */}
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
            <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Requirements
            </h2>
            <ul className={`space-y-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {jobData?.requirements && jobData.requirements.length > 0 ? (
                jobData.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Experience in {jobData?.category || 'related field'}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Ability to work independently</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Strong attention to detail</span>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Job Images */}
          {jobData?.images && jobData.images.length > 0 && (
            <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
              <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Job Images
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {jobData.images.map((image, index) => (
                  <div key={index} className="relative group cursor-pointer">
                    <img
                      src={image.url}
                      alt={image.description || `Image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg hover:opacity-90 transition-opacity"
                      onClick={() => window.open(image.url, '_blank')}
                    />
                    {image.description && (
                      <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {image.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Client Info & Job Meta */}
        <div className="space-y-6">
          {/* Client Information Card */}
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Posted By
            </h3>
            
            {/* Client Profile */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                {clientData?.profilePicture ? (
                  <img 
                    src={clientData.profilePicture} 
                    alt={clientData.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {clientData?.fullName || 'Client Name'}
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Client
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h5 className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Contact Information
              </h5>
              
              {/* Phone */}
              {clientData?.phone ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-500" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {clientData.phone}
                    </span>
                  </div>
                
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">Phone not provided</span>
                </div>
              )}

              {/* Email */}
              {clientData?.email ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {clientData.email}
                    </span>
                  </div>
                  
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Email not provided</span>
                </div>
              )}

              {/* Message Button */}
              <button
                onClick={handleWhatsAppContact}
                disabled={!clientData?.phone}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                  clientData?.phone
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                <span>{clientData?.phone ? 'Message Client' : 'Contact Unavailable'}</span>
              </button>
            </div>
          </div>

          {/* Job Status Card */}
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Job Status
            </h3>
            <div className="space-y-3">
              {/* Status */}
              <div className="flex justify-between items-center">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  jobData?.status === 'open' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                }`}>
                  {jobData?.status || 'Open'}
                </span>
              </div>

              {/* Experience Level */}
              {jobData?.experienceLevel && jobData.experienceLevel !== 'any' && (
                <div className="flex justify-between items-center">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Experience</span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium capitalize bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300">
                    {jobData.experienceLevel}
                  </span>
                </div>
              )}

              {/* Remote Work */}
              {jobData?.isRemote && (
                <div className="flex justify-between items-center">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Work Type</span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                    Remote Available
                  </span>
                </div>
              )}

              {/* Urgency */}
              {jobData?.urgency && jobData.urgency !== 'normal' && (
                <div className="flex justify-between items-center">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Priority</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
                    jobData.urgency === 'urgent'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
                  }`}>
                    {jobData.urgency}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Job Meta Information */}
          <div className={`rounded-xl p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
            <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Job Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Created</span>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {formatDate(jobData?.createdAt)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Last Updated</span>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {formatDate(jobData?.updatedAt)}
                </span>
              </div>
              {jobData?.duration?.estimated && (
                <div className="flex justify-between">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Duration</span>
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                    {jobData.duration.estimated}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
