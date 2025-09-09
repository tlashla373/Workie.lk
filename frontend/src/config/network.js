// Network and API configuration
export const NETWORK_CONFIG = {
  // Request timeout in milliseconds
  TIMEOUT: 15000, // 15 seconds
  
  // Retry configuration
  MAX_RETRIES: 3,
  INITIAL_RETRY_DELAY: 1000, // 1 second
  
  // Connection check intervals
  HEALTH_CHECK_INTERVAL: 30000, // 30 seconds
  OFFLINE_POLL_INTERVAL: 5000, // 5 seconds when offline
  
  // Error handling
  SHOW_NETWORK_ERRORS: true,
  AUTO_RETRY_ON_NETWORK_ERROR: true,
  
  // Development vs Production settings
  DEVELOPMENT: {
    VERBOSE_LOGGING: true,
    SHOW_RETRY_MESSAGES: true,
    MOCK_SLOW_NETWORK: false, // Set to true to simulate slow network
    MOCK_INTERMITTENT_FAILURES: false // Set to true to simulate random failures
  },
  
  PRODUCTION: {
    VERBOSE_LOGGING: false,
    SHOW_RETRY_MESSAGES: false,
    MOCK_SLOW_NETWORK: false,
    MOCK_INTERMITTENT_FAILURES: false
  }
};

// Get environment-specific config
export const getNetworkConfig = () => {
  const isDevelopment = import.meta.env.DEV;
  return {
    ...NETWORK_CONFIG,
    ...(isDevelopment ? NETWORK_CONFIG.DEVELOPMENT : NETWORK_CONFIG.PRODUCTION)
  };
};

// API endpoint health check URLs
export const HEALTH_CHECK_ENDPOINTS = {
  PRIMARY: '/health',
  FALLBACK: '/auth/me', // Secondary endpoint to check if API is responsive
};

// Error messages for different scenarios
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  TIMEOUT: 'Request timed out. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  AUTHENTICATION_ERROR: 'Your session has expired. Please log in again.',
  PERMISSION_ERROR: 'You don\'t have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  RATE_LIMITED: 'Too many requests. Please wait a moment and try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
};

export default NETWORK_CONFIG;
