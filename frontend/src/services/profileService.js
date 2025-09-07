import apiService from './apiService.js';

export class ProfileService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.pendingRequests = new Map();
    this.currentUserId = null; // Track current user to detect user changes
    
    // Initialize and check for user changes on startup
    this.checkUserChange();
  }

  // Clear all cache when user changes
  clearAllCache() {
    this.cache.clear();
    this.pendingRequests.clear();
    console.log('ProfileService: All cache cleared');
  }

  // Check if user has changed and clear cache if needed
  checkUserChange() {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    
    if (!token || !user) {
      // No authentication, clear cache
      if (this.cache.size > 0) {
        this.clearAllCache();
        this.currentUserId = null;
      }
      return false;
    }

    try {
      const userData = JSON.parse(user);
      const userId = userData.id || userData._id;
      
      if (this.currentUserId && this.currentUserId !== userId) {
        // User has changed, clear cache
        console.log('ProfileService: User changed, clearing cache');
        this.clearAllCache();
      }
      
      this.currentUserId = userId;
      return true;
    } catch (error) {
      console.error('ProfileService: Error parsing user data:', error);
      this.clearAllCache();
      this.currentUserId = null;
      return false;
    }
  }

  // Get current user's profile data with caching
  async getCurrentUserProfile() {
    // Check if user has changed or if there's no authentication
    if (!this.checkUserChange()) {
      throw new Error('Authentication required. Please log in.');
    }

    const cacheKey = 'currentUserProfile';
    
    // Check if there's already a pending request
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    // Check cache first (only if user hasn't changed)
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log('ProfileService: Returning cached profile data');
      return cached.data;
    }

    try {
      // Create and store the promise to prevent duplicate requests
      const requestPromise = this._fetchCurrentUserProfile();
      this.pendingRequests.set(cacheKey, requestPromise);
      
      const response = await requestPromise;
      
      // Cache successful response
      this.cache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });
      
      console.log('ProfileService: Profile data fetched and cached successfully');
      return response;
    } catch (error) {
      console.error('ProfileService: Error fetching current user profile:', error);
      
      // If it's an authentication error, clear cache and user data
      if (error.message?.includes('401') || error.message?.includes('authentication') || error.message?.includes('token')) {
        console.log('ProfileService: Authentication error detected, clearing cache');
        this.clearAllCache();
        this.currentUserId = null;
        throw new Error('Authentication failed. Please log in again.');
      }
      
      throw error;
    } finally {
      // Remove from pending requests
      this.pendingRequests.delete(cacheKey);
    }
  }

  // Private method to actually fetch the data
  async _fetchCurrentUserProfile() {
    try {
      console.log('ProfileService: Fetching current user profile from API...');
      console.log('ProfileService: Auth token:', localStorage.getItem('auth_token') ? 'EXISTS' : 'NOT FOUND');
      console.log('ProfileService: User data:', localStorage.getItem('auth_user') ? 'EXISTS' : 'NOT FOUND');
      
      const response = await apiService.get('/auth/me');
      console.log('ProfileService: Profile API response:', response);
      return response;
    } catch (error) {
      console.error('ProfileService: API Error fetching current user profile:', error);
      console.error('ProfileService: Error name:', error.name);
      console.error('ProfileService: Error message:', error.message);
      
      // Check if it's a specific authentication error
      if (error.message?.includes('401') || error.message?.includes('Invalid token') || error.message?.includes('Token expired')) {
        console.log('ProfileService: Authentication error detected');
        // Clear potentially invalid tokens
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
      
      throw error;
    }
  }

  // Clear cache for current user profile
  clearCurrentUserProfileCache() {
    this.cache.delete('currentUserProfile');
  }

  // Handle user logout - clear all cache and user tracking
  handleLogout() {
    console.log('ProfileService: Handling user logout');
    this.clearAllCache();
    this.currentUserId = null;
  }

  // Handle user login - clear cache to ensure fresh data
  handleLogin(userId) {
    console.log('ProfileService: Handling user login for user:', userId);
    if (this.currentUserId && this.currentUserId !== userId) {
      this.clearAllCache();
    }
    this.currentUserId = userId;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    return !!(token && user);
  }

  // Get current user ID from localStorage
  getCurrentUserId() {
    try {
      const user = localStorage.getItem('auth_user');
      if (user) {
        const userData = JSON.parse(user);
        return userData.id || userData._id;
      }
    } catch (error) {
      console.error('ProfileService: Error getting user ID:', error);
    }
    return null;
  }

  // Debug method to check authentication status
  debugAuthStatus() {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    const currentUserId = this.getCurrentUserId();
    
    console.log('ProfileService Debug:', {
      hasToken: !!token,
      hasUser: !!user,
      currentUserId,
      trackedUserId: this.currentUserId,
      cacheSize: this.cache.size,
      pendingRequests: this.pendingRequests.size
    });
    
    return {
      authenticated: !!(token && user),
      currentUserId,
      trackedUserId: this.currentUserId,
      cacheSize: this.cache.size
    };
  }

  // Get user profile by ID
  async getUserProfile(userId) {
    try {
      const response = await apiService.get(`/profiles/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userId, profileData) {
    try {
      const response = await apiService.put(`/profiles/${userId}`, profileData);
      
      // Clear cache and trigger profile update event
      if (response.success) {
        this.clearCurrentUserProfileCache();
        window.dispatchEvent(new CustomEvent('profileUpdated'));
        localStorage.setItem('profileUpdated', Date.now().toString());
      }
      
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Update user basic information
  async updateUser(userId, userData) {
    try {
      const response = await apiService.put(`/users/${userId}`, userData);
      
      // Clear cache and trigger profile update event
      if (response.success) {
        this.clearCurrentUserProfileCache();
        window.dispatchEvent(new CustomEvent('profileUpdated'));
        localStorage.setItem('profileUpdated', Date.now().toString());
      }
      
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Add skill to profile
  async addSkill(userId, skillData) {
    try {
      const response = await apiService.post(`/profiles/${userId}/skills`, skillData);
      return response;
    } catch (error) {
      console.error('Error adding skill:', error);
      throw error;
    }
  }

  // Add experience to profile
  async addExperience(userId, experienceData) {
    try {
      const response = await apiService.post(`/profiles/${userId}/experience`, experienceData);
      return response;
    } catch (error) {
      console.error('Error adding experience:', error);
      throw error;
    }
  }

  // Add portfolio item
  async addPortfolioItem(userId, portfolioData) {
    try {
      const response = await apiService.post(`/profiles/${userId}/portfolio`, portfolioData);
      return response;
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      throw error;
    }
  }

  // Update availability
  async updateAvailability(userId, availabilityData) {
    try {
      const response = await apiService.put(`/profiles/${userId}/availability`, availabilityData);
      return response;
    } catch (error) {
      console.error('Error updating availability:', error);
      throw error;
    }
  }
}

// Export singleton instance
const profileService = new ProfileService();
export default profileService;
