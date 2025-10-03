import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Plus } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../hooks/useAuth';
import ReviewStats from './ReviewStats';
import ReviewsList from './ReviewsList';
import { getUserReviews, calculateReviewStats, likeReview, reportReview } from '../../services/reviewService';

const WorkerReviewsPage = () => {
  const { workerId } = useParams();
  const { isDarkMode } = useDarkMode();
  const { user } = useAuth();
  
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Load reviews and stats
  useEffect(() => {
    loadReviews();
  }, [workerId, page]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await getUserReviews(workerId, {
        page,
        limit: 10,
        type: 'received' // Reviews received by the worker
      });
      
      if (page === 1) {
        setReviews(response.data.reviews);
        setStats(calculateReviewStats(response.data.reviews));
      } else {
        setReviews(prev => [...prev, ...response.data.reviews]);
      }
      
      setHasMore(response.data.pagination?.hasMore || false);
    } catch (err) {
      setError(err.message || 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleLikeReview = async (reviewId) => {
    try {
      await likeReview(reviewId);
      // Refresh reviews to show updated likes
      setPage(1);
      loadReviews();
    } catch (err) {
      console.error('Failed to like review:', err);
    }
  };

  const handleReportReview = async (reviewId) => {
    try {
      const reason = prompt('Please enter the reason for reporting this review:');
      if (reason) {
        await reportReview(reviewId, reason);
        alert('Review has been reported. Thank you for helping us maintain quality.');
      }
    } catch (err) {
      console.error('Failed to report review:', err);
      alert('Failed to report review. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    } p-4`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link
              to={`/worker/${workerId}`}
              className={`p-2 rounded-lg ${
                isDarkMode 
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              } shadow-md transition-colors mr-4`}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Worker Reviews
              </h1>
              <p className={`${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Reviews and ratings from completed jobs
              </p>
            </div>
          </div>
          
          {/* Add Review Button (if user has completed jobs with this worker) */}
          {user && user._id !== workerId && (
            <Link
              to={`/review/new?workerId=${workerId}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Write Review</span>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Review Statistics */}
          <div className="lg:col-span-1">
            {stats ? (
              <ReviewStats stats={stats} />
            ) : (
              <div className={`${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } rounded-xl shadow-lg p-6 animate-pulse`}>
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
                <div className="h-12 bg-gray-300 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-300 rounded"></div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2">
            <div className={`${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-xl shadow-lg p-6`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Reviews ({stats?.totalReviews || 0})
                </h2>
                
                {/* Filter/Sort Options */}
                <select className={`px-3 py-1 rounded border text-sm ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-300' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rated</option>
                  <option value="lowest">Lowest Rated</option>
                </select>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                  {error}
                </div>
              )}

              <ReviewsList
                reviews={reviews}
                loading={loading}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                onLike={handleLikeReview}
                onReport={handleReportReview}
              />
            </div>
          </div>
        </div>

        {/* Call to Action for Potential Clients */}
        {user && user._id !== workerId && reviews.length > 0 && (
          <div className={`mt-8 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          } rounded-xl shadow-lg p-6 text-center`}>
            <h3 className={`text-lg font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            } mb-2`}>
              Ready to hire this worker?
            </h3>
            <p className={`${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            } mb-4`}>
              Based on {stats?.totalReviews} reviews with an average rating of {stats?.averageRating.toFixed(1)} stars
            </p>
            <Link
              to={`/jobs/new?workerId=${workerId}`}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2"
            >
              <span>Post a Job</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerReviewsPage;