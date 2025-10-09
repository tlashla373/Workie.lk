import React from 'react';
import { Award, Star, MapPin, Phone, Mail, Trophy, Clock, CheckCircle } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import useAuth from '../../hooks/useAuth';
import useTopRatedWorkers from '../../hooks/useTopRatedWorkers';

const TopRankingCard = ({ limit = 5, onContactWorker, onViewProfile }) => {
  const { isDarkMode } = useDarkMode();
  const { user } = useAuth();
  
  // Use the comprehensive data fetching hook
  const { workers: topWorkers, loading, error, refetch } = useTopRatedWorkers(limit);

  const handleCallWorker = (worker) => {
    if (onContactWorker) {
      onContactWorker(worker, 'call');
    } else {
      // Default call behavior
      if (worker.phone) {
        if (navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
          window.open(`tel:${worker.phone}`);
        } else {
          navigator.clipboard.writeText(worker.phone).then(() => {
            alert(`Phone number ${worker.phone} copied to clipboard`);
          }).catch(() => {
            alert(`Call ${worker.name} at ${worker.phone}`);
          });
        }
      } else {
        alert('Phone number not available');
      }
    }
  };

  const handleEmailWorker = (worker) => {
    if (onContactWorker) {
      onContactWorker(worker, 'email');
    } else {
      // Default email behavior
      if (worker.email) {
        const subject = encodeURIComponent(`Hello ${worker.name}`);
        const body = encodeURIComponent(`Hi ${worker.name},\n\nI'm interested in your ${worker.profession.toLowerCase()} services.\n\nBest regards`);
        window.open(`mailto:${worker.email}?subject=${subject}&body=${body}`);
      } else {
        alert('Email address not available');
      }
    }
  };

  const handleViewProfile = (worker) => {
    if (onViewProfile) {
      onViewProfile(worker);
    } else {
      console.log('Viewing profile for worker:', worker.name);
      // Default navigation logic can be implemented here
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current opacity-50" />
        );
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-300" />
        );
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
        <div className="animate-pulse space-y-4">
          <div className={`h-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`h-32 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg`}></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border p-6`}>
        <div className="text-center">
          <Award className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Unable to Load Top Workers
          </p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
            {error}
          </p>
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl shadow-lg border overflow-hidden`}>
      {/* Header */}
      <div className="p-2 border-b border-gray-200 dark:border-gray-300">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-400 rounded-lg">
            <Trophy className="w-6 h-6 text-white dark:text-yellow-700" />
          </div>
          <div>
            <h2 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Top Rating Workers
            </h2>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Highest rated professionals ready to help
            </p>
          </div>
        </div>
      </div>

      {/* Workers List */}
      <div className="p-4 space-y-2 overflow-y-auto no-scrollbar" style={{ maxHeight: '405px' }}>
        {topWorkers.length > 0 ? (
          topWorkers.map((worker, index) => (
            <div 
              key={worker.id} 
              className={`relative p-4 rounded-xl border transition-all duration-300 hover:shadow-md ${
                isDarkMode 
                  ? 'bg-gray-750 border-gray-600 hover:bg-gray-700' 
                  : 'bg-gray-50 border-gray-200 hover:bg-white'
              }`}
            >

              {/* Main Content */}
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <img
                    src={worker.avatar}
                    alt={worker.name}
                    className="w-12 h-12 rounded-full object-cover ring-4 ring-white dark:ring-blue-400"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name)}&background=random`;
                    }}
                  />
                  {worker.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Worker Info */}
                <div className="flex-1 min-w-0">
                  {/* Name and Title */}
                  <div className="mb-2">
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                      {worker.name}
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                      {worker.profession}
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(worker.rating)}
                    </div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {worker.rating ? worker.rating.toFixed(1) : '0.0'}
                    </span>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      ({worker.reviews} review{worker.reviews !== 1 ? 's' : ''})
                    </span>
                  </div>

                  {/* Location and Experience */}
                  <div className="flex items-center space-x-2 mb-2">
                    {worker.location && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {worker.location}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-2 mb-1">
                    {worker.workerData?.completedJobs > 0 && (
                      <div className={`px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300`}>
                        {worker.workerData.completedJobs} jobs completed
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleViewProfile(worker)}
                      className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                        isDarkMode
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      View 
                    </button>
                    <button
                      onClick={() => handleCallWorker(worker)}
                      className={`p-2 rounded-lg border transition-colors ${
                        isDarkMode
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEmailWorker(worker)}
                      className={`p-2 rounded-lg border transition-colors ${
                        isDarkMode
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Trophy className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <p className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
              No Top Workers Yet
            </p>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Workers with ratings will appear here soon
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopRankingCard;
