import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Share,
  Upload,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Send
} from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import profileService from '../../services/profileService';
import postService from '../../services/postService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

// Photos Tab Component
const PhotosTab = ({ profileData, isDarkMode, isOwnProfile, userId }) => {
  const { user } = useAuth();
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

  // Get the target user ID (either from props or current user)
  const targetUserId = userId || user?.id || user?._id;

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
      userPosts.forEach((post, postIndex) => {
        if (post.media && post.media.length > 0) {
          post.media.forEach((media, mediaIndex) => {
            allItems.push({
              id: `post-${post._id || postIndex}-${mediaIndex}`,
              url: media.url,
              title: post.content ? post.content.substring(0, 50) + '...' : `Post ${postIndex + 1}`,
              category: 'Post',
              type: 'post',
              fileType: media.fileType,
              createdAt: post.createdAt,
              source: post
            });
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
    document.body.style.overflow = 'unset'; // Restore background scrolling
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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

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

      {/* Media Grid */}
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
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add like functionality here
                  }}
                >
                  <Heart className="w-5 h-5" />
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

      {/* Full Screen Modal - Similar to Home Page */}
      {selectedItem && (
        <div className={`fixed inset-0 z-50 flex flex-col animate-in slide-in-from-bottom duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}  `}>
          {/* Header Bar */}
          <div className={`flex items-center justify-between p-2 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center space-x-3">
              {selectedItem.type === 'post' && selectedItem.source.userInfo ? (
                // Post owner profile
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={selectedItem.source.userInfo.profilePicture || 'https://via.placeholder.com/40x40?text=User'}
                    alt={`${selectedItem.source.userInfo.firstName} ${selectedItem.source.userInfo.lastName}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/40x40?text=User';
                    }}
                  />
                </div>
              ) : (
                // Portfolio badge
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedItem.type === 'portfolio' ? 'bg-blue-100' : 'bg-green-100'}`}>
                  <span className={`text-sm font-bold ${selectedItem.type === 'portfolio' ? 'text-blue-600' : 'text-green-600'}`}>
                    P
                  </span>
                </div>
              )}
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} text-sm md:text-base`}>
                  {selectedItem.type === 'post' && selectedItem.source.userInfo 
                    ? `${selectedItem.source.userInfo.firstName} ${selectedItem.source.userInfo.lastName}`
                    : selectedItem.title
                  }
                </h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs md:text-sm`}>
                  {selectedItem.type === 'post' ? 'Post' : selectedItem.category}
                  {selectedItem.createdAt && ` • ${new Date(selectedItem.createdAt).toLocaleDateString()}`}
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

            {/* Details Section - Bottom on mobile, right side on desktop */}
            <div className={`w-full lg:w-96 flex flex-col border-t lg:border-t-0 lg:border-l ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} max-h-[40vh] lg:max-h-none`}>
              {/* Item Details */}
              <div className={`p-3 md:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <h4 className={`font-semibold text-lg mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {selectedItem.title}
                </h4>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mb-3`}>
                  Category: {selectedItem.category}
                </p>
                
                {selectedItem.type === 'post' && selectedItem.source.content && (
                  <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-sm mb-3`}>
                    {selectedItem.source.content}
                  </p>
                )}

                {selectedItem.source.description && (
                  <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-sm mb-3`}>
                    {selectedItem.source.description}
                  </p>
                )}

                {/* Action Buttons */}
                <div className={`flex items-center justify-between mt-4 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <button className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 flex-1 justify-center mr-1 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <Heart className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    <span className={`font-medium text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Like</span>
                  </button>
                  <button className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 flex-1 justify-center mx-1 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <MessageCircle className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    <span className={`font-medium text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Comment</span>
                  </button>
                  <button 
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors duration-200 flex-1 justify-center ml-1 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
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
                    <Share className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    <span className={`font-medium text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Share</span>
                  </button>
                </div>
              </div>

              {/* Comments Section - Only for posts */}
              {selectedItem.type === 'post' && (
                <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  {/* Comment Input */}
                  <div className={`p-3 md:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <img
                          src={user?.profilePicture || 'https://via.placeholder.com/32x32?text=You'}
                          alt={`${user?.firstName} ${user?.lastName}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/32x32?text=You';
                          }}
                        />
                      </div>
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
                  <div className="flex-1 overflow-y-auto max-h-64">
                    {commentsLoading ? (
                      <div className="p-4 text-center">
                        <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Loading comments...
                        </div>
                      </div>
                    ) : comments.length > 0 ? (
                      <div className="space-y-3 p-3 md:p-4">
                        {comments.map((comment) => (
                          <div key={comment._id} className="flex items-start space-x-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                              <img
                                src={comment.userInfo?.profilePicture || 'https://via.placeholder.com/32x32?text=User'}
                                alt={`${comment.userInfo?.firstName} ${comment.userInfo?.lastName}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/32x32?text=User';
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <div className={`inline-block px-3 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                <div className={`font-medium text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                  {comment.userInfo?.firstName} {comment.userInfo?.lastName}
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
                        ))}
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
    </div>
  );
};

export default PhotosTab;
