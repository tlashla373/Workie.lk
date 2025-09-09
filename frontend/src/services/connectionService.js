import apiService from './apiService.js';

export class ConnectionService {
  // Get current user's connections/friends
  async getMyConnections() {
    try {
      const response = await apiService.get('/connections/my-connections');
      return response;
    } catch (error) {
      console.error('Error fetching connections:', error);
      throw error;
    }
  }

  // Get connection statistics
  async getConnectionStats() {
    try {
      const response = await apiService.get('/connections/stats');
      return response;
    } catch (error) {
      console.error('Error fetching connection stats:', error);
      throw error;
    }
  }

  // Send connection request
  async sendConnectionRequest(userId) {
    try {
      const response = await apiService.post('/connections/send-request', { userId });
      return response;
    } catch (error) {
      console.error('Error sending connection request:', error);
      throw error;
    }
  }

  // Respond to connection request
  async respondToRequest(connectionId, action) {
    try {
      const response = await apiService.put(`/connections/respond/${connectionId}`, { action });
      return response;
    } catch (error) {
      console.error('Error responding to connection request:', error);
      throw error;
    }
  }

  // Remove connection
  async removeConnection(connectionId) {
    try {
      const response = await apiService.delete(`/connections/${connectionId}`);
      return response;
    } catch (error) {
      console.error('Error removing connection:', error);
      throw error;
    }
  }
}

// Export singleton instance
const connectionService = new ConnectionService();
export default connectionService;
