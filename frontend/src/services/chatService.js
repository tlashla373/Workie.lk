import apiService from './apiService';

class ChatService {
  // Get all chats for current user
  async getChats(params = {}) {
    const { page = 1, limit = 20, search, type } = params;
    return await apiService.get('/chat', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Create or get direct chat
  async createDirectChat(participantId) {
    return await apiService.post('/chat/direct', { participantId });
  }

  // Create group chat
  async createGroupChat(chatData) {
    return await apiService.post('/chat/group', chatData);
  }

  // Get specific chat details
  async getChatDetails(chatId) {
    return await apiService.get(`/chat/${chatId}`);
  }

  // Get messages for a chat
  async getChatMessages(chatId, params = {}) {
    const { page = 1, limit = 50, before } = params;
    const queryParams = new URLSearchParams();
    queryParams.append('page', page);
    queryParams.append('limit', limit);
    if (before) queryParams.append('before', before);
    
    console.log('chatService: Getting messages for chat:', chatId, 'params:', { page, limit, before });
    return await apiService.get(`/chat/${chatId}/messages?${queryParams.toString()}`);
  }

  // Send message
  async sendMessage(chatId, messageData) {
    return await apiService.post(`/chat/${chatId}/messages`, messageData);
  }

  // Mark messages as read
  async markAsRead(chatId) {
    return await apiService.put(`/chat/${chatId}/read`);
  }

  // Add reaction to message
  async addReaction(chatId, messageId, emoji) {
    return await apiService.post(`/chat/${chatId}/messages/${messageId}/react`, { emoji });
  }

  // Delete message
  async deleteMessage(chatId, messageId) {
    return await apiService.delete(`/chat/${chatId}/messages/${messageId}`);
  }

  // Update group chat
  async updateGroupChat(chatId, updateData) {
    return await apiService.put(`/chat/${chatId}`, updateData);
  }

  // Upload file for chat
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    return await apiService.postFormData('/media/upload', formData);
  }

  // Search users for chat
  async searchUsers(query) {
    return await apiService.get(`/users/search?q=${encodeURIComponent(query)}&limit=10`);
  }
}

export default new ChatService();