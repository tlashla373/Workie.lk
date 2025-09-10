import apiService from './apiService';

class NotificationService {
  async getNotifications() {
    try {
      const response = await apiService.get('/notifications');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async markAsRead(notificationId) {
    try {
      const response = await apiService.put(`/notifications/${notificationId}/read`);
      return response.data || response;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead() {
    try {
      const response = await apiService.put('/notifications/mark-all-read');
      return response.data || response;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async getUnreadCount() {
    try {
      const response = await apiService.get('/notifications/unread-count');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  }

  async createNotification(notification) {
    try {
      const response = await apiService.post('/notifications', notification);
      return response.data || response;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId) {
    try {
      const response = await apiService.delete(`/notifications/${notificationId}`);
      return response.data || response;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
