import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

// Handle API errors
const handleApiError = (error, defaultMessage) => {
  console.error('Review API Error:', error);
  const message = error.response?.data?.message || error.message || defaultMessage;
  throw new Error(message);
};

/**
 * Get reviews for a specific user (worker)
 */
export const getUserReviews = async (userId, options = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (options.page) params.append('page', options.page);
    if (options.limit) params.append('limit', options.limit);
    if (options.type) params.append('type', options.type); // 'received' or 'given'
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.rating) params.append('rating', options.rating);

    const response = await axios.get(
      `${API_ENDPOINTS.REVIEWS.BY_USER(userId)}?${params.toString()}`,
      { headers: getAuthHeaders() }
    );

    if (response.data?.success) {
      return response.data;
    } else {
      throw new Error(response.data?.message || 'Failed to get user reviews');
    }
  } catch (error) {
    handleApiError(error, 'Failed to get user reviews');
  }
};

/**
 * Get reviews for a specific job
 */
export const getJobReviews = async (jobId) => {
  try {
    const response = await axios.get(
      API_ENDPOINTS.REVIEWS.BY_JOB(jobId),
      { headers: getAuthHeaders() }
    );

    if (response.data?.success) {
      return response.data;
    } else {
      throw new Error(response.data?.message || 'Failed to get job reviews');
    }
  } catch (error) {
    handleApiError(error, 'Failed to get job reviews');
  }
};

/**
 * Create a new review
 */
export const createReview = async (reviewData) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.REVIEWS.BASE,
      reviewData,
      { headers: getAuthHeaders() }
    );

    if (response.data?.success) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Failed to create review');
    }
  } catch (error) {
    handleApiError(error, 'Failed to create review');
  }
};

/**
 * Get review statistics for a user
 */
export const getReviewStats = async (userId) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.REVIEWS.BY_USER(userId)}/stats`,
      { headers: getAuthHeaders() }
    );

    if (response.data?.success) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Failed to get review stats');
    }
  } catch (error) {
    handleApiError(error, 'Failed to get review stats');
  }
};

/**
 * Like a review
 */
export const likeReview = async (reviewId) => {
  try {
    const response = await axios.post(
      `${API_ENDPOINTS.REVIEWS.BASE}/${reviewId}/like`,
      {},
      { headers: getAuthHeaders() }
    );

    if (response.data?.success) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Failed to like review');
    }
  } catch (error) {
    handleApiError(error, 'Failed to like review');
  }
};

/**
 * Report a review
 */
export const reportReview = async (reviewId, reason) => {
  try {
    const response = await axios.post(
      `${API_ENDPOINTS.REVIEWS.BASE}/${reviewId}/report`,
      { reason },
      { headers: getAuthHeaders() }
    );

    if (response.data?.success) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Failed to report review');
    }
  } catch (error) {
    handleApiError(error, 'Failed to report review');
  }
};

/**
 * Get single review by ID
 */
export const getReviewById = async (reviewId) => {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.REVIEWS.BASE}/${reviewId}`,
      { headers: getAuthHeaders() }
    );

    if (response.data?.success) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Failed to get review');
    }
  } catch (error) {
    handleApiError(error, 'Failed to get review');
  }
};

/**
 * Calculate review statistics from review data
 */
export const calculateReviewStats = (reviews) => {
  if (!reviews || reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      completedJobs: 0,
      responseRate: 100
    };
  }

  const totalReviews = reviews.length;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / totalReviews;

  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(review => {
    ratingDistribution[review.rating]++;
  });

  return {
    averageRating,
    totalReviews,
    ratingDistribution,
    completedJobs: totalReviews, // Approximate - could be more accurate with job data
    responseRate: 95 // Default value - would need separate calculation
  };
};