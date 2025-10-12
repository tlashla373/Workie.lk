class SocketService {
  constructor() {
    this.io = null;
    this.userSockets = new Map(); // Map of userId -> Set of socketIds (for multiple devices)
    this.socketUsers = new Map(); // Map of socketId -> userId
  }

  // Initialize socket service with io instance
  init(io) {
    this.io = io;
    this.setupSocketEvents();
    console.log('✅ Socket service initialized for notifications and real-time updates');
  }

  // Setup socket event handlers
  setupSocketEvents() {
    if (!this.io) return;

    this.io.on('connection', (socket) => {
      console.log(`📡 New socket connection: ${socket.id}`);

      // Handle user authentication
      socket.on('authenticate', (userId) => {
        this.authenticateUser(socket, userId);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.handleDisconnection(socket);
      });
    });
  }

  // Authenticate user and store socket mapping
  authenticateUser(socket, userId) {
    console.log(`🔐 Authenticate request from socket ${socket.id} for user: ${userId}`);
    
    if (!userId) {
      console.warn(`❌ Invalid userId provided for authentication: ${userId}`);
      return;
    }

    // Store socket mapping
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId).add(socket.id);
    this.socketUsers.set(socket.id, userId);

    // Join user-specific room
    socket.join(`user_${userId}`);
    socket.userId = userId;

    console.log(`✅ User ${userId} authenticated and joined room user_${userId}`);
    
    // Broadcast user online status
    this.broadcastUserStatus(userId, 'online');
  }

  // Store user socket connection
  addUserSocket(userId, socketId) {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId).add(socketId);
    this.socketUsers.set(socketId, userId);
    console.log(`👤 User ${userId} connected with socket ${socketId}`);
  }

  // Remove user socket connection
  removeUserSocket(userId) {
    const socketIds = this.userSockets.get(userId);
    if (socketIds) {
      socketIds.forEach(socketId => {
        this.socketUsers.delete(socketId);
      });
      this.userSockets.delete(userId);
      console.log(`👤 User ${userId} disconnected from all sockets`);
    }
  }

  // Handle socket disconnection
  handleDisconnection(socket) {
    const userId = this.socketUsers.get(socket.id);
    
    if (userId) {
      const userSocketSet = this.userSockets.get(userId);
      if (userSocketSet) {
        userSocketSet.delete(socket.id);
        
        // If no more sockets for this user, they're offline
        if (userSocketSet.size === 0) {
          this.userSockets.delete(userId);
          this.broadcastUserStatus(userId, 'offline');
        }
      }
      
      this.socketUsers.delete(socket.id);
    }

    console.log(`📡 Socket disconnected: ${socket.id}`);
  }

  // Emit event to specific user (all their devices)
  emitToUser(userId, event, data) {
    if (!this.io) {
      console.warn('❌ Socket service not initialized');
      return false;
    }

    console.log(`🎯 Attempting to emit ${event} to user ${userId}`);
    
    const socketIds = this.userSockets.get(userId);
    if (socketIds && socketIds.size > 0) {
      // Emit to all user's sockets
      socketIds.forEach(socketId => {
        this.io.to(socketId).emit(event, data);
      });
      console.log(`✅ Successfully emitted ${event} to user ${userId} (${socketIds.size} devices)`);
      return true;
    } else {
      console.log(`❌ User ${userId} not connected (no sockets found)`);
      return false;
    }
  }

  // Broadcast user status to all connected users
  broadcastUserStatus(userId, status) {
    if (!this.io) return;

    this.io.emit('userStatusUpdate', {
      userId,
      status,
      timestamp: new Date()
    });

    console.log(`📢 Broadcasted user status: ${userId} is ${status}`);
  }

  // Emit to all connected users
  emitToAll(event, data) {
    if (!this.io) {
      console.warn('Socket service not initialized');
      return false;
    }

    this.io.emit(event, data);
    console.log(`📡 Emitted ${event} to all users`);
    return true;
  }

  // Get connected users count
  getConnectedUsersCount() {
    return this.userSockets.size;
  }

  // Check if user is online (has at least one socket connection)
  isUserOnline(userId) {
    const socketIds = this.userSockets.get(userId);
    return socketIds && socketIds.size > 0;
  }

  // Get all online users
  getOnlineUsers() {
    return Array.from(this.userSockets.keys());
  }

  // Get socket count for a user
  getUserSocketCount(userId) {
    const socketIds = this.userSockets.get(userId);
    return socketIds ? socketIds.size : 0;
  }

  // Get total socket connections
  getTotalConnections() {
    let total = 0;
    this.userSockets.forEach(socketIds => {
      total += socketIds.size;
    });
    return total;
  }
}

// Export singleton instance
module.exports = new SocketService();
