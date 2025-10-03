import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

// Set up axios defaults
axios.defaults.baseURL = 'http://localhost:5000';

/**
 * Get authentication headers
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Handle API errors
 */
const handleApiError = (error, defaultMessage) => {
  console.error('API Error:', error);
  const message = error.response?.data?.message || error.message || defaultMessage;
  throw new Error(message);
};

/**
 * Accept an application (Client action)
 */
export const acceptApplication = async (applicationId) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.APPLICATIONS.ACCEPT(applicationId),
      {},
      { headers: getAuthHeaders() }
    );

    if (response.data?.success) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Failed to accept application');
    }
  } catch (error) {
    handleApiError(error, 'Failed to accept application');
  }
};

/**
 * Reject an application (Client action)
 */
export const rejectApplication = async (applicationId, reason = '') => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.APPLICATIONS.REJECT(applicationId),
      { reason },
      { headers: getAuthHeaders() }
    );

    if (response.data?.success) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Failed to reject application');
    }
  } catch (error) {
    handleApiError(error, 'Failed to reject application');
  }
};

/**
 * Start work on application (Worker action)
 */
export const startWork = async (applicationId) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.APPLICATIONS.START_WORK(applicationId),
      {},
      { headers: getAuthHeaders() }
    );

    if (response.data?.success) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Failed to start work');
    }
  } catch (error) {
    handleApiError(error, 'Failed to start work');
  }
};

/**
 * Complete work (Worker action)
 */
export const completeWork = async (applicationId) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.APPLICATIONS.COMPLETE_WORK(applicationId),
      {},
      { headers: getAuthHeaders() }
    );

    if (response.data?.success) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Failed to complete work');
    }
  } catch (error) {
    handleApiError(error, 'Failed to complete work');
  }
};

/**
 * Release payment (Client action)
 */
export const releasePayment = async (applicationId, paymentData = {}) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.APPLICATIONS.RELEASE_PAYMENT(applicationId),
      paymentData,
      { headers: getAuthHeaders() }
    );

    if (response.data?.success) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Failed to release payment');
    }
  } catch (error) {
    handleApiError(error, 'Failed to release payment');
  }
};

/**
 * Confirm payment received (Worker action)
 */
export const confirmPayment = async (applicationId) => {
  try {
    console.log('Confirming payment for application ID:', applicationId);
    const response = await axios.post(
      API_ENDPOINTS.APPLICATIONS.CONFIRM_PAYMENT(applicationId),
      {},
      { headers: getAuthHeaders() }
    );

    console.log('Confirm payment response:', response.data);

    if (response.data?.success) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Failed to confirm payment');
    }
  } catch (error) {
    console.error('Confirm payment detailed error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    handleApiError(error, 'Failed to confirm payment');
  }
};

/**
 * Submit review (Client action)
 */
export const submitReview = async (applicationId, rating, comment = '') => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.APPLICATIONS.SUBMIT_REVIEW(applicationId),
      { rating, comment },
      { headers: getAuthHeaders() }
    );

    if (response.data?.success) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Failed to submit review');
    }
  } catch (error) {
    handleApiError(error, 'Failed to submit review');
  }
};

/**
 * Close job (Worker or Client action)
 */
export const closeJob = async (applicationId) => {
  try {
    const response = await axios.post(
      API_ENDPOINTS.APPLICATIONS.CLOSE_JOB(applicationId),
      {},
      { headers: getAuthHeaders() }
    );

    if (response.data?.success) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Failed to close job');
    }
  } catch (error) {
    handleApiError(error, 'Failed to close job');
  }
};

/**
 * Get single application by ID
 */
export const getApplicationById = async (applicationId) => {
  try {
    const response = await axios.get(
      API_ENDPOINTS.APPLICATIONS.BY_ID(applicationId),
      { headers: getAuthHeaders() }
    );

    if (response.data?.success) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Failed to get application');
    }
  } catch (error) {
    handleApiError(error, 'Failed to get application');
  }
};

/**
 * Map backend application status to frontend stage
 */
export const getStageFromStatus = (status) => {
  const statusMap = {
    'pending': 1,
    'accepted': 2,
    'in-progress': 3,
    'completed': 4,  // Stage 4: Work completed, ready for payment
    'payment-released': 6,  // Stage 6: Payment released, waiting for worker confirmation
    'payment-confirmed': 7,  // Stage 7: Worker confirmed, client can review
    'reviewed': 8,
    'closed': 8,
    'rejected': 0,
    'withdrawn': 0
  };
  return statusMap[status] || 1;
};

/**
 * Map frontend stage to backend status
 */
export const getStatusFromStage = (stage) => {
  const stageMap = {
    1: 'pending',
    2: 'accepted',
    3: 'in-progress',
    4: 'completed',
    5: 'payment-released',
    6: 'payment-confirmed',
    7: 'reviewed',
    8: 'closed'
  };
  return stageMap[stage] || 'pending';
};