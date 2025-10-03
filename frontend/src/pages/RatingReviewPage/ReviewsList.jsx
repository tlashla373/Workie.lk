import React, { useState, useEffect } from 'react';
import { Star, Calendar, User, MoreVertical, ThumbsUp, Flag } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const ReviewCard = ({ review, onLike, onReport, showActions = true }) => {
  const { isDarkMode } = useDarkMode();
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating 
            ? 'text-yellow-400 fill-current' 
            : isDarkMode ? 'text-gray-600' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className={`${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border rounded-lg p-4 mb-4`}>
      {/* Review Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={review.client.profilePicture || '/api/placeholder/40/40'}
            alt={review.client.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h4 className={`font-medium ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>
              {review.client.name}
            </h4>
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {renderStars(review.rating)}
              </div>
              <span className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {review.rating}/5
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {formatDate(review.submittedAt)}
          </span>
          
          {showActions && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`p-1 rounded ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {showMenu && (
                <div className={`absolute right-0 mt-1 w-48 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-white'
                } rounded-md shadow-lg z-10 border ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-200'
                }`}>
                  <button
                    onClick={() => {
                      onLike && onLike(review._id);
                      setShowMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    } flex items-center space-x-2`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>Helpful</span>
                  </button>
                  <button
                    onClick={() => {
                      onReport && onReport(review._id);
                      setShowMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    } flex items-center space-x-2`}
                  >
                    <Flag className="w-4 h-4" />
                    <span>Report</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Review Content */}
      <div className="mb-3">
        <p className={`${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        } leading-relaxed`}>
          {review.comment}
        </p>
      </div>

      {/* Job Info */}
      {review.job && (
        <div className={`text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        } border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        } pt-3`}>
          <span>Job: {review.job.title}</span>
          {review.job.completedAt && (
            <span className="ml-4">
              Completed: {formatDate(review.job.completedAt)}
            </span>
          )}
        </div>
      )}

      {/* Review Actions */}
      {review.likes > 0 && (
        <div className={`flex items-center space-x-2 mt-3 pt-3 border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <ThumbsUp className="w-4 h-4 text-blue-500" />
          <span className={`text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {review.likes} {review.likes === 1 ? 'person found' : 'people found'} this helpful
          </span>
        </div>
      )}
    </div>
  );
};

const ReviewsList = ({ 
  reviews = [], 
  loading = false, 
  onLoadMore,
  hasMore = false,
  onLike,
  onReport 
}) => {
  const { isDarkMode } = useDarkMode();

  if (loading && reviews.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={`${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-lg p-4 animate-pulse`}
          >
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className={`text-center py-12 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      } rounded-lg`}>
        <Star className={`w-12 h-12 mx-auto mb-4 ${
          isDarkMode ? 'text-gray-600' : 'text-gray-400'
        }`} />
        <h3 className={`text-lg font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        } mb-2`}>
          No Reviews Yet
        </h3>
        <p className={`${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          Be the first to leave a review for this worker!
        </p>
      </div>
    );
  }

  return (
    <div>
      {reviews.map((review) => (
        <ReviewCard
          key={review._id}
          review={review}
          onLike={onLike}
          onReport={onReport}
        />
      ))}
      
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className={`px-6 py-2 rounded-lg border ${
              isDarkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            } transition-colors`}
          >
            {loading ? 'Loading...' : 'Load More Reviews'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;