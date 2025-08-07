import React, { useState, useRef } from 'react';
import { Camera, Edit } from 'lucide-react';

const ProfileHeader = ({
  profileData,
  onCoverPhotoUpdate,
  onProfilePhotoUpdate,
  isDarkMode = false,
}) => {
  const [isEditingCover, setIsEditingCover] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);

  const handleCoverPhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onCoverPhotoUpdate(e.target.result);
          setIsEditingCover(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onProfilePhotoUpdate(e.target.result);
          setIsEditingProfile(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative h-80 overflow-hidden">
      <img
        src={profileData.coverImage}
        alt="Cover"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

      {/* Cover Actions */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <button
          onClick={() => coverInputRef.current?.click()}
          className="p-2 bg-black/20 backdrop-blur-sm rounded-lg text-white hover:bg-black/30 transition-colors"
        >
          <Camera className="w-5 h-5" />
        </button>
        <button
          onClick={() => setIsEditingCover(!isEditingCover)}
          className="px-4 py-2 bg-black/20 backdrop-blur-sm rounded-lg text-white hover:bg-black/30 transition-colors flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit Cover</span>
        </button>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        onChange={handleCoverPhotoChange}
        className="hidden"
      />
      <input
        ref={profileInputRef}
        type="file"
        accept="image/*"
        onChange={handleProfilePhotoChange}
        className="hidden"
      />

      {/* Profile Info Overlay */}
      <div className="absolute bottom-6 left-6 flex items-end space-x-4">
        <div className="relative">
          <img
            src={profileData.profileImage}
            alt={profileData.name}
            className="w-32 h-32 rounded-full border-4 border-white object-cover"
          />
          <button
            onClick={() => profileInputRef.current?.click()}
            className="absolute bottom-2 right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div className="text-white mb-4">
          <h1 className="text-3xl font-bold">{profileData.name}</h1>
          <p className="text-lg opacity-90">{profileData.profession}</p>
          <div className="flex items-center space-x-4 mt-2 text-sm opacity-80">
            <span>{profileData.followers} followers</span>
            <span>{profileData.following} following</span>
            <span>{profileData.posts} posts</span>
          </div>
        </div>
      </div>

      {/* Cover Photo Edit Options */}
      {isEditingCover && (
        <div className={`absolute top-16 right-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-2 min-w-48 transition-colors duration-300`}>
          <button
            onClick={() => coverInputRef.current?.click()}
            className={`w-full text-left px-3 py-2 ${isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'} rounded text-sm transition-colors`}
          >
            Upload Photo
          </button>
          <button
            onClick={() => {
              onCoverPhotoUpdate('https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800&h=300&fit=crop');
              setIsEditingCover(false);
            }}
            className={`w-full text-left px-3 py-2 ${isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'} rounded text-sm transition-colors`}
          >
            Choose from Photos
          </button>
          <button
            onClick={() => setIsEditingCover(false)}
            className={`w-full text-left px-3 py-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded text-sm text-red-600 transition-colors`}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
