import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Notification Context
const NotificationContext = createContext();

// Action types
const NOTIFICATION_ACTIONS = {
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
  DELETE_NOTIFICATION: 'DELETE_NOTIFICATION',
  CLEAR_ALL_NOTIFICATIONS: 'CLEAR_ALL_NOTIFICATIONS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  UPDATE_UNREAD_COUNT: 'UPDATE_UNREAD_COUNT'
};

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  lastFetched: null
};

// Notification reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.SET_NOTIFICATIONS:
      const unreadCount = action.payload.filter(n => !n.read).length;
      return {
        ...state,
        notifications: action.payload,
        unreadCount,
        loading: false,
        error: null,
        lastFetched: new Date()
      };

    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      const newNotification = action.payload;
      const updatedNotifications = [newNotification, ...state.notifications];
      const newUnreadCount = updatedNotifications.filter(n => !n.read).length;
      
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: newUnreadCount
      };

    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      const readNotifications = state.notifications.map(notification => {
        const notificationId = notification.id || notification._id;
        return notificationId === action.payload
          ? { ...notification, read: true }
          : notification;
      });
      const readUnreadCount = readNotifications.filter(n => !n.read).length;
      
      return {
        ...state,
        notifications: readNotifications,
        unreadCount: readUnreadCount
      };

    case NOTIFICATION_ACTIONS.MARK_ALL_AS_READ:
      const allReadNotifications = state.notifications.map(notification => ({
        ...notification,
        read: true
      }));
      
      return {
        ...state,
        notifications: allReadNotifications,
        unreadCount: 0
      };

    case NOTIFICATION_ACTIONS.DELETE_NOTIFICATION:
      const filteredNotifications = state.notifications.filter(notification => {
        const notificationId = notification.id || notification._id;
        return notificationId !== action.payload;
      });
      const filteredUnreadCount = filteredNotifications.filter(n => !n.read).length;
      
      return {
        ...state,
        notifications: filteredNotifications,
        unreadCount: filteredUnreadCount
      };

    case NOTIFICATION_ACTIONS.CLEAR_ALL_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
        unreadCount: 0
      };

    case NOTIFICATION_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case NOTIFICATION_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case NOTIFICATION_ACTIONS.UPDATE_UNREAD_COUNT:
      return {
        ...state,
        unreadCount: action.payload
      };

    default:
      return state;
  }
};

// Notification Provider Component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Load notifications from localStorage on mount
  useEffect(() => {
    const loadStoredNotifications = () => {
      try {
        const storedNotifications = localStorage.getItem('workie_notifications');
        if (storedNotifications) {
          const notifications = JSON.parse(storedNotifications);
          dispatch({
            type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS,
            payload: notifications
          });
        }
      } catch (error) {
        console.error('Error loading stored notifications:', error);
      }
    };

    loadStoredNotifications();
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('workie_notifications', JSON.stringify(state.notifications));
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error);
    }
  }, [state.notifications]);

  // Actions
  const setNotifications = (notifications) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS,
      payload: notifications
    });
  };

  const addNotification = (notification) => {
    // Generate unique ID if not provided
    const newNotification = {
      id: notification.id || Date.now().toString(),
      title: notification.title,
      message: notification.message,
      type: notification.type || 'system',
      read: false,
      createdAt: notification.createdAt || new Date().toISOString(),
      actionUrl: notification.actionUrl || null,
      metadata: notification.metadata || {}
    };

    dispatch({
      type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
      payload: newNotification
    });

    // Play notification sound (optional)
    if (notification.playSound !== false) {
      playNotificationSound();
    }

    return newNotification;
  };

  const markAsRead = (notificationId) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.MARK_AS_READ,
      payload: notificationId
    });
  };

  const markAllAsRead = () => {
    dispatch({
      type: NOTIFICATION_ACTIONS.MARK_ALL_AS_READ
    });
  };

  const deleteNotification = (notificationId) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.DELETE_NOTIFICATION,
      payload: notificationId
    });
  };

  const clearAllNotifications = () => {
    dispatch({
      type: NOTIFICATION_ACTIONS.CLEAR_ALL_NOTIFICATIONS
    });
    localStorage.removeItem('workie_notifications');
  };

  const setLoading = (loading) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.SET_LOADING,
      payload: loading
    });
  };

  const setError = (error) => {
    dispatch({
      type: NOTIFICATION_ACTIONS.SET_ERROR,
      payload: error
    });
  };

  // Sync notifications with server data
  const syncNotifications = (serverNotifications) => {
    if (Array.isArray(serverNotifications)) {
      setNotifications(serverNotifications);
    }
  };

  // Helper function to play notification sound
  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification-sound.mp3'); // Add this file to your public folder
      audio.volume = 0.5;
      audio.play().catch(error => {
        console.log('Could not play notification sound:', error);
      });
    } catch (error) {
      console.log('Notification sound not available:', error);
    }
  };

  // Get notifications by type
  const getNotificationsByType = (type) => {
    return state.notifications.filter(notification => notification.type === type);
  };

  // Get unread notifications
  const getUnreadNotifications = () => {
    return state.notifications.filter(notification => !notification.read);
  };

  // Get recent notifications (last 24 hours)
  const getRecentNotifications = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return state.notifications.filter(notification => 
      new Date(notification.createdAt) > yesterday
    );
  };

  const contextValue = {
    // State
    notifications: state.notifications,
    unreadCount: state.unreadCount,
    loading: state.loading,
    error: state.error,
    lastFetched: state.lastFetched,

    // Actions
    setNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    setLoading,
    setError,
    syncNotifications,

    // Helper functions
    getNotificationsByType,
    getUnreadNotifications,
    getRecentNotifications,
    playNotificationSound
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

export { NOTIFICATION_ACTIONS };