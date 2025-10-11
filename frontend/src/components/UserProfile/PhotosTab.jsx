import React, { useState, useEffect } from 'react';
import { Heart, Share, Upload, Plus, X, ChevronLeft, ChevronRight, MessageCircle, Send, MoreHorizontal, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../contexts/DarkModeContext';
import profileService from '../../services/profileService';
import postService from '../../services/postService';
import apiService from '../../services/apiService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import ProfilePosts from './ProfilePosts';
import EditMediaPost from './EditMediaPost';

// Photos Tab Component
const PhotosTab = ({ profileData, isDarkMode, isOwnProfile, userId }) => {
  console.log('PhotosTab rendered with props:', { profileData: !!profileData, isDarkMode, isOwnProfile, userId });
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('all'); // 'all', 'portfolio', 'posts'
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set()); // Track liked posts
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // Get the target user ID (either from props or current user)
  // If no userId provided, use current logged-in user's ID  
  const targetUserId = userId || user?._id || user?.id;

  console.log('PhotosTab - Props:', { profileData: !!profileData, isDarkMode, isOwnProfile, userId });
  console.log('PhotosTab - Current user:', user);
  console.log('PhotosTab - Target user ID:', targetUserId);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch portfolio data
        let portfolio = [];
        if (profileData?.profile?.portfolio && profileData.profile.portfolio.length > 0) {
          portfolio = profileData.profile.portfolio;
        } else {
          try {
            const response = await profileService.getCurrentUserProfile();
            if (response.success && response.data.profile?.portfolio) {
              portfolio = response.data.profile.portfolio;
            }
          } catch (portfolioError) {
            console.warn('Could not fetch portfolio:', portfolioError);
          }
        }
        setPortfolioItems(portfolio);

        // Fetch user posts with media
        let posts = [];
        if (targetUserId) {
          try {
            const postsResponse = await postService.getUserPosts(targetUserId, 1, 50);
            
            if (postsResponse.success && postsResponse.data) {
              // Filter posts that have media (images or videos)
              posts = postsResponse.data.filter(post => 
                post.media && 
                post.media.length > 0 && 
                post.media.some(m => m.url)
              );
            }
          } catch (postsError) {
            console.warn('Could not fetch user posts:', postsError);
          }
        }
        setUserPosts(posts);
        console.log('PhotosTab: Final posts loaded:', posts.length);
        console.log('PhotosTab: Sample post data:', posts[0]);

        // Initialize liked posts set based on user's likes in fetched posts
        if (user?._id) {
          const userLikedPostIds = new Set();
          posts.forEach(post => {
            // Check if user has liked this post
            const userLike = post.likes?.find(like => like.userId === user._id);
            if (userLike) {
              userLikedPostIds.add(post._id);
            }
          });
          setLikedPosts(userLikedPostIds);
          console.log('👍 User liked posts loaded in PhotosTab:', userLikedPostIds.size);
        }

      } catch (error) {
        console.error('Error fetching photos data:', error);
        setError('Failed to load photos');
        setPortfolioItems([]);
        setUserPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [profileData, targetUserId]);

  // Get all media items (portfolio + post media)
  const getAllMediaItems = () => {
    const allItems = [];

    // Add portfolio items
    if (portfolioItems && portfolioItems.length > 0) {
      console.log('Adding portfolio items to grid:', portfolioItems.length);
      portfolioItems.forEach((item, index) => {
        if (item.images && item.images.length > 0) {
          item.images.forEach((imageUrl, imgIndex) => {
            allItems.push({
              id: `portfolio-${item._id || index}-${imgIndex}`,
              url: imageUrl,
              title: item.title || `Portfolio ${index + 1}`,
              category: item.category || 'Portfolio',
              type: 'portfolio',
              source: item
            });
          });
        }
        // Handle new media format for portfolio items
        if (item.media && item.media.length > 0) {
          item.media.forEach((media, mediaIndex) => {
            allItems.push({
              id: `portfolio-media-${item._id || index}-${mediaIndex}`,
              url: media.url,
              title: item.title || `Portfolio ${index + 1}`,
              category: item.category || 'Portfolio',
              type: 'portfolio',
              fileType: media.fileType,
              source: item
            });
          });
        }
      });
    }

    // Add post media
    if (userPosts && userPosts.length > 0) {
      console.log('Adding post media to grid:', userPosts.length);
      userPosts.forEach((post, postIndex) => {
        console.log(`Post ${postIndex}:`, {
          id: post._id,
          userId: post.userId,
          authorId: post.authorId,
          userInfo: post.userInfo
        });
        
        if (post.media && post.media.length > 0) {
          post.media.forEach((media, mediaIndex) => {
            const mediaItem = {
              id: `post-${post._id || postIndex}-${mediaIndex}`,
              url: media.url,
              title: post.content ? post.content.substring(0, 50) + '...' : `Post ${postIndex + 1}`,
              category: 'Post',
              type: 'post',
              fileType: media.fileType,
              createdAt: post.createdAt,
              source: {
                ...post,
                userId: post.userId || post.authorId, // Ensure we have userId
                userInfo: post.userInfo || {
                  userId: post.userId || post.authorId,
                  firstName: post.author?.firstName || 'Unknown',
                  lastName: post.author?.lastName || 'User',
                  profilePicture: post.author?.profilePicture || ''
                }
              }
            };
            console.log(`Media item ${mediaIndex} source:`, mediaItem.source);
            allItems.push(mediaItem);
          });
        }
      });
    }

    return allItems;
  };

  // Filter items based on active view
  const getFilteredItems = () => {
    const allItems = getAllMediaItems();
    
    switch (activeView) {
      case 'portfolio':
        return allItems.filter(item => item.type === 'portfolio');
      case 'posts':
        return allItems.filter(item => item.type === 'post');
      case 'all':
      default:
        return allItems;
    }
  };

  const filteredItems = getFilteredItems();

  // Modal functions
  const handleItemClick = (item, imageIndex = 0) => {
    console.log('Item clicked:', item);
    setSelectedItem(item);
    setCurrentImageIndex(imageIndex);
    setComments([]); // Reset comments
    setNewComment(''); // Reset comment input
    loadComments(item); // Load comments for this item
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setSelectedItem(null);
    setCurrentImageIndex(0);
    setComments([]);
    setNewComment('');
    setShowDropdown(false); // Close dropdown when modal closes
    setDeleteLoading(false); // Reset delete loading state
    document.body.style.overflow = 'unset'; // Restore background scrolling
  };

  // Dropdown functions
  const toggleDropdown = () => {
    console.log('Toggle dropdown - current state:', showDropdown);
    setShowDropdown(!showDropdown);
  };

  const handleEditPost = () => {
    setShowDropdown(false);
    
    if (!selectedItem) return;
    
    if (selectedItem.type === 'post') {
      // Navigate to edit post page
      navigate(`/edit-post/${selectedItem.source._id}`);
      
    } else if (selectedItem.type === 'portfolio') {
      // Keep modal for portfolio items
      setEditData({
        id: selectedItem.source._id,
        type: 'portfolio',
        title: selectedItem.source.title || selectedItem.title || '',
        description: selectedItem.source.description || '',
        mediaFiles: selectedItem.source.media || selectedItem.source.images?.map(url => ({ url, type: 'image' })) || []
      });
      setIsEditModalOpen(true);
    }
  };

  // Handle EditMediaPost functions
  const handleEditDescriptionChange = (newDescription) => {
    if (editData) {
      setEditData(prev => ({ ...prev, description: newDescription }));
    }
  };

  const handleEditMediaRemove = (index) => {
    if (editData && editData.mediaFiles) {
      const newMediaFiles = [...editData.mediaFiles];
      newMediaFiles.splice(index, 1);
      setEditData(prev => ({ ...prev, mediaFiles: newMediaFiles }));
    }
  };

  const handleEditSave = async () => {
    if (!editData || editLoading) return;

    try {
      setEditLoading(true);

      if (editData.type === 'post') {
        // Update post using the API
        const response = await postService.updatePost(editData.id, {
          content: editData.description.trim()
        });

        if (!response.success) {
          throw new Error(response.message || 'Failed to update post');
        }

        // Update local state
        setUserPosts(prevPosts =>
          prevPosts.map(post =>
            post._id === editData.id
              ? { ...post, content: editData.description.trim() }
              : post
          )
        );

        // Update selectedItem if it's the same post
        if (selectedItem && selectedItem.source._id === editData.id) {
          setSelectedItem(prev => ({
            ...prev,
            source: { ...prev.source, content: editData.description.trim() }
          }));
        }

        toast.success('Post updated successfully!');
      } else if (editData.type === 'portfolio') {
        // Update portfolio item
        const userId = user?.id || user?._id;
        if (!userId) {
          throw new Error('User not authenticated');
        }

        const response = await apiService.put(`/profiles/${userId}/portfolio/${editData.id}`, {
          title: editData.title?.trim() || '',
          description: editData.description.trim()
        });

        if (!response.success) {
          throw new Error(response.message || 'Failed to update portfolio item');
        }

        // Update local state
        setPortfolioItems(prevItems =>
          prevItems.map(item =>
            item._id === editData.id
              ? { ...item, title: editData.title?.trim() || '', description: editData.description.trim() }
              : item
          )
        );

        // Update selectedItem if it's the same portfolio item
        if (selectedItem && selectedItem.source._id === editData.id) {
          setSelectedItem(prev => ({
            ...prev,
            title: editData.title?.trim() || prev.title,
            source: { 
              ...prev.source, 
              title: editData.title?.trim() || '', 
              description: editData.description.trim() 
            }
          }));
        }

        toast.success('Portfolio item updated successfully!');
      }

      setIsEditModalOpen(false);
      setEditData(null);
    } catch (error) {
      console.error(`Error updating ${editData.type}:`, error);
      toast.error(`Failed to update ${editData.type}. Please try again.`);
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setEditData(null);
  };

  const handleDeletePost = async () => {
    setShowDropdown(false);
    
    if (!selectedItem || deleteLoading) return;
    
    // Show confirmation dialog
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this ${selectedItem.type === 'post' ? 'post' : 'portfolio item'}? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;

    try {
      setDeleteLoading(true);
      
      if (selectedItem.type === 'post') {
        // Delete post from database and Cloudinary
        console.log('Deleting post:', selectedItem.source._id);
        const response = await postService.deletePost(selectedItem.source._id);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete post');
        }
        
        // Remove the post from local state
        setUserPosts(prevPosts => 
          prevPosts.filter(post => post._id !== selectedItem.source._id)
        );
        
        toast.success('Post and its media deleted successfully!');
      } else if (selectedItem.type === 'portfolio') {
        // For portfolio items, we need to implement the delete functionality
        console.log('Deleting portfolio item:', selectedItem.source._id);
        
        // First, get the current user ID
        const userId = user?.id || user?._id;
        if (!userId) {
          throw new Error('User not authenticated');
        }
        
        // Make API call to delete portfolio item using apiService
        const response = await apiService.delete(`/profiles/${userId}/portfolio/${selectedItem.source._id}`);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to delete portfolio item');
        }
        
        // Remove the portfolio item from local state
        setPortfolioItems(prevItems => 
          prevItems.filter(item => item._id !== selectedItem.source._id)
        );
        
        toast.success('Portfolio item deleted successfully!');
      }
      
      // Close the modal after successful deletion
      closeModal();
      
    } catch (error) {
      console.error(`Error deleting ${selectedItem.type}:`, error);
      toast.error(`Failed to delete ${selectedItem.type}. Please try again.`);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Close dropdown when clicking outside
  const handleDropdownClose = () => {
    if (showDropdown) {
      console.log('Closing dropdown from outside click');
      setShowDropdown(false);
    }
  };

  // Comment functions
  const loadComments = async (item) => {
    if (item.type !== 'post' || !item.source._id) return;
    
    setCommentsLoading(true);
    try {
      console.log('Loading comments for post:', item.source._id);
      const response = await postService.getComments(item.source._id, 1, 20);
      
      if (response.success && response.data) {
        setComments(response.data.comments || []);
        console.log('Comments loaded:', response.data.comments?.length || 0);
      } else {
        console.warn('No comments data in response');
        setComments([]);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user || !selectedItem) return;

    const commentText = newComment.trim();
    const tempId = Date.now().toString();

    try {
      // Create optimistic comment object
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

      // Add to comments list immediately (optimistic update)
      setComments(prev => [optimisticComment, ...prev]);
      setNewComment('');

      console.log('Adding comment to post:', selectedItem.source._id);
      
      // Make actual API call
      const response = await postService.addComment(selectedItem.source._id, commentText);
      
      if (response.success && response.data) {
        // Replace optimistic comment with real comment from server
        setComments(prev => 
          prev.map(comment => 
            comment._id === tempId 
              ? { ...response.data.comment, _id: response.data.comment._id || tempId }
              : comment
          )
        );
        console.log('Comment added successfully');
      } else {
        throw new Error('Failed to add comment');
      }
      
    } catch (error) {
      console.error('Error adding comment:', error);
      // Remove the optimistic comment on error
      setComments(prev => prev.filter(c => c._id !== tempId));
      setNewComment(commentText); // Restore the comment text
      toast.error('Failed to add comment. Please try again.');
    }
  };

  // Handle like/unlike functionality
  const handleLike = async (postId) => {
    if (!user) {
      console.warn('User must be logged in to like posts');
      return;
    }

    try {
      console.log('👍 Toggling like for post:', postId);
      
      // Optimistic update
      const wasLiked = likedPosts.has(postId);
      const newLikedPosts = new Set(likedPosts);
      
      if (wasLiked) {
        newLikedPosts.delete(postId);
      } else {
        newLikedPosts.add(postId);
      }
      
      setLikedPosts(newLikedPosts);
      
      // Update posts state to reflect like count change
      setUserPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId 
            ? { ...post, likes: wasLiked ? (post.likes || []).filter(like => like.userId !== user._id) : [...(post.likes || []), { userId: user._id, likedAt: new Date() }] }
            : post
        )
      );

      // Make API call
      const response = await postService.toggleLike(postId);
      
      if (response.success) {
        console.log('✅ Like toggled successfully:', response.data);
        
        // Update with actual data from server
        if (response.data) {
          const { isLiked, likesCount, likes } = response.data;
          
          // Update liked posts set based on server response
          const updatedLikedPosts = new Set(likedPosts);
          if (isLiked) {
            updatedLikedPosts.add(postId);
          } else {
            updatedLikedPosts.delete(postId);
          }
          setLikedPosts(updatedLikedPosts);
          
          // Update posts with actual like data
          setUserPosts(prevPosts => 
            prevPosts.map(post => 
              post._id === postId 
                ? { ...post, likes: likes || [] }
                : post
            )
          );
        }
      }
    } catch (error) {
      console.error('❌ Failed to toggle like:', error);
      
      // Revert optimistic update on error
      const revertedLikedPosts = new Set(likedPosts);
      const wasLiked = likedPosts.has(postId);
      
      if (!wasLiked) {
        revertedLikedPosts.delete(postId);
      } else {
        revertedLikedPosts.add(postId);
      }
      
      setLikedPosts(revertedLikedPosts);
      
      // Revert posts like data
      setUserPosts(prevPosts => 
        prevPosts.map(post => 
          post._id === postId 
            ? { ...post, likes: wasLiked ? [...(post.likes || []), { userId: user._id, likedAt: new Date() }] : (post.likes || []).filter(like => like.userId !== user._id) }
            : post
        )
      );
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  // Handle keyboard events for modal and dropdown
  const handleModalKeyDown = (e) => {
    if (e.key === 'Escape') {
      if (showDropdown) {
        setShowDropdown(false);
      } else if (selectedItem) {
        closeModal();
      }
    }
  };

  // Add keyboard event listener for modal
  useEffect(() => {
    if (selectedItem) {
      document.addEventListener('keydown', handleModalKeyDown);
      return () => {
        document.removeEventListener('keydown', handleModalKeyDown);
      };
    }
  }, [selectedItem, showDropdown]);

  const nextImage = () => {
    if (selectedItem) {
      // For portfolio items with multiple images
      if (selectedItem.type === 'portfolio' && selectedItem.source.images) {
        const totalImages = selectedItem.source.images.length;
        if (currentImageIndex < totalImages - 1) {
          setCurrentImageIndex(currentImageIndex + 1);
        }
      }
      // For posts with multiple media
      else if (selectedItem.type === 'post' && selectedItem.source.media) {
        const totalMedia = selectedItem.source.media.length;
        if (currentImageIndex < totalMedia - 1) {
          setCurrentImageIndex(currentImageIndex + 1);
        }
      }
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // Get all images/media for the selected item
  const getSelectedItemMedia = () => {
    if (!selectedItem) return [];
    
    if (selectedItem.type === 'portfolio' && selectedItem.source.images) {
      return selectedItem.source.images.map(url => ({ url, type: 'image' }));
    } else if (selectedItem.type === 'post' && selectedItem.source.media) {
      return selectedItem.source.media.map(media => ({ 
        url: media.url, 
        type: media.fileType || 'image' 
      }));
    }
    
    return [{ url: selectedItem.url, type: selectedItem.fileType || 'image' }];
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center space-x-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="h-8 w-20 bg-gray-300 animate-pulse rounded"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="aspect-square bg-gray-300 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="space-y-4">
        {/* Filter Tabs */}
        <div className="flex justify-center space-x-4 mb-6">
          {['all', 'portfolio', 'posts'].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === view
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>

        <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <Upload className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">
            {activeView === 'portfolio' 
              ? 'No Portfolio Items Yet' 
              : activeView === 'posts' 
              ? 'No Posts with Media Yet' 
              : 'No Photos Yet'
            }
          </p>
          <p className="mb-4">
            {activeView === 'portfolio' 
              ? 'Start showcasing your work by adding portfolio items'
              : activeView === 'posts' 
              ? 'Create posts with photos or videos to see them here'
              : 'Add portfolio items or create posts with media to see them here'
            }
          </p>
          {isOwnProfile && (
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4 mr-2" />
              {activeView === 'portfolio' ? 'Add Portfolio Item' : 'Create Post'}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        {['all', 'portfolio', 'posts'].map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === view
                ? 'bg-blue-600 text-white'
                : isDarkMode
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {view.charAt(0).toUpperCase() + view.slice(1)}
            <span className="ml-2 text-sm opacity-75">
              ({view === 'all' 
                ? getAllMediaItems().length 
                : view === 'portfolio' 
                ? getAllMediaItems().filter(item => item.type === 'portfolio').length
                : getAllMediaItems().filter(item => item.type === 'post').length
              })
            </span>
          </button>
        ))}
      </div>

      {/* Conditional Rendering based on active view */}
      {activeView === 'posts' ? (
        /* Posts View - Use ProfilePosts Component */
        <ProfilePosts 
          userId={isOwnProfile ? (user?._id || user?.id) : targetUserId} 
          isOwnProfile={isOwnProfile} 
        />
      ) : (
        /* Grid View - Portfolio and All items */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="relative group overflow-hidden rounded-lg aspect-square cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              {item.fileType === 'video' ? (
                <video
                  src={item.url}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  controls={false}
                  muted
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                  }}
                />
              )}
              
              {/* Fallback for broken media */}
              <div className="hidden w-full h-full bg-gray-200 items-center justify-center">
                <Upload className="w-12 h-12 text-gray-400" />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                  <button 
                    className={`p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors ${
                      item.source && likedPosts.has(item.source._id) ? 'text-red-400' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (item.source && item.source._id) {
                        handleLike(item.source._id);
                      }
                    }}
                  >
                    <Heart className={`w-5 h-5 ${
                      item.source && likedPosts.has(item.source._id) ? 'fill-current text-red-400' : ''
                    }`} />
                  </button>
                  <button 
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add share functionality here
                      if (navigator.share) {
                        navigator.share({
                          title: item.title,
                          text: `Check out this ${item.category}`,
                          url: item.url,
                        });
                      } else {
                        navigator.clipboard.writeText(item.url);
                        toast.success("Link copied to clipboard!");
                      }
                    }}
                  >
                    <Share className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Media Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <h3 className="text-white font-medium text-sm">{item.title}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-white/80 text-xs">{item.category}</p>
                  {item.fileType === 'video' && (
                    <span className="text-white/80 text-xs bg-black/30 px-2 py-1 rounded">
                      Video
                    </span>
                  )}
                </div>
                {item.createdAt && (
                  <p className="text-white/60 text-xs mt-1">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Screen Modal - Home Page Design */}
      {selectedItem && (
        <div className={`fixed inset-0 z-50 flex flex-col animate-in slide-in-from-bottom duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          {/* Header Bar */}
          <div className={`flex items-center justify-between p-3 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center space-x-3">
              {(() => {
                // Get profile display data like home page
                let displayAvatar, displayAuthor, displayProfession;
                
                if (selectedItem.type === 'post') {
                  // For posts, use the same logic as home page
                  const post = selectedItem.source;
                  displayAuthor = `${post.userId?.firstName || post.userInfo?.firstName || 'Unknown'} ${post.userId?.lastName || post.userInfo?.lastName || 'User'}`;
                  displayAvatar = post.userId?.profilePicture || post.userInfo?.profilePicture || 'https://via.placeholder.com/40x40?text=User';
                  displayProfession = post.userId?.profession || post.userInfo?.profession || 'Worker';
                } else {
                  // For portfolio items, use profile data or current user
                  if (profileData?.firstName) {
                    displayAuthor = `${profileData.firstName} ${profileData.lastName || ''}`.trim();
                    displayAvatar = profileData.profilePicture || profileData.profile?.profilePicture || 'https://via.placeholder.com/40x40?text=User';
                    displayProfession = profileData.title || profileData.profession || 'Portfolio';
                  } else {
                    displayAuthor = `${user?.firstName || 'Unknown'} ${user?.lastName || 'User'}`;
                    displayAvatar = user?.profilePicture || 'https://via.placeholder.com/40x40?text=User';
                    displayProfession = user?.profession || 'Worker';
                  }
                }
                
                return (
                  <>
                    <img
                      src={displayAvatar}
                      alt={displayAuthor}
                      className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/40x40?text=User';
                      }}
                    />
                    <div>
                      <h3 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} text-sm md:text-base`}>
                        {displayAuthor}
                      </h3>
                      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs md:text-sm`}>
                        {displayProfession} • {selectedItem.createdAt && getTimeAgo(selectedItem.createdAt)}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
            
            {/* Action buttons */}
            <div className="flex items-center space-x-2">
              {/* More Options Dropdown - TEMP: Always show on own profile for debugging */}
              {selectedItem && isOwnProfile && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Dropdown button clicked - TEMP DEBUG MODE');
                      console.log('Selected item:', selectedItem);
                      toggleDropdown();
                    }}
                    className={`p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
                  >
                    <MoreHorizontal className={`w-5 h-5 md:w-6 md:h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div 
                      className={`absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg border z-10 ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-white border-gray-200'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="py-1">
                        <button
                          onClick={handleEditPost}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                            isDarkMode 
                              ? 'text-gray-200 hover:bg-gray-700' 
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {selectedItem.type === 'post' ? 'Edit Post' : 'Edit Portfolio Item'}
                        </button>
                        <button
                          onClick={handleDeletePost}
                          disabled={deleteLoading}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                            deleteLoading
                              ? 'opacity-50 cursor-not-allowed'
                              : isDarkMode 
                              ? 'text-red-400 hover:bg-gray-700' 
                              : 'text-red-600 hover:bg-gray-50'
                          }`}
                        >
                          {deleteLoading ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Deleting...
                            </span>
                          ) : (
                            `${selectedItem.type === 'post' ? 'Delete Post' : 'Delete Portfolio Item'}`
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeModal();
                }}
                className={`p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
              >
                <X className={`w-5 h-5 md:w-6 md:h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Media Section - Full width on mobile, left side on desktop */}
            <div className="flex-1 bg-black flex items-center justify-center relative">
              {(() => {
                const mediaItems = getSelectedItemMedia();
                const currentMedia = mediaItems[currentImageIndex];
                
                return (
                  <>
                    {mediaItems.length > 1 && currentImageIndex > 0 && (
                      <button
                        onClick={prevImage}
                        className="absolute left-2 md:left-4 z-10 bg-black bg-opacity-50 text-white p-2 md:p-3 rounded-full hover:bg-opacity-70 transition-all duration-200"
                      >
                        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                      </button>
                    )}
                    
                    {currentMedia?.type === 'video' ? (
                      <video
                        src={currentMedia.url}
                        className="max-h-full max-w-full object-contain"
                        controls
                        autoPlay
                      />
                    ) : (
                      <img
                        src={currentMedia?.url}
                        alt={selectedItem.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    )}
                    
                    {mediaItems.length > 1 && currentImageIndex < mediaItems.length - 1 && (
                      <button
                        onClick={nextImage}
                        className="absolute right-2 md:right-4 z-10 bg-black bg-opacity-50 text-white p-2 md:p-3 rounded-full hover:bg-opacity-70 transition-all duration-200"
                      >
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                      </button>
                    )}

                    {/* Media Counter */}
                    {mediaItems.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium">
                        {currentImageIndex + 1} / {mediaItems.length}
                      </div>
                    )}

                    {/* Media Thumbnails - Hidden on mobile, visible on tablet+ */}
                    {mediaItems.length > 1 && (
                      <div className="hidden md:flex absolute bottom-4 right-4 space-x-2 max-w-xs overflow-x-auto">
                        {mediaItems.map((media, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                              index === currentImageIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-80'
                            }`}
                          >
                            {media.type === 'video' ? (
                              <video
                                src={media.url}
                                className="w-full h-full object-cover"
                                muted
                              />
                            ) : (
                              <img
                                src={media.url}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>

            {/* Post Details & Comments Section - Bottom on mobile, right side on desktop */}
            <div className={`w-full lg:w-96 flex flex-col border-t lg:border-t-0 lg:border-l ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} max-h-[40vh] lg:max-h-none`}>
              {/* Post Description */}
              <div className={`p-3 md:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <div>
                  {selectedItem.type === 'post' && selectedItem.source.content ? (
                    <div 
                      className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-sm md:text-base leading-relaxed`}
                      dangerouslySetInnerHTML={{ 
                        __html: selectedItem.source.content
                      }}
                    />
                  ) : (
                    <>
                      <h4 className={`font-semibold text-lg mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                        {selectedItem.title}
                      </h4>
                      {selectedItem.source.description && (
                        <div 
                          className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-sm md:text-base leading-relaxed`}
                        >
                          {selectedItem.source.description}
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                {/* Post Stats */}
                <div className={`flex items-center justify-between mt-3 md:mt-4 text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span>{selectedItem.source?.likes?.length || 0} likes</span>
                  <span>{comments.length} comments</span>
                </div>

                {/* Action Buttons */}
                <div className={`flex items-center justify-between mt-3 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <button 
                    type="button"
                    onClick={() => {
                      if (selectedItem.source && selectedItem.source._id) {
                        handleLike(selectedItem.source._id);
                      }
                    }}
                    className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 rounded-lg transition-colors duration-200 flex-1 justify-center ${
                      selectedItem.source && likedPosts.has(selectedItem.source._id)
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                        : isDarkMode 
                          ? 'hover:bg-gray-700' 
                          : 'hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 md:w-5 md:h-5 ${
                      selectedItem.source && likedPosts.has(selectedItem.source._id) 
                        ? 'text-red-600 fill-current dark:text-red-400' 
                        : isDarkMode 
                          ? 'text-gray-300' 
                          : 'text-gray-600'
                    }`} />
                    <span className={`font-medium text-xs md:text-sm ${
                      selectedItem.source && likedPosts.has(selectedItem.source._id)
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
                    className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 rounded-lg transition-colors duration-200 flex-1 justify-center ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                  >
                    <MessageCircle className={`w-4 h-4 md:w-5 md:h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    <span className={`font-medium text-xs md:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Comment</span>
                  </button>
                  <button 
                    type="button"
                    className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 rounded-lg transition-colors duration-200 flex-1 justify-center ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: selectedItem.title,
                          text: `Check out this ${selectedItem.category}`,
                          url: selectedItem.url,
                        });
                      } else {
                        navigator.clipboard.writeText(selectedItem.url);
                        toast.success("Link copied to clipboard!");
                      }
                    }}
                  >
                    <Share2 className={`w-4 h-4 md:w-5 md:h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    <span className={`font-medium text-xs md:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Share</span>
                  </button>
                </div>
              </div>

              {/* Comments Section - Only for posts */}
              {selectedItem.type === 'post' && (
                <div className="flex-1 overflow-y-auto p-2 md:p-3 space-y-3 md:space-y-4 no-scrollbar">
                  <h4 className={`font-semibold mb-2 md:mb-3 text-sm md:text-base ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Comments</h4>
                  
                  {commentsLoading ? (
                    <div className="text-center py-6 md:py-8">
                      <div className={`w-6 h-6 md:w-8 md:h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2 ${isDarkMode ? 'border-gray-400' : 'border-gray-300'}`}></div>
                      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm md:text-base`}>Loading comments...</p>
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="text-center py-6 md:py-8">
                      <MessageCircle className={`w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm md:text-base`}>No comments yet</p>
                      <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-xs md:text-sm`}>Be the first to comment!</p>
                    </div>
                  ) : (
                    comments.map((comment) => {
                      // Get comment author info like home page
                      const author = comment.userId || comment.userInfo;
                      const authorName = author?.firstName && author?.lastName 
                        ? `${author.firstName} ${author.lastName}`
                        : author?.firstName || 'Anonymous';
                      const authorAvatar = author?.profilePicture || 'https://via.placeholder.com/32x32?text=User';
                      
                      return (
                        <div key={comment._id} className="flex space-x-2 md:space-x-3">
                          <img
                            src={authorAvatar}
                            alt={authorName}
                            className="w-7 h-7 md:w-9 md:h-9 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/32x32?text=User';
                            }}
                          />
                          <div className="flex-1">
                            <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl px-3 md:px-4 py-2 md:py-3`}>
                              <p className={`font-semibold text-xs md:text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                {authorName}
                              </p>
                              <p className={`text-xs md:text-sm mt-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                {comment.comment}
                              </p>
                            </div>
                            <div className={`flex items-center space-x-4 mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              <span>{getTimeAgo(comment.commentedAt || comment.createdAt)}</span>
                              <button className={`font-medium ${isDarkMode ? 'hover:text-gray-200' : 'hover:text-gray-700'}`}>Like</button>
                              <button className={`font-medium ${isDarkMode ? 'hover:text-gray-200' : 'hover:text-gray-700'}`}>Reply</button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* Comment Input */}
              {selectedItem.type === 'post' && (
                <div className={`p-3 md:p-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                  <div className="flex space-x-2 md:space-x-3">
                    <img
                      src={user?.profilePicture || 'https://via.placeholder.com/32x32?text=You'}
                      alt={`${user?.firstName || 'You'} ${user?.lastName || ''}`}
                      className="w-7 h-7 md:w-9 md:h-9 rounded-full object-cover flex-shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/32x32?text=You';
                      }}
                    />
                    <div className="flex-1 flex space-x-2">
                      <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className={`flex-1 px-3 md:px-4 py-2 md:py-3 rounded-full text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black placeholder-gray-500'}`}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      />
                      <button
                        type="button"
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className={`p-2 md:p-3 text-blue-600 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? 'hover:bg-blue-900' : 'hover:bg-blue-50'}`}
                      >
                        <Send className="w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="flex-1 overflow-y-auto p-3 md:p-4">
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} space-y-2`}>
                  {selectedItem.createdAt && (
                    <div>
                      <span className="font-medium">Created:</span> {new Date(selectedItem.createdAt).toLocaleDateString()}
                    </div>
                  )}
                  {selectedItem.type === 'post' && selectedItem.source.userInfo && (
                    <div>
                      <span className="font-medium">Posted by:</span> {selectedItem.source.userInfo.firstName} {selectedItem.source.userInfo.lastName}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EditMediaPost Modal */}
      {isEditModalOpen && editData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <EditMediaPost
              mediaFiles={editData.mediaFiles || []}
              description={editData.description || ''}
              type={editData.type || 'post'}
              onDescriptionChange={handleEditDescriptionChange}
              onMediaRemove={handleEditMediaRemove}
              onSave={handleEditSave}
              onCancel={handleEditCancel}
              loading={editLoading}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotosTab;
