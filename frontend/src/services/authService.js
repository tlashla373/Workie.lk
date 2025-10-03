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

  // Google Sign-In
  async googleSignIn(googleToken) {
    try {
      // Call backend API to authenticate with Google token
      const response = await apiService.post('/auth/google-signin', {
        accessToken: googleToken
      }, { includeAuth: false });
      
      if (response.success && response.data.token) {
        apiService.setAuthToken(response.data.token);
        
        // Always fetch the latest user data from /auth/me after Google sign-in
        try {
          const userDataResponse = await apiService.get('/auth/me');
          if (userDataResponse.success && userDataResponse.data.user) {
            // Store the latest user data from database
            apiService.setUser(userDataResponse.data.user);
            
            // Return the response with fresh user data
            return {
              ...response,
              data: {
                ...response.data,
                user: userDataResponse.data.user
              }
            };
          }
        } catch (fetchError) {
          console.warn('Failed to fetch latest user data after Google sign-in:', fetchError);
          // Fallback to login response data
          if (response.data.user) {
            apiService.setUser(response.data.user);
          }
        }
        
        return response;
      }
      
      throw new Error(response.message || 'Google Sign-In failed');
    } catch (error) {
      console.error('Google Sign-In error:', error);
      throw error;
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await apiService.post('/auth/login', credentials, { includeAuth: false });
      
      if (response.success && response.data.token) {
        apiService.setAuthToken(response.data.token);
        
        // Always fetch the latest user data from /auth/me after login
        try {
          const userDataResponse = await apiService.get('/auth/me');
          if (userDataResponse.success && userDataResponse.data.user) {
            // Store the latest user data from database
            apiService.setUser(userDataResponse.data.user);
            const userId = userDataResponse.data.user.id || userDataResponse.data.user._id;
            profileService.handleLogin(userId);
            
            // Return the response with fresh user data
            return {
              ...response,
              data: {
                ...response.data,
                user: userDataResponse.data.user
              }
            };
          }
        } catch (fetchError) {
          console.warn('Failed to fetch latest user data after login:', fetchError);
          // Fallback to login response data
          if (response.data.user) {
            apiService.setUser(response.data.user);
            const userId = response.data.user.id || response.data.user._id;
            profileService.handleLogin(userId);
          }
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

  // Verify reset PIN
  async verifyResetPin(email, pin) {
    try {
      const response = await apiService.post('/auth/verify-reset-pin', { email, pin }, { includeAuth: false });
      return response;
    } catch (error) {
      console.error('Verify reset PIN error:', error);
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

  // Update user role (for role selection)
  async updateUserRole(userType) {
    try {
      const response = await apiService.put('/auth/update-role', { userType });
      
      if (response.success) {
        // Update stored user data with the new userType
        if (response.data.user) {
          apiService.setUser(response.data.user);
          console.log('Updated stored user data:', response.data.user);
        }
        
        return response;
      }
      
      throw new Error(response.message || 'Failed to update user role');
    } catch (error) {
      console.error('Update user role error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!apiService.getAuthToken();
  }

  // Get user role from stored user data
  getUserRole() {
    const user = apiService.getUser();
    return user?.userType || null;
  }

  // Get full user object from stored user data
  getUser() {
    return apiService.getUser();
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;