import React, { useState, useEffect } from 'react';
import {
  Search,
  MessageCircle,
  Bell,
  User,
  Heart,
  MessageSquare,
  Share2,
  Briefcase,
  UserPlus,
  Settings,
  MoreHorizontal,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react';
import profileImage from '../assets/profile.jpeg';
import Logo from '../assets/Logo.png';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../contexts/DarkModeContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import profileService from '../services/profileService';
import notificationService from '../services/notificationService';

const UpperNavbar = ({ isCollapsed = false }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    profileImage: null,
    isActive: false
  });
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();
  const { user, authenticated } = useAuth() || {};

  // Helper function to get notification type icon
  const getNotificationTypeIcon = (type) => {
    switch(type) {
      case 'like':
      case 'post_like':
        return Heart;
      case 'comment':
      case 'post_comment':
        return MessageSquare;
      case 'job':
      case 'job_match':
      case 'job_application':
        return Briefcase;
      case 'friend':
      case 'friend_request':
      case 'connection':
        return UserPlus;
      case 'share':
      case 'post_share':
        return Share2;
      default:
        return Bell;
    }
  };

  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const toggleNotificationDropdown = () => setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
   const toggleMobileSearch = () => setIsMobileSearchOpen(!isMobileSearchOpen);

  // Fetch user data and notifications from database
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await profileService.getCurrentUserProfile();
        
        if (response.success) {
          const { user: userInfo, profile: profileInfo } = response.data;
          
          if (!userInfo) {
            console.warn('No user data received from API');
            return;
          }
          
          setUserData({
            firstName: userInfo?.firstName || profileInfo?.firstName || 'User',
            lastName: userInfo?.lastName || profileInfo?.lastName || '',
            profileImage: profileInfo?.profileImage || userInfo?.profileImage || userInfo?.profilePicture,
            isActive: userInfo?.isActive || false
          });
        } else {
          console.warn('API response indicated failure:', response);
        }
      } catch (error) {
        console.error('UpperNavbar: Error fetching user data:', error);
        
        // Handle authentication errors specifically
        if (error.message?.includes('Authentication')) {
          console.log('UpperNavbar: Authentication error detected');
          // Don't set default values for auth errors
          setUserData({
            firstName: '',
            lastName: '',
            profileImage: null,
            isActive: false
          });
        } else {
          // Set default values on other errors
          setUserData({
            firstName: 'User',
            lastName: '',
            profileImage: null,
            isActive: false
          });
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await notificationService.getNotifications();
        if (response.success) {
          // Map backend notification data to frontend format
          const mappedNotifications = response.data.notifications.map(notification => ({
            id: notification._id,
            type: notification.type,
            user: notification.sender ? `${notification.sender.firstName} ${notification.sender.lastName}` : 'System',
            action: notification.title,
            content: notification.message,
            time: new Date(notification.createdAt).toLocaleString(),
            unread: !notification.isRead,
            avatar: notification.sender?.profilePicture || profileImage,
            icon: getNotificationTypeIcon(notification.type)
          }));
          setNotifications(mappedNotifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // Fallback to mock data if API fails
        const mockNotifications = [
          {
            id: 1,
            type: 'like',
            user: 'John Smith',
            action: 'liked your post',
            content: 'Great work on the project!',
            time: '2 hours ago',
            unread: true,
            avatar: profileImage,
            icon: Heart
          },
          {
            id: 2,
            type: 'comment',
            user: 'Sarah Johnson',
            action: 'commented on your post',
            content: 'Looking forward to collaborating...',
            time: '4 hours ago',
            unread: true,
            avatar: profileImage,
            icon: MessageSquare
          }
        ];
        setNotifications(mockNotifications);
      }
    };

    fetchUserData();
    fetchNotifications();
  }, [refreshTrigger]);

  // Listen for profile updates
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'profileUpdated') {
        setRefreshTrigger(prev => prev + 1);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events
    const handleProfileUpdate = () => {
      setRefreshTrigger(prev => prev + 1);
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  // Computed values
  const displayName = userData.firstName && userData.lastName 
    ? `${userData.firstName} ${userData.lastName}` 
    : userData.firstName || 'User';
  
  // Multiple fallback paths for profile image
  const displayProfileImage = userData.profileImage || 
                              (user?.profileImage) || 
                              (user?.profilePicture) || 
                              profileImage;

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleMarkAllAsRead = async () => {
    try {
      const response = await notificationService.markAllAsRead();
      if (response.success) {
        // Update local state to reflect changes
        const updatedNotifications = notifications.map(n => ({ ...n, unread: false }));
        setNotifications(updatedNotifications);
      }
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      // Fallback: still update UI for better UX
      const updatedNotifications = notifications.map(n => ({ ...n, unread: false }));
      setNotifications(updatedNotifications);
    }
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && notification.unread) {
        await notificationService.markAsRead(notificationId);
        // Update local state
        const updatedNotifications = notifications.map(n => 
          n.id === notificationId ? { ...n, unread: false } : n
        );
        setNotifications(updatedNotifications);
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const pageTitles = {
    '/': 'Home',
    '/postjob': 'Post Job',
    '/post-job': 'Post Job',
    '/friends': 'Connections',
    '/notifications': 'Notifications',
    '/findjobs': 'Find Jobs',
    '/workhistory': 'Work Status',
    '/add-post': 'Create Post',
    '/video': 'Video',
    '/settings': 'Settings',
    '/logout': 'Log Out',
    '/workerprofile': 'Profile',
    '/clientprofile': 'Profile',
  };
  
  const currentPageTitle = pageTitles[location.pathname] || 'Dashboard';

  const getNotificationIcon = (type) => {
    const iconClass = `w-4 h-4 ${
      type === 'like' ? 'text-red-500' :
      type === 'comment' ? 'text-blue-500' :
      type === 'job' ? 'text-green-500' :
      type === 'friend' ? 'text-purple-500' :
      'text-gray-500'
    }`;
    
    switch(type) {
      case 'like': return <Heart className={iconClass} fill="currentColor" />;
      case 'comment': return <MessageSquare className={iconClass} />;
      case 'job': return <Briefcase className={iconClass} />;
      case 'friend': return <UserPlus className={iconClass} />;
      case 'share': return <Share2 className={iconClass} />;
      default: return <Bell className={iconClass} />;
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <header className={`hidden lg:flex h-full px-6 py-2 items-center border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-[#FFFFFF] border-gray-700/50'}`}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <h1 className={`text-xl alatsi-regular font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>{currentPageTitle}</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search for people, posts, or topics..."
                className={`w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-[#F0F3FF] border-gray-400/50 text-white placeholder-gray-400'}`}
              />
            </div>
          </div>

          {/* Right Actions - Only show when authenticated */}
          {authenticated && (
            <div className="flex items-center space-x-3 pl-4">
              <Link className="relative" to="/clientprofile">
                <button
                  className={`w-full flex items-center space-x-3 p-2 rounded-xl transition-all border duration-200 group ${isDarkMode ? 'bg-gray-700 border-gray-800 hover:bg-gray-600' : 'bg-[#F0F3FF] border-gray-300 hover:bg-gray-400/50'}`}
                >
                  <div className="relative">
                    {loading ? (
                      <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse"></div>
                    ) : (
                      <img
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                        src={displayProfileImage}
                        alt="Profile"
                        onError={(e) => {
                          // Try multiple fallback sources
                          if (e.target.src !== profileImage) {
                          if (userData.profileImage && e.target.src === userData.profileImage) {
                            e.target.src = user?.profileImage || user?.profilePicture || profileImage;
                          } else {
                            e.target.src = profileImage; // Final fallback
                          }
                        }
                      }}
                    />
                  )}
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-300 ${
                    userData.isActive ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                {(!isCollapsed || isProfileDropdownOpen) && (
                  <div className="flex-1 text-left">
                    {loading ? (
                      <div className="space-y-1">
                        <div className="h-4 bg-gray-300 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-300 rounded animate-pulse w-3/4"></div>
                      </div>
                    ) : (
                      <>
                        <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>
                          {displayName}
                        </p>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-200' : 'text-gray-500'}`}>
                          My Account
                        </p>
                      </>
                    )}
                  </div>
                )}
              </button>
            </Link>
            
            <button className={`p-2 rounded-xl transition-all duration-200 ${isDarkMode ? 'bg-gray-700/50 text-gray-100 hover:bg-gray-700 hover:text-white' : 'bg-gray-700/30 text-gray-100 hover:bg-gray-700/50 hover:text-white'}`}>
              <MessageCircle className="w-5 h-5" />
            </button>
            
            {/* Notifications Button with Dropdown */}
            <div className="relative">
              <button 
                onClick={toggleNotificationDropdown}
                className={`relative p-2 rounded-xl transition-all duration-200 ${isDarkMode ? 'bg-gray-700/50 text-gray-100 hover:bg-gray-700 hover:text-white' : 'bg-gray-700/30 text-gray-100 hover:bg-gray-700/50 hover:text-white'} ${isNotificationDropdownOpen ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-700/50') : ''}`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Desktop Notifications Dropdown */}
              {isNotificationDropdownOpen && (
                <div className={`absolute right-0 top-full mt-2 w-96 rounded-xl shadow-2xl border z-50 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                  {/* Header */}
                  <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Notifications
                      </h3>
                      <button 
                        onClick={handleMarkAllAsRead}
                        className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto no-scrollbar">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.id)}
                        className={`px-4 py-3 hover:bg-opacity-50 transition-colors cursor-pointer border-l-4 ${
                          notification.unread 
                            ? (isDarkMode ? 'bg-gray-700/30 border-blue-500 hover:bg-gray-700/50' : 'bg-blue-50 border-blue-500 hover:bg-blue-100') 
                            : (isDarkMode ? 'border-transparent hover:bg-gray-700/30' : 'border-transparent hover:bg-gray-50')
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          {/* Avatar with Icon Badge */}
                          <div className="relative flex-shrink-0">
                            <img
                              src={notification.avatar}
                              alt={notification.user}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} ring-2 ${isDarkMode ? 'ring-gray-800' : 'ring-white'}`}>
                              {getNotificationIcon(notification.type)}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                              <span className="font-semibold">{notification.user}</span>
                              <span className="ml-1">{notification.action}</span>
                            </div>
                            {notification.content && (
                              <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {notification.content}
                              </p>
                            )}
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              {notification.time}
                            </p>
                          </div>

                          {/* Unread Indicator */}
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                          )}

                          {/* More Options */}
                          <button className={`p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className={`px-4 py-3 border-t text-center ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button className={`text-sm font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}>
                      See all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          )}
        </div>
      </header>

      {/* Mobile Header */}
      <header className={`lg:hidden flex items-center justify-between px-4 py-3 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        {/* Mobile Search Mode */}
        {isMobileSearchOpen ? (
          <div className="flex items-center w-full space-x-3">
            <button 
              onClick={toggleMobileSearch}
              className={`p-2 rounded-lg ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                type="text"
                placeholder="Search..."
                autoFocus
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'}`}
              />
            </div>
          </div>
        ) : (
          <>
            {/* Left Side - Logo & Title */}
            <div className="flex items-center space-x-3">
              <img src={Logo} alt="Logo" className="w-8 h-8" />
              <div>
                <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {currentPageTitle}
                </h1>
              </div>
            </div>

            {/* Right Side - Actions */}
            <div className="flex items-center space-x-2">
              {/* Search Button */}
              <button 
                onClick={toggleMobileSearch}
                className={`p-2 rounded-lg ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Messages and Notifications - Only show when authenticated */}
              {authenticated && (
                <>
                  {/* Messages Button */}
                  <button className={`p-2 rounded-lg ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                    <MessageCircle className="w-5 h-5" />
                  </button>

                  {/* Notifications Button */}
                  <button 
                    onClick={toggleNotificationDropdown}
                    className={`relative p-2 rounded-lg ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
              </button>

              {/* Profile Button */}
              <Link to="/clientprofile">
                <button className={`p-1 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                  <div className="relative">
                    <img
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-300"
                      src={profileImage}
                      alt="Profile"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                </button>
              </Link>
                </>
              )}
            </div>
          </>
        )}
      </header>

      {/* Mobile Notifications Dropdown */}
      {isNotificationDropdownOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
          <div className={`absolute top-0 right-0 w-full max-w-sm h-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
            {/* Header */}
            <div className={`px-4 py-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Notifications
                </h3>
                <button 
                  onClick={toggleNotificationDropdown}
                  className={`p-2 rounded-lg ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-4 border-l-4 transition-colors ${
                    notification.unread 
                      ? (isDarkMode ? 'bg-gray-700/30 border-blue-500' : 'bg-blue-50 border-blue-500') 
                      : (isDarkMode ? 'border-transparent hover:bg-gray-700/30' : 'border-transparent hover:bg-gray-50')
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Avatar with Icon Badge */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={notification.avatar}
                        alt={notification.user}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'} ring-2 ${isDarkMode ? 'ring-gray-800' : 'ring-white'}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        <span className="font-semibold">{notification.user}</span>
                        <span className="ml-1">{notification.action}</span>
                      </div>
                      {notification.content && (
                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {notification.content}
                        </p>
                      )}
                      <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {notification.time}
                      </p>
                    </div>

                    {/* Unread Indicator */}
                    {notification.unread && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className={`px-4 py-3 border-t text-center ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button className={`text-sm font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}>
                See all notifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay for dropdowns */}
      {isProfileDropdownOpen && !isNotificationDropdownOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsProfileDropdownOpen(false)}
        />
      )}
    </>
  );
};

export default UpperNavbar;