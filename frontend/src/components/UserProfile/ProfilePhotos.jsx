import React, { useState, useEffect } from 'react';
import { Heart, Share, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock photos array for fallback
const mockPhotos = [
  'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1565008576018-969c8ac78450?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1609205258346-d940fcd6ff6a?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=400&fit=crop'
];

const ProfilePhotos = ({ photos = [], isDarkMode = false, profileData }) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Default profile data if not provided
  const defaultProfile = {
    name: "User",
    profession: "Photographer",
    location: "Location",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  };

  const profile = profileData || defaultProfile;

  const displayPhotos = photos.length > 0 ? photos : mockPhotos;

  const handlePhotoClick = (index) => {
    setSelectedPhotoIndex(index);
    setCurrentImageIndex(index);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setSelectedPhotoIndex(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'unset'; // Restore background scrolling
  };

  const nextImage = () => {
    if (currentImageIndex < displayPhotos.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleKeyPress = (e) => {
    if (selectedPhotoIndex !== null) {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    }
  };

  // keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset'; // Cleanup on unmount
    };
  }, [selectedPhotoIndex, currentImageIndex]);

  return (
    <div className="w-full">
      {/* Photos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayPhotos.map((photo, index) => (
          <div 
            key={index} 
            className="relative group overflow-hidden rounded-lg aspect-square cursor-pointer"
            onClick={() => handlePhotoClick(index)}
          >
            <img
              src={photo}
              alt={`Portfolio ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                <button 
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle like action
                  }}
                >
                  <Heart className="w-5 h-5" />
                </button>
                <button
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                  
                    if (navigator.share) {
                      navigator
                        .share({
                          title: "Check this out!",
                          text: "Here's a cool portfolio photo I found.",
                          url: window.location.href, // Share the current page URL
                        })
                        .then(() => console.log("Shared successfully"))
                        .catch((error) => console.log("Error sharing:", error));
                    } else {
                      // Fallback for browsers that don't support Web Share API
                      navigator.clipboard.writeText(window.location.href);
                      alert("Link copied to clipboard!");
                    }
                  }}
                    >               
                  <Share className="w-5 h-5" />
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Full Screen Photo View Modal */}
      {selectedPhotoIndex !== null && (
        <div className={`fixed inset-0 z-50 flex flex-col animate-in slide-in-from-bottom duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
          {/* Header Bar */}
          <div className={`flex items-center justify-between p-2 border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center space-x-2">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{profile.name}</h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{profile.profession} • {profile.location}</p>
              </div>
            </div>
            <button
              onClick={closeModal}
              className={`p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}
            >
              <X className={`w-6 h-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Side - Image Display */}
            <div className="flex-1 bg-black flex h-150 items-center justify-center relative">
              {/* Previous Image Button */}
              {displayPhotos.length > 1 && currentImageIndex > 0 && (
                <button
                  onClick={prevImage}
                  className="absolute left-4 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              
              {/* Main Image */}
              <img
                src={displayPhotos[currentImageIndex]}
                alt={`Portfolio ${currentImageIndex + 1}`}
                className="h-full w-full object-contain"
              />
              
              {/* Next Image Button */}
              {displayPhotos.length > 1 && currentImageIndex < displayPhotos.length - 1 && (
                <button
                  onClick={nextImage}
                  className="absolute right-4 z-10 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all duration-200"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}

              {/* Image Counter */}
              {displayPhotos.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {currentImageIndex + 1} / {displayPhotos.length}
                </div>
              )}

              {/* Image Thumbnails */}
              {displayPhotos.length > 1 && (
                <div className="absolute bottom-4 right-4 flex space-x-2 max-w-96 overflow-x-auto">
                  {displayPhotos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 ${
                        index === currentImageIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-80'
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Side - Photo Details & Actions */}
            <div className={`w-96 flex flex-col border-l overflow-y-auto ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              {/* Photo Details */}
              <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  Portfolio Image {currentImageIndex + 1}
                </h4>
                <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-800'} text-sm mb-4`}>
                  Professional photography showcase from {profile.name}'s portfolio collection.
                </p>
                
                {/* Photo Stats */}
                <div className={`flex items-center justify-between text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <span>124 likes</span>
                  <span>8 comments</span>
                </div>

                {/* Action Buttons */}
                <div className={`flex items-center justify-between mt-4 pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 flex-1 justify-center mr-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <Heart className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    <span className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Like</span>
                  </button>
                  <button
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 flex-1 justify-center ml-2 ${
                      isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      if (navigator.share) {
                        navigator
                          .share({
                            title: "Check this out!",
                            text: "Here's a cool thing I wanted to share with you.",
                            url: window.location.href, // current page link
                          })
                          .then(() => console.log("Shared successfully"))
                          .catch((error) => console.log("Error sharing:", error));
                      } else {
                        // fallback for browsers without Web Share API
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied to clipboard!");
                      }
                    }}
                  >
                    <Share
                      className={`w-5 h-5 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    />
                    <span
                      className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      Share
                    </span>
                  </button>

                </div>
              </div>

              {/* Related Photos */}
              <div className="flex-1 overflow-y-auto p-4">
                <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>More from Portfolio</h4>
                <div className="grid grid-cols-2 gap-2">
                  {displayPhotos
                    .filter((_, index) => index !== currentImageIndex)
                    .slice(0, 8)
                    .map((photo, index) => {
                      const originalIndex = displayPhotos.findIndex(p => p === photo);
                      return (
                        <button
                          key={originalIndex}
                          onClick={() => setCurrentImageIndex(originalIndex)}
                          className="aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
                        >
                          <img
                            src={photo}
                            alt={`Related ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotos;
