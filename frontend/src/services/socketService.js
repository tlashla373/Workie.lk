import io from 'socket.io-client';
import authService from './authService';
import apiService from './apiService';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 1000;
    this.eventListeners = new Map();
  }

  // Initialize socket connection
  connect() {
    if (this.socket?.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    try {
      console.log('Attempting to connect to Socket.IO server...');
      
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

      // Socket.IO server URL - use the same host as the current page
      const SOCKET_URL = `${window.location.protocol}//${window.location.hostname}:5000`;
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
      console.log('Socket connected:', this.socket.id);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Authenticate user with socket
      const user = authService.getUser();
      console.log('User data for socket authentication:', user);
      
      if (user) {
        const userId = user.id || user._id; // Handle both possible ID fields
        if (userId) {
          console.log('Authenticating socket with user ID:', userId);
          this.socket.emit('authenticate', userId);
        } else {
          console.error('No user ID found in user data:', user);
        }
      } else {
        console.warn('No user data found for socket authentication');
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });

    // Reconnection events
    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
      this.isConnected = true;
      this.reconnectAttempts = 0;
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
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

  // Subscribe to message events
  subscribeToMessageEvents(callback) {
    if (!this.socket) return;

    const messageEvents = [
      'new-message',
      'message-read',
      'user-typing',
      'user-stopped-typing'
    ];

    messageEvents.forEach(event => {
      this.socket.on(event, (data) => {
        console.log(`Message event received (${event}):`, data);
        callback(data, event);
      });
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
      console.log('Disconnecting socket...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.eventListeners.clear();
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
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

// Try to connect immediately if user is already authenticated
setTimeout(() => {
  initializeSocket();
}, 1000); // Small delay to ensure auth is ready

export default socketService;