// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    ME: `${API_BASE_URL}/auth/me`,
    UPDATE_ROLE: `${API_BASE_URL}/auth/update-role`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    VERIFY_RESET_PIN: `${API_BASE_URL}/auth/verify-reset-pin`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password`,
    VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
    RESEND_OTP: `${API_BASE_URL}/auth/resend-otp`,
  },
  
  // Users
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
    SEARCH_WORKERS: `${API_BASE_URL}/users/workers/search`,
    STATS: `${API_BASE_URL}/users/stats/overview`,
    ACTIVATE: (id) => `${API_BASE_URL}/users/${id}/activate`,
  },
  
  // Jobs
  JOBS: {
    BASE: `${API_BASE_URL}/jobs`,
    BY_ID: (id) => `${API_BASE_URL}/jobs/${id}`,
    APPLICATIONS: (id) => `${API_BASE_URL}/jobs/${id}/applications`,
    ASSIGN: (jobId, workerId) => `${API_BASE_URL}/jobs/${jobId}/assign/${workerId}`,
    COMPLETE: (id) => `${API_BASE_URL}/jobs/${id}/complete`,
    MY_JOBS: `${API_BASE_URL}/jobs/user/my-jobs`,
  },
  
  // Applications
  APPLICATIONS: {
    BASE: `${API_BASE_URL}/applications`,
    BY_ID: (id) => `${API_BASE_URL}/applications/${id}`,
    BY_WORKER: (workerId) => `${API_BASE_URL}/applications/worker/${workerId}`,
    ACCEPT: (id) => `${API_BASE_URL}/applications/${id}/accept`,
    REJECT: (id) => `${API_BASE_URL}/applications/${id}/reject`,
    WITHDRAW: (id) => `${API_BASE_URL}/applications/${id}/withdraw`,
    START_WORK: (id) => `${API_BASE_URL}/applications/${id}/start-work`,
    COMPLETE_WORK: (id) => `${API_BASE_URL}/applications/${id}/complete-work`,
    RELEASE_PAYMENT: (id) => `${API_BASE_URL}/applications/${id}/release-payment`,
    CONFIRM_PAYMENT: (id) => `${API_BASE_URL}/applications/${id}/confirm-payment`,
    SUBMIT_REVIEW: (id) => `${API_BASE_URL}/applications/${id}/submit-review`,
    CLOSE_JOB: (id) => `${API_BASE_URL}/applications/${id}/close-job`,
    STATS: `${API_BASE_URL}/applications/stats/overview`,
  },
  
  // Profiles
  PROFILES: {
    BY_USER_ID: (userId) => `${API_BASE_URL}/profiles/${userId}`,
    SKILLS: (userId) => `${API_BASE_URL}/profiles/${userId}/skills`,
    SKILL_BY_ID: (userId, skillId) => `${API_BASE_URL}/profiles/${userId}/skills/${skillId}`,
    EXPERIENCE: (userId) => `${API_BASE_URL}/profiles/${userId}/experience`,
    PORTFOLIO: (userId) => `${API_BASE_URL}/profiles/${userId}/portfolio`,
    AVAILABILITY: (userId) => `${API_BASE_URL}/profiles/${userId}/availability`,
    SEARCH_WORKERS: `${API_BASE_URL}/profiles/search/workers`,
  },
  
  // Reviews
  REVIEWS: {
    BASE: `${API_BASE_URL}/reviews`,
    BY_ID: (id) => `${API_BASE_URL}/reviews/${id}`,
    BY_USER: (userId) => `${API_BASE_URL}/reviews/user/${userId}`,
    BY_JOB: (jobId) => `${API_BASE_URL}/reviews/job/${jobId}`,
    HELPFUL: (id) => `${API_BASE_URL}/reviews/${id}/helpful`,
    REPORT: (id) => `${API_BASE_URL}/reviews/${id}/report`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    BASE: `${API_BASE_URL}/notifications`,
    BY_ID: (id) => `${API_BASE_URL}/notifications/${id}`,
    UNREAD_COUNT: `${API_BASE_URL}/notifications/unread-count`,
    MARK_READ: (id) => `${API_BASE_URL}/notifications/${id}/read`,
    MARK_ALL_READ: `${API_BASE_URL}/notifications/mark-all-read`,
    CLEAR_ALL: `${API_BASE_URL}/notifications/clear-all`,
  },

  // Connections
  CONNECTIONS: {
    MY_CONNECTIONS: `${API_BASE_URL}/connections/my-connections`,
    STATS: `${API_BASE_URL}/connections/stats`,
    SEND_REQUEST: `${API_BASE_URL}/connections/send-request`,
    RESPOND: (id) => `${API_BASE_URL}/connections/respond/${id}`,
    REMOVE: (id) => `${API_BASE_URL}/connections/${id}`,
  },

  // Admin
  ADMIN: {
    DASHBOARD: `${API_BASE_URL}/admin/dashboard`,
    USERS: `${API_BASE_URL}/admin/users`,
    JOBS: `${API_BASE_URL}/admin/jobs`,
    APPLICATIONS: `${API_BASE_URL}/admin/applications`,
    REVIEWS: `${API_BASE_URL}/admin/reviews`,
    REPORTS: `${API_BASE_URL}/admin/reports`,
    NOTIFICATIONS: `${API_BASE_URL}/admin/notifications`,
    SETTINGS: `${API_BASE_URL}/admin/settings`,
  }
};

export default API_BASE_URL;