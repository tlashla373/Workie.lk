import { useEffect, useState } from 'react';
import { useNotificationContext } from '../contexts/NotificationContext';
import notificationService from '../services/notificationService';
import socketService from '../services/socketService';
import { useAuth } from './useAuth';

export const useNotifications = () => {
  const context = useNotificationContext();
  const { user, authenticated } = useAuth();
  const [isConnected, setIsConnected] = useState(false);

  // Initialize notification service when context is available
  useEffect(() => {
    if (context && authenticated) {
      notificationService.initialize(context);
      
      // Initialize socket connection
      if (!socketService.isConnected) {
        const socket = socketService.connect();
        if (socket) {
          setIsConnected(true);
        }
      } else {
        setIsConnected(true);
      }

      // Load initial notifications
      loadInitialNotifications();
    }

    return () => {
      if (!authenticated) {
        socketService.disconnect();
        setIsConnected(false);
      }
    };
  }, [context, authenticated]);

  // Load initial notifications
  const loadInitialNotifications = async () => {
    try {
      const response = await notificationService.fetchNotifications(1, 50);
      if (response?.notifications) {
        context.setNotifications(response.notifications);
      }
    } catch (error) {
      console.error('Failed to load initial notifications:', error);
    }
  };

  // Enhanced mark as read with API call
  const markAsRead = async (notificationId) => {
    try {
      const success = await notificationService.markAsRead(notificationId);
      if (success) {
        // Update local context state after successful API call
        context.markAsRead(notificationId);
      }
      return success;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return false;
    }
  };

  // Enhanced mark all as read with API call
  const markAllAsRead = async () => {
    try {
      const success = await notificationService.markAllAsRead();
      if (success) {
        // Update local context state after successful API call
        context.markAllAsRead();
      }
      return success;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return false;
    }
  };

  // Enhanced delete notification with API call
  const deleteNotification = async (notificationId) => {
    try {
      const success = await notificationService.deleteNotification(notificationId);
      if (success) {
        // Update local context state after successful API call
        context.deleteNotification(notificationId);
      }
      return success;
    } catch (error) {
      console.error('Failed to delete notification:', error);
      return false;
    }
  };

  // Enhanced clear all notifications with API call
  const clearAllNotifications = async () => {
    try {
      const success = await notificationService.clearAllNotifications();
      if (success) {
        // Update local context state after successful API call
        context.clearAllNotifications();
      }
      return success;
    } catch (error) {
      console.error('Failed to clear all notifications:', error);
      return false;
    }
  };

  // Load more notifications (pagination)
  const loadMoreNotifications = async (page = 2, limit = 20) => {
    try {
      context.setLoading(true);
      const response = await notificationService.fetchNotifications(page, limit);
      
      if (response?.notifications) {
        // Append new notifications to existing ones
        const existingIds = new Set(context.notifications.map(n => n.id));
        const newNotifications = response.notifications.filter(n => !existingIds.has(n.id));
        
        context.setNotifications([...context.notifications, ...newNotifications]);
        return response;
      }
    } catch (error) {
      console.error('Failed to load more notifications:', error);
      context.setError(error.message);
    } finally {
      context.setLoading(false);
    }
  };

  // Refresh notifications
  const refreshNotifications = async () => {
    await loadInitialNotifications();
  };

  // Get notifications by type
  const getNotificationsByType = (type) => {
    return context.getNotificationsByType(type);
  };

  // Get unread notifications
  const getUnreadNotifications = () => {
    return context.getUnreadNotifications();
  };

  // Get recent notifications
  const getRecentNotifications = () => {
    return context.getRecentNotifications();
  };

  // Subscribe to specific notification events
  const subscribeToNotificationEvents = (callback) => {
    return notificationService.onNotification(callback);
  };

  // Create test notification (for development)
  const createTestNotification = (type = 'system') => {
    return notificationService.createTestNotification(type);
  };

  // Get connection status
  const getConnectionStatus = () => {
    return {
      isConnected,
      socketStatus: socketService.getConnectionStatus()
    };
  };

  // Force reconnect socket
  const reconnectSocket = () => {
    socketService.forceReconnect();
    setTimeout(() => {
      setIsConnected(socketService.isConnected);
    }, 2000);
  };

  return {
    // State from context
    notifications: context.notifications,
    unreadCount: context.unreadCount,
    loading: context.loading,
    error: context.error,
    lastFetched: context.lastFetched,

    // Enhanced actions with API integration
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    
    // Additional actions
    loadMoreNotifications,
    refreshNotifications,
    
    // Utility functions
    getNotificationsByType,
    getUnreadNotifications,
    getRecentNotifications,
    subscribeToNotificationEvents,
    createTestNotification,
    
    // Connection status
    isConnected,
    getConnectionStatus,
    reconnectSocket,

    // Direct access to context methods
    addNotification: context.addNotification,
    playNotificationSound: context.playNotificationSound
  };
};

