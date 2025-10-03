import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const RatingSystem = ({ 
  currentRating = 0, 
  onRatingChange, 
  onRatingSubmit, // New prop for review submission
  maxRating = 5, 
  size = 'md',
  disabled = false,
  showLabel = true,
  label = 'Rating',
  // New props for review functionality
  submitButtonText = 'Submit Review',
  isLoading = false,
  showReviewInput = true,
  workerId,
  jobTitle,
  workerName,
  showJobContext = false,
  showWorkerInfo = false
}) => {
  const { isDarkMode } = useDarkMode();
  const [hoveredRating, setHoveredRating] = useState(0);
  const [rating, setRating] = useState(currentRating);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  const handleStarClick = (newRating) => {
    if (!disabled) {
      setRating(newRating);
      if (onRatingChange) {
        onRatingChange(newRating);
      }
    }
  };

  const handleStarHover = (newRating) => {
    if (!disabled) {
      setHoveredRating(newRating);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoveredRating(0);
    }
  };

  const handleSubmit = () => {
    setError('');
    
    if (!rating || rating === 0) {
      setError('Please provide a rating');
      return;
    }

    if (onRatingSubmit) {
      onRatingSubmit({
        rating,
        comment: comment.trim(),
        workerId,
        jobTitle
      });
    }
  };

  const getStarColor = (starIndex) => {
    const displayRating = hoveredRating || rating;
    if (starIndex <= displayRating) {
      return 'text-yellow-400 fill-current';
    }
    return isDarkMode ? 'text-gray-600' : 'text-gray-300';
  };

  const getRatingText = (ratingValue) => {
    const texts = {
      1: 'Poor',
      2: 'Fair', 
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return texts[ratingValue] || '';
  };

  // If onRatingSubmit is provided, render the full review component
  if (onRatingSubmit) {
    return (
      <div className="space-y-4">
        {/* Rating Section */}
        <div>
          <label className={`block text-sm font-medium ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          } mb-2`}>
            Rate this worker *
          </label>
          <div 
            className="flex items-center space-x-1"
            onMouseLeave={handleMouseLeave}
          >
            {Array.from({ length: maxRating }, (_, index) => {
              const starIndex = index + 1;
              return (
                <button
                  key={starIndex}
                  type="button"
                  className={`transition-colors duration-200 focus:outline-none ${
                    disabled 
                      ? 'cursor-default' 
                      : 'cursor-pointer hover:scale-110 transform transition-transform'
                  }`}
                  onClick={() => handleStarClick(starIndex)}
                  onMouseEnter={() => handleStarHover(starIndex)}
                  disabled={disabled || isLoading}
                >
                  <Star
                    className={`${sizeClasses[size]} ${getStarColor(starIndex)} transition-colors duration-200`}
                  />
                </button>
              );
            })}
          </div>
          
          {(rating > 0 || hoveredRating > 0) && (
            <div className="flex items-center space-x-2 mt-2">
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {hoveredRating || rating}/5
              </span>
              
              {(hoveredRating > 0 || rating > 0) && (
                <span className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {getRatingText(hoveredRating || rating)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Comment Section */}
        {showReviewInput && (
          <div>
            <label className={`block text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            } mb-2`}>
              Write a review (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience working with this person..."
              rows={4}
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className={`p-3 rounded-lg border ${
            isDarkMode 
              ? 'bg-red-900/20 border-red-800 text-red-400' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading || !rating}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            submitButtonText
          )}
        </button>
      </div>
    );
  }

  // Original simple rating display component
  return (
    <div className="flex flex-col space-y-2">
      {showLabel && (
        <label className={`text-sm font-medium ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {label}
        </label>
      )}
      
      <div className="flex items-center space-x-1">
        <div 
          className="flex space-x-1"
          onMouseLeave={handleMouseLeave}
        >
          {[...Array(maxRating)].map((_, index) => {
            const starIndex = index + 1;
            return (
              <button
                key={starIndex}
                type="button"
                className={`transition-colors duration-200 focus:outline-none ${
                  disabled 
                    ? 'cursor-default' 
                    : 'cursor-pointer hover:scale-110 transform transition-transform'
                }`}
                onClick={() => handleStarClick(starIndex)}
                onMouseEnter={() => handleStarHover(starIndex)}
                disabled={disabled}
              >
                <Star
                  className={`${sizeClasses[size]} ${getStarColor(starIndex)} transition-colors duration-200`}
                />
              </button>
            );
          })}
        </div>
        
        {(rating > 0 || hoveredRating > 0) && (
          <div className="flex items-center space-x-2 ml-3">
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              {hoveredRating || rating}/5
            </span>
            
            {(hoveredRating > 0 || rating > 0) && (
              <span className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {getRatingText(hoveredRating || rating)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RatingSystem;
