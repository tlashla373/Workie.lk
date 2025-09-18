import apiService from './apiService';
import mediaService from './mediaService';

class PostService {
  // Create a new post with media files
  async createPost(postData) {
    try {
      console.log('Creating new post...', postData);

      const { text, files, privacy, location, taggedFriends, userId, userEmail } = postData;

      // First, upload media files to Cloudinary if any
      let mediaUrls = [];
      if (files && files.length > 0) {
        console.log('Uploading media files to Cloudinary...');
        
        // Convert file objects to actual files for upload
        const filesToUpload = files.map(fileObj => fileObj.file);
        
        const uploadResult = await mediaService.batchUploadPostMedia(
          filesToUpload, 
          userId,
          (progress) => {
            console.log(`Upload progress: ${progress.percentage}% - ${progress.currentFile}`);
          }
        );

        // Extract successful uploads
        mediaUrls = uploadResult.successful.map(result => ({
          url: result.secureUrl || result.cloudinaryUrl,
          publicId: result.publicId,
          fileType: result.fileType,
          fileName: result.fileName,
          folder: result.folder
        }));

        console.log('Media uploaded successfully:', mediaUrls);

        if (uploadResult.failed.length > 0) {
          console.warn('Some files failed to upload:', uploadResult.failed);
        }
      }

      // Create post data with media URLs
      const postPayload = {
        content: text,
        media: mediaUrls,
        privacy: privacy,
        location: location,
        taggedUsers: taggedFriends,
        userId: userId,
        userEmail: userEmail,
        mediaCount: mediaUrls.length,
        hasMedia: mediaUrls.length > 0
      };

      console.log('Saving post to database...', postPayload);

      // Save post to database
      const response = await apiService.post('/posts', postPayload);

      console.log('Post created successfully:', response);
      return {
        success: true,
        post: response.data,
        mediaUploaded: mediaUrls.length,
        mediaFailed: files ? files.length - mediaUrls.length : 0
      };

    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  // Get user's posts
  async getUserPosts(userId, page = 1, limit = 10) {
    try {
      const response = await apiService.get(`/posts/user/${userId}?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Error fetching user posts:', error);
      throw error;
    }
  }

  // Get feed posts
  async getFeedPosts(page = 1, limit = 10) {
    try {
      const response = await apiService.get(`/posts/feed?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Error fetching feed posts:', error);
      throw error;
    }
  }

  // Delete post and its media
  async deletePost(postId) {
    try {
      console.log('Deleting post:', postId);

      // Delete post from database (backend will handle Cloudinary cleanup)
      const response = await apiService.delete(`/posts/${postId}`);
      
      console.log('Post deleted successfully:', response);
      return response;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  // Update post
  async updatePost(postId, updateData) {
    try {
      const response = await apiService.put(`/posts/${postId}`, updateData);
      return response;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  // Like/Unlike post
  async toggleLike(postId) {
    try {
      const response = await apiService.post(`/posts/${postId}/like`);
      return response;
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  }

  // Add comment
  async addComment(postId, comment) {
    try {
      console.log('Adding comment to post:', postId);
      const response = await apiService.post(`/posts/${postId}/comments`, { comment });
      console.log('Comment added successfully');
      return response;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  // Get comments for a post
  async getComments(postId, page = 1, limit = 20) {
    try {
      console.log('Fetching comments for post:', postId);
      const response = await apiService.get(`/posts/${postId}/comments?page=${page}&limit=${limit}`);
      console.log('Comments fetched successfully');
      return response;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  // Share post
  async sharePost(postId, shareData) {
    try {
      const response = await apiService.post(`/posts/${postId}/share`, shareData);
      return response;
    } catch (error) {
      console.error('Error sharing post:', error);
      throw error;
    }
  }

  // Get video posts for video feed
  async getVideoPosts(page = 1, limit = 10) {
    try {
      console.log('Fetching video posts...', { page, limit });
      const response = await apiService.get(`/posts/videos?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Error fetching video posts:', error);
      throw error;
    }
  }
}

export default new PostService();
