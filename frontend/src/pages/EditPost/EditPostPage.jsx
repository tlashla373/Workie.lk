import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { toast } from 'react-toastify';
import postService from '../../services/postService';
import EditMediaPost from '../../components/UserProfile/EditMediaPost';

const EditPostPage = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode } = useDarkMode();
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editDescription, setEditDescription] = useState('');

  // Helper function to get correct profile route based on user type
  const getProfileRoute = () => {
    if (user?.userType === 'client') {
      return '/clientprofile';
    } else if (user?.userType === 'worker') {
      return '/workerprofile';
    } else {
      return '/profile';
    }
  };

  // Fetch post data on component mount
  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!postId) {
          toast.error('No post ID provided');
          navigate(getProfileRoute());
          return;
        }

        // Get user posts and find the specific post
        const response = await postService.getUserPosts(user?.id || user?._id);
        
        if (response.success) {
          const foundPost = response.data.find(p => p._id === postId);
          
          if (!foundPost) {
            toast.error('Post not found');
            navigate(getProfileRoute());
            return;
          }

          // Check if user owns the post
          const currentUserId = user?.id || user?._id;
          // Handle case where userId might be populated with user object
          const postUserId = foundPost.userId?._id || foundPost.userId;
          
          console.log('Authorization check:', {
            currentUserId,
            postUserId,
            currentUserIdType: typeof currentUserId,
            postUserIdType: typeof postUserId,
            areEqual: String(postUserId) === String(currentUserId)
          });
          
          if (String(postUserId) !== String(currentUserId)) {
            console.error('Authorization failed:', { postUserId, currentUserId });
            toast.error('You are not authorized to edit this post');
            navigate(getProfileRoute());
            return;
          }

          setPost(foundPost);
          setEditDescription(foundPost.content || '');
        } else {
          throw new Error(response.message || 'Failed to fetch post');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Failed to load post');
        navigate(getProfileRoute());
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchPost();
    }
  }, [postId, user, navigate]);

  const handleDescriptionChange = (newDescription) => {
    setEditDescription(newDescription);
  };

  const handleSave = async () => {
    if (saving) return;

    try {
      setSaving(true);

      const response = await postService.updatePost(postId, {
        content: editDescription.trim()
      });

      if (!response.success) {
        throw new Error(response.message || 'Failed to update post');
      }

      toast.success('Post updated successfully!');
      navigate(getProfileRoute());
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error('Failed to update post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(getProfileRoute());
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Post not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
                title="Go back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className={`text-xl font-semibold ${
                  isDarkMode ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  Edit Post
                </h1>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Make changes to your post
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleCancel}
                disabled={saving}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <X className="w-4 h-4 mr-2 inline" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  saving
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-1 py-2">
        <div className="space-y-2">
          {/* Post Info */}
          <div className={`p-4 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center space-x-3 mb-0">
              <img
                src={post.userId?.profilePicture || post.userInfo?.profilePicture || 'https://via.placeholder.com/40x40?text=User'}
                alt={`${post.userId?.firstName || post.userInfo?.firstName || 'Unknown'} ${post.userId?.lastName || post.userInfo?.lastName || 'User'}`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {post.userId?.firstName || post.userInfo?.firstName || 'Unknown'} {post.userId?.lastName || post.userInfo?.lastName || 'User'}
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Component */}
          <EditMediaPost
            mediaFiles={post.media || []}
            description={editDescription}
            type="post"
            onDescriptionChange={handleDescriptionChange}
            onSave={handleSave}
            onCancel={handleCancel}
            loading={saving}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;
