import apiService from './apiService.js';
import { API_ENDPOINTS } from '../config/api.js';
import profileService from './profileService.js';

export class AuthService {
  // Register new user
  async register(userData) {
    try {
      const response = await apiService.post('/auth/register', userData, { includeAuth: false });
      
      if (response.success && response.data.token) {
        apiService.setAuthToken(response.data.token);
        
        // Store user data and notify ProfileService of registration
        if (response.data.user) {
          apiService.setUser(response.data.user);
          const userId = response.data.user.id || response.data.user._id;
          profileService.handleLogin(userId);
        }
        
        return response;
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      // If it's a validation error, provide more detailed message
      if (error.message.includes('Validation failed')) {
        throw new Error('Please check your form data: ' + error.message);
      }
      throw error;
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await apiService.post('/auth/login', credentials, { includeAuth: false });
      
      if (response.success && response.data.token) {
        apiService.setAuthToken(response.data.token);
        
        // Store user data and notify ProfileService of login
        if (response.data.user) {
          apiService.setUser(response.data.user);
          const userId = response.data.user.id || response.data.user._id;
          profileService.handleLogin(userId);
        }
        
        return response;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      await apiService.post('/auth/logout');
      
      // Clear all authentication data and notify ProfileService
      apiService.removeAuthToken();
      apiService.removeUser();
      profileService.handleLogout();
      
      return { success: true };
    } catch (error) {
      // Even if API call fails, remove token locally
      apiService.removeAuthToken();
      console.error('Logout error:', error);
      return { success: true };
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await apiService.get('/auth/me');
      return response;
    } catch (error) {
      console.error('Get current user error:', error);
      // If token is invalid, remove it
      if (error.message.includes('Invalid token') || error.message.includes('Token expired')) {
        apiService.removeAuthToken();
      }
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await apiService.post('/auth/forgot-password', { email }, { includeAuth: false });
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(token, password) {
    try {
      const response = await apiService.put(`/auth/reset-password/${token}`, { password }, { includeAuth: false });
      
      if (response.success && response.data.token) {
        apiService.setAuthToken(response.data.token);
      }
      
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiService.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!apiService.getAuthToken();
  }

  // Get user role from token (basic implementation)
  getUserRole() {
    const token = apiService.getAuthToken();
    if (!token) return null;

    try {
      // Basic JWT payload decode (not secure, just for UI logic)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.userType || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;