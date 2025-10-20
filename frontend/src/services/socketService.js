import io from 'socket.io-client';
import authService from './authService';
import apiService from './apiService';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.isAuthenticated = false;
    this.authenticatedUserId = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 1000;
    this.eventListeners = new Map();
  }

  // Initialize socket connection
  connect() {
    // If already connected, don't create a new connection
    if (this.socket?.connected) {
      console.log('✅ Socket already connected, reusing existing connection');
      return this.socket;
    }

    // If socket exists but disconnected, try to reconnect
    if (this.socket && !this.socket.connected) {
      console.log('🔄 Socket exists but disconnected, attempting to reconnect...');
      this.socket.connect();
      return this.socket;
    }

    try {
      console.log('🚀 Initializing new Socket.IO connection...');
      
      const token = apiService.getAuthToken();
      if (!token) {
        console.log('❌ No auth token found, skipping socket connection');
        return null;
      }

      const user = authService.getUser();
      console.log('🔐 Auth token found, user data:', { 
        hasToken: !!token, 
        userId: user?.id || user?._id,
        userName: user?.firstName 
      });

      // Socket.IO server URL - use environment variable or fallback to localhost
      const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      console.log('🌐 Connecting to Socket.IO server:', SOCKET_URL);

      this.socket = io(SOCKET_URL, {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling'],
        timeout: 10000,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectInterval
      });

      this.setupEventListeners();
      
      console.log('✅ Socket connection initialized');
      return this.socket;
    } catch (error) {
      console.error('❌ Error connecting to socket:', error);
      return null;
    }
  }

  // Setup default event listeners
  setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on('connect', () => {
      console.log('✅ Socket connected with ID:', this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Authenticate only if not already authenticated for this user
      const user = authService.getUser();
      const userId = user?.id || user?._id;
      
      if (userId && (!this.isAuthenticated || this.authenticatedUserId !== userId)) {
        console.log('🔐 Authenticating socket for user:', userId);
        this.socket.emit('authenticate', userId);
        this.authenticatedUserId = userId;
        this.isAuthenticated = true;
      } else if (this.isAuthenticated && this.authenticatedUserId === userId) {
        console.log('✅ Already authenticated for user:', userId, '- skipping re-authentication');
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('🔌 Socket disconnected:', reason);
      this.isConnected = false;
      
      // Reset authentication status on disconnect
      if (reason === 'io server disconnect' || reason === 'io client disconnect') {
        this.isAuthenticated = false;
        this.authenticatedUserId = null;
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      this.isConnected = false;
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('❌ Max reconnection attempts reached');
      }
    });

    // Reconnection events
    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('❌ Socket reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ Socket reconnection failed');
    });
  }

  // Subscribe to notification events
  subscribeToNotifications(callback) {
    if (!this.socket) {
      console.warn('Socket not connected, cannot subscribe to notifications');
      return;
    }

    // Listen for new notifications (matches backend emission)
    this.socket.on('newNotification', (notification) => {
      console.log('Received new notification:', notification);
      callback(notification);
    });

    // Listen for notification updates
    this.socket.on('notification-updated', (notification) => {
      console.log('Notification updated:', notification);
      callback(notification, 'updated');
    });

    // Listen for notification deletions
    this.socket.on('notification-deleted', (notificationId) => {
      console.log('Notification deleted:', notificationId);
      callback({ id: notificationId }, 'deleted');
    });

    // Listen for bulk notification updates
    this.socket.on('notifications-bulk-update', (data) => {
      console.log('Bulk notification update:', data);
      callback(data, 'bulk-update');
    });
  }

  // Subscribe to job-related events
  subscribeToJobEvents(callback) {
    if (!this.socket) return;

    const jobEvents = [
      'job-application-received',
      'job-application-updated',
      'job-posted',
      'job-updated',
      'job-cancelled',
      'job-completed'
    ];

    jobEvents.forEach(event => {
      this.socket.on(event, (data) => {
        console.log(`Job event received (${event}):`, data);
        callback(data, event);
      });
    });
  }

  // Chat-related APIs removed after WhatsApp migration

  // Listen for user status updates
  onUserStatusUpdate(callback) {
    if (!this.socket) return;
    this.socket.on('userStatusUpdate', callback);
  }

  // Remove all listeners (useful for cleanup)
  removeAllListeners() {
    if (!this.socket) return;
    
    const events = [
      'userStatusUpdate',
      'notifications-bulk-update',
      'notification-deleted',
      'notification-updated',
      'newNotification',
      // legacy chat events (no-ops if server doesn’t emit)
      'newMessage',
      'messageDeleted',
      'messageReaction',
      'messagesRead',
      'userTyping',
      'newGroupChat',
      'chatUpdated'
    ];

    events.forEach(event => {
      this.socket.off(event);
    });
  }

  // Subscribe to connection events
  subscribeToConnectionEvents(callback) {
    if (!this.socket) return;

    const connectionEvents = [
      'connection-request',
      'connection-accepted',
      'connection-rejected'
    ];

    connectionEvents.forEach(event => {
      this.socket.on(event, (data) => {
        console.log(`Connection event received (${event}):`, data);
        callback(data, event);
      });
    });
  }

  // Subscribe to system events
  subscribeToSystemEvents(callback) {
    if (!this.socket) return;

    const systemEvents = [
      'system-announcement',
      'maintenance-notice',
      'account-suspended',
      'account-verified'
    ];

    systemEvents.forEach(event => {
      this.socket.on(event, (data) => {
        console.log(`System event received (${event}):`, data);
        callback(data, event);
      });
    });
  }

  // Emit events to server
  emit(eventName, data) {
    if (!this.socket?.connected) {
      console.warn('Socket not connected, cannot emit event:', eventName);
      return false;
    }

    this.socket.emit(eventName, data);
    return true;
  }

  // Join a specific room
  joinRoom(roomId) {
    this.emit('join-room', roomId);
  }

  // Leave a specific room
  leaveRoom(roomId) {
    this.emit('leave-room', roomId);
  }

  // Mark notification as delivered
  markNotificationAsDelivered(notificationId) {
    this.emit('notification-delivered', notificationId);
  }

  // Send typing indicator
  sendTypingIndicator(recipientId, isTyping) {
    this.emit('typing-indicator', {
      recipientId,
      isTyping
    });
  }

  // Update user status
  updateUserStatus(status) {
    this.emit('user-status-update', status);
  }

  // Subscribe to custom events
  on(eventName, callback) {
    if (!this.socket) return;

    this.socket.on(eventName, callback);
    
    // Store listener for cleanup
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    this.eventListeners.get(eventName).push(callback);
  }

  // Unsubscribe from events
  off(eventName, callback) {
    if (!this.socket) return;

    this.socket.off(eventName, callback);
    
    // Remove from stored listeners
    if (this.eventListeners.has(eventName)) {
      const listeners = this.eventListeners.get(eventName);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting socket...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.isAuthenticated = false;
      this.authenticatedUserId = null;
      this.eventListeners.clear();
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      isAuthenticated: this.isAuthenticated,
      authenticatedUserId: this.authenticatedUserId,
      socketId: this.socket?.id || null,
      reconnectAttempts: this.reconnectAttempts
    };
  }

  // Force reconnection
  forceReconnect() {
    if (this.socket) {
      this.socket.disconnect();
      setTimeout(() => {
        this.connect();
      }, 1000);
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

// Auto-connect when user is authenticated
const initializeSocket = () => {
  if (authService.isAuthenticated() && !socketService.isConnected) {
    console.log('Auto-initializing socket connection...');
    socketService.connect();
  }
};

// Auto-disconnect when user logs out
const cleanupSocket = () => {
  console.log('Cleaning up socket connection...');
  socketService.disconnect();
};

// Export the cleanup function for use by authService
export { cleanupSocket };

export default socketService;