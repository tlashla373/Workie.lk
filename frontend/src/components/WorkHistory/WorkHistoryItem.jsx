// components/WorkHistoryItem.jsx
import React from 'react';
import { 
  Calendar, 
  MapPin, 
  DollarSign, 
  Star, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  CreditCard 
} from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const WorkHistoryItem = ({ job, userType = 'worker', onClick }) => {
  const { isDarkMode } = useDarkMode();

  // Debug logging to help troubleshoot any remaining issues
  console.log('WorkHistoryItem - job data:', job);
  console.log('WorkHistoryItem - userType:', userType);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'closed':
      case 'reviewed':
      case 'payment-confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in-progress':
      case 'work-in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'accepted':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
      case 'pending':
      case 'applied':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'pending-payment':
      case 'awaiting-payment':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
      case 'closed':
      case 'reviewed':
      case 'payment-confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'in-progress':
      case 'work-in-progress':
        return <Clock className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
      case 'applied':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4" />;
      case 'withdrawn':
        return <AlertCircle className="w-4 h-4" />;
      case 'pending-payment':
      case 'awaiting-payment':
        return <CreditCard className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'applied':
        return 'Applied';
      case 'pending-payment':
      case 'awaiting-payment':
        return 'Pending Payment';
      case 'in-progress':
      case 'work-in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      case 'closed':
        return 'Closed';
      case 'reviewed':
        return 'Reviewed';
      case 'payment-confirmed':
        return 'Payment Confirmed';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'withdrawn':
        return 'Withdrawn';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
    }
  };

  const getEmployerJobData = (job) => {
    if (userType === 'employer') {
      return {
        ...job,
        title: job.title ? `Hired: ${job.title}` : 'Hired Worker',
        company: job.company || 'Unknown Worker',
        description: job.description || job.coverLetter || 'No description provided',
      };
    }
    return job;
  };

  // Helper function to get salary display
  const getSalaryDisplay = (job) => {
    // If already formatted as string (from service)
    if (typeof job.salary === 'string') {
      return job.salary;
    }
    
    // If proposedPrice object exists
    if (job.proposedPrice?.amount) {
      return `LKR ${job.proposedPrice.amount}${job.proposedPrice.per ? `/${job.proposedPrice.per}` : ''}`;
    }
    
    // Fallback
    return 'Not specified';
  };

  // Helper function to safely get skills array
  const getSkills = (job) => {
    if (Array.isArray(job.skills)) {
      return job.skills;
    }
    // If no skills, return empty array or derive from other data
    return [];
  };

  // Helper function to get rating
  const getRating = (job) => {
    // Check multiple possible locations for rating
    if (job.review?.rating) {
      console.log('Rating found in job.review.rating:', job.review.rating);
      return job.review.rating;
    }
    if (job.rating) {
      console.log('Rating found in job.rating:', job.rating);
      return job.rating;
    }
    console.log('No rating found for job:', job.id || job._id);
    return null;
  };

  // Helper function to get review comment
  const getReviewComment = (job) => {
    if (job.review?.comment) {
      return job.review.comment;
    }
    return null;
  };

  const displayJob = getEmployerJobData(job);

  return (
    <div
      className={`${
        isDarkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
      } rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6 shadow-sm border ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      } transition-all duration-300 cursor-pointer hover:shadow-md hover:scale-[1.01]`}
      onClick={onClick}
    >
      <div className="flex flex-col space-y-3 md:space-y-4">
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-2 md:space-y-0 mb-3">
            <div className="flex-1">
              <h3 className={`text-base md:text-lg lg:text-xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } mb-1`}>
                {displayJob.title}
              </h3>
              <p className={`text-sm md:text-base lg:text-lg ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              } font-medium`}>
                {displayJob.company}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(job.status)}`}>
                {getStatusIcon(job.status)}
                <span>{getStatusText(job.status)}</span>
              </span>
              {job.type && (
                <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                  isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                }`}>
                  {job.type}
                </span>
              )}
            </div>
          </div>

          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3 md:mb-4 text-xs md:text-sm leading-relaxed`}>
            {displayJob.description || displayJob.coverLetter || 'No description available'}
          </p>

          {getSkills(job).length > 0 && (
            <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
              {getSkills(job).map((skill, index) => (
                <span
                  key={index}
                  className={`px-2 md:px-3 py-1 rounded-lg text-xs font-medium ${
                    isDarkMode 
                      ? 'bg-blue-900/30 text-blue-300' 
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
            {job.duration && (
              <div className="flex items-center space-x-2">
                <Calendar className={`w-3 h-3 md:w-4 md:h-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <span className={`${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {job.duration || job.estimatedDuration || 'Not specified'}
                </span>
              </div>
            )}
            {job.location && (
              <div className="flex items-center space-x-2">
                <MapPin className={`w-3 h-3 md:w-4 md:h-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <span className={`${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {job.location}
                </span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <DollarSign className={`w-3 h-3 md:w-4 md:h-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <span className={`${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              } font-medium`}>
                {userType === 'employer' ? `Paid: ${getSalaryDisplay(job)}` : getSalaryDisplay(job)}
              </span>
            </div>
          </div>
        </div>

        {getRating(job) && (
          <div className="flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 md:px-4 py-2 rounded-lg self-start">
            <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 fill-current" />
            <span className={`font-semibold text-sm md:text-base ${
              isDarkMode ? 'text-yellow-300' : 'text-yellow-700'
            }`}>
              {getRating(job)}/5
            </span>
            <span className={`text-xs ${
              isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
            }`}>
              {userType === 'employer' ? '(Your Rating)' : '(Client Rating)'}
            </span>
            {getReviewComment(job) && (
              <span className={`text-xs ml-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                - "{getReviewComment(job).substring(0, 50)}{getReviewComment(job).length > 50 ? '...' : ''}"
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkHistoryItem;