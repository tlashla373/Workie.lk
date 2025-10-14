import { useState, useEffect } from 'react';
import { Search, Star, Eye, Trash2, Flag } from 'lucide-react';
import apiService from '../../services/apiService';
import { toast } from 'react-toastify';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [currentPage, filterRating, searchTerm]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 5,
        search: searchTerm,
        rating: filterRating !== 'all' ? filterRating : '',
        populate: 'reviewer,reviewee,job'  // Request populated reviewer and reviewee data
      });

      const response = await apiService.request(`/admin/reviews?${queryParams}`);
      console.log('Reviews API Response:', response.data); // Debug log to see actual structure
      setReviews(response.data?.reviews || []);
      setTotalPages(response.data?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to fetch reviews');
      setReviews([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAction = async (reviewId, action) => {
    try {
      // Check if this is an application review (cannot be deleted/reported)
      if (reviewId.startsWith('app_')) {
        toast.warning('Reviews from job applications cannot be modified. They are part of the application record.');
        return;
      }

      let endpoint = '';
      let message = '';
      
      switch (action) {
        case 'delete':
          endpoint = `/admin/reviews/${reviewId}`;
          message = 'Review deleted successfully';
          break;
        case 'report':
          endpoint = `/admin/reviews/${reviewId}/report`;
          message = 'Review reported successfully';
          break;
        default:
          return;
      }

      if (action === 'delete') {
        await apiService.request(endpoint, { method: 'DELETE' });
      } else {
        await apiService.request(endpoint, { method: 'PATCH' });
      }
      
      toast.success(message);
      fetchReviews();
    } catch (error) {
      console.error(`Error ${action} review:`, error);
      toast.error(`Failed to ${action} review`);
    }
  };

  const viewReviewDetails = async (reviewId) => {
    try {
      // Check if this is an application review
      if (reviewId.startsWith('app_')) {
        // Find the review in the current list (it's already loaded)
        const review = reviews.find(r => r._id === reviewId);
        if (review) {
          setSelectedReview(review);
          setShowReviewModal(true);
        } else {
          toast.error('Review not found');
        }
        return;
      }

      // Fetch from API for regular reviews with populated data
      const response = await apiService.request(`/admin/reviews/${reviewId}?populate=reviewer,reviewee,job`);
      console.log('Single review details:', response.data); // Debug log
      setSelectedReview(response.data?.review);
      setShowReviewModal(true);
    } catch (error) {
      console.error('Error fetching review details:', error);
      toast.error('Failed to fetch review details');
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const ReviewModal = () => {
    if (!selectedReview) return null;

    // Add CSS to hide scrollbar for webkit browsers
    const hideScrollbarStyle = `
      .custom-scrollbar::-webkit-scrollbar {
        display: none;
      }
    `;

    const formatDate = (date) => {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const getReviewerName = () => {
      if (selectedReview.reviewer?.firstName && selectedReview.reviewer?.lastName) {
        return `${selectedReview.reviewer.firstName} ${selectedReview.reviewer.lastName}`;
      }
      if (selectedReview.reviewer?.name) {
        return selectedReview.reviewer.name;
      }
      if (selectedReview.reviewer?.email) {
        return selectedReview.reviewer.email;
      }
      if (selectedReview.clientId?.firstName && selectedReview.clientId?.lastName) {
        return `${selectedReview.clientId.firstName} ${selectedReview.clientId.lastName}`;
      }
      if (selectedReview.client?.firstName && selectedReview.client?.lastName) {
        return `${selectedReview.client.firstName} ${selectedReview.client.lastName}`;
      }
      if (selectedReview.reviewerName || selectedReview.clientName) {
        return selectedReview.reviewerName || selectedReview.clientName;
      }
      return 'Unknown Client';
    };

    const getRevieweeName = () => {
      if (selectedReview.reviewee?.firstName && selectedReview.reviewee?.lastName) {
        return `${selectedReview.reviewee.firstName} ${selectedReview.reviewee.lastName}`;
      }
      if (selectedReview.reviewee?.name) {
        return selectedReview.reviewee.name;
      }
      if (selectedReview.workerId?.firstName && selectedReview.workerId?.lastName) {
        return `${selectedReview.workerId.firstName} ${selectedReview.workerId.lastName}`;
      }
      if (selectedReview.worker?.firstName && selectedReview.worker?.lastName) {
        return `${selectedReview.worker.firstName} ${selectedReview.worker.lastName}`;
      }
      if (selectedReview.revieweeName) {
        return selectedReview.revieweeName;
      }
      return 'Unknown Worker';
    };

    return (
      <div className="fixed inset-0 bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
        <style dangerouslySetInnerHTML={{ __html: hideScrollbarStyle }} />
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center shadow-lg bg-white">
                <div className="flex items-center justify-center w-full h-full">
                  <Star className="w-10 h-10 text-yellow-400 fill-current" />
                </div>
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">Review Details</h2>
              </div>
            </div>
            <button
              onClick={() => setShowReviewModal(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div 
            className="overflow-y-auto flex-1 p-6 custom-scrollbar" 
            style={{ 
              scrollbarWidth: 'none', /* Firefox */
              msOverflowStyle: 'none', /* Internet Explorer 10+ */
            }}
          >
            {/* Status Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                selectedReview.source === 'application'
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : 'bg-purple-100 text-purple-800 border border-purple-200'
              }`}>
                {selectedReview.source === 'application' ? 'Job Application Review' : 'Direct Review'}
              </span>

              {selectedReview.isReported && (
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-800 border border-red-200">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Reported
                </span>
              )}
            </div>

            {/* Review Information Section */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                Review Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</label>
                  <div className="flex items-center">
                    <div className="flex">{renderStars(selectedReview.rating)}</div>
                    <span className="ml-2 text-lg font-bold text-gray-900">({selectedReview.rating}/5)</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Review Date</label>
                  <p className="text-base text-gray-900 font-medium">{formatDate(selectedReview.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Helpful Votes</label>
                  <p className="text-base text-gray-900 font-medium">{selectedReview.helpfulVotes || 0}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Review Source</label>
                  <p className="text-base text-gray-900 font-medium">
                    {selectedReview.source === 'application' ? 'Job Application' : 'Direct Review'}
                  </p>
                </div>
              </div>
            </div>

            {/* People Involved Section */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
                People Involved
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reviewer (Client)</label>
                  <p className="text-base text-gray-900 font-medium">{getReviewerName()}</p>
                  {selectedReview.reviewer?.email && (
                    <p className="text-sm text-gray-500">{selectedReview.reviewer.email}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Reviewee (Worker)</label>
                  <p className="text-base text-gray-900 font-medium">{getRevieweeName()}</p>
                  {selectedReview.reviewee?.email && (
                    <p className="text-sm text-gray-500">{selectedReview.reviewee.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Job Details Section */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
                </svg>
                Job Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Title</label>
                  <p className="text-base text-gray-900 font-medium">{selectedReview.job?.title || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Job Budget</label>
                  <p className="text-base text-gray-900 font-medium">
                    {selectedReview.job?.budget?.amount 
                      ? `${selectedReview.job.budget.currency || 'LKR'} ${selectedReview.job.budget.amount}` 
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Review Comment Section */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Review Comment
              </h3>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-base text-gray-900 whitespace-pre-wrap leading-relaxed">
                  {selectedReview.comment || 'No comment provided'}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
            {selectedReview.source !== 'application' && (
              <button
                onClick={() => {
                  handleReviewAction(selectedReview._id, 'delete');
                  setShowReviewModal(false);
                }}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete Review
              </button>
            )}
            {selectedReview.source === 'application' && (
              <div className="flex-1 text-sm text-gray-500 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.95L13.732 4.99c-.77-1.284-2.694-1.284-3.464 0L3.34 16.05c-.77 1.283.192 2.95 1.732 2.95z" />
                </svg>
                Reviews from job applications cannot be deleted
              </div>
            )}
            <button
              onClick={() => setShowReviewModal(false)}
              className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
            Review Management
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage all reviews and ratings in the system
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          
          <button
            onClick={fetchReviews}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </button>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Review Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reviews.map((review) => (
                    <tr key={review._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {(() => {
                              // Check for populated reviewer object
                              if (review.reviewer?.firstName && review.reviewer?.lastName) {
                                return `${review.reviewer.firstName} ${review.reviewer.lastName}`;
                              }
                              // Check for reviewer name field
                              if (review.reviewer?.name) {
                                return review.reviewer.name;
                              }
                              // Check for reviewer email
                              if (review.reviewer?.email) {
                                return review.reviewer.email;
                              }
                              // Check for clientId populated object
                              if (review.clientId?.firstName && review.clientId?.lastName) {
                                return `${review.clientId.firstName} ${review.clientId.lastName}`;
                              }
                              // Check for other possible field names
                              if (review.client?.firstName && review.client?.lastName) {
                                return `${review.client.firstName} ${review.client.lastName}`;
                              }
                              if (review.reviewerName) {
                                return review.reviewerName;
                              }
                              if (review.clientName) {
                                return review.clientName;
                              }
                              return 'Unknown Client';
                            })()}
                          </div>
                          <div className="text-sm text-gray-500">
                            reviewed {(() => {
                              if (review.reviewee?.firstName && review.reviewee?.lastName) {
                                return `${review.reviewee.firstName} ${review.reviewee.lastName}`;
                              }
                              if (review.reviewee?.name) {
                                return review.reviewee.name;
                              }
                              if (review.workerId?.firstName && review.workerId?.lastName) {
                                return `${review.workerId.firstName} ${review.workerId.lastName}`;
                              }
                              if (review.worker?.firstName && review.worker?.lastName) {
                                return `${review.worker.firstName} ${review.worker.lastName}`;
                              }
                              if (review.revieweeName) {
                                return review.revieweeName;
                              }
                              return 'Unknown Worker';
                            })()}
                          </div>
                          {review.isReported && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              Reported
                            </span>
                          )}
                          {review.source === 'application' && (
                            <span className="inline-flex px-2 py-1 ml-2 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              From Job
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {review.job?.title || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex">{renderStars(review.rating)}</div>
                          <span className="ml-2 text-sm text-gray-600">({review.rating})</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => viewReviewDetails(review._id)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {!review.isReported && (
                            <button
                              onClick={() => handleReviewAction(review._id, 'report')}
                              className={`${review.source === 'application' ? 'text-gray-400 cursor-not-allowed' : 'text-yellow-600 hover:text-yellow-900'}`}
                              title={review.source === 'application' ? 'Cannot report job reviews' : 'Report Review'}
                              disabled={review.source === 'application'}
                            >
                              <Flag className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleReviewAction(review._id, 'delete')}
                            className={`${review.source === 'application' ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-900'}`}
                            title={review.source === 'application' ? 'Cannot delete job reviews' : 'Delete Review'}
                            disabled={review.source === 'application'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
              
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && <ReviewModal />}
    </div>
  );
};

export default AdminReviews;
