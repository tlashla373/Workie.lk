import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Share,
  Upload,
  Plus
} from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import profileService from '../services/profileService';

// Photos Tab Component
const PhotosTab = ({ profileData, isDarkMode }) => {
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        
        if (profileData?.profile?.portfolio && profileData.profile.portfolio.length > 0) {
          // Use portfolio from profileData if available
          setPortfolioItems(profileData.profile.portfolio);
        } else {
          // Fallback to API call if not available in props
          const response = await profileService.getCurrentUserProfile();
          if (response.success && response.data.profile?.portfolio) {
            setPortfolioItems(response.data.profile.portfolio);
          } else {
            setPortfolioItems([]);
          }
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        setError('Failed to load portfolio');
        setPortfolioItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [profileData]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="aspect-square bg-gray-300 animate-pulse rounded-lg"></div>
        ))}
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

  if (portfolioItems.length === 0) {
    return (
      <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <Upload className="w-16 h-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium mb-2">No Portfolio Items Yet</p>
        <p className="mb-4">Start showcasing your work by adding portfolio items</p>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Portfolio Item
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {portfolioItems.map((item, index) => (
        <div key={item._id || index} className="relative group overflow-hidden rounded-lg aspect-square">
          {item.images && item.images.length > 0 ? (
            <img
              src={item.images[0]}
              alt={item.title || `Portfolio ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Upload className="w-12 h-12 text-gray-400" />
            </div>
          )}
          
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
          
          {item.title && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <h3 className="text-white font-medium text-sm">{item.title}</h3>
              {item.category && (
                <p className="text-white/80 text-xs">{item.category}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PhotosTab;