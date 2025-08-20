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

const WorkHistoryItem = ({ job, viewRole, onClick }) => {
  const { isDarkMode } = useDarkMode();

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'accepted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'pending-payment':
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
        return <CheckCircle className="w-4 h-4" />;
      case 'in-progress':
        return <Clock className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending-payment':
        return <CreditCard className="w-4 h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending-payment':
        return 'Pending Payment';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
    }
  };

  const getClientJobData = (job) => {
    if (viewRole === 'client') {
      return {
        ...job,
        title: `Hired ${job.title}`,
        company: `Worker: ${job.company}`,
        description: `You hired a ${job.title.toLowerCase()} for: ${job.description}`,
      };
    }
    return job;
  };

  const displayJob = getClientJobData(job);

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
              <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
              }`}>
                {job.type}
              </span>
            </div>
          </div>

          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-3 md:mb-4 text-xs md:text-sm leading-relaxed`}>
            {displayJob.description}
          </p>

          <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
            {job.skills.map((skill, index) => (
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 text-xs md:text-sm">
            <div className="flex items-center space-x-2">
              <Calendar className={`w-3 h-3 md:w-4 md:h-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <span className={`${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {job.duration}
              </span>
            </div>
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
            <div className="flex items-center space-x-2">
              <DollarSign className={`w-3 h-3 md:w-4 md:h-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <span className={`${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              } font-medium`}>
                {viewRole === 'client' ? `Paid: ${job.salary}` : job.salary}
              </span>
            </div>
          </div>
        </div>

        {job.rating && (
          <div className="flex items-center space-x-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 md:px-4 py-2 rounded-lg self-start">
            <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500 fill-current" />
            <span className={`font-semibold text-sm md:text-base ${
              isDarkMode ? 'text-yellow-300' : 'text-yellow-700'
            }`}>
              {job.rating}
            </span>
            <span className={`text-xs ${
              isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
            }`}>
              {viewRole === 'client' ? '(Your Rating)' : '(Client Rating)'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkHistoryItem;