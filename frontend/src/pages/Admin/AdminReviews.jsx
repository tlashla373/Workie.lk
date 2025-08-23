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
        limit: 10,
        search: searchTerm,
        rating: filterRating !== 'all' ? filterRating : ''
      });

      const response = await apiService.request(`/reviews?${queryParams}`);
      setReviews(response.data?.reviews || []);
      setTotalPages(response.data?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAction = async (reviewId, action) => {
    try {
      let endpoint = '';
      let message = '';
      
      switch (action) {
        case 'delete':
          endpoint = `/reviews/${reviewId}`;
          message = 'Review deleted successfully';
          break;
        case 'report':
          endpoint = `/reviews/${reviewId}/report`;
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
      const response = await apiService.request(`/reviews/${reviewId}`);
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

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Review Details</h3>
            <button
              onClick={() => setShowReviewModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Job Title</label>
                <p className="mt-1 text-sm text-gray-900">{selectedReview.job?.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Reviewer</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedReview.reviewer?.firstName} {selectedReview.reviewer?.lastName}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Reviewee</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedReview.reviewee?.firstName} {selectedReview.reviewee?.lastName}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <div className="mt-1 flex items-center">
                  <div className="flex">{renderStars(selectedReview.rating)}</div>
                  <span className="ml-2 text-sm text-gray-600">({selectedReview.rating}/5)</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Comment</label>
                <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {selectedReview.comment || 'No comment provided'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Review Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(selectedReview.createdAt).toLocaleString()}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Helpful Votes</label>
                <p className="mt-1 text-sm text-gray-900">{selectedReview.helpfulVotes || 0}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Reported</label>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedReview.isReported ? 'Yes' : 'No'}
                </p>
              </div>
              
              {selectedReview.job && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Budget</label>
                  <p className="mt-1 text-sm text-gray-900">${selectedReview.job.budget}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => {
                handleReviewAction(selectedReview._id, 'delete');
                setShowReviewModal(false);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              Delete Review
            </button>
            <button
              onClick={() => setShowReviewModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
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
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
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
                            {review.reviewer?.firstName} {review.reviewer?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            reviewed {review.reviewee?.firstName} {review.reviewee?.lastName}
                          </div>
                          {review.isReported && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                              Reported
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
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Report Review"
                            >
                              <Flag className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleReviewAction(review._id, 'delete')}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Review"
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
