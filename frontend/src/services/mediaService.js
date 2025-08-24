import apiService from './apiService';
import profileService from './profileService';

class MediaService {
  // Upload profile picture
  async uploadProfilePicture(file) {
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);

      const response = await apiService.postFormData('/media/profile-picture', formData);
      
      // Trigger profile update event for other components to refresh
      if (response.success) {
        profileService.clearCurrentUserProfileCache();
        window.dispatchEvent(new CustomEvent('profileUpdated'));
        localStorage.setItem('profileUpdated', Date.now().toString());
      }
      
      return response;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }

  // Upload cover photo
  async uploadCoverPhoto(file) {
    try {
      const formData = new FormData();
      formData.append('coverPhoto', file);

      const response = await apiService.postFormData('/media/cover-photo', formData);
      
      // Trigger profile update event for other components to refresh
      if (response.success) {
        profileService.clearCurrentUserProfileCache();
        window.dispatchEvent(new CustomEvent('profileUpdated'));
        localStorage.setItem('profileUpdated', Date.now().toString());
      }
      
      return response;
    } catch (error) {
      console.error('Error uploading cover photo:', error);
      throw error;
    }
  }

  // Upload verification documents
  async uploadVerificationDocuments(files) {
    try {
      const formData = new FormData();
      
      if (files.idPhotoFront) {
        formData.append('idPhotoFront', files.idPhotoFront);
      }
      if (files.idPhotoBack) {
        formData.append('idPhotoBack', files.idPhotoBack);
      }

      const response = await apiService.postFormData('/media/verification-documents', formData);
      return response;
    } catch (error) {
      console.error('Error uploading verification documents:', error);
      throw error;
    }
  }

  // Upload portfolio items (images and videos)
  async uploadPortfolioItems(files, progressCallback = null) {
    try {
      const formData = new FormData();
      
      files.forEach((file, index) => {
        formData.append('portfolioFiles', file);
      });

      const config = {};
      if (progressCallback) {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          progressCallback(percentCompleted);
        };
      }

      const response = await apiService.postFormData('/media/portfolio', formData, config);
      return response;
    } catch (error) {
      console.error('Error uploading portfolio items:', error);
      throw error;
    }
  }

  // Upload job image
  async uploadJobImage(file) {
    try {
      const formData = new FormData();
      formData.append('jobImage', file);

      const response = await apiService.postFormData('/media/job-image', formData);
      return response;
    } catch (error) {
      console.error('Error uploading job image:', error);
      throw error;
    }
  }

  // Upload document
  async uploadDocument(file) {
    try {
      const formData = new FormData();
      formData.append('document', file);

      const response = await apiService.postFormData('/media/document', formData);
      return response;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  // Delete media file
  async deleteMediaFile(publicId, resourceType = 'image') {
    try {
      const response = await apiService.delete(`/media/${publicId}`, {
        resourceType
      });
      return response;
    } catch (error) {
      console.error('Error deleting media file:', error);
      throw error;
    }
  }

  // Get optimized URL
  async getOptimizedUrl(publicId, options = {}) {
    try {
      const queryParams = new URLSearchParams(options).toString();
      const response = await apiService.get(`/media/optimize/${publicId}?${queryParams}`);
      return response.optimizedUrl;
    } catch (error) {
      console.error('Error getting optimized URL:', error);
      throw error;
    }
  }

  // Helper function to validate file type
  validateFileType(file, allowedTypes) {
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }
    return true;
  }

  // Helper function to validate file size
  validateFileSize(file, maxSizeInMB) {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      throw new Error(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum allowed size of ${maxSizeInMB}MB`);
    }
    return true;
  }

  // Comprehensive file validation
  validateFile(file, options = {}) {
    const {
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxSizeInMB = 5,
      isVideo = false
    } = options;

    if (isVideo) {
      const videoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/quicktime'];
      this.validateFileType(file, videoTypes);
      this.validateFileSize(file, 50); // 50MB for videos
    } else {
      this.validateFileType(file, allowedTypes);
      this.validateFileSize(file, maxSizeInMB);
    }

    return true;
  }

  // Get file preview URL
  getFilePreview(file) {
    if (file && file instanceof File) {
      return URL.createObjectURL(file);
    }
    return null;
  }

  // Cleanup preview URL
  cleanupPreview(previewUrl) {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
  }

  // Batch upload with progress tracking
  async batchUpload(files, uploadFunction, progressCallback = null) {
    const results = [];
    const total = files.length;

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await uploadFunction(files[i]);
        results.push({ success: true, result, file: files[i] });
        
        if (progressCallback) {
          progressCallback({
            completed: i + 1,
            total,
            percentage: Math.round(((i + 1) / total) * 100),
            currentFile: files[i].name
          });
        }
      } catch (error) {
        results.push({ success: false, error, file: files[i] });
        
        if (progressCallback) {
          progressCallback({
            completed: i + 1,
            total,
            percentage: Math.round(((i + 1) / total) * 100),
            currentFile: files[i].name,
            error: error.message
          });
        }
      }
    }

    return results;
  }

  // Generate thumbnail for video (client-side)
  generateVideoThumbnail(videoFile) {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        video.currentTime = 1; // Seek to 1 second
      };

      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      };

      video.onerror = reject;
      video.src = URL.createObjectURL(videoFile);
    });
  }
}

export default new MediaService();