// Hook for specific notification types
export const useJobNotifications = () => {
  const { getNotificationsByType, subscribeToNotificationEvents } = useNotifications();
  const [jobNotifications, setJobNotifications] = useState([]);

  useEffect(() => {
    // Get initial job notifications
    const initialJobNotifications = [
      ...getNotificationsByType('job_application'),
      ...getNotificationsByType('job_posted')
    ];
    setJobNotifications(initialJobNotifications);

    // Subscribe to new job notifications
    const unsubscribe = subscribeToNotificationEvents((notification, action) => {
      if (notification.type === 'job_application' || notification.type === 'job_posted') {
        if (action === 'new') {
          setJobNotifications(prev => [notification, ...prev]);
        } else if (action === 'deleted') {
          setJobNotifications(prev => prev.filter(n => n.id !== notification.id));
        }
      }
    });

    return unsubscribe;
  }, []);

  return {
    jobNotifications,
    applicationNotifications: getNotificationsByType('job_application'),
    jobPostNotifications: getNotificationsByType('job_posted')
  };
};

// Hook for message notifications
export const useMessageNotifications = () => {
  const { getNotificationsByType, subscribeToNotificationEvents } = useNotifications();
  const [messageNotifications, setMessageNotifications] = useState([]);

  useEffect(() => {
    const initialMessageNotifications = getNotificationsByType('message');
    setMessageNotifications(initialMessageNotifications);

    const unsubscribe = subscribeToNotificationEvents((notification, action) => {
      if (notification.type === 'message') {
        if (action === 'new') {
          setMessageNotifications(prev => [notification, ...prev]);
        } else if (action === 'deleted') {
          setMessageNotifications(prev => prev.filter(n => n.id !== notification.id));
        }
      }
    });

    return unsubscribe;
  }, []);

  return {
    messageNotifications,
    unreadMessageCount: messageNotifications.filter(n => !n.read).length
  };
};

// Hook for connection notifications
export const useConnectionNotifications = () => {
  const { getNotificationsByType, subscribeToNotificationEvents } = useNotifications();
  const [connectionNotifications, setConnectionNotifications] = useState([]);

  useEffect(() => {
    const initialConnectionNotifications = getNotificationsByType('connection');
    setConnectionNotifications(initialConnectionNotifications);

    const unsubscribe = subscribeToNotificationEvents((notification, action) => {
      if (notification.type === 'connection') {
        if (action === 'new') {
          setConnectionNotifications(prev => [notification, ...prev]);
        } else if (action === 'deleted') {
          setConnectionNotifications(prev => prev.filter(n => n.id !== notification.id));
        }
      }
    });

    return unsubscribe;
  }, []);

  return {
    connectionNotifications,
    pendingRequests: connectionNotifications.filter(n => 
      n.metadata?.requestId && !n.read
    )
  };
};

// Hook for real-time notification status
export const useNotificationStatus = () => {
  const { isConnected, getConnectionStatus, unreadCount } = useNotifications();
  const [status, setStatus] = useState({
    isOnline: navigator.onLine,
    isConnected: false,
    hasUnread: false
  });

  useEffect(() => {
    setStatus(prev => ({
      ...prev,
      isConnected,
      hasUnread: unreadCount > 0
    }));
  }, [isConnected, unreadCount]);

  useEffect(() => {
    const handleOnline = () => setStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setStatus(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    ...status,
    connectionDetails: getConnectionStatus()
  };
};

export default useNotifications;