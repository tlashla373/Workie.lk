import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Heart, 
  MessageCircle, 
  Share, 
  MoreVertical,
  User,
  Verified,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Loader,
  Send
} from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../hooks/useAuth';
import postService from '../../services/postService';
import { toast } from 'react-toastify';

const Video = () => {
  const { isDarkMode } = useDarkMode();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const { user } = useAuth();
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted for auto-play
  const [likedVideos, setLikedVideos] = useState([]);
  const [savedVideos, setSavedVideos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  // Comment system states
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  
  const videoRefs = useRef([]);
  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face';

  // Fetch video posts from database
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching video posts...');
        console.log('Auth token exists:', !!localStorage.getItem('auth_token'));
        console.log('User:', user);
        
        const response = await postService.getVideoPosts(page, 10);
        console.log('Full API Response:', response);
        
        if (response.success && response.data) {
          // Ensure response.data is an array
          const videoData = Array.isArray(response.data) ? response.data : [];
          
          if (page === 1) {
            setVideos(videoData);
          } else {
            setVideos(prev => [...prev, ...videoData]);
          }
          
          // Check if there are more pages - safely handle pagination
          if (response.pagination) {
            setHasMore(response.pagination.page < response.pagination.pages);
          } else {
            // If no pagination info, assume no more pages if we got less than limit
            setHasMore(videoData.length === 10);
          }
          
          console.log('Video posts fetched:', videoData.length);
        } else {
          setError('Failed to load videos');
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
        setError('Failed to load videos. Please try again.');
        toast.error('Failed to load videos');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [page]);

  // auto-play with Intersection Observer
  useEffect(() => {
    const observerOptions = {
      root: containerRef.current,
      rootMargin: '0px',
      threshold: 0.6 // Play when 60% of video is visible
    };

    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const videoElement = entry.target;
        const videoIndex = videoRefs.current.findIndex(ref => ref === videoElement);
        
        if (entry.isIntersecting) {
          // Video is in view - play it and update current video
          if (videoIndex !== -1) {
            setCurrentVideo(videoIndex);
            
            // Pause all other videos first
            videoRefs.current.forEach((vid, idx) => {
              if (vid && idx !== videoIndex && !vid.paused) {
                vid.pause();
              }
            });
            
            // Play the current video
            if (videoElement && videoElement.paused) {
              videoElement.play().catch(console.error);
              setIsPlaying(true);
            }
          }
        } else {
          // Video is out of view - pause it
          if (videoElement && !videoElement.paused) {
            videoElement.pause();
            if (videoIndex === currentVideo) {
              setIsPlaying(false);
            }
          }
        }
      });
    }, observerOptions);

    // Observe all video elements
    videoRefs.current.forEach(video => {
      if (video && observerRef.current) {
        observerRef.current.observe(video);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [videos, currentVideo]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const videoElements = videoRefs.current;
      const containerRect = container.getBoundingClientRect();
      const containerCenter = containerRect.top + containerRect.height / 2;
      
      let closestVideo = 0;
      let closestDistance = Infinity;
      
      videoElements.forEach((video, index) => {
        if (video) {
          const videoRect = video.getBoundingClientRect();
          const videoCenter = videoRect.top + videoRect.height / 2;
          const distance = Math.abs(videoCenter - containerCenter);
          
          if (distance < closestDistance) {
            closestDistance = distance;
            closestVideo = index;
          }
        }
      });
      
      if (closestVideo !== currentVideo) {
        setCurrentVideo(closestVideo);
        // Don't set isPlaying to false here - let Intersection Observer handle it
      }

      // Infinite scroll - load more videos when near the end
      const { scrollTop, scrollHeight, clientHeight } = container;
      if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !loading) {
        setPage(prevPage => prevPage + 1);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentVideo, hasMore, loading]);

  // Simple video controls
  const togglePlay = () => {
    const video = videoRefs.current[currentVideo];
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    const video = videoRefs.current[currentVideo];
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleLike = (videoId) => {
    setLikedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const toggleSave = (videoId) => {
    setSavedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  // Comment system functions (similar to home page)
  const loadCommentsForPost = async (postId) => {
    // Don't reload if we already have database comments for this post
    const existingComments = comments[postId] || [];
    const hasDbComments = existingComments.some(comment => typeof comment.id === 'string');
    
    if (hasDbComments) {
      return;
    }

    setLoadingComments(true);
    try {
      console.log('Loading comments for video post:', postId);
      const response = await postService.getComments(postId);
      console.log('Comments response:', response);
      const dbComments = response.data?.comments || [];
      console.log('DB Comments:', dbComments);
      
      // Transform database comments to UI format
      const formattedComments = dbComments.map(comment => {
        console.log('Processing comment:', comment);

        // Get author info from userId populate or fallback to userInfo
        const author = comment.userId || comment.userInfo;
        const authorName = author?.firstName && author?.lastName 
          ? `${author.firstName} ${author.lastName}`
          : author?.firstName || 'Anonymous';
          
        return {
          id: comment._id,
          text: comment.comment, // Note: field is called 'comment' not 'text'
          author: authorName,
          avatar: author?.profilePicture || DEFAULT_AVATAR,
          timeAgo: comment.commentedAt ? new Date(comment.commentedAt).toLocaleDateString() : 'Unknown date'
        };
      });
      
      console.log('Formatted comments:', formattedComments);

      // Merge with any locally added comments (ones with numeric IDs)
      const localComments = existingComments.filter(comment => typeof comment.id === 'number');
      
      setComments(prev => ({
        ...prev,
        [postId]: [...formattedComments, ...localComments]
      }));
    } catch (error) {
      console.error('Error loading comments:', error);
      // Keep any existing local comments if database load fails
      if (existingComments.length === 0) {
        setComments(prev => ({
          ...prev,
          [postId]: []
        }));
      }
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async (postId) => {
    if (!newComment.trim() || !user) return;

    const tempId = Date.now();
    const comment = {
      id: tempId,
      author: `${user.firstName || 'You'} ${user.lastName || ''}`.trim(),
      avatar: user.profilePicture || DEFAULT_AVATAR,
      text: newComment,
      timeAgo: "Just now"
    };
    
    // Optimistic update
    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), comment]
    }));
    setNewComment('');

    try {
      // Make API call to add comment
      await postService.addComment(postId, newComment.trim());
      console.log('Comment added successfully');
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      // Remove optimistic update on error
      setComments(prev => ({
        ...prev,
        [postId]: prev[postId].filter(c => c.id !== tempId)
      }));
    }
  };

  // Load comments when videos are fetched
  useEffect(() => {
    if (videos.length > 0) {
      videos.forEach(video => {
        const videoId = video._id || video.id;
        if (videoId) {
          loadCommentsForPost(videoId);
        }
      });
    }
  }, [videos]);
    

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">

        {/* Video Feed */}
        {loading && videos.length === 0 ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <Loader className={`w-8 h-8 animate-spin mx-auto mb-4 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} />
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading videos...</p>
            </div>
          </div>
        ) : error ? (
          <div className="h-screen flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={() => {
                  setError(null);
                  setPage(1);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : !Array.isArray(videos) || videos.length === 0 ? (
          <div className="h-screen flex items-center justify-center">
            <div className="text-center">
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                No videos available yet
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Upload some videos to see them here!
              </p>
            </div>
          </div>
        ) : (
          <div 
            ref={containerRef}
            className="h-screen overflow-y-auto snap-y snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {Array.isArray(videos) && videos.map((video, index) => {
              const videoId = video._id || video.id; // Handle both MongoDB _id and id
              return (
            <div key={videoId} className="h-screen snap-start relative flex flex-col lg:flex-row">
              {/* Video Player */}
              <div className="flex-1 relative bg-black">
                <div className="h-full w-full flex items-center justify-center">
                  <div className="relative w-full h-full max-w-full">
                    {/* Use actual video if available, otherwise show thumbnail */}
                    {video.videoUrl ? (
                      <video
                        ref={(el) => {
                          videoRefs.current[index] = el;
                          if (el) {
                            el.addEventListener('loadstart', () => console.log('Video load started:', video.videoUrl));
                            el.addEventListener('loadeddata', () => {
                              console.log('Video data loaded:', video.videoUrl);
                              // Re-observe the video element when it's loaded
                              if (observerRef.current) {
                                observerRef.current.observe(el);
                              }
                            });
                            el.addEventListener('error', (e) => console.error('Video error:', e, video.videoUrl));
                            el.addEventListener('canplay', () => console.log('Video can play:', video.videoUrl));
                            el.addEventListener('play', () => {
                              if (index === currentVideo) setIsPlaying(true);
                            });
                            el.addEventListener('pause', () => {
                              if (index === currentVideo) setIsPlaying(false);
                            });
                          }
                        }}
                        src={video.videoUrl}
                        className="w-full h-full object-contain"
                        loop
                        playsInline
                        muted={isMuted}
                        poster={video.thumbnail}
                        controls={false}
                        preload="metadata"
                        style={{ backgroundColor: 'black' }}
                        onError={(e) => console.error('Video element error:', e.target.error)}
                        onLoadedData={() => console.log('Video loaded successfully')}
                      />
                    ) : (
                      <img
                        src={video.thumbnail || 'https://via.placeholder.com/800x450?text=Video'}
                        alt={video.title}
                        className="w-full h-full object-contain"
                      />
                    )}
                    
                    {/* Video click area for mute/unmute */}
                    <button
                      onClick={toggleMute}
                      className="group absolute inset-0 flex items-center justify-center text-white transition-all duration-200 bg-transparent"
                      title={isMuted ? "Click to unmute" : "Click to mute"}
                    >
                      {/* Mute/Unmute indicator */}
                      <div className={`absolute top-4 left-4 transition-all duration-300 ${
                        isMuted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}>
                        <div className="bg-black bg-opacity-50 rounded-full p-2">
                          {isMuted ? (
                            <VolumeX className="w-5 h-5 text-white" />
                          ) : (
                            <Volume2 className="w-5 h-5 text-white" />
                          )}
                        </div>
                      </div>
                    </button>
                    
                    {/* Play button - Only show when video is paused */}
                    {(!isPlaying || index !== currentVideo) && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                          <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-1 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Auto-play indicator */}
                    {isPlaying && index === currentVideo && (
                      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
                        <span>Auto-playing</span>
                        {isMuted && <VolumeX className="w-3 h-3" />}
                      </div>
                    )}

                    {/* Simple Video Controls */}
                    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex items-center space-x-2">
                      <span className="text-white text-xs sm:text-sm bg-black bg-opacity-50 px-2 py-1 rounded flex items-center space-x-1">
                        <span>{video.duration || '0:00'}</span>
                        {isMuted ? (
                          <VolumeX className="w-3 h-3" />
                        ) : (
                          <Volume2 className="w-3 h-3" />
                        )}
                      </span>
                    </div>

                    {/* Click instruction */}
                    <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4">
                      <span className="text-white text-xs bg-black bg-opacity-50 px-2 py-1 rounded">
                        Tap to {isMuted ? 'unmute' : 'mute'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Info Sidebar */}
              <div className={`w-full lg:w-96 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-t lg:border-t-0 lg:border-l ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col transition-colors duration-300 max-h-full lg:max-h-screen overflow-hidden`}>
                <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
                  {/* Creator Info */}
                  <div className="flex items-center space-x-3  mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center overflow-hidden`}>
                      {video.avatar && video.avatar.startsWith('http') ? (
                        <img
                          src={video.avatar}
                          alt={video.creator}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className={`w-full h-full ${isDarkMode ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-blue-400 to-purple-500'} flex items-center justify-center text-white font-bold text-sm sm:text-base ${video.avatar && video.avatar.startsWith('http') ? 'hidden' : ''}`}
                      >
                        {video.avatar && !video.avatar.startsWith('http') 
                          ? video.avatar 
                          : video.creator.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                        }
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-semibold text-sm sm:text-base truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {video.creator}
                        </h3>
                        {video.verified && <Verified className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />}
                      </div>
                      <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs md:text-sm`}>{video.profession || 'worker'} • {video.location || 'Sri Lanka'} • {video.timeAgo || 'Recently'}</p>
                    </div>
                    <button className={`p-1.5 sm:p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors flex-shrink-0`}>
                      <MoreVertical className={`w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                    </button>
                  </div>

                  {/* Video Title and Description */}
                  <div className="mb-4 sm:mb-6">
                    <h2 className={`text-base sm:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 line-clamp-2`}>
                      {video.title}
                    </h2>
                    <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed line-clamp-3 lg:line-clamp-none`}>
                      {video.description}
                    </p>
                  </div>

                  {/* Category */}
                  <div className="mb-4 sm:mb-6">
                    <span className={`inline-block px-2 sm:px-3 py-1 rounded-lg text-xs font-medium ${isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800'}`}>
                      {video.category}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 mb-4 sm:mb-6">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center space-x-2 sm:space-x-4">
                        <button
                          onClick={() => toggleLike(videoId)}
                          className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 ${
                            likedVideos.includes(videoId)
                              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                              : isDarkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${likedVideos.includes(videoId) ? 'fill-current' : ''}`} />
                          <span className="text-xs sm:text-sm font-medium">{video.likes + (likedVideos.includes(videoId) ? 1 : 0)}</span>
                        </button>

                        <button className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-xs sm:text-sm font-medium">{video.comments}</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleSave(videoId)}
                          className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                            savedVideos.includes(videoId)
                              ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : isDarkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${savedVideos.includes(videoId) ? 'fill-current' : ''}`} />
                        </button>

                        <button className={`p-1.5 sm:p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                          <Share className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className={`font-semibold text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Comments ({(comments[videoId] || []).length})
                      </h4>
                      <button
                        onClick={() => {
                          // Clear existing comments and reload from database
                          setComments(prev => ({
                            ...prev,
                            [videoId]: []
                          }));
                          loadCommentsForPost(videoId);
                        }}
                        className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} transition-colors`}
                      >
                        Refresh
                      </button>
                    </div>
                    
                    {loadingComments ? (
                      <div className="text-center py-6">
                        <Loader className={`w-6 h-6 animate-spin mx-auto mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading comments...</p>
                      </div>
                    ) : (comments[videoId] || []).length === 0 ? (
                      <div className="text-center py-22">
                        <MessageCircle className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>No comments yet</p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Be the first to comment!</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
                        {(comments[videoId] || []).map((comment) => (
                          <div key={comment.id} className="flex space-x-2 sm:space-x-3">
                            <img
                              src={comment.avatar}
                              alt={comment.author}
                              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover flex-shrink-0"
                              onError={(e) => {
                                e.target.src = DEFAULT_AVATAR;
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className={`text-xs sm:text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {comment.author}
                                </span>
                                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex-shrink-0`}>
                                  {comment.timeAgo}
                                </span>
                              </div>
                              <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                                {comment.text}
                              </p>
                              <div className="flex items-center space-x-2 mt-2">
                                <button className={`text-xs ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'} flex items-center space-x-1`}>
                                  <ThumbsUp className="w-3 h-3" />
                                  <span>Like</span>
                                </button>
                                <button className={`text-xs ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'}`}>
                                  Reply
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment */}
                    <div className={`flex space-x-2 sm:space-x-3 pt-4 border-t  ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center overflow-hidden`}>
                        {user?.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = DEFAULT_AVATAR;
                            }}
                          />
                        ) : (
                          <div 
                            className={`w-full h-full ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center text-white text-xs font-bold`}
                          >
                            {user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() : 'U'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex space-x-2">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className={`flex-1 px-3 md:px-4 py-2 md:py-3 rounded-full text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black placeholder-gray-500'}`}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddComment(videoId)}
                        />
                        <button
                          onClick={() => handleAddComment(videoId)}
                          disabled={!newComment.trim()}
                          className={`p-2 md:p-3 text-blue-600 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? 'hover:bg-blue-900' : 'hover:bg-blue-50'}`}
                        >
                          <Send className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              );
            })}
          
          {/* Loading indicator for infinite scroll */}
          {loading && videos.length > 0 && (
            <div className="h-20 flex items-center justify-center">
              <Loader className={`w-6 h-6 animate-spin ${isDarkMode ? 'text-white' : 'text-gray-600'}`} />
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default Video;