import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Video,
  Image,
  Smile,
  MapPin,
  Users,
  Tag,
  Globe,
  Lock,
  Users2,
  X,
  Plus,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  AlertCircle,
  Upload,
  CheckCircle
} from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useAuth } from '../../hooks/useAuth';
import postService from '../../services/postService';
import { toast } from 'react-toastify';


const AddPostPage = () => {
  const { user, authenticated, authLoading } = useAuth();
  const { isDarkMode } = useDarkMode();
  
  const [postText, setPostText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [privacy, setPrivacy] = useState('public');
  const [location, setLocation] = useState('');
  const [taggedFriends, setTaggedFriends] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [mutedVideos, setMutedVideos] = useState(new Set());
  const [showMaxFilesWarning, setShowMaxFilesWarning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  
  const fileInputRef = useRef(null);
  const videoRefs = useRef({});

  const MAX_FILES = 5;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !authenticated) {
      // Redirect to login page
      window.location.href = '/loginpage';
    }
  }, [authenticated, authLoading]);

  // Get user display info
  const getUserDisplayInfo = () => {
    if (!user) return { name: 'User', avatar: '/default-avatar.png', role: 'user' };
    
    const firstName = user.firstName || user.name?.split(' ')[0] || 'User';
    const lastName = user.lastName || user.name?.split(' ')[1] || '';
    const fullName = `${firstName} ${lastName}`.trim();
    
    // Get profile picture URL
    const avatar = user.profilePicture || 
                  user.avatar || 
                  user.profilePic ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=2563eb&color=fff&size=40`;
    
    const role = user.role || user.userType || 'worker';
    
    return { name: fullName, avatar, role };
  };

  const { name: userName, avatar: userAvatar, role: userRole } = getUserDisplayInfo();

  // Debug logging for user data
  useEffect(() => {
    if (user) {
      console.log('Current logged in user:', {
        id: user.id || user._id,
        name: userName,
        email: user.email,
        role: userRole,
        hasProfilePicture: !!user.profilePicture
      });
    }
  }, [user, userName, userRole]);

  const privacyOptions = [
    { value: 'public', label: 'Public', icon: Globe, description: 'Anyone on or off Workie.LK' },
    { value: 'friends', label: 'Friends', icon: Users, description: 'Your friends on Workie.LK' },
    { value: 'private', label: 'Only me', icon: Lock, description: 'Only you' }
  ];

  const emojis = ['😀', '😂', '😍', '😊', '😢', '😮', '😡', '👍', '❤️', '🎉', '🔥', '💪', '👏', '🙌'];

  const handleFileSelect = (files) => {
    if (!files || files.length === 0) return;
    
    const fileArray = Array.from(files);
    const remainingSlots = MAX_FILES - selectedFiles.length;
    
    if (remainingSlots <= 0) {
      setShowMaxFilesWarning(true);
      setTimeout(() => setShowMaxFilesWarning(false), 3000);
      return;
    }

    const validFiles = fileArray.slice(0, remainingSlots).filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB limit
      return (isImage || isVideo) && isValidSize;
    });

    const fileObjects = validFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video',
      id: Math.random().toString(36).substr(2, 9)
    }));

    if (fileArray.length > remainingSlots) {
      setShowMaxFilesWarning(true);
      setTimeout(() => setShowMaxFilesWarning(false), 3000);
    }

    setSelectedFiles(prev => [...prev, ...fileObjects]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (id) => {
    setSelectedFiles(prev => {
      const updated = prev.filter(file => file.id !== id);
      // Clean up object URLs
      const removed = prev.find(file => file.id === id);
      if (removed) {
        URL.revokeObjectURL(removed.url);
      }
      return updated;
    });
  };

  const clearAllFiles = () => {
    selectedFiles.forEach(file => URL.revokeObjectURL(file.url));
    setSelectedFiles([]);
  };

  const toggleVideoPlay = (id) => {
    const video = videoRefs.current[id];
    if (video) {
      if (video.paused) {
        video.play();
        setPlayingVideo(id);
      } else {
        video.pause();
        setPlayingVideo(null);
      }
    }
  };

  const toggleVideoMute = (id) => {
    const video = videoRefs.current[id];
    if (video) {
      video.muted = !video.muted;
      setMutedVideos(prev => {
        const updated = new Set(prev);
        if (video.muted) {
          updated.add(id);
        } else {
          updated.delete(id);
        }
        return updated;
      });
    }
  };

  const addEmoji = (emoji) => {
    setPostText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleSubmit = async () => {
    if (!postText.trim() && selectedFiles.length === 0) {
      toast.error('Please add some content or media to your post');
      return;
    }
    
    if (!authenticated || !user) {
      toast.error('You must be logged in to create a post');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus('Preparing post...');
    
    try {
      console.log('Creating post for user:', userName);
      
      // Prepare post data
      const postData = {
        text: postText,
        files: selectedFiles,
        privacy,
        location,
        taggedFriends,
        userId: user.id || user._id,
        userEmail: user.email
      };
      
      // Update status for media upload
      if (selectedFiles.length > 0) {
        setUploadStatus(`Uploading ${selectedFiles.length} file(s) ...`);
      }
      
      // Create post with Cloudinary integration
      const response = await postService.createPost(postData);
      
      console.log('Post created successfully:', response);
      
      setUploadProgress(100);
      setUploadStatus('Post created successfully!');
      
      // Show success message
      setTimeout(() => {
        toast.success(`Post created successfully! ${response.mediaUploaded}`);
        
        // Reset form
        setPostText('');
        selectedFiles.forEach(file => URL.revokeObjectURL(file.url));
        setSelectedFiles([]);
        setLocation('');
        setTaggedFriends([]);
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStatus('');
        
        // Optionally redirect to feed or profile
        // window.location.href = '/feed';
      }, 1000);
      
    } catch (error) {
      console.error('Error creating post:', error);
      
      setUploadStatus('Upload failed');
      setIsUploading(false);
      setUploadProgress(0);
      
      // Show detailed error message
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create post. Please try again.';
      toast.error(`Error: ${errorMessage}`);
    }
  };

  const canAddMoreFiles = selectedFiles.length < MAX_FILES;
  const remainingSlots = MAX_FILES - selectedFiles.length;

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Loading...</p>
        </div>
      </div>
    );
  }

  // Show message if not authenticated
  if (!authenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">
          <p className={`text-lg mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Please log in to create a post
          </p>
          <button
            onClick={() => window.location.href = '/loginpage'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-2 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50'}`}>
      <div className="w-full mx-auto">
        {/* Max Files Warning */}
        {showMaxFilesWarning && (
          <div className="mb-4 p-4 bg-orange-100 border border-orange-200 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
            <div>
              <p className="text-orange-800 font-medium">Maximum files reached</p>
              <p className="text-orange-700 text-sm">You can only upload up to {MAX_FILES} images or videos per post.</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className={`rounded-lg shadow-md mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h1 className={`text-xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Create Post</h1>
          </div>
          
          {/* User Info */}
          <div className="p-4">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={userAvatar}
                alt={`${userName}'s profile`}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=2563eb&color=fff&size=40`;
                }}
              />
              <div>
                <p className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {userName}
                  {userRole && (
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      userRole === 'employer' 
                        ? 'bg-blue-100 text-blue-800' 
                        : userRole === 'worker'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {userRole}
                    </span>
                  )}
                </p>
                <select
                  value={privacy}
                  onChange={(e) => setPrivacy(e.target.value)}
                  className={`text-sm rounded px-2 py-1 border-none outline-none ${isDarkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-gray-100'}`}
                >
                  {privacyOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Text Input */}
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder={`What's on your mind, ${userName.split(' ')[0]}?`}
              className={`w-full p-3 text-lg border-none outline-none resize-none min-h-[120px] ${isDarkMode ? 'bg-gray-800 text-gray-100 placeholder-gray-400' : 'bg-white text-gray-900 placeholder-gray-500'}`}
              rows="4"
            />

            {/* Media Upload Area */}
            {selectedFiles.length === 0 && (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                  isDragOver 
                    ? 'border-blue-500 bg-blue-50'
                    : isDarkMode
                      ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                      : 'border-gray-300 hover:border-gray-400'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex space-x-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-100">
                      <Image className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100">
                      <Video className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Add photos/videos</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>or drag and drop (max {MAX_FILES} files)</p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </div>
            )}

            {/* Media Preview */}
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <p className={`font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      Media ({selectedFiles.length}/{MAX_FILES})
                    </p>
                    {selectedFiles.length >= MAX_FILES && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                        Maximum reached
                      </span>
                    )}
                  </div>
                  
                  {/* Enhanced Add More Button Area */}
                  <div className="flex items-center space-x-2">
                    {canAddMoreFiles ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg hover:scale-105"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-sm font-medium">Add more</span>
                        </button>
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                          {remainingSlots} left
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          disabled
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg cursor-not-allowed opacity-60 bg-gray-200 text-gray-500"
                        >
                          <X className="w-4 h-4" />
                          <span className="text-sm">Limit reached</span>
                        </button>
                        <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                          {MAX_FILES}/{MAX_FILES}
                        </span>
                      </div>
                    )}
                    
                    <button
                      onClick={clearAllFiles}
                      className="flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors text-xs bg-red-100 hover:bg-red-200 text-red-600"
                      title="Remove all media"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear all</span>
                    </button>
                  </div>
                </div>
                
                {/* Media Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedFiles.map((file, index) => (
                    <div key={file.id} className="relative group">
                      {/* File Counter Badge */}
                      <div className="absolute top-2 left-2 z-10 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                        {index + 1}/{selectedFiles.length}
                      </div>
                      
                      {file.type === 'image' ? (
                        <div className="relative overflow-hidden rounded-lg">
                          <img
                            src={file.url}
                            alt="Upload preview"
                            className="w-full h-32 object-cover transition-transform group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg"></div>
                        </div>
                      ) : (
                        <div className="relative overflow-hidden rounded-lg">
                          <video
                            ref={(el) => {
                              if (el) videoRefs.current[file.id] = el;
                            }}
                            src={file.url}
                            className="w-full h-32 object-cover"
                            muted
                            loop
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <button
                              onClick={() => toggleVideoPlay(file.id)}
                              className="w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 transition-all hover:scale-110"
                            >
                              {playingVideo === file.id ? (
                                <Pause className="w-6 h-6 text-white" />
                              ) : (
                                <Play className="w-6 h-6 text-white ml-1" />
                              )}
                            </button>
                          </div>
                          <button
                            onClick={() => toggleVideoMute(file.id)}
                            className="absolute bottom-2 right-8 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 transition-all"
                          >
                            {mutedVideos.has(file.id) ? (
                              <VolumeX className="w-4 h-4 text-white" />
                            ) : (
                              <Volume2 className="w-4 h-4 text-white" />
                            )}
                          </button>
                        </div>
                      )}
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFile(file.id)}
                        className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:scale-110 shadow-lg z-10"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Hidden input for adding more files */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className={`mt-4 p-3 border rounded-lg ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>Add to your post</p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => canAddMoreFiles && fileInputRef.current?.click()}
                  disabled={!canAddMoreFiles}
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                    canAddMoreFiles
                      ? 'bg-green-600 hover:bg-green-700 hover:scale-110 shadow-lg hover:shadow-green-500/25'
                      : 'bg-gray-300 cursor-not-allowed opacity-50'
                  }`}
                  title={canAddMoreFiles ? `Add Photo/Video (${remainingSlots} slots left)` : `Maximum ${MAX_FILES} files reached`}
                >
                  {canAddMoreFiles ? (
                    <Plus className="w-5 h-5 text-white" />
                  ) : (
                    <X className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-colors bg-yellow-100 hover:bg-yellow-200"
                  title="Feeling/Activity"
                >
                  <Smile className="w-5 h-5 text-yellow-600" />
                </button>
                
                <button 
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-colors bg-red-100 hover:bg-red-200"
                  title="Check in"
                >
                  <MapPin className="w-5 h-5 text-red-600" />
                </button>
                
                <button 
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-colors bg-blue-100 hover:bg-blue-200"
                  title="Tag people"
                >
                  <Users className="w-5 h-5 text-blue-600" />
                </button>
              </div>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div className={`mt-3 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="grid grid-cols-7 gap-2">
                    {emojis.map((emoji, index) => (
                      <button
                        key={index}
                        onClick={() => addEmoji(emoji)}
                        className={`w-8 h-8 flex items-center justify-center rounded text-lg transition-colors ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Location Input */}
            {location !== null && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Where are you?"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full p-3 border rounded-lg outline-none transition-colors ${isDarkMode ? 'border-gray-700 bg-gray-800 text-gray-100 placeholder-gray-400 focus:border-blue-500' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:border-blue-500'}`}
                />
              </div>
            )}

            {/* Upload Progress */}
            {isUploading && (
              <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-blue-50 border border-blue-200'}`}>
                <div className="flex items-center space-x-3 mb-3">
                  <Upload className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} animate-bounce`} />
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-blue-800'}`}>
                    {uploadStatus}
                  </p>
                </div>
                
                {uploadProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
                
                {uploadProgress === 100 && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Upload completed!</span>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={(!postText.trim() && selectedFiles.length === 0) || isUploading}
              className={`w-full mt-4 py-3 font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                (!postText.trim() && selectedFiles.length === 0) || isUploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:scale-[1.02]'
              }`}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>
                    {selectedFiles.length > 0 ? 'Uploading...' : 'Creating Post...'}
                  </span>
                </>
              ) : (
                <>
                  <span>Post</span>
                  {selectedFiles.length > 0 && (
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                      +{selectedFiles.length} media
                    </span>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPostPage;