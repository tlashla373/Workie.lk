import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Share,
  Upload,
  Plus
} from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import profileService from '../../services/profileService';
import postService from '../../services/postService';
import { useAuth } from '../../hooks/useAuth';

// Photos Tab Component
const PhotosTab = ({ profileData, isDarkMode, isOwnProfile, userId }) => {
  const { user } = useAuth();
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('all'); // 'all', 'portfolio', 'posts'

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
          <div key={item.id} className="relative group overflow-hidden rounded-lg aspect-square">
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
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors">
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
    </div>
  );
};

export default PhotosTab;
