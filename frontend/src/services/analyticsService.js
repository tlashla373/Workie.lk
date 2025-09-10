import apiService from './apiService.js';

export class AnalyticsService {
  // Get profile view statistics
  async getProfileViews() {
    try {
      const response = await apiService.get('/analytics/profile-views');
      return response;
    } catch (error) {
      console.error('Error fetching profile views:', error);
      throw error;
    }
  }

  // Track a profile view
  async trackProfileView(userId, viewerInfo = {}) {
    try {
      const response = await apiService.post(`/analytics/track-view/${userId}`, viewerInfo);
      return response;
    } catch (error) {
      console.error('Error tracking profile view:', error);
      throw error;
    }
  }

  // Get dashboard analytics
  async getDashboardAnalytics() {
    try {
      const response = await apiService.get('/analytics/dashboard');
      return response;
    } catch (error) {
      console.error('Error fetching dashboard analytics:', error);
      throw error;
    }
  }
}

// Export singleton instance
const analyticsService = new AnalyticsService();
export default analyticsService;
