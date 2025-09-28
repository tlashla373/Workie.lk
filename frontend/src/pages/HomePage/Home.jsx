import { useState, useEffect } from 'react';
import { MoreHorizontal, MessageSquare, MapPin, Heart, Share2, X, ChevronLeft, ChevronRight, Send, ChevronUp, ChevronDown  } from "lucide-react";
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../hooks/useAuth';
import postService from '../../services/postService';
import PostDropdown from './Dropdown';
import Welder from '../../assets/welder.svg'
import Plumber from '../../assets/plumber.svg'
import Carpenter from '../../assets/carpenter.svg'
import Painter from '../../assets/painter.svg'
import Mason from '../../assets/mason.svg'
import Cleaner from '../../assets/cleaner.svg'
import Mechanic from '../../assets/Mechanic.svg'

export default function MainFeed() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState({});
  const [loadingComments, setLoadingComments] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false); // New state for loading more posts
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set()); // Track liked posts
  const [showCategories, setShowCategories] = useState(true); // Control category visibility
  const { isDarkMode } = useDarkMode();
  const { user } = useAuth();

  // Fetch posts from database
  useEffect(() => {
    const fetchInitialPosts = async () => {
      try {
        setLoading(true);
        console.log('Fetching initial feed posts from database...');
        
        const response = await postService.getFeedPosts(1, 5); // Start with only 5 posts
        
        if (response.success && response.data) {
          const fetchedPosts = response.data.posts || response.data || [];
          console.log('Initial posts fetched successfully:', fetchedPosts.length);
          
          // Transform database posts to match UI format
          const transformedPosts = fetchedPosts.map(post => ({
            id: post._id,
            author: `${post.userId?.firstName || post.userInfo?.firstName || 'Unknown'} ${post.userId?.lastName || post.userInfo?.lastName || 'User'}`,
            profession: post.userId?.profession || post.userInfo?.profession || 'Worker',
            location: post.location || 'Sri Lanka',
            avatar: post.userId?.profilePicture || post.userInfo?.profilePicture || 'https://via.placeholder.com/40x40?text=User',
            media: post.media || [], // Keep full media objects with type info
            images: post.media?.filter(media => media.fileType === 'image').map(media => media.url) || [],
            videos: post.media?.filter(media => media.fileType === 'video').map(media => media.url) || [],
            imageAlt: post.content ? `${post.content.substring(0, 50)}...` : 'Post image',
            description: post.content || 'No description available',
            likes: post.engagement?.likesCount || post.likes?.length || 0,
            comments: post.engagement?.commentsCount || post.comments?.length || 0,
            timeAgo: getTimeAgo(post.createdAt),
            originalPost: post // Keep original data for comments API
          }));
          
          // Initialize liked posts set based on user's likes in fetched posts
          if (user?._id) {
            const userLikedPostIds = new Set();
            fetchedPosts.forEach(post => {
              // Check if user has liked this post
              const userLike = post.likes?.find(like => like.userId === user._id);
              if (userLike) {
                userLikedPostIds.add(post._id);
              }
            });
            setLikedPosts(userLikedPostIds);
            console.log('User liked posts loaded:', userLikedPostIds.size);
          }
          
          setPosts(transformedPosts);
          setPage(2); // Set next page
          setHasMore(response.data.hasMore !== false && transformedPosts.length === 5); // Has more if we got full batch
        } else {
          console.warn('No posts data received');
          setPosts([]);
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error fetching initial posts:', error);
        setError('Failed to load posts. Please try again.');
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialPosts();
  }, []);

  // Function to load more posts
  const loadMorePosts = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      console.log('Loading more posts, page:', page);
      
      const response = await postService.getFeedPosts(page, 5); // Load 5 more posts
      
      if (response.success && response.data) {
        const fetchedPosts = response.data.posts || response.data || [];
        console.log('More posts fetched successfully:', fetchedPosts.length);
        
        if (fetchedPosts.length === 0) {
          setHasMore(false);
          return;
        }
        
        // Transform database posts to match UI format
        const transformedPosts = fetchedPosts.map(post => ({
          id: post._id,
          author: `${post.userId?.firstName || post.userInfo?.firstName || 'Unknown'} ${post.userId?.lastName || post.userInfo?.lastName || 'User'}`,
          profession: post.userId?.profession || post.userInfo?.profession || 'Worker',
          location: post.location || 'Sri Lanka',
          avatar: post.userId?.profilePicture || post.userInfo?.profilePicture || 'https://via.placeholder.com/40x40?text=User',
          media: post.media || [], // Keep full media objects with type info
          images: post.media?.filter(media => media.fileType === 'image').map(media => media.url) || [],
          videos: post.media?.filter(media => media.fileType === 'video').map(media => media.url) || [],
          imageAlt: post.content ? `${post.content.substring(0, 50)}...` : 'Post image',
          description: post.content || 'No description available',
          likes: post.engagement?.likesCount || post.likes?.length || 0,
          comments: post.engagement?.commentsCount || post.comments?.length || 0,
          timeAgo: getTimeAgo(post.createdAt),
          originalPost: post // Keep original data for comments API
        }));
        
        // Update liked posts for new posts
        if (user?._id) {
          const newLikedPostIds = new Set(likedPosts);
          fetchedPosts.forEach(post => {
            const userLike = post.likes?.find(like => like.userId === user._id);
            if (userLike) {
              newLikedPostIds.add(post._id);
            }
          });
          setLikedPosts(newLikedPostIds);
        }
        
        // Append new posts to existing ones
        setPosts(prevPosts => [...prevPosts, ...transformedPosts]);
        setPage(prevPage => prevPage + 1);
        
        // Check if there are more posts
        setHasMore(response.data.hasMore !== false && transformedPosts.length === 5);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
      // Don't show error for loading more posts, just stop loading
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  // Scroll detection for infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('.posts-container');
      if (!scrollContainer) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      
      // Load more posts when user scrolls near the bottom (within 300px)
      if (scrollHeight - scrollTop <= clientHeight + 300) {
        loadMorePosts();
      }
    };

    const scrollContainer = document.querySelector('.posts-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [page, hasMore, loadingMore]);

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

  // State for managing expanded posts
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set()); // Track saved posts
  const [hiddenPosts, setHiddenPosts] = useState(new Set()); // Track hidden posts

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

  // Handle save post
  const handleSavePost = async (post) => {
    try {
      const newSavedPosts = new Set(savedPosts);
      
      if (savedPosts.has(post.id)) {
        // Unsave post
        newSavedPosts.delete(post.id);
        console.log('Post unsaved:', post.id);
        // Here you would typically make an API call to unsave the post
        // await postService.unsavePost(post.id);
      } else {
        // Save post
        newSavedPosts.add(post.id);
        console.log('Post saved:', post.id);
        // Here you would typically make an API call to save the post
        // await postService.savePost(post.id);
      }
      
      setSavedPosts(newSavedPosts);
    } catch (error) {
      console.error('Error saving/unsaving post:', error);
    }
  };

  // Handle hide post
  const handleHidePost = async (post) => {
    try {
      const newHiddenPosts = new Set(hiddenPosts);
      newHiddenPosts.add(post.id);
      setHiddenPosts(newHiddenPosts);
      console.log('Post hidden:', post.id);
      
      // Here you would typically make an API call to hide the post
      // await postService.hidePost(post.id);
      
      // Optionally show a toast notification
      // showToast('Post hidden successfully');
    } catch (error) {
      console.error('Error hiding post:', error);
      // Revert if API call fails
      const revertedHiddenPosts = new Set(hiddenPosts);
      revertedHiddenPosts.delete(post.id);
      setHiddenPosts(revertedHiddenPosts);
    }
  };

  // Handle report post
  const handleReportPost = async (post) => {
    try {
      console.log('Reporting post:', post.id);
      // Here you would typically show a report modal or make an API call
      // await postService.reportPost(post.id, reason);
      alert('Thank you for reporting this post. We will review it shortly.');
    } catch (error) {
      console.error('Error reporting post:', error);
      alert('Failed to report post. Please try again.');
    }
  };

  // Handle share post
  const handleSharePost = async (post) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Post by ${post.author}`,
          text: post.description,
          url: `${window.location.origin}/post/${post.id}`,
        });
        console.log('Post shared successfully');
      } else {
        // Fallback: copy to clipboard
        const postUrl = `${window.location.origin}/post/${post.id}`;
        await navigator.clipboard.writeText(postUrl);
        alert('Post link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
    }
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
    if (lines.length > 5 && !isExpanded) {
      const truncatedLines = lines.slice(0, 3);
      return truncatedLines.join('<br>');
    }
    
    return formattedText;
  };

  const categories = [
    { name: "Carpenter", icon: Carpenter , color: "bg-[#F0F3FF]" },
    { name: "Mason", icon: Mason, color: "bg-[#F0F3FF]" },
    { name: "Plumber", icon: Plumber , color: "bg-[#F0F3FF]" },
    { name: "Welder", icon: Welder, color: "bg-[#F0F3FF]" },
    { name: "Cleaner", icon: Cleaner, color: "bg-[#F0F3FF]" },
    { name: "Mechanic", icon: Mechanic, color: "bg-[#F0F3FF]" },
    { name: "Painter", icon: Painter, color: "bg-[#F0F3FF]" }
  ];

  const CategoryCard = ({ category, index }) => (
    <div
      key={index}
      className={`flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-[#FFFFF]'} lg:ml-10 items-center p-1 md:p-1 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group w-14 md:w-12 lg:w-18`}
    >
      <div className={`w-10 h-8 md:w-8 md:h-8 lg:w-14 lg:h-14 ${category.color} rounded-xl flex items-center shadow-sm justify-center mb-1 md:mb-1 group-hover:scale-110 transition-transform duration-300`}>
        <img src={category.icon} alt={category.name} className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10" />
      </div>
      <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-300 text-xs md:text-sm text-center leading-tight`}>{category.name}</span>
    </div>
  );

  // MediaGrid component to handle both images and videos
  const MediaGrid = ({ media, onClick }) => {
    const mediaCount = media?.length || 0;

    // Handle no media case
    if (mediaCount === 0) {
      return null;
    }

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

  const handlePostClick = (post, imageIndex = 0) => {
    setSelectedPost(post);
    setCurrentImageIndex(imageIndex);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Load comments for this post
    loadCommentsForPost(post.id);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'unset'; // Restore background scrolling
  };

  const nextImage = () => {
    if (selectedPost && currentImageIndex < selectedPost.media.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
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
      console.log('✅ Comment added successfully');
    } catch (error) {
      console.error('❌ Failed to add comment:', error);
      // Remove the comment on error
      setComments(prev => ({
        ...prev,
        [postId]: (prev[postId] || []).filter(c => c.id !== tempId)
      }));
      // Restore the comment text
      setNewComment(newComment);
    }
  };

  // Handle like/unlike functionality
  const handleLike = async (postId, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
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
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, likes: wasLiked ? post.likes - 1 : post.likes + 1 }
            : post
        )
      );

      // Make API call
      const response = await postService.toggleLike(postId);
      
      if (response.success) {
        console.log('✅ Like toggled successfully:', response.data);
        
        // Update with actual data from server
        if (response.data) {
          const { isLiked, likesCount } = response.data;
          
          // Update liked posts set based on server response
          const updatedLikedPosts = new Set(likedPosts);
          if (isLiked) {
            updatedLikedPosts.add(postId);
          } else {
            updatedLikedPosts.delete(postId);
          }
          setLikedPosts(updatedLikedPosts);
          
          // Update posts with actual like count
          setPosts(prevPosts => 
            prevPosts.map(post => 
              post.id === postId 
                ? { ...post, likes: likesCount }
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
      
      // Revert posts like count
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { ...post, likes: wasLiked ? post.likes + 1 : post.likes - 1 }
            : post
        )
      );
    }
  };

  // Load comments from database for a specific post
  const loadCommentsForPost = async (postId) => {
    // Don't reload if we already have database comments for this post
    const existingComments = comments[postId] || [];
    const hasDbComments = existingComments.some(comment => typeof comment.id === 'string');
    
    if (hasDbComments) {
      return;
    }

    setLoadingComments(true);
    try {
      console.log('🔍 Loading comments for post:', postId);
      const response = await postService.getComments(postId);
      console.log('📥 Comments response:', response);
      const dbComments = response.data.comments || [];
      console.log('📝 DB Comments:', dbComments);
      
      // Transform database comments to UI format
      const formattedComments = dbComments.map(comment => {
        console.log('🔄 Processing comment:', comment);
        
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
      
      console.log('✨ Formatted comments:', formattedComments);

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

  const PostCard = ({ post }) => (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-300`}>
      {/* Post Header */}
      <div className="p-3 md:p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <img
              src={post.avatar}
              alt={post.author}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
            />
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} text-xs md:text-sm`}>{post.author}</h3>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>{post.profession} • {post.location} • {post.timeAgo}</p>
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
        <div className="mb-3">
          <div 
            className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-xs md:text-sm leading-relaxed`}
            dangerouslySetInnerHTML={{ 
              __html: formatDescription(
                post.description, 
                post.id, 
                expandedPosts.has(post.id)
              ) 
            }}
          />
          {/* See more/See less button */}
          {post.description && post.description.split('\n').length > 4 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePostExpansion(post.id);
              }}
              className={`mt-2 text-xs md:text-sm font-medium transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-blue-400 hover:text-blue-300' 
                  : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              {expandedPosts.has(post.id) ? 'See less' : 'See more...'}
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
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs md:text-sm`}>{post.likes} likes</span>
          <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs md:text-sm`}>
            {post.comments + (comments[post.id] || []).length} comments
          </span>
        </div>
        
        <div className={`flex items-center justify-between pt-2 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <button 
            type="button"
            onClick={(e) => handleLike(post.id, e)}
            className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 rounded-lg transition-colors duration-200 flex-1 justify-center ${
              likedPosts.has(post.id)
                ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                : isDarkMode 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${
              likedPosts.has(post.id) 
                ? 'text-red-600 fill-current dark:text-red-400' 
                : isDarkMode 
                  ? 'text-gray-300' 
                  : 'text-gray-600'
            }`} />
            <span className={`text-xs md:text-sm font-medium ${
              likedPosts.has(post.id)
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
          onClick={() => {
                      if (navigator.share) {
                        navigator
                          .share({
                            title: "Check this out!",
                            text: "Here’s a cool thing I wanted to share with you.",
                            url: window.location.href, // current page link
                          })
                          .then(() => console.log("Shared successfully"))
                          .catch((error) => console.log("Error sharing:", error));
                      } else {
                        // fallback for browsers without Web Share API
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied to clipboard!");
                      }
                    }}>
            <Share2 className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            <span className={`text-xs md:text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Share</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-black'}`}>
      {/* Category Section */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-1 mb-1 shadow-sm border transition-all duration-300`}>
        {/* Category Header with Toggle */}
        <div className="flex items-center justify-between ml-4">
          <h2 className={`text-base font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
            Categories
          </h2>
          <button
            onClick={() => setShowCategories(!showCategories)}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-300' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            aria-label={showCategories ? 'Hide categories' : 'Show categories'}
          >
            {showCategories ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
        
        {/* Category Cards with Animation */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showCategories ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex overflow-x-auto space-x-3 md:space-x-4 pb-2 no-scrollbar">
            {categories.map((category, index) => (
              <div key={index} className="flex-shrink-0">
                <CategoryCard category={category} index={index} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="posts-container flex-1 overflow-y-auto space-y-3 md:space-y-4 pb-20 lg:pb-6 px-2 md:px-0 no-scrollbar">
        {loading ? (
          // Loading state
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className={`w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Loading posts...</p>
            </div>
          </div>
        ) : error ? (
          // Error state
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className={`w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium mb-2`}>Something went wrong</p>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm mb-4`}>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : posts.length === 0 ? (
          // Empty state
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className={`w-16 h-16 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <MessageSquare className={`w-8 h-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium mb-2`}>No posts yet</p>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Be the first to share your work!</p>
            </div>
          </div>
        ) : (
          <>
            {/* Posts list */}
            {posts
              .filter(post => !hiddenPosts.has(post.id)) // Filter out hidden posts
              .map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            }
            
            {/* Loading more indicator */}
            {loadingMore && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className={`w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2`}></div>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>Loading more posts...</p>
                </div>
              </div>
            )}
            
            {/* No more posts indicator */}
            {!hasMore && posts.length > 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className={`w-10 h-10 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <span className="text-2xl">✨</span>
                  </div>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}>You're all caught up!</p>
                  <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-500'} text-xs mt-1`}>No more posts to show</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Full Screen Post View */}
      {selectedPost && (
        <div className={`fixed inset-0 z-50 flex flex-col animate-in slide-in-from-bottom duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          {/* Header Bar */}
          <div className={`flex items-center justify-between p-3 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center space-x-3">
              <img
                src={selectedPost.avatar}
                alt={selectedPost.author}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
              />
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} text-sm md:text-base`}>{selectedPost.author}</h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs md:text-sm`}>{selectedPost.profession} • {selectedPost.location} • {selectedPost.timeAgo}</p>
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
              {selectedPost.media.length > 1 && currentImageIndex > 0 && (
                <button
                  onClick={prevImage}
                  className="absolute left-2 md:left-4 z-10 bg-black bg-opacity-50 text-white p-2 md:p-3 rounded-full hover:bg-opacity-70 transition-all duration-200"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              )}
              
              {/* Current media item */}
              {selectedPost.media[currentImageIndex]?.fileType === 'video' ? (
                <video
                  src={selectedPost.media[currentImageIndex]?.url}
                  className="max-h-full max-w-full object-contain"
                  controls
                  autoPlay
                />
              ) : (
                <img
                  src={selectedPost.media[currentImageIndex]?.url}
                  alt={selectedPost.imageAlt}
                  className="max-h-full max-w-full object-contain"
                />
              )}
              
              {selectedPost.media.length > 1 && currentImageIndex < selectedPost.media.length - 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-2 md:right-4 z-10 bg-black bg-opacity-50 text-white p-2 md:p-3 rounded-full hover:bg-opacity-70 transition-all duration-200"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              )}

              {/* Media Counter */}
              {selectedPost.media.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-medium">
                  {currentImageIndex + 1} / {selectedPost.media.length}
                </div>
              )}

              {/* Media Thumbnails - Hidden on mobile, visible on tablet+ */}
              {selectedPost.media.length > 1 && (
                <div className="hidden md:flex absolute bottom-4 right-4 space-x-2">
                  {selectedPost.media.map((mediaItem, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        index === currentImageIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-80'
                      }`}
                    >
                      {mediaItem.fileType === 'video' ? (
                        <video
                          src={mediaItem.url}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                      ) : (
                        <img
                          src={mediaItem.url}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Post Details & Comments Section - Bottom on mobile, right side on desktop */}
            <div className={`w-full lg:w-96 flex flex-col border-t lg:border-t-0 lg:border-l ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} max-h-[40vh] lg:max-h-none`}>
              {/* Post Description */}
              <div className={`p-3 md:p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <div>
                  <div 
                    className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-sm md:text-base leading-relaxed`}
                    dangerouslySetInnerHTML={{ 
                      __html: formatDescription(
                        selectedPost.description, 
                        selectedPost.id, 
                        expandedPosts.has(selectedPost.id)
                      ) 
                    }}
                  />
                  {/* See more/See less button in modal */}
                  {selectedPost.description && selectedPost.description.split('\n').length > 5 && (
                    <button
                      onClick={() => togglePostExpansion(selectedPost.id)}
                      className={`mt-2 text-sm md:text-base font-medium transition-colors duration-200 ${
                        isDarkMode 
                          ? 'text-blue-400 hover:text-blue-300' 
                          : 'text-blue-600 hover:text-blue-700'
                      }`}
                    >
                      {expandedPosts.has(selectedPost.id) ? 'See less' : 'See more...'}
                    </button>
                  )}
                </div>
                
                {/* Post Stats */}
                <div className={`flex items-center justify-between mt-3 md:mt-4 text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span>{selectedPost.likes} likes</span>
                  <span>{selectedPost.comments + (comments[selectedPost.id] || []).length} comments</span>
                </div>

                {/* Action Buttons */}
                <div className={`flex items-center justify-between mt-3 pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <button 
                    type="button"
                    onClick={(e) => handleLike(selectedPost.id, e)}
                    className={`flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-2 rounded-lg transition-colors duration-200 flex-1 justify-center ${
                      likedPosts.has(selectedPost.id)
                        ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
                        : isDarkMode 
                          ? 'hover:bg-gray-700' 
                          : 'hover:bg-gray-50'
                    }`}
                  >
                    <Heart className={`w-4 h-4 md:w-5 md:h-5 ${
                      likedPosts.has(selectedPost.id) 
                        ? 'text-red-600 fill-current dark:text-red-400' 
                        : isDarkMode 
                          ? 'text-gray-300' 
                          : 'text-gray-600'
                    }`} />
                    <span className={`font-medium text-xs md:text-sm ${
                      likedPosts.has(selectedPost.id)
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
                  onClick={() => {
                      if (navigator.share) {
                        navigator
                          .share({
                            title: "Check this out!",
                            text: "Here’s a cool thing I wanted to share with you.",
                            url: window.location.href, // current page link
                          })
                          .then(() => console.log("Shared successfully"))
                          .catch((error) => console.log("Error sharing:", error));
                      } else {
                        // fallback for browsers without Web Share API
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied to clipboard!");
                      }
                    }}>
                    <Share2 className={`w-4 h-4 md:w-5 md:h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    <span className={`font-medium text-xs md:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Share</span>
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="flex-1 overflow-y-auto p-2 md:p-3 space-y-3 md:space-y-4 no-scrollbar">
                <h4 className={`font-semibold mb-2 md:mb-3 text-sm md:text-base ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Comments</h4>
                
                {loadingComments ? (
                  <div className="text-center py-6 md:py-8">
                    <div className={`w-6 h-6 md:w-8 md:h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2 ${isDarkMode ? 'border-gray-400' : 'border-gray-300'}`}></div>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm md:text-base`}>Loading comments...</p>
                  </div>
                ) : (comments[selectedPost.id] || []).length === 0 ? (
                  <div className="text-center py-6 md:py-8">
                    <MessageSquare className={`w-8 h-8 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm md:text-base`}>No comments yet</p>
                    <p className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-xs md:text-sm`}>Be the first to comment!</p>
                  </div>
                ) : (
                  (comments[selectedPost.id] || []).map((comment) => (
                    <div key={comment.id} className="flex space-x-2 md:space-x-3">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="w-7 h-7 md:w-9 md:h-9 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-2xl px-3 md:px-4 py-2 md:py-3`}>
                          <p className={`font-semibold text-xs md:text-sm ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{comment.author}</p>
                          <p className={`text-xs md:text-sm mt-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{comment.text}</p>
                        </div>
                        <div className={`flex items-center space-x-4 mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <span>{comment.timeAgo}</span>
                          <button className={`font-medium ${isDarkMode ? 'hover:text-gray-200' : 'hover:text-gray-700'}`}>Like</button>
                          <button className={`font-medium ${isDarkMode ? 'hover:text-gray-200' : 'hover:text-gray-700'}`}>Reply</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment */}
              <div className={`p-3 md:p-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                <div className="flex space-x-2 md:space-x-3">
                  <img
                    src={user?.profilePicture || DEFAULT_AVATAR}
                    alt={`${user?.firstName || 'You'} ${user?.lastName || ''}`}
                    className="w-7 h-7 md:w-9 md:h-9 rounded-full object-cover flex-shrink-0"
                    onError={(e) => {
                      e.target.src = DEFAULT_AVATAR;
                    }}
                  />
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className={`flex-1 px-3 md:px-4 py-2 md:py-3 rounded-full text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-black placeholder-gray-500'}`}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment(selectedPost.id)}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddComment(selectedPost.id)}
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
      )}
    </div>
  );
}