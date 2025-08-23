import apiService from './apiService.js';

export class ProfileService {
  // Get current user's profile data
  async getCurrentUserProfile() {
    try {
      const response = await apiService.get('/auth/me');
      return response;
    } catch (error) {
      console.error('Error fetching current user profile:', error);
      throw error;
    }
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
