// API Configuration
const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000, // 10 seconds
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${API_CONFIG.BASE_URL}/auth/login`,
  REGISTER: `${API_CONFIG.BASE_URL}/auth/register`,
  SELECT_ROLE: `${API_CONFIG.BASE_URL}/auth/select-role`,
  VERIFY_TOKEN: `${API_CONFIG.BASE_URL}/auth/verify-token`,
  FORGOT_PASSWORD: `${API_CONFIG.BASE_URL}/auth/forgot-password`,
  
  // User Management
  GET_PROFILE: `${API_CONFIG.BASE_URL}/users/profile`,
  UPDATE_PROFILE: `${API_CONFIG.BASE_URL}/users/profile`,
  DELETE_ACCOUNT: `${API_CONFIG.BASE_URL}/users/account`,
  
  // Health Check
  HEALTH: `${API_CONFIG.BASE_URL}/health`,
};

// Helper function to get auth token from localStorage
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to get user data from localStorage
export const getUserData = () => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
};

// Helper function to clear auth data
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  const user = getUserData();
  return !!(token && user);
};

// Generic API request function
export const apiRequest = async (url, options = {}) => {
  const token = getAuthToken();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  // Add authorization header if token exists
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }
  
  const config = {
    method: 'GET',
    headers: defaultHeaders,
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    // Handle 401 (Unauthorized) - token might be expired
    if (response.status === 401) {
      clearAuthData();
      // Redirect to login page or dispatch logout action
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
    
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout. Please try again.');
    }
    throw error;
  }
};

// Specific API functions for common operations
export const authAPI = {
  login: async (credentials) => {
    return apiRequest(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  register: async (userData) => {
    return apiRequest(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  selectRole: async (role) => {
    return apiRequest(API_ENDPOINTS.SELECT_ROLE, {
      method: 'POST',
      body: JSON.stringify({ role }),
    });
  },
  
  verifyToken: async () => {
    return apiRequest(API_ENDPOINTS.VERIFY_TOKEN);
  },
  
  forgotPassword: async (email) => {
    return apiRequest(API_ENDPOINTS.FORGOT_PASSWORD, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
};

export const userAPI = {
  getProfile: async () => {
    return apiRequest(API_ENDPOINTS.GET_PROFILE);
  },
  
  updateProfile: async (profileData) => {
    return apiRequest(API_ENDPOINTS.UPDATE_PROFILE, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
  
  deleteAccount: async () => {
    return apiRequest(API_ENDPOINTS.DELETE_ACCOUNT, {
      method: 'DELETE',
    });
  },
};

export default API_CONFIG;
