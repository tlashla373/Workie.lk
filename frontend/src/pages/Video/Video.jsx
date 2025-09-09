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
  Bookmark
} from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';

const Video = () => {
  const { isDarkMode } = useDarkMode();
  const [currentVideo, setCurrentVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [likedVideos, setLikedVideos] = useState([]);
  const [savedVideos, setSavedVideos] = useState([]);
  const videoRefs = useRef([]);
  const containerRef = useRef(null);

  const videos = [
    {
      id: 1,
      title: "Web Development Tips for Beginners",
      description: "Learn the essential skills every web developer should know. From HTML basics to advanced JavaScript concepts, this video covers everything you need to start your coding journey.",
      creator: "CodeMaster Pro",
      avatar: "CM",
      verified: true,
      likes: 1234,
      comments: 89,
      views: "15.2K",
      duration: "12:45",
      category: "Education",
      thumbnail: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: 2,
      title: "Freelancing Success Stories",
      description: "Real stories from successful freelancers who built their careers from scratch. Get inspired and learn practical tips for growing your freelance business.",
      creator: "FreelanceGuru",
      avatar: "FG",
      verified: true,
      likes: 892,
      comments: 156,
      views: "8.7K",
      duration: "18:30",
      category: "Career",
      thumbnail: "https://images.pexels.com/photos/3184302/pexels-photo-3184302.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: 3,
      title: "Remote Work Setup Guide",
      description: "Create the perfect home office setup for maximum productivity. From ergonomic chairs to lighting setups, everything you need for remote work success.",
      creator: "WorkFromHome",
      avatar: "WH",
      verified: false,
      likes: 567,
      comments: 43,
      views: "5.1K",
      duration: "9:15",
      category: "Lifestyle",
      thumbnail: "https://images.pexels.com/photos/4491459/pexels-photo-4491459.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: 4,
      title: "UI/UX Design Trends 2024",
      description: "Explore the latest design trends that are shaping the digital landscape. Learn about color schemes, typography, and user experience best practices.",
      creator: "DesignStudio",
      avatar: "DS",
      verified: true,
      likes: 2103,
      comments: 234,
      views: "22.4K",
      duration: "15:22",
      category: "Design",
      thumbnail: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800"
    },
    {
      id: 5,
      title: "Mobile App Development Journey",
      description: "Follow a complete mobile app development process from idea to app store. Learn about React Native, deployment, and user feedback integration.",
      creator: "AppDev Academy",
      avatar: "AD",
      verified: true,
      likes: 1876,
      comments: 167,
      views: "19.8K",
      duration: "25:40",
      category: "Technology",
      thumbnail: "https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=800"
    }
  ];

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
        setIsPlaying(false);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentVideo]);

  const togglePlay = () => {
    const video = videoRefs.current[currentVideo];
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
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

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-opacity-80 border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4">
          <h1 className={`text-xl sm:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Discover Videos
          </h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1 text-sm sm:text-base`}>
            Educational content for your career growth
          </p>
        </div>

        {/* Video Feed */}
        <div 
          ref={containerRef}
          className="h-screen overflow-y-auto snap-y snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {videos.map((video, index) => (
            <div key={video.id} className="h-screen snap-start relative flex flex-col lg:flex-row">
              {/* Video Player */}
              <div className="flex-1 relative bg-black">
                <div className="h-full w-full flex items-center justify-center p-2 sm:p-4 lg:p-0">
                  <div className="relative w-full max-w-full lg:max-w-2xl aspect-video">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>
                    
                    {/* Play/Pause Button */}
                    <button
                      onClick={togglePlay}
                      className="absolute inset-0 flex items-center justify-center text-white hover:bg-black hover:bg-opacity-20 transition-all duration-200 rounded-lg"
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all duration-200">
                        {isPlaying && index === currentVideo ? (
                          <Pause className="w-6 h-6 sm:w-8 sm:h-8 ml-1" />
                        ) : (
                          <Play className="w-6 h-6 sm:w-8 sm:h-8 ml-1" />
                        )}
                      </div>
                    </button>

                    {/* Video Controls */}
                    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 flex items-center space-x-2">
                      <button
                        onClick={toggleMute}
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-black bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all duration-200"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </button>
                      <span className="text-white text-xs sm:text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
                        {video.duration}
                      </span>
                    </div>

                    {/* Video hidden element for future functionality */}
                    <video
                      ref={(el) => (videoRefs.current[index] = el)}
                      className="hidden"
                      loop
                      playsInline
                    />
                  </div>
                </div>
              </div>

              {/* Video Info Sidebar */}
              <div className={`w-full lg:w-96 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-t lg:border-t-0 lg:border-l ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex flex-col transition-colors duration-300 max-h-full lg:max-h-screen overflow-hidden`}>
                <div className="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
                  {/* Creator Info */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${isDarkMode ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-blue-400 to-purple-500'} rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base`}>
                      {video.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-semibold text-sm sm:text-base truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {video.creator}
                        </h3>
                        {video.verified && <Verified className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />}
                      </div>
                      <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {video.views} views
                      </p>
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
                          onClick={() => toggleLike(video.id)}
                          className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 ${
                            likedVideos.includes(video.id)
                              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                              : isDarkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${likedVideos.includes(video.id) ? 'fill-current' : ''}`} />
                          <span className="text-xs sm:text-sm font-medium">{video.likes + (likedVideos.includes(video.id) ? 1 : 0)}</span>
                        </button>

                        <button className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                          <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-xs sm:text-sm font-medium">{video.comments}</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleSave(video.id)}
                          className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                            savedVideos.includes(video.id)
                              ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : isDarkMode 
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <Bookmark className={`w-4 h-4 sm:w-5 sm:h-5 ${savedVideos.includes(video.id) ? 'fill-current' : ''}`} />
                        </button>

                        <button className={`p-1.5 sm:p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}>
                          <Share className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="space-y-4">
                    <h4 className={`font-semibold text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Comments</h4>
                    
                    {/* Sample Comments */}
                    <div className="space-y-3">
                      <div className="flex space-x-2 sm:space-x-3">
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 ${isDarkMode ? 'bg-green-600' : 'bg-green-500'} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                          JD
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`text-xs sm:text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>John Doe</span>
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex-shrink-0`}>2h ago</span>
                          </div>
                          <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                            Great video! Really helpful for beginners like me.
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <button className={`text-xs ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'} flex items-center space-x-1`}>
                              <ThumbsUp className="w-3 h-3" />
                              <span>12</span>
                            </button>
                            <button className={`text-xs ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'}`}>
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2 sm:space-x-3">
                        <div className={`w-6 h-6 sm:w-8 sm:h-8 ${isDarkMode ? 'bg-purple-600' : 'bg-purple-500'} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                          SM
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`text-xs sm:text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Sarah Miller</span>
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex-shrink-0`}>5h ago</span>
                          </div>
                          <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
                            Thanks for sharing! Could you make a video about advanced topics too?
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <button className={`text-xs ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'} flex items-center space-x-1`}>
                              <ThumbsUp className="w-3 h-3" />
                              <span>8</span>
                            </button>
                            <button className={`text-xs ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'}`}>
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Add Comment */}
                    <div className="flex space-x-2 sm:space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className={`w-6 h-6 sm:w-8 sm:h-8 ${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        SH
                      </div>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Video;