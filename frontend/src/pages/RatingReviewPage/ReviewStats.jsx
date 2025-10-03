import React from 'react';
import { Star, TrendingUp, Award, Users } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const ReviewStats = ({ 
  stats = {
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    completedJobs: 0,
    responseRate: 0
  } 
}) => {
  const { isDarkMode } = useDarkMode();

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : index < rating 
            ? 'text-yellow-400 fill-current opacity-50'
            : isDarkMode ? 'text-gray-600' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingPercentage = (count) => {
    return stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-500';
    if (rating >= 4.0) return 'text-blue-500';
    if (rating >= 3.0) return 'text-yellow-500';
    if (rating >= 2.0) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className={`${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    } rounded-xl shadow-lg p-6`}>
      <h2 className={`text-xl font-bold ${
        isDarkMode ? 'text-white' : 'text-gray-800'
      } mb-6`}>
        Rating & Reviews
      </h2>

      {/* Overall Rating */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className={`text-4xl font-bold ${getRatingColor(stats.averageRating)}`}>
              {stats.averageRating.toFixed(1)}
            </div>
            <div className="flex space-x-1 justify-center mt-1">
              {renderStars(stats.averageRating)}
            </div>
          </div>
          
          <div className={`${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <p className="text-lg font-medium">
              {stats.totalReviews} {stats.totalReviews === 1 ? 'Review' : 'Reviews'}
            </p>
            <p className="text-sm">
              Based on {stats.completedJobs} completed jobs
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            stats.averageRating >= 4.5 
              ? 'bg-green-100 text-green-800'
              : stats.averageRating >= 4.0
              ? 'bg-blue-100 text-blue-800'
              : stats.averageRating >= 3.0
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            <Award className="w-4 h-4 mr-1" />
            {stats.averageRating >= 4.5 ? 'Excellent' : 
             stats.averageRating >= 4.0 ? 'Very Good' :
             stats.averageRating >= 3.0 ? 'Good' : 'Needs Improvement'}
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-3 mb-6">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = stats.ratingDistribution[rating] || 0;
          const percentage = getRatingPercentage(count);
          
          return (
            <div key={rating} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-12">
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {rating}
                </span>
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
              </div>
              
              <div className="flex-1">
                <div className={`w-full h-2 rounded-full ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div
                    className="h-2 bg-yellow-400 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              
              <div className={`text-sm w-12 text-right ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {count}
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Users className="w-4 h-4 text-blue-500" />
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Completed Jobs
            </span>
          </div>
          <div className={`text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {stats.completedJobs}
          </div>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Response Rate
            </span>
          </div>
          <div className={`text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {stats.responseRate}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStats;