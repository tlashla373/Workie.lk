import apiService from './apiService.js';

export class ProfileService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    this.pendingRequests = new Map();
  }

  // Get current user's profile data with caching
  async getCurrentUserProfile() {
    const cacheKey = 'currentUserProfile';
    
    // Check if there's already a pending request
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
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
      
      return response;
    } catch (error) {
      console.error('Error fetching current user profile:', error);
      throw error;
    } finally {
      // Remove from pending requests
      this.pendingRequests.delete(cacheKey);
    }
  }

  // Private method to actually fetch the data
  async _fetchCurrentUserProfile() {
    try {
      console.log('Fetching current user profile from API...');
      const response = await apiService.get('/auth/me');
      console.log('Profile API response:', response);
      return response;
    } catch (error) {
      console.error('API Error fetching current user profile:', error);
      throw error;
    }
  }

  // Clear cache for current user profile
  clearCurrentUserProfileCache() {
    this.cache.delete('currentUserProfile');
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
