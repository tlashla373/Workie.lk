import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Eye, Trash2, Settings } from 'lucide-react';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import socketService from '../../services/socketService';
import authService from '../../services/authService';

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const dropdownRef = useRef(null);
  const { isDarkMode } = useDarkMode();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    loading
  } = useNotifications();

  // Ensure socket connection when component mounts
  useEffect(() => {
    if (authService.isAuthenticated() && !socketService.isConnected) {
      console.log('Notification component: Ensuring socket connection...');
      socketService.connect();
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  // Get user profile image or fallback
  const getUserProfileImage = (notification) => {
    // Check if notification has sender info with profile image
    if (notification.sender?.profileImage || notification.sender?.profilePicture) {
      return notification.sender.profileImage || notification.sender.profilePicture;
    }
    
    // Check if notification has userInfo with profile image  
    if (notification.userInfo?.profileImage || notification.userInfo?.profilePicture) {
      return notification.userInfo.profileImage || notification.userInfo.profilePicture;
    }
    
    // Check metadata for profile info
    if (notification.metadata?.senderProfileImage) {
      return notification.metadata.senderProfileImage;
    }
    
    return null;
  };

  // Get user name for notification
  const getUserName = (notification) => {
    if (notification.sender) {
      return `${notification.sender.firstName || ''} ${notification.sender.lastName || ''}`.trim();
    }
    
    if (notification.userInfo) {
      return `${notification.userInfo.firstName || ''} ${notification.userInfo.lastName || ''}`.trim();
    }
    
    return 'User';
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'job_application':
        return '💼';
      case 'job_posted':
        return '📝';
      case 'message':
        return '💬';
      case 'connection':
        return '👥';
      case 'review':
        return '⭐';
      case 'payment':
        return '💰';
      case 'system':
        return '⚙️';
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      default:
        return '🔔';
    }
  };

  // Get notification color based on type
  const getNotificationColor = (type) => {
    switch (type) {
      case 'job_application':
        return 'bg-blue-100 border-blue-200';
      case 'job_posted':
        return 'bg-green-100 border-green-200';
      case 'message':
        return 'bg-purple-100 border-purple-200';
      case 'connection':
        return 'bg-orange-100 border-orange-200';
      case 'review':
        return 'bg-yellow-100 border-yellow-200';
      case 'payment':
        return 'bg-emerald-100 border-emerald-200';
      case 'system':
        return 'bg-gray-100 border-gray-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      try {
        await markAsRead(notification.id);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
    // Handle navigation based on notification type
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-colors duration-200 ${
          isDarkMode 
            ? 'hover:bg-gray-700 text-gray-300' 
            : 'hover:bg-gray-100 text-gray-600'
        }`}
        title="Notifications"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-96 rounded-lg shadow-lg border z-50 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          {/* Header */}
          <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-semibold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Notifications
              </h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={async () => {
                      try {
                        await markAllAsRead();
                      } catch (error) {
                        console.error('Failed to mark all as read:', error);
                      }
                    }}
                    className={`text-sm px-2 py-1 rounded transition-colors ${
                      isDarkMode 
                        ? 'text-blue-400 hover:bg-gray-700' 
                        : 'text-blue-600 hover:bg-gray-100'
                    }`}
                    title="Mark all as read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className={`text-sm px-2 py-1 rounded transition-colors ${
                    isDarkMode 
                      ? 'text-gray-400 hover:bg-gray-700' 
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex mt-3 space-x-1">
              {['all', 'unread', 'read'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    filter === filterType
                      ? isDarkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : isDarkMode
                        ? 'text-gray-400 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  {filterType === 'unread' && unreadCount > 0 && (
                    <span className="ml-1 text-xs">({unreadCount})</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto no-scrollbar">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Loading notifications...
                </p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                }`}>
                  <span className="text-2xl">📭</span>
                </div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {filter === 'unread' ? 'No unread notifications' : 
                   filter === 'read' ? 'No read notifications' : 
                   'No notifications yet'}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b cursor-pointer transition-colors ${
                    isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-100 hover:bg-gray-50'
                  } ${!notification.read ? (isDarkMode ? 'bg-gray-750' : 'bg-blue-50') : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    {/* User Profile Image or Fallback Icon */}
                    <div className="flex-shrink-0">
                      {getUserProfileImage(notification) ? (
                        <img
                          src={getUserProfileImage(notification)}
                          alt={getUserName(notification)}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => {
                            // Fallback to icon if image fails to load
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                          getUserProfileImage(notification) ? 'hidden' : 'block'
                        } ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
                        style={{ display: getUserProfileImage(notification) ? 'none' : 'flex' }}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          } ${!notification.read ? 'font-semibold' : ''}`}>
                            {notification.title}
                          </p>
                          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {notification.message}
                          </p>
                          <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();
                              try {
                                await deleteNotification(notification.id);
                              } catch (error) {
                                console.error('Failed to delete notification:', error);
                              }
                            }}
                            className={`p-1 rounded transition-colors ${
                              isDarkMode 
                                ? 'hover:bg-gray-600 text-gray-500' 
                                : 'hover:bg-gray-200 text-gray-400'
                            }`}
                            title="Delete notification"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {filteredNotifications.length > 0 && (
            <div className={`p-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex justify-between">
                <button
                  onClick={async () => {
                    if (window.confirm('Are you sure you want to clear all notifications?')) {
                      try {
                        await clearAllNotifications();
                      } catch (error) {
                        console.error('Failed to clear all notifications:', error);
                      }
                    }
                  }}
                  className={`text-xs px-3 py-2 rounded transition-colors ${
                    isDarkMode 
                      ? 'text-red-400 hover:bg-gray-700' 
                      : 'text-red-600 hover:bg-gray-100'
                  }`}
                >
                  Clear All
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    window.location.href = '/notifications';
                  }}
                  className={`text-xs px-3 py-2 rounded transition-colors ${
                    isDarkMode 
                      ? 'text-blue-400 hover:bg-gray-700' 
                      : 'text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  View All
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
