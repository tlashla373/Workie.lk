import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, User, Calendar, MapPin, DollarSign } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../hooks/useAuth';
import RatingSystem from './RatingSystem';
import { submitReview } from '../../services/applicationProgressService';
import { getApplicationById } from '../../services/applicationProgressService';

const Review = () => {
  const navigate = useNavigate();
  const { applicationId } = useParams();
  const { isDarkMode } = useDarkMode();
  const { user } = useAuth();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  // Load application data when component mounts
  useEffect(() => {
    const loadApplicationData = async () => {
      if (!applicationId) {
        setError('Application ID not found');
        setLoadingData(false);
        return;
      }

      try {
        setLoadingData(true);
        const data = await getApplicationById(applicationId);
        setApplicationData(data);
      } catch (err) {
        setError(err.message || 'Failed to load application data');
      } finally {
        setLoadingData(false);
      }
    };

    loadApplicationData();
  }, [applicationId]);

  const handleSubmitReview = async () => {
    if (!rating) {
      setError('Please provide a rating');
      return;
    }

    if (!comment.trim()) {
      setError('Please write a review comment');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await submitReview(applicationId, rating, comment);
      setSuccess(true);
      
      // Redirect after successful submission
      setTimeout(() => {
        navigate('/work-history');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loadingData) {
    return (
      <div className={`min-h-screen ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      } flex items-center justify-center p-4`}>
        <div className={`max-w-md w-full ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-xl shadow-lg p-8 text-center`}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Loading application data...
          </p>
        </div>
      </div>
    );
  }

  if (error && !applicationData) {
    return (
      <div className={`min-h-screen ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      } flex items-center justify-center p-4`}>
        <div className={`max-w-md w-full ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-xl shadow-lg p-8 text-center`}>
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className={`text-xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          } mb-2`}>
            Error Loading Data
          </h2>
          <p className={`${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          } mb-4`}>
            {error}
          </p>
          <button
            onClick={handleBack}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className={`min-h-screen ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      } flex items-center justify-center p-4`}>
        <div className={`max-w-md w-full ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-xl shadow-lg p-8 text-center`}>
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className={`text-xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          } mb-2`}>
            Review Submitted Successfully!
          </h2>
          <p className={`${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          } mb-4`}>
            Thank you for your feedback. Redirecting you back...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    } p-4`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className={`p-2 rounded-lg ${
              isDarkMode 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-white text-gray-600 hover:bg-gray-50'
            } shadow-md transition-colors mr-4`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className={`text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Rate & Review
          </h1>
        </div>

        {/* Job Summary Card */}
        <div className={`${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-xl shadow-lg p-6 mb-6`}>
          <h2 className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          } mb-4`}>
            Job Completed
          </h2>
          
          <div className="flex items-start space-x-4">
            <img
              src={applicationData?.worker?.profilePicture || '/api/placeholder/100/100'}
              alt={applicationData?.worker?.name || 'Worker'}
              className="w-16 h-16 rounded-full object-cover"
            />
            
            <div className="flex-1">
              <h3 className={`font-semibold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {applicationData?.job?.title || 'Job Title'}
              </h3>
              
              <div className="flex items-center space-x-1 mt-1">
                <User className="w-4 h-4 text-gray-500" />
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {applicationData?.worker?.name || 'Worker Name'}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Completed: {applicationData?.updatedAt ? new Date(applicationData.updatedAt).toLocaleDateString() : 'Recently'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {applicationData?.job?.location || 'Location'}
                  </span>
                </div>
                
                {applicationData?.payment?.amount && (
                  <div className="flex items-center space-x-1">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      LKR {applicationData.payment.amount.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <div className={`${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-xl shadow-lg p-6`}>
          <h2 className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          } mb-6`}>
            Share Your Experience
          </h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Rating Section */}
          <div className="mb-6">
            <RatingSystem
              currentRating={rating}
              onRatingChange={setRating}
              size="lg"
              label="How would you rate this worker's service?"
            />
          </div>

          {/* Comment Section */}
          <div className="mb-6">
            <label className={`block text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            } mb-2`}>
              Write Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about your experience with this worker. What did they do well? Any areas for improvement?"
              rows={6}
              className={`w-full p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
            <div className={`text-right text-xs mt-1 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {comment.length}/500
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmitReview}
            disabled={!rating || !comment.trim() || loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Submit Review</span>
              </>
            )}
          </button>

          <p className={`text-center text-xs mt-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Your review will help other clients make informed decisions and help workers improve their services.
          </p>
        </div>
      </div>
    </div>
  );
};



export default Review;
