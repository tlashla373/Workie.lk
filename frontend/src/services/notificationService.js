import apiService from './apiService';
import socketService from './socketService';
import { API_ENDPOINTS } from '../config/api';

class NotificationService {
  constructor() {
    this.isInitialized = false;
    this.notificationCallbacks = new Set();
  }

  // Initialize the notification service
  initialize(notificationContext) {
    if (this.isInitialized) return;

    this.notificationContext = notificationContext;
    this.setupSocketListeners();
    this.setupPeriodicSync();
    this.isInitialized = true;

    console.log('Notification service initialized');
  }

  // Setup periodic sync to fetch notifications from server
  setupPeriodicSync() {
    // Sync notifications every 5 minutes
    this.syncInterval = setInterval(async () => {
      try {
        if (this.notificationContext) {
          const notifications = await this.getNotifications();
          // Update context with latest notifications
          this.notificationContext.syncNotifications(notifications);
        }
      } catch (error) {
        console.error('Error during periodic notification sync:', error);
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Initial sync
    this.syncNotifications();
  }

  // Sync notifications immediately
  async syncNotifications() {
    try {
      if (this.notificationContext) {
        const notifications = await this.getNotifications();
        this.notificationContext.syncNotifications(notifications);
      }
    } catch (error) {
      console.error('Error syncing notifications:', error);
    }
  }

  // Cleanup method
  cleanup() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
    this.isInitialized = false;
    this.notificationCallbacks.clear();
  }

  // Setup socket listeners for real-time notifications
  setupSocketListeners() {
    // Subscribe to real-time notifications
    socketService.subscribeToNotifications((notification, action = 'new') => {
      this.handleRealtimeNotification(notification, action);
    });

    // Subscribe to job-related notifications
    socketService.subscribeToJobEvents((data, event) => {
      this.handleJobEvent(data, event);
    });

    // Subscribe to message notifications
    socketService.subscribeToMessageEvents((data, event) => {
      this.handleMessageEvent(data, event);
    });

    // Subscribe to connection notifications
    socketService.subscribeToConnectionEvents((data, event) => {
      this.handleConnectionEvent(data, event);
    });

    // Subscribe to system notifications
    socketService.subscribeToSystemEvents((data, event) => {
      this.handleSystemEvent(data, event);
    });
  }

  // Handle real-time notification updates
  handleRealtimeNotification(notification, action) {
    if (!this.notificationContext) return;

    // Normalize notification ID and field names (ensure it has both id/_id and read/isRead)
    const normalizedNotification = {
      ...notification,
      id: notification._id || notification.id,
      _id: notification._id || notification.id,
      read: notification.isRead !== undefined ? notification.isRead : notification.read
    };

    switch (action) {
      case 'new':
        this.notificationContext.addNotification(normalizedNotification);
        break;
      case 'updated':
        this.updateNotification(normalizedNotification);
        break;
      case 'deleted':
        this.notificationContext.deleteNotification(normalizedNotification.id);
        break;
      case 'bulk-update':
        this.handleBulkUpdate(normalizedNotification);
        break;
      default:
        console.log('Unknown notification action:', action);
    }

    // Notify registered callbacks
    this.notificationCallbacks.forEach(callback => {
      try {
        callback(normalizedNotification, action);
      } catch (error) {
        console.error('Error in notification callback:', error);
      }
    });
  }

  // Handle job-related events
  handleJobEvent(data, event) {
    let notification;

    switch (event) {
      case 'job-application-received':
        notification = {
          title: 'New Job Application',
          message: `You received a new application for "${data.jobTitle}"`,
          type: 'job_application',
          actionUrl: `/jobs/${data.jobId}/applications`,
          metadata: { jobId: data.jobId, applicationId: data.applicationId }
        };
        break;
        
      case 'job-application-updated':
        notification = {
          title: 'Application Status Updated',
          message: `Your application for "${data.jobTitle}" has been ${data.status}`,
          type: 'job_application',
          actionUrl: `/job-application-page?id=${data.applicationId}`,
          metadata: { jobId: data.jobId, applicationId: data.applicationId, status: data.status }
        };
        break;
        
      case 'job-posted':
        notification = {
          title: 'New Job Posted',
          message: `New job: "${data.jobTitle}" matches your skills`,
          type: 'job_posted',
          actionUrl: `/jobs/${data.jobId}`,
          metadata: { jobId: data.jobId }
        };
        break;
        
      case 'job-completed':
        notification = {
          title: 'Job Completed',
          message: `Job "${data.jobTitle}" has been marked as completed`,
          type: 'job_posted',
          actionUrl: `/workhistory`,
          metadata: { jobId: data.jobId }
        };
        break;
        
      default:
        console.log('Unhandled job event:', event);
        return;
    }

    if (notification) {
      this.notificationContext?.addNotification(notification);
    }
  }

  // Handle message events
  handleMessageEvent(data, event) {
    let notification;

    switch (event) {
      case 'new-message':
        notification = {
          title: 'New Message',
          message: `${data.senderName}: ${data.message.substring(0, 50)}${data.message.length > 50 ? '...' : ''}`,
          type: 'message',
          actionUrl: `/messages/${data.conversationId}`,
          metadata: { conversationId: data.conversationId, senderId: data.senderId }
        };
        break;
        
      default:
        return; // Don't create notifications for typing indicators, etc.
    }

    if (notification) {
      this.notificationContext?.addNotification(notification);
    }
  }

  // Handle connection events
  handleConnectionEvent(data, event) {
    let notification;

    switch (event) {
      case 'connection-request':
        notification = {
          title: 'New Connection Request',
          message: `${data.requesterName} wants to connect with you`,
          type: 'connection',
          actionUrl: `/friends?tab=requests`,
          metadata: { requesterId: data.requesterId, requestId: data.requestId }
        };
        break;
        
      case 'connection-accepted':
        notification = {
          title: 'Connection Accepted',
          message: `${data.accepterName} accepted your connection request`,
          type: 'connection',
          actionUrl: `/profile/${data.accepterId}`,
          metadata: { accepterId: data.accepterId }
        };
        break;
        
      default:
        console.log('Unhandled connection event:', event);
        return;
    }

    if (notification) {
      this.notificationContext?.addNotification(notification);
    }
  }

  // Handle system events
  handleSystemEvent(data, event) {
    let notification;

    switch (event) {
      case 'system-announcement':
        notification = {
          title: 'System Announcement',
          message: data.message,
          type: 'system',
          actionUrl: data.actionUrl || null,
          metadata: { priority: data.priority || 'normal' }
        };
        break;
        
      case 'maintenance-notice':
        notification = {
          title: 'Maintenance Notice',
          message: `Scheduled maintenance: ${data.message}`,
          type: 'system',
          metadata: { maintenanceTime: data.scheduledTime }
        };
        break;
        
      case 'account-verified':
        notification = {
          title: 'Account Verified',
          message: 'Your account has been successfully verified!',
          type: 'system',
          actionUrl: '/profile',
          metadata: { verificationType: data.verificationType }
        };
        break;
        
      default:
        console.log('Unhandled system event:', event);
        return;
    }

    if (notification) {
      this.notificationContext?.addNotification(notification);
    }
  }
  async getNotifications() {
    try {
      const response = await apiService.get('/notifications');
      return response.data || response;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Alias for getNotifications to match useNotifications hook expectations
  async fetchNotifications(page = 1, limit = 50) {
    try {
      const response = await apiService.get(`/notifications?page=${page}&limit=${limit}`);
      const data = response.data || response;
      
      // Normalize notification IDs and field names (map _id to id, isRead to read for frontend consistency)
      if (data && data.notifications) {
        data.notifications = data.notifications.map(notification => ({
          ...notification,
          id: notification._id || notification.id,
          read: notification.isRead !== undefined ? notification.isRead : notification.read
        }));
      }
      
      return data;
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

  async clearAllNotifications() {
    try {
      const response = await apiService.delete('/notifications/clear-all');
      return response.data || response;
    } catch (error) {
      console.error('Error clearing all notifications:', error);
      throw error;
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
