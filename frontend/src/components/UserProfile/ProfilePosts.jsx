import React, { useState, useEffect } from 'react';
import { Heart, Share, Upload, Plus, X, ChevronLeft, ChevronRight, MessageCircle, MessageSquare, Share2, Send, MoreHorizontal } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import postService from '../../services/postService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import PostDropdown from '../../pages/HomePage/Dropdown';

// ProfilePosts Component - Shows user posts in Home.jsx card format
const ProfilePosts = ({ userId, isOwnProfile }) => {
  const { isDarkMode } = useDarkMode();
  const { user } = useAuth();
  
  // State variables
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [hiddenPosts, setHiddenPosts] = useState(new Set());
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);

  // Get the target user ID (either from props or current user)
  // If no userId provided, use current logged-in user's ID
  const targetUserId = userId || user?._id || user?.id;

  console.log('ProfilePosts - Props:', { userId, isOwnProfile });
  console.log('ProfilePosts - Current user:', user);
  console.log('ProfilePosts - Target user ID:', targetUserId);

  // Helper function to format time ago
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMs = now - postDate;
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    } else {
      return postDate.toLocaleDateString();
    }
  };

  // Function to toggle post expansion
  const togglePostExpansion = (postId) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  // Helper function to format description text with rich styling
  const formatDescription = (text, postId, isExpanded = false) => {
    if (!text) return text;
    
    let formattedText = text;
    
    // Convert URLs to clickable links
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    formattedText = formattedText.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} underline font-medium">${url}</a>`;
    });
    
    // Convert hashtags to styled elements
    const hashtagRegex = /#(\w+)/g;
    formattedText = formattedText.replace(hashtagRegex, (hashtag, tag) => {
      return `<span class="${isDarkMode ? 'text-blue-400' : 'text-blue-600'} font-semibold cursor-pointer hover:underline">${hashtag}</span>`;
    });
    
    // Convert @mentions to styled elements
    const mentionRegex = /@(\w+)/g;
    formattedText = formattedText.replace(mentionRegex, (mention, username) => {
      return `<span class="${isDarkMode ? 'text-green-400' : 'text-green-600'} font-semibold cursor-pointer hover:underline">${mention}</span>`;
    });
    
    // Convert line breaks to <br> tags
    formattedText = formattedText.replace(/\n/g, '<br>');
    
    // Make text bold between **text**
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
    
    // Make text italic between *text*
    formattedText = formattedText.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    
    // Handle text truncation for long content
    const lines = formattedText.split('<br>');
    if (lines.length > 2 && !isExpanded) {
      const truncatedLines = lines.slice(0, 2);
      return truncatedLines.join('<br>');
    }
    
    return formattedText;
  };

  // Handle save post
  const handleSavePost = async (post) => {
    try {
      const newSavedPosts = new Set(savedPosts);
      
      if (savedPosts.has(post._id)) {
        newSavedPosts.delete(post._id);
        toast.success('Post removed from saved');
      } else {
        newSavedPosts.add(post._id);
        toast.success('Post saved');
      }
      
      setSavedPosts(newSavedPosts);
    } catch (error) {
      console.error('Error saving/unsaving post:', error);
      toast.error('Failed to save post');
    }
  };

  // Handle hide post
  const handleHidePost = async (post) => {
    try {
      const newHiddenPosts = new Set(hiddenPosts);
      newHiddenPosts.add(post._id);
      setHiddenPosts(newHiddenPosts);
      toast.success('Post hidden');
    } catch (error) {
      console.error('Error hiding post:', error);
      toast.error('Failed to hide post');
    }
  };

  // Handle report post
  const handleReportPost = async (post) => {
    try {
      console.log('Reporting post:', post._id);
      toast.success('Thank you for reporting this post. We will review it shortly.');
    } catch (error) {
      console.error('Error reporting post:', error);
      toast.error('Failed to report post. Please try again.');
    }
  };

  // Handle share post
  const handleSharePost = async (post) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Post by ${post.userInfo?.firstName} ${post.userInfo?.lastName}`,
          text: post.content,
          url: `${window.location.origin}/post/${post._id}`,
        });
        console.log('Post shared successfully');
      } else {
        const postUrl = `${window.location.origin}/post/${post._id}`;
        await navigator.clipboard.writeText(postUrl);
        toast.success('Post link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      toast.error('Failed to share post');
    }
  };

  // MediaGrid component to handle both images and videos
  const MediaGrid = ({ media, onClick }) => {
    const mediaCount = media?.length || 0;

    if (mediaCount === 0) return null;

    if (mediaCount === 1) {
      const item = media[0];
      return (
        <div className="relative cursor-pointer" onClick={() => onClick(0)}>
          {item.fileType === 'video' ? (
            <video
              src={item.url}
              className="w-full h-48 md:h-64 lg:h-80 object-cover hover:opacity-95 transition-opacity duration-200"
              controls={false}
              muted
              preload="metadata"
            />
          ) : (
            <img
              src={item.url}
              alt="Post media"
              className="w-full h-48 md:h-64 lg:h-80 object-cover hover:opacity-95 transition-opacity duration-200"
            />
          )}
        </div>
      );
    }

    if (mediaCount === 2) {
      return (
        <div className="grid grid-cols-2 gap-1">
          {media.map((item, index) => (
            <div key={index} className="relative cursor-pointer" onClick={() => onClick(index)}>
              {item.fileType === 'video' ? (
                <video
                  src={item.url}
                  className="w-full h-40 md:h-48 lg:h-60 object-cover"
                  controls={false}
                  muted
                  preload="metadata"
                />
              ) : (
                <img
                  src={item.url}
                  alt={`Post media ${index + 1}`}
                  className="w-full h-40 md:h-48 lg:h-60 object-cover hover:opacity-95 transition-opacity duration-200"
                />
              )}
            </div>
          ))}
        </div>
      );
    }

    if (mediaCount === 3) {
      return (
        <div className="grid grid-cols-2 gap-1">
          <div className="relative cursor-pointer" onClick={() => onClick(0)}>
            {media[0].fileType === 'video' ? (
              <video
                src={media[0].url}
                className="w-full h-48 md:h-56 lg:h-72 object-cover"
                controls={false}
                muted
                preload="metadata"
              />
            ) : (
              <img
                src={media[0].url}
                alt="Post media 1"
                className="w-full h-48 md:h-56 lg:h-72 object-cover hover:opacity-95 transition-opacity duration-200"
              />
            )}
          </div>
          <div className="grid grid-rows-2 gap-1">
            {media.slice(1, 3).map((item, index) => (
              <div key={index + 1} className="relative cursor-pointer" onClick={() => onClick(index + 1)}>
                {item.fileType === 'video' ? (
                  <video
                    src={item.url}
                    className="w-full h-23 md:h-27 lg:h-35 object-cover"
                    controls={false}
                    muted
                    preload="metadata"
                  />
                ) : (
                  <img
                    src={item.url}
                    alt={`Post media ${index + 2}`}
                    className="w-full h-23 md:h-27 lg:h-35 object-cover hover:opacity-95 transition-opacity duration-200"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (mediaCount >= 4) {
      return (
        <div className="grid grid-cols-2 gap-1">
          {media.slice(0, 3).map((item, index) => (
            <div key={index} className="relative cursor-pointer" onClick={() => onClick(index)}>
              {item.fileType === 'video' ? (
                <video
                  src={item.url}
                  className="w-full h-28 md:h-32 lg:h-40 object-cover"
                  controls={false}
                  muted
                  preload="metadata"
                />
              ) : (
                <img
                  src={item.url}
                  alt={`Post media ${index + 1}`}
                  className="w-full h-28 md:h-32 lg:h-40 object-cover hover:opacity-95 transition-opacity duration-200"
                />
              )}
            </div>
          ))}
          <div className="relative">
            <div className="cursor-pointer" onClick={() => onClick(3)}>
              {media[3].fileType === 'video' ? (
                <video
                  src={media[3].url}
                  className="w-full h-28 md:h-32 lg:h-40 object-cover"
                  controls={false}
                  muted
                  preload="metadata"
                />
              ) : (
                <img
                  src={media[3].url}
                  alt="Post media 4"
                  className="w-full h-28 md:h-32 lg:h-40 object-cover hover:opacity-95 transition-opacity duration-200"
                />
              )}
            </div>
            {mediaCount > 4 && (
              <div 
                className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center cursor-pointer hover:bg-opacity-50 transition-all duration-200"
                onClick={() => onClick(3)}
              >
                <span className="text-white text-lg md:text-xl lg:text-2xl font-bold">+{mediaCount - 4}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
  };

  // PostCard component - exactly like Home.jsx
  const PostCard = ({ post }) => (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-300`}>
      {/* Post Header */}
      <div className="p-3 md:p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <img
              src={post.userId?.profilePicture || post.userInfo?.profilePicture || 'https://via.placeholder.com/40x40?text=User'}
              alt={`${post.userId?.firstName || post.userInfo?.firstName || 'Unknown'} ${post.userId?.lastName || post.userInfo?.lastName || 'User'}`}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/40x40?text=User';
              }}
            />
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} text-xs md:text-sm`}>
                {post.userId?.firstName || post.userInfo?.firstName || 'Unknown'} {post.userId?.lastName || post.userInfo?.lastName || 'User'}
              </h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>
                {post.userId?.profession || post.userInfo?.profession || 'Worker'} • {post.location || 'Sri Lanka'} • {getTimeAgo(post.createdAt)}
              </p>
            </div>
          </div>
          <PostDropdown
            post={post}
            onSavePost={handleSavePost}
            onHidePost={handleHidePost}
            onReportPost={handleReportPost}
            onSharePost={handleSharePost}
          />
        </div>
        
        {/* Post Description */}
        <div className="mb-0">
          <div 
            className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-xs md:text-sm leading-relaxed`}
            dangerouslySetInnerHTML={{ 
              __html: formatDescription(
                post.content, 
                post._id, 
                expandedPosts.has(post._id)
              ) 
            }}
          />
          {/* See more/See less button */}
          {post.content && post.content.split('\n').length > 4 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePostExpansion(post._id);
              }}
              className={`mt-2 text-xs md:text-sm font-medium transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-blue-400 hover:text-blue-300' 
                  : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              {expandedPosts.has(post._id) ? 'See less' : 'See more...'}
            </button>
          )}
        </div>
      </div>

      {/* Post Media */}
      {post.media && post.media.length > 0 && (
        <div className="relative">
          <MediaGrid 
            media={post.media} 
            onClick={(mediaIndex) => handlePostClick(post, mediaIndex)}
          />
        </div>
      )}

      {/* Post Actions */}
      <div className="p-3 md:p-4">
        <div className="flex items-center justify-between mb-3">
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs md:text-sm`}>
            {(post.likes || []).length} likes
          </span>
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs md:text-sm`}>
            {(post.comments || []).length} comments
          </span>
        </div>
        
        <div className={`flex items-center justify-between pt-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <button 
            type="button"
            onClick={(e) => handleLike(post._id, e)}
            className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 rounded-lg transition-colors duration-200 flex-1 justify-center ${
              likedPosts.has(post._id)
                ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                : isDarkMode 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${
              likedPosts.has(post._id) 
                ? 'text-red-600 fill-current dark:text-red-400' 
                : isDarkMode 
                  ? 'text-gray-300' 
                  : 'text-gray-600'
            }`} />
            <span className={`text-xs md:text-sm font-medium ${
              likedPosts.has(post._id)
                ? 'text-red-600 dark:text-red-400'
                : isDarkMode 
                  ? 'text-gray-300' 
                  : 'text-gray-600'
            }`}>
              Like
            </span>
          </button>
          <button 
            type="button"
            className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-1 justify-center ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
            onClick={() => handlePostClick(post)}
          >
            <MessageSquare className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            <span className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Comment</span>
          </button>
          <button 
            type="button"
            className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-1 justify-center ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
            onClick={() => handleSharePost(post)}
          >
            <Share2 className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            <span className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Share</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Handle like/unlike functionality
  const handleLike = async (postId, event) => {
    if (event) event.stopPropagation();
    
    if (!user) {
      toast.error('Please log in to like posts');
      return;
    }

    try {
      const wasLiked = likedPosts.has(postId);
      const newLikedPosts = new Set(likedPosts);
      
      if (wasLiked) {
        newLikedPosts.delete(postId);
      } else {
        newLikedPosts.add(postId);
      }
      
      setLikedPosts(newLikedPosts);
      
      // Update posts state
      setUserPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId 
            ? { 
                ...post, 
                likes: wasLiked 
                  ? (post.likes || []).filter(like => like.userId !== user._id)
                  : [...(post.likes || []), { userId: user._id, likedAt: new Date() }]
              }
            : post
        )
      );

      // Make API call
      const response = await postService.toggleLike(postId);
      
      if (response.success && response.data) {
        const { isLiked, likes } = response.data;
        
        // Update with server response
        const updatedLikedPosts = new Set(likedPosts);
        if (isLiked) {
          updatedLikedPosts.add(postId);
        } else {
          updatedLikedPosts.delete(postId);
        }
        setLikedPosts(updatedLikedPosts);
        
        setUserPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { ...post, likes: likes || [] }
              : post
          )
        );
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      // Revert optimistic update
      setLikedPosts(likedPosts);
      toast.error('Failed to update like');
    }
  };

  // Handle post click to open modal
  const handlePostClick = (post, imageIndex = 0) => {
    setSelectedPost(post);
    setCurrentImageIndex(imageIndex);
    document.body.style.overflow = 'hidden';
    setComments([]);
    setNewComment('');
    loadComments(post);
    
  };

  // Close modal
  const closeModal = () => {
    setSelectedPost(null);
    setCurrentImageIndex(0);
    setComments([]);
    setNewComment('');
    document.body.style.overflow = 'unset';
  };

  // Navigation functions
  const nextImage = () => {
    if (selectedPost && selectedPost.media && currentImageIndex < selectedPost.media.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // Load comments for post
  const loadComments = async (post) => {
    if (!post._id) return;
    
    setCommentsLoading(true);
    try {
      const response = await postService.getComments(post._id, 1, 20);
      if (response.success && response.data) {
        setComments(response.data.comments || []);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim() || !user || !selectedPost) return;

    const commentText = newComment.trim();
    const tempId = Date.now().toString();

    try {
      const optimisticComment = {
        _id: tempId,
        comment: commentText,
        userId: user._id || user.id,
        userInfo: {
          firstName: user.firstName,
          lastName: user.lastName,
          profilePicture: user.profilePicture || ''
        },
        commentedAt: new Date().toISOString()
      };

      setComments(prev => [optimisticComment, ...prev]);
      setNewComment('');

      const response = await postService.addComment(selectedPost._id, commentText);
      
      if (response.success && response.data) {
        setComments(prev => 
          prev.map(comment => 
            comment._id === tempId 
              ? { ...response.data.comment, _id: response.data.comment._id || tempId }
              : comment
          )
        );
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setComments(prev => prev.filter(c => c._id !== tempId));
      setNewComment(commentText);
      toast.error('Failed to add comment');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  // Fetch user posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching posts for user:', targetUserId);
        console.log('Current user:', user);
        
        if (!targetUserId) {
          console.error('No user ID provided for fetching posts');
          setError('No user ID provided');
          return;
        }

        if (!user) {
          console.error('No authenticated user found');
          setError('Please log in to view posts');
          return;
        }

        // Try postService.getUserPosts first
        let response;
        try {
          response = await postService.getUserPosts(targetUserId, 1, 20);
        } catch (serviceError) {
          console.warn('PostService failed, trying direct API call:', serviceError);
          
          // Fallback to direct API call
          const apiService = await import('../../services/apiService');
          response = await apiService.default.get(`/posts/user/${targetUserId}?page=1&limit=20`);
        }

        console.log('Posts API response:', response);
        
        if (response && (response.success || response.data)) {
          // Handle different response formats
          let posts = [];
          
          if (response.data && Array.isArray(response.data)) {
            // Direct array in data
            posts = response.data;
          } else if (response.data && response.data.posts && Array.isArray(response.data.posts)) {
            // Posts inside data.posts
            posts = response.data.posts;
          } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
            // Posts inside data.data (paginated response)
            posts = response.data.data;
          } else if (Array.isArray(response)) {
            // Direct array response
            posts = response;
          }
          
          console.log('Extracted posts:', posts);
          setUserPosts(posts);
          
          // Initialize liked posts
          const liked = new Set();
          posts.forEach(post => {
            if (post.likes && post.likes.some(like => like.userId === user?._id)) {
              liked.add(post._id);
            }
          });
          setLikedPosts(liked);
          
          console.log('Posts loaded successfully:', posts.length);
        } else {
          console.error('API response error:', response);
          throw new Error(response?.message || 'Failed to fetch posts');
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
        setError(error.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    if (targetUserId && user) {
      fetchUserPosts();
    } else {
      setLoading(false);
      setError('User not authenticated or no user ID provided');
    }
  }, [targetUserId, user]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-4 animate-pulse`}>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/3"></div>
              </div>
            </div>
            <div className="h-20 bg-gray-300 rounded mb-3"></div>
            <div className="h-48 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className={`text-red-500 mb-4 ${isDarkMode ? 'text-red-400' : ''}`}>{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (userPosts.length === 0) {
    return (
      <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">No Posts Yet</p>
        <p className="mb-4">
          {isOwnProfile ? 'Start sharing your work and experiences!' : 'This user hasn\'t posted anything yet.'}
        </p>
        {isOwnProfile && (
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Posts List */}
      {userPosts
        .filter(post => !hiddenPosts.has(post._id))
        .map((post) => (
          <PostCard key={post._id} post={post} />
        ))
      }

      {/* Full Screen Modal - Similar to Home Page */}
      {selectedPost && (
        <div className={`fixed inset-0 z-100 flex flex-col animate-in slide-in-from-bottom duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          {/* Header Bar */}
          <div className={`flex items-center justify-between p-1 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center space-x-3">
              <img
                src={selectedPost.userId?.profilePicture || selectedPost.userInfo?.profilePicture || 'https://via.placeholder.com/40x40?text=User'}
                alt={`${selectedPost.userId?.firstName || selectedPost.userInfo?.firstName || 'Unknown'} ${selectedPost.userId?.lastName || selectedPost.userInfo?.lastName || 'User'}`}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/40x40?text=User';
                }}
              />
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} text-sm md:text-base`}>
                  {selectedPost.userId?.firstName || selectedPost.userInfo?.firstName || 'Unknown'} {selectedPost.userId?.lastName || selectedPost.userInfo?.lastName || 'User'}
                </h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs md:text-sm`}>
                  {selectedPost.userId?.profession || selectedPost.userInfo?.profession || 'Worker'} • {selectedPost.location || 'Sri Lanka'} • {getTimeAgo(selectedPost.createdAt)}
                </p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className={`p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
            >
              <X className={`w-5 h-5 md:w-6 md:h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Media Section */}
            <div className="flex-1 bg-black flex items-center justify-center relative">
              {selectedPost.media && selectedPost.media.length > 1 && currentImageIndex > 0 && (
                <button
                  onClick={prevImage}
                  className="absolute left-2 md:left-4 z-10 bg-black bg-opacity-50 text-white p-2 md:p-3 rounded-full hover:bg-opacity-70"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              )}
              
              {selectedPost.media && selectedPost.media[currentImageIndex] ? (
                selectedPost.media[currentImageIndex].fileType === 'video' ? (
                  <video
                    src={selectedPost.media[currentImageIndex].url}
                    className="max-h-full max-w-full object-contain"
                    controls
                    autoPlay
                  />
                ) : (
                  <img
                    src={selectedPost.media[currentImageIndex].url}
                    alt="Post content"
                    className="max-h-full max-w-full object-contain"
                  />
                )
              ) : (
                <div className="text-white text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No media to display</p>
                </div>
              )}
              
              {selectedPost.media && selectedPost.media.length > 1 && currentImageIndex < selectedPost.media.length - 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-2 md:right-4 z-10 bg-black bg-opacity-50 text-white p-2 md:p-3 rounded-full hover:bg-opacity-70"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              )}

              {/* Media Counter */}
              {selectedPost.media && selectedPost.media.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {selectedPost.media.length}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className={`w-full lg:w-96 flex flex-col h-full border-t lg:border-t-0 lg:border-l ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              {/* Post Content */}
              <div className={`p-3 md:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <div 
                  className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-sm leading-relaxed mb-3`}
                  dangerouslySetInnerHTML={{ 
                    __html: formatDescription(
                      selectedPost.content, 
                      selectedPost._id, 
                      expandedPosts.has(selectedPost._id)
                    ) 
                  }}
                />

                <div className={`flex items-center justify-between text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span>{(selectedPost.likes || []).length} likes</span>
                  <span>{comments.length} comments</span>
                </div>

                {/* Action Buttons */}
                <div className={`flex items-center justify-between mt-3 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <button 
                    onClick={() => handleLike(selectedPost._id)}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 flex-1 justify-center mr-1 ${
                      likedPosts.has(selectedPost._id)
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                        : isDarkMode 
                          ? 'hover:bg-gray-700' 
                          : 'hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${
                      likedPosts.has(selectedPost._id) 
                        ? 'text-red-600 fill-current dark:text-red-400' 
                        : isDarkMode 
                          ? 'text-gray-300' 
                          : 'text-gray-600'
                    }`} />
                    <span className={`font-medium text-xs ${
                      likedPosts.has(selectedPost._id)
                        ? 'text-red-600 dark:text-red-400'
                        : isDarkMode 
                          ? 'text-gray-300' 
                          : 'text-gray-600'
                    }`}>
                      Like
                    </span>
                  </button>
                  <button className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 flex-1 justify-center mx-1 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <MessageCircle className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    <span className={`font-medium text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Comment</span>
                  </button>
                  <button 
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 flex-1 justify-center ml-1 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                    onClick={() => handleSharePost(selectedPost)}
                  >
                    <Share className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    <span className={`font-medium text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Share</span>
                  </button>
                </div>
              </div>

              {/* Comment Input */}
              <div className={`p-3 md:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <div className="flex items-start space-x-3">
                  <img
                    src={user?.profilePicture || 'https://via.placeholder.com/32x32?text=You'}
                    alt="Your profile"
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Write a comment..."
                      className={`w-full px-3 py-2 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' 
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                      }`}
                      rows="2"
                    />
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Press Enter to post
                      </span>
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200 ${
                          newComment.trim()
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : isDarkMode
                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-3 h-3" />
                        <span>Post</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto">
                {commentsLoading ? (
                  <div className="p-4 text-center">
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Loading comments...
                    </div>
                  </div>
                ) : comments.length > 0 ? (
                  <div className="space-y-3 p-3 md:p-4">
                    {comments.map((comment) => {
                      // Get comment author info like home page
                      const author = comment.userId || comment.userInfo;
                      const authorName = author?.firstName && author?.lastName 
                        ? `${author.firstName} ${author.lastName}`
                        : author?.firstName || 'Anonymous';
                      const authorAvatar = author?.profilePicture || 'https://via.placeholder.com/32x32?text=User';
                      
                      return (
                        <div key={comment._id} className="flex items-start space-x-3">
                          <img
                            src={authorAvatar}
                            alt={authorName}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/32x32?text=User';
                            }}
                          />
                          <div className="flex-1">
                            <div className={`inline-block px-3 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                              <div className={`font-medium text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                {authorName}
                              </div>
                              <div className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {comment.comment}
                              </div>
                            </div>
                            <div className={`text-xs mt-1 px-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {new Date(comment.commentedAt || comment.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No comments yet. Be the first to comment!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePosts;
