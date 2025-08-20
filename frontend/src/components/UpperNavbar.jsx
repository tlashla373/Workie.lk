import React, { useState } from 'react';
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
import ChatInterface from './Chat/ChatInterface';

const UpperNavbar = ({ isCollapsed = false }) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const toggleNotificationDropdown = () => setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
  const toggleMobileSearch = () => setIsMobileSearchOpen(!isMobileSearchOpen);

  // Sample notification data
  const notifications = [
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
    },
    {
      id: 3,
      type: 'job',
      user: 'TechCorp',
      action: 'posted a new job that matches your skills',
      content: 'Senior React Developer - Remote',
      time: '6 hours ago',
      unread: false,
      avatar: profileImage,
      icon: Briefcase
    },
    {
      id: 4,
      type: 'friend',
      user: 'Mike Wilson',
      action: 'sent you a friend request',
      content: '',
      time: '1 day ago',
      unread: false,
      avatar: profileImage,
      icon: UserPlus
    },
    {
      id: 5,
      type: 'share',
      user: 'Emily Davis',
      action: 'shared your post',
      content: 'Amazing insights on web development',
      time: '2 days ago',
      unread: false,
      avatar: profileImage,
      icon: Share2
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const pageTitles = {
    '/': 'Home',
    '/postjob': 'Post Job',
    '/post-job': 'Post Job',
    '/friends': 'Friends',
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

          {/* Right Actions */}
          <div className="flex items-center space-x-3 pl-4">
            <Link className="relative" to="/clientprofile">
              <button
                className={`w-full flex items-center space-x-3 p-2 rounded-xl transition-all border duration-200 group ${isDarkMode ? 'bg-gray-700 border-gray-800 hover:bg-gray-600' : 'bg-[#F0F3FF] border-gray-300 hover:bg-gray-400/50'}`}
              >
                <div className="relative">
                  <img
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                    src={profileImage}
                    alt="Profile"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-300"></div>
                </div>
                {(!isCollapsed || isProfileDropdownOpen) && (
                  <div className="flex-1 text-left">
                    <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-black'}`}>Supun Hashintha</p>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-200' : 'text-gray-500'}`}>My Account</p>
                  </div>
                )}
              </button>
            </Link>
            
            <button 
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`p-2 rounded-xl transition-all duration-200 ${isDarkMode ? 'bg-gray-700/50 text-gray-100 hover:bg-gray-700 hover:text-white' : 'bg-gray-700/30 text-gray-100 hover:bg-gray-700/50 hover:text-white'}`}
            >
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
                      <button className={`text-sm ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} transition-colors`}>
                        Mark all as read
                      </button>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto no-scrollbar">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
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
        </div>
      </header>

      {/* Chat Interface */}
      <ChatInterface 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />

      {/* Overlay for mobile */}
      {(isProfileDropdownOpen || isNotificationDropdownOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => {
            setIsProfileDropdownOpen(false);
            setIsNotificationDropdownOpen(false);
          }}
        />
      )}
    </>
  );
};

export default UpperNavbar;